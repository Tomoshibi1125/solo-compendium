#!/usr/bin/env node
/**
 * enrich-final-pass.mjs
 * Final enrichment pass: fills display_name, fixes shadow soldier lore,
 * and generates themed SVG placeholder images for image_url.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
config();
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

// ═══ PRNG ═══
function cyrb128(s){let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;for(let i=0;i<s.length;i++){const k=s.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);return[(h1^h2^h3^h4)>>>0,(h2^h1)>>>0,(h3^h1)>>>0,(h4^h1)>>>0];}
function sfc32(a,b,c,d){return()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^(b>>>9);b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(t+c)|0;return(t>>>0)/4294967296;};}
function rand(id){const s=cyrb128(id+"_img_v1");return sfc32(s[0],s[1],s[2],s[3]);}
function pick(a,r){return a[Math.floor(r()*a.length)];}

// ═══ DISPLAY NAME ═══
function toDisplayName(name) {
  if (!name) return "";
  return name
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\b(Of|The|And|In|To|For|A|An|Or|By)\b/g, m => m.toLowerCase())
    .replace(/^\w/, c => c.toUpperCase()); // Capitalize first word always
}

// ═══ SVG IMAGE GENERATION ═══
// Category-themed gradient SVG placeholders with Unicode icons
const CATEGORY_THEMES = {
  compendium_jobs:               { icon: "⚔", colors: ["#1a1a2e", "#16213e", "#0f3460"], accent: "#e94560" },
  compendium_job_paths:          { icon: "🛤", colors: ["#1a1a2e", "#0d2137", "#162447"], accent: "#1f4068" },
  compendium_job_features:       { icon: "✨", colors: ["#1b1b2f", "#1a1a3e", "#162447"], accent: "#e43f5a" },
  compendium_powers:             { icon: "🔥", colors: ["#200122", "#2d0037", "#6f0000"], accent: "#ff6b35" },
  compendium_relics:             { icon: "💎", colors: ["#0c0c1d", "#1a0a2e", "#2d1b69"], accent: "#b721ff" },
  compendium_equipment:          { icon: "🛡", colors: ["#1a1a2e", "#16213e", "#1f4068"], accent: "#4ecdc4" },
  compendium_Anomalies:          { icon: "👹", colors: ["#1a0000", "#2d0000", "#4a0000"], accent: "#ff2e63" },
  compendium_backgrounds:        { icon: "📜", colors: ["#1a1510", "#2d2215", "#4a3728"], accent: "#daa520" },
  compendium_conditions:         { icon: "💀", colors: ["#0d0d0d", "#1a0a1a", "#2d0a2d"], accent: "#9b59b6" },
  compendium_feats:              { icon: "🏆", colors: ["#1a1a00", "#2d2d00", "#4a4a00"], accent: "#f1c40f" },
  compendium_skills:             { icon: "📊", colors: ["#001a1a", "#002d2d", "#004a4a"], accent: "#1abc9c" },
  compendium_regents:            { icon: "👑", colors: ["#1a0a2e", "#2d0037", "#4a0060"], accent: "#8e44ad" },
  compendium_regent_features:    { icon: "🌑", colors: ["#0a0a1a", "#0d0d2d", "#10104a"], accent: "#6c5ce7" },
  compendium_sovereigns:         { icon: "⚡", colors: ["#1a0000", "#2d0a00", "#4a1500"], accent: "#e17055" },
  compendium_sovereign_features: { icon: "🌟", colors: ["#1a1000", "#2d1a00", "#4a2d00"], accent: "#fdcb6e" },
  compendium_runes:              { icon: "᛭", colors: ["#0a1a2e", "#0d2d4a", "#104a6e"], accent: "#00cec9" },
  compendium_shadow_soldiers:    { icon: "⚔", colors: ["#050510", "#0a0a20", "#0f0f30"], accent: "#6c5ce7" },
};

function generateSvgDataUri(name, tableName, r) {
  const theme = CATEGORY_THEMES[tableName] || CATEGORY_THEMES.compendium_equipment;
  const hueShift = Math.floor(r() * 30) - 15; // Slight variation per item
  
  // Generate a unique pattern element based on the name hash
  const patternType = Math.floor(r() * 4);
  let patternElements = "";
  
  if (patternType === 0) {
    // Geometric circles
    for (let i = 0; i < 5; i++) {
      const cx = 20 + r() * 60;
      const cy = 20 + r() * 60;
      const radius = 3 + r() * 8;
      patternElements += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${theme.accent}" opacity="${0.05 + r() * 0.1}"/>`;
    }
  } else if (patternType === 1) {
    // Diagonal lines
    for (let i = 0; i < 6; i++) {
      const x1 = r() * 100;
      const y1 = r() * 100;
      patternElements += `<line x1="${x1}" y1="${y1}" x2="${x1+30}" y2="${y1+30}" stroke="${theme.accent}" stroke-width="0.5" opacity="${0.08 + r() * 0.1}"/>`;
    }
  } else if (patternType === 2) {
    // Hexagonal dots
    for (let i = 0; i < 8; i++) {
      const x = 10 + r() * 80;
      const y = 10 + r() * 80;
      patternElements += `<polygon points="${x},${y-3} ${x+2.6},${y-1.5} ${x+2.6},${y+1.5} ${x},${y+3} ${x-2.6},${y+1.5} ${x-2.6},${y-1.5}" fill="${theme.accent}" opacity="${0.06 + r() * 0.08}"/>`;
    }
  } else {
    // Rune-like marks
    for (let i = 0; i < 4; i++) {
      const x = 15 + r() * 70;
      const y = 15 + r() * 70;
      patternElements += `<path d="M${x},${y} l${5+r()*10},${-5-r()*10} l${3},${8+r()*5}" fill="none" stroke="${theme.accent}" stroke-width="0.8" opacity="${0.07 + r() * 0.1}"/>`;
    }
  }

  // Truncate name for display
  const displayName = (name || "Unknown").substring(0, 18);
  const firstLetter = (name || "?")[0].toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.colors[0]}"/>
      <stop offset="50%" style="stop-color:${theme.colors[1]}"/>
      <stop offset="100%" style="stop-color:${theme.colors[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:${theme.accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${theme.accent};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)" rx="8"/>
  <rect width="100" height="100" fill="url(#glow)" rx="8"/>
  ${patternElements}
  <text x="50" y="42" text-anchor="middle" font-size="28" fill="${theme.accent}" opacity="0.9" font-family="serif">${firstLetter}</text>
  <line x1="25" y1="55" x2="75" y2="55" stroke="${theme.accent}" stroke-width="0.5" opacity="0.3"/>
  <text x="50" y="68" text-anchor="middle" font-size="6" fill="#ffffff" opacity="0.7" font-family="sans-serif">${displayName}</text>
  <text x="50" y="78" text-anchor="middle" font-size="4" fill="${theme.accent}" opacity="0.5" font-family="sans-serif">${tableName.replace("compendium_","").replace(/_/g," ").toUpperCase()}</text>
  <rect x="1" y="1" width="98" height="98" fill="none" stroke="${theme.accent}" stroke-width="0.5" opacity="0.2" rx="7"/>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ═══ FETCH ALL WITH PAGINATION ═══
async function fetchAll(table) {
  let all = [], from = 0;
  while (true) {
    const { data } = await sb.from(table).select("*").range(from, from + 999).order("id");
    all = all.concat(data || []);
    if (!data || data.length < 1000) break;
    from += 1000;
  }
  return all;
}

// ═══ MAIN ENRICHMENT ═══
async function enrichTable(tableName) {
  console.log(`\n📋 ${tableName}...`);
  const data = await fetchAll(tableName);
  if (!data.length) { console.log("  ⚠️ empty"); return 0; }
  
  console.log(`  ${data.length} rows`);
  let updated = 0, skipped = 0;
  const hasDisplayName = data[0] && "display_name" in data[0];
  const hasImageUrl = data[0] && "image_url" in data[0];
  const hasLore = data[0] && "lore" in data[0];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const r = rand(row.id || row.name || `${i}`);
    const u = {};
    
    // Fill display_name
    if (hasDisplayName && (!row.display_name || row.display_name === "")) {
      u.display_name = toDisplayName(row.name || row.title || "");
    }
    
    // Fill image_url with themed SVG
    if (hasImageUrl && (!row.image_url || row.image_url === "")) {
      u.image_url = generateSvgDataUri(row.display_name || row.name || row.title || "", tableName, r);
    }
    
    // Fix lore: convert string lore to object lore
    if (hasLore && row.lore && typeof row.lore === "string") {
      u.lore = { origin: row.lore, history: "Its full history remains undocumented." };
    }
    
    if (!Object.keys(u).length) { skipped++; continue; }
    
    const { error } = await sb.from(tableName).update(u).eq("id", row.id);
    if (error) {
      // If image_url is too long for column, skip it
      if (error.message.includes("value too long") || error.message.includes("too large")) {
        delete u.image_url;
        if (Object.keys(u).length > 0) {
          await sb.from(tableName).update(u).eq("id", row.id);
          updated++;
        }
      }
    } else {
      updated++;
    }
    
    if ((i + 1) % 100 === 0 || i === data.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${data.length} (${updated} upd, ${skipped} skip)`);
    }
  }
  
  console.log(`\n  ✅ ${updated} updated, ${skipped} already complete`);
  return updated;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  FINAL ENRICHMENT PASS");
  console.log("  Filling display_name + image_url + lore fixes");
  console.log("═══════════════════════════════════════════════════════");
  
  const tables = [
    "compendium_jobs", "compendium_job_paths", "compendium_job_features",
    "compendium_powers", "compendium_relics", "compendium_equipment",
    "compendium_Anomalies", "compendium_backgrounds", "compendium_conditions",
    "compendium_feats", "compendium_skills", "compendium_regents",
    "compendium_regent_features", "compendium_sovereigns",
    "compendium_sovereign_features", "compendium_runes", "compendium_shadow_soldiers",
  ];
  
  let total = 0;
  for (const t of tables) {
    total += await enrichTable(t);
  }
  
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  ✅ FINAL PASS COMPLETE — ${total} total updates`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
