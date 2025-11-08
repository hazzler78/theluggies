# 🤖 Newsletter Cron Worker Setup

This document explains how to set up the separate Cloudflare Worker that handles the newsletter automation scheduling.

## Problem

Cloudflare Pages doesn't support cron triggers directly. The original `wrangler.toml` cron configuration won't work for Pages projects.

## Solution

We've created a separate Cloudflare Worker (`newsletter-cron-worker`) that:
1. Runs on a cron schedule (every day at 09:30 and 15:05 Stockholm time, with 5-min backup checks)
2. Calls the Pages project's `/api/newsletter/auto-send` endpoint
3. Handles the YouTube video checking and newsletter sending

## Setup Instructions

### Step 1: Deploy the Cron Worker

```bash
cd newsletter-cron-worker
npm install
npx wrangler deploy
```

### Step 2: Set Environment Variables

In the Cloudflare Dashboard, go to **Workers & Pages** → **theluggies-newsletter-cron** → **Settings** → **Environment Variables**

Add these variables:

```
PAGES_URL=https://theluggies.com
CRON_SECRET=your-random-secret-here
```

**Important:** Use the same `CRON_SECRET` value that you set in your Pages project environment variables.

### Step 3: Verify the Setup

1. **Check Worker is deployed:**
   ```bash
   npx wrangler deployments list
   ```

2. **Test manually:**
   ```bash
   npx wrangler dev
   # Then trigger manually in the browser
   ```

3. **Check logs:**
   ```bash
   npx wrangler tail
   ```

## How It Works

1. **Cron Schedule**: Worker runs every day at:
   - 09:30 and 09:35 Stockholm time (checks Swedish release)
   - 15:05 and 15:10 Stockholm time (checks English release)

2. **API Call**: Worker calls `https://theluggies.com/api/newsletter/auto-send?secret=your-secret`

3. **Pages Processing**: The Pages project handles:
   - YouTube API calls
   - Video detection
   - Newsletter sending
   - Database tracking

## Monitoring

### Check Worker Logs
```bash
cd newsletter-cron-worker
npx wrangler tail
```

### Check Pages Logs
```bash
npx wrangler pages deployment tail --project-name=theluggies
```

### Check Database
```bash
npx wrangler d1 execute newsletter --remote --command "SELECT * FROM newsletter_sent ORDER BY sent_at DESC LIMIT 5"
```

## Troubleshooting

### Worker not running
1. Check if Worker is deployed: `npx wrangler deployments list`
2. Check environment variables are set correctly
3. Check cron schedule in Cloudflare Dashboard

### Pages API not responding
1. Check if Pages project is deployed and running
2. Verify `CRON_SECRET` matches between Worker and Pages
3. Check Pages logs for errors

### No newsletters sent
1. Check total subscribers: `SELECT COUNT(*) FROM newsletter_subscribers`
2. Check if videos were published within the 90-minute window
3. Check if videos were already sent: `SELECT * FROM newsletter_sent`

## Benefits

- ✅ **Separation of concerns**: Pages handles the API, Worker handles scheduling
- ✅ **Reliable**: Cloudflare Workers have excellent cron support
- ✅ **Scalable**: Can easily add more cron jobs or modify schedules
- ✅ **Maintainable**: Clear separation between scheduling and business logic

## File Structure

```
newsletter-cron-worker/
├── src/
│   └── index.js          # Worker code
├── wrangler.toml         # Worker configuration
└── package.json          # Dependencies
```

The main Pages project remains unchanged except for removing the non-functional cron configuration.
