/**
 * sync-static-to-db.ts â€” Seed Supabase compendium tables from static TS data.
 *
 * Objective: 100% data parity between static TS source and Supabase.
 * Strategy: Hard-Typed, Non-Generic synchronization for absolute type safety.
 * Zero-Any, Zero-Generic, Zero-Suppression Policy.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { staticDataProvider } from "../src/data/compendium/providers";
import type { Database, Json } from "../src/integrations/supabase/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
	process.exit(1);
}

// Authoritative Client using the primary Database type
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Constants & Lookups
// ---------------------------------------------------------------------------
const LOG_FILE = path.resolve(__dirname, "../sync-log.txt");
const logStream = fs.createWriteStream(LOG_FILE, {
	flags: "w",
	encoding: "utf8",
});

function log(message: string) {
	const timestamp = new Date().toISOString();
	console.log(message);
	logStream.write(`[${timestamp}] ${message}\n`);
}
const JOB_NAME_TO_ID: Record<string, string> = {};

async function initializeJobMap() {
	const { data, error } = await supabase
		.from("compendium_jobs")
		.select("id, name");
	if (error) {
		log(`  [Jobs] Warning: Failed to fetch job map: ${error.message}`);
		return;
	}
	if (data) {
		for (const job of data) {
			JOB_NAME_TO_ID[job.name] = job.id;
		}
	}
}

// ---------------------------------------------------------------------------
// Strict Helpers (Zero Any)
// ---------------------------------------------------------------------------
function castToJson(v: unknown): Json {
	if (v === undefined || v === null) return null;
	return v as Json;
}

function castToString(v: unknown): string | null {
	if (v === undefined || v === null) return null;
	if (typeof v === "string") return v;
	return JSON.stringify(v);
}

function castToStringArray(v: unknown): string[] | null {
	if (Array.isArray(v)) {
		return v.filter((item): item is string => typeof item === "string");
	}
	return null;
}

function mapAbility(
	s: string | null | undefined,
): Database["public"]["Enums"]["ability_score"] {
	if (!s) return "STR";
	const upper = s.toUpperCase();
	if (upper === "STRENGTH" || upper === "STR") return "STR";
	if (upper === "AGILITY" || upper === "AGI") return "AGI";
	if (upper === "VITALITY" || upper === "VIT") return "VIT";
	if (upper === "INTELLIGENCE" || upper === "INT") return "INT";
	if (upper === "SENSE") return "SENSE";
	if (upper === "PRESENCE" || upper === "PRE") return "PRE";
	return "STR";
}

const ALLOWED_RARITIES: Database["public"]["Enums"]["rarity"][] = [
	"common",
	"uncommon",
	"rare",
	"very_rare",
	"legendary",
];
function mapRarity(
	r: string | null | undefined,
): Database["public"]["Enums"]["rarity"] {
	if (!r) return "common";
	const norm = r.toLowerCase().trim().replace(/\s+/g, "_");
	for (const allowed of ALLOWED_RARITIES) {
		if (norm === allowed) return allowed;
	}
	if (norm === "mythic") return "legendary"; // Fallback for out-of-spec rarities
	return "common";
}

// ---------------------------------------------------------------------------
// Explicit Sync Functions (No Generics)
// ---------------------------------------------------------------------------

async function syncAnomalies() {
	const data = await staticDataProvider.getAnomalies("");
	log(`Syncing ${data.length} anomalies...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_Anomalies"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			gate_rank: m.gate_rank || null,
			cr: m.cr || "0",
			creature_type: m.creature_type || "monstrosity",
			size: m.size || "Medium",
			alignment: m.alignment || null,
			armor_class:
				typeof m.armor_class === "number"
					? m.armor_class
					: m.armor_class
						? parseInt(String(m.armor_class), 10) || 10
						: 10,
			armor_type: m.armor_type || null,
			hit_points_average: m.hit_points_average || 10,
			hit_points_formula: m.hit_points_formula || "1d8",
			speed_walk: m.speed_walk || 30,
			speed_burrow: m.speed_burrow || null,
			speed_climb: m.speed_climb || null,
			speed_fly: m.speed_fly || null,
			speed_swim: m.speed_swim || null,
			str: m.str || 10,
			agi: m.agi || 10,
			vit: m.vit || 10,
			int: m.int || 10,
			sense: m.sense || 10,
			pre: m.pre || 10,
			saving_throws: castToJson(m.saving_throws),
			skills: castToJson(m.skills),
			languages: castToStringArray(m.languages),
			condition_immunities: castToStringArray(m.condition_immunities),
			damage_immunities: castToStringArray(m.damage_immunities),
			damage_resistances: castToStringArray(m.damage_resistances),
			damage_vulnerabilities: castToStringArray(m.damage_vulnerabilities),
			xp: m.xp || 0,
			is_boss: !!m.is_boss,
			source_book: m.source_book || "System Ascendant Canon",
			tags: m.tags || [],
			image_url: m.image_url || m.image || null,
			actions: castToJson(m.actions || m.Anomaly_actions || []),
			traits: castToJson(m.traits || m.Anomaly_traits || []),
			reactions: castToJson(m.reactions || []),
			legendary_actions: castToJson(m.legendary_actions || []),
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_Anomalies")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_Anomalies").insert(chunk);
		if (error) {
			log(`  [Anomalies] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Anomalies] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncSpells() {
	const data = await staticDataProvider.getSpells("");
	log(`Syncing ${data.length} spells...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_spells"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			mechanics: castToJson(m.mechanics),
			tags: m.tags || [],
			source_book: m.source_book || "System Ascendant Canon",
			image_url: m.image_url || m.image || null,
			spell_level: m.spell_level || m.level || 0,
			school: m.school || "Evocation",
			casting_time: m.casting_time || "1 action",
			range: castToJson(m.range),
			components: castToJson(m.components),
			duration: castToJson(m.duration),
			concentration: !!m.concentration,
			ritual: !!m.ritual,
			spell_type: m.spell_type || "Utility",
			at_higher_levels:
				m.at_higher_levels || m.atHigherLevels || m.higher_levels || null,
			classes: castToStringArray(m.classes),
			saving_throw_ability:
				(m.saving_throw_ability || castToString(m.saving_throw?.ability)) ?? undefined,
			has_attack_roll: m.has_attack_roll || !!m.spell_attack,
			area_of_effect: castToJson(m.area_of_effect || m.area),
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_spells")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_spells").insert(chunk);
		if (error) {
			log(`  [Spells] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Spells] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncRunes() {
	const data = await staticDataProvider.getRunes("");
	log(`Syncing ${data.length} runes...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_runes"]["Insert"][] = [];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			mechanics: castToJson(m.mechanics),
			tags: m.tags || [],
			source_book: m.source_book || "System Ascendant Canon",
			image_url: m.image_url || m.image || null,
			rune_level: m.rune_level || 1,
			rune_type: m.rune_type || "hybrid",
			rune_category: m.rune_category || m.rune_type || "hybrid",
			rarity: mapRarity(m.rarity),
			effect_type: m.effect_type || "passive",
			activation_action: m.activation_action || null,
			range: castToString(m.range),
			duration: castToString(m.duration),
			concentration: !!m.concentration,
			uses_per_rest: m.uses_per_rest || null,
			requires_level: m.requires_level || 1,
			effect_description: m.effect_description || m.description || "",
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_runes")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_runes").insert(chunk);
		if (error) {
			log(`  [Runes] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Runes] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncEquipment() {
	const data = await staticDataProvider.getItems("");
	log(`Syncing ${data.length} equipment...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_equipment"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			equipment_type: m.item_type || m.equipment_type || "Gear",
			rarity: mapRarity(m.rarity),
			requires_attunement: !!m.attunement,
			properties: castToStringArray(m.properties),
			sigil_slots_base: Math.round(Number(m.sigil_slots_base) || 0),
			cost_credits: Math.round(Number(m.value || m.cost_credits || 0)),
			weight: Math.round(Number(m.weight || 0)),
			source_book: m.source_book || "System Ascendant Canon",
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_equipment")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_equipment").insert(chunk);
		if (error) {
			log(`  [Equipment] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Equipment] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncJobs() {
	const data = await staticDataProvider.getJobs("");
	log(`Syncing ${data.length} jobs...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_jobs"]["Insert"][] = [];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor_text: m.flavor || m.flavor_text || null,
			hit_die: m.hit_die || (m as unknown as { hitDie?: string }).hitDie
				? Number.parseInt(
						((m as unknown as { hitDie?: string }).hitDie || "").replace(/\D/g, "").slice(-2) || String(m.hit_die || 8),
						10,
				  ) || 8
				: 8,
			primary_abilities: (m.primary_abilities || []).map(mapAbility),
			saving_throw_proficiencies: (m.saving_throw_proficiencies || []).map(
				mapAbility,
			),
			armor_proficiencies: castToStringArray(m.armor_proficiencies),
			weapon_proficiencies: castToStringArray(m.weapon_proficiencies),
			skill_choices: castToStringArray(m.skill_choices),
			skill_choice_count: m.skill_choice_count || 2,
			updated_at: new Date().toISOString(),
			rank: m.rank || null,
			image_url: m.image_url || m.image || null,
			awakening_features: castToJson(m.awakening_features),
			job_traits: castToJson(m.job_traits) || [],
			racial_traits: castToJson((m as unknown as { racialTraits?: unknown }).racialTraits) || [],
			ability_score_improvements: castToJson(m.ability_score_improvements),
			size: m.size || "Medium",
			speed: m.speed_walk
				? castToString(m.speed_walk)
				: m.speed
					? castToString(m.speed)
					: "30 ft",
			languages: castToStringArray(m.languages),
			hit_points_first_level: m.hit_points_at_first_level || null,
			hit_points_higher_levels: m.hit_points_at_higher_levels || null,
			spellcasting: castToJson(m.spellcasting),
			class_features: castToJson(m.class_features),
			stats: castToJson(m.stats),
			abilities: castToStringArray(m.abilities),
			type: m.type || "Combat",
			source_book: (m as unknown as { source?: string }).source || "Rift Ascendant Canon",
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_jobs")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_jobs").insert(chunk);
		if (error) {
			log(`  [Jobs] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Jobs] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncJobPaths() {
	const data = await staticDataProvider.getPaths("");
	log(`Syncing ${data.length} job paths...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_job_paths"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		// Try all lookup strategies: job_name field, jobName field, job_id field, jobId field
		const jobLookup =
			JOB_NAME_TO_ID[(m as unknown as { jobName?: string }).jobName || ""] ||
			JOB_NAME_TO_ID[m.job_name || ""] ||
			JOB_NAME_TO_ID[(m as unknown as { jobId?: string }).jobId || ""] ||
			m.job_id ||
			(m as unknown as { jobId?: string }).jobId;
		if (!jobLookup) {
			log(
				`  [JobPaths] Warning: No Job ID for path "${m.name}" (jobName: "${(m as unknown as { jobName?: string }).jobName || m.job_name}") — skipping`,
			);
			continue;
		}
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor_text: m.flavor || m.flavor_text || null,
			path_level: m.path_level ?? (m as unknown as { level?: number }).level ?? 3,
			job_id: jobLookup,
			source_book: (m as unknown as { source?: string }).source || "Rift Ascendant Canon",
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_job_paths")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_job_paths").insert(chunk);
		if (error) {
			log(`  [JobPaths] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [JobPaths] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncPowers() {
	const data = await staticDataProvider.getPowers("");
	log(`Syncing ${data.length} powers...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_powers"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			image_url: m.image_url || m.image || null,
			mechanics: castToJson(m.mechanics),
			power_level: Math.min(9, Math.max(0, Number(m.power_level) || 0)),
			power_type: m.power_type || m.school || "Generic",
			casting_time: m.casting_time || "1 action",
			range: castToString(m.range) || "Self",
			duration: castToString(m.duration) || "Instantaneous",
			source_book: m.source_book || "System Ascendant Canon",
			tags: castToStringArray(m.tags) || [],
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_powers")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_powers").insert(chunk);
		if (error) {
			log(`  [Powers] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Powers] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncArtifacts() {
	const data = await staticDataProvider.getArtifacts("");
	log(`Syncing ${data.length} artifacts...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_artifacts"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			type: m.artifact_type || m.type || "weapon",
			rarity: m.rarity || "legendary",
			attunement: !!m.attunement,
			requirements: castToJson(m.requirements),
			properties: castToJson(m.properties),
			abilities: castToJson(m.abilities),
			lore: castToJson(m.lore),
			mechanics: castToJson(m.mechanics),
			tags: castToStringArray(m.tags) || [],
			source_book: m.source_book || "System Ascendant Canon",
			image_url: m.image_url || m.image || null,
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_artifacts")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_artifacts").insert(chunk);
		if (error) {
			log(`  [Artifacts] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Artifacts] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncTattoos() {
	const data = await staticDataProvider.getTattoos("");
	log(`Syncing ${data.length} tattoos...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_tattoos"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			rarity: m.rarity || "common",
			attunement: !!m.attunement,
			body_part: m.body_part || "Any",
			effects: castToJson(m.effects),
			mechanics: castToJson(m.mechanics),
			limitations: castToJson(m.limitations || {}),
			lore: m.lore ? castToString(m.lore) : null,
			flavor: m.flavor || null,
			image_url: m.image_url || m.image || null,
			source: m.source || m.source_book || "System Ascendant Canon",
			tags: castToStringArray(m.tags) || [],
			theme_tags: castToStringArray(m.theme_tags) || [],
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_tattoos")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_tattoos").insert(chunk);
		if (error) {
			log(`  [Tattoos] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Tattoos] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncShadowSoldiers() {
	const data = await staticDataProvider.getShadowSoldiers("");
	log(`Syncing ${data.length} shadow soldiers...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_shadow_soldiers"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			rank: castToString(m.rank) || "Infantry",
			title: m.title || "Shadow Soldier",
			hit_points: m.hit_points || 10,
			armor_class:
				typeof m.armor_class === "number"
					? m.armor_class
					: m.armor_class
						? parseInt(String(m.armor_class), 10) || 10
						: 10,
			speed: m.speed || 30,
			str: m.str || 10,
			agi: m.agi || 10,
			vit: m.vit || 10,
			int: m.int || 10,
			sense: m.sense || 10,
			pre: m.pre || 10,
			abilities: castToJson(m.abilities || {}),
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_shadow_soldiers")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase
			.from("compendium_shadow_soldiers")
			.insert(chunk);
		if (error) {
			log(`  [ShadowSoldiers] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [ShadowSoldiers] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncLocations() {
	const data = await staticDataProvider.getLocations("");
	log(`Syncing ${data.length} locations...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_locations"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			description: m.description || "",
			type: m.location_type || m.type || "Wilderness",
			mechanics: castToJson(m.mechanics),
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			tags: castToStringArray(m.tags) || [],
			source_book: m.source_book || "System Ascendant Canon",
			image: m.image || null,
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_locations")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_locations").insert(chunk);
		if (error) {
			log(`  [Locations] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Locations] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncBackgrounds() {
	const data = await staticDataProvider.getBackgrounds("");
	log(`Syncing ${data.length} backgrounds...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_backgrounds"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			skill_proficiencies: castToStringArray(m.skill_proficiencies),
			tool_proficiencies: castToStringArray(m.tool_proficiencies),
			language_count: m.language_count || 0,
			starting_credits: m.starting_credits || 0,
			feature_name: m.feature_name || null,
			feature_description: m.feature_description || null,
			personality_traits: castToStringArray(
				m.personality_traits ||
					(m as unknown as { personalityTraits?: string[] }).personalityTraits,
			),
			ideals: castToStringArray(m.ideals),
			bonds: castToStringArray(m.bonds),
			flaws: castToStringArray(m.flaws),
			source_book:
				(m as unknown as { source?: string }).source ||
				m.source_book ||
				"Rift Ascendant Canon",
			suggested_characteristics: castToJson(m.suggested_characteristics),
			dangers: castToStringArray(m.dangers),
			abilities: castToStringArray(m.abilities),
		});
	}

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_backgrounds").delete().in("name", names);
	const { error } = await supabase.from("compendium_backgrounds").insert(rows);
	if (error) log(`  [Backgrounds] Error: ${error.message}`);
	log(`  [Backgrounds] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncRegents() {
	const data = await staticDataProvider.getRegents("");
	log(`Syncing ${data.length} regents...`);
	const rows: Database["public"]["Tables"]["compendium_regents"]["Insert"][] =
		data.map((m) => ({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			title: m.regent_title || m.title || "Regent",
			corruption_risk: m.regent_corruption_risk || m.corruption_risk || null,
			manifestation_description:
				m.regent_manifestation || m.manifestation_description || null,
			unlock_level: m.level || m.unlock_level || 0,
			theme: m.regent_theme || m.theme || "Generic",
			damage_type: m.damage_type || null,
			rank: m.rank || null,
			image_url: m.image_url || m.image || null,
			tags: m.tags || [],
			source_book: m.source_book || "System Ascendant Canon",
			hit_dice: m.hit_dice || null,
			saving_throws: castToStringArray(m.saving_throws),
			skill_proficiencies: castToStringArray(m.skill_proficiencies),
			armor_proficiencies: castToStringArray(m.armor_proficiencies),
			weapon_proficiencies: castToStringArray(m.weapon_proficiencies),
			tool_proficiencies: castToStringArray(m.tool_proficiencies),
			class_features: castToJson(m.regent_features || m.class_features),
			spellcasting: castToJson(m.spellcasting),
			progression_table: castToJson(m.progression_table),
			regent_requirements: castToJson(m.regent_requirements),
			mechanics: castToJson(m.regent_mechanics || m.mechanics),
		}));

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_regents").delete().in("name", names);
	const { error } = await supabase.from("compendium_regents").insert(rows);
	log(`  [Regents] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncConditions() {
	const data = await staticDataProvider.getConditions("");
	log(`Syncing ${data.length} conditions...`);
	const rows: Database["public"]["Tables"]["compendium_conditions"]["Insert"][] =
		data.map((m) => ({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			effects: castToStringArray(m.condition_effects) || [],
		}));

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_conditions").delete().in("name", names);
	const { error } = await supabase.from("compendium_conditions").insert(rows);
	log(`  [Conditions] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncFeats() {
	const data = await staticDataProvider.getFeats("");
	log(`Syncing ${data.length} feats...`);
	const rows: Database["public"]["Tables"]["compendium_feats"]["Insert"][] =
		data.map((m) => ({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			benefits: castToStringArray(m.benefits),
			prerequisites: castToString(m.prerequisites),
			source_book: m.source_book || "System Ascendant Canon",
		}));

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_feats").delete().in("name", names);
	const { error } = await supabase.from("compendium_feats").insert(rows);
	if (error) log(`  [Feats] Error: ${error.message}`);
	log(`  [Feats] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncSkills() {
	const data = await staticDataProvider.getSkills("");
	log(`Syncing ${data.length} skills...`);
	const rows: Database["public"]["Tables"]["compendium_skills"]["Insert"][] =
		data.map((m) => ({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			ability: m.ability || "Strength",
		}));

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_skills").delete().in("name", names);
	const { error } = await supabase.from("compendium_skills").insert(rows);
	log(`  [Skills] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncRelics() {
	const data = await staticDataProvider.getRelics("");
	log(`Syncing ${data.length} relics...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_relics"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			image_url: m.image_url || m.image || null,
			mechanics: castToJson(m.mechanics),
			item_type: m.relic_type || "Generic",
			rarity: mapRarity(m.rarity),
			requires_attunement: !!m.attunement,
			attunement_requirements: castToString(m.attunement_requirements) || null,
			value_credits: m.value_credits || 0,
			weight: m.weight || 0,
			source_book: m.source_book || "System Ascendant Canon",
		});
	}

	const names = rows.map((r) => r.name);
	await supabase.from("compendium_relics").delete().in("name", names);
	const { error } = await supabase.from("compendium_relics").insert(rows);
	if (error) log(`  [Relics] Error: ${error.message}`);
	log(`  [Relics] Synced ${rows.length} rows. Errors: ${error ? 1 : 0}`);
}

async function syncTechniques() {
	const data = await staticDataProvider.getTechniques("");
	log(`Syncing ${data.length} techniques...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_techniques"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			flavor: m.flavor || null,
			lore: m.lore ? castToString(m.lore) : null,
			image_url: m.image_url || m.image || null,
			mechanics: castToJson(m.mechanics),
			technique_type: m.technique_type || "martial",
			activation_type: m.activation_type || "action",
			primary_effect: m.primary_effect || m.description || "",
			secondary_effect: m.secondary_effect || null,
			source: m.source || m.source_book || "System Ascendant Canon",
			style: m.style || "None",
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_techniques")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase
			.from("compendium_techniques")
			.insert(chunk);
		if (error) {
			log(`  [Techniques] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Techniques] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncSigils() {
	const data = await staticDataProvider.getSigils("");
	log(`Syncing ${data.length} sigils...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_sigils"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.name)) continue;
		seen.add(m.name);
		rows.push({
			name: m.name,
			display_name: m.display_name || m.name,
			description: m.description || "",
			effect_description: m.effect_description || m.description || "",
			rarity: mapRarity(m.rarity),
			rune_type: m.sigil_type || "Utility",
			rune_category: m.sigil_rank || m.sigil_type || "Basic",
			rune_level: m.rune_level || 0,
			can_inscribe_on: castToStringArray(m.can_inscribe_on),
			flavor: m.flavor || null,
			lore: m.lore ? String(m.lore) : null,
			image_url: m.image_url || m.image || null,
		});
	}

	const names = rows.map((r) => r.name);
	for (let i = 0; i < names.length; i += 500) {
		await supabase
			.from("compendium_sigils")
			.delete()
			.in("name", names.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_sigils").insert(chunk);
		if (error) {
			log(`  [Sigils] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Sigils] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function syncPantheon() {
	const data = await staticDataProvider.getPantheon("");
	log(`Syncing ${data.length} deities...`);
	const seen = new Set<string>();
	const rows: Database["public"]["Tables"]["compendium_pantheon"]["Insert"][] =
		[];

	for (const m of data) {
		if (seen.has(m.id)) continue;
		seen.add(m.id);
		rows.push({
			id: m.id,
			name: m.name,
			display_name: m.display_name || m.name,
			rank: m.rank || null,
			directive: m.directive || null,
			portfolio: m.portfolio || [],
			sigil: m.sigil || null,
			manifestation: m.manifestation || null,
			specializations: m.specializations || [],
			description: m.description || "",
			lore: castToString(m.lore),
			dogma: m.dogma || [],
			worshippers: m.worshippers || null,
			temples: m.temples || null,
			home_realm: m.home_realm || null,
			relationships: castToJson(m.relationships),
		});
	}

	const ids = rows.map((r) => r.id);
	for (let i = 0; i < ids.length; i += 500) {
		await supabase
			.from("compendium_pantheon")
			.delete()
			.in("id", ids.slice(i, i + 500));
	}

	let errors = 0;
	for (let i = 0; i < rows.length; i += 100) {
		const chunk = rows.slice(i, i + 100);
		const { error } = await supabase.from("compendium_pantheon").insert(chunk);
		if (error) {
			log(`  [Pantheon] Error: ${error.message}`);
			errors++;
		}
	}
	log(`  [Pantheon] Synced ${rows.length} rows. Errors: ${errors}`);
}

async function main() {
	log("--- Starting Authoritative Sync (Zero-Any) ---");
	try {
		await syncJobs();
		await initializeJobMap(); // Populate dynamic map after jobs are synced
		await syncAnomalies();
		await syncSpells();
		await syncRunes();
		await syncEquipment();
		await syncJobPaths();
		await syncPowers();
		await syncArtifacts();
		await syncTattoos();
		await syncShadowSoldiers();
		await syncLocations();
		await syncBackgrounds();
		await syncRegents();
		await syncConditions();
		await syncFeats();
		await syncSkills();
		await syncRelics();
		await syncTechniques();
		await syncSigils();
		await syncPantheon();
		log("--- Sync Complete ---");
	} catch (err: unknown) {
		const e = err as Error;
		log(`FATAL ERROR: ${e.message}`);
		process.exit(1);
	}
}

main();
