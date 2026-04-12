#!/usr/bin/env node
/**
 * enrich-remaining-tables.mjs
 * Enriches ALL remaining compendium tables that are below 100% metadata completeness.
 * Fills tags, flavor, lore, mechanics, theme_tags where missing.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// PRNG
function cyrb128(str) {
  let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;
  for(let i=0;i<str.length;i++){const k=str.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}
  h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);
  return[(h1^h2^h3^h4)>>>0,(h2^h1)>>>0,(h3^h1)>>>0,(h4^h1)>>>0];
}
function sfc32(a,b,c,d){return()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^(b>>>9);b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(t+c)|0;return(t>>>0)/4294967296;};}
function makeRand(id){const s=cyrb128(`${id}_v5`);return sfc32(s[0],s[1],s[2],s[3]);}
function pick(a,r){return a[Math.floor(r()*a.length)];}
function pickN(a,n,r){const s=[...a];for(let i=s.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[s[i],s[j]]=[s[j],s[i]];}return s.slice(0,Math.min(n,s.length));}

// ═══ POOLS ═══
const FLAVOR_VERBS = ["Shatters","Unravels","Devours","Eclipses","Ignites","Silences","Crushes","Commands","Reclaims","Absorbs","Binds","Fractures","Warps","Corrodes","Sanctifies","Rends","Purges","Dominates","Overwhelms","Transcends"];
const FLAVOR_OBJECTS = ["the fabric of reality","the laws of physics","the boundary between life and death","the architect's design","the dimensional barrier","the concept of distance","the illusion of safety","the chains of mortality","the flow of causality","the threshold of human potential","the silence between heartbeats","the certainty of outcomes","the remnants of a dead world"];
const FLAVOR_CAPS = ["A testament to what Hunters have become.","The final equation in a war without end.","The reason S-Rank Gates are feared.","A reminder that the System has no mercy.","Proof that some things cannot be survived.","A whisper from the edge of oblivion.","Evolution compressed into a single, violent instant.","The breaking point of all resistance.","The death of hesitation, made manifest.","The line between Hunter and monster."];
const ORIGINS = [
  "Extracted from the dimensional residue of a collapsed Gate.",
  "Recovered from the personal vault of a National-Level Hunter.",
  "Decoded from ancient sigil-stones found beneath pre-Awakening ruins.",
  "Manifested spontaneously during a double-dungeon event.",
  "Reverse-engineered from Architect combat data by the Hunter Bureau.",
  "Crystallized from raw mana overflow during a catastrophic Gate Breach.",
  "Born from a System anomaly that briefly merged two Gate instances.",
  "Distilled from the ambient mana of a Gate that refused to close.",
  "Salvaged from the remains of an S-Rank anomaly.",
  "Translated from forbidden shadow-language inscriptions.",
  "Won in a high-stakes Hunter tournament by the top Korean Guilds.",
  "Found in the aftermath of a Gate break, half-buried in shattered concrete.",
];
const HISTORIES = [
  "First documented during the Second Awakening Wave.",
  "Records indicate this was used during the first S-Rank Gate clearing.",
  "The Hunter Bureau classified this as a high-threat vector before repurposing it.",
  "Originally developed as a countermeasure against Monarch-class entities.",
  "Historical analysis suggests this predates the modern Gate system.",
  "Intelligence reports link this to the Shadow Monarch's army.",
  "Combat logs show this held a Gate breach for nearly an hour.",
  "The European Hunter Council maintains a standing bounty for its creator's identity.",
  "Multiple Guilds have attempted replication; all proved inferior to the original.",
  "Guild archives show multiple S-Rank Hunters died attempting to master this.",
];
const THEME_TAGS = ["gate-zone","post-awakening","hunter-bureau","guild-ops","rift-energy","monarch-era","shadow-domain","urban-combat","dungeon-core","mana-overflow","dimensional-bleed","ancient-power","survival","classified","experimental","forbidden","elite-tier"];

function enrichFlavor(r) { return `${pick(FLAVOR_VERBS,r)} ${pick(FLAVOR_OBJECTS,r)}. ${pick(FLAVOR_CAPS,r)}`; }
function enrichLore(r) { return { origin: pick(ORIGINS,r), history: pick(HISTORIES,r) }; }

function generateTags(name, desc, category, r) {
  const pools = {
    job: ["martial","magical","class","archetype","scaling","capstone","offensive","defensive","utility","support","control","mobility","healing","damage","buff"],
    path: ["specialization","archetype","class-path","progression","unique","thematic","combat","utility","support","offensive","defensive"],
    power: ["offensive","defensive","utility","support","control","mobility","healing","damage","buff","debuff","area","single-target","sustained","burst","shadow","fire","ice","lightning","void","radiant","necrotic"],
    relic: ["artifact","magical-item","equipment","enchanted","legendary","rare","cursed","blessed","offensive","defensive","utility"],
    equipment: ["weapon","armor","accessory","consumable","tool","magical","mundane","crafted","looted","enchanted"],
    anomaly: ["monster","boss","minion","elite","swarm","undead","beast","construct","aberration","fiend","dragon","elemental","humanoid"],
    background: ["social","criminal","scholarly","military","religious","artisan","noble","commoner","outlander","explorer"],
    feat: ["combat","utility","social","magic","physical","tactical","defensive","offensive","passive","active"],
    regent: ["regent","shadow","extraction","evolution","command","ultimate","domain","army","companion","transformation"],
    sovereign: ["sovereign","legendary","ultimate","domain","transformation","offensive","defensive","aura","capstone"],
    rune: ["spell-rune","power-rune","technique-rune","enchantment","socket","crafting","combat","utility","elemental","shadow","arcane"],
  };
  const pool = pools[category] || pools.power;
  const base = [category, ...pickN(pool, 2 + Math.floor(r() * 3), r)];
  const text = `${name} ${desc || ""}`.toLowerCase();
  if (text.includes("shadow") || text.includes("dark")) base.push("shadow");
  if (text.includes("fire") || text.includes("flame")) base.push("fire");
  if (text.includes("ice") || text.includes("frost")) base.push("cold");
  if (text.includes("lightning") || text.includes("thunder")) base.push("lightning");
  if (text.includes("heal") || text.includes("restore")) base.push("healing");
  return [...new Set(base)].slice(0, 6);
}

function generateMechanics(name, desc, r) {
  const text = `${name} ${desc || ""}`.toLowerCase();
  const m = {};
  if (text.includes("reaction")) m.action_type = "reaction";
  else if (text.includes("bonus action")) m.action_type = "bonus action";
  else m.action_type = pick(["1 action","1 bonus action","passive","1 reaction"], r);
  m.duration = pick(["Instantaneous","1 round","1 minute","Until next rest","Permanent"], r);
  m.range = pick(["Self","Touch","30 feet","60 feet","120 feet"], r);
  m.frequency = pick(["At will","1/short rest","1/long rest","Proficiency/long rest","2/short rest"], r);
  return m;
}

// ═══ ENRICHMENT ═══
async function enrichTable(tableName, category, opts = {}) {
  const { hasThemeTags = true, hasMechanics = true, hasSourceKind = false } = opts;
  console.log(`\n📋 ${tableName}...`);
  
  const { data: rows, error } = await supabase.from(tableName).select("*").order("name");
  if (error) { console.error(`  ❌ ${error.message}`); return 0; }
  if (!rows?.length) { console.log("  ⚠️ empty"); return 0; }
  
  console.log(`  ${rows.length} rows`);
  let updated = 0, skipped = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const r = makeRand(row.id || row.name || `${i}`);
    const u = {};
    
    if (!row.tags || row.tags.length === 0) u.tags = generateTags(row.name||"", row.description||"", category, r);
    if (hasThemeTags && (!row.theme_tags || row.theme_tags.length === 0)) u.theme_tags = pickN(THEME_TAGS, 2 + Math.floor(r()*2), r);
    if (!row.flavor || row.flavor === "") u.flavor = enrichFlavor(r);
    if (!row.lore || (typeof row.lore === "object" && Object.keys(row.lore).length === 0)) u.lore = enrichLore(r);
    if (hasMechanics && (!row.mechanics || (typeof row.mechanics === "object" && Object.keys(row.mechanics).length === 0))) u.mechanics = generateMechanics(row.name||"", row.description||"", r);
    if (hasSourceKind && !row.source_kind) u.source_kind = "official";
    
    if (!Object.keys(u).length) { skipped++; continue; }
    
    const { error: e } = await supabase.from(tableName).update(u).eq("id", row.id);
    if (e) console.error(`  ❌ ${row.name}: ${e.message}`);
    else updated++;
    
    if ((i+1)%50===0 || i===rows.length-1) process.stdout.write(`\r  ${i+1}/${rows.length} (${updated} upd, ${skipped} skip)`);
  }
  console.log(`\n  ✅ ${updated} updated, ${skipped} skipped`);
  return updated;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  FULL COMPENDIUM ENRICHMENT — ALL REMAINING TABLES");
  console.log("═══════════════════════════════════════════════════════");
  
  let total = 0;
  
  // Tables with theme_tags column
  total += await enrichTable("compendium_jobs", "job");
  total += await enrichTable("compendium_job_paths", "path");
  total += await enrichTable("compendium_powers", "power");
  total += await enrichTable("compendium_relics", "relic");
  total += await enrichTable("compendium_equipment", "equipment");
  total += await enrichTable("compendium_Anomalies", "anomaly");
  total += await enrichTable("compendium_backgrounds", "background");
  total += await enrichTable("compendium_feats", "feat");
  total += await enrichTable("compendium_regents", "regent");
  total += await enrichTable("compendium_sovereigns", "sovereign");
  total += await enrichTable("compendium_runes", "rune");
  
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  ✅ DONE — ${total} total updates across all tables`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
