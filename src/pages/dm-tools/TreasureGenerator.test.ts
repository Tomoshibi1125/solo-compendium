import { describe, expect, it } from 'vitest';
import { GATE_RANKS, TREASURE_TABLES, generateTreasure } from '@/lib/treasureGenerator';

describe('generateTreasure', () => {
  it('generates treasure within rank tables', () => {
    for (const rank of GATE_RANKS) {
      const table = TREASURE_TABLES[rank];
      expect(table).toBeDefined();

      for (let i = 0; i < 10; i += 1) {
        const result = generateTreasure(rank);
        expect(result.rank).toBe(rank);
        expect(Number.isInteger(result.gold)).toBe(true);
        expect(result.gold).toBeGreaterThanOrEqual(table.goldRange[0]);
        expect(result.gold).toBeLessThanOrEqual(table.goldRange[1]);

        for (const item of result.items) {
          expect(table.items).toContain(item);
        }
        for (const material of result.materials) {
          expect(table.materials).toContain(material);
        }
        for (const relic of result.relics) {
          expect(table.relics).toContain(relic);
        }

        expect(new Set(result.items).size).toBe(result.items.length);
        expect(new Set(result.materials).size).toBe(result.materials.length);
        expect(new Set(result.relics).size).toBe(result.relics.length);
        expect(result.description).toContain(`Gate Rank ${rank}`);
      }
    }
  });

  it('handles invalid ranks safely', () => {
    const result = generateTreasure('Z');
    expect(result.rank).toBe('Z');
    expect(result.gold).toBe(0);
    expect(result.items).toEqual([]);
    expect(result.materials).toEqual([]);
    expect(result.relics).toEqual([]);
    expect(result.description).toContain('Invalid rank: Z');
  });
});
