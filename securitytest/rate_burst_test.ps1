# rate_burst_test.ps1
param([int]$Total=200, [int]$Concurrency=50, [string]$Endpoint="/api/some-endpoint")

$Base = "https://arclight.up.railway.app"
$Uri  = $Base.TrimEnd('/') + $Endpoint
Write-Host "Target: $Uri  Total: $Total  Concurrency: $Concurrency" -ForegroundColor Cyan

$sem = [System.Threading.SemaphoreSlim]::new($Concurrency, $Concurrency)
$bag = [System.Collections.Concurrent.ConcurrentBag[string]]::new()
$jobs = @()

1..$Total | ForEach-Object {
  $null = $sem.Wait()
  $jobs += [System.Threading.Tasks.Task]::Run({
      try {
        $wc = New-Object System.Net.Http.HttpClient
        $resp = $wc.GetAsync($using:Uri).GetAwaiter().GetResult()
        $bag.Add([string]$resp.StatusCode.value__)
      } catch {
        $bag.Add("ERR")
      } finally {
        $sem.Release() | Out-Null
      }
  })
}

[System.Threading.Tasks.Task]::WaitAll($jobs)

$bag | Group-Object | Sort-Object Count -Descending | ForEach-Object {
  "{0,5}  {1}" -f $_.Count, $_.Name
}

Write-Host "`nSample headers:" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri $Uri -Method Get -ErrorAction Stop
  $r.Headers.GetEnumerator() | Where-Object { $_.Key -match "Retry-After|X-RateLimit" } | Format-Table -AutoSize
} catch { "Request failed." }
