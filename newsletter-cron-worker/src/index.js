const cronWorker = {
  async scheduled(event, env) {
    console.log('Newsletter cron triggered at:', new Date().toISOString());
    
    try {
      // Get the Pages URL from environment variables
      const pagesUrl = env.PAGES_URL || 'https://theluggies.com';
      const cronSecret = env.CRON_SECRET;
      
      if (!pagesUrl) {
        console.error('PAGES_URL environment variable not set');
        return;
      }
      
      // Call the auto-send endpoint on the Pages project
      const response = await fetch(`${pagesUrl}/api/newsletter/auto-send?secret=${cronSecret}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Cloudflare-Worker-Cron/1.0',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to call Pages API:', response.status, errorText);
        return;
      }
      
      const result = await response.json();
      console.log('Newsletter cron result:', JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error('Newsletter cron error:', error);
    }
  }
};

export default cronWorker;
