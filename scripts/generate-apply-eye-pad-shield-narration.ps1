param(
  [Parameter(Mandatory=$true)][string]$Python,
  [string]$ChichewaDub = 'tmp/chichewa-mp4-batch/paced-8.ny.m4a'
)
$ErrorActionPreference = 'Stop'
$rootDir = Split-Path $PSScriptRoot -Parent
$delivery = Join-Path $rootDir 'public/narration/apply-eye-pad-shield/full-animation'
$workDir = Join-Path $rootDir 'tmp/apply-eye-pad-narration/neural'
$generator = Join-Path $PSScriptRoot 'generate-fundal-narration.py'
& $Python $generator --script (Join-Path $delivery 'script.json') --work-dir $workDir --public-dir $delivery --tts-only --languages en ko ur
if ($LASTEXITCODE -ne 0) { throw 'Speech synthesis failed.' }
& $Python (Join-Path $PSScriptRoot 'mix-apply-eye-pad-narration.py') --neural-cues (Join-Path $workDir 'cues') --chichewa $ChichewaDub
if ($LASTEXITCODE -ne 0) { throw 'Narration mixing failed.' }
