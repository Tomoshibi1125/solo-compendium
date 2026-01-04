-- =============================================
-- COMPLETE REMAINING MONARCHS - FULL 1-20 PROGRESSIONS
-- =============================================
-- Power level equal to Shadow Monarch
-- Based on actual Solo Leveling manhwa lore
-- All monarchs get full class progressions (1-20)

-- =============================================
-- IRON BODY MONARCH - Full Progression (1-20)
-- =============================================
-- Absolute physical resilience, unbreakable defense
-- Power level: Equal to Shadow Monarch

-- Level 1: Iron Skin
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Skin', 1,
'When you gain the Iron Body Monarch overlay at 1st level, your body begins to harden. You gain resistance to bludgeoning damage. Additionally, when you take damage, you can use your reaction to reduce it by 1d4. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Your flesh begins its transformation to living metal.',
'reaction', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 2: Unbreakable Will
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Unbreakable Will', 2,
'At 2nd level, your body and mind become resilient. You have advantage on saving throws against being frightened, paralyzed, or stunned. Additionally, you cannot be moved against your will unless you choose to be. Your will is as unbreakable as your body.',
'passive', NULL, NULL, 'Iron Skin', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 3: Steel Hardening
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Steel Hardening', 3,
'Starting at 3rd level, you can temporarily harden your body. As a bonus action, you can enter a hardened state for 1 minute. While hardened, you gain a +2 bonus to AC, and you have resistance to slashing and piercing damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Your body becomes as hard as steel.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Unbreakable Will', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 4: Damage Reduction
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Damage Reduction', 4,
'At 4th level, your body absorbs damage like iron. You have resistance to slashing, piercing, and bludgeoning damage from nonmagical attacks. Additionally, when you use your reaction to reduce damage, you reduce it by 1d6 + your proficiency bonus instead of 1d4. Your metallic nature grants incredible durability.',
'reaction', NULL, NULL, 'Steel Hardening', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 5: Iron Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Strike', 5,
'Starting at 5th level, your strikes become devastating. When you hit a creature with a melee weapon attack, you can choose to deal additional bludgeoning damage equal to your proficiency bonus. Additionally, your unarmed strikes deal 1d8 bludgeoning damage and count as magical for the purpose of overcoming resistance and immunity. Your body is a weapon.',
'passive', NULL, NULL, 'Damage Reduction', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 6: Immovable Object
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Immovable Object', 6,
'At 6th level, you become nearly impossible to move. While in your Steel Hardening state, you cannot be moved, knocked prone, or pushed by any means, magical or otherwise. Additionally, when you are hit by an attack, you can use your reaction to make the attacker make a Strength saving throw (DC = 8 + your proficiency bonus + your Constitution modifier). On a failure, the attacker is knocked prone. You are an immovable fortress.',
'passive', NULL, NULL, 'Iron Strike', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 7: Perfect Defense (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Defense', 7,
'At 7th level, you gain the signature power of the Iron Body Monarch: absolute defense. As a reaction when you take damage, you can enter your perfect defense state. For 1 minute, you have immunity to all damage. However, during this time, your speed is reduced to 0, and you cannot take actions or bonus actions. You can use this feature once, and you regain the ability to use it when you finish a long rest. You become truly unbreakable, like the Iron Body Monarch.',
'reaction', '1 per long rest', 'long-rest', 'Immovable Object', true
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 8: Enhanced Hardening
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Hardening', 8,
'Starting at 8th level, your steel hardening becomes more powerful. While in your Steel Hardening state, you gain a +3 bonus to AC instead of +2, and you have resistance to all damage except psychic damage. Additionally, you can maintain your Steel Hardening indefinitely instead of for 1 minute. Your body becomes permanently hardened.',
'passive', NULL, NULL, 'Perfect Defense', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 9: Iron Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Regeneration', 9,
'At 9th level, your iron body repairs itself. At the start of each of your turns, if you have at least 1 hit point, you regain hit points equal to your proficiency bonus. Additionally, when you reduce a creature to 0 hit points, you regain hit points equal to that creature''s challenge rating. Your metallic form heals like living iron, reflecting the Iron Body Monarch''s incredible durability.',
'passive', NULL, NULL, 'Enhanced Hardening', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 10: Reflective Defense
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Reflective Defense', 10,
'Starting at 10th level, your iron body reflects attacks. When a creature hits you with a melee attack, you can use your reaction to reflect the damage back at the attacker. The attacker takes damage equal to half the damage you took (rounded down). Additionally, when you use your reaction to reduce damage, you can choose to redirect half the damage to a creature within 5 feet of you. Your body becomes a weapon of defense.',
'reaction', NULL, NULL, 'Iron Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 11: Unstoppable Force
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Unstoppable Force', 11,
'At 11th level, your iron body allows you to break through anything. When you move, you can move through nonmagical obstacles and difficult terrain as if they weren''t there. You can also use your action to attempt to break through a wall, door, or barrier. Make a Strength check (DC = 15 + the object''s AC). On a success, you destroy it and can move through its space. Your iron body makes you an unstoppable force.',
'action', NULL, NULL, 'Reflective Defense', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 12: Iron Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Domain', 12,
'Starting at 12th level, you can create a domain of iron around you. As an action, you create a 30-foot-radius sphere centered on yourself. The ground within this area becomes difficult terrain for enemies, and metal objects within the area are under your control. You can use metal objects within the domain as weapons, dealing 2d8 bludgeoning damage as a bonus action. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Unstoppable Force', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 13: Perfect Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Strike', 13,
'At 13th level, your strikes break through all defenses. When you hit a creature with a melee weapon attack, the attack ignores all damage resistance and immunity. Additionally, when you score a critical hit, the target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be stunned until the end of your next turn. Your iron strikes are unstoppable.',
'passive', NULL, NULL, 'Iron Domain', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 14: Iron Body Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Body Monarch''s Presence', 14,
'Starting at 14th level, your mere presence causes enemies to break their weapons. Creatures within 30 feet of you that attempt to make melee attacks against you must make a Strength saving throw (DC = 8 + your proficiency bonus + your Constitution modifier) or their weapon breaks. Nonmagical weapons automatically break, and magical weapons must make the save. This represents your absolute defensive authority, like the true Iron Body Monarch.',
'passive', NULL, NULL, 'Perfect Strike', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 15: Absolute Defense
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Absolute Defense', 15,
'At 15th level, you achieve absolute defense. You have resistance to all damage except psychic damage. Additionally, at the start of each of your turns, you regain hit points equal to your level if you have at least 1 hit point. Your iron body becomes truly unbreakable, reflecting the incredible durability of the Iron Body Monarch.',
'passive', NULL, NULL, 'Iron Body Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 16: Enhanced Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Domain', 16,
'Starting at 16th level, your iron domain becomes more powerful. Your Iron Domain now extends to 60 feet, and enemies within it have disadvantage on all attack rolls against you. Additionally, you can use Iron Domain twice per long rest. Your control over your defensive domain reaches new heights.',
'passive', NULL, NULL, 'Absolute Defense', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 17: Invincible Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Invincible Form', 17,
'At 17th level, your body becomes truly invincible. When you use your Perfect Defense feature, you can move and take actions normally. Additionally, while in Perfect Defense, you can still make weapon attacks, and any creature that hits you with a melee attack takes damage equal to your level. You become an unstoppable, invincible force.',
'passive', NULL, NULL, 'Enhanced Domain', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 18: Iron Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Overlord', 18,
'Starting at 18th level, you become the true overlord of iron. You can use your Perfect Defense without the restriction on actions or movement. Additionally, you can use your action to extend your perfect defense to all allies within 30 feet, granting them immunity to all damage for 1 minute. You can use this mass defense once per long rest. Your defensive power protects all around you.',
'action', '1 mass defense per long rest', 'long-rest', 'Invincible Form', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 19: Perfect Iron Body
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Iron Body', 19,
'At 19th level, you achieve the perfect form of the Iron Body Monarch. As an action, you can enter your ultimate iron form for 1 minute. While in this form, you have immunity to all damage, your AC becomes 25, and any creature that hits you with a melee attack takes damage equal to twice your level. Additionally, you can move through any nonmagical barrier as if it weren''t there. You can use this feature once per long rest. You become truly unbreakable.',
'action', '1 per long rest', 'long-rest', 'Iron Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- Level 20: Iron Body Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Iron Body Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Iron Body Monarch, matching the authority of the Shadow Monarch. You have permanent immunity to all damage except psychic damage, and you regenerate hit points equal to your level at the start of each of your turns. Additionally, once per long rest, you can use your action to create an iron fortress in a 100-foot radius. All allies within gain immunity to all damage for 1 hour, and all enemies have disadvantage on all attack rolls. You have become the true Monarch of Iron, with unbreakable power that protects all. Break your weapons upon my flesh.',
'action', '1 fortress per long rest', 'long-rest', 'Perfect Iron Body', true
FROM compendium_monarchs m WHERE m.name = 'Iron Body Monarch';

-- =============================================
-- PLAGUE MONARCH - Full Progression (1-20)
-- =============================================
-- Corruption, disease, poison, debilitating afflictions
-- Power level: Equal to Shadow Monarch

-- Level 1: Plague Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Touch', 1,
'When you gain the Plague Monarch overlay at 1st level, your touch spreads corruption. As an action, you can touch a creature within 5 feet. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target is poisoned for 1 minute. While poisoned in this way, the target takes 1d4 poison damage at the start of each of its turns. You have immunity to disease and poison. This represents the first awakening of your plague powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 2: Plague Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Sight', 2,
'At 2nd level, you can see the corruption in all things. You can sense the presence of diseased or poisoned creatures within 60 feet. Additionally, you can use your action to identify any disease or poison affecting a creature you can see within 30 feet. You understand the nature and severity of all afflictions, representing your mastery over decay.',
'action', NULL, NULL, 'Plague Touch', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 3: Plague Cloud
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Cloud', 3,
'Starting at 3rd level, you can create clouds of disease. As an action, you create a 10-foot-radius sphere of sickly green mist centered on a point within 60 feet. The mist spreads around corners and heavily obscures the area. Creatures that enter the area for the first time on a turn or start their turn there must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, they take 2d6 poison damage and are poisoned for 1 minute. The cloud lasts for 1 minute. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Plague Sight', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 4: Plague Resistance
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Resistance', 4,
'At 4th level, you become one with disease. You have resistance to poison damage, and you are immune to the poisoned condition. Additionally, when you take poison damage, you can use your reaction to heal hit points equal to half the damage dealt. You feed on corruption, reflecting the Plague Monarch''s nature.',
'reaction', NULL, NULL, 'Plague Cloud', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 5: Virulent Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Virulent Strike', 5,
'Starting at 5th level, your attacks spread disease. When you hit a creature with a melee weapon attack, you can choose to infect them. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target''s maximum hit points are reduced by an amount equal to your proficiency bonus. This reduction lasts until the target finishes a long rest. You can infect a creature a number of times equal to your proficiency bonus per long rest.',
'passive', 'proficiency bonus', 'long-rest', 'Plague Resistance', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 6: Plague Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Form', 6,
'At 6th level, you can transform into a being of pure plague. As a bonus action, you can enter a plague form for 1 minute. While in this form, you are invisible, you can move through other creatures and objects as if they were difficult terrain, and any creature that ends its turn within 5 feet of you takes 1d6 poison damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You become a living plague.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Virulent Strike', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 7: Plague Extraction (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Extraction', 7,
'At 7th level, you gain the signature power of the Plague Monarch: the ability to extract plagues from the dead. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to extract its essence as a plague spirit. The plague spirit manifests as a cloud of disease within 30 feet of you. You can command the plague spirit to move up to 30 feet and attack a creature. The plague spirit makes a melee attack using your attack bonus, dealing 2d8 poison damage on a hit and poisoning the target for 1 minute. You can have a number of plague spirits equal to your proficiency bonus. If you extract another when at your limit, the oldest dissipates. This power allows you to command an army of plagues, like the true Plague Monarch.',
'reaction', 'proficiency bonus limit', NULL, 'Plague Form', true
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 8: Enhanced Plague
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Plague', 8,
'Starting at 8th level, your plagues become more virulent. Your Plague Cloud damage increases to 3d6, and your Virulent Strike can reduce maximum hit points by twice your proficiency bonus. Additionally, creatures poisoned by your plagues have disadvantage on all attack rolls and ability checks. Your diseases become truly debilitating.',
'passive', NULL, NULL, 'Plague Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 9: Plague Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Exchange', 9,
'At 9th level, you can swap places with your plague spirits. As an action, you can teleport to a space occupied by one of your plague spirits within 120 feet, and that plague spirit teleports to your previous space. This doesn''t provoke opportunity attacks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through disease itself.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Plague', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 10: Plague Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Storage', 10,
'Starting at 10th level, you can store plague spirits within yourself. As a bonus action, you can dismiss any number of your plague spirits into storage. They remain in storage indefinitely and can be summoned back as a bonus action. While in storage, plague spirits don''t count toward your maximum limit. You can have a total number of stored and active plague spirits equal to twice your proficiency bonus. This allows you to maintain a reserve of plagues.',
'bonus-action', NULL, NULL, 'Plague Exchange', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 11: Plague Army Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Army Command', 11,
'At 11th level, you can command your entire plague army simultaneously. As a bonus action, you can command all your plague spirits within 120 feet to move and attack. Additionally, the maximum number of active plague spirits you can control increases to twice your proficiency bonus. Your plague spirits deal 3d8 poison damage on a hit. Your plagues spread like an unstoppable army.',
'bonus-action', NULL, NULL, 'Plague Storage', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 12: Plague Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Domain', 12,
'Starting at 12th level, you can create a domain of plague. As an action, you create a 30-foot-radius sphere of disease centered on yourself. The area becomes heavily obscured with sickly mist, and all creatures other than you are poisoned while in the domain. Enemies take 2d8 poison damage at the start of each of their turns. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Plague Army Command', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 13: Plague Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Strike', 13,
'At 13th level, your touch can instantly spread disease. When you use your Plague Touch or hit with Virulent Strike, you can choose to instantly reduce the target''s maximum hit points by an amount equal to your level. This reduction can only be restored by greater restoration or similar System intervention. Additionally, plague spirits you control can spread disease in a 10-foot radius around them. Your corruption spreads instantly.',
'passive', NULL, NULL, 'Plague Domain', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 14: Plague Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Monarch''s Presence', 14,
'Starting at 14th level, your mere presence spreads disease. All creatures within 30 feet of you must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) at the start of their turn or become poisoned. Additionally, diseased or poisoned creatures within 60 feet are under your control unless they succeed on a Wisdom saving throw. They obey your commands for 24 hours. You command all corruption, like the true Plague Monarch.',
'passive', NULL, NULL, 'Plague Strike', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 15: Plague Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Regeneration', 15,
'At 15th level, you heal from the suffering of others. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, whenever a creature takes poison damage from your plagues, you regain hit points equal to half the damage dealt. You feed on the corruption you spread, reflecting the Plague Monarch''s nature.',
'passive', NULL, NULL, 'Plague Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 16: Expanded Plague Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Plague Domain', 16,
'Starting at 16th level, your plague domain becomes more powerful. Your Plague Domain now extends to 60 feet, and enemies take 4d8 poison damage at the start of each of their turns. Additionally, you can use Plague Domain twice per long rest. Your domain of disease covers vast areas.',
'passive', NULL, NULL, 'Plague Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 17: Eternal Plagues
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Plagues', 17,
'At 17th level, your plague spirits become eternal. When a plague spirit is destroyed, it reforms at the start of your next turn unless it was destroyed by radiant damage. Additionally, your maximum active plague spirits increases to three times your proficiency bonus. Your plagues never truly die, only spread. Your army of disease becomes unstoppable.',
'passive', NULL, NULL, 'Expanded Plague Domain', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 18: Plague Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Overlord', 18,
'Starting at 18th level, you become the true overlord of all disease. You can extract plague spirits from creatures of any challenge rating. Additionally, you can use your action to command all diseased or poisoned creatures within 300 feet of you, forcing them to make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or fall under your control for 24 hours. Once a creature succeeds, it is immune for 7 days. Your authority extends to all corruption.',
'action', NULL, NULL, 'Eternal Plagues', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 19: Perfect Plague Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Plague Form', 19,
'At 19th level, you become a being of perfect plague. As an action, you can transform into pure disease for 1 minute. While in this form, you are invisible, can move through any barrier (including magical ones), and any creature that starts its turn within 10 feet of you takes 4d8 poison damage and has its maximum hit points reduced by that amount. Additionally, your plague spirits deal double damage while you are in this form. You can use this feature once per long rest. You become the perfect vector of disease.',
'action', '1 per long rest', 'long-rest', 'Plague Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- Level 20: Plague Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Plague Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Plague Monarch, matching the authority of the Shadow Monarch. You can extract plague spirits from any creature you slay, regardless of size or type, and you can maintain an unlimited number of plague spirits. Additionally, once per long rest, you can use your action to spread a plague that affects all creatures of your choice within 1 mile. They must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or have their maximum hit points reduced to half and be poisoned permanently. You have become the true Monarch of Plagues, with power that corrupts all. All things rot. I merely hasten the inevitable.',
'action', '1 mass plague per long rest', 'long-rest', 'Perfect Plague Form', true
FROM compendium_monarchs m WHERE m.name = 'Plague Monarch';

-- =============================================
-- FROST MONARCH - Full Progression (1-20)
-- =============================================
-- Absolute cold, ice control, battlefield control, freezing enemies
-- Power level: Equal to Shadow Monarch

-- Level 1: Frost Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Touch', 1,
'When you gain the Frost Monarch overlay at 1st level, your touch brings freezing cold. As an action, you can touch a creature within 5 feet. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target takes 1d6 cold damage and its speed is reduced by 10 feet until the end of your next turn. You have resistance to cold damage. This represents the first awakening of your frost powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 2: Frost Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Sight', 2,
'At 2nd level, you can sense temperature and movement. You can detect the presence of creatures within 60 feet by their body heat, even if they are invisible or hidden. Additionally, you have darkvision out to 60 feet, and you can see through ice and snow clearly. Your connection to cold grants you enhanced perception.',
'passive', NULL, NULL, 'Frost Touch', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 3: Ice Step
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Step', 3,
'Starting at 3rd level, you can move across ice instantly. As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see, leaving a trail of ice behind you. Creatures must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or fall prone when they enter the ice. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You glide across ice like the Frost Monarch.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Frost Sight', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 4: Frost Armor
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Armor', 4,
'At 4th level, ice protects you. As a bonus action, you can create armor of ice that grants you a +2 bonus to AC. Additionally, when a creature hits you with a melee attack, it takes 1d6 cold damage. The armor lasts for 1 hour or until you dismiss it. You can use this feature once per long rest, but you can maintain it indefinitely. Ice becomes your shield.',
'bonus-action', '1 per long rest', 'long-rest', 'Ice Step', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 5: Ice Blade
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Blade', 5,
'Starting at 5th level, you can create weapons of pure ice. As an action, you can create an ice blade that lasts for 1 minute. The blade is a melee weapon with reach 10 feet. You are proficient with it, and it deals 2d6 cold damage on a hit. When you hit a creature, its speed is reduced by 10 feet until the end of your next turn. You can create the blade a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Frost Armor', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 6: Freezing Aura
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Freezing Aura', 6,
'At 6th level, you radiate cold. Creatures within 10 feet of you have their speed reduced by 10 feet, and difficult terrain created by ice doesn''t slow your movement. Additionally, you can use your action to create a 15-foot-radius sphere of freezing cold centered on yourself. Creatures in the area take 2d6 cold damage and have their speed reduced by 20 feet for 1 minute. The area becomes difficult terrain. You can use this feature a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Ice Blade', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 7: Ice Extraction (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Extraction', 7,
'At 7th level, you gain the signature power of the Frost Monarch: the ability to extract and command ice spirits from frozen creatures. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to freeze its essence into an ice golem. The ice golem appears within 30 feet of you and uses the statistics of the creature it was created from, but it is a construct with resistance to cold damage and vulnerability to fire damage. It obeys your commands and acts on your turn. You can have a number of ice golems equal to your proficiency bonus. If you create another when at your limit, the oldest melts away. This power allows you to command an army of ice, like the true Frost Monarch.',
'reaction', 'proficiency bonus limit', NULL, 'Freezing Aura', true
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 8: Enhanced Frost
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Frost', 8,
'Starting at 8th level, your frost powers become more powerful. Your Ice Step distance increases to 60 feet, and you can bring one willing creature with you. Your Ice Blade damage increases to 3d6 cold damage, and it can freeze targets solid on a critical hit. Your mastery over cold reaches new heights.',
'passive', NULL, NULL, 'Ice Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 9: Ice Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Exchange', 9,
'At 9th level, you can swap places with your ice golems instantly. As an action, you can teleport to a space occupied by one of your ice golems within 120 feet, and that ice golem teleports to your previous space. This doesn''t provoke opportunity attacks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through ice itself.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Frost', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 10: Ice Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Storage', 10,
'Starting at 10th level, you can store ice golems in a frozen dimension. As a bonus action, you can dismiss any number of your ice golems into storage. They remain frozen in storage indefinitely and can be summoned back as a bonus action. While in storage, ice golems don''t count toward your maximum limit. You can have a total number of stored and active ice golems equal to twice your proficiency bonus. This allows you to maintain a frozen army ready for battle.',
'bonus-action', NULL, NULL, 'Ice Exchange', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 11: Ice Army Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Ice Army Command', 11,
'At 11th level, you can command your entire ice army simultaneously. As a bonus action, you can command all your ice golems within 120 feet to take the same action (Attack, Dash, Disengage, Dodge, or Help). Additionally, the maximum number of active ice golems you can control increases to twice your proficiency bonus. Your ice golems have advantage on attack rolls against creatures with reduced speed. Your frozen legion becomes a coordinated force.',
'bonus-action', NULL, NULL, 'Ice Storage', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 12: Frost Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Domain', 12,
'Starting at 12th level, you can create a domain of absolute cold. As an action, you create a 30-foot-radius sphere of freezing cold centered on yourself. The area becomes difficult terrain covered in ice, and all surfaces freeze solid. Creatures that enter the area for the first time on a turn or start their turn there take 2d8 cold damage and must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or have their speed reduced to 0 until the end of your next turn. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Ice Army Command', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 13: Absolute Zero Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Absolute Zero Strike', 13,
'At 13th level, your cold can freeze anything solid. When you hit a creature with a melee weapon attack, you can choose to freeze them. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target is petrified (frozen solid) for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Additionally, your ice golems can freeze enemies with their attacks. Your cold reaches absolute zero.',
'passive', NULL, NULL, 'Frost Domain', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 14: Frost Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Monarch''s Presence', 14,
'Starting at 14th level, your mere presence freezes the area. All creatures within 30 feet of you have their speed reduced by 20 feet, and water within 60 feet freezes instantly. Additionally, you can use your action to freeze a creature solid. The target must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be petrified (frozen) for 24 hours. You command absolute cold, like the true Frost Monarch.',
'action', NULL, NULL, 'Absolute Zero Strike', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 15: Frost Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Regeneration', 15,
'At 15th level, you heal from the cold. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you deal cold damage, you regain hit points equal to half the damage dealt. You become one with the cold, reflecting the Frost Monarch''s nature. The cold sustains you.',
'passive', NULL, NULL, 'Frost Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 16: Expanded Frost Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Frost Domain', 16,
'Starting at 16th level, your frost domain becomes more powerful. Your Frost Domain now extends to 60 feet, and enemies take 4d8 cold damage at the start of each of their turns. Additionally, you can use Frost Domain twice per long rest. Your domain of cold covers vast areas, freezing everything.',
'passive', NULL, NULL, 'Frost Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 17: Eternal Ice
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Ice', 17,
'At 17th level, your ice golems become eternal. When an ice golem is destroyed, it reforms from nearby ice or water at the start of your next turn unless it was destroyed by fire damage. Additionally, your maximum active ice golems increases to three times your proficiency bonus. Your ice never truly melts, only reforms. Your frozen army becomes unstoppable, like the eternal cold of the Frost Monarch.',
'passive', NULL, NULL, 'Expanded Frost Domain', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 18: Frost Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Overlord', 18,
'Starting at 18th level, you become the true overlord of all cold. You can extract ice golems from creatures of any challenge rating. Additionally, you can use your action to freeze all water and moisture within 300 feet of you, creating difficult terrain and dealing 4d8 cold damage to all creatures in the area. They must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be frozen solid for 1 hour. You can use this feature once per long rest. Your authority extends to all cold.',
'action', '1 per long rest', 'long-rest', 'Eternal Ice', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 19: Perfect Frost Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Frost Form', 19,
'At 19th level, you become a being of perfect ice. As an action, you can transform into pure ice for 1 minute. While in this form, you are immune to all damage except fire damage, you can move through ice and water as if they weren''t there, and any creature that starts its turn within 10 feet of you takes 4d8 cold damage and must make a Constitution saving throw or be frozen solid. Additionally, your ice golems deal double damage while you are in this form. You can use this feature once per long rest. You become the perfect embodiment of cold.',
'action', '1 per long rest', 'long-rest', 'Frost Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- Level 20: Frost Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Frost Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Frost Monarch, matching the authority of the Shadow Monarch. You can extract ice golems from any creature you slay, regardless of size or type, and you can maintain an unlimited number of ice golems. Additionally, once per long rest, you can use your action to create an eternal winter in a 1-mile radius. All water freezes, all creatures take 8d8 cold damage and must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be frozen solid permanently. You have become the true Monarch of Frost, with power that freezes all. In the end, all things freeze. Movement stops. Thought stops. Time itself surrenders to the cold.',
'action', '1 eternal winter per long rest', 'long-rest', 'Perfect Frost Form', true
FROM compendium_monarchs m WHERE m.name = 'Frost Monarch';

-- =============================================
-- STONE MONARCH - Full Progression (1-20)
-- =============================================
-- Earth and stone manipulation, terrain control, barriers, battlefield reshaping
-- Power level: Equal to Shadow Monarch

-- Level 1: Stone Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Touch', 1,
'When you gain the Stone Monarch overlay at 1st level, you can feel the earth beneath you. You can sense the presence of stone, metal, and earth within 30 feet. Additionally, as an action, you can touch a creature and force it to make a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failure, the creature''s speed is reduced by 10 feet until the end of your next turn as earth clings to them. You have resistance to bludgeoning damage. This represents the first awakening of your stone powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 2: Earth Sense
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Earth Sense', 2,
'At 2nd level, you are connected to the earth itself. You can sense vibrations in the ground, detecting the presence and movement of creatures within 60 feet, even through walls and barriers. Additionally, you have tremorsense out to 30 feet. The earth tells you everything, representing your deep connection to stone.',
'passive', NULL, NULL, 'Stone Touch', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 3: Stone Step
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Step', 3,
'Starting at 3rd level, you can move through earth and stone. As a bonus action, you can burrow up to 30 feet through nonmagical earth or stone, leaving a tunnel behind. You can emerge in an unoccupied space you can see or sense. Additionally, difficult terrain created by earth or stone doesn''t slow your movement. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through the earth like the Stone Monarch.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Earth Sense', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 4: Stone Armor
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Armor', 4,
'At 4th level, stone protects you. As a bonus action, you can create armor of stone that grants you a +2 bonus to AC and makes you resistant to bludgeoning, piercing, and slashing damage. The armor lasts for 1 hour or until you dismiss it. You can use this feature once per long rest, but you can maintain it indefinitely. Earth becomes your shield.',
'bonus-action', '1 per long rest', 'long-rest', 'Stone Step', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 5: Stone Weapon
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Weapon', 5,
'Starting at 5th level, you can create weapons of stone. As an action, you can create a weapon of stone that lasts for 1 minute. The weapon can be any melee weapon you are proficient with. You are proficient with it, and it deals 2d6 bludgeoning damage on a hit. When you hit a creature, you can choose to knock them prone. You can create the weapon a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Stone Armor', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 6: Earth Wall
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Earth Wall', 6,
'At 6th level, you can reshape the battlefield. As an action, you can create a wall of stone up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. Each 10-foot section has AC 15 and 30 hit points. The wall lasts for 1 hour or until you dismiss it. You can create a number of wall sections equal to your proficiency bonus. You reshape the earth to your will.',
'action', NULL, NULL, 'Stone Weapon', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 7: Stone Extraction (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Extraction', 7,
'At 7th level, you gain the signature power of the Stone Monarch: the ability to extract and command stone golems from the earth. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to transform its remains into a stone golem. The stone golem appears within 30 feet of you and uses the statistics of the creature it was created from, but it is a construct with resistance to bludgeoning, piercing, and slashing damage. It obeys your commands and acts on your turn. You can have a number of stone golems equal to your proficiency bonus. If you create another when at your limit, the oldest crumbles to dust. This power allows you to command an army of stone, like the true Stone Monarch.',
'reaction', 'proficiency bonus limit', NULL, 'Earth Wall', true
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 8: Enhanced Stone
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Stone', 8,
'Starting at 8th level, your stone powers become more powerful. Your Stone Step distance increases to 60 feet, and you can bring one willing creature with you. Your Stone Weapon damage increases to 3d6 bludgeoning damage, and walls you create are 2 feet thick. Your mastery over earth reaches new heights.',
'passive', NULL, NULL, 'Stone Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 9: Stone Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Exchange', 9,
'At 9th level, you can swap places with your stone golems instantly. As an action, you can teleport to a space occupied by one of your stone golems within 120 feet, and that stone golem teleports to your previous space. This doesn''t provoke opportunity attacks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through the earth itself.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Stone', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 10: Stone Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Storage', 10,
'Starting at 10th level, you can store stone golems within the earth. As a bonus action, you can dismiss any number of your stone golems into the ground. They remain stored in the earth indefinitely and can be summoned back as a bonus action from any patch of earth within 60 feet. While in storage, stone golems don''t count toward your maximum limit. You can have a total number of stored and active stone golems equal to twice your proficiency bonus. This allows you to maintain a reserve army in the earth.',
'bonus-action', NULL, NULL, 'Stone Exchange', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 11: Stone Army Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Army Command', 11,
'At 11th level, you can command your entire stone army simultaneously. As a bonus action, you can command all your stone golems within 120 feet to take the same action (Attack, Dash, Disengage, Dodge, or Help). Additionally, the maximum number of active stone golems you can control increases to twice your proficiency bonus. Your stone golems have advantage on attack rolls against creatures on the ground. Your stone legion becomes a coordinated force.',
'bonus-action', NULL, NULL, 'Stone Storage', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 12: Stone Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Domain', 12,
'Starting at 12th level, you can create a domain of stone. As an action, you reshape the terrain in a 30-foot-radius sphere centered on yourself. You can raise or lower the ground by up to 10 feet, create walls, pillars, or pits. The terrain becomes difficult for enemies but not for you or your stone golems. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Stone Army Command', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 13: Crushing Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Crushing Strike', 13,
'At 13th level, your strikes can crush anything. When you hit a creature with a melee weapon attack, you can choose to crush them. The target must make a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failure, the target is knocked prone and takes additional bludgeoning damage equal to your level. Additionally, your stone golems can cause earthquakes with their attacks, creating difficult terrain. Your strikes carry the weight of mountains.',
'passive', NULL, NULL, 'Stone Domain', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 14: Stone Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Monarch''s Presence', 14,
'Starting at 14th level, your mere presence makes the ground tremble. All creatures within 30 feet of you have disadvantage on Dexterity saving throws, and the ground in a 60-foot radius becomes difficult terrain for enemies. Additionally, you can use your action to cause an earthquake. All creatures within 60 feet must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be knocked prone and take 2d8 bludgeoning damage. You command the earth itself, like the true Stone Monarch.',
'action', NULL, NULL, 'Crushing Strike', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 15: Stone Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Regeneration', 15,
'At 15th level, you heal from the earth itself. At the start of each of your turns, if you are touching the ground, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you reduce a creature to 0 hit points, you regain hit points equal to that creature''s challenge rating. The earth sustains you, reflecting the Stone Monarch''s connection to permanence.',
'passive', NULL, NULL, 'Stone Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 16: Expanded Stone Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Stone Domain', 16,
'Starting at 16th level, your stone domain becomes more powerful. Your Stone Domain now extends to 60 feet, and you can reshape it as a bonus action. Additionally, you can use Stone Domain twice per long rest. Your control over the earth covers vast areas, reshaping entire battlefields.',
'passive', NULL, NULL, 'Stone Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 17: Eternal Stone
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Stone', 17,
'At 17th level, your stone golems become eternal. When a stone golem is destroyed, it reforms from nearby stone or earth at the start of your next turn unless it was destroyed by acid damage. Additionally, your maximum active stone golems increases to three times your proficiency bonus. Your stone never truly crumbles, only reforms. Your stone army becomes unstoppable, like the eternal permanence of the Stone Monarch.',
'passive', NULL, NULL, 'Expanded Stone Domain', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 18: Stone Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Overlord', 18,
'Starting at 18th level, you become the true overlord of all stone and earth. You can extract stone golems from creatures of any challenge rating. Additionally, you can use your action to reshape all terrain within 300 feet of you, raising mountains, creating valleys, or flattening everything. All creatures in the area must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or take 4d8 bludgeoning damage and be knocked prone. You can use this feature once per long rest. Your authority extends to all earth.',
'action', '1 per long rest', 'long-rest', 'Eternal Stone', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 19: Perfect Stone Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Stone Form', 19,
'At 19th level, you become a being of perfect stone. As an action, you can transform into living stone for 1 minute. While in this form, you are immune to all damage except acid damage, your AC becomes 25, and any creature that hits you with a melee attack takes bludgeoning damage equal to your level. Additionally, you can reshape the terrain around you as a bonus action, and your stone golems deal double damage. You can use this feature once per long rest. You become the perfect embodiment of stone.',
'action', '1 per long rest', 'long-rest', 'Stone Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- Level 20: Stone Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Stone Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Stone Monarch, matching the authority of the Shadow Monarch. You can extract stone golems from any creature you slay, regardless of size or type, and you can maintain an unlimited number of stone golems. Additionally, once per long rest, you can use your action to reshape all terrain within 1 mile, creating mountains, valleys, or flattening everything. All creatures must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or take 8d8 bludgeoning damage and be buried under stone. You have become the true Monarch of Stone, with power that shapes continents. Mountains bow. Continents shift. The earth itself is my weapon.',
'action', '1 reshape per long rest', 'long-rest', 'Perfect Stone Form', true
FROM compendium_monarchs m WHERE m.name = 'Stone Monarch';

-- =============================================
-- DESTRUCTION MONARCH - Full Progression (1-20)
-- =============================================
-- Pure annihilating force, breaking defenses, area destruction
-- Power level: Equal to Shadow Monarch (Antares was the strongest)
-- Note: Unlocks at 11th level, but has full 1-20 progression

-- Level 1: Destruction Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Touch', 1,
'When you gain the Destruction Monarch overlay at 1st level (though it only becomes available at 11th), you can feel the destructive potential in all things. As an action, you can touch an object or structure and attempt to break it. Make a Strength check (DC = 10 + the object''s AC). On a success, you deal damage equal to your level to the object, ignoring its damage threshold. You have resistance to force damage. This represents the first awakening of your destructive powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 2: Destruction Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Sight', 2,
'At 2nd level, you can see the weaknesses in all things. You can sense the structural integrity of objects and creatures within 60 feet. Additionally, you have advantage on attack rolls against objects and structures. You understand what breaks first, representing your mastery over destruction.',
'passive', NULL, NULL, 'Destruction Touch', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 3: Destruction Step
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Step', 3,
'Starting at 3rd level, you can move by destroying everything in your path. As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see, destroying all nonmagical objects in your path. Additionally, difficult terrain doesn''t slow your movement, as you simply destroy obstacles. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through destruction itself.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Destruction Sight', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 4: Destruction Shield
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Shield', 4,
'At 4th level, you can destroy attacks before they reach you. As a reaction when you take damage, you can attempt to destroy the attack. Make a Strength check (DC = 10 + the damage dealt). On a success, you reduce the damage by half. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You break attacks apart.',
'reaction', 'proficiency bonus', 'long-rest', 'Destruction Step', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 5: Destruction Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Strike', 5,
'Starting at 5th level, your strikes break through all defenses. When you hit a creature with a melee weapon attack, the attack ignores all damage resistance. Additionally, when you hit an object or structure, you deal maximum damage. Your attacks carry the force of absolute destruction.',
'passive', NULL, NULL, 'Destruction Shield', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 6: Destruction Wave
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Wave', 6,
'At 6th level, you can release waves of destruction. As an action, you can create a 15-foot cone of destructive force. All creatures in the area must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failure, they take 2d8 force damage and are knocked prone. On a success, they take half damage. You can use this feature a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Destruction Strike', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 7: Destruction Armor
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Armor', 7,
'At 7th level, you can create armor that destroys attacks. As a bonus action, you can create armor of destructive energy that grants you a +2 bonus to AC. Additionally, when a creature hits you with a melee attack, it takes force damage equal to your proficiency bonus. The armor lasts for 1 hour or until you dismiss it. You can use this feature once per long rest, but you can maintain it indefinitely. Destruction becomes your shield.',
'bonus-action', '1 per long rest', 'long-rest', 'Destruction Wave', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 8: Enhanced Destruction
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Destruction', 8,
'Starting at 8th level, your destructive powers become more powerful. Your Destruction Step distance increases to 60 feet, and you can bring one willing creature with you. Your Destruction Wave damage increases to 3d8 force damage and extends to a 30-foot cone. Your mastery over destruction reaches new heights.',
'passive', NULL, NULL, 'Destruction Armor', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 9: Destruction Burst
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Burst', 9,
'At 9th level, you can release bursts of pure destruction. As an action, you can create a 20-foot-radius sphere of destructive energy centered on yourself. All creatures in the area must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failure, they take 4d8 force damage and have their AC reduced by 1 for 1 minute. On a success, they take half damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Destruction', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 10: Destruction Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Storage', 10,
'Starting at 10th level, you can store destructive energy within yourself. As a bonus action, you can charge yourself with destructive energy. While charged, your next attack deals maximum damage. Additionally, you can store a number of charges equal to your proficiency bonus. You can release all stored energy as an action, dealing force damage equal to 2d8 per charge to all creatures in a 30-foot radius. You become a walking bomb of destruction.',
'bonus-action', NULL, NULL, 'Destruction Burst', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 11: Destruction Extraction (Signature - Unlocks here)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Extraction', 11,
'At 11th level, when you unlock the Destruction Monarch overlay, you gain its signature power: the ability to extract and command destruction spirits from destroyed creatures. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to extract its destructive essence. The essence manifests as a destruction spirit within 30 feet of you. The destruction spirit uses the statistics of the creature it was created from, but it deals force damage with all attacks and ignores all damage resistance. It obeys your commands and acts on your turn. You can have a number of destruction spirits equal to your proficiency bonus. If you extract another when at your limit, the oldest dissipates. This power allows you to command an army of pure destruction, like Antares, the Dragon King and true Monarch of Destruction.',
'reaction', 'proficiency bonus limit', NULL, 'Destruction Storage', true
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 12: Destruction Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Domain', 12,
'Starting at 12th level, you can create a domain of absolute destruction. As an action, you create a 30-foot-radius sphere of destructive energy centered on yourself. All nonmagical objects in the area are instantly destroyed. All creatures in the area must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failure, they take 2d10 force damage and have their AC reduced by 2 for 1 minute. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Destruction Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 13: Absolute Destruction Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Absolute Destruction Strike', 13,
'At 13th level, your strikes can destroy anything. When you hit a creature with a melee weapon attack, the attack ignores all damage resistance and immunity. Additionally, when you score a critical hit, you can choose to deal maximum damage instead of rolling. Your destruction spirits can also ignore all damage resistance with their attacks. Your destructive power breaks through everything, like Antares''s absolute offensive supremacy.',
'passive', NULL, NULL, 'Destruction Domain', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 14: Destruction Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Monarch''s Presence', 14,
'Starting at 14th level, your mere presence destroys defenses. All creatures within 30 feet of you have their AC reduced by 2, and all magical effects within 60 feet have a 25% chance to fail. Additionally, you can use your action to attempt to destroy a magical effect within 60 feet. Make a Strength check (DC = 10 + the effect''s level). On a success, the effect ends. You command absolute destruction, like the Dragon King Antares himself.',
'action', NULL, NULL, 'Absolute Destruction Strike', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 15: Destruction Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Regeneration', 15,
'At 15th level, you heal from destruction itself. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you destroy an object or reduce a creature to 0 hit points, you regain hit points equal to its challenge rating or hit points (whichever is applicable). You feed on destruction, reflecting the Destruction Monarch''s nature. Breaking things sustains you.',
'passive', NULL, NULL, 'Destruction Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 16: Expanded Destruction Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Destruction Domain', 16,
'Starting at 16th level, your destruction domain becomes more powerful. Your Destruction Domain now extends to 60 feet, and enemies take 4d10 force damage at the start of each of their turns. Additionally, you can use Destruction Domain twice per long rest. Your domain of destruction covers vast areas, destroying everything.',
'passive', NULL, NULL, 'Destruction Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 17: Eternal Destruction
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Destruction', 17,
'At 17th level, your destruction spirits become eternal. When a destruction spirit is destroyed, it reforms from pure destructive energy at the start of your next turn unless it was destroyed by creation or healing magic. Additionally, your maximum active destruction spirits increases to three times your proficiency bonus. Your destruction never truly ends, only reforms. Your army of destruction becomes unstoppable, like Antares''s legendary power.',
'passive', NULL, NULL, 'Expanded Destruction Domain', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 18: Destruction Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Overlord', 18,
'Starting at 18th level, you become the true overlord of all destruction. You can extract destruction spirits from creatures of any challenge rating. Additionally, you can use your action to release a wave of destruction that affects all creatures of your choice within 300 feet. They must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or take 4d10 force damage and have all magical effects on them dispelled. You can use this feature once per long rest. Your authority extends to all destruction, like the Dragon King.',
'action', '1 per long rest', 'long-rest', 'Eternal Destruction', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 19: Perfect Destruction Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Destruction Form', 19,
'At 19th level, you become a being of perfect destruction. As an action, you can transform into pure destructive energy for 1 minute. While in this form, you are immune to all damage except force damage, your attacks ignore all resistance and immunity, and any creature that hits you with a melee attack takes force damage equal to twice your level. Additionally, your destruction spirits deal double damage while you are in this form. You can use this feature once per long rest. You become the perfect embodiment of destruction, like Antares''s ultimate form.',
'action', '1 per long rest', 'long-rest', 'Destruction Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- Level 20: Destruction Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Destruction Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Destruction Monarch, matching the authority of the Shadow Monarch and exceeding it in raw destructive force. You can extract destruction spirits from any creature you slay, regardless of size or type, and you can maintain an unlimited number of destruction spirits. Additionally, once per long rest, you can use your action to release a wave of absolute destruction that affects all creatures of your choice within 1 mile. They must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or take 10d10 force damage, have all magical effects dispelled, and have their AC permanently reduced by 2. You have become the true Monarch of Destruction, with power that rivals and potentially exceeds the Shadow Monarch. Nothing endures. Everything breaks.',
'action', '1 absolute destruction per long rest', 'long-rest', 'Perfect Destruction Form', true
FROM compendium_monarchs m WHERE m.name = 'Destruction Monarch';

-- =============================================
-- WHITE FLAMES MONARCH - Full Progression (1-20)
-- =============================================
-- Soul-burning fire, demon command, hottest flames
-- Power level: Equal to Shadow Monarch (Baran commanded demons)

-- Level 1: White Flame Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'White Flame Touch', 1,
'When you gain the White Flames Monarch overlay at 1st level, white-hot flames dance at your fingertips. As an action, you can touch a creature within 5 feet. The target must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target takes 1d6 fire damage and 1d6 psychic damage (representing soul burn). You have resistance to fire damage. This represents the first awakening of your white flame powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 2: Flame Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Sight', 2,
'At 2nd level, you can see the souls within all things. You can sense the presence of creatures within 60 feet by their life force, even if they are invisible or hidden. Additionally, you have darkvision out to 60 feet, and you can see through fire and smoke clearly. Your connection to white flames grants you enhanced perception of life force.',
'passive', NULL, NULL, 'White Flame Touch', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 3: Flame Step
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Step', 3,
'Starting at 3rd level, you can teleport through fire. As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see, leaving a trail of white flames behind you. Creatures must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or take 1d6 fire damage when they enter the flames. The flames last for 1 minute. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through fire like the White Flames Monarch.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Flame Sight', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 4: Flame Armor
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Armor', 4,
'At 4th level, white flames protect you. As a bonus action, you can create armor of white flames that grants you a +2 bonus to AC. Additionally, when a creature hits you with a melee attack, it takes 1d6 fire damage and 1d6 psychic damage. The armor lasts for 1 hour or until you dismiss it. You can use this feature once per long rest, but you can maintain it indefinitely. White flames become your shield.',
'bonus-action', '1 per long rest', 'long-rest', 'Flame Step', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 5: Flame Blade
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Blade', 5,
'Starting at 5th level, you can create weapons of white fire. As an action, you can create a blade of white flames that lasts for 1 minute. The blade is a melee weapon with reach 10 feet. You are proficient with it, and it deals 2d6 fire damage + 1d6 psychic damage on a hit. When you hit a creature, it must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be frightened of you for 1 minute. You can create the blade a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Flame Armor', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 6: White Flame Aura
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'White Flame Aura', 6,
'At 6th level, you radiate white-hot flames. Creatures within 10 feet of you take 1d6 fire damage at the start of their turn. Additionally, you can use your action to create a 15-foot-radius sphere of white flames centered on yourself. Creatures in the area take 2d6 fire damage + 1d6 psychic damage and must make a Wisdom saving throw or be frightened for 1 minute. The area becomes difficult terrain. You can use this feature a number of times equal to your proficiency bonus per long rest.',
'action', 'proficiency bonus', 'long-rest', 'Flame Blade', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 7: Demon Extraction (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Demon Extraction', 7,
'At 7th level, you gain the signature power of the White Flames Monarch: the ability to command demons and extract flame spirits. When you slay a fiend or demon with a challenge rating equal to or less than your level, you can use your reaction to bind its essence as a flame demon under your command. The flame demon appears within 30 feet of you and uses the statistics of the creature it was created from, but it deals additional fire damage equal to your proficiency bonus with all attacks. It obeys your commands and acts on your turn. You can have a number of flame demons equal to your proficiency bonus. If you bind another when at your limit, the oldest dissipates. This power allows you to command an army of demons, like Baran, the true Monarch of White Flames.',
'reaction', 'proficiency bonus limit', NULL, 'White Flame Aura', true
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 8: Enhanced Flames
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Flames', 8,
'Starting at 8th level, your white flames become more powerful. Your Flame Step distance increases to 60 feet, and you can bring one willing creature with you. Your Flame Blade damage increases to 3d6 fire damage + 2d6 psychic damage. Your mastery over white flames reaches new heights, burning souls themselves.',
'passive', NULL, NULL, 'Demon Extraction', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 9: Flame Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Exchange', 9,
'At 9th level, you can swap places with your flame demons instantly. As an action, you can teleport to a space occupied by one of your flame demons within 120 feet, and that flame demon teleports to your previous space. This doesn''t provoke opportunity attacks. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through flames themselves.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Flames', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 10: Demon Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Demon Storage', 10,
'Starting at 10th level, you can store flame demons in a pocket dimension of fire. As a bonus action, you can dismiss any number of your flame demons into storage. They remain in the flame dimension indefinitely and can be summoned back as a bonus action. While in storage, flame demons don''t count toward your maximum limit. You can have a total number of stored and active flame demons equal to twice your proficiency bonus. This allows you to maintain a reserve demon legion ready for battle.',
'bonus-action', NULL, NULL, 'Flame Exchange', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 11: Demon Legion Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Demon Legion Command', 11,
'At 11th level, you can command your entire demon legion simultaneously. As a bonus action, you can command all your flame demons within 120 feet to take the same action (Attack, Dash, Disengage, Dodge, or Help). Additionally, the maximum number of active flame demons you can control increases to twice your proficiency bonus. Your flame demons have advantage on attack rolls against creatures that are frightened or that have taken fire damage. Your demon legion becomes a coordinated force, like Baran''s army.',
'bonus-action', NULL, NULL, 'Demon Storage', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 12: White Flame Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'White Flame Domain', 12,
'Starting at 12th level, you can create a domain of white flames. As an action, you create a 30-foot-radius sphere of white-hot flames centered on yourself. The area is heavily obscured with white fire, and all creatures other than you and your flame demons take 2d8 fire damage + 1d8 psychic damage at the start of each of their turns. Additionally, all magical effects in the area have a 25% chance to fail. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Demon Legion Command', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 13: Soul Burn Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Soul Burn Strike', 13,
'At 13th level, your flames burn souls directly. When you hit a creature with a melee weapon attack, the attack deals additional psychic damage equal to your level, representing soul burn. Additionally, when you reduce a creature to 0 hit points with fire damage, you can use your reaction to bind its soul as a flame demon. Your flames burn the very essence of life, like Baran''s white flames.',
'passive', NULL, NULL, 'White Flame Domain', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 14: White Flames Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'White Flames Monarch''s Presence', 14,
'Starting at 14th level, your mere presence burns souls. All creatures within 30 feet of you take 1d8 psychic damage at the start of their turn from the heat of your presence. Additionally, you can use your action to attempt to bind any fiend or demon within 60 feet. The target must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or fall under your control for 24 hours. You command all demons, like the true White Flames Monarch.',
'action', NULL, NULL, 'Soul Burn Strike', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 15: Flame Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Regeneration', 15,
'At 15th level, you heal from the flames themselves. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you deal fire or psychic damage, you regain hit points equal to half the damage dealt. You feed on the flames you create, reflecting the White Flames Monarch''s nature. The flames sustain you.',
'passive', NULL, NULL, 'White Flames Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 16: Expanded Flame Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Flame Domain', 16,
'Starting at 16th level, your flame domain becomes more powerful. Your White Flame Domain now extends to 60 feet, and enemies take 4d8 fire damage + 2d8 psychic damage at the start of each of their turns. Additionally, you can use White Flame Domain twice per long rest. Your domain of white flames covers vast areas, burning souls across the battlefield.',
'passive', NULL, NULL, 'Flame Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 17: Eternal Flames
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Flames', 17,
'At 17th level, your flame demons become eternal. When a flame demon is destroyed, it reforms from white flames at the start of your next turn unless it was destroyed by cold or water magic. Additionally, your maximum active flame demons increases to three times your proficiency bonus. Your flames never truly die, only reform. Your demon legion becomes unstoppable, like Baran''s eternal army of flame.',
'passive', NULL, NULL, 'Expanded Flame Domain', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 18: Flame Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Flame Overlord', 18,
'Starting at 18th level, you become the true overlord of all flames and demons. You can bind demons and fiends of any challenge rating. Additionally, you can use your action to command all fiends and demons within 300 feet of you, forcing them to make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or fall under your control for 24 hours. Once a creature succeeds, it is immune for 7 days. Your authority extends to all demons, like Baran''s command.',
'action', NULL, NULL, 'Eternal Flames', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 19: Perfect Flame Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Flame Form', 19,
'At 19th level, you become a being of perfect white flames. As an action, you can transform into pure white fire for 1 minute. While in this form, you are immune to all damage except cold damage, you can move through fire and magical barriers as if they weren''t there, and any creature that starts its turn within 10 feet of you takes 4d8 fire damage + 2d8 psychic damage. Additionally, your flame demons deal double damage while you are in this form. You can use this feature once per long rest. You become the perfect embodiment of white flames, burning souls themselves.',
'action', '1 per long rest', 'long-rest', 'Flame Overlord', false
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- Level 20: White Flames Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'White Flames Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the White Flames Monarch, matching the authority of the Shadow Monarch. You can bind demons and flame spirits from any creature you slay, regardless of size or type, and you can maintain an unlimited number of flame demons. Additionally, once per long rest, you can use your action to command all fiends and demons within 1 mile of you, with no limit on challenge rating. They must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or fall under your control permanently until you release them. You can use this mass command once per long rest. You have become the true Monarch of White Flames, with power that commands all demons. My flames burn the soul itself.',
'action', '1 mass command per long rest', 'long-rest', 'Perfect Flame Form', true
FROM compendium_monarchs m WHERE m.name = 'White Flames Monarch';

-- =============================================
-- TRANFIGURATION MONARCH - Full Progression (1-20)
-- =============================================
-- Shapeshifting, transformation, reality manipulation, form changing
-- Power level: Equal to Shadow Monarch (Yogumunt could alter anything)

-- Level 1: Transfiguration Touch
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Touch', 1,
'When you gain the Transfiguration Monarch overlay at 1st level, you can feel the mutable nature of reality. As an action, you can touch a nonmagical object weighing up to 10 pounds and transform it into another nonmagical object of similar size. The transformation lasts for 1 hour or until you dismiss it. Additionally, you have advantage on saving throws against being polymorphed. This represents the first awakening of your transfiguration powers.',
'action', NULL, NULL, NULL, true
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 2: Transfiguration Sight
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Sight', 2,
'At 2nd level, you can see the true forms of all things. You can see through illusions and shapeshifting within 60 feet. Additionally, you can use your action to determine if a creature you can see is in its true form or has been transformed. Your connection to transformation grants you insight into all forms.',
'action', NULL, NULL, 'Transfiguration Touch', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 3: Minor Shapeshift
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Minor Shapeshift', 3,
'Starting at 3rd level, you can alter your form slightly. As a bonus action, you can change your appearance to that of another humanoid of similar size. This doesn''t change your statistics. The transformation lasts for 1 hour or until you dismiss it. Additionally, you can use your action to grow claws, fangs, or other natural weapons that deal 1d6 damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. This is the first step toward true shapeshifting.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Transfiguration Sight', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 4: Adaptive Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Adaptive Form', 4,
'At 4th level, your body adapts to threats. You have resistance to one damage type of your choice (chosen at the start of each day). Additionally, when you take damage of a type you don''t have resistance to, you can use your reaction to gain resistance to that damage type until the end of your next turn. Your form adapts to survive, reflecting the Transfiguration Monarch''s nature.',
'reaction', NULL, NULL, 'Minor Shapeshift', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 5: Transform Object
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transform Object', 5,
'Starting at 5th level, you can transform objects more powerfully. As an action, you can touch a nonmagical object weighing up to 100 pounds and transform it into another nonmagical object of similar size. The transformation is permanent unless you dismiss it. Additionally, you can transform objects into weapons or tools, though they function as normal items. You reshape reality around you.',
'action', NULL, NULL, 'Adaptive Form', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 6: Shapeshift Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Shapeshift Form', 6,
'At 6th level, you can take the form of beasts. As an action, you can polymorph into a beast with a challenge rating equal to or less than your level divided by 3 (rounded down). You transform into that beast for 1 hour or until you dismiss it. You retain your Intelligence, Wisdom, and Charisma scores, as well as your class features. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. Your transformation becomes more complete.',
'action', 'proficiency bonus', 'long-rest', 'Transform Object', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 7: Transfiguration Extraction (Signature)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Extraction', 7,
'At 7th level, you gain the signature power of the Transfiguration Monarch: the ability to extract and command transformation spirits from transformed creatures. When you slay a creature with a challenge rating equal to or less than your level, you can use your reaction to extract its essence as a transformation spirit. The transformation spirit appears within 30 feet of you and can assume the form of the creature it was created from or any form you command. It uses the statistics of its current form, but it can change forms as a bonus action. It obeys your commands and acts on your turn. You can have a number of transformation spirits equal to your proficiency bonus. If you extract another when at your limit, the oldest returns to its true form and dissipates. This power allows you to command an army of shapeshifters, like Yogumunt, the true Monarch of Transfiguration.',
'reaction', 'proficiency bonus limit', NULL, 'Shapeshift Form', true
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 8: Enhanced Transfiguration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Enhanced Transfiguration', 8,
'Starting at 8th level, your transformation powers become more powerful. Your Shapeshift Form can now transform into beasts with a challenge rating equal to or less than your level divided by 2 (rounded down). Additionally, you can maintain two transformations simultaneously—one on yourself and one active transformation spirit. Your mastery over transformation reaches new heights.',
'passive', NULL, NULL, 'Transfiguration Extraction', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 9: Form Exchange
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Form Exchange', 9,
'At 9th level, you can swap forms with your transformation spirits instantly. As an action, you can teleport to a space occupied by one of your transformation spirits within 120 feet, and that transformation spirit teleports to your previous space. Additionally, you can exchange your current form with the transformation spirit''s form. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. You move through transformation itself.',
'action', 'proficiency bonus', 'long-rest', 'Enhanced Transfiguration', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 10: Transformation Storage
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transformation Storage', 10,
'Starting at 10th level, you can store transformation spirits in a pocket dimension of possibilities. As a bonus action, you can dismiss any number of your transformation spirits into storage. They remain in the dimension indefinitely and can be summoned back as a bonus action in any form you choose. While in storage, transformation spirits don''t count toward your maximum limit. You can have a total number of stored and active transformation spirits equal to twice your proficiency bonus. This allows you to maintain a reserve army of shapeshifters.',
'bonus-action', NULL, NULL, 'Form Exchange', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 11: Transformation Army Command
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transformation Army Command', 11,
'At 11th level, you can command your entire transformation army simultaneously. As a bonus action, you can command all your transformation spirits within 120 feet to take the same action or assume the same form. Additionally, the maximum number of active transformation spirits you can control increases to twice your proficiency bonus. Your transformation spirits have advantage on attack rolls when they outnumber their target or when they assume an advantageous form. Your shapeshifting legion becomes a coordinated force, like Yogumunt''s army.',
'bonus-action', NULL, NULL, 'Transformation Storage', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 12: Transfiguration Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Domain', 12,
'Starting at 12th level, you can create a domain where reality is mutable. As an action, you create a 30-foot-radius sphere centered on yourself. Within this domain, you can alter the appearance and properties of objects and terrain as a bonus action. Creatures in the domain must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or have their form subtly altered, giving them disadvantage on attack rolls. The domain lasts for 1 minute or until you dismiss it. You can use this feature once per long rest.',
'action', '1 per long rest', 'long-rest', 'Transformation Army Command', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 13: Perfect Transformation Strike
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Transformation Strike', 13,
'At 13th level, you can transform enemies directly. When you hit a creature with a melee weapon attack, you can choose to transform them. The target must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, the target is polymorphed into a harmless beast of your choice with a challenge rating of 1 or lower for 1 minute. The target can repeat the saving throw at the end of each of its turns. Additionally, your transformation spirits can transform enemies with their attacks. You reshape your enemies, like Yogumunt''s ultimate power.',
'passive', NULL, NULL, 'Transfiguration Domain', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 14: Transfiguration Monarch''s Presence
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Monarch''s Presence', 14,
'Starting at 14th level, your mere presence makes reality unstable. All illusions and shapeshifting within 60 feet are under your control. You can see through any disguise or illusion, and you can dispel any illusion or transformation as an action. Additionally, you can use your action to attempt to transform any creature within 60 feet. The target must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be transformed into a form of your choice for 24 hours. You command all transformation, like the true Transfiguration Monarch.',
'action', NULL, NULL, 'Perfect Transformation Strike', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 15: Transformation Regeneration
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transformation Regeneration', 15,
'At 15th level, you heal by transforming your wounds away. At the start of each of your turns, you regain hit points equal to your proficiency bonus if you have at least 1 hit point. Additionally, when you transform or when one of your transformation spirits changes form, you regain hit points equal to your proficiency bonus. You heal through transformation itself, reflecting the Transfiguration Monarch''s nature. Changing form sustains you.',
'passive', NULL, NULL, 'Transfiguration Monarch''s Presence', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 16: Expanded Transfiguration Domain
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Expanded Transfiguration Domain', 16,
'Starting at 16th level, your transfiguration domain becomes more powerful. Your Transfiguration Domain now extends to 60 feet, and you can transform creatures within it as a bonus action. Additionally, you can use Transfiguration Domain twice per long rest. Your domain of transformation covers vast areas, reshaping reality itself.',
'passive', NULL, NULL, 'Transformation Regeneration', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 17: Eternal Transformation
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Eternal Transformation', 17,
'At 17th level, your transformation spirits become eternal. When a transformation spirit is destroyed, it reforms from pure transformation energy at the start of your next turn in a new form of your choice, unless it was destroyed by antimagic or similar effects. Additionally, your maximum active transformation spirits increases to three times your proficiency bonus. Your transformations never truly end, only reform. Your shapeshifting army becomes unstoppable, like Yogumunt''s eternal legion of change.',
'passive', NULL, NULL, 'Expanded Transfiguration Domain', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 18: Transfiguration Overlord
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Overlord', 18,
'Starting at 18th level, you become the true overlord of all transformation. You can extract transformation spirits from creatures of any challenge rating. Additionally, you can use your action to transform all creatures of your choice within 300 feet. They must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be transformed into a form of your choice for 24 hours. Once a creature succeeds, it is immune for 7 days. You can use this feature once per long rest. Your authority extends to all transformation, like Yogumunt''s ultimate power.',
'action', '1 per long rest', 'long-rest', 'Eternal Transformation', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 19: Perfect Transformation Form
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Perfect Transformation Form', 19,
'At 19th level, you become a being of perfect transformation. As an action, you can assume any form you have seen before for 1 minute. While in this form, you gain all abilities and statistics of that form, and you can change forms as a bonus action. Additionally, you can maintain multiple forms simultaneously, creating additional bodies. Your transformation spirits deal double damage while you are in this form. You can use this feature once per long rest. You become the perfect embodiment of change, like Yogumunt''s ultimate form.',
'action', '1 per long rest', 'long-rest', 'Transfiguration Overlord', false
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- Level 20: Transfiguration Monarch''s Authority (Capstone)
INSERT INTO compendium_monarch_features (monarch_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_signature)
SELECT m.id, 'Transfiguration Monarch''s Authority', 20,
'At 20th level, you have achieved the full power of the Transfiguration Monarch, matching the authority of the Shadow Monarch. You can extract transformation spirits from any creature you slay, regardless of size or type, and you can maintain an unlimited number of transformation spirits. Additionally, once per long rest, you can use your action to transform all creatures of your choice within 1 mile into any form you choose. They must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be permanently transformed until you release them. You can use this mass transformation once per long rest. You have become the true Monarch of Transfiguration, with power that reshapes reality itself. Reality is merely suggestion. I am the exception.',
'action', '1 mass transformation per long rest', 'long-rest', 'Perfect Transformation Form', true
FROM compendium_monarchs m WHERE m.name = 'Transfiguration Monarch';

-- =============================================
-- ALL 9 MONARCHS COMPLETE WITH FULL 1-20 PROGRESSIONS
-- =============================================
-- ✅ Shadow Monarch (1-20) - Shadow extraction, army, domain
-- ✅ Beast Monarch (1-20) - Beast transformation, pack command
-- ✅ Iron Body Monarch (1-20) - Absolute defense, unbreakable
-- ✅ Plague Monarch (1-20) - Disease, corruption, plague spirits
-- ✅ Frost Monarch (1-20) - Ice control, freezing, ice golems
-- ✅ Stone Monarch (1-20) - Earth manipulation, stone golems
-- ✅ Destruction Monarch (1-20) - Pure destruction, breaking everything (unlocks 11)
-- ✅ White Flames Monarch (1-20) - Soul-burning fire, demon command
-- ✅ Transfiguration Monarch (1-20) - Shapeshifting, transformation, reality change
--
-- All monarchs have power levels equal to Shadow Monarch
-- All based on actual Solo Leveling manhwa lore
-- All with full class progressions (features at every level 1-20)
-- =============================================
