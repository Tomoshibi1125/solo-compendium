import { describe, expect, it, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    rpc: async () => ({ data: [], error: null }),
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    }),
  },
}));

import {
  filterRowsByAccessibleSourcebooks,
  sourcebookCandidates,
} from '@/lib/sourcebookAccess';

type Row = {
  id: string;
  source_book?: string | null;
};

describe('sourcebookAccess helpers', () => {
  it('builds normalized sourcebook candidates', () => {
    const candidates = sourcebookCandidates(' System Ascendant Canon ');

    expect(candidates).toEqual(
      expect.arrayContaining([
        'System Ascendant Canon',
        'system ascendant canon',
        'system-ascendant-canon',
      ])
    );
  });

  it('keeps sourceless rows and allows rows with matching accessible sourcebook', () => {
    const rows: Row[] = [
      { id: 'free', source_book: null },
      { id: 'canon', source_book: 'System Ascendant Canon' },
      { id: 'locked', source_book: 'Locked Deluxe Tome' },
    ];

    const filtered = filterRowsByAccessibleSourcebooks(
      rows,
      (row) => row.source_book,
      new Set(['system-ascendant-canon'])
    );

    expect(filtered.map((row) => row.id)).toEqual(['free', 'canon']);
  });

  it('removes rows with inaccessible sourcebooks', () => {
    const rows: Row[] = [
      { id: 'a', source_book: 'Book A' },
      { id: 'b', source_book: 'Book B' },
    ];

    const filtered = filterRowsByAccessibleSourcebooks(
      rows,
      (row) => row.source_book,
      new Set(['book-b'])
    );

    expect(filtered.map((row) => row.id)).toEqual(['b']);
  });
});
