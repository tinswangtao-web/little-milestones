# sync-to-vault.ps1
# Copies plugin files to the local Obsidian vault and pushes to Android emulator.
# Called automatically by Claude Code PostToolUse hook after each edit.

$SrcDir    = "C:\Users\FinalHome\Documents\Cursor\obsidianplugins\obsidian-little-milestones"
$DstDir    = "C:\Users\FinalHome\Documents\Obsidian Vault\.obsidian\plugins\little-milestones"
$AdbExe    = "C:\Users\FinalHome\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$AdbDstDir = "/sdcard/Documents/Obsidian Vault/.obsidian/plugins/little-milestones"

$Files = @("main.js", "styles.css", "manifest.json")

# ── 1. Sync to local Vault ──
foreach ($f in $Files) {
    $src = Join-Path $SrcDir $f
    $dst = Join-Path $DstDir $f
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
    }
}
Write-Host "[little-milestones] synced to local vault" -ForegroundColor Green

# ── 2. Push to Android emulator (if running) ──
if (Test-Path $AdbExe) {
    $devices = & $AdbExe devices 2>$null | Select-String "emulator"
    if ($devices) {
        foreach ($f in $Files) {
            $src = Join-Path $SrcDir $f
            if (Test-Path $src) {
                & $AdbExe push $src "$AdbDstDir/$f" 2>$null | Out-Null
            }
        }
        Write-Host "[little-milestones] pushed to Android emulator" -ForegroundColor Cyan
    }
}
