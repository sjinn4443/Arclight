# cors_tests.ps1
$Base = "https://arclight.up.railway.app"
$Endpoint = "/api/change-something"      # adjust to a state-changing route
$Origins = @("http://localhost:3000","https://your-production.example","https://malicious.example")

foreach ($o in $Origins) {
  Write-Host "`n== OPTIONS with Origin: $o ==" -ForegroundColor Cyan
  try {
    $r = Invoke-WebRequest -Uri ($Base + $Endpoint) -Method Options -Headers @{
      "Origin" = $o
      "Access-Control-Request-Method" = "POST"
      "Access-Control-Request-Headers" = "content-type,x-csrf-token,authorization"
    } -ErrorAction Stop
    $r.StatusCode
    $r.Headers.GetEnumerator() | Where-Object { $_.Key -match "Access-Control-Allow-" } | Format-Table -AutoSize
  } catch {
    Write-Host "Preflight failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      $_.Exception.Response.Headers | Format-Table -AutoSize
    }
  }
}

Write-Host "`n== Cross-origin POST (no token) ==" -ForegroundColor Cyan
try {
  $pr = Invoke-WebRequest -Uri ($Base + $Endpoint) -Method Post -ContentType "application/json" -Headers @{ "Origin" = "https://malicious.example" } -Body '{ "test":"x"}' -ErrorAction Stop
  $pr.StatusCode
} catch { Write-Host "Returned $($_.Exception.Response.StatusCode) as expected (blocked)" -ForegroundColor Yellow }
