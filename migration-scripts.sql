-- Migrate characters table to 5e standard
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS proficiency_bonus INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS initiative INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hit_dice_current INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS hit_dice_max INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS hit_dice_size INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS exhaustion_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS system_favor_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS system_favor_max INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS system_favor_die INTEGER DEFAULT 6;

-- Update existing characters with 5e calculations
UPDATE characters SET 
proficiency_bonus = GREATEST(2, CEIL(level / 4.0) + 1),
initiative = CASE 
  WHEN abilities->>'DEX' IS NOT NULL THEN FLOOR((CAST(abilities->>'DEX' AS INTEGER) - 10) / 2) 
  ELSE 0 
END,
hit_dice_current = level,
hit_dice_max = level,
hit_dice_size = CASE job 
  WHEN 'Warrior' THEN 10 
  WHEN 'Herald' THEN 10 
  WHEN 'Ranger' THEN 10 
  ELSE 8 
END,
system_favor_max = CASE 
  WHEN level <= 4 THEN 1 
  WHEN level <= 10 THEN 2 
  WHEN level <= 16 THEN 3 
  ELSE 4 
END,
system_favor_die = CASE 
  WHEN level <= 4 THEN 6 
  WHEN level <= 10 THEN 8 
  WHEN level <= 16 THEN 10 
  ELSE 12 
END;