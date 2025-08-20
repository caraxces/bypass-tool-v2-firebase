# Stop PostgreSQL Database for Bypass Tool Pro
Write-Host "Stopping PostgreSQL database..." -ForegroundColor Yellow

# Stop the container
docker stop bypass-tool-pro-db

Write-Host "Database stopped!" -ForegroundColor Green
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
