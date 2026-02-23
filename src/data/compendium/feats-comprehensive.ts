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
