const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting AgriSmart Platform (Backend + Frontend)   ');
console.log('====================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Start Backend
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

function handleExit(code) {
  backend.kill();
  frontend.kill();
  process.exit(code);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
backend.on('exit', (code) => {
  if (code !== 0) console.error(`Backend process exited with code ${code}`);
});
frontend.on('exit', (code) => {
  if (code !== 0) console.error(`Frontend process exited with code ${code}`);
});

