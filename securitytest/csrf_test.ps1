# csrf_test.ps1
$Base = "https://arclight.up.railway.app"
$Endpoint = "/api/change-something"   # state-changing route
$SessionPath = "/session"             # page/endpoint that sets XSRF-TOKEN (change if needed)

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host "== GET session to obtain cookies ==" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri ($Base + $SessionPath) -WebSession $session -ErrorAction Stop
} catch { }

$session.Cookies | Format-Table Name, Value, Domain, Path

# Try POST without token
Write-Host "`n== POST without CSRF token (should fail) ==" -ForegroundColor Cyan
try {
  Invoke-WebRequest -Uri ($Base + $Endpoint) -WebSession $session -Method Post -ContentType "application/json" -Body '{ "foo":"no-token"}' -ErrorAction Stop
  Write-Host "WARNING: Request succeeded without token (check CSRF config)" -ForegroundColor Yellow
} catch { Write-Host "Blocked as expected: $($_.Exception.Response.StatusCode)" -ForegroundColor Green }

# Extract XSRF token if cookie exists (adjust cookie name/header name to your app)
$xsrf = ($session.Cookies | Where-Object { $_.Name -match "XSRF-TOKEN|CSRF" } | Select-Object -First 1).Value
if ($xsrf) {
  Write-Host "`n== POST WITH token in header ==" -ForegroundColor Cyan
  try {
    $ok = Invoke-WebRequest -Uri ($Base + $Endpoint) -WebSession $session -Method Post -ContentType "application/json" -Headers @{ "X-XSRF-TOKEN" = $xsrf } -Body '{ "foo":"with-token"}' -ErrorAction Stop
    Write-Host "Succeeded with token: $($ok.StatusCode)" -ForegroundColor Green
  } catch { Write-Host "Still blocked: $($_.Exception.Response.StatusCode). Check expected header name or SameSite/Origin checks." -ForegroundColor Yellow }
} else {
  Write-Host "No XSRF/CSRF cookie found. If your token is in HTML/meta, scrape it or expose a JSON endpoint for tests." -ForegroundColor Yellow
}
