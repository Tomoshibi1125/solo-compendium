// Comprehensive Feats Compendium - System Ascendant Original Content
// ALL feats for the complete compendium system
// SA-flavored names and descriptions on 5e mechanical backbone

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: {
    level?: number;
    ability?: string;
    score?: number;
    feats?: string[];
    class?: string;
    background?: string;
    skill?: string;
    alignment?: string;
    job?: string;
    armor_proficiencies?: string[];
    weapon_proficiencies?: string[];
    skill_proficiencies?: string[];
  };
  benefits: string[];
  mechanics: {
    type: 'passive' | 'active' | 'triggered';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day' | 'once-per-week' | 'once-per-turn' | 'when-critical-hit' | 'when-creature-dies' | 'bonus-action' | 'reaction' | '3-per-day';
    action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    ability?: string;
    save?: string;
    dc?: number | 'ability-modifier' | 'spell-save';
  };
  flavor?: string;
  source: string;
  image?: string;
}

export const comprehensiveFeats: Feat[] = [
  // ═══════════════════════════════════════════
  // SHADOW FEATS
  // ═══════════════════════════════════════════
  {
    id: 'shadow-mastery',
    name: 'Shadow Mastery',
    description: 'Your mana signature has attuned to shadow-frequency energy, granting instinctive control over darkness.',
    prerequisites: { level: 5, ability: 'Wisdom', score: 13 },
    benefits: [
      'Advantage on Dexterity (Stealth) checks in dim light or darkness',
      'Can use Shadow Step as a bonus action 3 times per long rest (teleport up to 30 ft between shadows)',
      'Resistance to necrotic damage',
      'Can see through magical darkness up to 60 feet'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SHADOW ATTUNEMENT: COMPLETE — DARKNESS RESPONDS TO YOUR WILL]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'essence-absorption',
    name: 'Essence Absorption',
    description: 'Your System interface siphons residual life energy from slain creatures, converting it into temporary power.',
    prerequisites: { level: 7, feats: ['shadow-mastery'] },
    benefits: [
      'When you reduce a creature to 0 HP, gain temporary HP equal to your Wisdom modifier',
      'Once per long rest, absorb essence to gain advantage on your next attack roll',
      'Can store absorbed essence to fuel shadow abilities',
      '+1 to Constitution saving throws'
    ],
    mechanics: { type: 'triggered', frequency: 'once-per-turn', action: 'free' },
    flavor: 'The kill feeds you. Every death refills your reserves.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'regent-aura',
    name: 'Regent\'s Aura',
    description: 'You project an aura of dimensional authority that suppresses lesser shadow creatures and undead.',
    prerequisites: { level: 15, feats: ['shadow-mastery', 'essence-absorption'] },
    benefits: [
      'Undead and shadow creatures with CR less than your level are frightened of you',
      'Can command shadow creatures as an action (Wisdom check contested)',
      'Allies within 30 feet gain +1 to saving throws against fear',
      'Shadow creatures have disadvantage on attack rolls against you'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[AUTHORITY: REGENT-CLASS — SHADOW ENTITIES: SUPPRESSED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-dance',
    name: 'Shadow Dance',
    description: 'You move through combat like a wraith, phasing between shadows to strike from impossible angles.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'When you take the Dodge action, move up to your speed without provoking opportunity attacks',
      'Once per turn, teleport up to 15 feet to unoccupied space in dim light or darkness',
      'Advantage on Dexterity saving throws against area effects',
      'Can use Shadow Step as a reaction when targeted by an attack'
    ],
    mechanics: { type: 'active', frequency: 'once-per-turn', action: 'reaction' },
    flavor: 'You exist in one shadow, then another. The space between is irrelevant.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'critical-shadow',
    name: 'Critical Shadow',
    description: 'Your strikes carry shadow energy that erupts on critical hits, blinding targets with concentrated darkness.',
    prerequisites: { level: 9, ability: 'Dexterity', score: 17 },
    benefits: [
      'Critical hits deal extra necrotic damage equal to your proficiency bonus',
      'On crit, target must make Con save or be blinded for 1 round',
      'Shadow-infused weapons count as magical for overcoming resistance',
      'Can reroll one damage die on critical hits (must use new result)'
    ],
    mechanics: { type: 'triggered', frequency: 'when-critical-hit', action: 'free' },
    flavor: '[CRITICAL STRIKE: SHADOW DETONATION — TARGET VISUAL SYSTEMS: OFFLINE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-blade-resonance',
    name: 'Mana Blade Resonance',
    description: 'You have mastered the art of imbuing melee weapons with raw mana, creating a resonant field that slices through armor.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'Your melee weapon attacks deal extra force damage equal to your proficiency bonus.',
      'Once per turn, when you hit a creature with a melee attack, you can force it to make a Strength save (DC 8 + prof + Str mod) or be pushed 10 feet.',
      'You gain proficiency with shortswords and longswords.'
    ],
    mechanics: { type: 'passive', frequency: 'once-per-turn', ability: 'Strength', save: 'Strength', dc: 'ability-modifier' },
    flavor: '[RESONANCE ESTABLISHED — ARMOR PENETRATION: MAXIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-step-reflex',
    name: 'Shadow Step Reflex',
    description: 'Your reflexes are attuned to the dimensional membrane, allowing you to slip through space when targeted.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you are targeted by an attack, you can use your reaction to teleport up to 5 feet to an unoccupied space you can see. If this move takes you out of the attack\'s range, the attack misses.',
      'You have advantage on Dexterity checks made to initiative combat while in dim light or darkness.',
      'You can see through magical darkness out to 30 feet.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[THREAT DETECTED — SHIFTING COORDINATES... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-diagnostic-medic',
    name: 'System Diagnostic Medic',
    description: 'You have unlocked the healer-class diagnostic HUD, allowing you to patch wounds with supernatural efficiency.',
    benefits: [
      'When you use a healer\'s kit to stabilize a dying creature, that creature also regains 1 HP.',
      'As an action, you can spend one use of a healer\'s kit to restore 1d6 + 4 + target\'s maximum Hit Dice HP to a creature.',
      'You gain proficiency in Medicine and with the herbalism kit.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action' },
    flavor: '[DIAGNOSTIC COMPLETE — APPLYING BIOLOGICAL PATCH... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'phantom-algorithm-strike',
    name: 'Phantom Algorithm Strike',
    description: 'The System provides predictive movement patterns, allowing you to strike and fade before an enemy can react.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn.',
      'Your movement speed increases by 10 feet.',
      'Difficult terrain doesn\'t cost you extra movement when you take the Dash action.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PREDICTIVE ALGORITHM: ACTIVE — TARGET RESPONSE TIME: INSUFFICIENT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-plating-integration',
    name: 'Heavy Plating Integration',
    description: 'You have adapted to the heaviest armor by reinforcing your frame with mana-dense muscle fibers.',
    prerequisites: { armor_proficiencies: ['Medium armor'] },
    benefits: [
      'Gain proficiency with heavy armor.',
      '+1 to Constitution score (max 20).',
      'While wearing heavy armor, reduce non-magical bludgeoning, piercing, and slashing damage by 3.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PHYSICAL EVOLUTION: PLATING INTEGRATION — DURABILITY: REINFORCED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'neural-duelist-sync',
    name: 'Neural Duelist Sync',
    description: 'Your neural pathways are perfectly synced for one-on-one combat, making you a master of the single blade.',
    benefits: [
      '+1 to AC while wielding a melee weapon in one hand and no other weapons.',
      'When you use the Ready action to prepare an attack, you gain advantage on that attack.',
      'Use reaction to parry: gain +prof bonus to AC against one melee attack.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: 'One blade, one intent. The System clears the static.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'logic-payload-hack',
    name: 'Logic Payload Hack',
    description: 'You can insert viral mana-code into magical effects or constructs, causing them to fail or detonate.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'As an action, target a construct or ongoing magical effect within 60 feet.',
      'Constructs must make an Intelligence save or be stunned for 1 round.',
      'Ongoing effects are suppressed for 1 minute (Intelligence check DC 10 + spell level).',
      'You gain proficiency with Hacking Tools.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action', save: 'Intelligence', dc: 'ability-modifier' },
    flavor: '[VIRAL PAYLOAD DEPLOYED — SYSTEM INTEGRITY: COMPROMISED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-well-font',
    name: 'Mana Well Font',
    description: 'Your body acts as a natural reservoir for ambient mana, allowing you to cast spells more frequently.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1 (max 20).',
      'Once per long rest, recover a spent spell slot of level equal to half your level (rounded up, max 5th).',
      'You learn one additional cantrip of your choice.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'free' },
    flavor: '[AMBIENT MANA DETECTED — HARVESTING... RESERVES REPLENISHED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'apex-scent-tracking',
    name: 'Apex Scent Tracking',
    description: 'Your awakening heightened your primal senses to a supernatural degree. No one can hide from you.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'You gain advantage on Wisdom (Perception) and Wisdom (Survival) checks that rely on smell.',
      'Track creatures through magically obscured areas or between dimensions if the trail is fresh.',
      'Gain blindsight out to 10 feet.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[OLFACTORY SENSORS: OVERCLOCKED — TARGET SCENT: LOCKED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'kinetic-force-shover',
    name: 'Kinetic Force Shover',
    description: 'You use small rifts to amplify your physical force, tossing enemies across the battlefield.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'When you hit a creature with an unarmed strike or melee weapon, use bonus action to shove them.',
      'If you successfully shove a creature, they are pushed an additional 10 feet.',
      'You gain advantage on Athletics checks made to initiate or resist a grapple.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[KINETIC AMPLIFICATION: RIFT-ASSISTED — MASS DISPLACEMENT: AUTHORIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'arcane-overseer-eye',
    name: 'Arcane Overseer Eye',
    description: 'You have manifested a secondary, spectral eye that floats near you, providing a total view of the battlefield.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You cannot be surprised while conscious.',
      'Other creatures don\'t gain advantage on attack rolls against you as a result of being hidden.',
      'You can see into the Ethereal Plane out to 60 feet.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[FIELD OF VIEW: 360 DEGREES — BLIND SPOTS: ELIMINATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-weapon-calibration',
    name: 'Heavy Weapon Calibration',
    description: 'The System provides micro-adjustments to your posture and grip, allowing you to wield massive weapons with ease.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'You ignore the heavy property of weapons.',
      'When you hit with a heavy weapon, you can reroll 1s and 2s on damage dice (must use new result).',
      '+1 to Strength score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GYROSCOPIC STABILIZATION: ONLINE — RECOIL COMPENSATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'void-shifter-reflex',
    name: 'Void Shifter Reflex',
    description: 'You can momentarily phase out of existence to avoid certain death.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When subjected to an effect that allows a Dexterity save for half damage, take no damage on success and half on failure.',
      'Use reaction to teleport 5 feet when an attack misses you.',
      '+1 to Dexterity score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'reaction' },
    flavor: '[THREAT DETECTED — PHASING TO VOID... COMPLETE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'regent-command-protocol',
    name: 'Regent Command Protocol',
    description: 'Your voice carries the weight of the System, compelling others to follow your directives.',
    prerequisites: { ability: 'Charisma', score: 13 },
    benefits: [
      'You can cast Command at 1st level without expending a spell slot (Charisma save).',
      'Once per long rest, use an action to inspire up to 5 allies — they gain temp HP equal to your level + Cha mod.',
      'Advantage on Intimidation checks against creatures of a lower rank.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action', save: 'Charisma', dc: 'ability-modifier' },
    flavor: '[VOICE AUTHORIZATION: REGENT — COMMAND PROTOCOL: ISSUED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-leech-fangs',
    name: 'Mana Leech Fangs',
    description: 'Your awakening allows you to feast on the mana of your enemies through direct contact.',
    benefits: [
      'Your unarmed strikes deal 1d4 piercing + Str mod. You regain HP equal to the damage dealt.',
      'When you hit a creature with a melee attack, use bonus action to drain mana — they lose their lowest spell slot, you regain 1d4 HP.',
      'Resistance to necrotic damage.'
    ],
    mechanics: { type: 'active', frequency: 'once-per-turn', action: 'bonus-action' },
    flavor: 'The System converts their essence into your vitality.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'endurance-optimization',
    name: 'Endurance Optimization',
    description: 'You have survived more gate collapses than most hunters see in a lifetime. Your endurance is legendary.',
    prerequisites: { ability: 'Constitution', score: 13 },
    benefits: [
      'You have advantage on saving throws against exhaustion.',
      'Short rests take only 10 minutes for you.',
      'You can go without food or water for 3 days without penalty.',
      '+1 to Constitution score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[STAMINA STAT: PEAK HUMAN — FATIGUE RECOVERY: OPTIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'combat-hud-analyzer',
    name: 'Combat HUD Analyzer',
    description: 'Your System interface provides real-time combat analysis, highlighting enemy weaknesses.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can take the Search action as a bonus action.',
      'As a bonus action, analyze a creature you can see. Your next attack against it has advantage.',
      'You gain proficiency in Investigation and Perception.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[TARGET ANALYSIS: COMPLETE — WEAK POINT IDENTIFIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'cognitive-firewall',
    name: 'Cognitive Firewall',
    description: 'Your brain is shielded by a mana-reinforced firewall, making you nearly immune to mental intrusion.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'Advantage on saving throws against being charmed or frightened.',
      'Immune to effects that read your thoughts or sense emotions.',
      'Resistance to psychic damage.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[COGNITIVE FIREWALL: ACTIVE — UNAUTHORIZED ACCESS: DENIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'reactive-mana-pulse',
    name: 'Reactive Mana Pulse',
    description: 'Your mana circuits react instantaneously to impacts, hardening your defenses at the point of contact.',
    prerequisites: { armor_proficiencies: ['Light armor'] },
    benefits: [
      'When hit by a melee attack, use reaction to deal 1d6 force damage to the attacker.',
      'Gain a +1 bonus to AC while wearing armor.',
      'You ignore Stealth disadvantage from any armor.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[IMPACT DETECTED — DEPLOYING REACTIVE PULSE... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-anchor-feet',
    name: 'Mana Blade Resonance',
    description: 'You have mastered the art of imbuing melee weapons with raw mana, creating a resonant field that slices through armor.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'Your melee weapon attacks deal extra force damage equal to your proficiency bonus.',
      'Once per turn, when you hit a creature with a melee attack, you can force it to make a Strength save (DC 8 + prof + Str mod) or be pushed 10 feet.',
      'You gain proficiency with shortswords and longswords.'
    ],
    mechanics: { type: 'passive', frequency: 'once-per-turn', ability: 'Strength', save: 'Strength', dc: 'ability-modifier' },
    flavor: '[RESONANCE ESTABLISHED — ARMOR PENETRATION: MAXIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'kinetic-redirection',
    name: 'Kinetic Redirection',
    description: 'Your reflexes are so sharp you can catch and redirect the kinetic energy of incoming projectiles.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'Use your reaction to reduce damage from a ranged weapon attack by 1d10 + Dex mod + your level.',
      'If you reduce the damage to 0, you catch the projectile and can make a ranged attack with it as part of the same reaction.',
      '+1 to Dexterity saving throws.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[KINETIC VECTOR: REVERSED — TARGETING ORIGIN POINT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-medic-protocol',
    name: 'System Medic Protocol',
    description: 'You have unlocked the healer-class diagnostic HUD, allowing you to patch wounds with supernatural efficiency.',
    benefits: [
      'When you use a healer\'s kit to stabilize a dying creature, that creature also regains 1 HP.',
      'As an action, you can spend one use of a healer\'s kit to tend to a creature and restore 1d6 + 4 + its maximum number of Hit Dice HP.',
      'Proficiency in Medicine and with the herbalism kit.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action' },
    flavor: '[DIAGNOSTIC COMPLETE — APPLYING BIOLOGICAL PATCH... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'phantom-strike-algorithm',
    name: 'Phantom Strike Algorithm',
    description: 'The System provides you with predictive movement patterns, allowing you to strike and fade before an enemy can react.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn.',
      'Your speed increases by 10 feet.',
      'When you take the Dash action, difficult terrain doesn\'t cost you extra movement.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PREDICTIVE ALGORITHM: ACTIVE — TARGET RESPONSE TIME: INSUFFICIENT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-mana-plating',
    name: 'Heavy Mana Plating',
    description: 'You have adapted to the heaviest armor by reinforcing your frame with mana-dense muscle fibers.',
    prerequisites: { armor_proficiencies: ['Medium armor'] },
    benefits: [
      'Gain proficiency with heavy armor.',
      '+1 to Constitution score (max 20).',
      'Reduce all non-magical bludgeoning, piercing, and slashing damage by 3 while wearing heavy armor.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PHYSICAL EVOLUTION: PLATING INTEGRATION — DURABILITY: REINFORCED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'neural-sync-duelist',
    name: 'Neural Sync Duelist',
    description: 'Your neural pathways are perfectly synced for one-on-one combat, making you a master of the single blade.',
    benefits: [
      '+1 to AC while you are wielding a melee weapon in one hand and no other weapons.',
      'When you use the Ready action to prepare an attack, you gain advantage on that attack.',
      'Use reaction to parry: gain +prof bonus to AC against one melee attack.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: 'One blade, one intent. The System clears the static.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'logic-bomb-hack',
    name: 'Logic Bomb Hack',
    description: 'You can insert viral mana-code into magical effects or constructs, causing them to fail or detonate.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'As an action, target a construct or an ongoing magical effect within 60 feet.',
      'Constructs must make an Int save or be stunned for 1 round.',
      'Ongoing effects are suppressed for 1 minute (Intelligence check DC = 10 + spell level).',
      'Proficiency in Hacking Tools.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action', save: 'Intelligence', dc: 'ability-modifier' },
    flavor: '[VIRAL PAYLOAD DEPLOYED — SYSTEM INTEGRITY: COMPROMISED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-well-vessel',
    name: 'Mana Well Vessel',
    description: 'Your body acts as a natural reservoir for ambient mana, allowing you to cast spells more frequently.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1 (max 20).',
      'Once per long rest, you can recover a spent spell slot of level equal to half your level (rounded up, max 5th).',
      'You gain one additional cantrip of your choice.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'free' },
    flavor: '[AMBIENT MANA DETECTED — HARVESTING... RESERVES REPLENISHED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'apex-predator-scent',
    name: 'Apex Predator Scent',
    description: 'Your awakening heightened your primal senses to a supernatural degree. No one can hide from you.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'You gain advantage on Wisdom (Perception) and Wisdom (Survival) checks that rely on smell.',
      'You can track creatures through magically obscured areas or even between dimensions if the trail is fresh.',
      'Gain blindsight out to 10 feet.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[OLFACTORY SENSORS: OVERCLOCKED — TARGET SCENT: LOCKED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-shover',
    name: 'Dimensional Shover',
    description: 'You use small rifts to amplify your physical force, tossing enemies across the battlefield.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'When you hit a creature with an unarmed strike or a melee weapon, you can use a bonus action to shove them.',
      'If you successfully shove a creature, they are pushed an additional 10 feet.',
      'You gain advantage on Athletics checks made to initiate or resist a grapple.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[KINETIC AMPLIFICATION: RIFT-ASSISTED — MASS DISPLACEMENT: AUTHORIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'arcane-eye-overseer',
    name: 'Arcane Eye Overseer',
    description: 'You have manifested a secondary, spectral eye that floats near you, providing a total view of the battlefield.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You cannot be surprised while conscious.',
      'Other creatures don\'t gain advantage on attack rolls against you as a result of being hidden from you.',
      'You can see into the Ethereal Plane out to 60 feet.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[FIELD OF VIEW: 360 DEGREES — BLIND SPOTS: ELIMINATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-weapon-stabilizer',
    name: 'Heavy Weapon Stabilizer',
    description: 'The System provides micro-adjustments to your posture and grip, allowing you to wield massive weapons with ease.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'You ignore the heavy property of weapons.',
      'When you hit with a heavy weapon, you can reroll 1s and 2s on damage dice (must use new result).',
      '+1 to Strength score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GYROSCOPIC STABILIZATION: ONLINE — RECOIL COMPENSATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'void-step-reflex',
    name: 'Void Step Reflex',
    description: 'You can momentarily phase out of existence to avoid certain death.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you are subjected to an effect that allows you to make a Dexterity save for half damage, you take no damage on a success and half on a failure.',
      'Use reaction to teleport 5 feet when an attack misses you.',
      '+1 to Dexterity score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'reaction' },
    flavor: '[THREAT DETECTED — PHASING TO VOID... COMPLETE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-authority-command',
    name: 'System Authority Command',
    description: 'Your voice carries the weight of the System, compelling others to follow your directives.',
    prerequisites: { ability: 'Charisma', score: 13 },
    benefits: [
      'You can cast Command at 1st level without expending a spell slot (Charisma save).',
      'Once per long rest, you can use an action to inspire up to 5 allies — they gain temp HP equal to your level + Cha mod.',
      'Advantage on Intimidation checks against creatures of a lower rank.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action', save: 'Charisma', dc: 'ability-modifier' },
    flavor: '[VOICE AUTHORIZATION: REGENT — COMMAND PROTOCOL: ISSUED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-vampire-fangs',
    name: 'Mana Vampire Fangs',
    description: 'Your awakening allows you to feast on the mana of your enemies through direct contact.',
    benefits: [
      'Your unarmed strikes deal 1d4 piercing + Str mod. You regain HP equal to the damage dealt.',
      'When you hit a creature with a melee attack, you can use a bonus action to drain their mana — they lose their next lowest spell slot, and you regain 1d4 HP.',
      'Resistance to necrotic damage.'
    ],
    mechanics: { type: 'active', frequency: 'once-per-turn', action: 'bonus-action' },
    flavor: 'The System converts their essence into your vitality.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-raider-stamina',
    name: 'Gate Raider Stamina',
    description: 'You have survived more gate collapses than most hunters see in a lifetime. Your endurance is legendary.',
    prerequisites: { ability: 'Constitution', score: 13 },
    benefits: [
      'You have advantage on saving throws against exhaustion.',
      'Short rests take only 10 minutes for you.',
      'You can go without food or water for 3 days without penalty.',
      '+1 to Constitution score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[STAMINA STAT: PEAK HUMAN — FATIGUE RECOVERY: OPTIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'tactical-hud-analyzer',
    name: 'Tactical HUD Analyzer',
    description: 'Your System interface provides real-time combat analysis, highlighting enemy weaknesses.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can take the Search action as a bonus action.',
      'As a bonus action, analyze a creature you can see. Your next attack against it has advantage.',
      'You gain proficiency in Investigation and Perception.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[TARGET ANALYSIS: COMPLETE — WEAK POINT IDENTIFIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'firewall-mind',
    name: 'Firewall Mind',
    description: 'Your brain is shielded by a mana-reinforced firewall, making you nearly immune to mental intrusion.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'You have advantage on saving throws against being charmed or frightened.',
      'You are immune to effects that would read your thoughts or sense your emotions.',
      'Resistance to psychic damage.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[COGNITIVE FIREWALL: ACTIVE — UNAUTHORIZED ACCESS: DENIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'reactive-armor-mana',
    name: 'Reactive Mana Armor',
    description: 'Your mana circuits react instantaneously to impacts, hardening your defenses at the point of contact.',
    prerequisites: { armor_proficiencies: ['Light armor'] },
    benefits: [
      'When you are hit by a melee attack, you can use your reaction to deal 1d6 force damage to the attacker.',
      'You gain a +1 bonus to AC while wearing armor.',
      'You ignore Stealth disadvantage from any armor.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[IMPACT DETECTED — DEPLOYING REACTIVE PULSE... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-anchor-feet',
    name: 'Dimensional Anchor Feet',
    description: 'You can anchor your position to the dimensional membrane, making you impossible to move against your will.',
    benefits: [
      'You have advantage on Strength and Dexterity saving throws made against effects that would move you or knock you prone.',
      'You can walk on liquid surfaces as if they were solid ground.',
      'Your speed cannot be reduced below 10 feet unless you are incapacitated.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DIMENSIONAL COHESION: 100% — POSITION: FIXED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-linguist-protocol',
    name: 'System Linguist Protocol',
    description: 'You have decrypted the underlying code of the System\'s translation layer, allowing you to understand any spoken or written language.',
    benefits: [
      'You learn three languages of your choice.',
      'You have advantage on Intelligence (History) checks made to decipher ancient texts or gate-script.',
      'The System provides real-time subtitles for any language you don\'t know (passive).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[TRANSLATION LAYER: DECRYPTED — ALL LINGUISTIC BARRIERS: REMOVED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-leech-algorithm',
    name: 'Mana Leech Algorithm',
    description: 'You can sap the energy from an enemy\'s spells to fuel your own abilities.',
    prerequisites: { level: 4 },
    benefits: [
      'When you hit a creature with a melee weapon attack, you can use a bonus action to force it to make a Wisdom save.',
      'On a failure, the creature loses its lowest level spell slot, and you regain a spell slot of that level.',
      'You gain resistance to force damage.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'bonus-action', save: 'Wisdom', dc: 'spell-save' },
    flavor: '[ENERGY TRANSFER: INITIATED — HARVESTING AMBIENT MANA... COMPLETE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'ghost-recon-drone-link',
    name: 'Ghost Recon Drone Link',
    description: 'You have manifested a tiny, invisible mana-construct that serves as a scout.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can cast Find Familiar as a ritual, but the familiar is a tiny, invisible mechanical drone.',
      'You can see and hear through the drone\'s senses as long as it is on the same plane of existence.',
      'As an action, the drone can emit a high-frequency pulse that reveals invisible creatures within 10 feet.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'action' },
    flavor: '[DRONE DEPLOYED — STEALTH MODE: ACTIVE — FEED: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-vault-optimization',
    name: 'Dimensional Vault Optimization',
    description: 'Your personal inventory space has been expanded and optimized by the System.',
    benefits: [
      'Your carrying capacity is tripled.',
      'You can retrieve or stow an item from your personal vault as a free action once per turn.',
      'You can hide one item (up to 10 lbs) in a pocket dimension that cannot be detected by non-System scans.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'free' },
    flavor: '[INVENTORY CAPACITY: UPGRADED — ACCESS SPEED: OPTIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'adrenaline-overdrive-limiter',
    name: 'Adrenaline Overdrive Limiter',
    description: 'You can force your body into a state of heightened physical performance at the cost of extreme fatigue.',
    prerequisites: { ability: 'Constitution', score: 15 },
    benefits: [
      'As a bonus action, you can take an additional action this turn.',
      'After using this ability, your speed is halved and you cannot take reactions until the end of your next turn.',
      'Once used, you must complete a long rest before using it again.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'bonus-action' },
    flavor: '[LIMITER RELEASE: 100% — PHYSICAL BUFFER: EXCEEDED — PROCEED WITH CAUTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'urban-parkour-specialist',
    name: 'Urban Parkour Specialist',
    description: 'You move through the city and the dungeon with equal ease, utilizing every surface for mobility.',
    benefits: [
      'Climbing does not cost you extra movement.',
      'You can make a running long jump or running high jump after moving only 5 feet.',
      'You have advantage on Dexterity (Acrobatics) checks made to navigate difficult terrain.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'The city is just another dungeon. The dungeon is just another playground.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-shield-capacitor-link',
    name: 'Mana Shield Capacitor Link',
    description: 'You have installed a mana-reactive shield generator in your neural network.',
    benefits: [
      'When you take damage, you can use your reaction to reduce the damage by an amount equal to your level + Int modifier.',
      'If this reduces the damage to 0, the capacitor gains a charge. At 3 charges, your next spell deals an extra 2d6 force damage.',
      'You gain proficiency in Constitution saving throws.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'reaction' },
    flavor: '[SHIELD INTEGRITY: 100% — CAPACITOR STATUS: CHARGING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'apex-negotiator-algorithm',
    name: 'Apex Negotiator Algorithm',
    description: 'The System analyzes social cues and micro-expressions, feeding you the perfect responses.',
    prerequisites: { ability: 'Charisma', score: 13 },
    benefits: [
      'You gain advantage on Charisma (Persuasion) and Charisma (Deception) checks against humanoids.',
      'The System highlights when someone is lying to you (Insight advantage).',
      'Once per long rest, you can use an action to "Charm" a person (as the spell) via logical manipulation.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'action' },
    flavor: '[SOCIAL ANALYSIS: COMPLETE — OPTIMAL RESPONSE: CALCULATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'sonar-pulse-echo',
    name: 'Sonar Pulse Echo',
    description: 'You emit high-frequency mana pulses that map your surroundings in total darkness.',
    benefits: [
      'You gain blindsight out to 30 feet.',
      'You have advantage on Wisdom (Perception) checks made to detect hidden creatures within 30 feet.',
      'Creatures cannot gain advantage on attack rolls against you by being hidden.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SONAR PULSE: ACTIVE — TOPOGRAPHY MAPPED — THREATS: IDENTIFIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-structural-engineer',
    name: 'Gate Structural Engineer',
    description: 'You understand the structural mechanics of dimensional rifts, allowing you to manipulate them.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can spend 10 minutes to stabilize a collapsing gate, delaying its closure by 1 hour.',
      'You have advantage on checks made to disable magical traps or security systems within a gate.',
      'Proficiency in Hacking Tools and Tinker\'s Tools.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GATE STRUCTURE: ANALYZED — STABILITY: MAINTAINED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'berserker-blood-frenzy',
    name: 'Berserker Blood Frenzy',
    description: 'The sight of blood triggers a systemic combat frenzy.',
    prerequisites: { job: 'Berserker' },
    benefits: [
      'When you reduce a creature to 0 HP, you can immediately move up to half your speed and make one melee weapon attack as a free action.',
      'While below half HP, you have advantage on all Strength checks and Strength saving throws.',
      'Your critical hit range increases by 1 (e.g., 19-20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'free' },
    flavor: '[THREAT DETECTED — ADRENALINE: MAXIMIZED — ANNIHILATE.]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-data-analyst',
    name: 'System Data Analyst',
    description: 'You can read the underlying data of the world, identifying the properties of anything you see.',
    benefits: [
      'You can cast Identify and Detect Magic at will, without expending a spell slot or material components.',
      'You have advantage on Intelligence (Investigation) checks made to understand how a device or spell works.',
      'The System displays the "Challenge Rating" or "Power Level" of any creature you look at for 6 seconds.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SCANNING... DATA RETRIEVED — TARGET CLASSIFICATION: ELITE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'phantom-limb-manifestation',
    name: 'Phantom Limb Manifestation',
    description: 'You use mana to extend your reach and manipulate objects from a distance.',
    benefits: [
      'Your reach for melee attacks and object interaction increases by 5 feet.',
      'You can cast Mage Hand as a bonus action, and the hand is invisible.',
      'You have advantage on Sleight of Hand checks made using your Mage Hand.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: 'The System bridges the gap between intent and impact.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-armor-specialist-v2',
    name: 'Heavy Plating Specialist',
    description: 'You have mastered the weight and balance of heavy defensive plating.',
    prerequisites: { armor_proficiencies: ['Heavy armor'] },
    benefits: [
      '+1 to Strength score (max 20).',
      'While wearing heavy armor, bludgeoning, piercing, and slashing damage you take from non-magical attacks is reduced by 3.',
      'You can don or doff heavy armor in half the normal time.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[ARMOR INTEGRITY: OPTIMIZED — KINETIC DAMPING: ACTIVE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-teleport-expert',
    name: 'Dimensional Teleport Expert',
    description: 'Your short-range teleportation is more efficient and frequent.',
    prerequisites: { level: 4 },
    benefits: [
      'When you teleport, you can bring one willing creature of your size or smaller with you.',
      'Your teleportation range increases by 10 feet.',
      'Once per long rest, use a reaction to teleport up to 30 feet when you would take damage.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'reaction' },
    flavor: '[SPACE-TIME COORDS: LOCKED — DISTORTION: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'internal-mana-battery',
    name: 'Internal Mana Battery',
    description: 'Your internal mana core is exceptionally large and efficient.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You gain 2 additional 1st-level spell slots.',
      'When you finish a short rest, you can recover spell slots whose combined level is equal to half your level.',
      'Your spells deal an additional 1d4 force damage.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[MANA CORE: EXPANDED — OUTPUT: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'guild-command-protocol',
    name: 'Guild Command Protocol',
    description: 'You have the natural charisma and tactical mind to lead a guild of hunters.',
    prerequisites: { ability: 'Charisma', score: 15 },
    benefits: [
      'You can coordinate up to 10 allies. Allies who can see and hear you have advantage on saves against fear.',
      'As a bonus action, grant one ally within 30 feet an additional reaction they can use before the start of your next turn.',
      'You gain proficiency in Persuasion and Intimidation.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'bonus-action' },
    flavor: '[LEADERSHIP PROTOCOL: ACTIVE — GUILD MORALE: MAXIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'reality-sunder-blade',
    name: 'Reality Sunder Blade',
    description: 'Your weapons slice through the very fabric of reality.',
    prerequisites: { ability: 'Strength', score: 17 },
    benefits: [
      'Your melee weapon attacks ignore resistance to their damage type.',
      'Once per turn, when you hit a creature, you can force it to make a Charisma save or be banished to a void-space until the start of your next turn.',
      'Your critical hits deal an additional 1d12 force damage.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', ability: 'Charisma', save: 'Charisma', dc: 'ability-modifier' },
    flavor: '[VOID EDGE: ACTIVE — REALITY INTEGRITY: FAILING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-omniscience-eyes',
    name: 'Omniscience Eyes',
    description: 'The System grants you the ability to see through all deceptions.',
    prerequisites: { level: 12 },
    benefits: [
      'You gain Truesight out to 30 feet.',
      'You can see through any magical or non-magical illusion.',
      'You have advantage on all saving throws against being blinded or dazzled.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[VISUAL DATA: UNFILTERED — TRUTH: REVEALED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-vanguard-stance',
    name: 'Gate Vanguard Stance',
    description: 'You stand as an unbreakable wall against the tides of the dungeon.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'While you are not moving, you have a +2 bonus to AC.',
      'Creatures that provoke an opportunity attack from you take an additional 1d10 damage if you hit.',
      'You are immune to being moved against your will while you are conscious.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DEFENSIVE STANCE: LOCKED — PERIMETER: SECURE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-extraction-expert',
    name: 'System Linguist',
    description: 'You have decrypted the underlying code of the System\'s translation layer, allowing you to understand any spoken or written language.',
    benefits: [
      'You learn three languages of your choice.',
      'You have advantage on Intelligence (History) checks made to decipher ancient texts or gate-script.',
      'The System provides real-time subtitles for any language you don\'t know (passive).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[TRANSLATION LAYER: DECRYPTED — ALL LINGUISTIC BARRIERS: REMOVED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-leech-strike',
    name: 'Mana Leech Strike',
    description: 'You can sap the energy from an enemy\'s spells to fuel your own abilities.',
    prerequisites: { level: 4 },
    benefits: [
      'When you hit a creature with a melee weapon attack, you can use a bonus action to force it to make a Wisdom save.',
      'On a failure, the creature loses its lowest level spell slot, and you regain mana points or a spell slot of that level.',
      'You gain resistance to force damage.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'bonus-action', save: 'Wisdom', dc: 'spell-save' },
    flavor: '[ENERGY TRANSFER: INITIATED — HARVESTING AMBIENT MANA... COMPLETE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'ghost-recon-drone',
    name: 'Ghost Recon Drone',
    description: 'You have manifested a tiny, invisible mana-construct that serves as a scout.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can cast Find Familiar as a ritual, but the familiar is a tiny, invisible mechanical drone.',
      'You can see and hear through the drone\'s senses as long as it is on the same plane of existence.',
      'As an action, the drone can emit a high-frequency pulse that reveals invisible creatures within 10 feet.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'action' },
    flavor: '[DRONE DEPLOYED — STEALTH MODE: ACTIVE — FEED: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-vault-master',
    name: 'Dimensional Vault Master',
    description: 'Your personal inventory space has been expanded and optimized by the System.',
    benefits: [
      'Your carrying capacity is tripled.',
      'You can retrieve or stow an item from your personal vault as a free action once per turn.',
      'You can hide one item (up to 10 lbs) in a pocket dimension that cannot be detected by non-System scans.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'free' },
    flavor: '[INVENTORY CAPACITY: UPGRADED — ACCESS SPEED: OPTIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'adrenaline-overdrive',
    name: 'Adrenaline Overdrive',
    description: 'You can force your body into a state of heightened physical performance at the cost of extreme fatigue.',
    prerequisites: { ability: 'Constitution', score: 15 },
    benefits: [
      'As a bonus action, you can take an additional action this turn.',
      'After using this ability, your speed is halved and you cannot take reactions until the end of your next turn.',
      'Once used, you must complete a long rest before using it again.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'bonus-action' },
    flavor: '[LIMITER RELEASE: 100% — PHYSICAL BUFFER: EXCEEDED — PROCEED WITH CAUTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'urban-parkour-expert',
    name: 'Urban Parkour Expert',
    description: 'You move through the city and the dungeon with equal ease, utilizing every surface for mobility.',
    benefits: [
      'Climbing does not cost you extra movement.',
      'You can make a running long jump or running high jump after moving only 5 feet.',
      'You have advantage on Dexterity (Acrobatics) checks made to navigate difficult terrain.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'The city is just another dungeon. The dungeon is just another playground.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-shield-capacitor',
    name: 'Mana Shield Capacitor',
    description: 'You have installed a mana-reactive shield generator in your neural network.',
    benefits: [
      'When you take damage, you can use your reaction to reduce the damage by an amount equal to your level + Int modifier.',
      'If this reduces the damage to 0, the capacitor gains a charge. At 3 charges, your next spell deals an extra 2d6 force damage.',
      'You gain proficiency in Constitution saving throws.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'reaction' },
    flavor: '[SHIELD INTEGRITY: 100% — CAPACITOR STATUS: CHARGING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'apex-negotiator-protocol',
    name: 'Apex Negotiator Protocol',
    description: 'The System analyzes social cues and micro-expressions, feeding you the perfect responses.',
    prerequisites: { ability: 'Charisma', score: 13 },
    benefits: [
      'You gain advantage on Charisma (Persuasion) and Charisma (Deception) checks against humanoids.',
      'The System highlights when someone is lying to you (Insight advantage).',
      'Once per long rest, you can use an action to "Charm" a person (as the spell) via logical manipulation.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'action' },
    flavor: '[SOCIAL ANALYSIS: COMPLETE — OPTIMAL RESPONSE: CALCULATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'echo-location-sonar',
    name: 'Echo-Location Sonar',
    description: 'You emit high-frequency mana pulses that map your surroundings in total darkness.',
    benefits: [
      'You gain blindsight out to 30 feet.',
      'You have advantage on Wisdom (Perception) checks made to detect hidden creatures within 30 feet.',
      'Creatures cannot gain advantage on attack rolls against you by being hidden.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SONAR PULSE: ACTIVE — TOPOGRAPHY MAPPED — THREATS: IDENTIFIED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-engineer',
    name: 'Gate Engineer',
    description: 'You understand the structural mechanics of dimensional rifts, allowing you to manipulate them.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You can spend 10 minutes to stabilize a collapsing gate, delaying its closure by 1 hour.',
      'You have advantage on checks made to disable magical traps or security systems within a gate.',
      'Proficiency in Hacking Tools and Tinker\'s Tools.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GATE STRUCTURE: ANALYZED — STABILITY: MAINTAINED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'berserker-bloodlust',
    name: 'Berserker Bloodlust',
    description: 'The sight of blood triggers a systemic combat frenzy.',
    prerequisites: { job: 'Berserker' },
    benefits: [
      'When you reduce a creature to 0 HP, you can immediately move up to half your speed and make one melee weapon attack as a free action.',
      'While below half HP, you have advantage on all Strength checks and Strength saving throws.',
      'Your critical hit range increases by 1 (e.g., 19-20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'free' },
    flavor: '[THREAT DETECTED — ADRENALINE: MAXIMIZED — ANNIHILATE.]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-analyst',
    name: 'System Analyst',
    description: 'You can read the underlying data of the world, identifying the properties of anything you see.',
    benefits: [
      'You can cast Identify and Detect Magic at will, without expending a spell slot or material components.',
      'You have advantage on Intelligence (Investigation) checks made to understand how a device or spell works.',
      'The System displays the "Challenge Rating" or "Power Level" of any creature you look at for 6 seconds.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SCANNING... DATA RETRIEVED — TARGET CLASSIFICATION: ELITE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'phantom-limb-technique',
    name: 'Phantom Limb Technique',
    description: 'You use mana to extend your reach and manipulate objects from a distance.',
    benefits: [
      'Your reach for melee attacks and object interaction increases by 5 feet.',
      'You can cast Mage Hand as a bonus action, and the hand is invisible.',
      'You have advantage on Sleight of Hand checks made using your Mage Hand.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: 'The System bridges the gap between intent and impact.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-armor-mastery-v2',
    name: 'Plating Specialist',
    description: 'You have mastered the weight and balance of heavy defensive plating.',
    prerequisites: { armor_proficiencies: ['Heavy armor'] },
    benefits: [
      '+1 to Strength score (max 20).',
      'While wearing heavy armor, bludgeoning, piercing, and slashing damage you take from non-magical attacks is reduced by 3.',
      'You can don or doff heavy armor in half the normal time.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[ARMOR INTEGRITY: OPTIMIZED — KINETIC DAMPING: ACTIVE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-step-expert',
    name: 'Dimensional Step Expert',
    description: 'Your short-range teleportation is more efficient and frequent.',
    prerequisites: { level: 4 },
    benefits: [
      'When you teleport, you can bring one willing creature of your size or smaller with you.',
      'Your teleportation range increases by 10 feet.',
      'Once per long rest, use a reaction to teleport up to 30 feet when you would take damage.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'reaction' },
    flavor: '[SPACE-TIME COORDS: LOCKED — DISTORTION: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-battery-core',
    name: 'Mana Battery Core',
    description: 'Your internal mana core is exceptionally large and efficient.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'You gain 2 additional 1st-level spell slots.',
      'When you finish a short rest, you can recover spell slots whose combined level is equal to half your level.',
      'Your spells deal an additional 1d4 force damage.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[MANA CORE: EXPANDED — OUTPUT: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'hunter-guild-leader',
    name: 'Guild Leader Protocol',
    description: 'You have the natural charisma and tactical mind to lead a guild of hunters.',
    prerequisites: { ability: 'Charisma', score: 15 },
    benefits: [
      'You can coordinate up to 10 allies. Allies who can see and hear you have advantage on saves against fear.',
      'As a bonus action, grant one ally within 30 feet an additional reaction they can use before the start of your next turn.',
      'You gain proficiency in Persuasion and Intimidation.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'bonus-action' },
    flavor: '[LEADERSHIP PROTOCOL: ACTIVE — GUILD MORALE: MAXIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'void-blade-mastery',
    name: 'Void Blade Mastery',
    description: 'Your weapons slice through the very fabric of reality.',
    prerequisites: { ability: 'Strength', score: 17 },
    benefits: [
      'Your melee weapon attacks ignore resistance to their damage type.',
      'Once per turn, when you hit a creature, you can force it to make a Charisma save or be banished to a void-space until the start of your next turn.',
      'Your critical hits deal an additional 1d12 force damage.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', ability: 'Charisma', save: 'Charisma', dc: 'ability-modifier' },
    flavor: '[VOID EDGE: ACTIVE — REALITY INTEGRITY: FAILING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-overseer-eyes',
    name: 'Overseer Eyes',
    description: 'The System grants you the ability to see through all deceptions.',
    prerequisites: { level: 12 },
    benefits: [
      'You gain Truesight out to 30 feet.',
      'You can see through any magical or non-magical illusion.',
      'You have advantage on all saving throws against being blinded or dazzled.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[VISUAL DATA: UNFILTERED — TRUTH: REVEALED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-guardian-stance',
    name: 'Gate Guardian Stance',
    description: 'You stand as an unbreakable wall against the tides of the dungeon.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'While you are not moving, you have a +2 bonus to AC.',
      'Creatures that provoke an opportunity attack from you take an additional 1d10 damage if you hit.',
      'You are immune to being moved against your will while you are conscious.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DEFENSIVE STANCE: LOCKED — PERIMETER: SECURE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-overseer-eyes',
    name: 'Overseer Eyes',
    description: 'The System grants you the ability to see through all deceptions.',
    prerequisites: { level: 12 },
    benefits: [
      'You gain Truesight out to 30 feet.',
      'You can see through any magical or non-magical illusion.',
      'You have advantage on all saving throws against being blinded or dazzled.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[VISUAL DATA: UNFILTERED — TRUTH: REVEALED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'kinetic-redirection-expert',
    name: 'Kinetic Redirection Expert',
    description: 'You have mastered the art of catching and returning ranged fire.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When a ranged weapon attack misses you, you can use your reaction to make a ranged weapon attack against the attacker.',
      'You gain proficiency in Dexterity saving throws.',
      'You can use your Dexterity modifier instead of Strength for jump distance.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[PROJECTILE TRAJECTORY: ANALYZED — COUNTER-FIRE: INITIATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-surge-catalyst',
    name: 'Mana Surge Catalyst',
    description: 'Your mana flow is highly volatile, allowing for explosive bursts of power.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'Once per long rest, when you cast a spell that deals damage, you can maximize the damage of one die.',
      'You can cast Shield once per long rest without expending a spell slot.',
      'Your mana-infused attacks count as magical for overcoming resistance.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'free' },
    flavor: '[CATALYTIC SURGE: ACTIVE — OUTPUT: PEAK]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-shifter-dodge',
    name: 'Dimensional Shifter Dodge',
    description: 'You flicker in and out of reality when under threat.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'When you take the Disengage action, you can teleport up to 10 feet to an unoccupied space.',
      'Attack rolls against you have disadvantage if you have moved at least 20 feet this turn.',
      '+1 to AC while not wearing heavy armor.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[REALITY ANCHOR: DISENGAGED — POSITION: PROBABILISTIC]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-scholar',
    name: 'System Scholar',
    description: 'You have studied the System\'s lore and mechanics more deeply than most.',
    benefits: [
      'You gain proficiency in three skills of your choice.',
      'You have advantage on Intelligence (Arcana) checks made to identify System protocols or rifts.',
      'You can cast Detect Magic as a ritual.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DATA ARCHIVE: ACCESSED — KNOWLEDGE BASE: EXPANDED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'heavy-weapon-annihilator',
    name: 'Heavy Weapon Annihilator',
    description: 'You swing massive weapons with terrifying momentum.',
    prerequisites: { ability: 'Strength', score: 17 },
    benefits: [
      'When you score a critical hit with a heavy weapon, the target is knocked prone.',
      'Once per turn, when you hit with a heavy weapon, you can deal an extra 1d8 force damage.',
      'You gain proficiency in Athletics.'
    ],
    mechanics: { type: 'passive', frequency: 'once-per-turn' },
    flavor: '[MASS AMPLIFIED — IMPACT FORCE: CATASTROPHIC]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'cybernetic-reflex-booster',
    name: 'Cybernetic Reflex Booster',
    description: 'Your neural link with the System has been overclocked for speed.',
    benefits: [
      '+2 to Initiative rolls.',
      'You can take the Dash or Disengage action as a bonus action.',
      'You have advantage on Dexterity checks made to initiate combat.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[NEURAL LATENCY: 0.01ms — RESPONSE TIME: INSTANT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-burn-specialist',
    name: 'Mana Burn Specialist',
    description: 'Your attacks leave lingering mana-residue that ignites spellcasters.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'When you hit a creature concentrating on a spell, they have disadvantage on the Con save to maintain it.',
      'Creatures hit by your spells cannot take reactions until the start of your next turn.',
      'You gain resistance to force damage.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[MANA SIGNATURE: TRACED — FEEDBACK LOOP: INITIATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-raid-veteran',
    name: 'Gate Raid Veteran',
    description: 'You have seen it all in the rifts. Nothing shakes you.',
    benefits: [
      'You are immune to the frightened condition.',
      'You have advantage on all saving throws made while inside a gate.',
      '+1 to Wisdom score (max 20).'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[STRESS TOLERANCE: MAXIMUM — EMOTIONAL BUFFER: STABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'neural-network-hacker',
    name: 'Neural Network Hacker',
    description: 'You can interface directly with the minds of others via the System.',
    prerequisites: { ability: 'Intelligence', score: 15 },
    benefits: [
      'You can cast Message at will.',
      'Once per long rest, you can cast Suggestion without expending a spell slot (Int save).',
      'You have advantage on checks made to detect if someone is under magical influence.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action', save: 'Intelligence', dc: 'ability-modifier' },
    flavor: '[COGNITIVE UPLINK: ESTABLISHED — PERMISSION: GRANTED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-step-evader',
    name: 'Dimensional Step Evader',
    description: 'You slip through cracks in space to avoid harm.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you are targeted by an opportunity attack, you can use your reaction to teleport up to 10 feet.',
      'You can move through the space of hostile creatures regardless of their size.',
      '+1 to Dexterity score (max 20).'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: '[THREAT DETECTED — SHIFTING COORDINATES... SUCCESS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-capacitor-armor',
    name: 'Mana Capacitor Armor',
    description: 'Your armor stores ambient energy to reinforce your strikes.',
    prerequisites: { armor_proficiencies: ['Medium armor'] },
    benefits: [
      'While wearing armor, your AC increases by 1.',
      'When you take damage, your next melee attack deals an extra 1d6 force damage.',
      'You gain proficiency in Strength saving throws.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[CAPACITOR STATUS: CHARGING — ENERGY DIVERTED TO WEAPONS]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'apex-assassin-strike',
    name: 'Apex Assassin Strike',
    description: 'You have mastered the art of the perfect kill.',
    prerequisites: { job: 'Assassin' },
    benefits: [
      'Your sneak attack damage dice become d8s instead of d6s.',
      'If you surprise a creature and hit it, the hit is automatically a critical hit.',
      'You gain a +10 bonus to Stealth checks if you do not move more than half your speed.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[TARGET: TERMINATED — EXECUTION: PERFECT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-fortress-body',
    name: 'System Fortress Body',
    description: 'Your body has been hardened into a living bunker.',
    prerequisites: { ability: 'Constitution', score: 17 },
    benefits: [
      'You gain resistance to bludgeoning, piercing, and slashing damage.',
      'Your HP maximum increases by an additional 1 per level.',
      'You cannot be knocked prone while you are conscious.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[BIOLOGICAL HARDENING: 100% — INTEGRITY: UNBREAKABLE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-weaver-ritualist',
    name: 'Mana Weaver Ritualist',
    description: 'You can weave complex mana-patterns without expending slots.',
    benefits: [
      'You can cast any spell you know with the ritual tag as a ritual.',
      'Ritual casting time is reduced to 1 minute.',
      'You gain proficiency in two Intelligence or Wisdom based skills.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[RITUAL PROTOCOL: OPTIMIZED — MANA CONSUMPTION: 0%]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-master-navigator',
    name: 'Gate Master Navigator',
    description: 'The rifts are your second home. You know every shortcut.',
    prerequisites: { level: 8 },
    benefits: [
      'You and your party move at double speed through gate environments.',
      'You cannot become lost in a gate unless by magical means.',
      'Once per long rest, you can sense the exact location of the boss-room in a gate.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[TOPOGRAPHY: ANALYZED — OPTIMAL ROUTE: PLOTTED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'neural-sync-sharpshooter',
    name: 'Neural Sync Sharpshooter',
    description: 'Your link with the System provides perfect ballistic calculations.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'Attacking at long range doesn\'t impose disadvantage.',
      'Your ranged weapon attacks ignore half and three-quarters cover.',
      'Before you make an attack with a ranged weapon, you can take a -5 penalty to the attack roll to gain +10 damage.'
    ],
    mechanics: { type: 'active', frequency: 'at-will' },
    flavor: '[WIND SPEED: 2m/s — GRAVITY: COMPENSATED — FIRE.]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'void-step-striker',
    name: 'Void Step Striker',
    description: 'You strike through rifts in space, reaching targets from afar.',
    prerequisites: { level: 6 },
    benefits: [
      'Your reach for melee weapon attacks increases by 10 feet on your turn.',
      'Once per turn, when you hit a creature with a melee attack, you can teleport to an unoccupied space within 5 feet of it.',
      'You gain resistance to necrotic damage.'
    ],
    mechanics: { type: 'active', frequency: 'once-per-turn' },
    flavor: '[SPACE-TIME FOLDING: ACTIVE — RANGE: EXTENDED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-executioner',
    name: 'System Executioner',
    description: 'The System has designated you as the final arbiter of death.',
    prerequisites: { level: 14 },
    benefits: [
      'When you reduce a creature to 10 HP or less, it dies instantly.',
      'You have advantage on attack rolls against creatures below half HP.',
      'You gain proficiency in Intimidation.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[TARGET STATUS: EXECUTABLE — INITIATING FINAL PROTOCOL]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-well-font',
    name: 'Mana Well Font',
    description: 'You are a living battery of mana energy.',
    prerequisites: { level: 10, feats: ['mana-well-vessel'] },
    benefits: [
      'Your spell slot recovery ability now recovers slots whose combined level is equal to your level.',
      'Your spell save DC increases by 1.',
      'You gain one additional 5th-level spell slot.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[MANA DENSITY: UNSTABLE — FONT STATUS: OVERFLOWING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-interface-optimization',
    name: 'Interface Optimization',
    description: 'The System interface has been optimized for your neural architecture, allowing faster data processing.',
    benefits: [
      'You can use a bonus action to take the Help action.',
      'When you take the Help action to aid an ally\'s attack roll, you can also give them a +1d4 bonus to their damage roll.',
      'You gain proficiency in one skill of your choice.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[UI OPTIMIZATION: COMPLETE — PROCESSING LATENCY: MINIMIZED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-anchor-specialist',
    name: 'Gate Anchor Specialist',
    description: 'You have a deep understanding of rift stability, allowing you to anchor yourself or others to reality.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'You have advantage on saving throws against being banished or teleported against your will.',
      'As a reaction when an ally within 30 feet is forced to teleport, you can force the effect to fail (once per long rest).',
      'You gain proficiency in the Athletics skill.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'reaction' },
    flavor: '[REALITY ANCHOR: ENGAGED — DIMENSIONAL SLIP: PREVENTED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-blade-dancer',
    name: 'Mana Blade Dancer',
    description: 'You move with a flow that mirrors the currents of ambient mana, making your movements unpredictable.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'When you are wielding a finesse weapon, you gain a +1 bonus to AC.',
      'You can use your reaction to impose disadvantage on one melee attack roll made against you.',
      'Your movement speed increases by 5 feet.'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'reaction' },
    flavor: 'You don\'t just dodge; you flow around the strike like water.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-recon-specialist',
    name: 'Recon Specialist',
    description: 'Your HUD is tuned for long-range detection and structural analysis.',
    benefits: [
      'You gain darkvision out to 120 feet. If you already have darkvision, its range increases by 60 feet.',
      'You can see through up to 1 foot of stone, 1 inch of common metal, or 3 feet of wood or dirt.',
      'You have advantage on Perception checks made to detect hidden rifts or traps.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[X-RAY SCAN: ACTIVE — OPTIC NERVE: OVERCLOCKED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'neural-link-tactician',
    name: 'Neural Link Tactician',
    description: 'You can forge a temporary neural link with your party to coordinate complex maneuvers.',
    prerequisites: { ability: 'Intelligence', score: 13 },
    benefits: [
      'As a bonus action, you can direct an ally to move up to half their speed or make one melee attack.',
      'Allies under your direction gain a +2 bonus to the directed roll.',
      'Once per long rest, you can grant the entire party advantage on initiative.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'bonus-action' },
    flavor: '[TACTICAL UPLINK: ESTABLISHED — COORDINATING STRIKE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-surge-vanguard',
    name: 'Mana Surge Vanguard',
    description: 'You can detonate your internal mana reserves to clear space around you.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'As an action, you can release a mana-burst. Each creature within 10 feet must make a Strength save (DC 8 + prof + Str mod).',
      'On a failure, a creature takes 2d8 force damage and is pushed 10 feet. On a success, half damage and no push.',
      'You can use this ability a number of times equal to your proficiency bonus per long rest.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action', save: 'Strength', dc: 'ability-modifier' },
    flavor: '[MANA PRESSURE: RELEASED — KINETIC WAVE: DEPLOYED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'cyber-medic-expert',
    name: 'Cyber-Medic Expert',
    description: 'Your medical protocols have been upgraded with nanite-simulating mana.',
    prerequisites: { skill_proficiencies: ['Medicine'] },
    benefits: [
      'When you use Medicine to stabilize an ally, they regain HP equal to your level.',
      'You can use an action to remove one condition (poisoned, paralyzed, or stunned) from a creature.',
      'You gain advantage on saving throws against disease and poison.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action' },
    flavor: '[NANITE ANALOGS: DEPLOYED — SYSTEMIC PURGE: COMPLETE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'void-rifter',
    name: 'Void Rifter',
    description: 'You can create tiny, localized rifts to bypass physical obstacles.',
    benefits: [
      'You can cast Misty Step once per short rest without expending a spell slot.',
      'You can reach through solid objects up to 1 inch thick as if they weren\'t there.',
      'You gain resistance to force damage.'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'bonus-action' },
    flavor: '[LOCALIZED RIFT: STABLE — BYPASSING GEOMETRY]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-interceptor',
    name: 'System Interceptor',
    description: 'You can jam the System signals of nearby enemies, making their abilities fail.',
    prerequisites: { ability: 'Intelligence', score: 15 },
    benefits: [
      'When a creature you can see within 60 feet uses a recharge ability, you can use your reaction to force them to roll again.',
      'You can cast Counterspell once per long rest without a spell slot (Intelligence check).',
      'You have advantage on saving throws against spells.'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'reaction' },
    flavor: '[SIGNAL JAMMER: ACTIVE — ENEMY PROTOCOLS: DISRUPTED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'dimensional-scavenger',
    name: 'Dimensional Scavenger',
    description: 'You find value in the detritus of the rifts that others overlook.',
    benefits: [
      'You have advantage on Investigation checks made to find loot in gate zones.',
      'You can identify any mana-crystal or rift-related item as a free action.',
      'You find twice as many consumable items (potions, scrolls) in random loot.'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[LOOT SENSORS: CALIBRATED — OPTIMIZING RESOURCE EXTRACTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-extraction-expert',
    name: 'Shadow Extraction Expert',
    description: 'Your extraction technique has been refined — faster, more reliable, capable of binding stronger shadows.',
    prerequisites: { level: 3, feats: ['shadow-mastery'] },
    benefits: [
      'Extract shadows from creatures up to CR 1 higher than your level',
      'Extracted shadows have +2 to all ability scores',
      'Can extract and command up to 2 shadows at once',
      'Extraction takes 1 minute instead of 10'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action' },
    flavor: '[EXTRACTION PROTOCOL: UPGRADED — BINDING EFFICIENCY: +200%]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-weapon-mastery',
    name: 'Shadow Weapon Mastery',
    description: 'You forge weapons from pure shadow energy, summoning blades that dissolve after striking.',
    prerequisites: { level: 10, feats: ['shadow-mastery'] },
    benefits: [
      'Can create shadow weapons as a bonus action (any simple or martial weapon)',
      'Shadow weapons deal +1d6 necrotic damage',
      'Can change weapon form as a bonus action',
      'Can throw shadow weapons — they return to your hand at end of turn'
    ],
    mechanics: { type: 'active', frequency: 'bonus-action', action: 'bonus-action' },
    flavor: 'Your will becomes steel, forged in the darkness of your soul.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-armor',
    name: 'Shadow Armor',
    description: 'You weave protective shadow energy around yourself, forming armor from compressed darkness.',
    prerequisites: { level: 8, feats: ['shadow-mastery'] },
    benefits: [
      'Form shadow armor as a bonus action — provides +2 AC',
      'Shadow armor grants resistance to non-magical damage',
      'Shadow armor imposes no Stealth disadvantage',
      'Can repair shadow armor as a bonus action if damaged'
    ],
    mechanics: { type: 'active', frequency: 'bonus-action', action: 'bonus-action' },
    flavor: 'The shadows themselves become your shield against harm.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'regents-resilience',
    name: 'Regent\'s Resilience',
    description: 'The power of a Regent flows through you, granting durability that transcends mortal limits.',
    prerequisites: { level: 20, feats: ['shadow-mastery', 'regent-aura'] },
    benefits: [
      'Resistance to all damage types except radiant',
      'Cannot be reduced below 1 HP by shadow damage',
      'Regenerate 5 HP per round',
      'When reduced to 0 HP, spend 1 resolve point to return to 50% HP (once per long rest)'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[REGENT RESILIENCE: ACTIVE — MORTALITY: SUSPENDED]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // SYSTEM INTERFACE FEATS
  // ═══════════════════════════════════════════
  {
    id: 'system-overclock',
    name: 'System Overclock',
    description: 'You push your System interface beyond safe limits, temporarily boosting all stat outputs.',
    prerequisites: { level: 5, ability: 'Constitution', score: 13 },
    benefits: [
      'As a bonus action, enter Overclock for 1 minute: +2 to all ability checks and saving throws',
      'Speed increases by 10 feet, +1d4 force damage on weapon attacks',
      'When Overclock ends, gain 1 level of exhaustion',
      'Duration extends by 1 round per enemy reduced to 0 HP'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'bonus-action' },
    flavor: '[WARNING: SYSTEM OVERCLOCK — STAT LIMITERS REMOVED — BURNOUT IMMINENT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'threat-ping',
    name: 'Threat Ping',
    description: 'Your System broadcasts threat markers to allies, highlighting enemies and weak points.',
    prerequisites: { level: 3, ability: 'Wisdom', score: 12 },
    benefits: [
      'As a bonus action, mark one creature — allies within 60 feet deal +1d4 damage to marked target',
      'Mark lasts 1 minute or until target drops to 0 HP',
      'Only one mark at a time; marking new target removes old mark',
      'When marked target drops to 0 HP, immediately mark another as a free action'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[THREAT PING: TARGET MARKED — ALL HUNTERS: FOCUS FIRE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'quest-log-intuition',
    name: 'Quest Log Intuition',
    description: 'Your System feeds you hints about objectives, hidden paths, and threat assessments.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'System highlights interactive objects and hidden doors within 30 feet',
      'Receive threat assessment when entering a new area',
      'Once per long rest, ask for a hint — DM provides one true clue',
      'Cannot be surprised while System interface is active'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[QUEST UPDATE: OBJECTIVE NEARBY — THREAT LEVEL: CAUTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'kill-count-momentum',
    name: 'Kill Count Momentum',
    description: 'The System tracks kills in real time. As the count rises, combat efficiency escalates.',
    prerequisites: { level: 3, ability: 'Strength', score: 13 },
    benefits: [
      'System maintains a kill counter per combat encounter',
      'After 2 kills: +1 to attack rolls',
      'After 4 kills: +1d4 bonus damage on weapon attacks',
      'After 6 kills: crit range expands by 1. Resets when combat ends or 1 min without a kill'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: '[KILL COUNT: RISING — COMBAT EFFICIENCY: ESCALATING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'daily-quest-discipline',
    name: 'Daily Quest Discipline',
    description: 'You follow the System\'s daily training regimen. Consistent completion has enhanced your baseline.',
    prerequisites: { level: 2, ability: 'Constitution', score: 12 },
    benefits: [
      'HP maximum increases by 1 per level (retroactive)',
      'Recover 1 additional hit die during long rests',
      'Once per day after a short rest, remove 1 level of exhaustion',
      'Declare daily quest at dawn for +1 to all saves until next long rest'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DAILY QUEST: 100 PUSH-UPS, 100 SIT-UPS, 100 SQUATS, 10KM RUN]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // GATE SURVIVAL FEATS
  // ═══════════════════════════════════════════
  {
    id: 'gate-sense',
    name: 'Gate Sense',
    description: 'Repeated gate exposure has attuned your senses to dimensional energy.',
    prerequisites: { level: 3, ability: 'Wisdom', score: 12 },
    benefits: [
      'Sense gates or rifts within 1 mile',
      'Determine rank (D-S) by spending 1 minute within 30 feet',
      'Advantage on saves against forced teleportation',
      'Detect invisible/ethereal creatures within 15 feet'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DIMENSIONAL ANOMALY DETECTED — RANK: B — CAUTION ADVISED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-hardened',
    name: 'Gate-Hardened',
    description: 'Repeated gate exposure has warped your body, granting resistance to dimensional hazards.',
    prerequisites: { level: 6, ability: 'Constitution', score: 14 },
    benefits: [
      'Immune to gate-entry disorientation and psychic static',
      'Resistance to one damage type of your choice',
      'Extreme gate environments impose no disadvantage',
      'Once per long rest, drop to 1 HP instead of 0 inside a gate'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Other hunters vomit at the threshold. You just check your gear and walk in.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'boss-reader',
    name: 'Boss Reader',
    description: 'You read gate boss attack patterns. The System highlights wind-up animations.',
    prerequisites: { level: 8, ability: 'Intelligence', score: 13 },
    benefits: [
      'When CR 5+ creature begins a special ability, react to warn allies — +3 to their save',
      'After 1 round of observation, identify boss\'s legendary actions and resistances',
      'Once per long rest, "Pattern Read" a recharge ability — it automatically misses you',
      'System displays boss HP as a percentage bar'
    ],
    mechanics: { type: 'triggered', frequency: 'long-rest', action: 'reaction' },
    flavor: '[BOSS PATTERN DETECTED — DODGE WINDOW: NOW]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // MANA CIRCUIT FEATS
  // ═══════════════════════════════════════════
  {
    id: 'mana-overflow',
    name: 'Mana Overflow',
    description: 'Your circuits temporarily hold more energy than designed, supercharging your next spell.',
    prerequisites: { level: 5, ability: 'Intelligence', score: 14 },
    benefits: [
      'Once per short rest, Mana Overflow a spell: deal maximum damage instead of rolling',
      'Also increases spell range by 50% and area by 5 feet',
      'Take 1d8 force damage after as circuits vent',
      'First spell in combat auto-triggers Overflow if available'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'free' },
    flavor: '[MANA OVERFLOW — OUTPUT EXCEEDS CAPACITY — VENTING...]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-siphon',
    name: 'Mana Siphon',
    description: 'On kill, your circuits drain residual energy from the corpse, recovering spent resources.',
    prerequisites: { level: 6, ability: 'Intelligence', score: 13 },
    benefits: [
      'Kill with spell: recover a slot 1 level lower than used (min 1st)',
      'Kill with weapon: regain 1d6 + Int modifier HP',
      'Siphoned energy dissipates after 1 hour if unused',
      'Cannot siphon from constructs or undead'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: 'Every death refills your reserves. The System designed hunters to be perpetual engines.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    description: 'You overload an enemy\'s mana network, disrupting their magical abilities.',
    prerequisites: { level: 7, ability: 'Charisma', score: 14 },
    benefits: [
      'As an action, target one creature within 30 feet — Con save vs your spell DC',
      'On fail, cannot cast spells or use magical abilities until end of your next turn',
      'If concentrating, that spell ends immediately',
      'Forces Legendary Resistance expenditure if resisted'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action', save: 'Constitution', dc: 'spell-save' },
    flavor: '[CIRCUIT BREAKER — MANA NETWORK: DISRUPTED — CASTING: DISABLED]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // COMBAT FEATS (SA-flavored)
  // ═══════════════════════════════════════════
  {
    id: 'annihilation-style',
    name: 'Annihilation Style',
    description: 'You channel raw mana through heavy weapons, trading accuracy for catastrophic damage.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'On hit with heavy weapon, -5 attack for +10 damage',
      'On crit with heavy weapon, add one additional damage die',
      'After reducing to 0 HP, make one bonus action attack',
      'Proficient with all martial weapons'
    ],
    mechanics: { type: 'active', frequency: 'at-will' },
    flavor: 'The System measures your output in tons of force per swing.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'deadeye-protocol',
    name: 'Deadeye Protocol',
    description: 'The System feeds targeting data into your instincts, eliminating range penalties.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'Long range doesn\'t impose disadvantage',
      'Ranged attacks ignore half and three-quarters cover',
      '-5 attack for +10 damage on ranged attacks',
      '+2 to damage with ranged weapons'
    ],
    mechanics: { type: 'active', frequency: 'at-will' },
    flavor: '[TARGET LOCKED] — the System draws the line, you pull the trigger.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'iron-vanguard',
    name: 'Iron Vanguard',
    description: 'You anchor your position with mana-reinforced resolve, locking down enemies that try to bypass you.',
    benefits: [
      'Opportunity attack hits reduce target speed to 0',
      'Creatures provoke opportunity attacks even when Disengaging',
      'When adjacent creature attacks an ally, use reaction to attack it',
      'Opportunity attacks against you have disadvantage'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Nothing passes without paying the toll.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'twin-fang-technique',
    name: 'Twin Fang Technique',
    description: 'You split mana flow into twin channels, wielding paired weapons with perfect sync.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'Draw or stow two one-handed weapons simultaneously',
      'Two-weapon fighting works even when weapons aren\'t light',
      '+2 AC while wielding two weapons',
      'Add ability modifier to off-hand damage'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Left fang, right fang — prey caught between has nowhere to run.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'battle-channeler',
    name: 'Battle Channeler',
    description: 'Your mana circuits remain stable under combat stress.',
    benefits: [
      'Advantage on Con saves to maintain concentration',
      'Somatic components work with weapons or shields in hands',
      'Can cast a spell as an opportunity attack',
      'Spells as reactions don\'t consume opportunity attack reaction'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Blades clash around you, but your mana flow never wavers.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gatekeepers-reach',
    name: 'Gatekeeper\'s Reach',
    description: 'You wield reach weapons with the discipline of a gate-zone sentinel, controlling space.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'Bonus action attack with opposite end of polearm (1d4 damage)',
      'Creatures provoke opportunity attacks when entering your reach',
      '+1 to damage with polearms',
      'Can use polearm one-handed'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Nothing enters your zone without the System\'s permission — and yours.',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // DEFENSIVE FEATS (SA-flavored)
  // ═══════════════════════════════════════════
  {
    id: 'iron-constitution',
    name: 'Iron Constitution',
    description: 'The System reinforced your cellular structure, increasing your capacity to absorb punishment.',
    benefits: [
      'HP maximum increases by 2 per level (retroactive)',
      'Resistance to non-magical bludgeoning damage',
      'Withstand extreme conditions without penalty',
      'Healing effects restore additional HP equal to proficiency bonus'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[VITALITY STAT INCREASED] — lesser blows no longer register.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'adaptive-resistance',
    name: 'Adaptive Resistance',
    description: 'Repeated threat exposure triggered a System adaptation, hardening your defenses.',
    benefits: [
      'Gain proficiency in one saving throw of your choice',
      'Advantage on the chosen saving throw',
      'Reroll a failed save of that type once per long rest',
      'Immunity to minor effects of that type'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'What nearly killed you before now barely registers.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'fortress-conditioning',
    name: 'Fortress Conditioning',
    description: 'Mana-reinforced muscle density lets you wear heavy plating as a second skin.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'Heavy armor doesn\'t impose Stealth disadvantage',
      'Reduce non-magical physical damage by 3',
      'Heavy armor doesn\'t reduce speed',
      'Sleep in heavy armor without penalty'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Other hunters remove their armor to rest. You barely notice yours.',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // HUNTER PROTOCOL FEATS
  // ═══════════════════════════════════════════
  {
    id: 'party-sync',
    name: 'Party Sync',
    description: 'Synchronize your System with allies, sharing real-time tactical data.',
    prerequisites: { level: 5, ability: 'Charisma', score: 13 },
    benefits: [
      'Sync with up to 5 allies during rest — they see each other\'s HP percentages',
      'Synced allies can\'t be surprised within 60 feet of each other',
      'Once per long rest, when synced ally drops to 0 HP, grant them temp HP equal to your level',
      '+1 to initiative for synced allies'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PARTY SYNC: ESTABLISHED — VITALS: SHARING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'last-stand-protocol',
    name: 'Last Stand Protocol',
    description: 'At the brink, the System activates emergency combat mode — defense traded for offense.',
    prerequisites: { level: 8, ability: 'Constitution', score: 14 },
    benefits: [
      'Below 25% HP: +3 attack rolls, +1d8 damage',
      'AC reduced by 2, must stay adjacent to at least one enemy',
      'Killing while in Last Stand heals 1d10 + Con modifier',
      'Ends when HP above 50% or combat ends'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: '[CRITICAL HP — LAST STAND: ENGAGED — FIGHT.]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'emergency-extraction',
    name: 'Emergency Extraction',
    description: 'Your System calculates escape routes from collapsing gates.',
    prerequisites: { level: 6, ability: 'Dexterity', score: 13 },
    benefits: [
      'Once per long rest, open exit rift for 1 round — up to 5 allies within 30 feet teleport to safety',
      'Guaranteed success inside collapsing gates',
      'Evacuated allies stabilized at 1 HP if at 0',
      'Does not count as quest failure'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action' },
    flavor: '[EMERGENCY EXTRACTION — EVACUATE NOW]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // JOB FEATS
  // ═══════════════════════════════════════════
  {
    id: 'destroyer-resolve',
    name: 'Destroyer\'s Resolve',
    description: 'Your martial awakening forged an iron will that refuses to yield, even at death\'s threshold.',
    prerequisites: { job: 'Destroyer' },
    benefits: [
      'Advantage on saves against fear and charm',
      'Reroll failed saving throws once per day',
      'Gain temporary HP when reduced to 0 HP',
      'Cannot be reduced below 1 HP by failed death saves'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[HP CRITICAL — RESOLVE PROTOCOL: ACTIVATED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'stalker-grace',
    name: 'Stalker\'s Grace',
    description: 'Rift-tracking instincts grant supernatural grace and perception honed in gate-zone hunting.',
    prerequisites: { job: 'Stalker' },
    benefits: [
      'Advantage on Dexterity checks',
      'Move through difficult terrain without penalty',
      'Advantage on Perception checks',
      'Immunity to magical sleep effects'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Dimensional awareness flows through your every movement.',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // AWAKENING & S-RANK FEATS
  // ═══════════════════════════════════════════
  {
    id: 'double-awakening',
    name: 'Double Awakening',
    description: 'Your awakening triggered twice, granting abilities from a second job.',
    prerequisites: { level: 10 },
    benefits: [
      'Choose a second job — gain its level 1 and level 3 features',
      'Can use abilities from both jobs (standard concentration rules apply)',
      'System displays both job titles',
      'Gain one cantrip or at-will ability from second job'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[ANOMALY: SECOND AWAKENING — DUAL JOB: CONFIRMED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'latent-potential',
    name: 'Latent Potential',
    description: 'Your growth rate exceeds System predictions. Each level-up grants more than expected.',
    prerequisites: { level: 4, ability: 'Constitution', score: 13 },
    benefits: [
      'Roll hit die twice on level-up, take higher result',
      'Every 4 levels, +1 to an ability score (in addition to normal ASI)',
      'Carry capacity doubles',
      'System classifies you as "high-growth" — displayed rank treated as one tier higher'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GROWTH RATE: ANOMALOUS — POTENTIAL: UNBOUND]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'domain-of-shadows',
    name: 'Domain of Shadows',
    description: 'You project a sphere of absolute shadow that empowers your army and weakens all others.',
    prerequisites: { level: 15, feats: ['shadow-mastery'] },
    benefits: [
      'As an action, 60-foot shadow sphere for 1 minute',
      'Your shadows inside: +2 attacks, +2 AC, +1d6 necrotic',
      'Hostiles inside: disadvantage on attacks, halved speed',
      'Teleport to any point within as a bonus action'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action' },
    flavor: '[DOMAIN OF SHADOWS: DEPLOYED — ENEMIES: SUPPRESSED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-administrator',
    name: 'System Administrator',
    description: 'You have gained partial admin access to the System itself.',
    prerequisites: { level: 18 },
    benefits: [
      'Once per long rest, force reroll on any die within 60 feet — choose which result',
      'Read System status of any visible creature: HP, conditions, buffs, resources',
      'Once per long rest, System Command: "Heal" (50 HP), "Silence" (no casting 1 round), or "Reveal" (invisible in 120 ft)',
      'System addresses you as [ADMINISTRATOR]'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'free' },
    flavor: '[SYSTEM ACCESS: ADMINISTRATOR — AWAITING COMMAND]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'transcendent-vessel',
    name: 'Transcendent Vessel',
    description: 'Your body has evolved beyond mortal limits. The System no longer classifies you as human.',
    prerequisites: { level: 17 },
    benefits: [
      'Ability scores can exceed 20 (max 24)',
      'No need to eat, drink, sleep, or breathe — 4-hour meditation for long rest',
      'Immune to disease, poison, and aging',
      'Once ever: when you would die, return at 1 HP with 4 exhaustion levels instead'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[SPECIES: RECLASSIFIED — TRANSCENDENT — MORTALITY: CONDITIONAL]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'rulers-authority',
    name: 'Ruler\'s Authority',
    description: 'Your mana pressure is so overwhelming that weaker creatures cannot raise a hand against you.',
    prerequisites: { level: 15, ability: 'Charisma', score: 18 },
    benefits: [
      'Creatures CR ≤ half your level: Wis save or frightened 1 minute',
      'Frightened creatures cannot attack or target you',
      'Can suppress aura as a free action',
      'Fail by 10+: paralyzed 1 round instead'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', save: 'Wisdom', dc: 'ability-modifier' },
    flavor: '[MANA PRESSURE: REGENT-CLASS — KNEEL.]',
    source: 'System Ascendant Canon'
  }
];
