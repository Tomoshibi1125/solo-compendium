import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodePath = join(__dirname, 'node-v20.10.0-win-x64', 'node.exe');
const vitestPath = join(__dirname, 'node_modules', 'vitest', 'dist', 'index.js');

console.log('Running tests...');
console.log('Node path:', nodePath);
console.log('Vitest path:', vitestPath);

const testProcess = spawn(nodePath, [vitestPath, 'run', '--reporter=verbose'], {
  stdio: 'inherit',
  cwd: __dirname
});

testProcess.on('close', (code) => {
  console.log(`Test process exited with code ${code}`);
});

testProcess.on('error', (error) => {
  console.error('Error running tests:', error);
});
