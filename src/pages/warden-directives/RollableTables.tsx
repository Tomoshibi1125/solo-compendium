import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Dice6, Loader2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmbedded } from "@/contexts/EmbeddedContext";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { usePreferredCampaignSelection } from "@/hooks/usePreferredCampaignSelection";
import { useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

function rollTable<T>(table: readonly T[]): T {
	return table[Math.floor(Math.random() * table.length)];
}

type RollableTablesState = {
	activeTab: "gates" | "rewards" | "npcs" | "treasure";
	results: Record<string, string>;
};

type CanonicalRollableTable = StaticCompendiumEntry & {
	table_category?: string | null;
	table_group?: string | null;
	rollable_entries?: string[] | null;
	rank?: string | null;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type RollableTableCardConfig = {
	tableId: string;
	title: string;
	badgeLabel: string;
	badgeVariant: BadgeVariant;
	shareTitle: string;
	rollLabel: string;
};

const LEGACY_RESULT_KEY_MAP: Record<string, string> = {
	complication: "rift-complications",
	hazard: "rift-hazards",
	theme: "rift-themes",
	biome: "rift-biomes",
	reward: "rift-rewards",
	motivation: "npc-motivations",
	secret: "npc-secrets",
};

const GATE_TABLE_CONFIGS: RollableTableCardConfig[] = [
	{
		tableId: "rift-complications",
		title: "RIFT COMPLICATIONS",
		badgeLabel: "Complication",
		badgeVariant: "destructive",
		shareTitle: "Rift Complication",
		rollLabel: "Roll Complication",
	},
	{
		tableId: "rift-hazards",
		title: "RIFT HAZARDS",
		badgeLabel: "Hazard",
		badgeVariant: "destructive",
		shareTitle: "Rift Hazard",
		rollLabel: "Roll Hazard",
	},
	{
		tableId: "rift-themes",
		title: "RIFT THEMES",
		badgeLabel: "Theme",
		badgeVariant: "secondary",
		shareTitle: "Rift Theme",
		rollLabel: "Roll Theme",
	},
	{
		tableId: "rift-biomes",
		title: "RIFT BIOMES",
		badgeLabel: "Biome",
		badgeVariant: "secondary",
		shareTitle: "Rift Biome",
		rollLabel: "Roll Biome",
	},
];

const REWARD_TABLE_CONFIGS: RollableTableCardConfig[] = [
	{
		tableId: "rift-rewards",
		title: "RIFT REWARDS",
		badgeLabel: "Reward",
		badgeVariant: "default",
		shareTitle: "Rift Reward",
		rollLabel: "Roll Reward",
	},
];

const NPC_TABLE_CONFIGS: RollableTableCardConfig[] = [
	{
		tableId: "npc-motivations",
		title: "NPC MOTIVATIONS",
		badgeLabel: "Motivation",
		badgeVariant: "secondary",
		shareTitle: "NPC Motivation",
		rollLabel: "Roll Motivation",
	},
	{
		tableId: "npc-secrets",
		title: "NPC SECRETS",
		badgeLabel: "Secret",
		badgeVariant: "destructive",
		shareTitle: "NPC Secret",
		rollLabel: "Roll Secret",
	},
];

const TREASURE_RANK_ORDER = [
	"E-Rank",
	"D-Rank",
	"C-Rank",
	"B-Rank",
	"A-Rank",
	"S-Rank",
] as const;

const tabs: Array<{
	value: RollableTablesState["activeTab"];
	label: string;
}> = [
	{ value: "gates", label: "Rifts" },
	{ value: "rewards", label: "Rewards" },
	{ value: "npcs", label: "NPCs" },
	{ value: "treasure", label: "Treasure" },
];

const toTreasureTableId = (rank: string) =>
	`treasure-${rank.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const normalizeResultKey = (key: string) =>
	LEGACY_RESULT_KEY_MAP[key] ??
		(key.startsWith("treasure-") ? key.toLowerCase() : key);

const normalizeStoredResults = (results: Record<string, string>) =>
	Object.fromEntries(
		Object.entries(results).map(([key, value]) => [
			normalizeResultKey(key),
			value,
		]),
	);

const RollableTables = () => {
	const navigate = useNavigate();
	const embedded = useEmbedded();
	const {
		state: storedState,
		isLoading: isStateLoading,
		saveNow,
	} = useUserToolState<RollableTablesState>("rollable_tables", {
		initialState: {
			activeTab: "gates",
			results: {},
		},
		storageKey: "solo-compendium.Warden-tools.rollable-tables.v1",
	});

	const { user } = useAuth();
	const { campaignId: selectedCampaignId } =
		usePreferredCampaignSelection("rollable_tables");
	const { toast } = useToast();
	const { data: canonicalTables = [], isLoading: tablesLoading } = useQuery({
		queryKey: ["canonical-rollable-tables", selectedCampaignId ?? null],
		queryFn: async () =>
			(await listCanonicalEntries("rollable-tables", undefined, {
				campaignId: selectedCampaignId,
			})) as CanonicalRollableTable[],
		staleTime: 300_000,
	});
	const tableIndex = useMemo(
		() => new Map(canonicalTables.map((table) => [table.id, table])),
		[canonicalTables],
	);
	const treasureTables = useMemo(
		() =>
			TREASURE_RANK_ORDER.map((rank) => tableIndex.get(toTreasureTableId(rank)))
				.filter((table): table is CanonicalRollableTable => !!table),
		[tableIndex],
	);

	const [activeTab, setActiveTab] =
		useState<RollableTablesState["activeTab"]>("gates");
	const [results, setResults] = useState<Record<string, string>>({});

	const hydrated = useMemo(() => {
		return {
			activeTab: storedState.activeTab ?? "gates",
			results: normalizeStoredResults(storedState.results ?? {}),
		} satisfies RollableTablesState;
	}, [storedState.activeTab, storedState.results]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isStateLoading) return;
		if (hydratedRef.current) return;
		setActiveTab(hydrated.activeTab);
		setResults(hydrated.results);
		hydratedRef.current = true;
	}, [hydrated.activeTab, hydrated.results, isStateLoading]);

	const savePayload = useMemo(
		() => ({ activeTab, results }) satisfies RollableTablesState,
		[activeTab, results],
	);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isStateLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isStateLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance } = useAIEnhance();

	const handleAIEnhance = async () => {
		const filledResults = Object.entries(results)
			.filter(([, value]) => value)
			.map(([key, value]) => ({
				label: tableIndex.get(key)?.name ?? key,
				value,
			}));
		if (filledResults.length === 0) return;
		const seed = `Expand these rollable table results into fully detailed TTRPG content for a Rift Ascendant campaign.

ROLLED RESULTS:
${filledResults.map(({ label, value }) => `- ${label}: ${value}`).join("\n")}

For EACH result, provide:
1. Full description (2-3 sentences) with sensory details and atmosphere
2. Mechanical effects: DCs, damage, conditions, durations, saves as applicable
3. Lore context: How it connects to Rifts, Regents, the Rift, Ascendants
4. Tactical implications: How players/Warden should use this in play
5. Follow-up hooks: What this result leads to next`;
		await enhance("table-results", seed);
	};

	const roll = (tableId: string) => {
		const table = tableIndex.get(tableId);
		const entries = table?.rollable_entries ?? [];
		if (entries.length === 0) {
			toast({
				title: "Table Unavailable",
				description: "This canonical table has no entries to roll from yet.",
				variant: "destructive",
			});
			return;
		}
		const result = formatRegentVernacular(rollTable(entries));
		setResults((prev) => {
			const next = { ...prev, [tableId]: result };
			if (hydratedRef.current && !isStateLoading) {
				void saveNow({ activeTab, results: next });
			}
			return next;
		});
	};

	const renderTableCard = (config: RollableTableCardConfig) => {
		const table = tableIndex.get(config.tableId);
		const result = results[config.tableId];
		return (
			<AscendantWindow key={config.tableId} title={config.title}>
				<div className="space-y-3">
					<Button
						onClick={() => roll(config.tableId)}
						className="w-full gap-2"
						disabled={tablesLoading || !table?.rollable_entries?.length}
					>
						<Dice6 className="w-4 h-4" />
						{config.rollLabel}
					</Button>
					{!tablesLoading && !table && (
						<p className="text-xs text-muted-foreground">
							This canonical table is unavailable.
						</p>
					)}
					{result && (
						<div className="p-3 rounded border bg-muted/30 relative group">
							<Badge variant={config.badgeVariant} className="mb-2">
								{config.badgeLabel}
							</Badge>
							<p className="font-heading">{result}</p>
							<Button
								size="sm"
								variant="ghost"
								className="absolute top-2 right-2 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-opacity"
								onClick={() => shareToCampaign(config.shareTitle, result)}
							>
								Share
							</Button>
						</div>
					)}
				</div>
			</AscendantWindow>
		);
	};

	const shareToCampaign = async (title: string, content: string) => {
		if (!selectedCampaignId || !user) {
			toast({
				title: "Cannot Share",
				description: "Select a campaign first.",
				variant: "destructive",
			});
			return;
		}

		try {
			await supabase.from("campaign_messages").insert({
				campaign_id: selectedCampaignId,
				user_id: user.id,
				message_type: "rift",
				content: `**[Warden Rolled ${title}]**\n${content}`,
			});
			toast({
				title: "Shared to Campaign",
				description: `${title} shared with players.`,
			});
		} catch (_e) {
			toast({
				title: "Error",
				description: "Failed to share to campaign.",
				variant: "destructive",
			});
		}
	};

	return (
		<Layout>
			<div className={cn("w-full", !embedded && "container mx-auto px-4 py-8")}>
				{!embedded && (
					<div className="mb-6">
						<Button
							variant="ghost"
							onClick={() => navigate("/warden-directives")}
							className="mb-4"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to System Tools
						</Button>
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="mb-2"
						>
							Warden Tables
						</RiftHeading>
						<ManaFlowText variant="rift" speed="slow" className="font-heading">
							Rollable tables from the Warden's Guide, adapted for the
							post-reset world.
						</ManaFlowText>
					</div>
				)}

				<Tabs
					value={activeTab}
					onValueChange={(value) => {
						const nextTab = value as RollableTablesState["activeTab"];
						setActiveTab(nextTab);
						if (hydratedRef.current && !isStateLoading) {
							void saveNow({ activeTab: nextTab, results });
						}
					}}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						{tabs.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value="gates" className="space-y-4 mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{GATE_TABLE_CONFIGS.map(renderTableCard)}
						</div>
					</TabsContent>

					<TabsContent value="rewards" className="space-y-4 mt-6">
						{REWARD_TABLE_CONFIGS.map(renderTableCard)}
					</TabsContent>

					<TabsContent value="npcs" className="space-y-4 mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{NPC_TABLE_CONFIGS.map(renderTableCard)}
						</div>
					</TabsContent>

					<TabsContent value="treasure" className="space-y-4 mt-6">
						<AscendantWindow title="TREASURE BY RIFT RANK">
							<div className="space-y-4">
								{treasureTables.map((table) => (
									<div key={table.id} className="border rounded p-3">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-heading font-semibold">
												{table.rank} Rifts
											</h3>
											<Button
												size="sm"
												variant="outline"
												onClick={() => roll(table.id)}
												className="gap-2"
												disabled={tablesLoading || !table.rollable_entries?.length}
											>
												<Dice6 className="w-3 h-3" />
												Roll
											</Button>
										</div>
										{results[table.id] && (
											<div className="mt-2 p-2 rounded bg-muted/30 relative group">
												<Badge variant="default" className="mb-1">
													{table.rank}
												</Badge>
												<p className="font-heading text-sm">
													{results[table.id]}
												</p>
												<Button
													size="sm"
													variant="ghost"
													className="absolute top-2 right-2 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-opacity h-6 px-2 text-xs"
													onClick={() =>
														shareToCampaign(
															`Treasure (${table.rank})`,
															results[table.id],
														)
													}
												>
													Share
												</Button>
											</div>
										)}
										<div className="text-xs text-muted-foreground mt-2">
											{(table.rollable_entries ?? [])
												.map(formatRegentVernacular)
												.join(", ")}
										</div>
									</div>
								))}
								{!tablesLoading && treasureTables.length === 0 && (
									<p className="text-sm text-muted-foreground">
										No canonical treasure tables are available.
									</p>
								)}
							</div>
						</AscendantWindow>
					</TabsContent>
				</Tabs>

				{Object.values(results).some(Boolean) && (
					<div className="mt-6 space-y-4">
						<Button
							onClick={handleAIEnhance}
							className="w-full gap-2 btn-umbral"
							size="lg"
							disabled={isEnhancing}
						>
							{isEnhancing ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Sparkles className="w-4 h-4" />
							)}
							{isEnhancing
								? "Enhancing All Results..."
								: "Enhance All Results with AI"}
						</Button>
						{enhancedText && (
							<AscendantWindow title="AI-ENHANCED RESULTS">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-display text-primary">
										AI-ENHANCED DETAILS
									</span>
								</div>
								<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
									{enhancedText}
								</div>
							</AscendantWindow>
						)}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default RollableTables;
