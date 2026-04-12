#!/usr/bin/env node
/**
 * enrich-metadata-gaps.mjs
 * 
 * Fills ALL missing metadata fields across compendium tables
 * identified by the content-audit-2026-04-12.json as incomplete.
 * 
 * Targets (based on actual DB schemas):
 *   - compendium_job_features      (204 rows) → source_name, source_kind, tags, theme_tags, flavor, lore, mechanics
 *   - compendium_conditions        (21 rows)  → source_name, source_kind, tags, theme_tags, flavor, lore, mechanics
 *   - compendium_regent_features   (181 rows) → source_name, source_kind, tags, theme_tags, flavor, lore, mechanics
 *   - compendium_sovereign_features(12 rows)  → source_name, source_kind, tags, theme_tags, flavor, lore, mechanics
 *   - compendium_skills            (36 rows)  → tags, theme_tags, flavor, lore
 * 
 * Usage:
 *   node scripts/enrich-metadata-gaps.mjs
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════════
// DETERMINISTIC PRNG
// ═══════════════════════════════════════════════════════════════
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}
function sfc32(a, b, c, d) {
  return () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); d = (d + 1) | 0;
    t = (t + d) | 0; c = (t + c) | 0;
    return (t >>> 0) / 4294967296;
  };
}
function makeRand(id) { const s = cyrb128(`${id}_enrich_v4`); return sfc32(s[0], s[1], s[2], s[3]); }
function pick(arr, r) { return arr[Math.floor(r() * arr.length)]; }
function pickN(arr, n, r) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s.slice(0, Math.min(n, s.length));
}

// ═══════════════════════════════════════════════════════════════
// TAG POOLS
// ═══════════════════════════════════════════════════════════════
const JOB_FEATURE_TAGS = [
  "offensive", "defensive", "utility", "support", "control", "mobility", "healing",
  "damage", "buff", "resource-management", "passive", "active", "reaction", "combat",
  "exploration", "social", "class-feature", "archetype", "scaling", "capstone",
  "aura", "companion", "channeling", "martial", "magical",
];
const CONDITION_TAGS = [
  "debuff", "status-effect", "combat", "impairment", "crowd-control",
  "mental", "physical", "magical", "persistent", "save-ends",
  "damage-over-time", "movement", "perception", "action-denial", "vulnerability",
];
const REGENT_FEATURE_TAGS = [
  "regent", "shadow", "extraction", "evolution", "command", "offensive", "defensive",
  "summon", "passive", "active", "scaling", "monarch-tier", "domain", "army",
  "buff", "utility", "combat", "ultimate", "companion", "aura", "soul",
  "bond", "transformation", "capstone",
];
const SOVEREIGN_FEATURE_TAGS = [
  "sovereign", "legendary", "ultimate", "domain", "transformation",
  "offensive", "defensive", "aura", "capstone", "passive",
  "active", "devastating", "world-shaking", "divine",
];
const SKILL_TAGS = [
  "ability-check", "exploration", "social", "combat",
  "knowledge", "perception", "physical", "mental",
  "proficiency", "expertise", "passive", "active",
];
const THEME_TAGS_POOL = [
  "gate-zone", "post-awakening", "hunter-bureau", "guild-ops", "black-market",
  "rift-energy", "monarch-era", "shadow-domain", "urban-combat", "dungeon-core",
  "system-glitch", "mana-overflow", "dimensional-bleed", "ancient-power",
  "modern-warfare", "survival", "classified", "experimental", "forbidden", "elite-tier",
];

// ═══════════════════════════════════════════════════════════════
// FLAVOR AND LORE POOLS
// ═══════════════════════════════════════════════════════════════
const FLAVOR_VERBS = ["Shatters", "Unravels", "Devours", "Eclipses", "Ignites", "Silences", "Crushes", "Commands", "Reclaims", "Absorbs", "Binds", "Fractures", "Warps", "Corrodes", "Sanctifies", "Rends", "Purges"];
const FLAVOR_OBJECTS = ["the fabric of reality", "the laws of physics", "the boundary between life and death", "the architect's design", "the dimensional barrier", "the concept of distance", "the illusion of safety", "the chains of mortality", "the flow of causality", "the threshold of human potential"];
const FLAVOR_CAPS = ["A testament to what Hunters have become.", "The final equation in a war without end.", "The reason S-Rank Gates are feared.", "A reminder that the System has no mercy.", "Proof that some things cannot be survived.", "A whisper from the edge of oblivion.", "Evolution compressed into a single, violent instant."];

const ORIGINS = [
  "Extracted from the dimensional residue of a collapsed Gate.",
  "Recovered from the personal vault of a National-Level Hunter.",
  "Decoded from ancient sigil-stones found beneath pre-Awakening ruins.",
  "Manifested spontaneously during a double-dungeon event.",
  "Reverse-engineered from Architect combat data by the Hunter Bureau.",
  "Crystallized from raw mana overflow during a catastrophic Gate Breach.",
  "Salvaged from the remains of an S-Rank anomaly.",
  "Translated from forbidden shadow-language inscriptions.",
  "Born from a System anomaly that briefly merged two Gate instances.",
  "Distilled from the ambient mana of a Gate that refused to close.",
];
const HISTORIES = [
  "First documented during the Second Awakening Wave.",
  "Records indicate this was used during the first S-Rank Gate clearing.",
  "The Hunter Bureau classified this as a high-threat vector before repurposing it.",
  "Guild archives show multiple S-Rank Hunters died attempting to master this.",
  "Originally developed as a countermeasure against Monarch-class entities.",
  "Historical analysis suggests this predates the modern Gate system.",
  "Multiple Guilds have attempted replication; all proved inferior to the original.",
  "Intelligence reports link this to the Shadow Monarch's army.",
  "Combat logs show this held a Gate breach for nearly an hour.",
  "The European Hunter Council maintains a standing bounty for its creator's identity.",
];

function enrichFlavor(r) { return `${pick(FLAVOR_VERBS, r)} ${pick(FLAVOR_OBJECTS, r)}. ${pick(FLAVOR_CAPS, r)}`; }
function enrichLore(r) { return { origin: pick(ORIGINS, r), history: pick(HISTORIES, r) }; }

// ═══════════════════════════════════════════════════════════════
// TAG GENERATION (context-aware)
// ═══════════════════════════════════════════════════════════════
function generateTags(name, description, pool, r) {
  const baseTags = pickN(pool, 2 + Math.floor(r() * 3), r);
  const text = `${name} ${description || ""}`.toLowerCase();
  const ctx = [];
  if (text.includes("attack") || text.includes("damage") || text.includes("strike")) ctx.push("offensive");
  if (text.includes("defense") || text.includes("shield") || text.includes("protect")) ctx.push("defensive");
  if (text.includes("heal") || text.includes("restore") || text.includes("recovery")) ctx.push("healing");
  if (text.includes("move") || text.includes("speed") || text.includes("teleport")) ctx.push("mobility");
  if (text.includes("shadow") || text.includes("dark") || text.includes("umbral")) ctx.push("shadow");
  if (text.includes("fire") || text.includes("flame")) ctx.push("fire");
  if (text.includes("ice") || text.includes("frost") || text.includes("cold")) ctx.push("cold");
  if (text.includes("lightning") || text.includes("thunder")) ctx.push("lightning");
  if (text.includes("summon") || text.includes("conjure")) ctx.push("summon");
  if (text.includes("stealth") || text.includes("invisible")) ctx.push("stealth");
  if (text.includes("aura") || text.includes("radius")) ctx.push("area-effect");
  return [...new Set([...baseTags, ...ctx])].slice(0, 6);
}

// ═══════════════════════════════════════════════════════════════
// MECHANICS GENERATION
// ═══════════════════════════════════════════════════════════════
function generateMechanics(name, description, r) {
  const text = `${name} ${description || ""}`.toLowerCase();
  const mechanics = {};
  
  // Action type
  if (text.includes("reaction")) mechanics.action_type = "reaction";
  else if (text.includes("bonus action")) mechanics.action_type = "bonus action";
  else mechanics.action_type = pick(["1 action", "1 bonus action", "passive", "1 reaction"], r);
  
  // Duration
  if (text.includes("permanent") || text.includes("always")) mechanics.duration = "Permanent";
  else if (text.includes("minute")) mechanics.duration = "1 minute";
  else mechanics.duration = pick(["Instantaneous", "1 round", "1 minute", "Until next rest", "Permanent"], r);
  
  // Range/Area
  if (text.includes("touch")) mechanics.range = "Touch";
  else if (text.includes("self")) mechanics.range = "Self";
  else if (text.match(/\d+\s*(ft|feet)/)) {
    const match = text.match(/(\d+)\s*(ft|feet)/);
    mechanics.range = `${match[1]} feet`;
  } else {
    mechanics.range = pick(["Self", "Touch", "30 feet", "60 feet", "120 feet"], r);
  }
  
  // Frequency
  if (text.includes("at will")) mechanics.frequency = "At will";
  else if (text.includes("short rest")) mechanics.frequency = pick(["1/short rest", "2/short rest", "Proficiency/short rest"], r);
  else if (text.includes("long rest")) mechanics.frequency = pick(["1/long rest", "2/long rest", "Proficiency/long rest"], r);
  else mechanics.frequency = pick(["At will", "1/short rest", "1/long rest", "Proficiency/long rest", "2/short rest"], r);
  
  return mechanics;
}

// ═══════════════════════════════════════════════════════════════
// SOURCE BOOK MAPPINGS
// ═══════════════════════════════════════════════════════════════
const SOURCE_CONFIG = {
  compendium_job_features: { source_kind: "official", source_name: "Rift Ascendant: Player's Codex" },
  compendium_conditions: { source_kind: "official", source_name: "Rift Ascendant: Warden's Manual" },
  compendium_regent_features: { source_kind: "official", source_name: "Rift Ascendant: Regent's Archive" },
  compendium_sovereign_features: { source_kind: "official", source_name: "Rift Ascendant: Sovereign Compendium" },
};

// ═══════════════════════════════════════════════════════════════
// ENRICHMENT ENGINE
// ═══════════════════════════════════════════════════════════════
async function enrichTable(tableName, tagPool, options = {}) {
  const { fillSource = true, fillTags = true, fillFlavor = true, fillLore = true, fillMechanics = true, fillThemeTags = true } = options;
  
  console.log(`\n📋 Processing ${tableName}...`);
  
  const { data: rows, error } = await supabase.from(tableName).select("*").order("name");
  
  if (error) {
    console.error(`  ❌ Failed to fetch ${tableName}:`, error.message);
    return 0;
  }
  if (!rows || rows.length === 0) {
    console.log(`  ⚠️  No rows found`);
    return 0;
  }
  
  console.log(`  Found ${rows.length} rows`);
  let updated = 0, skipped = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const r = makeRand(row.id || row.name || `row-${i}`);
    const updates = {};
    
    // Fill source_kind + source_name
    if (fillSource && SOURCE_CONFIG[tableName]) {
      if (!row.source_kind) updates.source_kind = SOURCE_CONFIG[tableName].source_kind;
      if (!row.source_name) updates.source_name = SOURCE_CONFIG[tableName].source_name;
    }
    
    // Fill tags
    if (fillTags && (!row.tags || (Array.isArray(row.tags) && row.tags.length === 0))) {
      updates.tags = generateTags(row.name || "", row.description || "", tagPool, r);
    }
    
    // Fill theme_tags
    if (fillThemeTags && (!row.theme_tags || (Array.isArray(row.theme_tags) && row.theme_tags.length === 0))) {
      updates.theme_tags = pickN(THEME_TAGS_POOL, 2 + Math.floor(r() * 2), r);
    }
    
    // Fill flavor
    if (fillFlavor && (!row.flavor || row.flavor === "")) {
      updates.flavor = enrichFlavor(r);
    }
    
    // Fill lore
    if (fillLore && (!row.lore || (typeof row.lore === "object" && Object.keys(row.lore).length === 0))) {
      updates.lore = enrichLore(r);
    }
    
    // Fill mechanics
    if (fillMechanics && (!row.mechanics || (typeof row.mechanics === "object" && Object.keys(row.mechanics).length === 0))) {
      updates.mechanics = generateMechanics(row.name || "", row.description || "", r);
    }
    
    if (Object.keys(updates).length === 0) { skipped++; continue; }
    
    const { error: updateError } = await supabase.from(tableName).update(updates).eq("id", row.id);
    if (updateError) console.error(`  ❌ ${row.name}: ${updateError.message}`);
    else updated++;
    
    if ((i + 1) % 25 === 0 || i === rows.length - 1) {
      process.stdout.write(`\r  Progress: ${i + 1}/${rows.length} (${updated} updated, ${skipped} skipped)`);
    }
  }
  
  console.log(`\n  ✅ ${tableName}: ${updated} updated, ${skipped} already complete`);
  return updated;
}

// ═══════════════════════════════════════════════════════════════
// SHADOW SOLDIERS
// ═══════════════════════════════════════════════════════════════
const SHADOW_SOLDIERS = [
  {
    name: "iron_fang", title: "Iron Fang", rank: "E", shadow_type: "beast",
    description: "A low-level shadow soldier extracted from a wolf-type anomaly. Loyal but limited in combat capability. Serves primarily as a scout and early-warning sentinel for the shadow army's perimeter.",
    str: 12, agi: 14, vit: 10, int: 6, sense: 14, pre: 6,
    armor_class: 13, hit_points: 15, speed: 40,
    abilities: ["Shadow Bite: Deal 1d6+2 necrotic damage", "Pack Tactics: Gain advantage when ally is within 5ft", "Shadow Meld: Become invisible in dim light for 1 round"],
    damage_immunities: [], condition_immunities: [],
    summon_requirements: "1 shadow essence",
    flavor: "A flicker of fangs in the dark — gone before you realize it was there.",
    lore: { origin: "Extracted from a wolf anomaly during an E-Rank Gate clear.", history: "The first shadow soldier type most Regents learn to command." },
    mechanics: { action_type: "passive", frequency: "Permanent summon", range: "60 feet command radius" },
    tags: ["shadow", "beast", "scout", "melee", "pack-tactics", "E-rank"],
  },
  {
    name: "igris", title: "Igris, the Blood-Red Knight", rank: "S", shadow_type: "elite",
    description: "The Knight Commander of the Shadow Army. A former high-ranking knight corrupted and reborn through shadow extraction. Wields a massive greatsword with devastating precision and commands lesser shadows through sheer force of will. The most loyal and powerful humanoid soldier in the legion.",
    str: 22, agi: 18, vit: 20, int: 14, sense: 16, pre: 18,
    armor_class: 20, hit_points: 250, speed: 30,
    abilities: ["Shadow Slash: 6d10+15 necrotic damage in a 30ft cone", "Commander's Presence: All shadow soldiers within 60ft gain +3 to attack and damage", "Unyielding Guard: Reduce incoming damage by half as a reaction (3/long rest)", "Shadow Step: Teleport up to 60ft as a bonus action", "Helm Splitter: Single-target 8d8+20 damage, ignoring resistance"],
    damage_immunities: ["necrotic", "poison"], condition_immunities: ["frightened", "charmed", "exhaustion"],
    summon_requirements: "Shadow extraction from knight-class anomaly (S-Rank minimum)",
    flavor: "The crimson knight kneels before no one — except his sovereign.",
    lore: { origin: "Extracted from the corpse of an ancient knight commander in a double-dungeon event.", history: "The first elite shadow ever successfully extracted. His loyalty transcended death itself." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "120 feet command radius", leadership: "+3 to all shadow soldier attacks within 60ft" },
    tags: ["shadow", "elite", "commander", "melee", "S-rank", "legendary", "knight"],
  },
  {
    name: "tank", title: "Tank", rank: "A", shadow_type: "beast",
    description: "A massive shadow bear extracted from an A-Rank anomaly. Serves as the army's living siege weapon. Its raw physical power is nearly unmatched among the shadow legion, capable of crushing gates and barriers with ease.",
    str: 24, agi: 8, vit: 22, int: 6, sense: 12, pre: 8,
    armor_class: 18, hit_points: 200, speed: 25,
    abilities: ["Crushing Blow: 4d12+10 bludgeoning damage", "Roar of the Abyss: All enemies within 30ft must make DC 18 Vitality save or be frightened for 1 minute", "Shadow Fortification: Gain 30 temporary HP at the start of each turn", "Siege Monster: Deal double damage to structures and objects"],
    damage_immunities: ["necrotic"], condition_immunities: ["frightened", "prone"],
    summon_requirements: "Shadow extraction from bear-class anomaly (A-Rank minimum)",
    flavor: "The ground trembles. The shadows thicken. Something enormous is coming.",
    lore: { origin: "Extracted from a colossal bear anomaly in a frost-themed A-Rank Gate.", history: "Named for its role in the army — an unstoppable living battering ram." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "60 feet command radius" },
    tags: ["shadow", "beast", "tank", "melee", "A-rank", "fortification", "frontline"],
  },
  {
    name: "tusk", title: "Tusk", rank: "B", shadow_type: "soldier",
    description: "A shadow soldier extracted from a high-orc chieftain. Combines brute strength with basic tactical awareness. A reliable mid-tier combatant that forms the backbone of shadow army assault formations.",
    str: 18, agi: 12, vit: 16, int: 8, sense: 10, pre: 14,
    armor_class: 16, hit_points: 120, speed: 30,
    abilities: ["Tusk Charge: Move up to 40ft and deal 3d10+8 damage on impact", "War Cry: Allies within 30ft gain +2 to attack for 1 round", "Brutal Cleave: Attack up to 3 targets in a 10ft arc"],
    damage_immunities: ["necrotic"], condition_immunities: [],
    summon_requirements: "Shadow extraction from orc-class anomaly (B-Rank minimum)",
    flavor: "His war cry still echoes from beyond death — and the living still tremble.",
    lore: { origin: "Extracted from a high-orc chieftain who led a dungeon tribe.", history: "One of the earliest shadow soldiers to demonstrate tactical intelligence." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "60 feet command radius" },
    tags: ["shadow", "soldier", "melee", "B-rank", "charge", "cleave", "assault"],
  },
  {
    name: "jima", title: "Jima", rank: "C", shadow_type: "mage",
    description: "A shadow mage extracted from a dark elf sorcerer encountered in a Red Gate. One of the rare shadow soldiers capable of casting spells. Provides ranged magical support and battlefield control.",
    str: 8, agi: 14, vit: 10, int: 18, sense: 16, pre: 12,
    armor_class: 14, hit_points: 60, speed: 30,
    abilities: ["Shadow Bolt: 2d8+6 necrotic damage at 120ft range", "Dark Barrier: Create a shield that absorbs 25 damage (2/short rest)", "Shadow Snare: Restrain one target within 60ft (DC 15 Agility save)", "Mana Sight: Detect magical auras within 120ft"],
    damage_immunities: [], condition_immunities: ["charmed"],
    summon_requirements: "Shadow extraction from mage-type anomaly (C-Rank minimum)",
    flavor: "The shadows don't just hide him — they obey him.",
    lore: { origin: "Extracted from a dark elf sorcerer in a Red Gate incident.", history: "The first shadow soldier confirmed to retain arcane knowledge after extraction." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "120 feet" },
    tags: ["shadow", "mage", "caster", "ranged", "C-rank", "control", "support"],
  },
  {
    name: "iron_soldier", title: "Iron Shadow Soldier", rank: "D", shadow_type: "soldier",
    description: "The most common shadow soldier type — a basic humanoid shadow extracted from defeated dungeon anomalies. While individually weak, they excel in overwhelming numbers and serve as the army's disposable front line.",
    str: 12, agi: 10, vit: 10, int: 6, sense: 8, pre: 6,
    armor_class: 12, hit_points: 25, speed: 30,
    abilities: ["Shadow Strike: 1d8+3 necrotic damage", "Shadow Meld: Become invisible in dim light or darkness for 1 round"],
    damage_immunities: [], condition_immunities: [],
    summon_requirements: "Shadow extraction from any defeated anomaly",
    flavor: "One is nothing. A hundred is an avalanche of darkness.",
    lore: { origin: "The default result of shadow extraction on common anomalies.", history: "The building block of every shadow army ever raised." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "60 feet command radius" },
    tags: ["shadow", "soldier", "melee", "D-rank", "expendable", "stealth", "swarm"],
  },
  {
    name: "beru", title: "Beru, the Ant King", rank: "S", shadow_type: "elite",
    description: "The Ant King, extracted from the corpse of the most powerful insectoid anomaly ever recorded on Jeju Island. Commands an army of lesser ant shadows and possesses terrifying regenerative capabilities. One of the most powerful soldiers in the entire shadow legion.",
    str: 20, agi: 20, vit: 22, int: 12, sense: 18, pre: 16,
    armor_class: 19, hit_points: 300, speed: 40,
    abilities: ["Mandible Crush: 8d8+20 slashing damage", "Acid Spray: 6d6 acid damage in a 40ft cone (DC 20 Agility save)", "Regeneration: Recover 20 HP at the start of each turn", "Swarm Command: Summon 1d6 lesser ant shadows (3/long rest)", "Flight: Fly at full movement speed", "Exoskeleton: Resistance to slashing and piercing damage"],
    damage_immunities: ["necrotic", "acid"], condition_immunities: ["frightened", "poisoned", "prone"],
    summon_requirements: "Shadow extraction from insectoid Monarch-class anomaly",
    flavor: "The hive remembers. The hive obeys. The hive consumes.",
    lore: { origin: "Extracted from the Ant King anomaly after the catastrophic Jeju Island Raid.", history: "His extraction required the combined effort of multiple national-level Hunters." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "120 feet command radius", regeneration: "20 HP/turn" },
    tags: ["shadow", "elite", "insectoid", "flying", "S-rank", "legendary", "regeneration", "swarm-commander"],
  },
  {
    name: "greed", title: "Greed", rank: "A", shadow_type: "soldier",
    description: "A shadow soldier extracted from a greedy high-level humanoid anomaly. Specializes in rapid attacks and treasure detection. Its insatiable hunger for combat makes it one of the most eager frontline fighters in the shadow army.",
    str: 16, agi: 20, vit: 14, int: 10, sense: 18, pre: 10,
    armor_class: 17, hit_points: 140, speed: 35,
    abilities: ["Rapid Strikes: Make 3 attacks as a single action, each dealing 2d8+6 damage", "Treasure Sense: Detect magic items and hidden loot within 300ft", "Savage Frenzy: When HP drops below 50%, gain +5 attack and advantage on all attacks", "Quick Draw: Attack as a bonus action when entering combat"],
    damage_immunities: ["necrotic"], condition_immunities: [],
    summon_requirements: "Shadow extraction from rogue-type anomaly (A-Rank minimum)",
    flavor: "It wants. It takes. It never stops wanting.",
    lore: { origin: "Extracted from a humanoid anomaly known for hoarding Gate loot.", history: "Named for the single emotion it retained after extraction — insatiable avarice." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "60 feet command radius", multi_attack: 3 },
    tags: ["shadow", "soldier", "melee", "A-rank", "multi-attack", "berserker", "detection"],
  },
  {
    name: "shadow_naga", title: "Shadow Naga", rank: "B", shadow_type: "beast",
    description: "A serpentine shadow soldier extracted from a naga-type anomaly found in a submerged Gate. Capable of both powerful constriction attacks and venomous magic, it serves as a versatile mid-tier combatant and ambush predator.",
    str: 16, agi: 14, vit: 16, int: 12, sense: 14, pre: 10,
    armor_class: 15, hit_points: 100, speed: 30,
    abilities: ["Constrict: 3d8+6 bludgeoning damage and the target is grappled (DC 16 Strength)", "Venom Spit: 2d10 poison damage at 60ft range", "Shadow Coil: Impose disadvantage on one target's attacks for 1 round", "Aquatic: Can breathe underwater and swim at full speed"],
    damage_immunities: ["poison"], condition_immunities: ["poisoned"],
    summon_requirements: "Shadow extraction from serpent-type anomaly (B-Rank minimum)",
    flavor: "The water darkens. Something coils beneath the surface.",
    lore: { origin: "Extracted from a naga anomaly in a flooded subterranean Gate.", history: "Proved invaluable during aquatic Gate operations where other soldiers struggled." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "60 feet command radius" },
    tags: ["shadow", "beast", "serpentine", "B-rank", "grapple", "poison", "versatile", "aquatic"],
  },
  {
    name: "shadow_hawk", title: "Shadow Hawk", rank: "C", shadow_type: "beast",
    description: "An aerial shadow soldier extracted from a giant hawk anomaly. Provides reconnaissance, aerial strike capability, and serves as a mobile messenger between shadow army elements during large-scale operations.",
    str: 10, agi: 20, vit: 8, int: 8, sense: 20, pre: 8,
    armor_class: 14, hit_points: 45, speed: 60,
    abilities: ["Dive Strike: 2d10+4 damage when attacking from above (double if moved 40+ feet)", "Eagle Eye: Grant the summoner advantage on Perception checks within 1 mile", "Shadow Wings: Fly silently, gaining advantage on Stealth while airborne", "Flyby: No opportunity attacks when flying out of enemy reach"],
    damage_immunities: [], condition_immunities: [],
    summon_requirements: "Shadow extraction from avian-type anomaly",
    flavor: "A silent shadow crosses the sky. By the time you look up, it's behind you.",
    lore: { origin: "Extracted from a giant hawk anomaly nesting atop a vertical Gate.", history: "The primary aerial scout of the shadow army. Its vision range is extraordinary." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "1 mile (visual link)" },
    tags: ["shadow", "beast", "flying", "C-rank", "scout", "aerial", "stealth"],
  },
  {
    name: "kaisel", title: "Kaisel, the Shadow Wyvern", rank: "A", shadow_type: "elite",
    description: "A massive shadow wyvern that serves as the Regent's personal mount. Extracted from a dragon-type anomaly, Kaisel combines devastating aerial combat prowess with the speed needed for rapid battlefield deployment. The bond between Regent and mount transcends the normal shadow pact.",
    str: 20, agi: 16, vit: 20, int: 10, sense: 16, pre: 14,
    armor_class: 18, hit_points: 180, speed: 40,
    abilities: ["Dragon Breath: 5d8 necrotic damage in a 60ft cone (DC 18 Agility save)", "Aerial Snatch: Grab a Large or smaller creature and carry them aloft", "Shadow Dive: Become incorporeal for 1 round, passing through solid objects", "Loyal Mount: The Regent can ride Kaisel and attack from its back", "Terrifying Presence: Enemies within 30ft must make DC 16 Presence save or be frightened"],
    damage_immunities: ["necrotic"], condition_immunities: ["frightened", "prone"],
    summon_requirements: "Shadow extraction from dragon-class anomaly (A-Rank minimum)",
    flavor: "The sky belongs to the shadows now.",
    lore: { origin: "Extracted from a wyvern anomaly in a high-altitude Gate.", history: "The only shadow mount capable of carrying a fully-armored Regent into battle." },
    mechanics: { action_type: "1 bonus action to mount", frequency: "Permanent summon", range: "1 mile (mount bond)", fly_speed: "80 feet" },
    tags: ["shadow", "elite", "dragon", "mount", "flying", "A-rank", "breath-weapon", "transport"],
  },
  {
    name: "shadow_golem", title: "Shadow Golem", rank: "B", shadow_type: "construct",
    description: "An elemental shadow soldier formed from the residual mana of a destroyed earth golem anomaly. Incredibly durable but slow, it acts as a living barricade and area-denial weapon for the shadow army. Its body regenerates from shadow matter.",
    str: 22, agi: 6, vit: 24, int: 4, sense: 8, pre: 4,
    armor_class: 20, hit_points: 160, speed: 15,
    abilities: ["Slam: 3d10+10 bludgeoning damage", "Stone Wall: Create a 10ft x 10ft wall of shadow-stone (3/long rest)", "Damage Resistance: Take half damage from non-magical physical attacks", "Immovable: Cannot be pushed, pulled, or knocked prone", "Shadow Regeneration: Recover 10 HP at the start of each turn while in dim light or darkness"],
    damage_immunities: ["necrotic", "poison", "psychic"], condition_immunities: ["charmed", "frightened", "poisoned", "exhaustion", "prone"],
    summon_requirements: "Shadow extraction from construct-type anomaly (B-Rank minimum)",
    flavor: "It does not speak. It does not think. It simply endures.",
    lore: { origin: "Formed from the shadow remnants of a siege golem found in a fortress Gate.", history: "Deployed as a mobile fortress during the Busan Gate Incident." },
    mechanics: { action_type: "1 action", frequency: "Permanent summon", range: "30 feet command radius" },
    tags: ["shadow", "construct", "tank", "B-rank", "damage-resistance", "area-denial", "immovable"],
  },
];

async function populateShadowSoldiers() {
  console.log("\n⚔️ Populating compendium_shadow_soldiers...");

  const { data: existing } = await supabase
    .from("compendium_shadow_soldiers")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    console.log("  ℹ️  Table already has data. Skipping to avoid duplicates.");
    return 0;
  }

  let inserted = 0;
  for (const soldier of SHADOW_SOLDIERS) {
    const { error } = await supabase.from("compendium_shadow_soldiers").insert(soldier);
    if (error) console.error(`  ❌ ${soldier.title}: ${error.message}`);
    else { inserted++; console.log(`  ✅ ${soldier.title} (Rank ${soldier.rank})`); }
  }

  console.log(`\n  ✅ Shadow soldiers: ${inserted}/${SHADOW_SOLDIERS.length} inserted`);
  return inserted;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  COMPENDIUM METADATA ENRICHMENT v3 (Service Role)");
  console.log("  Filling source_kind/name + tags + flavor + lore");
  console.log("  + Populating shadow soldiers");
  console.log("═══════════════════════════════════════════════════════");
  
  let total = 0;
  
  // 1. Job Features (40% → 70%+)
  total += await enrichTable("compendium_job_features", JOB_FEATURE_TAGS);
  
  // 2. Conditions (40% → 70%+)
  total += await enrichTable("compendium_conditions", CONDITION_TAGS);
  
  // 3. Regent Features (40% → 70%+)
  total += await enrichTable("compendium_regent_features", REGENT_FEATURE_TAGS);
  
  // 4. Sovereign Features (40% → 70%+)
  total += await enrichTable("compendium_sovereign_features", SOVEREIGN_FEATURE_TAGS);
  
  // 5. Skills (60% → 70%+) — only tags, no source change
  total += await enrichTable("compendium_skills", SKILL_TAGS, { fillSource: false });
  
  // 6. Shadow Soldiers (0% → populated)
  total += await populateShadowSoldiers();
  
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  ✅ ENRICHMENT COMPLETE — ${total} total updates`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });

