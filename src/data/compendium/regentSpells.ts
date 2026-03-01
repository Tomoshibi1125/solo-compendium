/**
 * Regent-Specific Spells & Techniques
 * Custom SA spells not found in SRD5e — one set per regent.
 * These are linked to regent compendium entries in monarchs.ts.
 */

export interface RegentSpell {
    id: string;
    name: string;
    regentId: string;
    level: number;         // Spell level 0-9 (0 = cantrip)
    school: string;
    castingTime: string;
    range: string;
    duration: string;
    description: string;
    damage?: string;
    savingThrow?: string;
    components?: string;
}

export const REGENT_SPELLS: RegentSpell[] = [
    // ─── Shadow/Umbral Regent ────────────────────────
    { id: 'shadow-extraction', name: 'Shadow Extraction', regentId: 'shadow_regent', level: 3, school: 'Necromancy', castingTime: '1 action', range: '60 feet', duration: 'Permanent', description: 'Extract the shadow of a creature that died within the last minute. The shadow becomes a permanent Shadow Soldier under your command. System message: [ARISE]. Shadow soldiers retain combat abilities of the original at half stats.', damage: 'N/A', savingThrow: 'None (target must be dead)' },
    { id: 'shadow-domain', name: 'Shadow Domain', regentId: 'shadow_regent', level: 5, school: 'Conjuration', castingTime: '1 action', range: 'Self (300-ft radius)', duration: '1 hour', description: 'Create a dome of absolute darkness. Only you and shadow soldiers can see. All shadow soldiers within gain +2 AC and advantage on attacks. Non-shadow creatures are blinded.', savingThrow: 'SENSE save negates blindness' },
    { id: 'arise', name: 'Arise', regentId: 'shadow_regent', level: 7, school: 'Necromancy', castingTime: '1 action', range: '120 feet', duration: 'Permanent', description: 'The signature spell of the Shadow Regent. Point at up to 10 corpses — each rises as a Shadow Soldier permanently. No material component needed. System displays: [SHADOW ARMY +10].', damage: 'N/A' },
    { id: 'shadow-exchange', name: 'Shadow Exchange', regentId: 'shadow_regent', level: 2, school: 'Conjuration', castingTime: '1 bonus action', range: 'Unlimited (same plane)', duration: 'Instantaneous', description: 'Swap position with any shadow soldier you command. No save. No opportunity attacks.' },

    // ─── Dragon Regent ───────────────────────────────
    { id: 'breath-of-annihilation', name: 'Breath of Annihilation', regentId: 'dragon_regent', level: 6, school: 'Evocation', castingTime: '1 action', range: 'Self (120-ft cone)', duration: 'Instantaneous', description: 'Release draconic fire that erases matter. 12d10 fire damage (AGI save half). On kill, target is erased from reality — no resurrection possible. Terrain becomes magma.', damage: '12d10 fire', savingThrow: 'AGI save DC 8+prof+STR' },
    { id: 'draconic-pressure', name: 'Draconic Pressure', regentId: 'dragon_regent', level: 3, school: 'Enchantment', castingTime: '1 action', range: 'Self (30-ft radius)', duration: 'Concentration, 1 minute', description: 'Crushing gravitational force from draconic presence. Creatures: STR save or speed halved and disadvantage on attacks.', savingThrow: 'STR save' },
    { id: 'world-burn', name: 'World Burn', regentId: 'dragon_regent', level: 9, school: 'Evocation', castingTime: '1 action', range: '1 mile radius', duration: '10 minutes', description: 'Apocalyptic fire. All flammable objects ignite. Temperature rises 100°C. Fire creatures gain advantage. 6d10 fire/round to all creatures.' },

    // ─── Frost Regent ────────────────────────────────
    { id: 'absolute-zero-touch', name: 'Absolute Zero Touch', regentId: 'frost_regent', level: 5, school: 'Evocation', castingTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Touch a creature. 10d10 cold damage + paralyzed (VIT save). On kill: target becomes diamond-hard ice statue at -273.15°C. Shatters if touched.', damage: '10d10 cold', savingThrow: 'VIT save (paralysis)' },
    { id: 'glacial-eternity', name: 'Glacial Eternity', regentId: 'frost_regent', level: 7, school: 'Transmutation', castingTime: '1 action', range: '120 feet', duration: 'Until dispelled', description: 'Encase target in absolute-zero ice. VIT save DC 20 or imprisoned. Only Wish can free. Target is conscious but unable to act. Ice is indestructible.', savingThrow: 'VIT save DC 20' },
    { id: 'winters-requiem', name: "Winter's Requiem", regentId: 'frost_regent', level: 9, school: 'Evocation', castingTime: '1 minute', range: '5 miles', duration: '8 hours', description: 'Create a 5-mile radius ice storm. Temperature drops to -100°C. Fire is impossible. Water freezes instantly. Creatures: 4d10 cold/hour.' },

    // ─── Beast Regent ────────────────────────────────
    { id: 'primal-roar', name: 'Primal Roar', regentId: 'beast_regent', level: 4, school: 'Enchantment', castingTime: '1 action', range: 'Self (300-ft radius)', duration: 'Instantaneous', description: 'Unleash the roar of the primordial alpha. All enemies: SENSE save or frightened 1 minute. Beasts within range: permanently friendly to you. Car alarms trigger. Windows shatter.', savingThrow: 'SENSE save' },
    { id: 'apex-shift', name: 'Apex Shift', regentId: 'beast_regent', level: 6, school: 'Transmutation', castingTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Transform into primordial apex predator. Huge size, +6 STR/AGI/VIT (max 26), 3d10+STR natural weapons, regenerate 15 HP/turn, tremorsense 120 ft.' },
    { id: 'beast-kings-call', name: "Beast King's Call", regentId: 'beast_regent', level: 8, school: 'Enchantment', castingTime: '1 action', range: '10 miles', duration: '1 hour', description: 'Command ALL beasts within 10 miles (CR ≤ your level). They obey your mental commands. Zoos empty. Wildlife converges.' },

    // ─── Titan Regent ────────────────────────────────
    { id: 'immovable-stance', name: 'Immovable Stance', regentId: 'titan_regent', level: 3, school: 'Abjuration', castingTime: '1 bonus action', range: 'Self', duration: 'Concentration, 1 minute', description: 'Plant yourself. Cannot be moved by any force. Immunity to prone, grapple, forced movement. Teleportation targeting you fails. Ground cracks from your mass.' },
    { id: 'titans-wrath', name: "Titan's Wrath", regentId: 'titan_regent', level: 5, school: 'Evocation', castingTime: '1 action', range: 'Self (60-ft radius)', duration: 'Instantaneous', description: 'Slam the ground. All creatures: STR save or 8d10 force + prone. Structures within range take double damage. Seismographs detect your strike.', damage: '8d10 force', savingThrow: 'STR save' },
    { id: 'infinite-endurance', name: 'Infinite Endurance', regentId: 'titan_regent', level: 7, school: 'Abjuration', castingTime: '1 action', range: 'Self', duration: '24 hours', description: 'Remove all exhaustion. Immune to exhaustion, sleep, hunger, thirst, suffocation for duration. Death saves auto-succeed.' },

    // ─── Plague Regent ───────────────────────────────
    { id: 'pandemic-protocol', name: 'Pandemic Protocol', regentId: 'plague_regent', level: 8, school: 'Necromancy', castingTime: '1 hour', range: 'Touch (spreads)', duration: 'Permanent', description: 'Create supernatural pandemic. Choose: airborne/touch/water transmission, symptoms, incubation period, lethality. R0=10. Cannot be cured except by you or Wish. CDC declares emergency.' },
    { id: 'billion-swarm', name: 'Billion Swarm', regentId: 'plague_regent', level: 5, school: 'Transmutation', castingTime: '1 action', range: 'Self', duration: '1 hour', description: 'Dissolve into insect swarm. Fly 60 ft, squeeze 1-inch gaps, immune to non-AoE damage. Split into up to 10 sub-swarms.' },
    { id: 'typhoid-touch', name: 'Typhoid Touch', regentId: 'plague_regent', level: 3, school: 'Necromancy', castingTime: '1 action', range: 'Touch', duration: 'Permanent', description: 'Touch a creature. VIT save or contract supernatural disease: 4d12 necrotic/day, spreads to creatures within 10 ft. Only you or Wish can cure.', damage: '4d12 necrotic/day', savingThrow: 'VIT save' },

    // ─── Architect Regent ────────────────────────────
    { id: 'world-forge', name: 'World Forge', regentId: 'architect_regent', level: 9, school: 'Conjuration', castingTime: '1 hour', range: 'Self', duration: 'Permanent', description: 'Create permanent demiplane (1 mile cube). Full control over gravity, time flow (1:1 to 1000:1), atmosphere, geography, structures. Only you can open portals to it.' },
    { id: 'instant-architecture', name: 'Instant Architecture', regentId: 'architect_regent', level: 4, school: 'Conjuration', castingTime: '1 action', range: '120 feet', duration: 'Permanent', description: 'Create any structure up to 300 ft cube. AC 25, 500 HP, permanent. Includes rooms, doors, stairs, traps. Material: unknown alloy.' },
    { id: 'spatial-lock', name: 'Spatial Lock', regentId: 'architect_regent', level: 6, school: 'Abjuration', castingTime: '1 action', range: 'Self (1-mile radius)', duration: '1 hour', description: 'Prevent all teleportation, plane shifting, and dimensional transport in 1-mile radius. Gate and Wish for transport fail. Portals close.' },

    // ─── Radiant Regent ──────────────────────────────
    { id: 'white-fire-judgment', name: 'White Fire Judgment', regentId: 'radiant_regent', level: 7, school: 'Evocation', castingTime: '1 action', range: '300 feet', duration: 'Instantaneous', description: 'Point at creature. 12d12 radiant damage. Undead/fiends/evil: triple damage + disintegrate (no save, no resurrection). Impact crater glows for 1 year.', damage: '12d12 radiant', savingThrow: 'None (evil targets)' },
    { id: 'seraphim-ascension', name: 'Seraphim Ascension', regentId: 'radiant_regent', level: 8, school: 'Transmutation', castingTime: '1 action', range: 'Self', duration: '1 hour', description: '6 wings of white flame. Fly 120 ft. Emit bright light 300 ft. Immune to all damage. Creatures within 60 ft: SENSE save or blinded + 6d8 radiant/round.' },
    { id: 'divine-purge', name: 'Divine Purge', regentId: 'radiant_regent', level: 9, school: 'Evocation', castingTime: '1 minute', range: 'Self (1-mile radius)', duration: 'Instantaneous', description: 'Purge all evil. Undead disintegrate. Fiends banished. Curses broken. Diseases cured. Plants regrow. Visible from space.' },

    // ─── Mimic Regent ────────────────────────────────
    { id: 'perfect-copy', name: 'Perfect Copy', regentId: 'mimic_regent', level: 4, school: 'Transmutation', castingTime: '1 action', range: 'Self', duration: 'Unlimited', description: 'Transform into ANYTHING observed (Tiny to Gargantuan, CR ≤ level). Undetectable — True Seeing, Divine Sense all fail. DNA matches target. Duration: unlimited.' },
    { id: 'power-archive', name: 'Power Archive', regentId: 'mimic_regent', level: 6, school: 'Divination', castingTime: '1 reaction', range: '60 feet', duration: 'Permanent', description: 'Observe any ability/spell/feature being used. Copy it permanently (no save). Store up to level/2 stolen powers. System: [ABILITY ARCHIVED].', savingThrow: 'None' },
    { id: 'quantum-shift', name: 'Quantum Shift', regentId: 'mimic_regent', level: 7, school: 'Illusion', castingTime: '1 action', range: 'Self', duration: '1 hour', description: 'Exist in superposition: each observer sees a different form. Appear as most trusted person, most feared enemy, or irrelevant stranger. Security footage shows different entity each frame.' },
];

/** Get all regent spells for a given regent ID */
export function getRegentSpells(regentId: string): RegentSpell[] {
    return REGENT_SPELLS.filter(s => s.regentId === regentId);
}

/** Get a regent spell by its ID */
export function getRegentSpellById(spellId: string): RegentSpell | undefined {
    return REGENT_SPELLS.find(s => s.id === spellId);
}
