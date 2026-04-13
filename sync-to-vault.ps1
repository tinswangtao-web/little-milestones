# Little Milestones - Sync to Obsidian Vault
# Run this script on Windows after pulling the latest changes from the repo.
# Double-click or run in PowerShell: .\sync-to-vault.ps1

$VaultPath = "C:\Users\FinalHome\Documents\Obsidian Vault"
$PluginId  = "little-milestones"
$PluginDir = "$VaultPath\.obsidian\plugins\$PluginId"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Files to copy
$Files = @("main.js", "styles.css", "manifest.json")

Write-Host "Little Milestones - Sync to Obsidian Vault" -ForegroundColor Cyan
Write-Host "Target: $PluginDir" -ForegroundColor Gray

# Create plugin directory if it doesn't exist
if (-not (Test-Path $PluginDir)) {
    New-Item -ItemType Directory -Path $PluginDir -Force | Out-Null
    Write-Host "Created plugin directory." -ForegroundColor Yellow
}

# Copy each file
foreach ($file in $Files) {
    $src = Join-Path $ScriptDir $file
    $dst = Join-Path $PluginDir $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "  Missing: $file (skipped)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! Please reload the plugin in Obsidian:" -ForegroundColor Cyan
Write-Host "  Settings -> Community plugins -> Little Milestones -> Disable then Enable" -ForegroundColor Gray
Write-Host ""
pause
