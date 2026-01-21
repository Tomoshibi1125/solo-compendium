-- Expand allowed entry types for user_favorites to match compendium entries.

ALTER TABLE public.user_favorites
DROP CONSTRAINT IF EXISTS user_favorites_entry_type_check;

ALTER TABLE public.user_favorites
ADD CONSTRAINT user_favorites_entry_type_check
CHECK (
  entry_type IN (
    'jobs',
    'paths',
    'powers',
    'runes',
    'relics',
    'monsters',
    'backgrounds',
    'conditions',
    'monarchs',
    'feats',
    'skills',
    'equipment',
    'sovereigns',
    'shadow-soldiers',
    'items',
    'spells',
    'techniques',
    'artifacts',
    'locations'
  )
);
