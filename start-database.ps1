# Start PostgreSQL Database for Bypass Tool Pro
Write-Host "Starting PostgreSQL database..." -ForegroundColor Green

# Check if container already exists
$containerExists = docker ps -a --filter "name=bypass-tool-pro-db" --format "{{.Names}}"

if ($containerExists -eq "bypass-tool-pro-db") {
    Write-Host "Container already exists. Starting it..." -ForegroundColor Yellow
    docker start bypass-tool-pro-db
} else {
    Write-Host "Creating new PostgreSQL container..." -ForegroundColor Blue
    docker run --name bypass-tool-pro-db `
        -e POSTGRES_PASSWORD=password `
        -e POSTGRES_DB=bypass_tool_pro `
        -p 5432:5432 `
        -d postgres:15
}

Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Database is ready!" -ForegroundColor Green
Write-Host "Connection string: postgresql://postgres:password@localhost:5432/bypass_tool_pro?schema=public" -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
