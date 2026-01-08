import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateCampaign, useJoinedCampaigns, useMyCampaigns } from './useCampaigns';

const { mockGetUser, mockFrom, mockRpc } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockRpc: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
    rpc: mockRpc,
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCampaigns', () => {
  let tableData: Record<string, unknown[]>;

  beforeEach(() => {
    tableData = {};
    mockGetUser.mockReset();
    mockFrom.mockReset();
    mockRpc.mockReset();

    mockFrom.mockImplementation((table: string) => {
      const query: {
        select: (value: string) => typeof query;
        eq: (column: string, value: string) => typeof query;
        order: () => Promise<{ data: unknown[]; error: null }>;
        single: () => Promise<{ data: unknown | null; error: null }>;
      } = {
        select: () => query,
        eq: () => query,
        order: async () => ({
          data: tableData[table] ?? [],
          error: null,
        }),
        single: async () => ({
          data: (tableData[table] ?? [])[0] ?? null,
          error: null,
        }),
      };
      return query;
    });
  });

  it('returns empty campaigns when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useMyCampaigns(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('loads campaigns for the current user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    tableData.campaigns = [
      {
        id: 'campaign-1',
        name: 'Shadow Guild',
        description: null,
        dm_id: 'user-1',
        share_code: 'ABC123',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        settings: {},
      },
    ];

    const { result } = renderHook(() => useMyCampaigns(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]?.id).toBe('campaign-1');
  });

  it('maps joined campaigns with member role', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-2' } }, error: null });
    tableData.campaign_members = [
      {
        role: 'hunter',
        campaigns: {
          id: 'campaign-2',
          name: 'Gatefall',
          description: 'Test',
          dm_id: 'user-9',
          share_code: 'DEF456',
          is_active: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          settings: {},
        },
      },
    ];

    const { result } = renderHook(() => useJoinedCampaigns(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]?.member_role).toBe('hunter');
    expect(result.current.data?.[0]?.id).toBe('campaign-2');
  });

  it('creates a campaign via RPC', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-3' } }, error: null });
    mockRpc.mockResolvedValue({ data: 'campaign-3', error: null });

    const { result } = renderHook(() => useCreateCampaign(), { wrapper: createWrapper() });

    let createdId: string | null = null;
    await act(async () => {
      createdId = await result.current.mutateAsync({ name: 'Riftwatch', description: 'Test guild' });
    });

    expect(createdId).toBe('campaign-3');
    expect(mockRpc).toHaveBeenCalledWith('create_campaign_with_code', {
      p_name: 'Riftwatch',
      p_description: 'Test guild',
      p_dm_id: 'user-3',
    });
  });
});
