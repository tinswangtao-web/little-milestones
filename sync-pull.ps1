$ErrorActionPreference = "Stop"

Write-Host "Pull latest changes from GitHub..." -ForegroundColor Cyan
git pull origin main

if ($LASTEXITCODE -ne 0) {
  Write-Host "Pull failed. Resolve conflicts first." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Pull completed." -ForegroundColor Green
