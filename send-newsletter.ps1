# Newsletter Send Script
# Usage: .\send-newsletter.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$YouTubeId,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('sv','en')]
    [string]$Locale,
    
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://theluggies.com/api/newsletter/send"
)

# Check for API key in environment
if (-not $env:NEWSLETTER_API_KEY) {
    Write-Host "ERROR: NEWSLETTER_API_KEY environment variable not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set it with:" -ForegroundColor Yellow
    Write-Host '  $env:NEWSLETTER_API_KEY = "your-secret-api-key"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or add it to your PowerShell profile for persistence." -ForegroundColor Yellow
    exit 1
}

Write-Host "Preparing to send newsletter..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Video ID: $YouTubeId" -ForegroundColor White
Write-Host "Locale: $Locale" -ForegroundColor White
Write-Host "Title: $Title" -ForegroundColor White

if ($Description) {
    Write-Host "Description: $Description" -ForegroundColor White
}

Write-Host ""
Write-Host "Sending to: $ApiUrl" -ForegroundColor Gray
Write-Host ""

# Build request body
$body = @{
    youtubeId = $YouTubeId
    locale = $Locale
    title = $Title
    apiKey = $env:NEWSLETTER_API_KEY
}

if ($Description) {
    $body.description = $Description
}

$jsonBody = $body | ConvertTo-Json

try {
    # Send the request
    Write-Host "🚀 Sending newsletter..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $ApiUrl `
        -Method Post `
        -ContentType "application/json" `
        -Body $jsonBody `
        -ErrorAction Stop
    
    # Display results
    Write-Host ""
    Write-Host "✅ Newsletter sent successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Cyan
    Write-Host "  ✓ Sent: $($response.sent)" -ForegroundColor Green
    Write-Host "  ✗ Failed: $($response.failed)" -ForegroundColor $(if ($response.failed -gt 0) { "Red" } else { "Gray" })
    Write-Host "  📊 Total: $($response.total)" -ForegroundColor White
    Write-Host ""
    
    if ($response.failed -gt 0) {
        Write-Host "⚠️ Some emails failed to send. Check Resend dashboard for details." -ForegroundColor Yellow
    } else {
        Write-Host "🎉 All emails sent successfully!" -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Error sending newsletter:" -ForegroundColor Red
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

