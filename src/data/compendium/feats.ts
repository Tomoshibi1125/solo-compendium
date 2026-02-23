// Feats Compendium - System Ascendant Original Content
// SA-flavored names and descriptions on 5e mechanical backbone
// All feats are unique to System Ascendant identity

export interface Feat {
  id: string;
  name: string;
  description: string;
  
  ability_score_increase?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  skill_proficiencies?: string[];
  tool_proficiencies?: string[];
  weapon_proficiencies?: string[];
  armor_proficiencies?: string[];
  special_abilities?: {
    name: string;
    description: string;
    type: 'passive' | 'active' | 'triggered';
    frequency?: string;
    action?: string;
  }[];
  
  prerequisites?: {
    level?: number;
    ability?: string;
    score?: number;
    feats?: string[];
    class?: string;
    background?: string;
  };
  benefits: string[];
  mechanics: {
    type: 'passive' | 'active' | 'triggered';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day' | 'once-per-turn' | 'when-critical-hit';
    action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    ability?: string;
    save?: string;
    dc?: number | 'ability-modifier' | 'spell-save';
  };
  flavor?: string;
  source: string;
  image?: string;
}

export const feats: Feat[] = [
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
      'Can store absorbed essence to fuel shadow abilities (counts as a spell slot of level equal to creature CR / 3)',
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
      'Can command shadow creatures as an action (Wisdom check contested by target\'s Charisma)',
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
      'When you take the Dodge action, can move up to your speed without provoking opportunity attacks',
      'Once per turn, can teleport up to 15 feet to unoccupied space you can see in dim light or darkness',
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
      'When you score a critical hit, target must make Constitution save (DC 8 + prof + Dex mod) or be blinded for 1 round',
      'Shadow-infused weapons count as magical for overcoming resistance',
      'Can reroll one damage die on critical hits (must use new result)'
    ],
    mechanics: { type: 'triggered', frequency: 'when-critical-hit', action: 'free' },
    flavor: '[CRITICAL STRIKE: SHADOW DETONATION — TARGET VISUAL SYSTEMS: OFFLINE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-extraction-expert',
    name: 'Shadow Extraction Expert',
    description: 'Your extraction technique has been refined — faster, more reliable, capable of binding stronger shadows.',
    prerequisites: { level: 3, feats: ['shadow-mastery'] },
    benefits: [
      'Can extract shadows from creatures up to CR 1 higher than your level',
      'Extracted shadows have +2 to all ability scores',
      'Can extract and command up to 2 shadows at once',
      'Extraction process takes only 1 minute instead of 10'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action' },
    flavor: '[EXTRACTION PROTOCOL: UPGRADED — BINDING EFFICIENCY: +200%]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // SYSTEM INTERFACE FEATS
  // ═══════════════════════════════════════════
  {
    id: 'system-overclock',
    name: 'System Overclock',
    description: 'You push your System interface beyond safe limits, temporarily boosting all stat outputs at a cost.',
    prerequisites: { level: 5, ability: 'Constitution', score: 13 },
    benefits: [
      'As a bonus action, enter Overclock for 1 minute: +2 to all ability checks and saving throws',
      'While Overclocked, speed increases by 10 feet and you deal +1d4 force damage on weapon attacks',
      'When Overclock ends, gain 1 level of exhaustion',
      'Duration extends by 1 round for every enemy reduced to 0 HP during it'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'bonus-action' },
    flavor: '[WARNING: SYSTEM OVERCLOCK — STAT LIMITERS REMOVED — BURNOUT IMMINENT]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'threat-ping',
    name: 'Threat Ping',
    description: 'Your System interface broadcasts threat markers to nearby allies, highlighting enemies and weak points.',
    prerequisites: { level: 3, ability: 'Wisdom', score: 12 },
    benefits: [
      'As a bonus action, mark one creature you can see. All allies within 60 feet deal +1d4 damage to the marked target',
      'Mark lasts for 1 minute or until the target drops to 0 HP',
      'Only one creature can be marked at a time. Marking a new target removes the old mark',
      'If the marked creature drops to 0 HP, you can immediately mark another creature as a free action'
    ],
    mechanics: { type: 'active', frequency: 'at-will', action: 'bonus-action' },
    flavor: '[THREAT PING: TARGET MARKED — ALL HUNTERS: FOCUS FIRE]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'quest-log-intuition',
    name: 'Quest Log Intuition',
    description: 'Your System interface feeds you hints about nearby objectives, hidden paths, and threat assessments.',
    prerequisites: { ability: 'Wisdom', score: 13 },
    benefits: [
      'The System highlights interactive objects and hidden doors within 30 feet (visible only to you)',
      'You receive a threat assessment (Safe/Caution/Danger/Lethal) when entering a new area',
      'Once per long rest, ask the System for a hint — the DM provides one true clue',
      'You cannot be surprised while your System interface is active'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[QUEST UPDATE: OBJECTIVE NEARBY — THREAT LEVEL: CAUTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'kill-count-momentum',
    name: 'Kill Count Momentum',
    description: 'The System tracks your kills in real time. As the count rises, your combat efficiency escalates.',
    prerequisites: { level: 3, ability: 'Strength', score: 13 },
    benefits: [
      'The System maintains a kill counter during each combat encounter',
      'After 2 kills: +1 to attack rolls for the rest of the encounter',
      'After 4 kills: +1d4 bonus damage on all weapon attacks',
      'After 6 kills: critical hit range expands by 1. Counter resets when combat ends or after 1 minute without a kill'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: '[KILL COUNT: RISING — COMBAT EFFICIENCY: ESCALATING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'daily-quest-discipline',
    name: 'Daily Quest Discipline',
    description: 'You follow the System\'s daily training regimen without fail. Consistent completion has enhanced your baseline.',
    prerequisites: { level: 2, ability: 'Constitution', score: 12 },
    benefits: [
      'HP maximum increases by 1 per level (retroactive)',
      'Recover 1 additional hit die during long rests',
      'Once per day after a short rest, remove 1 level of exhaustion',
      'If you declare your daily quest at dawn, gain +1 to all saving throws until next long rest'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DAILY QUEST: 100 PUSH-UPS, 100 SIT-UPS, 100 SQUATS, 10KM RUN — IN PROGRESS]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // GATE SURVIVAL FEATS
  // ═══════════════════════════════════════════
  {
    id: 'gate-sense',
    name: 'Gate Sense',
    description: 'Repeated gate exposure has attuned your senses to dimensional energy. You feel rifts before they open.',
    prerequisites: { level: 3, ability: 'Wisdom', score: 12 },
    benefits: [
      'Sense the presence and direction of any gate or rift within 1 mile',
      'Determine the rank (D through S) of a gate by spending 1 minute within 30 feet',
      'Advantage on saving throws against forced teleportation effects',
      'Detect invisible or ethereal creatures within 15 feet as a shimmer in your System display'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[DIMENSIONAL ANOMALY DETECTED — BEARING: NORTHWEST — RANK: B]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-hardened',
    name: 'Gate-Hardened',
    description: 'Repeated gate exposure has warped your body, granting resistance to dimensional environmental hazards.',
    prerequisites: { level: 6, ability: 'Constitution', score: 14 },
    benefits: [
      'Immune to disorientation, nausea, and psychic static from gate entry',
      'Gain resistance to one damage type of your choice (represents your most common gate type)',
      'Extreme temperatures, toxic atmospheres, and altered gravity in gates impose no disadvantage',
      'Once per long rest, when reduced to 0 HP inside a gate, drop to 1 HP instead'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Other hunters vomit at the threshold. You just check your gear and walk in.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'boss-reader',
    name: 'Boss Reader',
    description: 'After fighting enough gate bosses, you read their attack patterns. The System highlights wind-up animations.',
    prerequisites: { level: 8, ability: 'Intelligence', score: 13 },
    benefits: [
      'When a CR 5+ creature begins a special ability, use reaction to warn allies — all within 30 feet gain +3 to their save against it',
      'After observing a boss for 1 round, identify its remaining legendary actions and resistances',
      'Once per long rest, declare "Pattern Read" when a boss uses a recharge ability — it automatically misses you',
      'The System displays boss HP as a percentage bar visible only to you'
    ],
    mechanics: { type: 'triggered', frequency: 'long-rest', action: 'reaction' },
    flavor: '[BOSS PATTERN DETECTED — WIND-UP: 2.3s — DODGE WINDOW: NOW]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'gate-loot-instinct',
    name: 'Gate Loot Instinct',
    description: 'Your System interface highlights loot drops, hidden caches, and mana crystals others would miss.',
    prerequisites: { level: 4, ability: 'Intelligence', score: 12 },
    benefits: [
      'After defeating a creature, see its loot table as a System popup — DM reveals what it carries before you search',
      'Find 25% more gold and mana crystals from gate encounters',
      'Once per gate raid, discover a hidden cache with one uncommon or rare consumable',
      'Appraise the value and properties of any item by holding it for 6 seconds (System scan)'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[LOOT DETECTED — RARITY: RARE — SCANNING PROPERTIES... COMPLETE]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // MANA CIRCUIT FEATS
  // ═══════════════════════════════════════════
  {
    id: 'mana-overflow',
    name: 'Mana Overflow',
    description: 'Your mana circuits can temporarily hold more energy than designed, supercharging your next spell.',
    prerequisites: { level: 5, ability: 'Intelligence', score: 14 },
    benefits: [
      'Once per short rest, declare Mana Overflow when casting a spell: deal maximum damage instead of rolling',
      'Overflow also increases spell range by 50% and area of effect by 5 feet',
      'After using Overflow, take 1d8 force damage as circuits vent excess energy',
      'If Overflow is available when you roll initiative, your first spell in combat triggers it automatically'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'free' },
    flavor: '[MANA OVERFLOW — OUTPUT EXCEEDS CAPACITY — VENTING IN 3... 2... 1...]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-siphon',
    name: 'Mana Siphon',
    description: 'When you kill a creature, your circuits drain residual energy from the corpse, recovering spent resources.',
    prerequisites: { level: 6, ability: 'Intelligence', score: 13 },
    benefits: [
      'When you reduce a creature to 0 HP with a spell, recover a spell slot 1 level lower than used (min 1st)',
      'When you reduce a creature to 0 HP with a weapon, regain HP equal to 1d6 + your Intelligence modifier',
      'Siphoned energy dissipates after 1 hour if not used',
      'Cannot siphon from constructs or undead (no residual life energy)'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: 'The kill feeds you. Every death refills your reserves.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    description: 'You overload an enemy\'s mana network, disrupting their magical abilities.',
    prerequisites: { level: 7, ability: 'Charisma', score: 14 },
    benefits: [
      'As an action, target one creature within 30 feet — it must make a Constitution save against your spell save DC',
      'On failure, the creature cannot cast spells or use magical abilities until end of your next turn',
      'If the creature was concentrating on a spell, that spell ends immediately',
      'Against creatures with Legendary Resistance, forces them to expend one use'
    ],
    mechanics: { type: 'active', frequency: 'short-rest', action: 'action', save: 'Constitution', dc: 'spell-save' },
    flavor: '[CIRCUIT BREAKER — TARGET MANA NETWORK: DISRUPTED — CASTING: DISABLED]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // HUNTER PROTOCOL FEATS
  // ═══════════════════════════════════════════
  {
    id: 'party-sync',
    name: 'Party Sync',
    description: 'You synchronize your System interface with allies, sharing real-time tactical data.',
    prerequisites: { level: 5, ability: 'Charisma', score: 13 },
    benefits: [
      'During a rest, sync with up to 5 willing creatures. Synced allies see each other\'s HP as a percentage',
      'Synced allies cannot be surprised while within 60 feet of each other',
      'Once per long rest, when a synced ally drops to 0 HP, use your reaction to grant them temp HP equal to your level',
      'Synced allies gain +1 to initiative rolls'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[PARTY SYNC: ESTABLISHED — 5 HUNTERS LINKED — VITALS: SHARING]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'last-stand-protocol',
    name: 'Last Stand Protocol',
    description: 'When pushed to the brink, your System activates emergency combat mode — all defense traded for offense.',
    prerequisites: { level: 8, ability: 'Constitution', score: 14 },
    benefits: [
      'When HP drops below 25%, Last Stand activates: +3 to attack rolls, +1d8 to all damage rolls',
      'While in Last Stand, AC is reduced by 2 and you must move toward or remain adjacent to at least one enemy',
      'If you reduce a creature to 0 HP in Last Stand, regain HP equal to 1d10 + Constitution modifier',
      'Last Stand ends when HP rises above 50% or combat ends'
    ],
    mechanics: { type: 'triggered', frequency: 'at-will', action: 'free' },
    flavor: '[CRITICAL HP — LAST STAND PROTOCOL: ENGAGED — SURVIVAL ODDS: IRRELEVANT — FIGHT.]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'emergency-extraction',
    name: 'Emergency Extraction',
    description: 'Your System calculates escape routes from collapsing gates, giving your party seconds to evacuate.',
    prerequisites: { level: 6, ability: 'Dexterity', score: 13 },
    benefits: [
      'Once per long rest, as an action, open a temporary exit rift for 1 round — you and up to 5 allies within 30 feet can teleport to safety',
      'If used inside a collapsing gate, the exit is guaranteed (no check required)',
      'Allies who evacuate are stabilized at 1 HP if they were at 0 HP',
      'Does not count as a failure for quest progress'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action' },
    flavor: '[EMERGENCY EXTRACTION — CALCULATING EXIT VECTOR — EVACUATE NOW]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // COMBAT FEATS (SA-flavored)
  // ═══════════════════════════════════════════
  {
    id: 'annihilation-style',
    name: 'Annihilation Style',
    description: 'You channel raw mana through heavy weapons, trading accuracy for catastrophic damage output.',
    prerequisites: { ability: 'Strength', score: 13 },
    benefits: [
      'On hit with a heavy weapon, can take -5 penalty to attack to add +10 damage',
      'When you score a critical hit with a heavy weapon, add one additional damage die',
      'After reducing a creature to 0 HP, can make one additional attack as a bonus action',
      'Proficient with all martial weapons'
    ],
    mechanics: { type: 'active', frequency: 'at-will' },
    flavor: 'The System measures your output in tons of force per swing.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'deadeye-protocol',
    name: 'Deadeye Protocol',
    description: 'The System feeds targeting telemetry directly into your combat instincts, eliminating range penalties.',
    prerequisites: { ability: 'Dexterity', score: 13 },
    benefits: [
      'Attacking at long range doesn\'t impose disadvantage',
      'Ranged attacks ignore half and three-quarters cover',
      'Before an attack, can take -5 penalty to gain +10 damage',
      '+2 to damage rolls with ranged weapons'
    ],
    mechanics: { type: 'active', frequency: 'at-will' },
    flavor: '[TARGET LOCKED] — the System draws the line, you pull the trigger.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'iron-vanguard',
    name: 'Iron Vanguard',
    description: 'You anchor your position with mana-reinforced resolve, locking down enemies who try to bypass you.',
    benefits: [
      'When you hit a creature with an opportunity attack, its speed drops to 0 for the rest of the turn',
      'Creatures provoke opportunity attacks from you even when they take the Disengage action',
      'When a creature within 5 feet attacks an ally, you can use your reaction to attack that creature',
      'Opportunity attacks against you have disadvantage'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'The System marks you as an immovable obstacle — nothing passes without paying the toll.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'twin-fang-technique',
    name: 'Twin Fang Technique',
    description: 'You split your mana flow into twin channels, wielding paired weapons with perfect synchronization.',
    prerequisites: { ability: 'Dexterity', score: 15 },
    benefits: [
      'Can draw or stow two one-handed weapons simultaneously',
      'Can use two-weapon fighting even when weapons aren\'t light',
      '+2 to AC while wielding two weapons',
      'Add ability modifier to damage of off-hand weapon'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Left fang, right fang — prey caught between them has nowhere to run.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'battle-channeler',
    name: 'Battle Channeler',
    description: 'Your mana circuits remain stable under combat stress, allowing seamless spellcasting while engaged.',
    benefits: [
      'Advantage on Constitution saves to maintain concentration',
      'Can perform somatic components even with weapons or shields in hands',
      'Can cast a spell as an opportunity attack when a creature provokes one',
      'Spells cast as reactions don\'t consume your reaction for opportunity attacks'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Blades clash around you, but your mana flow never wavers.',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // DEFENSIVE FEATS (SA-flavored)
  // ═══════════════════════════════════════════
  {
    id: 'iron-constitution',
    name: 'Iron Constitution',
    description: 'The System has reinforced your cellular structure, dramatically increasing your capacity to absorb punishment.',
    benefits: [
      'HP maximum increases by 2 per level (retroactive)',
      'Resistance to non-magical bludgeoning damage',
      'Can withstand extreme conditions without penalty',
      'Healing effects restore additional HP equal to your proficiency bonus'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[VITALITY STAT INCREASED] — your body shrugs off blows that fell lesser hunters.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'adaptive-resistance',
    name: 'Adaptive Resistance',
    description: 'Repeated exposure to a threat type has triggered a System adaptation, hardening your defenses.',
    benefits: [
      'Gain proficiency in one saving throw of your choice',
      'Advantage on the chosen saving throw',
      'Can reroll a failed save of the chosen type once per long rest',
      'Immunity to minor effects of the chosen type (DM discretion)'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'What nearly killed you before now barely registers — the System learns from every wound.',
    source: 'System Ascendant Canon'
  },
  {
    id: 'fortress-conditioning',
    name: 'Fortress Conditioning',
    description: 'Your body has adapted to heavy plating through mana-reinforced muscle density.',
    prerequisites: { ability: 'Strength', score: 15 },
    benefits: [
      'Can wear heavy armor without disadvantage on Stealth',
      'Reduce non-magical bludgeoning, piercing, and slashing damage by 3',
      'Heavy armor doesn\'t reduce your speed',
      'Can sleep in heavy armor without penalty'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: 'Other hunters remove their armor to rest. You barely notice yours.',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // AWAKENING FEATS
  // ═══════════════════════════════════════════
  {
    id: 'double-awakening',
    name: 'Double Awakening',
    description: 'Your awakening triggered twice. The second pulse rewrote your mana pathways, granting abilities from a second job.',
    prerequisites: { level: 10 },
    benefits: [
      'Choose a second job. Gain that job\'s level 1 and level 3 features (not proficiencies or hit dice)',
      'Can use abilities from both jobs — standard concentration rules apply if both require it',
      'Your System interface displays both job titles',
      'Gain one cantrip or at-will ability from the second job\'s list'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[ANOMALY: SECOND AWAKENING DETECTED — DUAL JOB: CONFIRMED — YOU ARE AN EXCEPTION]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'latent-potential',
    name: 'Latent Potential',
    description: 'Your stat growth rate exceeds System predictions. Each level-up grants more than expected.',
    prerequisites: { level: 4, ability: 'Constitution', score: 13 },
    benefits: [
      'When gaining a level, roll hit die twice and take the higher result',
      'Every 4 levels, gain +1 to an ability score of your choice (in addition to normal ASI)',
      'Carry capacity doubles — your muscles are denser than they appear',
      'The System classifies you as "high-growth" — NPCs with System access treat your rank as one tier higher'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[GROWTH RATE: ANOMALOUS — PROJECTED CEILING: RECALCULATING — POTENTIAL: UNBOUND]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'reawakening-surge',
    name: 'Reawakening Surge',
    description: 'Near-death experiences trigger micro-reawakenings, temporarily unlocking power beyond your current rank.',
    prerequisites: { level: 7, ability: 'Constitution', score: 14 },
    benefits: [
      'When reduced to 0 HP and stabilized (or healed), enter Surge for 1 minute',
      'During Surge: all ability scores increase by 2, regain one spent spell slot, movement speed doubles',
      'Surge can only trigger once per long rest',
      'After Surge ends, gain 2 levels of exhaustion'
    ],
    mechanics: { type: 'triggered', frequency: 'long-rest', action: 'free' },
    flavor: '[NEAR-DEATH TRIGGER: REAWAKENING SURGE — STAT LIMITERS: OVERRIDDEN — 60 SECONDS]',
    source: 'System Ascendant Canon'
  },

  // ═══════════════════════════════════════════
  // S-RANK / REGENT-TIER FEATS
  // ═══════════════════════════════════════════
  {
    id: 'domain-of-shadows',
    name: 'Domain of Shadows',
    description: 'You project a sphere of absolute shadow that empowers your army and weakens all others.',
    prerequisites: { level: 15, feats: ['shadow-mastery'] },
    benefits: [
      'As an action, create a 60-foot radius shadow sphere for 1 minute',
      'Your shadow soldiers within gain +2 to attacks, +2 AC, and +1d6 necrotic damage',
      'Hostile creatures inside have disadvantage on attacks and halved speed',
      'You can teleport to any point within the domain as a bonus action'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'action' },
    flavor: '[DOMAIN OF SHADOWS: DEPLOYED — ALLIES: EMPOWERED — ENEMIES: SUPPRESSED]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'system-administrator',
    name: 'System Administrator',
    description: 'You have gained partial admin access to the System, allowing you to bend its rules.',
    prerequisites: { level: 18 },
    benefits: [
      'Once per long rest, force a reroll on any die roll within 60 feet — you choose which result to keep',
      'Can read the System status of any creature you see: HP, conditions, active buffs, remaining resources',
      'Once per long rest, issue a System Command: "Heal" (50 HP), "Silence" (no casting 1 round), or "Reveal" (all invisible in 120 ft)',
      'The System addresses you as [ADMINISTRATOR]'
    ],
    mechanics: { type: 'active', frequency: 'long-rest', action: 'free' },
    flavor: '[SYSTEM ACCESS: ADMINISTRATOR — AUTHORITY: ELEVATED — AWAITING COMMAND]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'transcendent-vessel',
    name: 'Transcendent Vessel',
    description: 'Your body has evolved beyond mortal limits. The System no longer classifies you as human.',
    prerequisites: { level: 17 },
    benefits: [
      'Ability scores can exceed 20, to a maximum of 24',
      'No longer need to eat, drink, sleep, or breathe — can still benefit from long rests with 4-hour meditation',
      'Immune to disease, poison, and aging',
      'Once ever: when you would die, return at 1 HP with 4 levels of exhaustion instead'
    ],
    mechanics: { type: 'passive', frequency: 'at-will' },
    flavor: '[BIOLOGICAL CLASSIFICATION: RECLASSIFIED — SPECIES: TRANSCENDENT — MORTALITY: CONDITIONAL]',
    source: 'System Ascendant Canon'
  },
  {
    id: 'rulers-authority',
    name: 'Ruler\'s Authority',
    description: 'Your mana pressure is so overwhelming that weaker creatures cannot raise a hand against you.',
    prerequisites: { level: 15, ability: 'Charisma', score: 18 },
    benefits: [
      'Creatures with CR ≤ half your level must make Wisdom save (DC 8 + prof + Cha mod) or be frightened 1 minute',
      'Frightened creatures cannot attack or target you with harmful abilities',
      'Can suppress this aura as a free action',
      'Creatures that fail by 10+ are paralyzed for 1 round instead'
    ],
    mechanics: { type: 'passive', frequency: 'at-will', save: 'Wisdom', dc: 'ability-modifier' },
    flavor: '[MANA PRESSURE: REGENT-CLASS — WEAKER ENTITIES: SUPPRESSED — KNEEL.]',
    source: 'System Ascendant Canon'
  }
];
