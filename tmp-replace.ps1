$files = Get-ChildItem -Path "src/data/compendium" -Recurse -Include "*.ts"
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if ($content -match "Hunter Bureau") {
        $content = $content -replace "Hunter Bureau", "Ascendant Bureau"
        Set-Content $f.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($f.Name)"
    }
}
