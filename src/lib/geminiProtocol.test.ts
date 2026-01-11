import { describe, expect, it } from 'vitest';
import type { Tables } from '@/integrations/supabase/types';
import { calculateTotalCombinations, generateSovereign } from '@/lib/geminiProtocol';

type Job = Tables<'compendium_jobs'>;
type Path = Tables<'compendium_job_paths'>;
type Monarch = Tables<'compendium_monarchs'>;

const makeJob = (name: string): Job => ({ name } as Job);
const makePath = (name: string): Path => ({ name } as Path);
const makeMonarch = (name: string, title: string, theme: string, damageType: string): Monarch =>
  ({ name, title, theme, damage_type: damageType } as Monarch);

describe('generateSovereign', () => {
  it('builds a dance fusion for combat jobs with non-shadow themes', () => {
    const job = makeJob('Striker');
    const path = makePath('Path of the Blades');
    const monarchA = makeMonarch('Frost Monarch', 'Monarch of Frost', 'Frost', 'cold');
    const monarchB = makeMonarch('Stone Monarch', 'Monarch of Stone', 'Stone', 'bludgeoning');

    const sovereign = generateSovereign(job, path, monarchA, monarchB);

    expect(sovereign.name).toContain('Sovereign');
    expect(sovereign.title).toContain('Striker');
    expect(sovereign.fusion_method).toContain('Fusion Dance');
    expect(sovereign.fusion_theme).toBe('Glacial Colossus');
    expect(sovereign.abilities).toHaveLength(8);
    expect(sovereign.abilities.some((ability) => ability.fusion_type === 'dance')).toBe(true);

    const levels = sovereign.abilities.map((ability) => ability.level);
    expect(levels).toEqual([1, 3, 5, 7, 10, 14, 17, 20]);
  });

  it('includes job, path, and both monarchs as origin sources for every ability', () => {
    const job = makeJob('Striker');
    const path = makePath('Path of the Blades');
    const monarchA = makeMonarch('Frost Monarch', 'Monarch of Frost', 'Frost', 'cold');
    const monarchB = makeMonarch('Stone Monarch', 'Monarch of Stone', 'Stone', 'bludgeoning');

    const sovereign = generateSovereign(job, path, monarchA, monarchB);

    sovereign.abilities.forEach((ability) => {
      expect(ability.origin_sources).toEqual(
        expect.arrayContaining([job.name, path.name, monarchA.name, monarchB.name])
      );
    });
  });

  it('prefers potara when the Shadow theme is present', () => {
    const job = makeJob('Healer');
    const path = makePath('Path of the Guardian');
    const monarchA = makeMonarch('Shadow Monarch', 'Monarch of Shadows', 'Shadow', 'necrotic');
    const monarchB = makeMonarch('Frost Monarch', 'Monarch of Frost', 'Frost', 'cold');

    const sovereign = generateSovereign(job, path, monarchA, monarchB);

    expect(sovereign.fusion_method).toContain('Potara');
    expect(sovereign.fusion_theme).toBe('Frozen Shadow');
    expect(sovereign.abilities[0].fusion_type).toBe('potara');
  });

  it('uses absorption fusion when Destruction is present', () => {
    const job = makeJob('Mage');
    const path = makePath('Path of the Ruin');
    const monarchA = makeMonarch('Destruction Monarch', 'Monarch of Destruction', 'Destruction', 'force');
    const monarchB = makeMonarch('Iron Monarch', 'Monarch of Iron', 'Iron', 'slashing');

    const sovereign = generateSovereign(job, path, monarchA, monarchB);

    expect(sovereign.fusion_method).toContain('Absorption');
    expect(sovereign.abilities.every((ability) => ability.fusion_type === 'absorbed')).toBe(true);
  });
});

describe('calculateTotalCombinations', () => {
  it('multiplies paths by ordered monarch pairs', () => {
    expect(calculateTotalCombinations(5, 12, 4)).toBe(12 * 4 * 3);
  });
});
