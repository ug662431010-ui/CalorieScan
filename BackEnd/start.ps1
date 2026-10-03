Set-Location $PSScriptRoot
& "$PSScriptRoot\venv\Scripts\Activate.ps1"

if (-not $env:ROBOFLOW_API_KEY) {
    $secure = Read-Host "Paste ROBOFLOW_API_KEY (hidden)" -AsSecureString
    $env:ROBOFLOW_API_KEY = [System.Net.NetworkCredential]::new("", $secure).Password
}

Write-Host "Open: http://127.0.0.1:8000/" -ForegroundColor Green
python manage.py runserver
