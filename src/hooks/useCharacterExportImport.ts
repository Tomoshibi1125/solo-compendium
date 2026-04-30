import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import {
	resolveCanonicalCastableReference,
	resolveCanonicalReference,
	type StaticCanonicalEntryType,
} from "@/lib/canonicalCompendium";
import { normalizeCharacterOverlayFields } from "@/lib/characterOverlayValidation";
import {
	classifyImportVersion,
	collectContainerOriginalIds,
	resolveImportedContainerId,
} from "@/lib/importValidation";
import { normalizeSpellReference } from "@/lib/spellReference";

/**
 * Export schema version. Bump when the export shape changes in a way that
 * breaks round-tripping. The importer warns (but still proceeds) when a
 * legacy/unversioned file is loaded — D&D Beyond parity for graceful
 * handling of older backup files.
 */
const EXPORT_VERSION = "2.4";

type _Character = Database["public"]["Tables"]["characters"]["Row"];
type _CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];
type CharacterInsert = Database["public"]["Tables"]["characters"]["Insert"];
type EquipmentInsert =
	Database["public"]["Tables"]["character_equipment"]["Insert"];
type FeatureInsert =
	Database["public"]["Tables"]["character_features"]["Insert"];
type PowerInsert = Database["public"]["Tables"]["character_powers"]["Insert"];
type SpellInsert = Database["public"]["Tables"]["character_spells"]["Insert"];
type TechniqueInsert =
	Database["public"]["Tables"]["character_techniques"]["Insert"];
type RuneKnowledgeInsert =
	Database["public"]["Tables"]["character_rune_knowledge"]["Insert"];
type RuneInscriptionInsert =
	Database["public"]["Tables"]["character_rune_inscriptions"]["Insert"];
type SigilInscriptionInsert =
	Database["public"]["Tables"]["character_sigil_inscriptions"]["Insert"];
type RegentInsert = Database["public"]["Tables"]["character_regents"]["Insert"];
type ShadowSoldierInsert =
	Database["public"]["Tables"]["character_shadow_soldiers"]["Insert"];
type JournalInsert =
	Database["public"]["Tables"]["character_journal"]["Insert"];
type BackupInsert = Database["public"]["Tables"]["character_backups"]["Insert"];
type ActiveSpellInsert =
	Database["public"]["Tables"]["character_active_spells"]["Insert"];
type ShadowArmyInsert =
	Database["public"]["Tables"]["character_shadow_army"]["Insert"];
type ExtrasInsert = Database["public"]["Tables"]["character_extras"]["Insert"];
type MonarchUnlockInsert =
	Database["public"]["Tables"]["character_monarch_unlocks"]["Insert"];
type RegentUnlockInsert =
	Database["public"]["Tables"]["character_regent_unlocks"]["Insert"];
type FeatureChoiceInsert =
	Database["public"]["Tables"]["character_feature_choices"]["Insert"];

interface _ExportImportOptions {
	format: "json" | "pdf";
	includeHistory?: boolean;
	includeNotes?: boolean;
}

const stringOrNull = (value: unknown): string | null =>
	typeof value === "string" && value.trim() ? value : null;

const numberOrDefault = (value: unknown, fallback: number): number => {
	const numeric = typeof value === "number" ? value : Number(value);
	return Number.isFinite(numeric) ? numeric : fallback;
};

const isPresent = <T>(value: T | null): value is T => value !== null;

const recordOrNull = (value: unknown): Record<string, unknown> | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;

const createImportRowId = (): string => globalThis.crypto.randomUUID();

const stripImportOnlyFields = (
	row: Record<string, unknown>,
	relationKeys: string[] = [],
): Record<string, unknown> => {
	const next = { ...row };
	delete next.id;
	delete next.character_id;
	for (const key of relationKeys) {
		delete next[key];
	}
	return next;
};

async function resolveStaticReferenceId(
	row: Record<string, unknown>,
	idKey: string,
	canonicalType: StaticCanonicalEntryType,
	relationKeys: string[] = [],
): Promise<string | null> {
	const directId = stringOrNull(row[idKey]);
	const directName = stringOrNull(row.name);
	const refs: { id: string | null; name: string | null }[] = [
		{ id: directId, name: directName },
	];

	for (const key of relationKeys) {
		const relation = recordOrNull(row[key]);
		if (!relation) continue;
		refs.push({
			id: stringOrNull(relation.id),
			name: stringOrNull(relation.name),
		});
	}

	for (const ref of refs) {
		if (!ref.id && !ref.name) continue;
		const resolution = await resolveCanonicalReference(canonicalType, {
			id: ref.id,
			name: ref.name,
		});
		if (resolution.entry) return resolution.entry.id;
	}

	return refs.find((ref) => ref.id)?.id ?? null;
}

async function buildImportedCharacterInsert(
	charData: Record<string, unknown>,
	userId: string,
): Promise<CharacterInsert> {
	const job = stringOrNull(charData.job);
	const path = stringOrNull(charData.path);
	const background = stringOrNull(charData.background);
	const [jobResolution, pathResolution, backgroundResolution] =
		await Promise.all([
			resolveCanonicalReference("jobs", {
				id: stringOrNull(charData.job_id),
				name: job,
			}),
			resolveCanonicalReference("paths", {
				id: stringOrNull(charData.path_id),
				name: path,
			}),
			resolveCanonicalReference("backgrounds", {
				id: stringOrNull(charData.background_id),
				name: background,
			}),
		]);

	return normalizeCharacterOverlayFields({
		user_id: userId,
		name: `${stringOrNull(charData.name) ?? "Imported Character"} (Imported)`,
		level: numberOrDefault(charData.level, 1),
		job,
		job_id: jobResolution.entry?.id ?? stringOrNull(charData.job_id) ?? null,
		path,
		path_id: pathResolution.entry?.id ?? stringOrNull(charData.path_id) ?? null,
		background,
		background_id:
			backgroundResolution.entry?.id ??
			stringOrNull(charData.background_id) ??
			null,
		str: numberOrDefault(charData.str ?? charData.strength, 10),
		agi: numberOrDefault(charData.agi ?? charData.agility, 10),
		vit: numberOrDefault(charData.vit ?? charData.vitality, 10),
		int: numberOrDefault(charData.int ?? charData.intelligence, 10),
		sense: numberOrDefault(charData.sense, 10),
		pre: numberOrDefault(charData.pre ?? charData.presence, 10),
		hp_max: numberOrDefault(charData.hp_max ?? charData.max_hp, 10),
		hp_current: numberOrDefault(
			charData.hp_current ?? charData.current_hp ?? charData.hp_max,
			10,
		),
		active_sovereign_id: stringOrNull(charData.active_sovereign_id),
		sovereign_id: stringOrNull(charData.sovereign_id),
		gemini_state: charData.gemini_state ?? null,
		monarch_overlays: Array.isArray(charData.monarch_overlays)
			? charData.monarch_overlays
			: null,
		regent_overlays: Array.isArray(charData.regent_overlays)
			? charData.regent_overlays
			: null,
		armor_class: numberOrDefault(charData.armor_class, 10),
		speed: numberOrDefault(charData.speed, 30),
		initiative: numberOrDefault(charData.initiative, 0),
	} as CharacterInsert);
}

async function buildImportedEquipmentRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<{ rows: EquipmentInsert[]; idMap: Map<string, string> }> {
	const idMap = new Map<string, string>();
	for (const item of rows) {
		const originalId = stringOrNull(item.id);
		if (originalId && !idMap.has(originalId)) {
			idMap.set(originalId, createImportRowId());
		}
	}

	// First pass: identify which original IDs correspond to container rows so
	// we can validate container_id references (DDB parity #13: container_id
	// must point to a row that is itself flagged as `is_container`).
	const originalContainerIds = collectContainerOriginalIds(rows);

	const equipmentRows = await Promise.all(
		rows.map(async (item) => {
			const name = stringOrNull(item.name);
			const originalId = stringOrNull(item.id);
			const newId = originalId
				? (idMap.get(originalId) ?? createImportRowId())
				: createImportRowId();
			const containerId = stringOrNull(item.container_id);
			// Pure helper centralizes the orphan/non-container-target rule.
			const resolvedContainerId = resolveImportedContainerId(
				containerId,
				originalContainerIds,
				idMap,
			);
			const [equipmentResolution, relicResolution] = await Promise.all([
				resolveCanonicalReference("equipment", {
					id: stringOrNull(item.item_id),
					name,
				}),
				resolveCanonicalReference("relics", {
					id: stringOrNull(item.item_id),
					name,
				}),
			]);
			const canonicalEntry =
				equipmentResolution.entry ?? relicResolution.entry ?? null;

			return {
				...stripImportOnlyFields(item, ["item", "equipment", "relic"]),
				character_id: characterId,
				id: newId,
				container_id: resolvedContainerId,
				item_id: canonicalEntry?.id ?? stringOrNull(item.item_id) ?? null,
			} as EquipmentInsert;
		}),
	);

	return { rows: equipmentRows, idMap };
}

async function buildImportedFeatureRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<FeatureInsert[]> {
	return Promise.all(
		rows.map(async (feature) => {
			const name = stringOrNull(feature.name);
			const source = stringOrNull(feature.source);
			const canonicalFeat = source?.toLowerCase().includes("feat")
				? (
						await resolveCanonicalReference("feats", {
							id: stringOrNull(feature.feat_id),
							name,
						})
					).entry
				: null;

			return {
				...feature,
				character_id: characterId,
				id: undefined,
				feat_id: canonicalFeat?.id ?? stringOrNull(feature.feat_id) ?? null,
				feature_id: stringOrNull(feature.feature_id) ?? null,
			} as FeatureInsert;
		}),
	);
}

async function buildImportedPowerRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<PowerInsert[]> {
	return Promise.all(
		rows.map(async (power) => {
			const name = stringOrNull(power.name);
			const canonicalPower = (
				await resolveCanonicalCastableReference(
					{ id: stringOrNull(power.power_id), name },
					undefined,
					["powers"],
				)
			).entry;

			return {
				...power,
				character_id: characterId,
				id: undefined,
				power_id: canonicalPower?.id ?? stringOrNull(power.power_id) ?? null,
			} as PowerInsert;
		}),
	);
}

async function buildImportedSpellRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<SpellInsert[]> {
	return Promise.all(
		rows.map(async (spell) => {
			const name = stringOrNull(spell.name);
			const canonicalSpell = await normalizeSpellReference({
				id: stringOrNull(spell.spell_id),
				name,
			});

			return {
				...spell,
				character_id: characterId,
				id: undefined,
				spell_id: canonicalSpell.spell_id,
			} as SpellInsert;
		}),
	);
}

async function buildImportedTechniqueRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<TechniqueInsert[]> {
	const built = await Promise.all(
		rows.map(async (technique) => {
			const techniqueId = await resolveStaticReferenceId(
				technique,
				"technique_id",
				"techniques",
				["technique"],
			);

			if (!techniqueId) return null;

			return {
				...stripImportOnlyFields(technique, ["technique"]),
				character_id: characterId,
				id: undefined,
				technique_id: techniqueId,
			} as TechniqueInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedRuneKnowledgeRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<RuneKnowledgeInsert[]> {
	const built = await Promise.all(
		rows.map(async (knowledge) => {
			const runeId = await resolveStaticReferenceId(
				knowledge,
				"rune_id",
				"runes",
				["rune"],
			);

			if (!runeId) return null;

			return {
				...stripImportOnlyFields(knowledge, ["rune"]),
				character_id: characterId,
				id: undefined,
				learned_from_character_id: null,
				rune_id: runeId,
			} as RuneKnowledgeInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedRuneInscriptionRows(
	rows: Record<string, unknown>[],
	characterId: string,
	equipmentIdMap: Map<string, string>,
): Promise<RuneInscriptionInsert[]> {
	const built = await Promise.all(
		rows.map(async (inscription) => {
			const oldEquipmentId = stringOrNull(inscription.equipment_id);
			const equipmentId = oldEquipmentId
				? equipmentIdMap.get(oldEquipmentId)
				: null;
			const runeId = await resolveStaticReferenceId(
				inscription,
				"rune_id",
				"runes",
				["rune"],
			);

			if (!equipmentId || !runeId) return null;

			return {
				...stripImportOnlyFields(inscription, ["equipment", "rune"]),
				character_id: characterId,
				id: undefined,
				equipment_id: equipmentId,
				rune_id: runeId,
			} as RuneInscriptionInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedSigilInscriptionRows(
	rows: Record<string, unknown>[],
	characterId: string,
	equipmentIdMap: Map<string, string>,
): Promise<SigilInscriptionInsert[]> {
	const built = await Promise.all(
		rows.map(async (inscription) => {
			const oldEquipmentId = stringOrNull(inscription.equipment_id);
			const equipmentId = oldEquipmentId
				? equipmentIdMap.get(oldEquipmentId)
				: null;
			const sigilId = await resolveStaticReferenceId(
				inscription,
				"sigil_id",
				"sigils",
				["sigil"],
			);

			if (!equipmentId || !sigilId) return null;

			return {
				...stripImportOnlyFields(inscription, ["equipment", "sigil"]),
				character_id: characterId,
				id: undefined,
				equipment_id: equipmentId,
				sigil_id: sigilId,
			} as SigilInscriptionInsert;
		}),
	);

	return built.filter(isPresent);
}
async function buildImportedRegentRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<RegentInsert[]> {
	const built = await Promise.all(
		rows.map(async (regent) => {
			const regentId = await resolveStaticReferenceId(
				regent,
				"regent_id",
				"regents",
				["regent"],
			);

			if (!regentId) return null;

			return {
				...stripImportOnlyFields(regent, ["regent"]),
				character_id: characterId,
				id: undefined,
				regent_id: regentId,
			} as RegentInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedShadowSoldierRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<ShadowSoldierInsert[]> {
	const built = await Promise.all(
		rows.map(async (soldier) => {
			const soldierId = await resolveStaticReferenceId(
				soldier,
				"soldier_id",
				"shadow-soldiers",
				["soldier", "shadow_soldier"],
			);

			if (!soldierId) return null;

			return {
				...stripImportOnlyFields(soldier, ["soldier", "shadow_soldier"]),
				character_id: characterId,
				id: undefined,
				soldier_id: soldierId,
			} as ShadowSoldierInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedJournalRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<JournalInsert[]> {
	return rows
		.map((entry) => {
			const title = stringOrNull(entry.title);
			if (!title) return null;
			return {
				...stripImportOnlyFields(entry),
				character_id: characterId,
				title,
			} as JournalInsert;
		})
		.filter(isPresent);
}

async function buildImportedBackupRows(
	rows: Record<string, unknown>[],
	characterId: string,
	userId: string,
): Promise<BackupInsert[]> {
	return rows
		.map((entry) => {
			if (entry.backup_data == null) return null;
			return {
				...stripImportOnlyFields(entry),
				character_id: characterId,
				user_id: userId,
				backup_data: entry.backup_data as BackupInsert["backup_data"],
			} as BackupInsert;
		})
		.filter(isPresent);
}

async function buildImportedActiveSpellRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<ActiveSpellInsert[]> {
	const built = await Promise.all(
		rows.map(async (entry) => {
			const spellId = await resolveStaticReferenceId(
				entry,
				"spell_id",
				"spells",
				["spell"],
			);
			const spellName =
				stringOrNull(entry.spell_name) ?? stringOrNull(entry.name);
			if (!spellId || !spellName) return null;

			return {
				...stripImportOnlyFields(entry, ["spell"]),
				character_id: characterId,
				spell_id: spellId,
				spell_name: spellName,
			} as ActiveSpellInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedShadowArmyRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<ShadowArmyInsert[]> {
	const built = await Promise.all(
		rows.map(async (entry) => {
			const soldierId = await resolveStaticReferenceId(
				entry,
				"shadow_soldier_id",
				"shadow-soldiers",
				["shadow_soldier", "soldier"],
			);
			if (!soldierId) return null;

			return {
				...stripImportOnlyFields(entry, ["shadow_soldier", "soldier"]),
				character_id: characterId,
				shadow_soldier_id: soldierId,
			} as ShadowArmyInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedExtrasRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<ExtrasInsert[]> {
	const built = await Promise.all(
		rows.map(async (entry) => {
			const name = stringOrNull(entry.name);
			const extraType = stringOrNull(entry.extra_type);
			if (!name || !extraType) return null;

			const monsterId = stringOrNull(entry.monster_id)
				? await resolveStaticReferenceId(entry, "monster_id", "anomalies", [
						"monster",
					])
				: null;

			return {
				...stripImportOnlyFields(entry, ["monster"]),
				character_id: characterId,
				name,
				extra_type: extraType,
				monster_id: monsterId,
			} as ExtrasInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedMonarchUnlockRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<MonarchUnlockInsert[]> {
	return rows
		.map((entry) => {
			const monarchId = stringOrNull(entry.monarch_id);
			const questName = stringOrNull(entry.quest_name);
			if (!monarchId || !questName) return null;
			return {
				...stripImportOnlyFields(entry),
				character_id: characterId,
				monarch_id: monarchId,
				quest_name: questName,
			} as MonarchUnlockInsert;
		})
		.filter(isPresent);
}

async function buildImportedRegentUnlockRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<RegentUnlockInsert[]> {
	const built = await Promise.all(
		rows.map(async (entry) => {
			const regentId = await resolveStaticReferenceId(
				entry,
				"regent_id",
				"regents",
				["regent"],
			);
			const questName = stringOrNull(entry.quest_name);
			if (!regentId || !questName) return null;
			return {
				...stripImportOnlyFields(entry, ["regent"]),
				character_id: characterId,
				regent_id: regentId,
				quest_name: questName,
			} as RegentUnlockInsert;
		}),
	);

	return built.filter(isPresent);
}

async function buildImportedFeatureChoiceRows(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<FeatureChoiceInsert[]> {
	return rows
		.map((entry) => {
			const featureId = stringOrNull(entry.feature_id);
			const groupId = stringOrNull(entry.group_id);
			const optionId = stringOrNull(entry.option_id);
			if (!featureId || !groupId || !optionId) return null;
			return {
				...stripImportOnlyFields(entry),
				character_id: characterId,
				feature_id: featureId,
				group_id: groupId,
				option_id: optionId,
			} as FeatureChoiceInsert;
		})
		.filter(isPresent);
}

async function importRelatedCharacterRows(
	data: Record<string, unknown>,
	characterId: string,
	userId: string,
): Promise<void> {
	if (Array.isArray(data.abilities) && data.abilities.length > 0) {
		const abilities = data.abilities.map(
			(ability: Record<string, unknown>) => ({
				...ability,
				character_id: characterId,
				id: undefined,
			}),
		) as Database["public"]["Tables"]["character_abilities"]["Insert"][];
		await supabase.from("character_abilities").insert(abilities).throwOnError();
	}

	let equipmentIdMap = new Map<string, string>();
	if (Array.isArray(data.equipment) && data.equipment.length > 0) {
		const equipment = await buildImportedEquipmentRows(
			data.equipment as Record<string, unknown>[],
			characterId,
		);
		equipmentIdMap = equipment.idMap;
		await supabase
			.from("character_equipment")
			.insert(equipment.rows)
			.throwOnError();
	}

	if (Array.isArray(data.features) && data.features.length > 0) {
		const features = await buildImportedFeatureRows(
			data.features as Record<string, unknown>[],
			characterId,
		);
		await supabase.from("character_features").insert(features).throwOnError();
	}

	if (Array.isArray(data.powers) && data.powers.length > 0) {
		const powers = await buildImportedPowerRows(
			data.powers as Record<string, unknown>[],
			characterId,
		);
		await supabase.from("character_powers").insert(powers).throwOnError();
	}

	if (Array.isArray(data.spells) && data.spells.length > 0) {
		const spells = await buildImportedSpellRows(
			data.spells as Record<string, unknown>[],
			characterId,
		);
		await supabase.from("character_spells").insert(spells).throwOnError();
	}

	if (Array.isArray(data.techniques) && data.techniques.length > 0) {
		const techniques = await buildImportedTechniqueRows(
			data.techniques as Record<string, unknown>[],
			characterId,
		);
		if (techniques.length > 0) {
			await supabase
				.from("character_techniques")
				.insert(techniques)
				.throwOnError();
		}
	}

	if (Array.isArray(data.rune_knowledge) && data.rune_knowledge.length > 0) {
		const runeKnowledge = await buildImportedRuneKnowledgeRows(
			data.rune_knowledge as Record<string, unknown>[],
			characterId,
		);
		if (runeKnowledge.length > 0) {
			await supabase
				.from("character_rune_knowledge")
				.insert(runeKnowledge)
				.throwOnError();
		}
	}

	if (
		Array.isArray(data.rune_inscriptions) &&
		data.rune_inscriptions.length > 0
	) {
		const runeInscriptions = await buildImportedRuneInscriptionRows(
			data.rune_inscriptions as Record<string, unknown>[],
			characterId,
			equipmentIdMap,
		);
		if (runeInscriptions.length > 0) {
			await supabase
				.from("character_rune_inscriptions")
				.insert(runeInscriptions)
				.throwOnError();
		}
	}

	if (
		Array.isArray(data.sigil_inscriptions) &&
		data.sigil_inscriptions.length > 0
	) {
		const sigilInscriptions = await buildImportedSigilInscriptionRows(
			data.sigil_inscriptions as Record<string, unknown>[],
			characterId,
			equipmentIdMap,
		);
		if (sigilInscriptions.length > 0) {
			await supabase
				.from("character_sigil_inscriptions")
				.insert(sigilInscriptions)
				.throwOnError();
		}
	}
	if (Array.isArray(data.regents) && data.regents.length > 0) {
		const regents = await buildImportedRegentRows(
			data.regents as Record<string, unknown>[],
			characterId,
		);
		if (regents.length > 0) {
			await supabase.from("character_regents").insert(regents).throwOnError();
		}
	}

	if (Array.isArray(data.shadow_soldiers) && data.shadow_soldiers.length > 0) {
		const shadowSoldiers = await buildImportedShadowSoldierRows(
			data.shadow_soldiers as Record<string, unknown>[],
			characterId,
		);
		if (shadowSoldiers.length > 0) {
			await supabase
				.from("character_shadow_soldiers")
				.insert(shadowSoldiers)
				.throwOnError();
		}
	}

	if (Array.isArray(data.shadow_army) && data.shadow_army.length > 0) {
		const shadowArmy = await buildImportedShadowArmyRows(
			data.shadow_army as Record<string, unknown>[],
			characterId,
		);
		if (shadowArmy.length > 0) {
			await supabase
				.from("character_shadow_army")
				.insert(shadowArmy)
				.throwOnError();
		}
	}

	if (Array.isArray(data.active_spells) && data.active_spells.length > 0) {
		const activeSpells = await buildImportedActiveSpellRows(
			data.active_spells as Record<string, unknown>[],
			characterId,
		);
		if (activeSpells.length > 0) {
			await supabase
				.from("character_active_spells")
				.insert(activeSpells)
				.throwOnError();
		}
	}

	if (Array.isArray(data.extras) && data.extras.length > 0) {
		const extras = await buildImportedExtrasRows(
			data.extras as Record<string, unknown>[],
			characterId,
		);
		if (extras.length > 0) {
			await supabase.from("character_extras").insert(extras).throwOnError();
		}
	}

	if (Array.isArray(data.monarch_unlocks) && data.monarch_unlocks.length > 0) {
		const monarchUnlocks = await buildImportedMonarchUnlockRows(
			data.monarch_unlocks as Record<string, unknown>[],
			characterId,
		);
		if (monarchUnlocks.length > 0) {
			await supabase
				.from("character_monarch_unlocks")
				.insert(monarchUnlocks)
				.throwOnError();
		}
	}

	if (Array.isArray(data.regent_unlocks) && data.regent_unlocks.length > 0) {
		const regentUnlocks = await buildImportedRegentUnlockRows(
			data.regent_unlocks as Record<string, unknown>[],
			characterId,
		);
		if (regentUnlocks.length > 0) {
			await supabase
				.from("character_regent_unlocks")
				.insert(regentUnlocks)
				.throwOnError();
		}
	}

	if (Array.isArray(data.feature_choices) && data.feature_choices.length > 0) {
		const featureChoices = await buildImportedFeatureChoiceRows(
			data.feature_choices as Record<string, unknown>[],
			characterId,
		);
		if (featureChoices.length > 0) {
			await supabase
				.from("character_feature_choices")
				.insert(featureChoices)
				.throwOnError();
		}
	}

	if (Array.isArray(data.journal) && data.journal.length > 0) {
		const journal = await buildImportedJournalRows(
			data.journal as Record<string, unknown>[],
			characterId,
		);
		if (journal.length > 0) {
			await supabase.from("character_journal").insert(journal).throwOnError();
		}
	}

	if (Array.isArray(data.backups) && data.backups.length > 0) {
		const backups = await buildImportedBackupRows(
			data.backups as Record<string, unknown>[],
			characterId,
			userId,
		);
		if (backups.length > 0) {
			await supabase.from("character_backups").insert(backups).throwOnError();
		}
	}
}
export function useCharacterExport() {
	const { toast } = useToast();

	const { user } = useAuth();

	const exportCharacterJson = useCallback(
		async (characterId: string) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				// Fetch complete character data
				const { data: character, error: charError } = await supabase
					.from("characters")
					.select("*")
					.eq("id", characterId)
					.single();

				if (charError || !character) {
					throw new Error("Character not found");
				}

				// Fetch related data including canonical-id-bearing tables
				const [
					abilitiesResult,
					equipmentResult,
					featuresResult,
					powersResult,
					spellsResult,
					techniquesResult,
					runeKnowledgeResult,
					runeInscriptionsResult,
					sigilInscriptionsResult,
					regentsResult,
					shadowSoldiersResult,
					shadowArmyResult,
					activeSpellsResult,
					extrasResult,
					monarchUnlocksResult,
					regentUnlocksResult,
					featureChoicesResult,
					journalResult,
					backupsResult,
				] = await Promise.all([
					supabase
						.from("character_abilities")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_equipment")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_features")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_powers")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_spells")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_techniques")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_rune_knowledge")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_rune_inscriptions")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_sigil_inscriptions")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_regents")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_shadow_soldiers")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_shadow_army")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_active_spells")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_extras")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_monarch_unlocks")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_regent_unlocks")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_feature_choices")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_journal")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_backups")
						.select("*")
						.eq("character_id", characterId),
				]);
				// Export format v2.4 explicitly carries canonical IDs alongside
				// the legacy name fields so importers (this app or external tools)
				// can hydrate via canonical compendium even after renames. v2.4
				// adds the full set of character-owned tables: techniques, rune/sigil
				// inscriptions, regents, shadow soldiers/army, active spells, extras,
				// monarch/regent unlocks, feature choices, journal, and backups —
				// remapping equipment row IDs through the import so attached runes
				// and sigils survive re-import. Backups are re-stamped with the
				// importing user's id on replay.
				const exportData = {
					character: character as Record<string, unknown>,
					abilities: abilitiesResult.data || [],
					equipment: equipmentResult.data || [],
					features: featuresResult.data || [],
					powers: powersResult.data || [],
					spells: spellsResult.data || [],
					techniques: techniquesResult.data || [],
					rune_knowledge: runeKnowledgeResult.data || [],
					rune_inscriptions: runeInscriptionsResult.data || [],
					sigil_inscriptions: sigilInscriptionsResult.data || [],
					regents: regentsResult.data || [],
					shadow_soldiers: shadowSoldiersResult.data || [],
					shadow_army: shadowArmyResult.data || [],
					active_spells: activeSpellsResult.data || [],
					extras: extrasResult.data || [],
					monarch_unlocks: monarchUnlocksResult.data || [],
					regent_unlocks: regentUnlocksResult.data || [],
					feature_choices: featureChoicesResult.data || [],
					journal: journalResult.data || [],
					backups: backupsResult.data || [],
					exported_at: new Date().toISOString(),
					exported_by: user?.id || "anonymous",
					version: EXPORT_VERSION,
				};

				// Download JSON file
				const blob = new Blob([JSON.stringify(exportData, null, 2)], {
					type: "application/json",
				});

				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `${character.name || "character"}-${new Date().toISOString().split("T")[0]}.json`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				toast({
					title: "Export Successful",
					description: `${character.name || "Character"} exported as JSON`,
				});

				return exportData;
			} catch (error) {
				toast({
					title: "Export Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	/**
	 * D&D Beyond parity: real PDF export via the browser's native print
	 * dialog ("Save as PDF" works in every modern browser). Replaces the
	 * old `.txt` blob that misleadingly claimed to be a PDF.
	 */
	const exportCharacterPdf = useCallback(
		async (
			characterId: string,
			options: { shareToken?: string | null } = {},
		) => {
			try {
				const { exportCharacterPDF } = await import("@/lib/export");
				exportCharacterPDF(characterId, options);
				toast({
					title: "Print dialog opened",
					description:
						"Use your browser's print dialog → 'Save as PDF' to export.",
				});
				return true;
			} catch (error) {
				toast({
					title: "Export Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[toast],
	);

	const importCharacterJson = useCallback(
		async (file: File) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				if (!user) {
					throw new Error("Must be logged in to import characters");
				}

				const text = await file.text();
				const data = JSON.parse(text);

				// Validate structure
				if (!data.character || !data.character.name) {
					throw new Error("Invalid character file format");
				}

				// D&D Beyond parity (#10): version-aware import. The exporter
				// stamps `version: "2.x"` — older/newer files are accepted with
				// a soft warning so users know data may not round-trip cleanly.
				const versionStatus = classifyImportVersion(data, EXPORT_VERSION);
				if (!versionStatus.matches) {
					toast({
						title: versionStatus.importedVersion
							? `Importing legacy v${versionStatus.importedVersion} character`
							: "Importing unversioned character",
						description: `Current export version is v${EXPORT_VERSION}. Some fields may not transfer cleanly.`,
					});
				}

				// Create new character from import
				const { character: charData } = data;
				const newCharacter = await buildImportedCharacterInsert(
					charData as Record<string, unknown>,
					user.id,
				);

				const { data: createdCharacter, error: createError } = await supabase
					.from("characters")
					.insert(
						newCharacter as Database["public"]["Tables"]["characters"]["Insert"],
					)
					.select()
					.single();

				if (createError || !createdCharacter) {
					throw new Error("Failed to create character");
				}
				await importRelatedCharacterRows(
					data as Record<string, unknown>,
					createdCharacter.id,
					user.id,
				);

				toast({
					title: "Import Successful",
					description: `${charData.name} has been imported successfully`,
				});

				return createdCharacter;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	return {
		exportCharacterJson,
		exportCharacterPdf,
		importCharacterJson,
	};
}

export function useCharacterImport() {
	const { toast } = useToast();
	const { user } = useAuth();

	const importCharacterJson = useCallback(
		async (file: File) => {
			try {
				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				if (!user) {
					throw new Error("Must be logged in to import characters");
				}

				const text = await file.text();
				const data = JSON.parse(text);

				// Validate structure
				if (!data.character || !data.character.name) {
					throw new Error("Invalid character file format");
				}

				// Create new character from import
				const { character: charData } = data;
				const newCharacter = await buildImportedCharacterInsert(
					charData as Record<string, unknown>,
					user.id,
				);

				const { data: createdCharacter, error: createError } = await supabase
					.from("characters")
					.insert(
						newCharacter as Database["public"]["Tables"]["characters"]["Insert"],
					)
					.select()
					.single();

				if (createError || !createdCharacter) {
					throw new Error("Failed to create character");
				}
				await importRelatedCharacterRows(
					data as Record<string, unknown>,
					createdCharacter.id,
					user.id,
				);

				toast({
					title: "Import Successful",
					description: `${charData.name} has been imported successfully`,
				});

				return createdCharacter;
			} catch (error) {
				toast({
					title: "Import Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	return {
		importCharacterJson,
	};
}
