-- Table for saved custom Sovereigns that players can share
CREATE TABLE public.saved_sovereigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  fusion_theme TEXT NOT NULL,
  fusion_description TEXT NOT NULL,
  fusion_method TEXT NOT NULL,
  power_multiplier TEXT NOT NULL,
  fusion_stability TEXT NOT NULL,
  job_id UUID NOT NULL REFERENCES public.compendium_jobs(id),
  path_id UUID NOT NULL REFERENCES public.compendium_job_paths(id),
  monarch_a_id UUID NOT NULL REFERENCES public.compendium_monarchs(id),
  monarch_b_id UUID NOT NULL REFERENCES public.compendium_monarchs(id),
  abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_public BOOLEAN NOT NULL DEFAULT true,
  likes_count INTEGER NOT NULL DEFAULT 0
);
-- Character monarch unlocks (quest-based, DM marks as complete)
CREATE TABLE public.character_monarch_unlocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  monarch_id UUID NOT NULL REFERENCES public.compendium_monarchs(id),
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quest_name TEXT NOT NULL,
  dm_notes TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(character_id, monarch_id)
);
-- Umbral Legion for Shadow-related Sovereigns
CREATE TABLE public.compendium_shadow_soldiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  rank TEXT NOT NULL,
  description TEXT NOT NULL,
  lore TEXT,
  str INTEGER NOT NULL DEFAULT 10,
  agi INTEGER NOT NULL DEFAULT 10,
  vit INTEGER NOT NULL DEFAULT 10,
  int INTEGER NOT NULL DEFAULT 10,
  sense INTEGER NOT NULL DEFAULT 10,
  pre INTEGER NOT NULL DEFAULT 10,
  armor_class INTEGER NOT NULL DEFAULT 14,
  hit_points INTEGER NOT NULL DEFAULT 50,
  speed INTEGER NOT NULL DEFAULT 30,
  damage_immunities TEXT[] DEFAULT '{}',
  condition_immunities TEXT[] DEFAULT '{}',
  abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  summon_requirements TEXT,
  shadow_type TEXT NOT NULL DEFAULT 'soldier',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Character Umbral Legionnaire summons
CREATE TABLE public.character_shadow_soldiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id),
  nickname TEXT,
  current_hp INTEGER NOT NULL,
  is_summoned BOOLEAN NOT NULL DEFAULT false,
  bond_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, soldier_id)
);
-- Enable RLS
ALTER TABLE public.saved_sovereigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_monarch_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_shadow_soldiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_shadow_soldiers ENABLE ROW LEVEL SECURITY;
-- RLS Policies for saved_sovereigns
CREATE POLICY "Anyone can view public sovereigns" ON public.saved_sovereigns
  FOR SELECT USING (is_public = true OR created_by = auth.uid());
CREATE POLICY "Users can create their own sovereigns" ON public.saved_sovereigns
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own sovereigns" ON public.saved_sovereigns
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own sovereigns" ON public.saved_sovereigns
  FOR DELETE USING (auth.uid() = created_by);
-- RLS Policies for character_monarch_unlocks
CREATE POLICY "Users can view their own monarch unlocks" ON public.character_monarch_unlocks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_monarch_unlocks.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_monarch_unlocks.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update their own monarch unlocks" ON public.character_monarch_unlocks
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_monarch_unlocks.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_monarch_unlocks.character_id AND characters.user_id = auth.uid()
  ));
-- RLS Policies for compendium_shadow_soldiers (public read)
CREATE POLICY "Umbral Legion are publicly readable" ON public.compendium_shadow_soldiers
  FOR SELECT USING (true);
-- RLS Policies for character_shadow_soldiers
CREATE POLICY "Users can view their own Umbral Legion" ON public.character_shadow_soldiers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_shadow_soldiers.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_shadow_soldiers.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update their own summoned soldiers" ON public.character_shadow_soldiers
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_shadow_soldiers.character_id AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can release their own Umbral Legion" ON public.character_shadow_soldiers
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM characters WHERE characters.id = character_shadow_soldiers.character_id AND characters.user_id = auth.uid()
  ));
-- Insert iconic Umbral Legion from System Ascendant
INSERT INTO public.compendium_shadow_soldiers (name, title, rank, description, lore, str, agi, vit, int, sense, pre, armor_class, hit_points, speed, damage_immunities, condition_immunities, abilities, shadow_type, summon_requirements) VALUES
(
  'Crimson Knight',
  'The Crimson Knight',
  'Marshal Grade',
  'The first and most loyal of the Umbral Legion. A crimson-armored knight who once served as a boss monster before being extracted as a shadow. Crimson Knight wields an impossibly large greatsword with unmatched skill and serves as the commander of all Umbral Legion in battle.',
  'Formerly known as the Blood-Red Knight, Crimson Knight was the guardian of the Echo Vault''s inner sanctum. After a fierce battle, he was extracted by the Prime Architect and became the most trusted Umbral Legionnaire. His loyalty is absolute, and he would sacrifice himself a thousand times for the cause.',
  22, 18, 20, 14, 16, 12,
  20, 250, 40,
  ARRAY['necrotic', 'poison'],
  ARRAY['frightened', 'charmed', 'exhaustion'],
  '[{"name": "Crimson Slash", "description": "Melee Weapon Attack: +12 to hit, reach 10 ft. Deals 4d10+8 slashing damage plus 2d8 necrotic damage. On a critical hit, the target must make a DC 18 Constitution save or be stunned until the end of their next turn.", "action_type": "action"}, {"name": "Knight Commander", "description": "As a bonus action, Crimson Knight can command up to 3 other Umbral Legion within 60 feet to immediately make one weapon attack.", "action_type": "bonus action"}, {"name": "Undying Loyalty", "description": "When Crimson Knight would be reduced to 0 HP, he instead drops to 1 HP. This can only occur once per long rest.", "action_type": "reaction"}]'::jsonb,
  'knight',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 10+'
),
(
  'Gilded Reaper',
  'The Chitin Tyrant',
  'Marshal Grade',
  'An insectoid Umbral Legionnaire with terrifying power. Once the chitin tyrant who felled countless S-Rank ascendants, Gilded Reaper''s extraction was a turning point. He speaks formally and has a taste for the finer things, but his combat prowess is apocalyptic.',
  'The terror of the Crimson Isle, Gilded Reaper slaughtered an elite team of ascendants before facing the Prime Architect. After his defeat and extraction, he became fanatically devoted to the divine cause, serving with predatory enthusiasm and unwavering loyalty.',
  24, 20, 22, 12, 14, 8,
  22, 300, 50,
  ARRAY['necrotic', 'poison', 'acid'],
  ARRAY['frightened', 'paralyzed', 'exhaustion'],
  '[{"name": "Devastating Claw", "description": "Melee Weapon Attack: +14 to hit, reach 15 ft. Deals 5d10+10 slashing damage. Can attack twice as part of the same action.", "action_type": "action"}, {"name": "Devour", "description": "When Gilded Reaper reduces a creature to 0 HP, he can devour it as a bonus action to gain temporary HP equal to the creature''s maximum HP (max 50). He also gains one ability the creature possessed for 1 hour.", "action_type": "bonus action"}, {"name": "Regeneration", "description": "Gilded Reaper regains 20 HP at the start of each of his turns if he has at least 1 HP.", "action_type": "passive"}]'::jsonb,
  'insect',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 14+'
),
(
  'Iron',
  'The Mining Mage',
  'Knight Grade',
  'A massive armored Umbral Legionnaire who excels at taking hits. Iron served as a tank in the Prime Architect''s Umbral Legion, protecting weaker soldiers and holding defensive lines. His pickaxe can both mine resources and crush enemies.',
  'Extracted from a dungeon guardian, Iron was named for his incredibly tough defenses. He doesn''t speak much but his actions speak volumes. Where Iron stands, enemies do not pass.',
  20, 12, 24, 10, 12, 10,
  24, 200, 25,
  ARRAY['necrotic', 'poison'],
  ARRAY['frightened', 'prone', 'exhaustion'],
  '[{"name": "Iron Defense", "description": "As a reaction when an ally within 10 feet is attacked, Iron can interpose himself and take the attack instead. He gains resistance to that attack''s damage.", "action_type": "reaction"}, {"name": "Crushing Blow", "description": "Melee Weapon Attack: +10 to hit, reach 10 ft. Deals 3d10+6 bludgeoning damage. The target must make a DC 16 Strength save or be knocked prone.", "action_type": "action"}, {"name": "Immovable", "description": "Iron has advantage on saves against being moved or knocked prone. His movement can''t be reduced by difficult terrain.", "action_type": "passive"}]'::jsonb,
  'tank',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 7+'
),
(
  'Tusk',
  'The High Orc Shadow',
  'Elite Knight Grade',
  'A fearsome high orc Umbral Legionnaire with incredible regenerative abilities. Tusk leads shadow orc packs into battle, overwhelming enemies with savage fury and numbers.',
  'Once a dungeon boss, the High Orc Tusk joined the Umbral Legion after a brutal conquest. He maintains some of his orc battle-lust but channels it entirely for his master''s will.',
  22, 16, 22, 10, 14, 10,
  18, 180, 35,
  ARRAY['necrotic', 'poison'],
  ARRAY['frightened', 'charmed'],
  '[{"name": "Savage Assault", "description": "Melee Weapon Attack: +11 to hit, reach 10 ft. Deals 3d12+7 slashing damage. If Tusk moves at least 20 feet in a straight line before attacking, the target takes an additional 2d12 damage.", "action_type": "action"}, {"name": "Battle Cry", "description": "As a bonus action, Tusk lets out a war cry. All Umbral Legion within 30 feet gain advantage on their next attack roll.", "action_type": "bonus action"}, {"name": "Relentless", "description": "When Tusk is reduced to 0 HP but not killed outright, he drops to 1 HP instead. This can be used once per short rest.", "action_type": "passive"}]'::jsonb,
  'berserker',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 5+'
),
(
  'Tank',
  'The Ice Bear',
  'Knight Grade',
  'A massive shadow bear with frost-enhanced claws. Tank is a straightforward bruiser who charges into battle and mauls anything in his path. His simple nature belies devastating effectiveness.',
  'Extracted from a frost dungeon boss, Tank earned his name from his ability to absorb punishment. He fights with primal fury enhanced by shadow power and lingering frost magic.',
  22, 14, 22, 8, 16, 8,
  19, 170, 40,
  ARRAY['necrotic', 'poison', 'cold'],
  ARRAY['frightened', 'charmed'],
  '[{"name": "Frost Maul", "description": "Melee Weapon Attack: +11 to hit, reach 10 ft. Deals 3d10+7 slashing damage plus 2d6 cold damage. The target''s speed is reduced by 10 feet until the end of their next turn.", "action_type": "action"}, {"name": "Bear Hug", "description": "If Tank hits a Large or smaller creature with a melee attack, he can attempt to grapple it as a bonus action (escape DC 18). A grappled creature takes 2d6 cold damage at the start of each of its turns.", "action_type": "bonus action"}, {"name": "Thick Hide", "description": "Tank has resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.", "action_type": "passive"}]'::jsonb,
  'beast',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 5+'
);


