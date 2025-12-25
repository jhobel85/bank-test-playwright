param(
    [int]$Port = 3000
)

Write-Host "Searching for process on port $Port..."

# Find the process listening on the given port
$connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if ($connection) {
    $procId = $connection.OwningProcess
    $process = Get-Process -Id $procId -ErrorAction SilentlyContinue

    Write-Host "Found process:"
    Write-Host "Name: $($process.Name).exe"
    Write-Host "PID: $procId"
    Write-Host "Killing process..."

    Stop-Process -Id $procId -Force

    Write-Host "Process on port $Port terminated."
} else {
    Write-Host "No process is listening on port $Port."
}