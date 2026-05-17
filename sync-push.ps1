$ErrorActionPreference = "Stop"

param(
  [string]$Message = ""
)

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "sync: update plugin (" + (Get-Date -Format "yyyy-MM-dd HH:mm") + ")"
}

Write-Host "Staging changes..." -ForegroundColor Cyan
git add -A

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No changes to commit." -ForegroundColor Yellow
  exit 0
}

Write-Host "Committing..." -ForegroundColor Cyan
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
  Write-Host "Commit failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Push completed." -ForegroundColor Green
