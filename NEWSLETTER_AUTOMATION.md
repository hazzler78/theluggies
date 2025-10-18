# 🤖 Newsletter Automation Setup

Automatically send newsletters when you publish new YouTube videos!

## How It Works

1. **You publish video** on YouTube at 09:00 (Swedish) or 15:00 (English)
2. **Cloudflare Cron runs** at 09:05 and 15:05 every Saturday
3. **System checks YouTube** for videos published in last 30 minutes
4. **Newsletter sent automatically** to all confirmed subscribers
5. **Video tracked** in database to prevent duplicate sends

## 🔧 Setup (One-Time)

### Step 1: Run Database Migration

First, apply the new database migration:

```bash
npx wrangler d1 execute newsletter --remote --file=./migrations/0002_create_newsletter_sent_table.sql
```

This creates the `newsletter_sent` table to track which videos we've already sent.

### Step 2: Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. Copy the API key

### Step 3: Get Your YouTube Channel IDs

**For Swedish Channel:**
1. Go to your YouTube channel
2. Look at the URL: `youtube.com/channel/UC...` or `youtube.com/@username`
3. If it's `@username`, go to channel → About → Share Channel → Copy Channel ID

**For English Channel:**
- Same process if you have a separate channel
- If same channel for both: use same ID for both

### Step 4: Add Environment Variables to Cloudflare

Go to **Cloudflare Dashboard** → **Workers & Pages** → **theluggies** → **Settings** → **Environment Variables**

Add these:

```
RESEND_API_KEY=re_... (already have this)
NEWSLETTER_API_KEY=... (already have this)
YOUTUBE_API_KEY=AIza...
YOUTUBE_CHANNEL_ID_SV=UC...
YOUTUBE_CHANNEL_ID_EN=UC... (or same as SV if one channel)
CRON_SECRET=your-random-secret (optional but recommended)
```

### Step 5: Deploy

```powershell
git add -A
git commit -m "feat: add automated newsletter cron"
git push
```

Cloudflare will automatically deploy the changes including the cron triggers.

## 📅 Cron Schedule

The system runs twice every Saturday:

- **09:05 Stockholm time** (checks for Swedish videos)
- **15:05 Stockholm time** (checks for English videos)

**Note:** Cron times are in UTC, so they're configured as:
- `5 8 * * 6` = 08:05 UTC (09:05 CET) in winter
- `5 14 * * 6` = 14:05 UTC (15:05 CET) in winter

⚠️ **Daylight Saving Time**: You may need to adjust these times when DST changes.

## 🔍 How Video Detection Works

The cron job:
1. Fetches the latest video from your YouTube channel(s)
2. Checks if it was published in the **last 30 minutes**
3. Checks if we've already sent a newsletter for this video ID
4. If new video found, sends newsletter to all confirmed subscribers
5. Records the video ID in database to prevent duplicates

## ✅ Testing

You can manually trigger the cron to test:

```bash
curl "https://theluggies.com/api/newsletter/auto-send?secret=your-cron-secret"
```

Or test locally:

```bash
npx wrangler dev
# Then visit: http://localhost:8787/api/newsletter/auto-send?secret=your-cron-secret
```

## 📊 Monitoring

### Check Logs

```bash
npx wrangler tail
```

### Check Sent Newsletters

Query your database:

```bash
npx wrangler d1 execute newsletter --remote --command "SELECT * FROM newsletter_sent ORDER BY sent_at DESC LIMIT 10"
```

### Cloudflare Dashboard

- Go to Workers & Pages → theluggies → Logs
- See when cron runs and what it finds

## 🎯 What Gets Sent

Each newsletter includes:
- ✅ Video thumbnail from YouTube
- ✅ Video title (from YouTube metadata)
- ✅ Video description (from YouTube metadata)
- ✅ "Watch Now" button linking to video
- ✅ Personalized greeting with subscriber's name
- ✅ Localized content based on subscriber preference

## 🔐 Security

- **CRON_SECRET**: Optional but recommended for manual testing. The system automatically recognizes Cloudflare Cron triggers via the `CF-Cron` header, so the secret is only required for manual API calls
- **NEWSLETTER_API_KEY**: Required for sending emails
- **API Keys**: Never exposed in client-side code

### How Authorization Works

The system accepts requests in two ways:
1. **Cloudflare Cron Triggers** (automatic): Recognized by the `CF-Cron` header - no secret needed
2. **Manual API calls**: Require `?secret=your-cron-secret` parameter

## 🐛 Troubleshooting

### Newsletter not sending automatically

1. **Check cron is running**
   - Cloudflare Dashboard → Workers → theluggies → Triggers
   - Should see cron triggers listed

2. **Check environment variables**
   ```bash
   # All these must be set:
   - YOUTUBE_API_KEY
   - YOUTUBE_CHANNEL_ID_SV or YOUTUBE_CHANNEL_ID_EN
   - NEWSLETTER_API_KEY
   - RESEND_API_KEY
   ```

3. **Check video timing**
   - Video must be published within last 30 minutes
   - Cron runs at 09:05 and 15:05
   - If you publish at 09:00, it will be caught at 09:05 ✅

4. **Check database**
   ```bash
   # See if video was already sent
   npx wrangler d1 execute newsletter --remote --command "SELECT * FROM newsletter_sent"
   ```

5. **Check YouTube API**
   - Verify API key is valid
   - Check quota hasn't been exceeded
   - Test with: `https://www.googleapis.com/youtube/v3/search?key=YOUR_KEY&channelId=YOUR_CHANNEL&part=snippet&order=date&maxResults=1`

### Wrong channel being checked

- Verify `YOUTUBE_CHANNEL_ID_SV` and `YOUTUBE_CHANNEL_ID_EN` are correct
- Channel IDs should start with `UC` and be 24 characters
- Test by visiting: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`

### Duplicate newsletters sent

- Should be impossible due to database tracking
- Check `newsletter_sent` table for duplicates
- Each `youtube_id` can only be sent once

## 🚀 Advanced Options

### Change Detection Window

Currently checks for videos published in **last 30 minutes**. To change:

Edit `src/app/api/newsletter/auto-send/route.ts`:
```typescript
if (videoSv && isRecentlyPublished(videoSv.publishedAt, 60)) { // 60 minutes
```

### Change Cron Schedule

Edit `wrangler.toml`:
```toml
crons = [
  "5 8 * * 6",   # Every Saturday at 08:05 UTC
  "5 14 * * 6"   # Every Saturday at 14:05 UTC
]
```

Cron format: `minute hour day-of-month month day-of-week`

### Multiple Checks Per Day

Add more cron times:
```toml
crons = [
  "5 8 * * 6",   # 09:05
  "10 8 * * 6",  # 09:10 (backup check)
  "5 14 * * 6",  # 15:05
  "10 14 * * 6"  # 15:10 (backup check)
]
```

## 📝 Manual Override

You can still manually send newsletters using the original method:

```powershell
.\send-newsletter.ps1 -YouTubeId "abc123" -TitleSv "Title" -TitleEn "Title"
```

This bypasses the automation and sends immediately.

## 🎉 Benefits

- ✅ **Zero manual work** - Publish video, newsletter sends automatically
- ✅ **No duplicates** - Database tracking prevents re-sending
- ✅ **Reliable** - Cloudflare's infrastructure ensures it runs
- ✅ **Logged** - Full logs of what was checked and sent
- ✅ **Safe** - Only sends to confirmed subscribers
- ✅ **Smart** - Uses actual YouTube metadata (title, description)

---

Need help? Check the logs or test manually to see what the cron is finding!

