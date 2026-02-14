// Test setup for Vitest
import { vi } from 'vitest'

// Mock any global dependencies
global.describe = vi.fn()
global.test = vi.fn()
global.expect = vi.fn()

// Setup test environment
beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks()
})
