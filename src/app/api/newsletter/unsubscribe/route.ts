export const runtime = 'edge';

import {getRequestContext} from '@cloudflare/next-on-pages';

interface CloudflareEnv {
  DB: D1Database;
}

export async function POST(request: Request) {
  try {
    const context = getRequestContext();
    const env = context.env as CloudflareEnv;
    
    if (!env.DB) {
      return new Response('Database not available', { status: 500 });
    }

    const { email } = await request.json() as { email: string };

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    // Do not leak whether an email exists; attempt unsubscribe idempotently
    await env.DB
      .prepare("UPDATE newsletter_subscribers SET confirmed = 0, updated_at = datetime('now') WHERE email = ?")
      .bind(email)
      .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'If this email was subscribed, it has been unsubscribed.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return new Response('Email parameter is required', { status: 400 });
    }

    // Return unsubscribe page with email pre-filled
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe - The Luggies</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 400px;
              width: 100%;
              text-align: center;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
              font-size: 24px;
            }
            p {
              color: #666;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .email {
              background: #f5f5f5;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 500;
              color: #333;
            }
            button {
              background: #ff4757;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              transition: background 0.2s;
              width: 100%;
            }
            button:hover {
              background: #ff3742;
            }
            .success {
              color: #2ed573;
              font-weight: 500;
            }
            .error {
              color: #ff4757;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unsubscribe</h1>
            <p>Are you sure you want to unsubscribe from The Luggies newsletter?</p>
            <div class="email">${email}</div>
            <button onclick="unsubscribe()">Yes, Unsubscribe</button>
            <div id="result"></div>
          </div>
          
          <script>
            async function unsubscribe() {
              const button = document.querySelector('button');
              const result = document.getElementById('result');
              
              button.disabled = true;
              button.textContent = 'Unsubscribing...';
              
              try {
                const response = await fetch('/api/newsletter/unsubscribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: '${email}' })
                });
                
                if (response.ok) {
                  result.innerHTML = '<p class="success">✓ You have been unsubscribed.</p>';
                  button.style.display = 'none';
                } else {
                  const error = await response.text();
                  result.innerHTML = '<p class="error">✗ ' + error + '</p>';
                  button.disabled = false;
                  button.textContent = 'Yes, Unsubscribe';
                }
              } catch (error) {
                result.innerHTML = '<p class="error">✗ Something went wrong. Please try again.</p>';
                button.disabled = false;
                button.textContent = 'Yes, Unsubscribe';
              }
            }
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe page error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
