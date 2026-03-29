/**
 * sync-static-to-db.ts — Seed Supabase compendium tables from static TS data.
 *
 * Run:  npx tsx scripts/sync-static-to-db.ts
 *
 * Uses service-role key to bypass RLS. Upserts on `name` (deletes + re-inserts
 * when UUIDs don't match static string IDs).
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
	console.error("Missing env vars. Ensure .env has VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY.");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toJson(v: unknown): unknown {
	if (v === undefined || v === null) return null;
	if (typeof v === "object") return v; // Supabase client handles serialization
	return v;
}

async function upsertBatch(
	table: string,
	rows: Record<string, unknown>[],
	conflictColumn = "name",
) {
	if (rows.length === 0) {
		console.log(`  [${table}] No rows to insert.`);
		return;
	}

	// Delete existing rows first, then insert fresh — safest for schema changes
	const names = rows.map((r) => r[conflictColumn] as string);

	// Batch delete in chunks of 100
	for (let i = 0; i < names.length; i += 100) {
		const chunk = names.slice(i, i + 100);
		await supabase.from(table).delete().in(conflictColumn, chunk);
	}

	// Insert in chunks of 50
	let inserted = 0;
	for (let i = 0; i < rows.length; i += 50) {
		const chunk = rows.slice(i, i + 50);
		const { error } = await supabase.from(table).insert(chunk);
		if (error) {
			console.error(`  [${table}] Insert error at chunk ${i}: ${error.message}`);
			console.error(`    Details: ${JSON.stringify(error)}`);
			// Log first failing row for debugging
			if (chunk[0]) console.error(`    First row keys: ${Object.keys(chunk[0]).join(", ")}`);
		} else {
			inserted += chunk.length;
		}
	}
	console.log(`  [${table}] Inserted ${inserted}/${rows.length} rows.`);
}

// ---------------------------------------------------------------------------
// Spells
// ---------------------------------------------------------------------------
async function syncSpells() {
	const { spells } = await import("../src/data/compendium/spells/index.js");
	console.log(`Syncing ${spells.length} spells...`);

	const rows = spells.map((s: any) => ({
		name: s.name,
		description: s.description,
		spell_level: s.level ?? null,
		school: s.school ?? null,
		casting_time: s.castingTime ?? null,
		range: toJson(s.range),
		components: toJson(s.components),
		duration: toJson(s.duration),
		concentration: s.concentration ?? false,
		ritual: s.ritual ?? false,
		spell_type: s.type ?? null,
		rank: s.rank ?? null,
		image: s.image ?? null,
		effect: s.effect ?? null,
		at_higher_levels: s.atHigherLevels ?? null,
		higher_levels: s.higher_levels ?? null,
		classes: s.classes ?? null,
		spell_attack: toJson(s.spellAttack),
		activation: toJson(s.activation),
		effects: toJson(s.effects),
		mechanics: toJson(s.mechanics),
		limitations: toJson(s.limitations),
		flavor: s.flavor ?? null,
		lore: s.lore ?? null,
		saving_throw: toJson(s.savingThrow),
		area: toJson(s.area),
		source_book: "System Ascendant Canon",
		tags: [],
		theme_tags: [],
	}));

	await upsertBatch("compendium_spells", rows);
}

// ---------------------------------------------------------------------------
// Powers
// ---------------------------------------------------------------------------
async function syncPowers() {
	const { powers } = await import("../src/data/compendium/powers.js");
	console.log(`Syncing ${powers.length} powers...`);

	const rows = powers.map((p: any) => ({
		name: p.name,
		description: p.description,
		power_level: p.spell_level_equivalent ?? 0,
		power_type: p.type ?? null,
		school: null,
		casting_time: p.activation?.type === "passive" ? "passive" : (p.activation?.time ?? "1 action"),
		range: p.range?.distance ? `${p.range.distance} ${p.range.type ?? "feet"}` : (p.range?.type ?? "self"),
		duration: p.duration?.time ?? p.duration?.type ?? "instantaneous",
		concentration: p.concentration_required ?? (p.duration?.type === "concentration"),
		ritual: p.ritual ?? false,
		components: p.components
			? [
					p.components.verbal ? "V" : "",
					p.components.somatic ? "S" : "",
					p.components.material ? "M" : "",
				]
					.filter(Boolean)
					.join(", ") || null
			: null,
		higher_levels: null,
		image: p.image ?? null,
		mechanics: toJson(p.saving_throw ? { saving_throw: p.saving_throw, attack_roll: p.attack_roll, ...p.mechanics } : (p.mechanics ?? null)),
		effects: toJson(p.effects),
		limitations: toJson(p.limitations),
		flavor: p.flavor ?? null,
		lore: p.lore ?? null,
		source_book: p.source ?? "System Ascendant Canon",
		tags: [p.type, p.rarity].filter(Boolean),
		theme_tags: [],
	}));

	await upsertBatch("compendium_powers", rows);
}

// ---------------------------------------------------------------------------
// Techniques
// ---------------------------------------------------------------------------
async function syncTechniques() {
	const { techniques } = await import("../src/data/compendium/techniques.js");
	console.log(`Syncing ${techniques.length} techniques...`);

	const rows = techniques.map((t: any) => ({
		name: t.name,
		description: t.description,
		technique_type: t.type ?? "offensive",
		style: t.style ?? "any",
		activation_type: t.activation?.type ?? "action",
		activation_cost: t.activation?.cost ?? null,
		primary_effect: t.effects?.primary ?? t.description,
		secondary_effect: t.effects?.secondary ?? null,
		duration: t.duration?.time ?? t.duration?.type ?? null,
		range_desc: t.range?.distance ? `${t.range.distance} ${t.range.type ?? "feet"}` : (t.range?.type ?? null),
		mechanics: toJson(t.mechanics),
		effects: toJson(t.effects),
		limitations: toJson(t.limitations),
		level_requirement: t.prerequisites?.level ?? null,
		class_requirement: t.prerequisites?.class ?? null,
		flavor: t.flavor ?? null,
		lore: t.lore ?? null,
		source: t.source ?? "System Ascendant Canon",
		image: t.image ?? null,
	}));

	await upsertBatch("compendium_techniques", rows);
}

// ---------------------------------------------------------------------------
// Feats
// ---------------------------------------------------------------------------
async function syncFeats() {
	const { comprehensiveFeats } = await import("../src/data/compendium/feats-comprehensive.js");
	console.log(`Syncing ${comprehensiveFeats.length} feats...`);

	const rows = comprehensiveFeats.map((f: any) => ({
		name: f.name,
		description: f.description,
		prerequisites: f.prerequisites ? JSON.stringify(f.prerequisites) : null,
		benefits: f.benefits ?? null,
		mechanics: toJson(f.mechanics),
		effects: toJson(f.effects),
		limitations: toJson(f.limitations),
		flavor: f.flavor ?? null,
		lore: f.lore ?? null,
		image: f.image ?? null,
		source_book: f.source ?? "System Ascendant Canon",
		tags: [],
		theme_tags: [],
	}));

	await upsertBatch("compendium_feats", rows);
}

// ---------------------------------------------------------------------------
// Relics
// ---------------------------------------------------------------------------
async function syncRelics() {
	const { comprehensiveRelics } = await import("../src/data/compendium/relics-comprehensive.js");
	console.log(`Syncing ${comprehensiveRelics.length} relics...`);

	const RARITY_MAP: Record<string, string> = {
		uncommon: "uncommon",
		rare: "rare",
		very_rare: "very_rare",
		epic: "very_rare", // DB enum may not have "epic"
		legendary: "legendary",
		mythic: "legendary", // DB enum may not have "mythic"
	};

	const rows = comprehensiveRelics.map((r: any) => ({
		name: r.name,
		description: r.description,
		item_type: r.type ?? "accessory",
		rarity: RARITY_MAP[r.rarity] ?? "uncommon",
		requires_attunement: r.attunement ?? false,
		attunement_requirements: r.requirements ? JSON.stringify(r.requirements) : null,
		properties: r.properties
			? Object.entries(r.properties)
					.filter(([, v]) => v === true)
					.map(([k]) => k)
			: null,
		stats: toJson(r.stats || r.mechanics),
		effects: toJson(r.effects),
		mechanics: toJson(r.mechanics),
		limitations: toJson(r.limitations),
		image: r.image ?? null,
		source_book: r.source ?? "System Ascendant Canon",
		flavor: r.flavor ?? null,
		lore: r.lore ?? null,
		tags: [r.type, r.rarity].filter(Boolean),
		theme_tags: [],
	}));

	await upsertBatch("compendium_relics", rows);
}

// ---------------------------------------------------------------------------
// Monsters  (uses staticDataProvider which already normalizes the data)
// ---------------------------------------------------------------------------
async function syncMonsters() {
	const { staticDataProvider } = await import("../src/data/compendium/staticDataProvider.js");
	const allMonsters = await staticDataProvider.getMonsters("");
	// Deduplicate by name (keep first occurrence)
	const seen = new Set<string>();
	const monsters = allMonsters.filter((m: any) => {
		if (seen.has(m.name)) return false;
		seen.add(m.name);
		return true;
	});
	console.log(`Syncing ${monsters.length} monsters (deduped from ${allMonsters.length})...`);

	const rows = monsters.map((m: any) => ({
		name: m.name,
		description: m.description ?? "",
		cr: m.cr ?? "0",
		creature_type: m.creature_type ?? "monstrosity",
		size: m.size ?? "Medium",
		alignment: m.alignment ?? null,
		armor_class: m.armor_class ?? 10,
		armor_type: m.armor_type ?? null,
		hit_points_average: m.hit_points_average ?? 10,
		hit_points_formula: m.hit_points_formula ?? "1d8",
		speed_walk: m.speed_walk ?? 30,
		speed_fly: m.speed_fly ?? null,
		speed_swim: m.speed_swim ?? null,
		speed_climb: m.speed_climb ?? null,
		speed_burrow: m.speed_burrow ?? null,
		str: m.str ?? 10,
		agi: m.agi ?? 10,
		vit: m.vit ?? 10,
		int: m.int ?? 10,
		sense: m.sense ?? 10,
		pre: m.pre ?? 10,
		saving_throws: toJson(m.saving_throws),
		skills: toJson(m.skills),
		damage_resistances: m.damage_resistances ?? null,
		damage_immunities: m.damage_immunities ?? null,
		damage_vulnerabilities: m.damage_vulnerabilities ?? null,
		condition_immunities: m.condition_immunities ?? null,
		senses: toJson(m.senses),
		languages: m.languages ?? null,
		xp: m.xp ?? null,
		gate_rank: m.gate_rank ?? null,
		is_boss: m.is_boss ?? false,
		source_book: m.source_book ?? "System Ascendant Canon",
		lore: m.lore ?? null,
		mechanics: toJson(m.mechanics),
		flavor: m.flavor ?? null,
		tags: m.tags ?? [],
		theme_tags: [],
	}));

	await upsertBatch("compendium_monsters", rows);
}

// ---------------------------------------------------------------------------
// Runes
// ---------------------------------------------------------------------------
async function syncRunes() {
	const { allRunes } = await import("../src/data/compendium/runes/index.js");
	const rawRunes = allRunes ?? [];
	if (!rawRunes || rawRunes.length === 0) {
		console.log("  [compendium_runes] No runes found — skipping.");
		return;
	}
	// Deduplicate by name (keep first occurrence)
	const seen = new Set<string>();
	const runes = rawRunes.filter((r: any) => {
		if (seen.has(r.name)) return false;
		seen.add(r.name);
		return true;
	});
	console.log(`Syncing ${runes.length} runes (deduped from ${rawRunes.length})...`);

	const RARITY_MAP: Record<string, string> = {
		common: "common",
		uncommon: "uncommon",
		rare: "rare",
		very_rare: "very_rare",
		legendary: "legendary",
	};

	const rows = runes.map((r: any) => ({
		name: r.name,
		description: r.description ?? "",
		effect_description: r.effect_description ?? r.description ?? "",
		rune_type: r.rune_type ?? "enhancement",
		rune_category: r.rune_category ?? "general",
		rune_level: Math.max(1, Math.min(10, r.rune_level ?? 1)),
		effect_type: r.effect_type ?? "passive",
		rarity: RARITY_MAP[r.rarity ?? "common"] ?? "common",
		activation_action: r.activation_action ?? null,
		uses_per_rest: r.uses_per_rest ?? null,
		recharge: r.recharge ?? null,
		range: r.range ?? null,
		duration: r.duration ?? null,
		higher_levels: r.higher_levels ?? null,
		lore: r.lore ?? null,
		discovery_lore: r.discovery_lore ?? null,
		requires_level: r.requires_level ?? null,
		image: r.image ?? null,
		source_book: "System Ascendant Canon",
		tags: r.tags ?? [],
	}));

	await upsertBatch("compendium_runes", rows);
}

// ---------------------------------------------------------------------------
// Sigils
// ---------------------------------------------------------------------------
async function syncSigils() {
	const { sigils } = await import("../src/data/compendium/sigils.js");

	console.log(`Syncing ${sigils.length} sigils...`);

	const rows = sigils.map((s: any) => ({
		name: s.name,
		description: s.description ?? "",
		effect_description: s.effect_description ?? s.description ?? "",
		rune_type: s.rune_type ?? "utility",
		rune_category: s.rune_category ?? "general",
		rune_level: s.rune_level ?? 1,
		rarity: s.rarity ?? "common",
		effect_type: s.effect_type ?? "passive",
		requires_level: s.requires_level ?? null,
		passive_bonuses: toJson(s.passive_bonuses),
		active_feature: toJson(s.active_feature),
		can_inscribe_on: s.can_inscribe_on ?? null,
		inscription_difficulty: s.inscription_difficulty ?? null,
		effects: toJson(s.effects),
		mechanics: toJson(s.mechanics),
		limitations: toJson(s.limitations),
		flavor: s.flavor ?? null,
		lore: s.lore ?? null,
		image: s.image ?? null,
		source_book: s.source_book ?? "System Ascendant Canon",
		tags: s.tags ?? [],
	}));

	await upsertBatch("compendium_sigils", rows);
}

// ---------------------------------------------------------------------------
// Tattoos
// ---------------------------------------------------------------------------
async function syncTattoos() {
	const { tattoos } = await import("../src/data/compendium/tattoos.js");

	console.log(`Syncing ${tattoos.length} tattoos...`);

	const rows = tattoos.map((t: any) => ({
		name: t.name,
		description: t.description ?? "",
		rarity: t.rarity ?? "common",
		attunement: t.attunement ?? false,
		body_part: t.body_part ?? null,
		effects: toJson(t.effects),
		mechanics: toJson(t.mechanics),
		limitations: toJson(t.limitations),
		lore: t.lore ?? null,
		flavor: t.flavor ?? null,
		image: t.image ?? null,
		source: t.source ?? "System Ascendant Canon",
		tags: t.tags ?? [],
		theme_tags: [],
	}));

	await upsertBatch("compendium_tattoos", rows);
}

// ---------------------------------------------------------------------------
// Backgrounds
// ---------------------------------------------------------------------------
async function syncBackgrounds() {
	const { allBackgrounds } = await import("../src/data/compendium/backgrounds-index.js");
	console.log(`Syncing ${allBackgrounds.length} backgrounds...`);
	const rows = allBackgrounds.map((b: any) => ({
		name: b.name,
		description: b.description ?? "",
		skill_proficiencies: b.skillProficiencies ?? [],
		tool_proficiencies: b.toolProficiencies ?? [],
		language_count: Array.isArray(b.languages) ? b.languages.length : 0,
		starting_equipment: b.equipment ?? [],
		feature_name: b.features && b.features[0] ? b.features[0].name : null,
		feature_description: b.features && b.features[0] ? b.features[0].description : null,
		personality_traits: b.personalityTraits ?? [],
		ideals: b.ideals ?? [],
		bonds: b.bonds ?? [],
		flaws: b.flaws ?? [],
		source_book: "System Ascendant Canon",
		mechanics: toJson(b.mechanics),
		flavor: b.flavor ?? null,
		lore: b.lore ?? null,
	}));
	await upsertBatch("compendium_backgrounds", rows);
}

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------
async function syncConditions() {
	const { conditions } = await import("../src/data/compendium/conditions.js");
	console.log(`Syncing ${conditions.length} conditions...`);
	const rows = conditions.map((c: any) => ({
		name: c.name,
		description: c.description ?? "",
		effects: c.effects ?? [],
		mechanics: toJson(c.mechanics),
		flavor: c.flavor ?? null,
		lore: c.lore ?? null,
	}));
	await upsertBatch("compendium_conditions", rows);
}

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------
async function syncLocations() {
	const { locations } = await import("../src/data/compendium/locations.js");
	console.log(`Syncing ${locations.length} locations...`);
	const rows = locations.map((loc: any) => ({
		name: loc.name,
		description: loc.description ?? "",
		type: loc.type ?? "Void Anomaly",
		image: loc.image ?? null,
		tags: [loc.rank].filter(Boolean),
		source_book: "System Ascendant Canon",
		mechanics: toJson(loc.mechanics || { encounters: loc.encounters, treasures: loc.treasures }),
		flavor: loc.flavor ?? null,
		lore: loc.lore ?? null,
	}));
	await upsertBatch("compendium_locations", rows);
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------
async function syncJobs() {
	const { jobs } = await import("../src/data/compendium/jobs.js");
	console.log(`Syncing ${jobs.length} jobs...`);
	const rows = jobs.map((j: any) => ({
		name: j.name,
		description: j.description ?? "",
		primary_abilities: j.primary_abilities ?? [],
		hit_die: j.hit_die ?? 8,
		source_book: "System Ascendant Canon",
		flavor_text: j.flavor ?? null,
		mechanics: toJson(j.features),
		flavor: j.flavor ?? null,
		lore: j.lore ?? null,
	}));
	await upsertBatch("compendium_jobs", rows);
}

// ---------------------------------------------------------------------------
// Regents
// ---------------------------------------------------------------------------
async function syncRegents() {
	const { regents } = await import("../src/data/compendium/regents.js");
	console.log(`Syncing ${regents.length} regents...`);
	const rows = regents.map((r: any) => ({
		name: r.name,
		title: r.title ?? "",
		description: r.description ?? "",
		theme: r.theme ?? null,
		damage_type: r.damage_type ?? null,
		flavor_text: r.flavor ?? null,
		source_book: "System Ascendant Canon",
		mechanics: toJson(r.mechanics || r.class_features || r.features),
		effects: toJson(r.effects),
		flavor: r.flavor ?? null,
		lore: r.lore ?? null,
	}));
	await upsertBatch("compendium_regents", rows);
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
async function syncSkills() {
	const { comprehensiveSkills } = await import("../src/data/compendium/skills-comprehensive.js");
	console.log(`Syncing ${comprehensiveSkills.length} skills...`);
	const rows = comprehensiveSkills.map((s: any) => ({
		name: s.name,
		ability: s.ability ?? "INT",
		description: s.description ?? "",
		examples: s.examples ?? [],
		source_book: "System Ascendant Canon",
		mechanics: toJson(s.benefits),
		flavor: s.flavor ?? null,
		lore: s.lore ?? null,
	}));
	await upsertBatch("compendium_skills", rows);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	console.log("=== Static-to-DB Sync ===\n");

	try {
		await syncSpells();
		await syncPowers();
		await syncTechniques();
		await syncFeats();
		await syncRelics();
		await syncMonsters();
		await syncRunes();
		await syncSigils();
		await syncTattoos();
		await syncBackgrounds();
		await syncConditions();
		await syncLocations();
		await syncJobs();
		await syncRegents();
		await syncSkills();
	} catch (err) {
		console.error("Fatal error:", err);
		process.exitCode = 1;
		return;
	}

	console.log("\n=== Sync complete ===");
}

main();
