-- Add unique constraint on name columns for ON CONFLICT to work
ALTER TABLE compendium_equipment ADD CONSTRAINT compendium_equipment_name_unique UNIQUE (name);
ALTER TABLE compendium_feats ADD CONSTRAINT compendium_feats_name_unique UNIQUE (name);
ALTER TABLE compendium_backgrounds ADD CONSTRAINT compendium_backgrounds_name_unique UNIQUE (name);
