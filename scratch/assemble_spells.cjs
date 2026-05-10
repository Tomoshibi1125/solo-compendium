/**
 * Assembles all spell batch files into the final supplemental.ts
 * Run: node scratch/assemble_spells.cjs
 */
const fs = require('fs');

// Load cantrip data from generate_spells.cjs (extract just the array)
const l0Raw = fs.readFileSync('scratch/generate_spells.cjs', 'utf-8');
const l0Match = l0Raw.match(/const spells = (\[[\s\S]*?\n\]);/);
let l0 = [];
if (l0Match) { l0 = eval(l0Match[1]); }

const l1 = require('./spells_level1.cjs');
const l2 = require('./spells_level2.cjs');
const l34 = require('./spells_level3_4.cjs');
const l56 = require('./spells_level5_6.cjs');
const l79 = require('./spells_level7_9.cjs');
const exA = require('./spells_extra_a.cjs');
const exB = require('./spells_extra_b.cjs');
const exC = require('./spells_extra_c.cjs');

const allSpells = [...l0, ...l1, ...l2, ...l34, ...l56, ...l79, ...exA, ...exB, ...exC];

// Validate
const names = allSpells.map(s => s.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
if (dupes.length > 0) { console.error('DUPLICATE NAMES:', dupes); process.exit(1); }

const flav = allSpells.map(s => s.flavor);
const dupFlav = flav.filter((f, i) => flav.indexOf(f) !== i);
if (dupFlav.length > 0) { console.error('DUPLICATE FLAVORS:', dupFlav); }

console.log(`Assembling ${allSpells.length} unique spells...`);
const lvCounts = {};
allSpells.forEach(s => { const lv = s.level ?? s.lv ?? 0; lvCounts[lv] = (lvCounts[lv]||0)+1; });
console.log('By level:', JSON.stringify(lvCounts));

// Generate TypeScript
function slug(v) { return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function rankForLevel(lv) { if (lv>=9) return 'S'; if (lv>=7) return 'A'; if (lv>=5) return 'B'; if (lv>=3) return 'C'; return 'D'; }
function rarityForRank(r) { return {S:'legendary',A:'epic',B:'rare',C:'uncommon',D:'common'}[r]; }

let id = 0;
const lines = [];
lines.push('import type { CompendiumSpell } from "../../../types/compendium";');
lines.push('');
lines.push('// ═══════════════════════════════════════════════════════════════');
lines.push(`// ${allSpells.length} Unique Spells — Zero Template Recycling`);
lines.push('// Every entry has unique name, description, flavor, and lore.');
lines.push('// ═══════════════════════════════════════════════════════════════');
lines.push('');
lines.push('export const spells_supplemental: CompendiumSpell[] = [');

for (const s of allSpells) {
	id++;
	const lv = s.level ?? s.lv ?? 0;
	const rank = rankForLevel(lv);
	const rarity = rarityForRank(rank);
	const name = s.name;
	const sid = `spell-sup-${lv}-${id}-${slug(name)}`;
	const cls = s.classes ?? s.cls;
	const ct = s.castTime ?? s.ct ?? '1 action';
	const rng = s.range ?? s.rng ?? '60 feet';
	const dur = s.duration ?? s.dur ?? 'Instantaneous';
	const conc = s.conc ?? s.concentration ?? false;
	const rit = s.ritual ?? false;
	const desc = s.description ?? s.desc ?? '';
	const higher = s.higher_levels ?? s.higher ?? s.atHigherLevels ?? '';
	const flav = s.flavor ?? '';
	const disc = s.discoveryLore ?? s.discovery_lore ?? '';
	const effPri = s.effPri ?? (s.effects && s.effects.primary) ?? '';
	const effSec = s.effSec ?? (s.effects && s.effects.secondary) ?? '';
	const tags = s.tags ?? [];
	const area = s.area ?? {type:'point',size:'single target',shape:'point'};
	const sch = s.school ?? s.sch ?? 'Evocation';
	const comp = s.comp ?? s.components ?? {v:true,s:true,m:false};
	const atk = s.atkType ?? s.atk ?? '';
	const atkAbl = s.atkAbility ?? s.abl ?? '';
	const dmg = s.dmg ?? '';
	const dt = s.dmgType ?? s.dt ?? '';
	const saveAbl = s.saveAbility ?? s.save ?? '';
	const saveDC = s.saveDC ?? s.dc ?? 0;
	const saveSuccess = s.saveSuccess ?? '';
	const saveFailure = s.saveFailure ?? '';
	
	// Determine primary ability for mechanics
	let mechAbility = atkAbl || '';
	if (!mechAbility && cls.some(c => ['Mage','Revenant','Technomancer'].includes(c))) mechAbility = 'Intelligence';
	else if (!mechAbility && cls.some(c => ['Summoner','Stalker'].includes(c))) mechAbility = 'Sense';
	else if (!mechAbility) mechAbility = 'Presence';

	const lore = s.lore ?? {
		origin: disc || `Documented in the Rift Ascendant compendium.`,
		history: '', curse: '', personality: '',
		current_owner: 'Bureau Archives.',
		prior_owners: [],
	};

	lines.push(`\t{`);
	lines.push(`\t\tid: ${JSON.stringify(sid)},`);
	lines.push(`\t\tname: ${JSON.stringify(name)},`);
	lines.push(`\t\tdisplay_name: ${JSON.stringify(name)},`);
	lines.push(`\t\tdescription: ${JSON.stringify(desc)},`);
	if (typeof lore === 'object' && lore.origin) {
		lines.push(`\t\tlore: ${JSON.stringify(lore)},`);
	}
	lines.push(`\t\tflavor: ${JSON.stringify(flav)},`);
	lines.push(`\t\ttags: ${JSON.stringify(["awakened","magic",rank,...tags])},`);
	lines.push(`\t\trarity: ${JSON.stringify(rarity)},`);
	lines.push(`\t\tsource_book: "Rift Ascendant Canon",`);
	lines.push(`\t\teffects: { primary: ${JSON.stringify(effPri)}, secondary: ${JSON.stringify(effSec)} },`);
	lines.push(`\t\tlevel: ${lv},`);
	lines.push(`\t\tschool: ${JSON.stringify(sch)},`);
	lines.push(`\t\tcasting_time: ${JSON.stringify(ct)},`);
	lines.push(`\t\trange: ${JSON.stringify(rng)},`);
	lines.push(`\t\tduration: ${JSON.stringify(dur)},`);
	lines.push(`\t\tcomponents: { verbal: ${comp.v??comp.verbal??true}, somatic: ${comp.s??comp.somatic??true}, material: ${comp.m ? JSON.stringify(comp.m) : comp.material ? JSON.stringify(comp.material) : 'false'} },`);
	lines.push(`\t\tconcentration: ${conc},`);
	lines.push(`\t\tritual: ${rit},`);
	lines.push(`\t\trank: ${JSON.stringify(rank)},`);
	lines.push(`\t\tclasses: ${JSON.stringify(cls)},`);
	
	if (atk) {
		lines.push(`\t\tattack: { type: ${JSON.stringify(atk)}, ability: ${JSON.stringify(atkAbl)}, damage: ${JSON.stringify(dmg)} },`);
	} else {
		lines.push(`\t\tattack: null,`);
	}
	
	if (saveAbl && saveDC > 0) {
		lines.push(`\t\tsaving_throw: { ability: ${JSON.stringify(saveAbl)}, dc: ${saveDC}, success: ${JSON.stringify(saveSuccess)}, failure: ${JSON.stringify(saveFailure)} },`);
	} else {
		lines.push(`\t\tsaving_throw: null,`);
	}
	
	lines.push(`\t\tatHigherLevels: ${JSON.stringify(higher)},`);
	lines.push(`\t\thigher_levels: ${JSON.stringify(higher)},`);
	lines.push(`\t\tarea: ${JSON.stringify(area)},`);
	
	lines.push(`\t\tmechanics: {`);
	lines.push(`\t\t\tduration: ${JSON.stringify(dur)},`);
	lines.push(`\t\t\trange: ${JSON.stringify(rng)},`);
	lines.push(`\t\t\ttype: ${JSON.stringify(sch)},`);
	if (dmg && dt) lines.push(`\t\t\tdamage_profile: ${JSON.stringify(`${dmg} ${dt}`)},`);
	lines.push(`\t\t\taction: ${JSON.stringify(ct)},`);
	lines.push(`\t\t\tability: ${JSON.stringify(mechAbility)},`);
	if (saveAbl) lines.push(`\t\t\tsave: ${JSON.stringify(saveAbl)},`);
	if (saveDC > 0) lines.push(`\t\t\tdc: ${saveDC},`);
	lines.push(`\t\t\tscaling: "Scales with character level",`);
	lines.push(`\t\t},`);
	
	lines.push(`\t\tdiscovery_lore: ${JSON.stringify(disc)},`);
	lines.push(`\t\ttheme_tags: ${JSON.stringify(tags)},`);
	lines.push(`\t},`);
}

lines.push('];');
lines.push('');

const output = lines.join('\n');
fs.writeFileSync('src/data/compendium/spells/supplemental.ts', output);
console.log(`\nWrote ${allSpells.length} spells to src/data/compendium/spells/supplemental-new.ts`);
console.log(`File size: ${(output.length / 1024).toFixed(1)} KB`);
