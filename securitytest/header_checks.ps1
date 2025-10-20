# header_checks.ps1
$Base = "https://arclight.up.railway.app"
$Paths = @("/", "/login", "/api/health")

function Check-Headers ($uri, $label) {
    Write-Host "`n== Checking headers for: $label ($uri) ==" -ForegroundColor Cyan
    $headers = @{}
    try {
        $resp = Invoke-WebRequest -Method Head -Uri $uri -ErrorAction SilentlyContinue
        if ($resp.StatusCode -eq 200) {
            $headers = $resp.Headers
        } else {
            Write-Host "HEAD request failed with status $($resp.StatusCode), trying GET..." -ForegroundColor Yellow
            $resp = Invoke-WebRequest -Method Get -Uri $uri -ErrorAction SilentlyContinue
            if ($resp.StatusCode -eq 200) {
                $headers = $resp.Headers
            } else {
                Write-Host "GET request failed with status $($resp.StatusCode)." -ForegroundColor Red
                return
            }
        }
    } catch {
        Write-Host "Request to $uri failed: $($_.Exception.Message)" -ForegroundColor Red
        return
    }

    $relevantHeaders = @(
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Set-Cookie",
        "Access-Control-Allow-Origin",
        "Content-Type",
        "Server",
        "Cache-Control",
        "X-Powered-By"
    )

    $headers.GetEnumerator() | Where-Object { $_.Key -in $relevantHeaders } | Format-Table -AutoSize

    # CSP details
    $csp = $headers["Content-Security-Policy"]
    if (-not $csp) {
        Write-Host "  WARNING: No Content-Security-Policy header detected." -ForegroundColor Yellow
    } else {
        Write-Host "  Content-Security-Policy: $csp"
        if ($csp -match "unsafe-inline") {
            Write-Host "  WARNING: CSP allows 'unsafe-inline'." -ForegroundColor Yellow
        }
        if ($csp -match "script-src\s+[^;]*\*") {
            Write-Host "  WARNING: CSP script-src contains wildcard '*'." -ForegroundColor Yellow
        }
        if ($csp -notmatch "frame-ancestors") {
            Write-Host "  WARNING: CSP does not include 'frame-ancestors' directive." -ForegroundColor Yellow
        }
    }

    # HSTS check
    if (-not $headers["Strict-Transport-Security"]) {
        Write-Host "  WARNING: No Strict-Transport-Security (HSTS) header detected." -ForegroundColor Yellow
    }

    # X-Frame-Options check
    if (-not $headers["X-Frame-Options"]) {
        Write-Host "  WARNING: No X-Frame-Options header detected." -ForegroundColor Yellow
    }

    # Cookie flags
    $rawCookies = $headers["Set-Cookie"]
    if ($rawCookies) {
        $cookies = $rawCookies -split '\n' # Split by newline if multiple cookies are in one string
        Write-Host "  Set-Cookie flags:"
        foreach ($cookie in $cookies) {
            Write-Host "    $cookie"
            if ($cookie -notmatch "Secure") { Write-Host "      WARNING: Cookie missing 'Secure' flag." -ForegroundColor Yellow }
            if ($cookie -notmatch "HttpOnly") { Write-Host "      WARNING: Cookie missing 'HttpOnly' flag." -ForegroundColor Yellow }
            if ($cookie -notmatch "SameSite=(Lax|Strict)") { Write-Host "      WARNING: Cookie missing 'SameSite=Lax' or 'SameSite=Strict' flag." -ForegroundColor Yellow }
        }
    } else {
        Write-Host "  No Set-Cookie headers found."
    }
}

# Run checks for base URL
Check-Headers $Base "Base URL"

# Run checks for specific paths
foreach ($p in $Paths) {
    Check-Headers ($Base.TrimEnd('/') + $p) $p
}

# Quick helper: capture Set-Cookie flags check (one-liner)
Write-Host "`n== Quick helper: Set-Cookie flags check (one-liner) ==" -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $Base -Method Get -ErrorAction Stop | Select-Object -ExpandProperty Headers | Where-Object { $_.Key -eq "Set-Cookie" } | ForEach-Object {
        Write-Host $_.Value
        if ($_.Value -notmatch "Secure") { Write-Host "  WARNING: Cookie missing 'Secure' flag." -ForegroundColor Yellow }
        if ($_.Value -notmatch "HttpOnly") { Write-Host "  WARNING: Cookie missing 'HttpOnly' flag." -ForegroundColor Yellow }
        if ($_.Value -notmatch "SameSite=(Lax|Strict)") { Write-Host "  WARNING: Cookie missing 'SameSite=Lax' or 'SameSite=Strict' flag." -ForegroundColor Yellow }
    }
} catch {
    Write-Host "Failed to fetch Set-Cookie headers: $($_.Exception.Message)" -ForegroundColor Red
}
