async function triggerNewsletter(env) {
  const timestamp = new Date().toISOString();
  console.log('Newsletter cron triggered at:', timestamp);
  
  try {
    // Get the Pages URL from environment variables
    let pagesUrl = env.PAGES_URL || 'https://theluggies.com';
    const cronSecret = env.CRON_SECRET;
    
    if (!pagesUrl) {
      console.error('PAGES_URL environment variable not set');
      return { success: false, error: 'PAGES_URL not set' };
    }

    // Normalize the URL - remove trailing slashes and ensure it has a protocol
    pagesUrl = pagesUrl.trim();
    if (pagesUrl.endsWith('/')) {
      pagesUrl = pagesUrl.slice(0, -1);
    }
    
    // If no protocol is specified, default to https://
    if (!pagesUrl.match(/^https?:\/\//i)) {
      console.warn('PAGES_URL missing protocol, defaulting to https://');
      pagesUrl = 'https://' + pagesUrl;
    }

    // Validate and construct URL
    let requestUrl;
    try {
      requestUrl = new URL('/api/newsletter/auto-send', pagesUrl);
    } catch (urlError) {
      console.error('Invalid PAGES_URL format:', pagesUrl, urlError);
      return { 
        success: false, 
        error: 'Invalid PAGES_URL format',
        details: `Value: "${env.PAGES_URL || 'not set'}", Error: ${urlError.message}`,
        suggestion: 'PAGES_URL should be a valid URL like "https://theluggies.com" (without trailing slash)'
      };
    }

    if (cronSecret) {
      requestUrl.searchParams.set('secret', cronSecret);
      console.log('CRON_SECRET is set, adding to request URL (secret value hidden for security)');
    } else {
      console.warn('CRON_SECRET not set in cron worker environment; relying on public access');
      console.warn('Note: If Pages project requires CRON_SECRET, this request will fail with 401');
    }
    
    // Log URL without exposing the secret
    const logUrl = requestUrl.toString().replace(/secret=[^&]*/, 'secret=***');
    console.log('Calling Pages API:', logUrl);
    
    // Call the auto-send endpoint on the Pages project
    // Use standard browser-like headers to avoid Cloudflare WAF blocks (error 1003)
    let response;
    try {
      response = await fetch(requestUrl.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare-Worker/1.0; +https://workers.cloudflare.com)',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return { success: false, error: String(fetchError) };
    }
    
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (textError) {
        errorText = `Could not read error response: ${textError}`;
      }
      
      // Log additional details for debugging
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.error('Failed to call Pages API:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        headers: responseHeaders,
        url: requestUrl.toString()
      });
      
      // Provide helpful error messages for common issues
      if (response.status === 403) {
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${errorText}`,
          details: 'Cloudflare is blocking the request (error 1003). This could be due to:',
          suggestions: [
            '1. Check Cloudflare WAF/Firewall rules for your Pages site',
            '2. Verify CRON_SECRET is set correctly in both worker and Pages environment',
            '3. Check if there are IP-based firewall rules blocking Workers',
            '4. Try accessing the URL directly: ' + requestUrl.toString()
          ]
        };
      }
      
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
    
    // Parse JSON response safely
    // Read response as text first (can only read body once)
    let responseText = '';
    try {
      responseText = await response.text();
    } catch (textError) {
      console.error('Could not read response text:', textError);
      return { success: false, error: 'Could not read response' };
    }

    // Try to parse as JSON if content-type suggests it
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const result = JSON.parse(responseText);
        console.log('Newsletter cron result:', JSON.stringify(result, null, 2));
        return { success: true, result };
      } catch (jsonError) {
        console.error('Error parsing response as JSON:', jsonError);
        console.log('Response text:', responseText);
        return { success: false, error: 'Invalid JSON response', response: responseText };
      }
    } else {
      console.log('Newsletter cron response (non-JSON):', responseText);
      return { success: true, response: responseText };
    }
    
  } catch (error) {
    // Catch any unexpected errors
    console.error('Newsletter cron unexpected error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return { success: false, error: String(error), stack: error.stack };
  }
}

const cronWorker = {
  async scheduled(event, env) {
    await triggerNewsletter(env);
  },

  async fetch(request, env) {
    // Handle HTTP requests to the worker (for testing/debugging)
    // This prevents "Worker threw exception" when accessing the worker URL directly
    const url = new URL(request.url);
    
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed',
        message: 'This worker only accepts GET requests'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If requesting root or /trigger, manually trigger the newsletter
    if (url.pathname === '/' || url.pathname === '/trigger') {
      const result = await triggerNewsletter(env);
      return new Response(JSON.stringify({
        message: 'Newsletter trigger executed',
        timestamp: new Date().toISOString(),
        ...result
      }), {
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      // Validate PAGES_URL format
      let pagesUrlValid = false;
      let pagesUrlError = null;
      if (env.PAGES_URL) {
        try {
          let testUrl = env.PAGES_URL.trim();
          if (testUrl.endsWith('/')) {
            testUrl = testUrl.slice(0, -1);
          }
          if (!testUrl.match(/^https?:\/\//i)) {
            testUrl = 'https://' + testUrl;
          }
          new URL('/test', testUrl);
          pagesUrlValid = true;
        } catch (error) {
          pagesUrlError = error.message;
        }
      }

      return new Response(JSON.stringify({
        status: 'ok',
        worker: 'theluggies-newsletter-cron',
        timestamp: new Date().toISOString(),
        configuration: {
          hasPagesUrl: !!env.PAGES_URL,
          pagesUrlValid: pagesUrlValid,
          pagesUrlError: pagesUrlError,
          pagesUrlPreview: env.PAGES_URL ? (env.PAGES_URL.substring(0, 20) + '...') : null,
          hasCronSecret: !!env.CRON_SECRET
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 404 for other paths
    return new Response(JSON.stringify({
      error: 'Not found',
      message: 'This worker handles cron triggers. Use /trigger to manually trigger or /health for status.'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default cronWorker;
