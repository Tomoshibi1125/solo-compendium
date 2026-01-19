-- Remove Shadow Monarch from jobs (it's a Monarch overlay, not a Job)
DELETE FROM compendium_jobs WHERE name = 'Shadow Monarch';
-- Add Vanguard as a proper Job (Fighter analog)
INSERT INTO compendium_jobs (name, description, flavor_text, primary_abilities, secondary_abilities, hit_die, armor_proficiencies, weapon_proficiencies, tool_proficiencies, saving_throw_proficiencies, skill_choices, skill_choice_count, source_book, tags)
VALUES (
  'Vanguard',
  'Vanguards are the frontline warriors who lead the charge into Gates. Masters of martial combat and tactical positioning, they excel at protecting allies while dealing devastating melee damage. Their training emphasizes adaptability—able to switch between offensive and defensive stances as the battle demands.',
  'Where others hesitate, Vanguards advance. They are the first through the Gate and the last to leave.',
  ARRAY['STR', 'VIT']::ability_score[],
  ARRAY['AGI']::ability_score[],
  10,
  ARRAY['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'],
  ARRAY['Simple Weapons', 'Martial Weapons'],
  ARRAY['One gaming set or vehicle'],
  ARRAY['STR', 'VIT']::ability_score[],
  ARRAY['Acrobatics', 'Athletics', 'Intimidation', 'Perception', 'Survival'],
  2,
  'PHB',
  ARRAY['Martial', 'Tank', 'Melee', 'Leader']
);
-- Create compendium_monarchs table for the 9 Monarch overlays
CREATE TABLE public.compendium_monarchs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL, -- e.g., "Monarch of Shadows", "Monarch of White Flames"
  description TEXT NOT NULL,
  flavor_text TEXT,
  lore TEXT, -- Extended lore about the Monarch's history
  
  -- Associated theme and power type
  theme TEXT NOT NULL, -- e.g., "Shadow", "Destruction", "Ice"
  damage_type TEXT, -- Primary damage type associated
  
  -- Unlock requirements
  unlock_level INTEGER NOT NULL DEFAULT 7,
  prerequisites TEXT,
  
  -- Overlay budget info
  primary_abilities ability_score[] DEFAULT '{}',
  
  -- Visual/RP elements
  manifestation_description TEXT, -- How the Monarch power manifests
  corruption_risk TEXT, -- Narrative corruption risks
  
  -- Metadata
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.compendium_monarchs ENABLE ROW LEVEL SECURITY;
-- Public read access
CREATE POLICY "Compendium monarchs are publicly readable"
  ON public.compendium_monarchs FOR SELECT
  USING (true);
-- Create monarch features table
CREATE TABLE public.compendium_monarch_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monarch_id UUID NOT NULL REFERENCES public.compendium_monarchs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- When feature is gained
  level INTEGER NOT NULL,
  is_signature BOOLEAN NOT NULL DEFAULT false, -- Signature/core features
  
  -- Usage
  action_type TEXT, -- 'action', 'bonus-action', 'reaction', 'passive'
  uses_formula TEXT,
  recharge TEXT,
  
  -- Prerequisites within the overlay
  prerequisites TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE (monarch_id, name)
);
ALTER TABLE public.compendium_monarch_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Compendium monarch features are publicly readable"
  ON public.compendium_monarch_features FOR SELECT
  USING (true);
-- Create compendium_sovereigns table for Gemini Protocol fusions
CREATE TABLE public.compendium_sovereigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  
  -- Components of the fusion
  job_id UUID REFERENCES public.compendium_jobs(id) ON DELETE SET NULL,
  path_id UUID REFERENCES public.compendium_job_paths(id) ON DELETE SET NULL,
  monarch_a_id UUID REFERENCES public.compendium_monarchs(id) ON DELETE SET NULL,
  monarch_b_id UUID REFERENCES public.compendium_monarchs(id) ON DELETE SET NULL,
  
  -- Fusion theme
  fusion_theme TEXT, -- The unique blended identity
  fusion_description TEXT, -- How the fusion manifests
  
  -- Unlock
  unlock_level INTEGER NOT NULL DEFAULT 17,
  prerequisites TEXT,
  
  -- Whether this is AI-generated or pre-defined
  is_template BOOLEAN NOT NULL DEFAULT false, -- Template sovereigns for examples
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.compendium_sovereigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Compendium sovereigns are publicly readable"
  ON public.compendium_sovereigns FOR SELECT
  USING (true);
-- Create sovereign features table for fused abilities
CREATE TABLE public.compendium_sovereign_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sovereign_id UUID NOT NULL REFERENCES public.compendium_sovereigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Origin tracking (what was fused to create this)
  origin_sources TEXT[], -- e.g., ['Striker: Rapid Assault', 'Shadow Monarch: Shadow Extraction']
  
  -- Feature details
  level INTEGER NOT NULL,
  is_capstone BOOLEAN NOT NULL DEFAULT false,
  action_type TEXT,
  uses_formula TEXT,
  recharge TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE (sovereign_id, name)
);
ALTER TABLE public.compendium_sovereign_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Compendium sovereign features are publicly readable"
  ON public.compendium_sovereign_features FOR SELECT
  USING (true);
-- Add character support for Monarchs and Sovereigns
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS monarch_overlays UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sovereign_id UUID REFERENCES public.compendium_sovereigns(id) ON DELETE SET NULL;
-- Create indexes
CREATE INDEX idx_monarch_features_monarch ON public.compendium_monarch_features(monarch_id);
CREATE INDEX idx_sovereign_features_sovereign ON public.compendium_sovereign_features(sovereign_id);
CREATE INDEX idx_sovereigns_components ON public.compendium_sovereigns(job_id, path_id, monarch_a_id, monarch_b_id);
-- Insert the 9 Canon Monarchs
INSERT INTO compendium_monarchs (name, title, description, flavor_text, lore, theme, damage_type, unlock_level, primary_abilities, manifestation_description, corruption_risk, tags) VALUES
(
  'Shadow Monarch',
  'Monarch of Shadows',
  'The Shadow Monarch commands an army of the dead, extracting shadows from slain creatures to serve eternally. This overlay grants necromantic powers focused on shadow extraction, shadow army command, and domain manipulation.',
  'Arise.',
  'The Shadow Monarch was once Ashborn, the greatest of the Rulers who defected to lead the army of the dead. The power passed through Sung Il-Hwan before finding its true inheritor in Sung Jin-Woo, who would become the most powerful Hunter in history.',
  'Shadow',
  'Necrotic',
  7,
  ARRAY['PRE', 'INT']::ability_score[],
  'Shadows pool beneath your feet, and fallen enemies stir with violet flame in their eyes before rising to serve.',
  'The endless voices of your shadow soldiers whisper constantly. Some Hunters lose themselves in the legion.',
  ARRAY['Necromancy', 'Summoner', 'Army', 'Shadow']
),
(
  'Beast Monarch',
  'Monarch of Beasts',
  'The Beast Monarch embodies primal fury and bestial transformation. This overlay grants enhanced physical capabilities, partial or full beast transformations, and command over monstrous creatures.',
  'All beasts bow before the apex predator.',
  'Antares, the Monarch of Destruction was the Dragon King, but the Beast Monarch represents the primal hierarchy of all creatures. Those who embrace this power become apex predators beyond human limits.',
  'Beast',
  'Slashing',
  7,
  ARRAY['STR', 'VIT']::ability_score[],
  'Your features sharpen, muscles ripple with inhuman power, and lesser creatures flee or submit to your presence.',
  'The beast within grows stronger with each transformation. Some forget they were ever human.',
  ARRAY['Transformation', 'Primal', 'Physical', 'Beast']
),
(
  'Iron Body Monarch',
  'Monarch of Iron',
  'The Iron Body Monarch represents absolute physical resilience. This overlay grants supernatural durability, damage reduction, and the ability to shrug off wounds that would kill lesser Hunters.',
  'Break your weapons upon my flesh.',
  'Iron Body represents the pinnacle of defensive power—a body that has transcended mortal fragility to become living armor.',
  'Iron',
  'Bludgeoning',
  7,
  ARRAY['VIT', 'STR']::ability_score[],
  'Your skin takes on a metallic sheen, and wounds seal with crackling energy as your body rejects damage.',
  'As flesh becomes iron, some lose the ability to feel anything at all—pain, pleasure, or connection.',
  ARRAY['Defense', 'Tank', 'Resilience', 'Iron']
),
(
  'Plague Monarch',
  'Monarch of Plagues',
  'The Plague Monarch spreads corruption and decay. This overlay grants control over disease, poison, and debilitating afflictions that weaken enemies while empowering the wielder through suffering.',
  'All things rot. I merely hasten the inevitable.',
  'Querehsha, the Monarch of Plagues, was a being of pure corruption. Those who inherit this power become vectors of supernatural disease.',
  'Plague',
  'Poison',
  7,
  ARRAY['VIT', 'INT']::ability_score[],
  'Sickly green energy seeps from your pores, and your touch brings fever dreams and withering decay.',
  'The plagues you carry do not discriminate. Allies may learn to fear your embrace.',
  ARRAY['Debuff', 'Control', 'Poison', 'Plague']
),
(
  'Frost Monarch',
  'Monarch of Frost',
  'The Frost Monarch commands absolute cold. This overlay grants cryogenic powers, battlefield control through ice, and the ability to slow and freeze enemies solid.',
  'In the end, all things freeze. Movement stops. Thought stops. Time itself surrenders to the cold.',
  'The Frost Monarch represents entropy given form—the inevitable heat death that awaits all things.',
  'Frost',
  'Cold',
  7,
  ARRAY['INT', 'VIT']::ability_score[],
  'Frost creeps across surfaces you touch, your breath mists in summer heat, and the temperature plummets in your presence.',
  'The cold seeps inward. Some Frost Monarchs find their emotions freezing alongside their powers.',
  ARRAY['Control', 'Cold', 'Battlefield Control', 'Frost']
),
(
  'Stone Monarch',
  'Monarch of Stone',
  'The Stone Monarch commands earth and stone. This overlay grants geomantic powers, terrain manipulation, and the ability to create barriers and reshape the battlefield.',
  'Mountains bow. Continents shift. The earth itself is my weapon.',
  'The Stone Monarch represents permanence and patience—the slow, crushing weight of geological time brought to bear in an instant.',
  'Stone',
  'Bludgeoning',
  7,
  ARRAY['STR', 'VIT']::ability_score[],
  'The ground trembles with your steps, stone flows like water at your command, and you stand immovable as a mountain.',
  'Stone patience can become stone indifference. Some forget the urgency of mortal concerns.',
  ARRAY['Control', 'Earth', 'Terrain', 'Stone']
),
(
  'Destruction Monarch',
  'Monarch of Destruction',
  'The Destruction Monarch embodies pure annihilating force. This overlay grants devastating offensive powers, area destruction, and the ability to break through any defense.',
  'Nothing endures. Everything breaks.',
  'Antares, the Dragon King and Monarch of Destruction, was the most powerful of the Monarchs. His power represents absolute offensive supremacy.',
  'Destruction',
  'Force',
  11,
  ARRAY['STR', 'PRE']::ability_score[],
  'Reality cracks around your strikes, shields shatter on contact, and your mere presence pressures the foundations of existence.',
  'Destruction is addictive. Some come to see creation only as something to unmake.',
  ARRAY['Offense', 'Destruction', 'Power', 'Dragon']
),
(
  'White Flames Monarch',
  'Monarch of White Flames',
  'The White Flames Monarch wields the hottest fires—flames that burn beyond physical heat into the spiritual. This overlay grants devastating fire powers and demon-commanding abilities.',
  'My flames burn the soul itself.',
  'Baran, the Monarch of White Flames, commanded demon legions and wielded fire hot enough to burn magic itself.',
  'White Flames',
  'Fire',
  7,
  ARRAY['INT', 'PRE']::ability_score[],
  'White-hot flames dance at your fingertips, burning with an intensity that scorches even the incorporeal.',
  'The flames hunger constantly. Some begin to burn allies just to feed the fire.',
  ARRAY['Fire', 'Demons', 'Offense', 'Flames']
),
(
  'Transfiguration Monarch',
  'Monarch of Transfiguration',
  'The Transfiguration Monarch masters the changing of forms. This overlay grants shapeshifting, illusion powers, and the ability to transform enemies or environments.',
  'Reality is merely suggestion. I am the exception.',
  'Yogumunt, the Monarch of Transfiguration, could alter anything—matter, magic, or memory. This power represents ultimate flexibility.',
  'Transfiguration',
  'Psychic',
  7,
  ARRAY['INT', 'PRE']::ability_score[],
  'Your form flickers between possibilities, and the world around you responds to your imagination.',
  'Identity becomes fluid. Some forget which shape was the original.',
  ARRAY['Shapeshifting', 'Illusion', 'Control', 'Transformation']
);
-- Add updated_at trigger for monarchs
CREATE TRIGGER update_monarchs_updated_at
BEFORE UPDATE ON public.compendium_monarchs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Add updated_at trigger for sovereigns
CREATE TRIGGER update_sovereigns_updated_at
BEFORE UPDATE ON public.compendium_sovereigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
