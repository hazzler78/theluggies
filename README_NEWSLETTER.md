# 📧 The Luggies Newsletter System

Complete automated newsletter system for notifying subscribers about new YouTube videos.

## 🎯 What It Does

When you release a new YouTube video, you can send a beautiful, personalized newsletter to all your confirmed subscribers in both Swedish and English.

## 📋 Quick Start

### 1️⃣ One-Time Setup

Add this environment variable in your Cloudflare Workers dashboard:

```
NEWSLETTER_API_KEY=<your-secret-key-here>
```

Generate a secure key with:
```bash
openssl rand -base64 32
```

Or on Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 2️⃣ Every New Video Release

#### Option A: Use the PowerShell Script (Easiest!)

```powershell
# Set your API key once per session (or add to profile)
$env:NEWSLETTER_API_KEY = "your-secret-key-here"

# Send the newsletter
.\send-newsletter.ps1 `
  -YouTubeId "abc123xyz" `
  -TitleSv "Blå Luggi lär sig om färger" `
  -TitleEn "Blue Luggi Learns About Colors" `
  -DescriptionSv "Ett färgglatt äventyr!" `
  -DescriptionEn "A colorful adventure!"
```

#### Option B: Manual API Call

```powershell
$body = @{
    youtubeId = "abc123xyz"
    titleSv = "Blå Luggi lär sig om färger"
    titleEn = "Blue Luggi Learns About Colors"
    apiKey = $env:NEWSLETTER_API_KEY
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://theluggies.com/api/newsletter/send" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## 📄 Documentation Files

- **[NEWSLETTER_QUICKSTART.md](./NEWSLETTER_QUICKSTART.md)** - Quick reference guide
- **[NEWSLETTER_USAGE.md](./NEWSLETTER_USAGE.md)** - Complete documentation with all details
- **[send-newsletter.ps1](./send-newsletter.ps1)** - PowerShell script for easy sending

## ✨ Features

### Subscriber Experience
- ✅ **Personalized greeting** with their name
- ✅ **Embedded video thumbnail** from YouTube
- ✅ **Big "Watch Now" button** linking to video
- ✅ **Localized content** (Swedish/English based on preference)
- ✅ **Beautiful gradient design** matching brand
- ✅ **Unsubscribe link** (legally required)

### Technical Features
- ✅ **Secure API key authentication**
- ✅ **Rate limiting protection** (100ms delay between emails)
- ✅ **Error handling and reporting**
- ✅ **Only sends to confirmed subscribers**
- ✅ **Idempotent** (safe to run multiple times)

## 🔐 Security

- API key required for all newsletter sends
- Set in Cloudflare environment (never in code)
- Unauthorized requests return 401 error
- No subscriber data leaked in responses

## 📊 Database Requirements

Subscribers must have:
- ✅ `confirmed = 1` (they added their name)
- ✅ Valid email address
- ✅ Locale preference (sv/en)

New signups without name confirmation won't receive newsletters until they confirm.

## 🎨 Email Template Preview

```
┌──────────────────────────────────────┐
│                                      │
│         The Luggies 🎵               │
│                                      │
│  Hi Name!                            │
│                                      │
│  A new musical adventure is out! 🎉  │
│                                      │
│  Video Title Here                    │
│                                      │
│  [Video Thumbnail Image]             │
│                                      │
│       ▶️ Watch Now                   │
│                                      │
│  We hope you enjoy...                │
│                                      │
│  Best regards,                       │
│  The Luggies Team 🎨                 │
│                                      │
│  ─────────────────────────────       │
│  Unsubscribe | Privacy               │
└──────────────────────────────────────┘
```

## 📈 Expected Performance

- **100 subscribers**: ~10 seconds
- **500 subscribers**: ~50 seconds
- **1000 subscribers**: ~100 seconds

The 100ms delay between emails prevents rate limiting.

## 🐛 Troubleshooting

### "Unauthorized" error
- Check that `NEWSLETTER_API_KEY` is set in Cloudflare
- Verify you're using the correct key in your request

### No emails received
- Verify subscribers have `confirmed = 1` in database
- Check Resend dashboard for delivery logs
- Ensure `RESEND_API_KEY` is configured

### Wrong language
- Subscribers get email in their `locale` preference (sv/en)
- Check database `locale` field for each subscriber

## 🚀 Deployment

The API endpoint is automatically deployed with your Next.js app on Cloudflare Pages.

Location: `/api/newsletter/send`

## 🔄 Future Enhancements

Potential improvements:
- [ ] Automatic detection of new YouTube videos
- [ ] Scheduling newsletters for optimal send times
- [ ] A/B testing different email templates
- [ ] Analytics dashboard for open/click rates
- [ ] Admin UI for manual newsletter composition

## 📝 API Endpoint

**POST** `/api/newsletter/send`

### Request Body
```json
{
  "youtubeId": "abc123xyz",
  "titleSv": "Swedish title",
  "titleEn": "English title",
  "descriptionSv": "Optional Swedish description",
  "descriptionEn": "Optional English description",
  "apiKey": "your-secret-key"
}
```

### Response
```json
{
  "ok": true,
  "sent": 42,
  "failed": 0,
  "total": 42
}
```

## 📞 Support

Check these resources:
- Cloudflare Workers logs
- Resend email delivery dashboard
- D1 Database console for subscriber data

---

Made with ❤️ for The Luggies community

