import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OAuthButtons } from '@/components/auth/OAuthButton';
import { OAUTH_PROVIDERS, type OAuthProvider } from '@/hooks/useOAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useOAuth hook
vi.mock('@/hooks/useOAuth', () => ({
  useOAuth: () => ({
    isLoading: false,
    signInWithProvider: vi.fn(),
    signOut: vi.fn(),
    user: null,
    error: null,
  }),
  OAUTH_PROVIDERS: [
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: '🍎',
      color: 'bg-gray-800 hover:bg-gray-900',
    },
  ],
}));

describe('OAuthButtons', () => {
  let mockSignInWithProvider: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSignInWithProvider = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@/hooks/useOAuth', () => ({
      useOAuth: () => ({
        isLoading: false,
        signInWithProvider: mockSignInWithProvider,
        signOut: vi.fn(),
        user: null,
        error: null,
      }),
      OAUTH_PROVIDERS: [
        {
          id: 'google',
          name: 'Google',
          icon: '🔍',
          color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
          id: 'apple',
          name: 'Apple',
          icon: '🍎',
          color: 'bg-gray-800 hover:bg-gray-900',
        },
      ],
    }));
  });

  it('renders OAuth buttons for all providers', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OAuthButtons onSignIn={mockSignInWithProvider} />
      </QueryClientProvider>
    );

    // Check that all provider buttons are rendered
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
  });

  it('calls signInWithProvider when Google button is clicked', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OAuthButtons onSignIn={mockSignInWithProvider} />
      </QueryClientProvider>
    );

    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithProvider).toHaveBeenCalledWith(OAUTH_PROVIDERS[0]);
    });
  });

  it('calls signInWithProvider when Apple button is clicked', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OAuthButtons onSignIn={mockSignInWithProvider} />
      </QueryClientProvider>
    );

    const appleButton = screen.getByText('Continue with Apple');
    fireEvent.click(appleButton);

    await waitFor(() => {
      expect(mockSignInWithProvider).toHaveBeenCalledWith(OAUTH_PROVIDERS[1]);
    });
  });

  it('shows loading state when isLoading is true', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OAuthButtons onSignIn={mockSignInWithProvider} isLoading={true} />
      </QueryClientProvider>
    );

    // Check that buttons are disabled during loading
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    const appleButton = screen.getByRole('button', { name: /continue with apple/i });
    
    expect(googleButton).toBeDisabled();
    expect(appleButton).toBeDisabled();
  });
});
