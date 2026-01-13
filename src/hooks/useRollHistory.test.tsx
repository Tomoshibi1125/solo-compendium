import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

const mocks = vi.hoisted(() => ({
  getUserMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUserMock,
    },
  },
}));

import { useRollHistory } from './useRollHistory';

function TestComponent() {
  const { data = [], isLoading } = useRollHistory(undefined, 10);
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="data">{JSON.stringify(data)}</div>
    </div>
  );
}

describe('useRollHistory', () => {
  beforeEach(() => {
    mocks.getUserMock.mockReset();
  });

  it('returns an empty array when not authenticated', async () => {
    mocks.getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent('[]');
    });
  });
});


