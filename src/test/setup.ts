import { expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock localStorage for all tests
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn<(key: string) => string | null>((key) => mockStorage[key] || null),
  setItem: vi.fn<(key: string, value: string) => void>((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn<(key: string) => void>((key) => {
    delete mockStorage[key];
  }),
  clear: vi.fn<() => void>(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }),
  length: 0,
  key: vi.fn<(index: number) => string | null>((index) => {
    const keys = Object.keys(mockStorage);
    return keys[index] || null;
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock @supabase/auth-js to prevent storage errors
vi.mock('@supabase/auth-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      updateUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      single: vi.fn(),
      then: vi.fn(),
      catch: vi.fn(),
    })),
  })),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  // Clear mock storage
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
});

