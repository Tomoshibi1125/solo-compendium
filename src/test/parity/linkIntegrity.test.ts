/**
 * Link Integrity Tests
 * 
 * Tests reference resolution and link integrity checking
 */

import { describe, it, expect, vi } from 'vitest';
import { resolveRef, validateRef, isValidEntryType } from '@/lib/compendiumResolver';
import { checkLinkIntegrity } from '@/lib/linkIntegrity';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

const fromMock = vi.mocked(supabase.from as unknown as (table: string) => unknown);

describe('Compendium Resolver', () => {
  it('validates entry types correctly', () => {
    expect(isValidEntryType('jobs')).toBe(true);
    expect(isValidEntryType('powers')).toBe(true);
    expect(isValidEntryType('runes')).toBe(true);
    expect(isValidEntryType('invalid')).toBe(false);
    expect(isValidEntryType('')).toBe(false);
  });

  it('resolves references correctly', async () => {
    // Mock successful resolution
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve({
              data: {
                id: 'test-id',
                name: 'Test Job',
                description: 'Test description',
              },
              error: null,
            }),
        }),
      }),
    });

    const result = await resolveRef('jobs', 'test-id');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('test-id');
    expect(result?.name).toBe('Test Job');
  });

  it('returns null for non-existent references', async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    });

    const result = await resolveRef('jobs', 'non-existent');
    expect(result).toBeNull();
  });

  it('validates references correctly', async () => {
    // Mock existing reference
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve({
              data: { id: 'test-id', name: 'Test' },
              error: null,
            }),
        }),
      }),
    });

    const exists = await validateRef('jobs', 'test-id');
    expect(exists).toBe(true);

    // Mock non-existent reference
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    });

    const notExists = await validateRef('jobs', 'non-existent');
    expect(notExists).toBe(false);
  });
});

describe('Link Integrity Checker', () => {
  it('detects broken job references', async () => {
    // Mock character with broken job reference
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: {
                id: 'char-1',
                name: 'Test Character',
                job: 'Non-existent Job',
                path: null,
                background: null,
              },
              error: null,
            }),
        }),
      }),
    });

    // Mock job lookup returning null (broken reference)
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    });

    // Mock rune inscriptions (empty)
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    // Mock rune knowledge (empty)
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    // Mock features (empty)
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    const brokenLinks = await checkLinkIntegrity('char-1');
    expect(brokenLinks.length).toBeGreaterThan(0);
    expect(brokenLinks[0].referenceType).toBe('job');
    expect(brokenLinks[0].referenceName).toBe('Non-existent Job');
  });

  it('detects broken rune references', async () => {
    // Mock character
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: {
                id: 'char-1',
                name: 'Test Character',
                job: null,
                path: null,
                background: null,
              },
              error: null,
            }),
        }),
      }),
    });

    // Mock rune inscriptions with broken reference
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              {
                id: 'inscription-1',
                rune_id: 'non-existent-rune',
              },
            ],
            error: null,
          }),
      }),
    });

    // Mock rune knowledge (empty)
    const resolverModule = await import('@/lib/compendiumResolver');
    const resolveRefSpy = vi.spyOn(resolverModule, 'resolveRef').mockResolvedValue(null);

    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    // Mock features (empty)
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    const brokenLinks = await checkLinkIntegrity('char-1');
    expect(
      brokenLinks.some(
        (link) =>
          link.referenceType === 'rune' && link.referenceId === 'non-existent-rune'
      )
    ).toBe(true);

    resolveRefSpy.mockRestore();
  });
});

