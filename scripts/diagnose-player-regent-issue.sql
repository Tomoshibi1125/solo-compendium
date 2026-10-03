-- Diagnostic: Player reports "regent powers still awaiting warden approval"
-- Run this to check the actual state of ALL pending regent-related items

-- 1. List all characters with pending regent unlocks
SELECT 
  'Pending Regent Unlocks' as check_name,
  c.name as character_name,
  c.level,
  u.regent_id,
  u.is_primary,
  u.id as unlock_id
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
WHERE u.caught_up_at_level IS NULL
ORDER BY c.name, u.is_primary DESC;

-- 2. Check for pending regent grants (these show "awaiting warden approval")
SELECT 
  'Pending Regent Grants' as check_name,
  c.name as character_name,
  g.regent_id,
  g.grant_kind,
  g.canonical_id,
  g.status
FROM public.character_pending_regent_grants g
JOIN public.characters c ON c.id = g.character_id
WHERE g.status = 'pending'
ORDER BY c.name, g.created_at;

-- 3. Check for catch-up powers/techniques that might be incomplete
SELECT 
  'Catch-Up Powers' as check_name,
  c.name as character_name,
  p.name as power_name,
  p.power_level,
  p.source,
  p.acquisition_kind
FROM public.character_powers p
JOIN public.characters c ON c.id = p.character_id
WHERE p.source LIKE '%Attunement (Catch-Up)'
ORDER BY c.name, p.power_level, p.name;

-- 4. Check for catch-up techniques
SELECT 
  'Catch-Up Techniques' as check_name,
  c.name as character_name,
  t.technique_id,
  t.source,
  t.acquisition_kind
FROM public.character_techniques t
JOIN public.characters c ON c.id = t.character_id
WHERE t.source LIKE '%Attunement (Catch-Up)'
ORDER BY c.name, t.technique_id;

-- 5. Check catch-up requirements vs actual counts for pending unlocks
SELECT 
  'Requirements vs Actual' as check_name,
  c.name as character_name,
  c.level,
  u.regent_id,
  req.powers as powers_required,
  (SELECT COUNT(*) FROM public.character_powers p 
   WHERE p.character_id = c.id 
   AND p.source = req.regent_name || ' Attunement (Catch-Up)') as powers_actual,
  req.techniques as techniques_required,
  (SELECT COUNT(*) FROM public.character_techniques t 
   WHERE t.character_id = c.id 
   AND t.source = req.regent_name || ' Attunement (Catch-Up)') as techniques_actual
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
JOIN app_private.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL
ORDER BY c.name;

-- 6. Check regent_catch_up_options table (should be empty in self-service workflow)
SELECT 
  'Warden-Approved Options' as check_name,
  COUNT(*) as option_count
FROM public.regent_catch_up_options;
