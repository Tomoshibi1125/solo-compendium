/**
 * AddCompanionDialog — DDB-style catalog picker for the Companions/Extras
 * section. Instead of typing a generic name + stats, the user picks a real
 * entry from three canonical sources and its stats auto-populate:
 *   • Statblocks — anomaly/monster bestiary (HP/AC/speed snapshot)
 *   • Mounts     — vehicle catalog mounts (HP/AC snapshot)
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
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
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

export function AddCompanionDialog({
	open,
	onOpenChange,
	characterId,
}: AddCompanionDialogProps) {
	const [source, setSource] = useState<PickerSource>("statblock");
	const [searchQuery, setSearchQuery] = useState("");
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

	const addStatblock = async (entry: (typeof statblocks)[number]) => {
		const hp =
			num((entry as { hit_points_average?: unknown }).hit_points_average) ?? 1;
		const ac = num((entry as { armor_class?: unknown }).armor_class) ?? 10;
		const speed = num((entry as { speed_walk?: unknown }).speed_walk) ?? 30;
		const rank = (entry as { gate_rank?: string | null }).gate_rank ?? null;
		await addExtra({
			character_id: characterId,
			name: entry.name,
			extra_type: "companion",
			hp_current: hp,
			hp_max: hp,
			ac,
			speed,
			monster_id: null,
			notes: rank ? `Statblock · Rank ${rank}` : "Statblock",
			is_active: false,
		});
		close();
	};

	const addMount = async (entry: (typeof mounts)[number]) => {
		const hp =
			num((entry as { hit_points?: { max?: number } }).hit_points?.max) ?? 1;
		const ac = num((entry as { armor_class?: unknown }).armor_class) ?? 10;
		await addExtra({
			character_id: characterId,
			name: entry.name,
			extra_type: "mount",
			hp_current: hp,
			hp_max: hp,
			ac,
			speed: 30,
			monster_id: null,
			notes: "Mount",
			is_active: false,
		});
		close();
	};

	const addAlly = async (npc: (typeof allies)[number]) => {
		await addGuildAlly.mutateAsync({ characterId, npc });
		close();
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
		onAdd: () => void;
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
					onAdd: () => addStatblock(entry),
				}))
			: source === "mount"
				? mounts.map((entry) => ({
						key: entry.id,
						title: entry.name,
						badges: [
							(entry as { rank?: string | null }).rank
								? `Rank ${(entry as { rank?: string }).rank}`
								: "",
							num((entry as { hit_points?: { max?: number } }).hit_points?.max)
								? `HP ${num((entry as { hit_points?: { max?: number } }).hit_points?.max)}`
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
										(entry as { hit_points?: { max?: number } }).hit_points
											?.max,
									),
								},
								{
									label: "AC",
									value: num((entry as { armor_class?: unknown }).armor_class),
								},
							],
							description: (entry as { description?: string | null })
								.description,
							tags: (entry as { tags?: string[] | null }).tags,
							sourceBook: (entry as { source_book?: string | null })
								.source_book,
						},
						onAdd: () => addMount(entry),
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
						onAdd: () => addAlly(npc),
					}));

	const isLoading =
		(source === "statblock" && statblocksLoading) ||
		(source === "mount" && vehiclesLoading);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Companion</DialogTitle>
					<DialogDescription>
						Pick a statblock, mount, or ally from the compendium — its stats
						fill in automatically.
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={source}
					onValueChange={(v) => setSource(v as PickerSource)}
					className="w-full"
				>
					<TabsList className="grid grid-cols-3">
						<TabsTrigger value="statblock" className="gap-2">
							<Skull className="w-3.5 h-3.5" /> Statblocks
						</TabsTrigger>
						<TabsTrigger value="mount" className="gap-2">
							<PawPrint className="w-3.5 h-3.5" /> Mounts
						</TabsTrigger>
						<TabsTrigger value="ally" className="gap-2">
							<Users className="w-3.5 h-3.5" /> Allies
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search…"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				<div className="flex-1 overflow-y-auto space-y-2 pr-1">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
						</div>
					) : rows.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No matches found.
						</div>
					) : (
						rows.map((row) => (
							<div
								key={row.key}
								className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0">
										<div className="font-heading font-semibold">
											{formatRegentVernacular(row.title)}
										</div>
										<div className="flex flex-wrap gap-1 mt-1">
											{row.badges.map((b) => (
												<Badge
													key={b}
													variant="outline"
													className="text-[11px]"
												>
													{b}
												</Badge>
											))}
										</div>
									</div>
									<Button
										size="sm"
										onClick={row.onAdd}
										disabled={addGuildAlly.isPending}
									>
										Add
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
