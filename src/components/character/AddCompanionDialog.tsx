/**
 * AddCompanionDialog — DDB-style catalog picker for the Companions/Extras
 * section. Instead of typing a generic name + stats, the user picks a real
 * entry from three canonical sources and its stats auto-populate:
 *   • Statblocks — anomaly/monster bestiary (HP/AC/speed snapshot)
 *   • Mounts     — vehicle catalog mounts (HP/AC/speed snapshot)
 *   • Allies     — recruitable guild NPCs (via useAddGuildAllyCompanion)
 * A "Custom" free-form entry remains available in the panel for homebrew.
 */

import { useQuery } from "@tanstack/react-query";
import { Loader2, PawPrint, Search, Skull, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sandboxRecruitableNPCs } from "@/data/compendium/sandbox-npcs";
import {
	useAddGuildAllyCompanion,
	useCharacterExtras,
} from "@/hooks/useCharacterExtras";
import type { Json } from "@/integrations/supabase/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import {
	abilitiesFromCanonicalSource,
	createCanonicalCompanionSource,
} from "@/lib/companions";
import { formatRegentVernacular } from "@/lib/vernacular";
import { AddDialogDetailPanel, type DetailStat } from "./AddDialogDetailPanel";

type PickerSource = "statblock" | "mount" | "ally";

interface AddCompanionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}

/** Narrowers for the wide StaticCompendiumEntry bag. */
const num = (value: unknown): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

const text = (value: unknown): string | null =>
	typeof value === "string" && value.length > 0 ? value : null;

const vehicleLandSpeed = (entry: unknown): number | null => {
	if (!entry || typeof entry !== "object") return null;
	const speed = (entry as { speed?: unknown }).speed;
	if (num(speed) !== null) return num(speed);
	if (!speed || typeof speed !== "object") return null;
	return num((speed as { land?: unknown }).land);
};

export function AddCompanionDialog({
	open,
	onOpenChange,
	characterId,
}: AddCompanionDialogProps) {
	const [source, setSource] = useState<PickerSource>("statblock");
	const [searchQuery, setSearchQuery] = useState("");
	const [addingKey, setAddingKey] = useState<string | null>(null);
	const { addExtra } = useCharacterExtras(characterId);
	const addGuildAlly = useAddGuildAllyCompanion();

	const { data: statblocks = [], isLoading: statblocksLoading } = useQuery({
		queryKey: ["companion-statblocks", searchQuery],
		queryFn: () => listCanonicalEntries("anomalies", searchQuery || undefined),
		enabled: open && source === "statblock",
	});

	const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
		queryKey: ["companion-mounts", searchQuery],
		queryFn: () => listCanonicalEntries("vehicles", searchQuery || undefined),
		enabled: open && source === "mount",
	});

	const mounts = useMemo(
		() =>
			vehicles
				.filter(
					(v) =>
						(v as { vehicle_type?: string }).vehicle_type === "mount" ||
						!(v as { vehicle_type?: string }).vehicle_type,
				)
				.slice(0, 60),
		[vehicles],
	);

	const allies = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return sandboxRecruitableNPCs
			.filter((npc) => !q || npc.name.toLowerCase().includes(q))
			.slice(0, 60);
	}, [searchQuery]);

	const close = () => {
		onOpenChange(false);
		setSearchQuery("");
	};

	const runAdd = async (key: string, add: () => Promise<void>) => {
		if (addingKey !== null || addGuildAlly.isPending) return;
		setAddingKey(key);
		try {
			await add();
			close();
		} finally {
			setAddingKey(null);
		}
	};

	const addStatblock = async (entry: (typeof statblocks)[number]) => {
		const hp =
			num((entry as { hit_points_average?: unknown }).hit_points_average) ?? 1;
		const ac = num((entry as { armor_class?: unknown }).armor_class) ?? 10;
		const speed = num((entry as { speed_walk?: unknown }).speed_walk) ?? 30;
		const rank = text((entry as { gate_rank?: unknown }).gate_rank);
		const sourceSnapshot = createCanonicalCompanionSource({
			canonicalId: entry.id,
			canonicalType: "anomaly",
			canonicalCollection: "anomalies",
			entryType: text((entry as { creature_type?: unknown }).creature_type),
			source: text((entry as { source?: unknown }).source),
			sourceBook: text((entry as { source_book?: unknown }).source_book),
			name: entry.name,
			hpMax: hp,
			baseAc: ac,
			speed,
			rank,
		});
		const abilities = [
			...abilitiesFromCanonicalSource(
				(entry as { Anomaly_traits?: unknown }).Anomaly_traits,
				"trait",
			),
			...abilitiesFromCanonicalSource(
				(entry as { Anomaly_actions?: unknown }).Anomaly_actions,
				"action",
			),
		];

		await addExtra({
			character_id: characterId,
			name: entry.name,
			extra_type: "companion",
			hp_current: hp,
			hp_max: hp,
			ac,
			speed,
			// Static canonical IDs are slugs, while monster_id is a UUID FK.
			monster_id: null,
			npc_data: sourceSnapshot as unknown as Json,
			abilities: abilities as unknown as Json,
			equipment: [] as unknown as Json,
			conditions: [] as unknown as Json,
			initiative: null,
			notes: rank ? `Statblock · Rank ${rank}` : "Statblock",
			is_active: false,
		});
	};

	const addMount = async (entry: (typeof mounts)[number]) => {
		const hp =
			num((entry as { hit_points?: { max?: unknown } }).hit_points?.max) ?? 1;
		const ac = num((entry as { armor_class?: unknown }).armor_class) ?? 10;
		const speed = vehicleLandSpeed(entry) ?? 30;
		const rank = text((entry as { rank?: unknown }).rank);
		const sourceSnapshot = createCanonicalCompanionSource({
			canonicalId: entry.id,
			canonicalType: "vehicle",
			canonicalCollection: "vehicles",
			entryType: text((entry as { vehicle_type?: unknown }).vehicle_type),
			source: text((entry as { source?: unknown }).source),
			sourceBook: text((entry as { source_book?: unknown }).source_book),
			name: entry.name,
			hpMax: hp,
			baseAc: ac,
			speed,
			rank,
		});
		const abilities = abilitiesFromCanonicalSource(
			(entry as { abilities?: unknown }).abilities,
			"action",
		);

		await addExtra({
			character_id: characterId,
			name: entry.name,
			extra_type: "mount",
			hp_current: hp,
			hp_max: hp,
			ac,
			speed,
			monster_id: null,
			npc_data: sourceSnapshot as unknown as Json,
			abilities: abilities as unknown as Json,
			equipment: [] as unknown as Json,
			conditions: [] as unknown as Json,
			initiative: null,
			notes: rank ? `Mount · Rank ${rank}` : "Mount",
			is_active: false,
		});
	};

	const addAlly = async (npc: (typeof allies)[number]) => {
		await addGuildAlly.mutateAsync({ characterId, npc });
	};

	const rows: {
		key: string;
		title: string;
		badges: string[];
		detail: {
			stats: DetailStat[];
			properties?: string[];
			description?: string | null;
			tags?: string[] | null;
			sourceBook?: string | null;
		};
		onAdd: () => Promise<void>;
	}[] =
		source === "statblock"
			? statblocks.map((entry) => ({
					key: entry.id,
					title: entry.name,
					badges: [
						(entry as { gate_rank?: string | null }).gate_rank
							? `Rank ${(entry as { gate_rank?: string }).gate_rank}`
							: "",
						num((entry as { hit_points_average?: unknown }).hit_points_average)
							? `HP ${num((entry as { hit_points_average?: unknown }).hit_points_average)}`
							: "",
						num((entry as { armor_class?: unknown }).armor_class)
							? `AC ${num((entry as { armor_class?: unknown }).armor_class)}`
							: "",
					].filter(Boolean),
					detail: {
						stats: [
							{
								label: "Rank",
								value: (entry as { gate_rank?: string | null }).gate_rank,
							},
							{
								label: "CR",
								value: (entry as { cr?: string | null }).cr,
							},
							{
								label: "Size",
								value: (entry as { size?: string | null }).size,
							},
							{
								label: "HP",
								value: num(
									(entry as { hit_points_average?: unknown })
										.hit_points_average,
								),
							},
							{
								label: "AC",
								value: num((entry as { armor_class?: unknown }).armor_class),
							},
							{
								label: "Speed",
								value: num((entry as { speed_walk?: unknown }).speed_walk)
									? `${num((entry as { speed_walk?: unknown }).speed_walk)} ft`
									: null,
							},
						],
						description: (entry as { description?: string | null }).description,
						tags: (entry as { tags?: string[] | null }).tags,
						sourceBook: (entry as { source_book?: string | null }).source_book,
					},
					onAdd: () => runAdd(entry.id, () => addStatblock(entry)),
				}))
			: source === "mount"
				? mounts.map((entry) => ({
						key: entry.id,
						title: entry.name,
						badges: [
							(entry as { rank?: string | null }).rank
								? `Rank ${(entry as { rank?: string }).rank}`
								: "",
							num((entry as { hit_points?: { max?: unknown } }).hit_points?.max)
								? `HP ${num((entry as { hit_points?: { max?: unknown } }).hit_points?.max)}`
								: "",
							num((entry as { armor_class?: unknown }).armor_class)
								? `AC ${num((entry as { armor_class?: unknown }).armor_class)}`
								: "",
						].filter(Boolean),
						detail: {
							stats: [
								{
									label: "Type",
									value: (entry as { vehicle_type?: string | null })
										.vehicle_type,
								},
								{
									label: "Size",
									value: (entry as { size?: string | null }).size,
								},
								{
									label: "Rank",
									value: (entry as { rank?: string | null }).rank,
								},
								{
									label: "HP",
									value: num(
										(entry as { hit_points?: { max?: unknown } }).hit_points
											?.max,
									),
								},
								{
									label: "AC",
									value: num((entry as { armor_class?: unknown }).armor_class),
								},
								{
									label: "Speed",
									value:
										vehicleLandSpeed(entry) !== null
											? `${vehicleLandSpeed(entry)} ft`
											: null,
								},
							],
							description: (entry as { description?: string | null })
								.description,
							tags: (entry as { tags?: string[] | null }).tags,
							sourceBook: (entry as { source_book?: string | null })
								.source_book,
						},
						onAdd: () => runAdd(entry.id, () => addMount(entry)),
					}))
				: allies.map((npc) => ({
						key: npc.id,
						title: npc.name,
						badges: [`Lvl ${npc.level}`, `HP ${npc.hp}`, `AC ${npc.ac}`].filter(
							Boolean,
						),
						detail: {
							stats: [
								{ label: "Title", value: npc.title },
								{ label: "Job", value: npc.job },
								{ label: "Rank", value: npc.rank },
								{ label: "Level", value: npc.level },
								{ label: "HP", value: npc.hp },
								{ label: "AC", value: npc.ac },
								{ label: "Faction", value: npc.faction },
								{ label: "Location", value: npc.location },
								{ label: "Recruit", value: npc.recruitCondition },
							],
							properties: npc.keyAbilities,
							description: npc.description,
						},
						onAdd: () => runAdd(npc.id, () => addAlly(npc)),
					}));

	const isLoading =
		(source === "statblock" && statblocksLoading) ||
		(source === "mount" && vehiclesLoading);
	const sourceLabel =
		source === "statblock"
			? "statblocks"
			: source === "mount"
				? "mounts"
				: "allies";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1rem)] max-w-2xl flex-col overflow-hidden p-4 sm:max-h-[80vh] sm:p-6">
				<DialogHeader>
					<DialogTitle>Add Companion</DialogTitle>
					<DialogDescription>
						Pick a statblock, mount, or ally from the compendium. Canonical
						identity and source details stay attached to the saved companion.
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={source}
					onValueChange={(value) => setSource(value as PickerSource)}
					className="w-full"
				>
					<TabsList className="grid grid-cols-3">
						<TabsTrigger
							value="statblock"
							className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
						>
							<Skull className="hidden w-3.5 sm:block" aria-hidden="true" />
							Statblocks
						</TabsTrigger>
						<TabsTrigger
							value="mount"
							className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
						>
							<PawPrint className="hidden w-3.5 sm:block" aria-hidden="true" />
							Mounts
						</TabsTrigger>
						<TabsTrigger
							value="ally"
							className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
						>
							<Users className="hidden w-3.5 sm:block" aria-hidden="true" />
							Allies
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="relative">
					<label htmlFor="companion-catalog-search" className="sr-only">
						Search {sourceLabel}
					</label>
					<Search
						className="absolute left-3 top-1/2 w-4 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						id="companion-catalog-search"
						placeholder={`Search ${sourceLabel}…`}
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						className="pl-10"
					/>
				</div>

				<div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
					{isLoading ? (
						<div
							className="flex items-center justify-center py-8"
							role="status"
							aria-live="polite"
						>
							<Loader2
								className="w-6 animate-spin text-primary"
								aria-hidden="true"
							/>
							<span className="sr-only">Loading {sourceLabel}…</span>
						</div>
					) : rows.length === 0 ? (
						<div
							className="py-8 text-center text-muted-foreground"
							role="status"
						>
							No {sourceLabel} found.
						</div>
					) : (
						rows.map((row) => (
							<div
								key={row.key}
								className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
							>
								<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div className="min-w-0">
										<div className="font-heading font-semibold">
											{formatRegentVernacular(row.title)}
										</div>
										<div className="mt-1 flex flex-wrap gap-1">
											{row.badges.map((badge) => (
												<Badge
													key={badge}
													variant="outline"
													className="text-[11px]"
												>
													{badge}
												</Badge>
											))}
										</div>
									</div>
									<Button
										type="button"
										size="sm"
										onClick={() => void row.onAdd()}
										disabled={addingKey !== null || addGuildAlly.isPending}
										aria-label={`Add ${row.title}`}
										className="w-full sm:w-auto"
									>
										{addingKey === row.key ? "Adding…" : "Add"}
									</Button>
								</div>
								<AddDialogDetailPanel
									stats={row.detail.stats}
									properties={row.detail.properties}
									description={row.detail.description}
									tags={row.detail.tags}
									sourceBook={row.detail.sourceBook}
								/>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
