-- Rift Ascendant has no mana system: nothing restores, spends, drains, costs,
-- or pools mana. Casting uses spell slots and abilities are Powers or
-- Techniques. The static compendium (src/data/compendium) is the rules
-- authority and drops those mechanics in the same change; these legacy
-- database copies are still reachable through the command palette and the
-- resolver's database fallback, so they follow.
--
--   * The seven Mana Elixir rows in compendium_equipment restored mana. They
--     have no static counterpart, nothing references them by key, and no
--     character, campaign, or marketplace row names them (checked
--     2026-09-30).
--   * Mana-reserve, mana-recovery, and "mana-based ability" wording in
--     Mana-Inert Handcuffs, Second Wind, Vital Point Strike, Mountain
--     Crusher, Essence Potion, Mana Siphon Strike, Lattice Severance, Mana
--     Cascade Failure, and Idol's Grand Finale now matches the static entries.
--
-- Mana as setting vocabulary (the mana lattice, Mana Credits, Mana Flow) is
-- not a mechanic and is unchanged.
BEGIN;

DELETE FROM public.compendium_equipment
WHERE name IN (
  'Black-Market Mana Elixir',
  'Concentrated Mana Elixir',
  'Greater Mana Elixir',
  'High-Grade Mana Elixir',
  'Lesser Mana Elixir',
  'Purified Mana Elixir',
  'Unstable Mana Elixir'
);

UPDATE public.compendium_equipment
SET description = replace(description, 'use mana-based abilities', 'use Powers')
WHERE name = 'Mana-Inert Handcuffs'
  AND description LIKE '%use mana-based abilities%';

UPDATE public.compendium_powers
SET description = replace(description, 'Draw on your mana reserves', 'Draw on your reserves')
WHERE name = 'Second Wind'
  AND description LIKE '%Draw on your mana reserves%';

UPDATE public.compendium_techniques
SET description = replace(description, 'mana recovery is suppressed', 'recovery is suppressed'),
    primary_effect = replace(primary_effect, 'mana recovery is suppressed', 'recovery is suppressed')
WHERE name = 'Vital Point Strike'
  AND (
    description LIKE '%mana recovery is suppressed%'
    OR primary_effect LIKE '%mana recovery is suppressed%'
  );

UPDATE public.compendium_techniques
SET description = replace(description, 'Channel your full mana reserve', 'Channel everything you have'),
    primary_effect = replace(primary_effect, 'Channel your full mana reserve', 'Channel everything you have')
WHERE name = 'Mountain Crusher'
  AND (
    description LIKE '%Channel your full mana reserve%'
    OR primary_effect LIKE '%Channel your full mana reserve%'
  );

UPDATE public.compendium_relics
SET mechanics = jsonb_set(
  mechanics,
  '{audit,variant_note}',
  to_jsonb('Restores 4d4+4 HP and grants +1 to all ability checks for 1 hour.'::text)
)
WHERE name = 'Essence Potion'
  AND mechanics #>> '{audit,variant_note}' = 'Restores mana on consumption.';

UPDATE public.compendium_spells
SET description = replace(
  description,
  'If the target has mana-casting ability, you also recover',
  'If the target can cast spells, you also recover'
)
WHERE name = 'Mana Siphon Strike'
  AND description LIKE '%mana-casting ability%';

UPDATE public.compendium_spells
SET description = replace(description, 'use any mana-based ability', 'use Powers'),
    mechanics = replace(mechanics::text, 'use mana-based abilities', 'use Powers')::jsonb
WHERE name = 'Lattice Severance'
  AND (
    description LIKE '%mana-based abilit%'
    OR mechanics::text LIKE '%mana-based abilit%'
  );

UPDATE public.compendium_spells
SET description = replace(
  description,
  'If the target has no mana-casting ability, it''s stunned',
  'If the target can''t cast spells, it''s stunned'
)
WHERE name = 'Mana Cascade Failure'
  AND description LIKE '%mana-casting ability%';

UPDATE public.compendium_spells
SET description = replace(
  description,
  'you can''t use mana abilities for 7 days',
  'you can''t cast spells or use Powers for 7 days'
)
WHERE name = 'Idol''s Grand Finale'
  AND description LIKE '%mana abilities%';

COMMIT;
