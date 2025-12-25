const { spawn } = require('child_process');
const path = require('path');

// Start the server as a child process
const serverProcess = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Handle termination signals
function cleanup() {
  console.log('Stopping server...');
  try {
    serverProcess.kill('SIGTERM');
  } catch (_) {}
  
  // Force kill after 2 seconds if not stopped
  setTimeout(() => {
    try { serverProcess.kill('SIGKILL'); } catch (_) {}
    process.exit(0);
  }, 2000);
}

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
process.on('exit', cleanup);

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code || 0);
});
