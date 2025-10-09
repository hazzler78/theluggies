# Newsletter System - Usage Guide

## Overview

The newsletter system allows you to send beautiful, personalized emails to all confirmed subscribers whenever you release a new YouTube video.

## Setup

### 1. Environment Variable

Add this to your Cloudflare Workers environment variables:

```
NEWSLETTER_API_KEY=your-secret-api-key-here
```

⚠️ **Important**: Generate a strong, random API key and keep it secret. This protects your newsletter endpoint from unauthorized use.

### 2. Existing Variables (already configured)

- `RESEND_API_KEY` - For sending emails via Resend
- `DB` - D1 Database binding for subscriber data

## How to Send a Newsletter

### API Endpoint

**POST** `/api/newsletter/send`

### Request Format

```json
{
  "youtubeId": "dQw4w9WgXcQ",
  "titleSv": "Blå Luggi lär sig om färger",
  "titleEn": "Blue Luggi Learns About Colors",
  "descriptionSv": "Följ med Blå Luggi på ett färgglatt äventyr! I dagens avsnitt upptäcker vi färger genom musik och glädje.",
  "descriptionEn": "Join Blue Luggi on a colorful adventure! In today's episode, we discover colors through music and joy.",
  "apiKey": "your-secret-api-key-here"
}
```

### Required Fields

- **youtubeId** - The YouTube video ID (from the URL)
- **titleSv** - Swedish title for the episode
- **titleEn** - English title for the episode
- **apiKey** - Your secret API key for authentication

### Optional Fields

- **descriptionSv** - Swedish description (optional)
- **descriptionEn** - English description (optional)

## Examples

### Using cURL

```bash
curl -X POST https://theluggies.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeId": "dQw4w9WgXcQ",
    "titleSv": "Blå Luggi lär sig om färger",
    "titleEn": "Blue Luggi Learns About Colors",
    "descriptionSv": "Ett färgglatt äventyr med musik!",
    "descriptionEn": "A colorful adventure with music!",
    "apiKey": "your-secret-api-key-here"
  }'
```

### Using JavaScript/Node.js

```javascript
const response = await fetch('https://theluggies.com/api/newsletter/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    youtubeId: 'dQw4w9WgXcQ',
    titleSv: 'Blå Luggi lär sig om färger',
    titleEn: 'Blue Luggi Learns About Colors',
    descriptionSv: 'Ett färgglatt äventyr med musik!',
    descriptionEn: 'A colorful adventure with music!',
    apiKey: process.env.NEWSLETTER_API_KEY
  })
});

const result = await response.json();
console.log(result);
// { ok: true, sent: 42, failed: 0, total: 42 }
```

### Using PowerShell (Windows)

```powershell
$body = @{
    youtubeId = "dQw4w9WgXcQ"
    titleSv = "Blå Luggi lär sig om färger"
    titleEn = "Blue Luggi Learns About Colors"
    descriptionSv = "Ett färgglatt äventyr med musik!"
    descriptionEn = "A colorful adventure with music!"
    apiKey = $env:NEWSLETTER_API_KEY
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://theluggies.com/api/newsletter/send" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Response Format

### Success Response

```json
{
  "ok": true,
  "sent": 42,
  "failed": 0,
  "total": 42
}
```

- **sent** - Number of emails successfully sent
- **failed** - Number of emails that failed to send
- **total** - Total number of confirmed subscribers

### Error Responses

**401 Unauthorized** - Invalid API key
```json
{
  "ok": false,
  "error": "Unauthorized"
}
```

**500 Server Error** - Database or email service not configured
```json
{
  "ok": false,
  "error": "Database not configured"
}
```

**400 Bad Request** - Invalid request format
```json
{
  "ok": false,
  "error": "Validation error message"
}
```

## Email Features

The newsletter email includes:

- 📧 **Personalized greeting** - Uses subscriber's name if provided
- 🎬 **Video thumbnail** - High-quality preview image
- ▶️ **Watch button** - Direct link to YouTube video
- 🌍 **Localized content** - Swedish (sv) or English (en) based on subscriber preference
- 🎨 **Beautiful design** - Gradient header, responsive layout
- 🔗 **Unsubscribe link** - Required footer link

## Workflow Suggestions

### Manual Trigger (Recommended to start)

1. Upload your video to YouTube
2. Wait for it to process and go live
3. Call the newsletter API with video details
4. Monitor the response to see how many emails were sent

### Automated Trigger (Future enhancement)

- Set up a YouTube webhook to auto-trigger newsletter sends
- Use Cloudflare Cron Triggers to check for new videos
- Integrate with your video upload workflow

## Rate Limiting

The endpoint includes a 100ms delay between emails to avoid rate limiting from Resend. For larger subscriber lists, this means:

- 100 subscribers = ~10 seconds
- 500 subscribers = ~50 seconds
- 1000 subscribers = ~100 seconds

## Subscriber Requirements

Emails are only sent to subscribers who:
- ✅ Have confirmed their subscription (confirmed = 1)
- ✅ Are still in the database (haven't unsubscribed)

Subscribers who signed up but never confirmed their name will NOT receive newsletters.

## Testing

To test without sending to all subscribers, you can:

1. Create a test endpoint that sends to a specific email
2. Temporarily modify the query to filter by your test email
3. Use a staging environment with test data

## Security Best Practices

- 🔒 Never commit API keys to version control
- 🔐 Store `NEWSLETTER_API_KEY` only in Cloudflare Workers environment
- 📝 Rotate the API key if it's ever exposed
- 🚫 Don't share the API key in documentation or emails
- ✅ Use environment variables in your scripts

## Troubleshooting

### No emails received?

1. Check that subscribers have `confirmed = 1` in the database
2. Verify `RESEND_API_KEY` is configured correctly
3. Check Resend dashboard for delivery logs
4. Verify email addresses are valid

### "Unauthorized" error?

- Ensure `NEWSLETTER_API_KEY` is set in Cloudflare Workers
- Check that you're sending the correct API key in the request

### Rate limiting errors?

- The 100ms delay should prevent most rate limiting
- If still hitting limits, increase the delay in the code
- Check your Resend plan limits

## Support

For issues or questions:
- Check Cloudflare Workers logs
- Review Resend email delivery logs
- Verify database subscriber records

