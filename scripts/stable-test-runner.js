#!/usr/bin/env node

/**
 * Stable Test Runner Script
 * Helps manage server stability and test execution
 */

const { spawn, exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Stable Test Runner...');

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    exec('netstat -an | findstr :8080', (error, stdout) => {
      resolve(stdout.includes('LISTENING'));
    });
  });
}

// Run optimized tests
async function runTests() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server not running on port 8080');
    console.log('🔄 Starting server...');
    
    // Start server
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Check again
    const serverNowRunning = await checkServer();
    if (!serverNowRunning) {
      console.log('❌ Failed to start server');
      process.exit(1);
    }
    
    console.log('✅ Server started successfully');
  }
  
  console.log('🧪 Running optimized tests...');
  
  // Run DM optimized test
  console.log('\n📊 Running DM Optimized Test...');
  const dmTest = spawn('npm', ['run', 'test:e2e', 'tests/e2e/comprehensive-dm-optimized.spec.ts'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  await new Promise((resolve) => {
    dmTest.on('close', resolve);
  });
  
  // Run Player optimized test
  console.log('\n📊 Running Player Optimized Test...');
  const playerTest = spawn('npm', ['run', 'test:e2e', 'tests/e2e/comprehensive-player-optimized.spec.ts'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  await new Promise((resolve) => {
    playerTest.on('close', resolve);
  });
  
  console.log('✅ All tests completed!');
}

runTests().catch(console.error);
