# ================================================================
# inject_voters.ps1
# Opens a file picker → cleans MySQL dump → injects into seed.sql
# Just double-click or run:  .\inject_voters.ps1
# ================================================================

Add-Type -AssemblyName System.Windows.Forms

# ── 1. Open file picker dialog ───────────────────────────────────
$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Title  = "Select your voter dump .sql file"
$dialog.Filter = "SQL files (*.sql)|*.sql|All files (*.*)|*.*"
$dialog.InitialDirectory = [Environment]::GetFolderPath("Desktop")

$result = $dialog.ShowDialog()
if ($result -ne [System.Windows.Forms.DialogResult]::OK) {
    Write-Host "❌ No file selected. Exiting." -ForegroundColor Red
    exit 1
}

$DumpFile = $dialog.FileName
$SeedFile = Join-Path $PSScriptRoot "seed.sql"

Write-Host "📂 Reading: $DumpFile" -ForegroundColor Cyan

# ── 2. Extract INSERT lines only ─────────────────────────────────
$rawLines = Get-Content $DumpFile -Encoding UTF8
$insertLines = $rawLines | Where-Object { $_ -match '^\s*INSERT\s+INTO' }

if ($insertLines.Count -eq 0) {
    Write-Host "❌ No INSERT statements found in the file." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $($insertLines.Count) INSERT rows" -ForegroundColor Green

# ── 3. Clean MySQL → PostgreSQL syntax ───────────────────────────
$cleanedInserts = $insertLines | ForEach-Object {
    $line = $_
    # Rename the table
    $line = $line -replace '`tableName`',   'voter_staging'
    $line = $line -replace '"tableName"',   'voter_staging'
    $line = $line -replace '\btableName\b', 'voter_staging'
    # Drop all backtick column quoting (MySQL syntax)
    $line = $line -replace '`', ''
    # Normalize whitespace at ends
    $line = $line.TrimEnd()
    if (-not $line.EndsWith(';')) { $line += ';' }
    $line
}

# ── 4. Read seed.sql ─────────────────────────────────────────────
if (-not (Test-Path $SeedFile)) {
    Write-Host "❌ seed.sql not found at: $SeedFile" -ForegroundColor Red
    exit 1
}

$seedContent = Get-Content $SeedFile -Encoding UTF8 -Raw
$marker = '-- (paste all rows here)'

if (-not $seedContent.Contains($marker)) {
    Write-Host "❌ Injection marker not found in seed.sql." -ForegroundColor Red
    exit 1
}

# ── 5. Inject ────────────────────────────────────────────────────
$injectedBlock  = $cleanedInserts -join "`r`n"
$newSeedContent = $seedContent.Replace($marker, "$marker`r`n`r`n$injectedBlock")

# ── 6. Backup + write ────────────────────────────────────────────
$backupFile = $SeedFile -replace '\.sql$', '.backup.sql'
Copy-Item $SeedFile $backupFile -Force
Write-Host "💾 Backup saved → seed.backup.sql" -ForegroundColor DarkGray

Set-Content $SeedFile -Value $newSeedContent -Encoding UTF8

Write-Host ""
Write-Host "🎉 seed.sql updated with $($cleanedInserts.Count) voter rows!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Go to Supabase SQL Editor and run seed.sql" -ForegroundColor Yellow
Write-Host "Then verify:  SELECT COUNT(*) FROM voters_eci;" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close"
