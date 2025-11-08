# ✅ Automation Setup Checklist

Follow these steps to enable automatic newsletter sending when you publish YouTube videos.

## Prerequisites

- [ ] You have a YouTube API key
- [ ] You know your YouTube channel ID(s)
- [ ] You have access to Cloudflare Dashboard
- [ ] You have `RESEND_API_KEY` and `NEWSLETTER_API_KEY` already configured

## Setup Steps

### 1. Run Database Migration

```powershell
cd theluggies-web
npx wrangler d1 execute newsletter --remote --file=./migrations/0002_create_newsletter_sent_table.sql
```

**Expected output:** `Successfully executed SQL`

---

### 2. Get YouTube API Key

1. Go to: https://console.cloud.google.com/
2. Create/select project
3. Enable "YouTube Data API v3"
4. Credentials → Create Credentials → API Key
5. Copy the key (starts with `AIza...`)

**Save it:** `YOUTUBE_API_KEY=AIza...`

---

### 3. Get YouTube Channel ID(s)

#### Swedish Channel
1. Go to your Swedish YouTube channel
2. Click "About" tab
3. Click "Share channel" → Copy channel ID
4. Should look like: `UCxxxxxxxxxxxxxxxxxxx`

**Save it:** `YOUTUBE_CHANNEL_ID_SV=UCxxx...`

#### English Channel
- If same channel: use same ID
- If different: repeat above steps

**Save it:** `YOUTUBE_CHANNEL_ID_EN=UCxxx...`

---

### 4. (Optional) Generate Cron Secret

For extra security when manually testing:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Save it:** `CRON_SECRET=your-random-secret`

**Note:** Cloudflare Cron triggers work automatically without a secret (they're authenticated via the `CF-Cron` header). The secret is only needed for manual API testing.

---

### 5. Add Environment Variables to Cloudflare

1. Go to: https://dash.cloudflare.com/
2. Workers & Pages → **theluggies** → Settings → Environment Variables
3. Click "Add variable" for each:

```
YOUTUBE_API_KEY=AIza...
YOUTUBE_CHANNEL_ID_SV=UCxxx...
YOUTUBE_CHANNEL_ID_EN=UCxxx...
CRON_SECRET=xxx... (optional)
```

4. Click "Save and Deploy"

---

### 6. Deploy Code

```powershell
git add -A
git commit -m "feat: add automated newsletter cron"
git push
```

Wait for Cloudflare to deploy (2-3 minutes).

---

### 7. Verify Cron Triggers

1. Go to Cloudflare Dashboard
2. Workers & Pages → theluggies → Triggers
3. You should see:
   - `30 8 * * 6` (Saturdays at 09:30 Stockholm time)
   - `5 14 * * 6` (Saturdays at 15:05 Stockholm time)

---

### 8. Test Manually (Optional)

```powershell
# Test the auto-send endpoint
curl "https://theluggies.com/api/newsletter/auto-send?secret=YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "ok": true,
  "results": [...],
  "timestamp": "2025-10-09T..."
}
```

---

## ✅ Done!

Now when you:
1. **Publish a video at 09:00** → Newsletter sent at 09:30 ✅
2. **Publish a video at 15:00** → Newsletter sent at 15:05 ✅

## Monitoring

### Check if it worked:

```powershell
# See sent newsletters
npx wrangler d1 execute newsletter --remote --command "SELECT youtube_id, title_sv, sent_at, recipients_count FROM newsletter_sent ORDER BY sent_at DESC LIMIT 5"
```

### Check logs:

```powershell
npx wrangler tail
```

Or in Cloudflare Dashboard → Workers & Pages → theluggies → Logs

---

## Troubleshooting

### Cron not running?
- Check Cloudflare Dashboard → Triggers
- Verify wrangler.toml has cron configuration
- Check environment variables are set

### Newsletter not sending?
- Check video was published within last 30 minutes of cron run
- Verify YOUTUBE_CHANNEL_ID is correct
- Test YouTube API: `https://www.googleapis.com/youtube/v3/search?key=YOUR_KEY&channelId=YOUR_CHANNEL&part=snippet&order=date&maxResults=1`

### Already sent error?
- This is good! Means duplicate prevention is working
- Check database: video already in `newsletter_sent` table

---

## Need Help?

See detailed documentation:
- [NEWSLETTER_AUTOMATION.md](./NEWSLETTER_AUTOMATION.md) - Full automation guide
- [NEWSLETTER_USAGE.md](./NEWSLETTER_USAGE.md) - API documentation
- [README_NEWSLETTER.md](./README_NEWSLETTER.md) - Overview

---

**Questions?** Check the logs or test the endpoint manually to see what's happening!

