param([Parameter(Mandatory=$true)][string]$Python)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
$taskScriptPath = Join-Path $taskRoot 'public/narration/apply-eye-pad-shield/full-animation/script.json'
$taskScript = Get-Content -LiteralPath $taskScriptPath -Raw -Encoding utf8 | ConvertFrom-Json
$taskFfmpeg = Join-Path $taskRoot 'tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
Add-Type -AssemblyName System.Speech
foreach ($taskLanguage in @('en', 'ko')) {
  $taskVoice = if ($taskLanguage -eq 'en') { 'Microsoft Zira Desktop' } else { 'Microsoft Heami Desktop' }
  $taskScript.languages.$taskLanguage.voice = $taskVoice
  $taskCueDir = Join-Path $taskRoot "tmp/apply-eye-pad-narration/cues/$taskLanguage"
  New-Item -ItemType Directory -Force -Path $taskCueDir | Out-Null
  foreach ($taskCue in $taskScript.cues) {
    $taskWave = Join-Path $taskCueDir "$($taskCue.id).wav"
    $taskMp3 = Join-Path $taskCueDir "$($taskCue.id).mp3"
    $taskSpeaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
    try {
      $taskSpeaker.SelectVoice($taskVoice)
      $taskSpeaker.Rate = -1
      $taskSpeaker.SetOutputToWaveFile($taskWave)
      $taskSpeaker.Speak($taskCue.$taskLanguage)
    } finally { $taskSpeaker.Dispose() }
    & $taskFfmpeg -hide_banner -loglevel error -y -i $taskWave $taskMp3
    if ($LASTEXITCODE -ne 0) { throw 'Cue encoding failed' }
  }
}
$taskScript | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $taskScriptPath -Encoding utf8NoBOM
& $Python (Join-Path $PSScriptRoot 'generate-fundal-narration.py') --script $taskScriptPath --work-dir (Join-Path $taskRoot 'tmp/apply-eye-pad-narration') --artifacts-dir (Join-Path $taskRoot '.codex-artifacts/apply-eye-pad/narration') --public-dir (Join-Path $taskRoot 'public/narration/apply-eye-pad-shield/full-animation') --asset-stem apply-eye-pad-shield --skip-review-video --skip-tts
if ($LASTEXITCODE -ne 0) { throw 'Narration mixing failed' }
