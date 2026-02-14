import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodePath = join(__dirname, 'node-v20.10.0-win-x64', 'node.exe');
const vitestPath = join(__dirname, 'node_modules', 'vitest', 'dist', 'index.js');

console.log('🧪 Running 5e Conversion Tests...');
console.log('Node path:', nodePath);
console.log('Vitest path:', vitestPath);

const testFiles = [
  'src/lib/__tests__/5eRulesEngine.test.ts',
  'src/lib/__tests__/5eCharacterCalculations.test.ts',
  'src/lib/__tests__/spellSlots.test.ts',
  'src/lib/__tests__/homebrewCompatibility.test.ts',
  'src/lib/__tests__/compendiumValidation.test.ts',
  'src/lib/__tests__/combatSystem.test.ts'
];

const testProcess = spawn(nodePath, [vitestPath, 'run', ...testFiles, '--reporter=verbose'], {
  stdio: 'inherit',
  cwd: __dirname
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ All tests passed successfully!');
  } else {
    console.log(`❌ Tests failed with code ${code}`);
  }
});

testProcess.on('error', (error) => {
  console.error('💥 Error running tests:', error);
});
