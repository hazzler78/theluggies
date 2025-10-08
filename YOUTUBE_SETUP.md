# YouTube Integration Setup

## 🔑 Environment Variables

Add these to your `.env.local` file:

```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 📺 Channel IDs

You need to find your YouTube Channel IDs and update them in `/src/app/api/youtube/videos/route.ts`:

### How to find Channel IDs:

1. **Method 1: From YouTube URL**
   - Go to your YouTube channel
   - Look at the URL: `https://www.youtube.com/@Luggisarna`
   - Use YouTube API to convert handle to Channel ID

2. **Method 2: Using YouTube API**
   ```bash
   curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=Luggisarna&key=YOUR_API_KEY"
   ```

3. **Method 3: From Channel Settings**
   - Go to YouTube Studio
   - Go to Settings > Channel
   - Your Channel ID is shown there

### Update the Channel IDs:

In `/src/app/api/youtube/videos/route.ts`, replace:
```typescript
const CHANNEL_IDS = {
  en: 'UC_XXXXXXXXXXXXXXX', // Replace with @TheLuggies channel ID
  sv: 'UC_XXXXXXXXXXXXXXX'  // Replace with @Luggisarna channel ID
};
```

## 🚀 Features

- ✅ Automatically fetches latest videos from your channels
- ✅ Caches responses for 1 hour to avoid API limits
- ✅ Fallback to static videos if API fails
- ✅ Loading states and error handling
- ✅ Shows publication dates
- ✅ Responsive design

## 🔧 API Endpoint

The integration creates a new API endpoint:
- `GET /api/youtube/videos?locale=en` - Fetches English channel videos
- `GET /api/youtube/videos?locale=sv` - Fetches Swedish channel videos

## 📝 Notes

- Videos are cached for 1 hour to respect YouTube API limits
- If API fails, falls back to static video list
- Shows up to 6 latest videos per channel
- Automatically updates when new videos are published
