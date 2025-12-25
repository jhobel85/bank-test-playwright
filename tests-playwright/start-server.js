const { spawn } = require('child_process');
const path = require('path');

// Start the server as a child process
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle termination signals
function cleanup() {
  console.log('Stopping server...');
  serverProcess.kill('SIGTERM');
  
  // Force kill after 2 seconds if not stopped
  setTimeout(() => {
    serverProcess.kill('SIGKILL');
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
