import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { getMaxAbilityLevelForJobAtLevel } from "@/lib/abilityProgression";
import { useAuth } from "@/lib/auth/authContext";
import {
	resolveCanonicalCastableReference,
	resolveCanonicalReference,
	type StaticCanonicalEntryType,
} from "@/lib/canonicalCompendium";
import {
	assertCanonicalPowerLearnable,
	assertCanonicalSpellLearnable,
	assertCanonicalTechniqueLearnable,
	assertHomebrewPowerLearnable,
	assertHomebrewSpellLearnable,
	type CharacterAbilityAccessContext,
} from "@/lib/characterAbilityAccess";
import { normalizeCharacterOverlayFields } from "@/lib/characterOverlayValidation";
import {
	addLocalEquipment,
	addLocalFeature,
	addLocalPendingRegentGrant,
	addLocalPower,
	addLocalSpell,
	addLocalTechnique,
	createLocalCharacter,
	getLocalCharacterState,
	isLocalCharacterId,
	setLocalPendingRegentResonance,
	setLocalPortableCanonState,
} from "@/lib/guestStore";
import {
	classifyImportVersion,
	collectContainerOriginalIds,
	resolveImportedContainerId,
} from "@/lib/importValidation";
import { companionRowsFromRetiredTames } from "@/lib/retiredTamedAnomalies";
import {
	isRebuildableSovereignFeature,
	sovereignAttachmentOperationId,
	sovereignV2SaveOperationId,
} from "@/lib/sovereign/sovereignPersistence";
import { readSovereignDefinition } from "@/lib/sovereign/sovereignV2Contract";

/**
 * Export schema version. Bump when the export shape changes in a way that
 * breaks round-tripping. The importer warns (but still proceeds) when a
 * legacy/unversioned file is loaded — D&D Beyond parity for graceful
 * handling of older backup files.
 */
const EXPORT_VERSION = "3.3";

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
type ShadowSoldierInsert =
	Database["public"]["Tables"]["character_umbral_legionnaires"]["Insert"];
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
type FeatureChoiceInsert =
	Database["public"]["Tables"]["character_feature_choices"]["Insert"];
type VehicleInsert =
	Database["public"]["Tables"]["character_vehicles"]["Insert"];
type TattooInsert = Database["public"]["Tables"]["character_tattoos"]["Insert"];
type SheetStateInsert =
	Database["public"]["Tables"]["character_sheet_state"]["Insert"];
type SpellSlotInsert =
	Database["public"]["Tables"]["character_spell_slots"]["Insert"];

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
const isUuid = (value: string | null): value is string =>
	!!value &&
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		value,
	);

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

const isCanonicalRuneKey = (value: string): boolean =>
	/^rune-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export async function buildImportedCharacterInsert(
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
		// A resolved reference stores the canonical name, so a retired name
		// matched through an alias is never persisted (RA-27).
		job: jobResolution.entry?.name ?? job,
		job_id: jobResolution.entry?.id ?? stringOrNull(charData.job_id) ?? null,
		path: pathResolution.entry?.name ?? path,
		path_id: pathResolution.entry?.id ?? stringOrNull(charData.path_id) ?? null,
		background: backgroundResolution.entry?.name ?? background,
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
		active_sovereign_id: null,
		sovereign_id: null,
		gemini_state: null,
		monarch_overlays: Array.isArray(charData.monarch_overlays)
			? charData.monarch_overlays
			: null,
		regent_overlays: [],
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
		rows
			.filter((feature) => !isRebuildableSovereignFeature(feature))
			.map(async (feature) => {
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
	context: CharacterAbilityAccessContext,
): Promise<PowerInsert[]> {
	return Promise.all(
		rows.map(async (power) => {
			const name = stringOrNull(power.name);
			const canonicalPower = (
				await resolveCanonicalCastableReference(
					{ id: stringOrNull(power.power_id), name },
					context.accessContext,
					["powers"],
				)
			).entry;
			if (canonicalPower) {
				if (
					power.acquisition_kind !== "regent" &&
					!String(power.source ?? "").endsWith(" Attunement (Catch-Up)")
				) {
					assertCanonicalPowerLearnable(canonicalPower, context);
				}
			} else if (name) {
				await assertHomebrewPowerLearnable(name, context);
			} else {
				throw new Error(
					"Imported power is missing a canonical or homebrew reference.",
				);
			}

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
	context: CharacterAbilityAccessContext,
): Promise<SpellInsert[]> {
	return Promise.all(
		rows.map(async (spell) => {
			const name = stringOrNull(spell.name);
			const canonicalSpell = (
				await resolveCanonicalCastableReference(
					{ id: stringOrNull(spell.spell_id), name },
					context.accessContext,
					["spells"],
				)
			).entry;
			if (canonicalSpell) {
				assertCanonicalSpellLearnable(canonicalSpell, context);
			} else if (name) {
				await assertHomebrewSpellLearnable(name, context);
			} else {
				throw new Error(
					"Imported spell is missing a canonical or homebrew reference.",
				);
			}

			return {
				...spell,
				character_id: characterId,
				id: undefined,
				spell_id: canonicalSpell?.id ?? null,
			} as SpellInsert;
		}),
	);
}

async function buildImportedTechniqueRows(
	rows: Record<string, unknown>[],
	characterId: string,
	context: CharacterAbilityAccessContext,
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
			const techniqueEntry = (
				await resolveCanonicalReference(
					"techniques",
					{ id: techniqueId, name: stringOrNull(technique.name) },
					context.accessContext,
				)
			).entry;
			if (!techniqueEntry) {
				throw new Error("Imported technique is missing a canonical reference.");
			}
			if (
				technique.acquisition_kind !== "regent" &&
				!String(technique.source ?? "").endsWith(" Attunement (Catch-Up)")
			) {
				assertCanonicalTechniqueLearnable(techniqueEntry, context);
			}

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
			const runeId =
				stringOrNull(knowledge.rune_key) ??
				(await resolveStaticReferenceId(knowledge, "rune_id", "runes", [
					"rune",
				]));

			if (!runeId || !isCanonicalRuneKey(runeId)) return null;

			return {
				...stripImportOnlyFields(knowledge, ["rune"]),
				character_id: characterId,
				id: undefined,
				learned_from_character_id: null,
				rune_id: null,
				rune_key: runeId,
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
			const runeId =
				stringOrNull(inscription.rune_key) ??
				(await resolveStaticReferenceId(inscription, "rune_id", "runes", [
					"rune",
				]));

			if (!equipmentId || !runeId || !isCanonicalRuneKey(runeId)) return null;

			return {
				...stripImportOnlyFields(inscription, ["equipment", "rune"]),
				character_id: characterId,
				id: undefined,
				equipment_id: equipmentId,
				rune_id: null,
				rune_key: runeId,
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

type ImportedUnlockAuthority = { id: string; regentId: string };

async function importVerifiedRegentUnlocks(
	rows: Record<string, unknown>[],
	characterId: string,
): Promise<Map<string, ImportedUnlockAuthority>> {
	const verified = new Map<string, ImportedUnlockAuthority>();
	const ordered = [...rows].sort(
		(a, b) => Number(b.is_primary === true) - Number(a.is_primary === true),
	);
	for (const row of ordered) {
		const originalId = stringOrNull(row.id);
		const regentId = await resolveStaticReferenceId(
			row,
			"regent_id",
			"regents",
			["regent"],
		);
		if (!isUuid(originalId) || !regentId) continue;
		const { data, error } = await supabase.rpc(
			"import_regent_unlock_authority",
			{
				p_original_unlock_id: originalId,
				p_target_character_id: characterId,
				p_expected_regent_id: regentId,
			},
		);
		if (error) throw new Error(error.message);
		if (data) verified.set(originalId, { id: data, regentId });
	}
	return verified;
}

async function stagePendingRegentGrant(
	row: Record<string, unknown>,
	characterId: string,
	kind: "power" | "technique",
	regentId: string,
): Promise<void> {
	const canonicalId =
		stringOrNull(row[kind === "power" ? "power_id" : "technique_id"]) ??
		"unresolved";
	const originalUnlockId = stringOrNull(row.regent_unlock_id);
	const { error } = await supabase
		.from("character_pending_regent_grants")
		.insert({
			character_id: characterId,
			original_unlock_id: isUuid(originalUnlockId) ? originalUnlockId : null,
			regent_id: regentId,
			grant_kind: kind,
			canonical_id: canonicalId,
			payload: row as Json,
		});
	if (error) throw new Error(error.message);
}

async function importRelatedCharacterRows(
	data: Record<string, unknown>,
	characterId: string,
	userId: string,
): Promise<{
	pendingSovereign: boolean;
	pendingCraftState: boolean;
}> {
	let pendingSovereign = false;
	let pendingCraftState = false;
	const charData = recordOrNull(data.character);
	const importedJobName = stringOrNull(charData?.job);
	const importedLevel = numberOrDefault(charData?.level, 1);
	const importedAbilityContext: CharacterAbilityAccessContext = {
		campaignId: null,
		accessContext: { campaignId: null },
		jobName: importedJobName,
		pathName: stringOrNull(charData?.path),
		regentNames: [],
		characterLevel: importedLevel,
		maxSpellLevel: importedJobName
			? getMaxAbilityLevelForJobAtLevel(importedJobName, importedLevel, "spell")
			: null,
		maxPowerLevel: importedJobName
			? getMaxAbilityLevelForJobAtLevel(importedJobName, importedLevel, "power")
			: null,
		maxTechniqueLevel: importedLevel,
	};
	const exportedUnlocks = Array.isArray(data.regent_unlocks)
		? (data.regent_unlocks as Record<string, unknown>[])
		: [];
	const verifiedUnlocks = await importVerifiedRegentUnlocks(
		exportedUnlocks,
		characterId,
	);
	const originalUnlockById = new Map(
		exportedUnlocks.map((row) => [String(row.id), row]),
	);
	const originalCharacterId = stringOrNull(charData?.id);
	const exportedPool = recordOrNull(data.regent_resonance);
	if (verifiedUnlocks.size > 0 && isUuid(originalCharacterId) && exportedPool) {
		const requested = numberOrDefault(exportedPool.points_current, 0);
		const { error } = await supabase.rpc("import_regent_resonance_state", {
			p_original_character_id: originalCharacterId,
			p_target_character_id: characterId,
			p_requested_points: requested,
		});
		if (error) throw new Error(error.message);
	}

	const importRegentGrant = async (
		row: Record<string, unknown>,
		kind: "power" | "technique",
	) => {
		const originalGrantId = stringOrNull(row.id);
		const originalUnlockId = stringOrNull(row.regent_unlock_id);
		const verified = originalUnlockId
			? verifiedUnlocks.get(originalUnlockId)
			: undefined;
		const exportedUnlock = originalUnlockId
			? originalUnlockById.get(originalUnlockId)
			: undefined;
		const regentId =
			stringOrNull(row.regent_id) ??
			stringOrNull(exportedUnlock?.regent_id) ??
			"unresolved";
		if (verified && verified.regentId === regentId && isUuid(originalGrantId)) {
			try {
				const { data: copiedId, error } = await supabase.rpc(
					"import_regent_grant_authority",
					{
						p_original_grant_id: originalGrantId,
						p_grant_kind: kind,
						p_target_unlock_id: verified.id,
					},
				);
				if (!error && copiedId) return;
			} catch {
				// Retain an unaccepted grant for Warden review below.
			}
		}
		await stagePendingRegentGrant(row, characterId, kind, regentId);
	};

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
		const powerRows = data.powers as Record<string, unknown>[];
		const powers = await buildImportedPowerRows(
			powerRows.filter((row) => row.acquisition_kind !== "regent"),
			characterId,
			importedAbilityContext,
		);
		if (powers.length > 0)
			await supabase.from("character_powers").insert(powers).throwOnError();
		for (const row of powerRows.filter(
			(entry) => entry.acquisition_kind === "regent",
		)) {
			await importRegentGrant(row, "power");
		}
	}

	if (Array.isArray(data.spells) && data.spells.length > 0) {
		const spells = await buildImportedSpellRows(
			data.spells as Record<string, unknown>[],
			characterId,
			importedAbilityContext,
		);
		await supabase.from("character_spells").insert(spells).throwOnError();
	}

	if (Array.isArray(data.techniques) && data.techniques.length > 0) {
		const techniqueRows = data.techniques as Record<string, unknown>[];
		const techniques = await buildImportedTechniqueRows(
			techniqueRows.filter((row) => row.acquisition_kind !== "regent"),
			characterId,
			importedAbilityContext,
		);
		if (techniques.length > 0) {
			await supabase
				.from("character_techniques")
				.insert(techniques)
				.throwOnError();
		}
		for (const row of techniqueRows.filter(
			(entry) => entry.acquisition_kind === "regent",
		)) {
			await importRegentGrant(row, "technique");
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
	// Regent projections are created only from server-verified unlocks above.

	if (Array.isArray(data.shadow_soldiers) && data.shadow_soldiers.length > 0) {
		const shadowSoldiers = await buildImportedShadowSoldierRows(
			data.shadow_soldiers as Record<string, unknown>[],
			characterId,
		);
		if (shadowSoldiers.length > 0) {
			await supabase
				.from("character_umbral_legionnaires")
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

	// Companions belong to the character; a creature needs no separate
	// authority to come along. Older files' `companion_profiles` are ignored,
	// and their personal `tamed_anomalies` import as companions (RA-9).
	const importedExtras = [
		...(Array.isArray(data.extras)
			? (data.extras as Record<string, unknown>[])
			: []),
		...(await companionRowsFromRetiredTames(data.tamed_anomalies)),
	];
	if (importedExtras.length > 0) {
		const extras = await buildImportedExtrasRows(importedExtras, characterId);
		for (const extra of extras) {
			await supabase.from("character_extras").insert(extra).throwOnError();
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

	// v2.5 additions: vehicles, tattoos (list tables), plus the sheet-state
	// singleton and per-level spell slots. These carry a canonical reference id
	// (vehicle_id/tattoo_id) as a plain string that survives re-import
	// unchanged, so no canonical re-resolution is needed — only the owning
	// character_id is re-keyed to the freshly created row.
	if (Array.isArray(data.vehicles) && data.vehicles.length > 0) {
		for (const row of data.vehicles as Record<string, unknown>[]) {
			const vehicle = {
				...stripImportOnlyFields(row),
				character_id: characterId,
			} as VehicleInsert;
			await supabase.from("character_vehicles").insert(vehicle).throwOnError();
		}
	}

	if (Array.isArray(data.tattoos) && data.tattoos.length > 0) {
		const tattoos = (data.tattoos as Record<string, unknown>[]).map((row) => ({
			...stripImportOnlyFields(row),
			character_id: characterId,
		})) as TattooInsert[];
		await supabase.from("character_tattoos").insert(tattoos).throwOnError();
	}

	// Sheet state is a per-character singleton (UNIQUE character_id). A fresh
	// character may already have a seeded row, so upsert on character_id and
	// re-stamp the importing user's id to satisfy row-level security.
	const sheetStateRow = recordOrNull(data.sheet_state);
	if (sheetStateRow) {
		const sheetState = {
			...stripImportOnlyFields(sheetStateRow, ["user_id"]),
			character_id: characterId,
			user_id: userId,
		} as SheetStateInsert;
		await supabase
			.from("character_sheet_state")
			.upsert(sheetState, { onConflict: "character_id" })
			.throwOnError();
	}

	// Spell slots are keyed per (character_id, spell_level); upsert so a
	// trigger-seeded default set is overwritten with the imported spent state.
	if (Array.isArray(data.spell_slots) && data.spell_slots.length > 0) {
		const spellSlots = (data.spell_slots as Record<string, unknown>[]).map(
			(row) => ({
				...stripImportOnlyFields(row),
				character_id: characterId,
			}),
		) as SpellSlotInsert[];
		await supabase
			.from("character_spell_slots")
			.upsert(spellSlots, { onConflict: "character_id,spell_level" })
			.throwOnError();
	}
	if (Array.isArray(data.pending_regent_grants)) {
		for (const pending of data.pending_regent_grants as Record<
			string,
			unknown
		>[]) {
			if (pending.status !== "pending") continue;
			const payload = recordOrNull(pending.payload) ?? pending;
			const kind = pending.grant_kind === "technique" ? "technique" : "power";
			await stagePendingRegentGrant(
				payload,
				characterId,
				kind,
				stringOrNull(pending.regent_id) ?? "unresolved",
			);
		}
	}
	const materialState = recordOrNull(data.material_state);
	if (
		materialState &&
		Array.isArray(materialState.definitions) &&
		Array.isArray(materialState.lots) &&
		Array.isArray(materialState.discoveries)
	) {
		const lots = (materialState.lots as Record<string, unknown>[]).map(
			(lot) => ({
				...lot,
				provenance_metadata: lot.source_rank
					? {
							...(recordOrNull(lot.provenance_metadata) ?? {}),
							sourceRank: lot.source_rank,
						}
					: lot.provenance_metadata,
			}),
		);
		const { data: receipt, error } = await supabase.rpc(
			"import_material_lots_m1",
			{
				p_character_id: characterId,
				p_definitions: materialState.definitions as Json,
				p_lots: lots as Json,
				p_discoveries: materialState.discoveries as Json,
				p_operation_id: `character-import-lots-${characterId}`,
			},
		);
		if (error) throw new Error(error.message);
		const lotMap = recordOrNull(recordOrNull(receipt)?.lot_id_map);
		const sourceCharacterId = stringOrNull(charData?.id);
		if (lotMap && isUuid(sourceCharacterId)) {
			const { error: craftError } = await supabase.rpc(
				"import_craft_state_authority",
				{
					p_original_character_id: sourceCharacterId,
					p_target_character_id: characterId,
					p_lot_id_map: lotMap as Json,
					p_operation_id: `character-import-craft-${characterId}`,
				},
			);
			pendingCraftState = Boolean(craftError);
		} else {
			pendingCraftState = true;
		}
	}
	const exportedSovereign = recordOrNull(data.active_sovereign);
	if (exportedSovereign) {
		let sovereignId: string | null = null;
		const originalId = stringOrNull(exportedSovereign.id);
		if (isUuid(originalId)) {
			const { data: verified } = await supabase
				.from("saved_sovereigns")
				.select("id, created_by")
				.eq("id", originalId)
				.maybeSingle();
			if (verified?.created_by === userId) sovereignId = verified.id;
		}
		if (!sovereignId) {
			const parsed = readSovereignDefinition(exportedSovereign.definition);
			if (parsed.ok && parsed.kind === "v2") {
				const { data: savedId, error } = await supabase.rpc(
					"save_sovereign_v2_definition",
					{
						p_definition: parsed.definition as Json,
						p_operation_id: sovereignV2SaveOperationId(parsed.definition),
						p_is_public: false,
					},
				);
				if (!error) sovereignId = savedId;
			}
		}
		if (sovereignId) {
			const { error } = await supabase.rpc("attach_saved_sovereign", {
				p_character_id: characterId,
				p_sovereign_id: sovereignId,
				p_operation_id: sovereignAttachmentOperationId(
					characterId,
					sovereignId,
				),
			});
			pendingSovereign = Boolean(error);
		} else {
			pendingSovereign = true;
		}
	}
	return { pendingSovereign, pendingCraftState };
}
/**
 * Guest-import counterpart of importRelatedCharacterRows: replay the
 * envelope's character-owned rows into the per-browser store. Covers the
 * row types the guest store tracks; server-only tables (journal, backups,
 * unlocks) are skipped.
 */
async function importRelatedLocalRows(
	data: Record<string, unknown>,
	characterId: string,
): Promise<void> {
	const rows = (key: string): Record<string, unknown>[] =>
		Array.isArray(data[key]) ? (data[key] as Record<string, unknown>[]) : [];

	const strip = (row: Record<string, unknown>): Record<string, unknown> => {
		const { id, character_id, created_at, updated_at, ...rest } = row;
		return rest;
	};

	for (const row of rows("equipment"))
		addLocalEquipment(characterId, strip(row) as never);
	for (const row of rows("features")) {
		if (!isRebuildableSovereignFeature(row))
			addLocalFeature(characterId, strip(row) as never);
	}
	for (const row of rows("powers")) {
		if (row.acquisition_kind === "regent")
			addLocalPendingRegentGrant(characterId, row);
		else addLocalPower(characterId, strip(row) as never);
	}
	for (const row of rows("spells"))
		addLocalSpell(characterId, strip(row) as never);
	for (const row of rows("techniques")) {
		if (row.acquisition_kind === "regent")
			addLocalPendingRegentGrant(characterId, row);
		else addLocalTechnique(characterId, strip(row) as never);
	}
	for (const row of rows("pending_regent_grants")) {
		if (row.status === "pending") {
			addLocalPendingRegentGrant(characterId, recordOrNull(row.payload) ?? row);
		}
	}
	const pool = recordOrNull(data.regent_resonance);
	if (pool) {
		setLocalPendingRegentResonance(characterId, {
			points_current: Math.max(0, numberOrDefault(pool.points_current, 0)),
			points_max: Math.max(0, numberOrDefault(pool.points_max, 0)),
		});
	}
	setLocalPortableCanonState(characterId, {
		portableCompanionRows: {
			// Older files' personal tames arrive as companions (RA-9).
			extras: [
				...rows("extras"),
				...(await companionRowsFromRetiredTames(data.tamed_anomalies)),
			],
			vehicles: rows("vehicles"),
			tamedAnomalies: [],
		},
		portableMaterialState: recordOrNull(data.material_state),
		portableSovereign: recordOrNull(data.active_sovereign),
	});
}

/** Trigger a browser download of the export envelope. */
function downloadExportEnvelope(
	exportData: Record<string, unknown>,
	characterName: string | null,
): void {
	const blob = new Blob([JSON.stringify(exportData, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${characterName || "character"}-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function useCharacterExport() {
	const { toast } = useToast();

	const { user } = useAuth();

	const exportCharacterJson = useCallback(
		async (characterId: string) => {
			try {
				// Guest characters live in the per-browser store — export the same
				// The versioned envelope also preserves pending Regent authority.
				if (isLocalCharacterId(characterId)) {
					const entry = getLocalCharacterState(characterId);
					if (!entry) throw new Error("Character not found");
					const exportData = {
						character: entry.character as unknown as Record<string, unknown>,
						// Guest ability scores live on the character row itself.
						abilities: [],
						equipment: entry.equipment,
						features: entry.features,
						powers: entry.powers,
						spells: entry.spells,
						techniques: entry.techniques,
						rune_knowledge: entry.runeKnowledge,
						rune_inscriptions: entry.runeInscriptions,
						sigil_inscriptions: entry.sigilInscriptions,
						regents: [],
						shadow_soldiers: [],
						shadow_army: [],
						active_spells: [],
						// Personal tames kept from older files leave as companions.
						extras: [
							...entry.portableCompanionRows.extras,
							...(await companionRowsFromRetiredTames(
								entry.portableCompanionRows.tamedAnomalies,
							)),
						],
						monarch_unlocks: [],
						regent_unlocks: [],
						regent_resonance:
							entry.regentResonance ?? entry.pendingRegentResonance,
						pending_regent_grants: entry.pendingRegentGrants,
						feature_choices: [],
						journal: [],
						backups: [],
						// v2.5: guests don't track vehicles/tattoos (cloud-only
						// features). Spell slots are stored as DB rows in the guest
						// store, so they round-trip (and migrate to a cloud account on
						// import). Sheet state is the app-level shape here, not the DB
						// row shape the cloud envelope carries — omit it rather than
						// emit a mismatched object.
						vehicles: entry.portableCompanionRows.vehicles,
						material_state: entry.portableMaterialState,
						active_sovereign: entry.portableSovereign,
						tattoos: [],
						sheet_state: null,
						spell_slots: entry.spellSlots ?? [],
						exported_at: new Date().toISOString(),
						exported_by: "guest",
						version: EXPORT_VERSION,
					};
					downloadExportEnvelope(exportData, entry.character.name);
					toast({
						title: "Export Successful",
						description: `${entry.character.name || "Character"} exported as JSON`,
					});
					return exportData;
				}

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
					regentResonanceResult,
					activeSovereignResult,
					pendingRegentGrantsResult,
					featureChoicesResult,
					journalResult,
					backupsResult,
					vehiclesResult,
					tattoosResult,
					sheetStateResult,
					spellSlotsResult,
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
						.from("character_umbral_legionnaires")
						.select("*")
						.eq("character_id", characterId),
					// `character_shadow_army` holds bulk/anonymous summons (distinct
					// from named `character_umbral_legionnaires`, which render as
					// Companions on the sheet). It is intentionally export/import-only
					// today — carried in the portable package for round-trip fidelity
					// but not surfaced as its own on-sheet panel.
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
						.from("character_regent_resonance")
						.select("*")
						.eq("character_id", characterId)
						.maybeSingle(),
					character.active_sovereign_id
						? supabase
								.from("saved_sovereigns")
								.select("*")
								.eq("id", character.active_sovereign_id)
								.maybeSingle()
						: Promise.resolve({ data: null, error: null }),
					supabase
						.from("character_pending_regent_grants")
						.select("*")
						.eq("character_id", characterId)
						.eq("status", "pending"),
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
					// v2.5: RA-exclusive character-owned tables previously missing
					// from the portable envelope (data-fidelity fix).
					supabase
						.from("character_vehicles")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_tattoos")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_sheet_state")
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("character_spell_slots")
						.select("*")
						.eq("character_id", characterId),
				]);
				const [
					materialLotsResult,
					discoveriesResult,
					projectsResult,
					researchResult,
				] = await Promise.all([
					supabase
						.from("material_lots" as never)
						.select("*")
						.eq("owner_scope", "character")
						.eq("owner_character_id", characterId),
					supabase
						.from("material_lot_discoveries" as never)
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("craft_projects_m3" as never)
						.select("*")
						.eq("character_id", characterId),
					supabase
						.from("craft_formula_research" as never)
						.select("*")
						.eq("character_id", characterId),
				]);
				for (const result of [
					materialLotsResult,
					discoveriesResult,
					projectsResult,
					researchResult,
				]) {
					if (result.error) throw new Error(result.error.message);
				}
				const materialLots = (materialLotsResult.data ??
					[]) as unknown as Array<{
					id: string;
					material_definition_id: string;
				}>;
				const definitionIds = [
					...new Set(materialLots.map((lot) => lot.material_definition_id)),
				];
				const lotIds = materialLots.map((lot) => lot.id);
				const [definitionsResult, reservationsResult] = await Promise.all([
					definitionIds.length > 0
						? supabase
								.from("material_definitions" as never)
								.select("*")
								.in("id", definitionIds)
						: Promise.resolve({ data: [], error: null }),
					lotIds.length > 0
						? supabase
								.from("material_lot_reservations" as never)
								.select("*")
								.in("lot_id", lotIds)
						: Promise.resolve({ data: [], error: null }),
				]);
				if (definitionsResult.error)
					throw new Error(definitionsResult.error.message);
				if (reservationsResult.error)
					throw new Error(reservationsResult.error.message);
				// The export format explicitly carries canonical IDs alongside
				// the legacy name fields so importers (this app or external tools)
				// can hydrate via canonical compendium even after renames. It
				// carries the full set of character-owned tables: techniques,
				// rune/sigil inscriptions, regents, shadow soldiers/army, active
				// spells, extras, monarch/regent unlocks, feature choices, journal,
				// backups, and (v2.5) vehicles, tattoos, the
				// sheet-state singleton, and per-level spell slots — remapping
				// equipment row IDs through the import so attached runes and sigils
				// survive re-import. Backups and sheet state are re-stamped with the
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
					regent_resonance: regentResonanceResult.data ?? null,
					active_sovereign: activeSovereignResult.data ?? null,
					pending_regent_grants: pendingRegentGrantsResult.data || [],
					feature_choices: featureChoicesResult.data || [],
					journal: journalResult.data || [],
					backups: backupsResult.data || [],
					// v2.5 additions (see Promise.all above).
					vehicles: vehiclesResult.data || [],
					material_state: {
						version: 1,
						definitions: definitionsResult.data ?? [],
						lots: materialLotsResult.data ?? [],
						discoveries: discoveriesResult.data ?? [],
						projects: projectsResult.data ?? [],
						research: researchResult.data ?? [],
						reservations: reservationsResult.data ?? [],
					},
					tattoos: tattoosResult.data || [],
					sheet_state: sheetStateResult.data?.[0] ?? null,
					spell_slots: spellSlotsResult.data || [],
					exported_at: new Date().toISOString(),
					exported_by: user?.id || "anonymous",
					version: EXPORT_VERSION,
				};

				downloadExportEnvelope(exportData, character.name);

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
			options: { shareToken?: string | null; usePrintDialog?: boolean } = {},
		) => {
			try {
				// C1: default to a true downloadable PDF file (pdf-lib). The
				// print-dialog path is retained behind `usePrintDialog` for
				// users who want the full styled sheet via the browser.
				if (options.usePrintDialog) {
					const { exportCharacterPDF } = await import("@/lib/export");
					exportCharacterPDF(characterId, options);
					toast({
						title: "Print dialog opened",
						description:
							"Use your browser's print dialog → 'Save as PDF' to export.",
					});
					return true;
				}
				const { downloadCharacterPdfFile } = await import("@/lib/export");
				await downloadCharacterPdfFile(characterId);
				toast({
					title: "PDF exported",
					description: "Your character sheet PDF has been downloaded.",
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
				const text = await file.text();
				const data = JSON.parse(text);

				// Validate structure
				if (!data.character?.name) {
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

				const { character: charData } = data;

				// Guest import: recreate the character in the per-browser store.
				if (!user) {
					const guestInsert = await buildImportedCharacterInsert(
						charData as Record<string, unknown>,
						"guest",
					);
					const { user_id: _guestOwner, ...localInsert } =
						guestInsert as CharacterInsert;
					const created = createLocalCharacter(localInsert);
					await importRelatedLocalRows(
						data as Record<string, unknown>,
						created.id,
					);
					toast({
						title: "Import Successful",
						description: `${charData.name} has been imported successfully`,
					});
					return created;
				}

				if (!isSupabaseConfigured) {
					throw new Error("Backend not configured");
				}

				// Create new character from import
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
				const importResult = await importRelatedCharacterRows(
					data as Record<string, unknown>,
					createdCharacter.id,
					user.id,
				);

				toast({
					title: "Import Successful",
					description: [
						`${charData.name} has been imported successfully`,
						...(importResult.pendingSovereign
							? [
									"The Sovereign is pending until its complete definition and both Regent unlocks are verified.",
								]
							: []),
						...(importResult.pendingCraftState
							? [
									"Craft project and research history needs same-owner verification; imported material lots remain available.",
								]
							: []),
					].join(" "),
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
	const { importCharacterJson } = useCharacterExport();

	return {
		importCharacterJson,
	};
}
