import { allItems as items } from '../src/data/compendium/items-index';
import { powers } from '../src/data/compendium/powers';
import { techniques } from '../src/data/compendium/techniques';
import { spells } from '../src/data/compendium/spells';
import * as fs from 'fs';

const output: string[] = [];

// ── ITEMS ──────────────────────────────────────────────────────────
output.push('════════════════════════════════════════════════════');
output.push('  ITEMS ANALYSIS');
output.push('════════════════════════════════════════════════════');
output.push(`Total items: ${items.length}`);

const itemDist = new Map<string, number>();
items.forEach((item: any) => {
  const key = `${item.type}|${item.rarity}`;
  itemDist.set(key, (itemDist.get(key) || 0) + 1);
});
output.push('\nItems by type|rarity:');
for (const [key, count] of [...itemDist.entries()].sort()) {
  output.push(`  ${key}: ${count}`);
}

// Count by tier suffix
let kaelCount = 0, umbralCount = 0, supremeCount = 0, baseCount = 0, otherCount = 0;
items.forEach((item: any) => {
  if (item.name.includes('of Kael')) kaelCount++;
  else if (item.name.includes('of the Umbral Regent')) umbralCount++;
  else if (item.name.includes('of Supreme Power')) supremeCount++;
  else if (item.id.startsWith('base-')) baseCount++;
  else otherCount++;
});
output.push(`\nItem tiers: Kael=${kaelCount}, Umbral Regent=${umbralCount}, Supreme Power=${supremeCount}, Base Equipment=${baseCount}, Other=${otherCount}`);

// ── SPELLS ─────────────────────────────────────────────────────────
output.push('\n════════════════════════════════════════════════════');
output.push('  SPELLS ANALYSIS');
output.push('════════════════════════════════════════════════════');
output.push(`Total spells: ${spells.length}`);

const spellDist = new Map<string, number>();
spells.forEach((spell: any) => {
  const key = `level-${spell.level}`;
  spellDist.set(key, (spellDist.get(key) || 0) + 1);
});
output.push('\nSpells by level:');
for (const [key, count] of [...spellDist.entries()].sort()) {
  output.push(`  ${key}: ${count}`);
}

// Check for duplicate spell names
const spellNames = new Map<string, number>();
spells.forEach((spell: any) => {
  const name = spell.name.toLowerCase();
  spellNames.set(name, (spellNames.get(name) || 0) + 1);
});
const dupSpells = [...spellNames.entries()].filter(([_,c]) => c > 1);
output.push(`\nDuplicate spell names: ${dupSpells.length}`);
dupSpells.forEach(([name, count]) => output.push(`  "${name}" x${count}`));

// ── POWERS ─────────────────────────────────────────────────────────
output.push('\n════════════════════════════════════════════════════');
output.push('  POWERS ANALYSIS');
output.push('════════════════════════════════════════════════════');
output.push(`Total powers: ${powers.length}`);

const powerDist = new Map<string, number>();
powers.forEach((power: any) => {
  const key = `${power.type}|${power.rarity}`;
  powerDist.set(key, (powerDist.get(key) || 0) + 1);
});
output.push('\nPowers by type|rarity:');
for (const [key, count] of [...powerDist.entries()].sort()) {
  output.push(`  ${key}: ${count}`);
}

// Check for duplicate power names
const powerNames = new Map<string, number>();
powers.forEach((power: any) => {
  const name = power.name.toLowerCase();
  powerNames.set(name, (powerNames.get(name) || 0) + 1);
});
const dupPowers = [...powerNames.entries()].filter(([_,c]) => c > 1);
output.push(`\nDuplicate power names: ${dupPowers.length}`);
dupPowers.forEach(([name, count]) => output.push(`  "${name}" x${count}`));

// ── TECHNIQUES ─────────────────────────────────────────────────────
output.push('\n════════════════════════════════════════════════════');
output.push('  TECHNIQUES ANALYSIS');
output.push('════════════════════════════════════════════════════');
output.push(`Total techniques: ${techniques.length}`);

const techDist = new Map<string, number>();
techniques.forEach((tech: any) => {
  const key = `${tech.type}|${tech.style || 'any'}`;
  techDist.set(key, (techDist.get(key) || 0) + 1);
});
output.push('\nTechniques by type|style:');
for (const [key, count] of [...techDist.entries()].sort()) {
  output.push(`  ${key}: ${count}`);
}

// Check for duplicate technique names
const techNames = new Map<string, number>();
techniques.forEach((tech: any) => {
  const name = tech.name.toLowerCase();
  techNames.set(name, (techNames.get(name) || 0) + 1);
});
const dupTechs = [...techNames.entries()].filter(([_,c]) => c > 1);
output.push(`\nDuplicate technique names: ${dupTechs.length}`);
dupTechs.forEach(([name, count]) => output.push(`  "${name}" x${count}`));

// ── SUMMARY ────────────────────────────────────────────────────────
output.push('\n════════════════════════════════════════════════════');
output.push('  SUMMARY');
output.push('════════════════════════════════════════════════════');
output.push(`Spells:     ${spells.length}`);
output.push(`Powers:     ${powers.length}`);
output.push(`Techniques: ${techniques.length}`);
output.push(`Items:      ${items.length} (${baseCount} base equip + ${kaelCount + umbralCount + supremeCount + otherCount} System items)`);

fs.writeFileSync('scripts/compendium-audit.txt', output.join('\n'));
console.log('Report written to scripts/compendium-audit.txt');
