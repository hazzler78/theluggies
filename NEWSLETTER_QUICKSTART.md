# Newsletter Quick Start 🚀

## What It Does

Sends a beautiful newsletter email to all your confirmed subscribers when you release a new YouTube video.

## Setup (One-time)

1. **Add API Key to Cloudflare**
   
   Go to your Cloudflare Workers environment variables and add:
   ```
   NEWSLETTER_API_KEY=<generate-a-random-secret-key>
   ```

2. **Done!** ✅ (RESEND_API_KEY and DB are already configured)

## How to Use (Every new video)

### Step 1: Get Your YouTube Video ID

From your YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

The video ID is: `dQw4w9WgXcQ`

### Step 2: Send the Newsletter

**PowerShell (Windows):**
```powershell
$body = @{
    youtubeId = "YOUR_VIDEO_ID_HERE"
    titleSv = "Swedish title here"
    titleEn = "English title here"
    apiKey = "YOUR_API_KEY_HERE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://theluggies.com/api/newsletter/send" -Method Post -ContentType "application/json" -Body $body
```

**cURL (Mac/Linux):**
```bash
curl -X POST https://theluggies.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeId": "YOUR_VIDEO_ID_HERE",
    "titleSv": "Swedish title here",
    "titleEn": "English title here",
    "apiKey": "YOUR_API_KEY_HERE"
  }'
```

### Step 3: Check Response

You'll get back:
```json
{
  "ok": true,
  "sent": 42,      // Emails successfully sent
  "failed": 0,     // Emails that failed
  "total": 42      // Total subscribers
}
```

## Optional: Add Descriptions

You can add episode descriptions too:

```powershell
$body = @{
    youtubeId = "dQw4w9WgXcQ"
    titleSv = "Blå Luggi lär sig om färger"
    titleEn = "Blue Luggi Learns About Colors"
    descriptionSv = "Följ med på ett färgglatt äventyr!"
    descriptionEn = "Join us on a colorful adventure!"
    apiKey = "YOUR_API_KEY_HERE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://theluggies.com/api/newsletter/send" -Method Post -ContentType "application/json" -Body $body
```

## What Subscribers Get

- 📧 Personalized email with their name
- 🎬 Video thumbnail preview
- ▶️ Big "Watch Now" button
- 🌍 In their preferred language (Swedish or English)
- 🎨 Beautiful gradient design
- 🔗 Unsubscribe link (required)

## Notes

- Only sends to **confirmed subscribers** (those who added their name)
- Takes about 1 second per 10 subscribers
- Safe to run multiple times (won't duplicate if you run twice)
- Check Resend dashboard for delivery status

## Example Real Usage

When you upload "Gula Luggi sjunger om regnbågen" (Yellow Luggi Sings About the Rainbow):

```powershell
$body = @{
    youtubeId = "abc123xyz"
    titleSv = "Gula Luggi sjunger om regnbågen"
    titleEn = "Yellow Luggi Sings About the Rainbow"
    descriptionSv = "En färgglad sång om alla regnbågens färger!"
    descriptionEn = "A colorful song about all the colors of the rainbow!"
    apiKey = $env:NEWSLETTER_API_KEY
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://theluggies.com/api/newsletter/send" -Method Post -ContentType "application/json" -Body $body
```

That's it! 🎉

For more details, see [NEWSLETTER_USAGE.md](./NEWSLETTER_USAGE.md)

