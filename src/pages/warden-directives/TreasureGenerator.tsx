import {
	ArrowLeft,
	Coins,
	Copy,
	FileJson,
	FileText,
	Gem,
	Loader2,
	PackagePlus,
	RefreshCw,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { AscendantText, ManaFlowText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GenerationHistoryPanel } from "@/components/warden-directives/GenerationHistoryPanel";
import { WardenItemDeliveryDialog } from "@/components/warden-directives/WardenItemDeliveryDialog";
import { useEmbedded } from "@/contexts/EmbeddedContext";
import {
	GATE_RANKS,
	TREASURE_TABLES,
} from "@/data/compendium/wardenToolConfig";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useMyCampaigns } from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import {
	linkedEntryToDeliverableItem,
	type WardenDeliverableItem,
} from "@/hooks/useWardenItemDelivery";
import {
	emptyHistory,
	type GenerationHistoryState,
	type HistoryEntry,
	pushGeneration,
	removeGeneration,
	restoreGeneration,
	togglePin,
} from "@/lib/generationHistory";
import { rankToGateBadge, rarityToGateBadge } from "@/lib/rankColors";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { generateTreasure, type TreasureResult } from "@/lib/treasureGenerator";
import { cn } from "@/lib/utils";
import type { WardenLinkedEntry } from "@/lib/wardenGenerationContext";

// --- Structured item view ---

interface StructuredItem {
	name: string;
	type: string;
	rarity: string;
	attunement: boolean;
	properties: string[];
	weight: number | null;
	damage: string | null;
	description: string | null;
	rank: string | null;
}

function toStructuredItem(linked: WardenLinkedEntry): StructuredItem {
	const e = linked.entry;
	const properties = Array.isArray(e.simple_properties)
		? e.simple_properties.filter((p): p is string => typeof p === "string")
		: Array.isArray(e.properties)
			? (e.properties as unknown[]).filter(
					(p): p is string => typeof p === "string",
				)
			: [];
	return {
		name: linked.name,
		type: e.item_type || e.equipment_type || "Item",
		rarity: linked.rarity || e.rarity || "common",
		attunement: e.attunement === true,
		properties,
		weight: typeof e.weight === "number" ? e.weight : null,
		damage: e.damage != null ? String(e.damage) : null,
		description: linked.description,
		rank: linked.rank,
	};
}

function treasureToMarkdown(
	t: TreasureResult,
	enhanced?: string | null,
): string {
	const currency = [
		`${t.tens} Rift Credits`,
		t.hundreds > 0 ? `${t.hundreds} Core Credits` : "",
		t.fives > 0 ? `${t.fives} Crystal Credits` : "",
		t.ones > 0 ? `${t.ones} Mana Credits` : "",
		t.dimes > 0 ? `${t.dimes} Mana Credit chips` : "",
	]
		.filter(Boolean)
		.join(", ");

	const itemMd = (linked: WardenLinkedEntry): string => {
		const it = toStructuredItem(linked);
		const meta = [
			it.type,
			it.rarity,
			it.attunement ? "requires attunement" : null,
			it.damage ? `damage ${it.damage}` : null,
			it.weight != null ? `${it.weight} lb` : null,
		]
			.filter(Boolean)
			.join(" · ");
		const props =
			it.properties.length > 0
				? `\n  - Properties: ${it.properties.join(", ")}`
				: "";
		const desc = it.description ? `\n  - ${it.description}` : "";
		return `- **${it.name}** (${meta})${props}${desc}`;
	};

	const items = t.itemEntries.map(itemMd).join("\n") || "- None";
	const relics = t.relicEntries.map(itemMd).join("\n") || "- None";
	const materials = t.materials.map((m) => `- ${m}`).join("\n") || "- None";

	return `# Rank ${t.rank} Treasure Hoard

**Currency:** ${currency}

## Items
${items}

## Materials
${materials}

## Relics
${relics}

${t.description}
${enhanced ? `\n## Warden Detail (AI)\n${enhanced}\n` : ""}`;
}

interface TreasureToolState {
	selectedRank: string;
	current: TreasureResult | null;
	history: HistoryEntry<TreasureResult>[];
}

const TreasureGenerator = () => {
	const navigate = useNavigate();
	const embedded = useEmbedded();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<TreasureToolState>("treasure_generator", {
		initialState: { selectedRank: "C", current: null, history: [] },
		storageKey: "solo-compendium.Warden-tools.treasure-generator.v1",
	});

	const [selectedRank, setSelectedRank] = useState<string>("C");
	const [histState, setHistState] = useState<
		GenerationHistoryState<TreasureResult>
	>(emptyHistory<TreasureResult>());
	const treasure = histState.current;
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
	const [deliveryItem, setDeliveryItem] =
		useState<WardenDeliverableItem | null>(null);
	const [deliveryOpen, setDeliveryOpen] = useState(false);
	const { data: campaigns = [] } = useMyCampaigns();

	const hydrated = useMemo(() => {
		const raw = storedState as unknown as {
			selectedRank?: string;
			current?: TreasureResult | null;
			history?: HistoryEntry<TreasureResult>[];
			treasure?: TreasureResult | null;
		};
		const rank = raw.selectedRank ?? "C";
		if (Array.isArray(raw.history)) {
			return {
				selectedRank: rank,
				hist: { current: raw.current ?? null, history: raw.history },
			};
		}
		// Migrate legacy latest-only shape ({ selectedRank, treasure }).
		return {
			selectedRank: rank,
			hist: { current: raw.treasure ?? null, history: [] },
		};
	}, [storedState]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setSelectedRank(hydrated.selectedRank);
		setHistState(hydrated.hist);
		hydratedRef.current = true;
	}, [hydrated, isLoading]);

	const savePayload = useMemo<TreasureToolState>(
		() => ({
			selectedRank,
			current: histState.current,
			history: histState.history,
		}),
		[selectedRank, histState],
	);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = async () => {
		clearEnhanced();
		setIsGenerating(true);
		try {
			const result = await generateTreasure(selectedRank);
			setHistState((prev) =>
				pushGeneration(
					prev,
					result,
					`Rank ${result.rank} · ${result.items.length} items · ${result.relics.length} relics`,
				),
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleAIEnhance = async () => {
		if (!treasure) return;
		const seed = `Generate fully detailed treasure for a Rift Ascendant TTRPG Rift clearance.

SEED DATA:
- Rift Rank: ${treasure.rank}
- Rift Credits: ${treasure.tens}
${treasure.hundreds > 0 ? `- Core Credits: ${treasure.hundreds}\n` : ""}${treasure.fives > 0 ? `- Crystal Credits: ${treasure.fives}\n` : ""}${treasure.ones > 0 ? `- Mana Credits: ${treasure.ones}\n` : ""}${treasure.dimes > 0 ? `- Mana Credit Chips: ${treasure.dimes}\n` : ""}- Items: ${treasure.items.join(", ") || "None"}
- Materials: ${treasure.materials.join(", ") || "None"}
- Relics: ${treasure.relics.join(", ") || "None"}

For each item and relic, expand on activation rules, charges, side effects, lore, and Bureau Credit value. Keep all listed names and the structured fields intact. Add read-aloud discovery text for the hoard.`;
		await enhance("treasure", seed);
	};

	const handleCopy = () => {
		if (!treasure) return;
		navigator.clipboard.writeText(treasureToMarkdown(treasure, enhancedText));
		toast({
			title: "Copied!",
			description: "Treasure hoard copied to clipboard as Markdown.",
		});
	};

	const handleExportMarkdown = () => {
		if (!treasure) return;
		downloadMarkdown(
			`treasure-rank-${treasure.rank}`,
			treasureToMarkdown(treasure, enhancedText),
		);
		toast({ title: "Exported", description: "Treasure exported as Markdown." });
	};

	const handleExportJson = () => {
		if (!treasure) return;
		downloadJson(`treasure-rank-${treasure.rank}`, treasure);
		toast({ title: "Exported", description: "Treasure exported as JSON." });
	};

	const openDelivery = (item: WardenDeliverableItem) => {
		setDeliveryItem(item);
		setDeliveryOpen(true);
	};

	const getRankColor = (rank: string) => rankToGateBadge(rank);

	const renderItemCard = (
		linked: WardenLinkedEntry,
		accent: "primary" | "relic",
	) => {
		const it = toStructuredItem(linked);
		const rarityClass = rarityToGateBadge(it.rarity);
		return (
			<div
				key={`${accent}-${linked.id}`}
				className={cn(
					"rounded-lg border p-3 space-y-1.5",
					accent === "relic"
						? "border-purple-400/40 bg-purple-400/5"
						: "border-border bg-black/20",
				)}
			>
				<div className="flex items-start justify-between gap-2">
					<span className="font-heading text-sm">{it.name}</span>
					<div className="flex items-center gap-1 shrink-0">
						{selectedCampaignId && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="h-7 px-2"
								onClick={() =>
									openDelivery(linkedEntryToDeliverableItem(linked))
								}
							>
								<PackagePlus className="w-3 h-3 mr-1" />
								Deliver
							</Button>
						)}
					</div>
				</div>
				<div className="flex flex-wrap gap-1">
					<Badge variant="outline" className="text-[11px]">
						{it.type}
					</Badge>
					<Badge variant="outline" className={cn("text-[11px]", rarityClass)}>
						{it.rarity}
					</Badge>
					{it.attunement && (
						<Badge variant="outline" className="text-[11px] text-gate-s">
							Attunement
						</Badge>
					)}
					{it.damage && (
						<Badge variant="outline" className="text-[11px]">
							{it.damage}
						</Badge>
					)}
					{it.weight != null && (
						<Badge variant="outline" className="text-[11px]">
							{it.weight} lb
						</Badge>
					)}
				</div>
				{it.properties.length > 0 && (
					<p className="text-[11px] text-muted-foreground">
						{it.properties.join(", ")}
					</p>
				)}
				{it.description && (
					<p className="text-xs text-muted-foreground/90 line-clamp-3">
						{it.description}
					</p>
				)}
			</div>
		);
	};

	const content = (
		<div
			className={embedded ? "w-full" : "container mx-auto px-4 py-8 max-w-4xl"}
		>
			{!embedded && (
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<PageHeader
						title="Material Requisition"
						description={
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="font-heading"
							>
								Synthesize valuable physical matter appropriate for cleared
								dimensional constructs. Requisition quotas are scaled linearly
								with Rift Rank.
							</ManaFlowText>
						}
					/>
				</div>
			)}

			<AscendantWindow title="GENERATE TREASURE" className="mb-6">
				<div className="space-y-4">
					<div>
						<Label htmlFor="rank" className="mb-2 block">
							Rift Rank
						</Label>
						<Select
							value={selectedRank}
							onValueChange={(value) => setSelectedRank(value)}
						>
							<SelectTrigger id="rank">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{GATE_RANKS.map((rank) => (
									<SelectItem key={rank} value={rank}>
										Rank {rank}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="campaign-delivery" className="mb-2 block">
							Campaign Delivery Target
						</Label>
						<Select
							value={selectedCampaignId || "none"}
							onValueChange={(value) =>
								setSelectedCampaignId(value === "none" ? "" : value)
							}
						>
							<SelectTrigger id="campaign-delivery">
								<SelectValue placeholder="Select campaign for delivery" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No campaign selected</SelectItem>
								{campaigns.map((campaign) => (
									<SelectItem key={campaign.id} value={campaign.id}>
										{campaign.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Button
						onClick={handleGenerate}
						className="w-full btn-umbral"
						size="lg"
						disabled={isGenerating}
					>
						{isGenerating ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<Sparkles className="w-4 h-4 mr-2" />
						)}
						{isGenerating ? "Generating..." : "Generate Treasure"}
					</Button>
					{treasure && (
						<Button
							onClick={handleAIEnhance}
							className="w-full gap-2 mt-2"
							variant="outline"
							size="lg"
							disabled={isEnhancing || isGenerating}
						>
							{isEnhancing ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Sparkles className="w-4 h-4" />
							)}
							{isEnhancing ? "Enhancing..." : "Enhance with AI"}
						</Button>
					)}
				</div>
			</AscendantWindow>

			{treasure && (
				<AscendantWindow
					title={`RANK ${treasure.rank} TREASURE`}
					className="mb-6"
				>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Badge
								className={cn("text-lg px-4 py-2", getRankColor(treasure.rank))}
							>
								Rank {treasure.rank}
							</Badge>
							<div className="flex items-center gap-2 text-2xl font-resurge text-system-green">
								<Coins className="w-6 h-6" />
								{treasure.tens} Rift Credits
							</div>
						</div>

						{(treasure.hundreds > 0 ||
							treasure.fives > 0 ||
							treasure.ones > 0 ||
							treasure.dimes > 0) && (
							<div className="flex flex-wrap gap-2 text-sm">
								{treasure.hundreds > 0 && (
									<Badge variant="secondary">
										{treasure.hundreds} Core Credits
									</Badge>
								)}
								{treasure.fives > 0 && (
									<Badge variant="secondary">
										{treasure.fives} Crystal Credits
									</Badge>
								)}
								{treasure.ones > 0 && (
									<Badge variant="secondary">
										{treasure.ones} Mana Credits
									</Badge>
								)}
								{treasure.dimes > 0 && (
									<Badge variant="secondary">
										{treasure.dimes} Mana Credit Chips
									</Badge>
								)}
							</div>
						)}

						{treasure.itemEntries.length > 0 && (
							<div>
								<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
									<Gem className="w-4 h-4 text-primary" />
									Items ({treasure.itemEntries.length})
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{treasure.itemEntries.map((linked) =>
										renderItemCard(linked, "primary"),
									)}
								</div>
							</div>
						)}

						{treasure.materials.length > 0 && (
							<div>
								<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-blue-400" />
									Materials ({treasure.materials.length})
								</h3>
								<div className="flex flex-wrap gap-2">
									{treasure.materials.map((material) => (
										<Badge
											key={`treasure-material-${material}`}
											variant="outline"
											className="text-sm bg-blue-400/10 border-blue-400/30"
										>
											{material}
										</Badge>
									))}
								</div>
							</div>
						)}

						{treasure.relicEntries.length > 0 && (
							<div>
								<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-purple-400" />
									Relics ({treasure.relicEntries.length})
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{treasure.relicEntries.map((linked) =>
										renderItemCard(linked, "relic"),
									)}
								</div>
							</div>
						)}

						<div className="pt-4 border-t border-border">
							<AscendantText className="block text-muted-foreground font-heading leading-relaxed">
								<AutoLinkText text={treasure.description} />
							</AscendantText>
						</div>

						{enhancedText && (
							<div className="pt-4 border-t border-primary/30">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-display text-primary">
										AI-ENHANCED DETAILS
									</span>
								</div>
								<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-none sm:max-h-[500px] overflow-y-auto">
									<AutoLinkText text={enhancedText} />
								</div>
							</div>
						)}

						<div className="flex flex-wrap gap-2 pt-2">
							<Button onClick={handleCopy} variant="outline" className="gap-2">
								<Copy className="w-4 h-4" />
								Copy
							</Button>
							<Button
								onClick={handleExportMarkdown}
								variant="outline"
								className="gap-2"
							>
								<FileText className="w-4 h-4" />
								Markdown
							</Button>
							<Button
								onClick={handleExportJson}
								variant="outline"
								className="gap-2"
							>
								<FileJson className="w-4 h-4" />
								JSON
							</Button>
							<Button
								onClick={handleGenerate}
								variant="outline"
								className="gap-2 ml-auto"
								disabled={isGenerating}
							>
								<RefreshCw className="w-4 h-4" />
								Regenerate
							</Button>
						</div>
					</div>
				</AscendantWindow>
			)}

			<GenerationHistoryPanel
				state={histState}
				onRestore={(id) => setHistState((prev) => restoreGeneration(prev, id))}
				onTogglePin={(id) => setHistState((prev) => togglePin(prev, id))}
				onRemove={(id) => setHistState((prev) => removeGeneration(prev, id))}
				className="mb-6"
			/>

			<AscendantWindow title="TREASURE GUIDE" variant="quest">
				<div className="space-y-4 text-sm">
					<AscendantText className="block text-muted-foreground font-heading">
						Treasure generation follows the Rift Rank system. Higher ranks yield
						significantly more valuable rewards.
					</AscendantText>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{GATE_RANKS.map((rank) => {
							const table = TREASURE_TABLES[rank];
							return (
								<div
									key={rank}
									className={cn("p-3 rounded-lg border", getRankColor(rank))}
								>
									<div className="font-heading font-semibold mb-1">
										Rank {rank}
									</div>
									<div className="text-xs text-muted-foreground">
										Gate Credit Range: {table.tenRange[0]}-{table.tenRange[1]} |
										Items: {Math.round(table.itemChance * 100)}% | Materials:{" "}
										{Math.round(table.materialChance * 100)}% | Relics:{" "}
										{Math.round(table.relicChance * 100)}%
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</AscendantWindow>
			{selectedCampaignId && (
				<WardenItemDeliveryDialog
					open={deliveryOpen}
					onOpenChange={setDeliveryOpen}
					campaignId={selectedCampaignId}
					initialItem={deliveryItem}
					title="Deliver Generated Treasure"
				/>
			)}
		</div>
	);

	return embedded ? content : <Layout>{content}</Layout>;
};

export default TreasureGenerator;
