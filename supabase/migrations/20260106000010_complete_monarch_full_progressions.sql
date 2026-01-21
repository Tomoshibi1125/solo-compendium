-- =============================================
-- COMPLETE MONARCH FULL CLASS PROGRESSIONS (1-20)
-- =============================================
-- Based on System Ascendant monarch lore
-- Full class progressions reflecting Kael's Umbral Monarch power scaling
-- Each monarch gets features at EVERY level 1-20, like a full class
-- All aligned with System Ascendant lore and actual monarch abilities

-- =============================================
-- UMBRAL MONARCH - Full Progression (1-20)
-- =============================================
-- Based on Kael's actual powers and progression in System Ascendant

-- Level 1: Shadow Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Touch', 1,
'When you gain the Umbral Monarch overlay at 1st level, you can feel the presence of shadows around you. You gain darkvision out to 60 feet. If you already have darkvision, its range increases by 30 feet. Additionally, you can use your action to touch a creature and attempt to weaken them with shadow energy. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Presence modifier). On a failure, the target has disadvantage on its next attack roll. This represents the first awakening of your shadow powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 2: Shadow Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Sight', 2,
'At 2nd level, your connection to the shadow realm deepens. You can see through darkness and magical darkness up to 120 feet. Additionally, you can use your action to sense the presence of creatures within 30 feet, even if they are invisible or hidden, through their shadows. This represents your growing awareness of the shadow domain.',
'action', NULL, NULL, 'Shadow Touch', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 3: Shadow Step
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Step', 3,
'Starting at 3rd level, you learn to move through shadows. As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness. You must be able to see the destination. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. This is the first manifestation of your shadow mobility.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Shadow Sight', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 4: Shadow Resilience
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Resilience', 4,
'At 4th level, shadows protect you from harm. You have resistance to necrotic damage. Additionally, when you take damage, you can use your reaction to reduce the damage by 1d6. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. The shadows begin to protect you as they recognize their master.',
'reaction', 'proficiency bonus', 'long-rest', 'Shadow Step', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 5: Shadow Whip
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Whip', 5,
'Starting at 5th level, you can manifest shadows as weapons. As an action, you can create a whip of solid shadow that lasts for 1 minute. The whip is a melee weapon with reach 15 feet. You are proficient with it, and it deals 2d6 necrotic damage on a hit. The whip disappears if it leaves your hand. You can create the whip a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Shadow Resilience', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 6: Shadow Armor
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Armor', 6,
'At 6th level, shadows form protective armor around you. As a bonus action, you can manifest shadow armor that grants you a +2 bonus to AC. The armor lasts for 1 hour or until you dismiss it as a bonus action. While wearing this armor, you have advantage on Dexterity (Stealth) checks made to hide in dim light or darkness. You can use this feature once per long rest, but you can maintain it indefinitely if you have sufficient shadow energy.',
'bonus-action', '1 per long rest', 'long-rest', 'Shadow Whip', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 7: Shadow Extraction (Signature - Unlocks here)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Extraction', 7,
'At 7th level, you gain the signature ability of the Umbral Monarch: the power to extract shadows from the dead. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to extract its shadow. The shadow rises as a Umbral Legionnaire under your command within 30 feet of you. The Umbral Legionnaire uses the statistics of the creature it was extracted from, but it is an undead creature of the shadow type. It obeys your verbal commands and acts on your turn in initiative. You can have a number of Umbral Legion equal to your proficiency bonus. If you extract a shadow when you have the maximum, the oldest Umbral Legionnaire is destroyed. Umbral Legion last until destroyed or dismissed as a bonus action. This is the power that made Kael unstoppable.',
'reaction', 'proficiency bonus limit', NULL, 'Shadow Armor', true
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 8: Enhanced Shadows
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Shadows', 8,
'Starting at 8th level, your shadow powers become more refined. Your Shadow Step distance increases to 60 feet, and you can bring one willing creature with you when you use it. Additionally, your Shadow Whip damage increases to 3d6 necrotic damage. Your mastery over shadows grows, mirroring Kael''s increasing control.',
'passive', NULL, NULL, 'Shadow Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 9: Shadow Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Exchange', 9,
'At 9th level, you can swap places with your Umbral Legion instantly. As an action, you can teleport to a space occupied by one of your Umbral Legion within 120 feet, and that Umbral Legionnaire teleports to your previous space. This doesn''t provoke opportunity attacks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. This ability allows tactical positioning like Kael used in battle.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Shadows', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 10: Shadow Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Storage', 10,
'Starting at 10th level, you can store Umbral Legion in your shadow realm. As a bonus action, you can dismiss any number of your Umbral Legion into storage. They remain in storage indefinitely and can be summoned back as a bonus action. While in storage, Umbral Legion don''t count toward your maximum limit. You can have a total number of stored and active Umbral Legion equal to twice your proficiency bonus. This allows you to maintain a reserve army like Kael did.',
'bonus-action', NULL, NULL, 'Shadow Exchange', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 11: Umbral Legion Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Umbral Legion Command', 11,
'At 11th level, you can command your entire Umbral Legion simultaneously. As a bonus action, you can command all your Umbral Legion within 120 feet to take the same action (Attack, Dash, Disengage, Dodge, or Help). Additionally, the maximum number of active Umbral Legion you can control increases to twice your proficiency bonus. Your Umbral Legion have advantage on attack rolls when they outnumber their target. This represents your mastery over shadow tactics.',
'bonus-action', NULL, NULL, 'Shadow Storage', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 12: Shadow Domain (Minor)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Domain', 12,
'Starting at 12th level, you can create a domain of shadow around you. As an action, you create a 20-foot-radius sphere of shadow centered on yourself. The sphere spreads around corners and is heavily obscured for creatures other than you and your Umbral Legion. It lasts for 1 minute or until you dismiss it as a bonus action. While the domain is active, you and your Umbral Legion have advantage on attack rolls, and enemies have disadvantage on attack rolls against you. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Umbral Legion Command', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 13: Shadow Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Strike', 13,
'At 13th level, you can strike from any shadow. When you use your Shadow Step or Shadow Exchange, you can make a weapon attack against any creature within 5 feet of your destination. This attack deals additional necrotic damage equal to your level. Additionally, Umbral Legion you control can teleport up to 30 feet as a bonus action once per turn. Your shadow mastery allows you to strike from impossible angles.',
'passive', NULL, NULL, 'Shadow Domain', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 14: Umbral Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Umbral Monarch''s Presence', 14,
'Starting at 14th level, your mere presence commands fear and respect. Undead creatures within 60 feet that have a challenge rating equal to or less than your level are under your control unless they succeed on a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier). They obey your commands and act on your turn. Creatures that fail the save are charmed by you for 24 hours. This represents your authority over death itself, like the true Umbral Monarch.',
'passive', NULL, NULL, 'Shadow Strike', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 15: Shadow Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Regeneration', 15,
'At 15th level, shadows can restore your body. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you use your Shadow Extraction, you regain hit points equal to the slain creature''s challenge rating. You become nearly unkillable as shadows sustain you, reflecting Kael''s incredible durability.',
'passive', NULL, NULL, 'Umbral Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 16: Expanded Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Domain', 16,
'Starting at 16th level, your shadow domain becomes more powerful. Your Shadow Domain feature now extends to 60 feet, and it deals 2d8 necrotic damage to enemies that start their turn in the domain. Additionally, you can use Shadow Domain twice per long rest. Your control over shadows reaches new heights.',
'passive', NULL, NULL, 'Shadow Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 17: Eternal Army
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Army', 17,
'At 17th level, your Umbral Legion become truly eternal. When a Umbral Legionnaire is reduced to 0 hit points, it doesn''t die immediately. Instead, it becomes shadowy mist and reforms at the start of your next turn with half its hit point maximum. A Umbral Legionnaire can only be permanently destroyed if it is reduced to 0 hit points by radiant damage or if you dismiss it. Additionally, your maximum active Umbral Legion increases to three times your proficiency bonus. Your army becomes unstoppable, like Kael''s legendary shadow legion.',
'passive', NULL, NULL, 'Expanded Domain', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 18: Shadow Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shadow Overlord', 18,
'Starting at 18th level, you become a true overlord of shadows. You can extract shadows from creatures of any challenge rating, and extracted shadows retain all their abilities and statistics. Additionally, you can use your action to command all undead creatures within 300 feet of you, forcing them to make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier) or fall under your control for 24 hours. Once a creature succeeds, it is immune for 7 days. Your authority extends beyond your own Umbral Legion.',
'action', NULL, NULL, 'Eternal Army', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 19: Perfect Shadow Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Shadow Form', 19,
'At 19th level, you can transform into a being of pure shadow. As an action, you can become incorporeal for 1 minute. While incorporeal, you can move through creatures and objects, you have resistance to all damage except radiant, and you can use Shadow Step without expending uses. Additionally, your Umbral Legion deal double damage while you are in this form. You can use this feature once per long rest. This represents the ultimate form of the Umbral Monarch.',
'action', '1 per long rest', 'long-rest', 'Shadow Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 20: Umbral Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Umbral Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Umbral Monarch, matching the authority that Kael held. You can extract shadows from any creature you slay, regardless of size or type, and you can maintain an unlimited number of Umbral Legion. Additionally, you can use your action to command all undead creatures within 1 mile of you, with no limit on challenge rating. They must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier) or fall under your control permanently until you release them. You can use this mass command once per long rest. You have become the true Umbral Monarch, with power that rivals the System itself. Ascend.',
'action', '1 mass command per long rest', 'long-rest', 'Perfect Shadow Form', true
FROM compendium_monarchs m WHERE m.name = 'Umbral Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- =============================================
-- BEAST MONARCH - Full Progression (1-20)
-- =============================================
-- Power level equal to Umbral Monarch, themed around primal transformation and beast mastery
-- Based on System Ascendant lore: Apex predator, transformation, command over beasts

-- Level 1: Primal Awakening
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Primal Awakening', 1,
'When you gain the Beast Monarch overlay at 1st level, your senses become supernaturally sharp. You gain advantage on Wisdom (Perception) and Wisdom (Survival) checks that rely on smell, hearing, or sight. Additionally, you can use your action to make a creature within 30 feet make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier). On a failure, beasts and monstrosities are frightened of you for 1 minute. This represents the first stirring of your beastly nature.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 2: Beast Senses
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Senses', 2,
'At 2nd level, your predatory instincts sharpen. You gain darkvision out to 60 feet. If you already have darkvision, its range increases by 30 feet. Additionally, you cannot be surprised, and you have advantage on initiative rolls. You can sense the presence of creatures within 30 feet even if they are hidden or invisible. Your beast nature makes you always aware of threats.',
'passive', NULL, NULL, 'Primal Awakening', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 3: Beast Form (Minor)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Form', 3,
'Starting at 3rd level, you can partially transform into a beast. As a bonus action, you can enter a partial beast form for 1 minute. While in this form, your unarmed strikes deal 1d6 slashing damage instead of bludgeoning, your speed increases by 10 feet, and you have advantage on Strength (Athletics) checks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. This is the first step toward full transformation.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Beast Senses', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 4: Primal Resilience
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Primal Resilience', 4,
'At 4th level, your beast nature grants you incredible durability. You have resistance to slashing, piercing, and bludgeoning damage from nonmagical attacks. Additionally, when you take damage, you can use your reaction to reduce it by 1d8. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Your body becomes as tough as a wild beast.',
'reaction', 'proficiency bonus', 'long-rest', 'Beast Form', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 5: Beast Claws
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Claws', 5,
'Starting at 5th level, your natural weapons become lethal. Your unarmed strikes deal 2d6 slashing damage, and you can make two unarmed strikes when you take the Attack action. Additionally, when you score a critical hit with an unarmed strike, the target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be knocked prone. Your claws rend flesh like those of an apex predator.',
'passive', NULL, NULL, 'Primal Resilience', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 6: Predator''s Pounce
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Predator''s Pounce', 6,
'At 6th level, you can move with predatory speed. As a bonus action, you can move up to your speed toward a creature you can see. If you end this movement within 5 feet of a creature, you can make one melee weapon attack against it. Additionally, if you move at least 20 feet straight toward a creature before hitting it with a melee weapon attack, that attack deals additional damage equal to your level. You strike with the ferocity of a hunting beast.',
'bonus-action', NULL, NULL, 'Beast Claws', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 7: Beast Command (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Command', 7,
'At 7th level, you gain the signature power of the Beast Monarch: command over beasts. As an action, you can attempt to dominate a beast or monstrosity within 60 feet. The target must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier). On a failure, the creature is charmed by you and obeys your commands for 24 hours. You can have a number of charmed beasts equal to your proficiency bonus. If you attempt to charm another when at your limit, the oldest charm ends. Charmed beasts act on your turn in initiative. This power allows you to command a pack like the true Beast Monarch.',
'action', 'proficiency bonus limit', NULL, 'Predator''s Pounce', true
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 8: Enhanced Transformation
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Transformation', 8,
'Starting at 8th level, your beast form becomes more powerful. While in your Beast Form, you gain a +2 bonus to AC, and your unarmed strikes deal 3d6 slashing damage. Additionally, you can maintain your Beast Form indefinitely instead of for 1 minute. Your transformation becomes more complete, reflecting your growing mastery over your beastly nature.',
'passive', NULL, NULL, 'Beast Command', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 9: Pack Tactics
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Pack Tactics', 9,
'At 9th level, you and your beast allies fight as one. You have advantage on attack rolls against creatures if at least one of your allies (including charmed beasts) is within 5 feet of the creature and the ally isn''t incapacitated. Additionally, when a charmed beast you control hits a target, you can use your reaction to make a weapon attack against the same target. You fight with the coordination of an apex predator pack.',
'passive', NULL, NULL, 'Enhanced Transformation', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 10: Beast Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Storage', 10,
'Starting at 10th level, you can store your charmed beasts in a pocket dimension. As a bonus action, you can dismiss any number of your charmed beasts into storage. They remain in storage indefinitely and can be summoned back as a bonus action. While in storage, beasts don''t count toward your maximum limit. You can have a total number of stored and active beasts equal to twice your proficiency bonus. This allows you to maintain a reserve pack ready for battle.',
'bonus-action', NULL, NULL, 'Pack Tactics', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 11: Pack Alpha
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Pack Alpha', 11,
'At 11th level, you become the true alpha of your pack. As a bonus action, you can command all your charmed beasts within 120 feet to take the same action (Attack, Dash, Disengage, Dodge, or Help). Additionally, the maximum number of active beasts you can control increases to twice your proficiency bonus. Your charmed beasts have advantage on attack rolls when they outnumber their target. Your pack becomes a coordinated hunting force.',
'bonus-action', NULL, NULL, 'Beast Storage', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 12: Apex Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Apex Form', 12,
'Starting at 12th level, you can transform into the ultimate predator. As an action, you enter a perfect beast form for 1 minute. While in this form, you gain the following benefits: Your size becomes Large, your speed increases by 20 feet, you gain a +3 bonus to AC, your unarmed strikes deal 4d6 slashing damage, and you have advantage on all attack rolls. You can use this feature once per long rest. You become the true apex predator.',
'action', '1 per long rest', 'long-rest', 'Pack Alpha', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 13: Primal Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Primal Strike', 13,
'At 13th level, your attacks rend through any defense. When you hit a creature with an unarmed strike, the attack ignores resistance and immunity to slashing damage. Additionally, when you score a critical hit, the target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or have its maximum hit points reduced by an amount equal to the damage dealt. This reduction lasts until the target finishes a long rest. Your strikes leave lasting wounds like a true beast.',
'passive', NULL, NULL, 'Apex Form', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 14: Beast Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Monarch''s Presence', 14,
'Starting at 14th level, your mere presence commands all beasts. Beasts and monstrosities within 60 feet that have a challenge rating equal to or less than your level are automatically charmed by you unless they succeed on a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier). They obey your commands and act on your turn. Creatures that fail the save remain charmed for 24 hours. You command the respect of all creatures, like the true Beast Monarch.',
'passive', NULL, NULL, 'Primal Strike', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 15: Primal Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Primal Regeneration', 15,
'At 15th level, your beast nature grants incredible healing. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you reduce a creature to 0 hit points, you regain hit points equal to that creature''s challenge rating. You heal like a beast, with wounds closing almost instantly, reflecting the incredible durability of the Beast Monarch.',
'passive', NULL, NULL, 'Beast Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 16: Perfect Beast Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Beast Form', 16,
'Starting at 16th level, your Apex Form becomes perfect. You can use Apex Form twice per long rest, and while in it, your speed increases by 40 feet instead of 20, your unarmed strikes deal 5d6 slashing damage, and you can make three unarmed strikes when you take the Attack action. Additionally, you have resistance to all damage while in Apex Form. Your transformation reaches perfection.',
'passive', NULL, NULL, 'Primal Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 17: Eternal Pack
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Pack', 17,
'At 17th level, your charmed beasts become nearly immortal. When a charmed beast is reduced to 0 hit points, it doesn''t die immediately. Instead, it enters a primal rage and regains hit points equal to half its hit point maximum. It can only be permanently killed if reduced to 0 hit points while in this rage state. Additionally, your maximum active beasts increases to three times your proficiency bonus. Your pack becomes unstoppable, like a true Beast Monarch''s legion.',
'passive', NULL, NULL, 'Perfect Beast Form', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 18: Beast Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Overlord', 18,
'Starting at 18th level, you become the true overlord of all beasts. You can charm beasts and monstrosities of any challenge rating. Additionally, you can use your action to command all beasts and monstrosities within 300 feet of you, forcing them to make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier) or fall under your control for 24 hours. Once a creature succeeds, it is immune for 7 days. Your authority extends to all creatures, like the apex of all predators.',
'action', NULL, NULL, 'Eternal Pack', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 19: Perfect Predator
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Predator', 19,
'At 19th level, you achieve the perfect form of the Beast Monarch. As an action, you can enter your ultimate beast form for 1 minute. While in this form, you become Huge, gain immunity to all damage except psychic, and your unarmed strikes deal 6d6 slashing damage with a reach of 10 feet. Additionally, all your charmed beasts deal double damage while you are in this form. You can use this feature once per long rest. You become the ultimate apex predator.',
'action', '1 per long rest', 'long-rest', 'Beast Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- Level 20: Beast Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Beast Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Beast Monarch, matching the authority of the Umbral Monarch. You can charm an unlimited number of beasts and monstrosities, and they retain all their abilities and statistics. Additionally, you can use your action to command all beasts and monstrosities within 1 mile of you, with no limit on challenge rating. They must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Presence modifier) or fall under your control permanently until you release them. You can use this mass command once per long rest. You have become the true Monarch of Beasts, with power that commands all creatures. All beasts bow before the apex predator.',
'action', '1 mass command per long rest', 'long-rest', 'Perfect Predator', true
FROM compendium_monarchs m WHERE m.name = 'Beast Monarch'
ON CONFLICT (monarch_id, name) DO NOTHING;
-- =============================================
-- Continuing with remaining monarchs...
-- Each will have full 1-20 progressions with power equal to Umbral Monarch
-- Iron Body, Plague, Frost, Stone, Destruction (unlocks 11), White Flames, Transfiguration
-- =============================================;


