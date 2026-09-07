import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AlertTriangle,
	Check,
	Crown,
	LoaderCircle,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { StaticCompendiumEntry } from "@/data/compendium/providers";
import { regents } from "@/data/compendium/regents";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { supabase } from "@/integrations/supabase/client";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import { isLocalCharacterId } from "@/lib/guestStore";
import { resolveCanonicalRegentId } from "@/lib/regentIdentity";
import {
	type CanonicalPickEntry,
	persistRegentPowers,
	persistRegentSpells,
	persistRegentTechniques,
	type RegentPickPersistenceResult,
} from "@/lib/regentPickPersistence";
import { regentToChoiceSource } from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";
import { cn } from "@/lib/utils";
import { formatRegentVernacular, REGENT_LABEL } from "@/lib/vernacular";

export type CatchUpBucketKey = "powers" | "techniques" | "cantrips" | "spells";

export interface KnownCatchUpAbility {
	canonicalId: string | null;
	name: string | null;
	source: string | null;
}

export interface KnownTechniqueRow {
	technique_id: string;
	source: string | null;
}

export interface KnownTechniqueResolution {
	abilities: KnownCatchUpAbility[];
	unresolvedIds: string[];
}

/**
 * Resolve known technique IDs only through exact catalog IDs or explicit
 * aliases. Alias rows retain their stored ID so they are excluded by canonical
 * name fallback, but never counted as exact same-source catch-up fulfillment.
 */
export function resolveKnownTechniqueAbilities(
	rows: readonly KnownTechniqueRow[],
	catalog: readonly StaticCompendiumEntry[],
): KnownTechniqueResolution {
	const exactById = new Map<string, StaticCompendiumEntry>();
	const aliasById = new Map<string, StaticCompendiumEntry | null>();
	for (const entry of catalog) {
		if (entry.id.trim()) exactById.set(entry.id, entry);
		for (const alias of entry.aliases ?? []) {
			if (!alias.trim()) continue;
			if (!aliasById.has(alias)) {
				aliasById.set(alias, entry);
			} else if (aliasById.get(alias)?.id !== entry.id) {
				aliasById.set(alias, null);
			}
		}
	}

	const abilities: KnownCatchUpAbility[] = [];
	const unresolvedIds = new Set<string>();
	for (const row of rows) {
		const entry =
			exactById.get(row.technique_id) ?? aliasById.get(row.technique_id);
		if (!entry) {
			unresolvedIds.add(row.technique_id);
			continue;
		}
		abilities.push({
			canonicalId: row.technique_id,
			name: entry.name,
			source: row.source,
		});
	}

	return {
		abilities,
		unresolvedIds: Array.from(unresolvedIds).sort(),
	};
}

export interface CatchUpOptionClassification<T> {
	available: T[];
	completedSameSource: T[];
	excludedExisting: T[];
}

export interface CatchUpBucketReadiness {
	owed: number;
	completedSameSource: number;
	requiredSelections: number;
	available: number;
	selected: number;
	hasCatalogDeficit: boolean;
	hasExcessPersisted: boolean;
	isReady: boolean;
}

function normalizeAbilityName(value: string | null | undefined): string {
	return (value ?? "").trim().toLocaleLowerCase();
}

/**
 * Exclude already-known options by exact canonical ID first, then normalized
 * name fallback. Only an exact ID written by this catch-up source can satisfy
 * owed picks on a retry; every other match is merely unavailable.
 */
export function classifyCatchUpOptions<T extends { id: string; name: string }>(
	options: readonly T[],
	known: readonly KnownCatchUpAbility[],
	catchUpSource: string,
): CatchUpOptionClassification<T> {
	const available: T[] = [];
	const completedSameSource: T[] = [];
	const excludedExisting: T[] = [];

	for (const option of options) {
		const idMatches = known.filter(
			(candidate) => candidate.canonicalId === option.id,
		);
		if (idMatches.length > 0) {
			if (idMatches.every((candidate) => candidate.source === catchUpSource)) {
				completedSameSource.push(option);
			} else {
				excludedExisting.push(option);
			}
			continue;
		}

		const optionName = normalizeAbilityName(option.name);
		const nameMatch = known.find(
			(candidate) => normalizeAbilityName(candidate.name) === optionName,
		);
		if (nameMatch) {
			excludedExisting.push(option);
			continue;
		}

		available.push(option);
	}

	return { available, completedSameSource, excludedExisting };
}

/** Exact-count readiness. Catalog shortages never reduce the amount owed. */
export function getCatchUpBucketReadiness(input: {
	owed: number;
	completedSameSource: number;
	available: number;
	selected: number;
}): CatchUpBucketReadiness {
	const owed = Math.max(0, input.owed);
	const completedSameSource = Math.max(0, input.completedSameSource);
	const requiredSelections = Math.max(0, owed - completedSameSource);
	const hasExcessPersisted = completedSameSource > owed;
	const hasCatalogDeficit = input.available < requiredSelections;
	return {
		owed,
		completedSameSource,
		requiredSelections,
		available: input.available,
		selected: input.selected,
		hasCatalogDeficit,
		hasExcessPersisted,
		isReady:
			!hasExcessPersisted &&
			!hasCatalogDeficit &&
			input.selected === requiredSelections,
	};
}

interface RegentCatchUpModalProps {
	characterId: string;
	regentId: string;
	unlockId: string;
	campaignId?: string;
	open: boolean;
	onComplete: () => void;
}

type SelectionState = Record<CatchUpBucketKey, Set<string>>;

type KnownAbilityBuckets = Record<CatchUpBucketKey, KnownCatchUpAbility[]>;

interface KnownAbilityQueryResult {
	known: KnownAbilityBuckets;
	unresolvedTechniqueIds: string[];
}

interface CatchUpBucket {
	key: CatchUpBucketKey;
	label: string;
	owed: number;
	options: CanonicalPickEntry[];
	available: CanonicalPickEntry[];
	completedSameSource: CanonicalPickEntry[];
	excludedExisting: CanonicalPickEntry[];
	selectedOptions: CanonicalPickEntry[];
	readiness: CatchUpBucketReadiness;
}

const createEmptySelections = (): SelectionState => ({
	powers: new Set(),
	techniques: new Set(),
	cantrips: new Set(),
	spells: new Set(),
});

const EMPTY_KNOWN: KnownAbilityBuckets = {
	powers: [],
	techniques: [],
	cantrips: [],
	spells: [],
};

const EMPTY_KNOWN_RESULT: KnownAbilityQueryResult = {
	known: EMPTY_KNOWN,
	unresolvedTechniqueIds: [],
};

function toCastablePick(entry: CanonicalCastableEntry): CanonicalPickEntry {
	return {
		id: entry.id,
		name: entry.name,
		power_level: entry.power_level,
		atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
		casting_time: entry.casting_time,
		range: entry.range,
		duration: entry.duration,
		concentration: entry.concentration,
		ritual: entry.ritual,
		description: entry.description,
		higher_levels: entry.higher_levels,
	};
}

function toTechniquePick(entry: StaticCompendiumEntry): CanonicalPickEntry {
	return {
		id: entry.id,
		name: entry.name,
		level_requirement: entry.level_requirement ?? entry.level ?? null,
		atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
		description: entry.description,
	};
}

function validatePersistenceResult(
	result: RegentPickPersistenceResult,
	expected: number,
	label: string,
): void {
	if (
		result.requested !== expected ||
		result.verified !== expected ||
		result.inserted + result.existingSameSource !== expected
	) {
		throw new Error(
			`${label} catch-up persisted ${result.verified} of ${expected} exact canonical picks.`,
		);
	}
}

export function RegentCatchUpModal({
	characterId,
	regentId,
	unlockId,
	campaignId,
	open,
	onComplete,
}: RegentCatchUpModalProps) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const {
		data: character,
		isLoading: characterLoading,
		isError: characterFailed,
		error: characterError,
		isFetched: characterFetched,
	} = useCharacter(characterId);
	const [selected, setSelected] = useState<SelectionState>(
		createEmptySelections,
	);
	const [saving, setSaving] = useState(false);

	const canonicalRegentId = useMemo(
		() => resolveCanonicalRegentId(regentId),
		[regentId],
	);
	const regent = useMemo<Regent | null>(() => {
		if (!canonicalRegentId) return null;
		return (
			(regents as Regent[]).find(
				(candidate) => candidate.id === canonicalRegentId,
			) ?? null
		);
	}, [canonicalRegentId]);
	const remoteCharacter =
		characterId.length > 0 && !isLocalCharacterId(characterId);
	const level =
		character && Number.isInteger(character.level) ? character.level : null;
	const validLevel = level !== null && level >= 1 && level <= 20;
	const regentName = regent?.name ?? "";
	const catchUpSource = regent ? `${regent.name} Attunement (Catch-Up)` : "";

	const owed = useMemo(() => {
		if (!regent || !validLevel || level === null) {
			return { powers: 0, techniques: 0, cantrips: 0, spells: 0 };
		}
		const totals = calculateTotalChoices(
			null,
			null,
			[regentToChoiceSource(regent)],
			level,
		);
		return {
			powers: totals.powers ?? 0,
			techniques: totals.techniques ?? 0,
			cantrips: totals.cantrips ?? 0,
			spells: totals.spells ?? 0,
		};
	}, [level, regent, validLevel]);

	const baseQueryEnabled =
		open && remoteCharacter && !!regent && validLevel && !!regentName;

	const powerQuery = useQuery<CanonicalCastableEntry[]>({
		queryKey: ["regent-catchup-powers", canonicalRegentId, level, campaignId],
		queryFn: () =>
			listLearnablePowers({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
			}),
		enabled: baseQueryEnabled && owed.powers > 0,
	});

	const techniqueQuery = useQuery<StaticCompendiumEntry[]>({
		queryKey: [
			"regent-catchup-techniques",
			canonicalRegentId,
			level,
			campaignId,
		],
		queryFn: () =>
			listLearnableTechniques({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
				maxLevel: level,
			}),
		enabled: baseQueryEnabled && owed.techniques > 0,
	});

	const spellQuery = useQuery<CanonicalCastableEntry[]>({
		queryKey: ["regent-catchup-spells", canonicalRegentId, level, campaignId],
		queryFn: () =>
			listLearnableSpells({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
			}),
		enabled: baseQueryEnabled && (owed.cantrips > 0 || owed.spells > 0),
	});

	const knownQuery = useQuery<KnownAbilityQueryResult>({
		queryKey: [
			"regent-catchup-known",
			characterId,
			unlockId,
			campaignId,
			owed.techniques > 0,
		],
		queryFn: async () => {
			if (!remoteCharacter) return EMPTY_KNOWN_RESULT;
			const techniqueCatalogPromise: Promise<StaticCompendiumEntry[]> =
				owed.techniques > 0
					? listCanonicalEntries("techniques", undefined, { campaignId })
					: Promise.resolve([]);
			const [powerResult, techniqueResult, spellResult, techniqueCatalog] =
				await Promise.all([
					supabase
						.from("character_powers")
						.select("power_id, name, source")
						.eq("character_id", characterId),
					supabase
						.from("character_techniques")
						.select("technique_id, source")
						.eq("character_id", characterId),
					supabase
						.from("character_spells")
						.select("spell_id, name, source, spell_level")
						.eq("character_id", characterId),
					techniqueCatalogPromise,
				]);
			if (powerResult.error) throw powerResult.error;
			if (techniqueResult.error) throw techniqueResult.error;
			if (spellResult.error) throw spellResult.error;

			const techniqueResolution =
				owed.techniques > 0
					? resolveKnownTechniqueAbilities(
							techniqueResult.data ?? [],
							techniqueCatalog,
						)
					: { abilities: [], unresolvedIds: [] };

			return {
				known: {
					powers: (powerResult.data ?? []).map((row) => ({
						canonicalId: row.power_id,
						name: row.name,
						source: row.source,
					})),
					techniques: techniqueResolution.abilities,
					cantrips: (spellResult.data ?? [])
						.filter((row) => row.spell_level === 0)
						.map((row) => ({
							canonicalId: row.spell_id,
							name: row.name,
							source: row.source,
						})),
					spells: (spellResult.data ?? [])
						.filter((row) => row.spell_level > 0)
						.map((row) => ({
							canonicalId: row.spell_id,
							name: row.name,
							source: row.source,
						})),
				},
				unresolvedTechniqueIds: techniqueResolution.unresolvedIds,
			};
		},
		enabled: baseQueryEnabled,
	});

	const selectionResetKey = [
		characterId,
		unlockId,
		canonicalRegentId ?? regentId,
		level ?? "loading",
		open ? "open" : "closed",
	].join(":");
	useEffect(() => {
		if (selectionResetKey) setSelected(createEmptySelections());
	}, [selectionResetKey]);

	const powerOptions = useMemo(
		() => (powerQuery.data ?? []).map(toCastablePick),
		[powerQuery.data],
	);
	const techniqueOptions = useMemo(
		() => (techniqueQuery.data ?? []).map(toTechniquePick),
		[techniqueQuery.data],
	);
	const allSpellOptions = useMemo(
		() => (spellQuery.data ?? []).map(toCastablePick),
		[spellQuery.data],
	);
	const cantripOptions = useMemo(
		() => allSpellOptions.filter((spell) => spell.power_level === 0),
		[allSpellOptions],
	);
	const leveledSpellOptions = useMemo(
		() => allSpellOptions.filter((spell) => (spell.power_level ?? 0) > 0),
		[allSpellOptions],
	);

	const knownResult = knownQuery.data ?? EMPTY_KNOWN_RESULT;
	const known = knownResult.known;
	const unresolvedTechniqueIds = knownResult.unresolvedTechniqueIds;
	const buckets = useMemo<CatchUpBucket[]>(() => {
		const definitions: Array<{
			key: CatchUpBucketKey;
			label: string;
			owed: number;
			options: CanonicalPickEntry[];
		}> = [
			{
				key: "powers",
				label: "Powers",
				owed: owed.powers,
				options: powerOptions,
			},
			{
				key: "techniques",
				label: "Techniques",
				owed: owed.techniques,
				options: techniqueOptions,
			},
			{
				key: "cantrips",
				label: "Cantrips",
				owed: owed.cantrips,
				options: cantripOptions,
			},
			{
				key: "spells",
				label: "Spells",
				owed: owed.spells,
				options: leveledSpellOptions,
			},
		];

		return definitions
			.filter((definition) => definition.owed > 0)
			.map((definition) => {
				const classification = classifyCatchUpOptions(
					definition.options,
					known[definition.key],
					catchUpSource,
				);
				const selectedOptions = classification.available.filter((option) =>
					selected[definition.key].has(option.id),
				);
				return {
					...definition,
					...classification,
					selectedOptions,
					readiness: getCatchUpBucketReadiness({
						owed: definition.owed,
						completedSameSource: classification.completedSameSource.length,
						available: classification.available.length,
						selected: selectedOptions.length,
					}),
				};
			});
	}, [
		cantripOptions,
		catchUpSource,
		known,
		leveledSpellOptions,
		owed,
		powerOptions,
		selected,
		techniqueOptions,
	]);

	const optionLoading =
		(owed.powers > 0 && powerQuery.isLoading) ||
		(owed.techniques > 0 && techniqueQuery.isLoading) ||
		((owed.cantrips > 0 || owed.spells > 0) && spellQuery.isLoading);
	const queryLoading =
		characterLoading || optionLoading || knownQuery.isLoading;
	const optionError =
		powerQuery.error ?? techniqueQuery.error ?? spellQuery.error;
	const queryError = characterError ?? optionError ?? knownQuery.error;
	const catalogBlockers = buckets.filter(
		(bucket) =>
			bucket.readiness.hasCatalogDeficit || bucket.readiness.hasExcessPersisted,
	);
	const allReady =
		baseQueryEnabled &&
		!queryLoading &&
		!queryError &&
		unresolvedTechniqueIds.length === 0 &&
		buckets.every((bucket) => bucket.readiness.isReady);

	const toggle = (bucket: CatchUpBucket, id: string) => {
		setSelected((previous) => {
			const next = new Set(previous[bucket.key]);
			if (next.has(id)) {
				next.delete(id);
			} else if (next.size < bucket.readiness.requiredSelections) {
				next.add(id);
			}
			return { ...previous, [bucket.key]: next };
		});
	};

	const finish = async () => {
		if (
			!allReady ||
			!remoteCharacter ||
			!canonicalRegentId ||
			!regent ||
			!character ||
			!validLevel ||
			level === null
		) {
			return;
		}

		try {
			setSaving(true);
			const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
			const fulfilled = (key: CatchUpBucketKey): CanonicalPickEntry[] => {
				const bucket = byKey.get(key);
				if (!bucket) return [];
				const entries = [
					...bucket.completedSameSource,
					...bucket.selectedOptions,
				];
				if (entries.length !== bucket.owed) {
					throw new Error(
						`${bucket.label} requires exactly ${bucket.owed} catch-up picks.`,
					);
				}
				return entries;
			};

			const powers = fulfilled("powers");
			const techniques = fulfilled("techniques");
			const cantrips = fulfilled("cantrips");
			const spells = fulfilled("spells");
			const persistenceOptions = { campaignId };
			const [powerResult, techniqueResult, cantripResult, spellResult] =
				await Promise.all([
					persistRegentPowers(
						characterId,
						powers,
						catchUpSource,
						persistenceOptions,
					),
					persistRegentTechniques(
						characterId,
						techniques,
						catchUpSource,
						persistenceOptions,
					),
					persistRegentSpells(
						characterId,
						cantrips,
						catchUpSource,
						persistenceOptions,
					),
					persistRegentSpells(
						characterId,
						spells,
						catchUpSource,
						persistenceOptions,
					),
				]);

			validatePersistenceResult(powerResult, powers.length, "Power");
			validatePersistenceResult(
				techniqueResult,
				techniques.length,
				"Technique",
			);
			validatePersistenceResult(cantripResult, cantrips.length, "Cantrip");
			validatePersistenceResult(spellResult, spells.length, "Spell");

			const { data: completedLevel, error: completionError } =
				await supabase.rpc("complete_regent_catch_up", {
					p_unlock_id: unlockId,
				});
			if (completionError) throw completionError;
			if (completedLevel !== level) {
				throw new Error(
					`Catch-up was prepared for level ${level}, but the server confirmed level ${String(completedLevel)}. Reload before continuing.`,
				);
			}

			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["regent-unlocks", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["regent-catchup-known", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["powers", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-techniques", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-spells", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-features", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["features", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character", characterId],
				}),
			]);
			toast({
				title: `${REGENT_LABEL} Attuned`,
				description: "Your accumulated regent abilities have manifested.",
			});
			onComplete();
		} catch (error) {
			toast({
				title: "Catch-Up Failed",
				description:
					error instanceof Error
						? error.message
						: "Could not grant regent picks.",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	let blocker: React.ReactNode = null;
	if (!remoteCharacter) {
		blocker = <p>Regent catch-up is unavailable for local characters.</p>;
	} else if (!canonicalRegentId || !regent) {
		blocker = (
			<p>
				This unlock has no actionable canonical Regent identity. Task 19
				reconciliation must resolve it before the Task 9 identity catalog can
				provide abilities.
			</p>
		);
	} else if (characterFailed || queryError) {
		blocker = (
			<p>
				{queryError instanceof Error
					? queryError.message
					: "The character or ability catalog query failed."}
			</p>
		);
	} else if (characterFetched && !character) {
		blocker = <p>The character could not be loaded for catch-up.</p>;
	} else if (character && !validLevel) {
		blocker = <p>The character level must be between 1 and 20.</p>;
	} else if (owed.techniques > 0 && unresolvedTechniqueIds.length > 0) {
		blocker = (
			<div className="space-y-2">
				<p>
					Catch-up is blocked because the Task 9 identity catalog cannot safely
					resolve known technique IDs. Reconcile these identities before
					choosing techniques.
				</p>
				<ul className="list-disc pl-5">
					{unresolvedTechniqueIds.map((techniqueId) => (
						<li key={techniqueId}>
							<code>{techniqueId || "(missing technique ID)"}</code>
						</li>
					))}
				</ul>
			</div>
		);
	} else if (catalogBlockers.length > 0) {
		blocker = (
			<div className="space-y-2">
				<p>
					Catch-up is blocked by the Task 9 identity catalog. The full owed
					count cannot be reduced to fit a short catalog.
				</p>
				<ul className="list-disc pl-5">
					{catalogBlockers.map((bucket) => (
						<li key={bucket.key}>
							{bucket.label}: {bucket.readiness.requiredSelections} selections
							required, {bucket.readiness.available} eligible options available
							{bucket.readiness.hasExcessPersisted
								? `; ${bucket.readiness.completedSameSource} same-source rows already exceed the owed ${bucket.owed}`
								: ""}
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<Dialog open={open} onOpenChange={() => undefined}>
			<DialogContent
				className="bg-card border-regent-gold/40 max-w-2xl max-h-[85vh] overflow-y-auto"
				onInteractOutside={(event) => event.preventDefault()}
				onEscapeKeyDown={(event) => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="font-display text-xl gradient-text-regent flex items-center gap-2">
						<Crown className="h-5 w-5" />
						{formatRegentVernacular(
							regent?.title || regentName || REGENT_LABEL,
						)}{" "}
						— Attunement
					</DialogTitle>
					<p className="text-sm text-muted-foreground mt-2">
						Your bond with this {REGENT_LABEL} awakens all its accumulated power
						at once. Catch-up completes only after every exact pick is persisted
						and verified at the server-confirmed character level.
					</p>
				</DialogHeader>

				{queryLoading && !blocker ? (
					<div className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-muted-foreground">
						<LoaderCircle className="h-5 w-5 animate-spin" />
						Loading character, known abilities, and canonical options...
					</div>
				) : blocker ? (
					<div className="flex items-start gap-3 rounded-lg border border-regent-gold/40 bg-regent-gold/5 p-4 text-sm text-muted-foreground">
						<AlertTriangle className="h-5 w-5 text-regent-gold shrink-0" />
						<div>{blocker}</div>
					</div>
				) : (
					<div className="space-y-5 pt-2">
						{buckets.length === 0 && (
							<div className="rounded-lg border border-regent-gold/30 bg-regent-gold/5 p-4 text-sm text-muted-foreground">
								This Regent has no structured picks owed at level {level}. The
								server can safely record catch-up after you confirm below.
							</div>
						)}

						{buckets.map((bucket) => {
							const chosen = bucket.selectedOptions.length;
							return (
								<div key={bucket.key} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-heading text-regent-gold flex items-center gap-2">
											<Sparkles className="h-4 w-4" />
											{bucket.label}
										</span>
										<span className="text-xs text-muted-foreground">
											{chosen} / {bucket.readiness.requiredSelections} chosen
											{bucket.readiness.completedSameSource > 0
												? ` (${bucket.readiness.completedSameSource} verified from a prior attempt)`
												: ""}
										</span>
									</div>

									{bucket.excludedExisting.length > 0 && (
										<p className="text-[11px] text-muted-foreground">
											{bucket.excludedExisting.length} already-known option(s)
											were excluded by canonical ID or name.
										</p>
									)}

									<div className="grid grid-cols-1 gap-2">
										{bucket.available.map((option) => {
											const isSelected = selected[bucket.key].has(option.id);
											const tier =
												option.power_level ?? option.level_requirement ?? null;
											return (
												<button
													type="button"
													key={option.id}
													onClick={() => toggle(bucket, option.id)}
													disabled={
														!isSelected &&
														chosen >= bucket.readiness.requiredSelections
													}
													className={cn(
														"w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3",
														isSelected
															? "border-regent-gold bg-regent-gold/10"
															: "border-border hover:border-regent-gold/50 bg-background/50 disabled:opacity-40 disabled:hover:border-border",
													)}
												>
													<div className="min-w-0">
														<div className="font-heading text-sm truncate">
															{option.name}
														</div>
														{tier !== null && tier > 0 && (
															<div className="text-[11px] text-muted-foreground">
																Level {tier}
															</div>
														)}
													</div>
													{isSelected && (
														<Check className="h-4 w-4 text-regent-gold shrink-0" />
													)}
												</button>
											);
										})}
									</div>
								</div>
							);
						})}

						<Button
							className="w-full font-display tracking-wider bg-regent-gold hover:bg-regent-gold/80 text-background"
							onClick={finish}
							disabled={!allReady || saving}
						>
							{saving
								? "MANIFESTING..."
								: buckets.length === 0
									? "COMPLETE ATTUNEMENT"
									: "MANIFEST REGENT POWER"}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
