// Test setup for Vitest
import { beforeEach, vi } from 'vitest'

// Mock any global dependencies
const runtimeGlobal = globalThis as any;
runtimeGlobal.describe = vi.fn();
runtimeGlobal.test = vi.fn();
runtimeGlobal.expect = vi.fn();

// Setup test environment
beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});
