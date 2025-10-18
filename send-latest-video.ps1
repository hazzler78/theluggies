# Send Newsletter for Latest YouTube Video
# This script fetches the latest video from YouTube and sends a newsletter
# Usage: .\send-latest-video.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$Locale = "sv",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://theluggies.com/api/newsletter/send"
)

# Load .env file if it exists
if (Test-Path ".env") {
    Write-Host "Loading environment variables from .env..." -ForegroundColor Gray
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^["'']|["'']$', ''
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host ""
}

Write-Host "Fetching latest YouTube video..." -ForegroundColor Cyan
Write-Host ""

# Check for required environment variables
$requiredVars = @(
    @{Name="YOUTUBE_API_KEY"; Desc="YouTube Data API v3 key"},
    @{Name="NEWSLETTER_API_KEY"; Desc="Newsletter API secret"}
)

$channelVar = if ($Locale -eq "sv") { "YOUTUBE_CHANNEL_ID_SV" } else { "YOUTUBE_CHANNEL_ID_EN" }
$requiredVars += @{Name=$channelVar; Desc="YouTube Channel ID"}

$missing = @()
foreach ($var in $requiredVars) {
    if (-not (Test-Path "env:$($var.Name)")) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing environment variables:" -ForegroundColor Red
    Write-Host ""
    foreach ($var in $missing) {
        Write-Host "  - $($var.Name)" -ForegroundColor Yellow
        Write-Host "    $($var.Desc)" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Set them with:" -ForegroundColor Yellow
    Write-Host '  $env:VARIABLE_NAME = "your-value"' -ForegroundColor Cyan
    exit 1
}

# Get environment variables
$youtubeApiKey = $env:YOUTUBE_API_KEY
$newsletterApiKey = $env:NEWSLETTER_API_KEY
$channelId = if ($Locale -eq "sv") { $env:YOUTUBE_CHANNEL_ID_SV } else { $env:YOUTUBE_CHANNEL_ID_EN }

# Fetch latest video from YouTube
try {
    $youtubeUrl = "https://www.googleapis.com/youtube/v3/search?key=$youtubeApiKey&channelId=$channelId&part=snippet&order=date&maxResults=1&type=video"
    
    $ytResponse = Invoke-RestMethod -Uri $youtubeUrl -Method Get -ErrorAction Stop
    
    if (-not $ytResponse.items -or $ytResponse.items.Count -eq 0) {
        Write-Host "No videos found on channel" -ForegroundColor Red
        exit 1
    }
    
    $video = $ytResponse.items[0]
    $videoId = $video.id.videoId
    $title = $video.snippet.title
    $description = $video.snippet.description
    $publishedAt = [DateTime]::Parse($video.snippet.publishedAt)
    
    Write-Host "Found video:" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Video ID: $videoId" -ForegroundColor White
    Write-Host "  Title: $title" -ForegroundColor White
    Write-Host "  Published: $($publishedAt.ToString('yyyy-MM-dd HH:mm'))" -ForegroundColor White
    Write-Host "  URL: https://youtube.com/watch?v=$videoId" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask for confirmation
    $confirm = Read-Host "Send newsletter for this video? (y/n)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Cancelled" -ForegroundColor Yellow
        exit 0
    }
    
} catch {
    Write-Host "Error fetching from YouTube:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Sending newsletter..." -ForegroundColor Cyan
Write-Host ""

# Build request body
$body = @{
    youtubeId = $videoId
    titleSv = $title
    titleEn = $title
    descriptionSv = $description
    descriptionEn = $description
    apiKey = $newsletterApiKey
} | ConvertTo-Json

try {
    # Send newsletter
    $response = Invoke-RestMethod -Uri $ApiUrl `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    # Display results
    Write-Host ""
    Write-Host "Newsletter sent successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Cyan
    Write-Host "  Sent: $($response.sent)" -ForegroundColor Green
    Write-Host "  Failed: $($response.failed)" -ForegroundColor $(if ($response.failed -gt 0) { "Red" } else { "Gray" })
    Write-Host "  Total: $($response.total)" -ForegroundColor White
    Write-Host ""
    
    if ($response.failed -gt 0) {
        Write-Host "Some emails failed to send. Check Resend dashboard for details." -ForegroundColor Yellow
    } else {
        Write-Host "All emails sent successfully!" -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "Error sending newsletter:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 401) {
            Write-Host "This usually means your API key is incorrect or not set in Cloudflare." -ForegroundColor Yellow
        }
    }
    
    exit 1
}
