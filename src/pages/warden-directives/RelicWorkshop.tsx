import {
	ArrowLeft,
	Copy,
	FileJson,
	FileText,
	Loader2,
	Plus,
	RotateCcw,
	Save,
	Shield,
	Sparkles,
	Sword,
	Trash2,
	Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEmbedded } from "@/contexts/EmbeddedContext";
import {
	RELIC_BALANCE_GUIDELINES,
	RELIC_PROPERTY_TYPES,
	RELIC_RANKS,
	RELIC_RARITY_LEVELS,
	RELIC_TYPES,
	type RelicPropertyType,
	type RelicRarity,
	type RelicType,
} from "@/data/compendium/wardenToolConfig";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatRarityLabel } from "@/lib/labels";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { MONARCH_LABEL } from "@/lib/vernacular";
import { loadWardenGenerationContext } from "@/lib/wardenGenerationContext";

interface RelicProperty {
	id: string;
	name: string;
	description: string;
	type: RelicPropertyType;
}

function resolveRelicType(itemType?: string | null): RelicType {
	const normalized = (itemType || "").toLowerCase();
	if (normalized.includes("armor") || normalized === "shield") return "armor";
	if (normalized.includes("tool")) return "tool";
	if (
		normalized.includes("weapon") ||
		normalized.includes("melee") ||
		normalized.includes("ranged")
	) {
		return "weapon";
	}
	return "accessory";
}

export interface Relic {
	id: string;
	name: string;
	type: RelicType;
	rank: string;
	description: string;
	properties: RelicProperty[];
	attunement: boolean;
	rarity: RelicRarity;
}

const RELIC_VALUE: Record<string, string> = {
	common: "100+ Gate Credits",
	uncommon: "500+ Gate Credits",
	rare: "2,000+ Gate Credits",
	"very-rare": "5,000+ Gate Credits",
	epic: "7,500+ Gate Credits",
	legendary: "10,000+ Gate Credits",
	mythic: "15,000+ Gate Credits",
	artifact: "25,000+ Gate Credits",
};

function relicToMarkdown(relic: Relic, enhanced?: string | null): string {
	return `# ${relic.name}

- **Type:** ${relic.type}
- **Rank:** ${relic.rank}
- **Rarity:** ${formatRarityLabel(relic.rarity)}
- **Attunement:** ${relic.attunement ? "Required" : "None"}
- **Estimated Value:** ${RELIC_VALUE[relic.rarity] ?? "—"}

${relic.description || "_No description provided._"}

## Properties
${
	relic.properties.length > 0
		? relic.properties
				.map((p) => `- **${p.name}** (${p.type}): ${p.description}`)
				.join("\n")
		: "- None"
}
${enhanced ? `\n## Warden Detail (AI)\n${enhanced}\n` : ""}`;
}

const RelicWorkshop = () => {
	const navigate = useNavigate();
	const embedded = useEmbedded();
	const { toast } = useToast();
	const hydratedRef = useRef(false);
	const [relics, setRelics] = useState<Relic[]>([]);

	const initialRelicId = useRef(Date.now().toString()).current;

	const [currentRelic, setCurrentRelic] = useState<Relic>({
		id: initialRelicId,
		name: "",
		type: "weapon",
		rank: "C",
		description: "",
		properties: [],
		attunement: false,
		rarity: "uncommon",
	});
	const [newProperty, setNewProperty] = useState<Omit<RelicProperty, "id">>({
		name: "",
		description: "",
		type: "passive",
	});
	const {
		state: storedRelics,
		isLoading,
		saveNow,
	} = useUserToolState<Relic[]>("relic_workshop", {
		initialState: [],
		storageKey: "Warden-relics",
	});
	const debouncedRelics = useDebounce(relics, 600);

	const addProperty = () => {
		if (!newProperty.name) return;

		const property: RelicProperty = {
			id: `${Date.now()}-${Math.random()}`,
			...newProperty,
		};

		setCurrentRelic({
			...currentRelic,
			properties: [...currentRelic.properties, property],
		});

		setNewProperty({ name: "", description: "", type: "passive" });
	};

	const removeProperty = (id: string) => {
		setCurrentRelic({
			...currentRelic,
			properties: currentRelic.properties.filter((p) => p.id !== id),
		});
	};

	const saveRelic = () => {
		if (!currentRelic.name) {
			toast({
				title: "Error",
				description: "Please enter a relic name.",
				variant: "destructive",
			});
			return;
		}

		const updated = relics.filter((r) => r.id !== currentRelic.id);
		updated.push(currentRelic);
		setRelics(updated);
		void saveNow(updated);

		toast({
			title: "Saved!",
			description: "Relic saved successfully.",
		});
	};

	const { isEnhancing, enhancedText, enhance } = useAIEnhance();

	const handleAIEnhance = async () => {
		if (!currentRelic.name) return;
		const seed = `Generate a complete, detailed relic for a Rift Ascendant TTRPG campaign.

SEED DATA:
- Name: ${currentRelic.name}
- Type: ${currentRelic.type}
- Rank: ${currentRelic.rank}
- Rarity: ${currentRelic.rarity}
- Attunement: ${currentRelic.attunement ? "Yes" : "No"}
- Description: ${currentRelic.description || "None provided"}
- Properties: ${currentRelic.properties.map((p) => `${p.name} (${p.type}): ${p.description}`).join("; ") || "None"}

Provide ALL of the following sections with full detail:

1. STATS: Type, rarity, attunement requirements, weight, value in Bureau Credits
2. PROPERTIES: Full mechanical effects at each awakening tier (dormant/awakened/exalted) with action types, uses, recharge, DCs, damage dice
3. ABILITIES: 2-4 unique abilities with complete SRD-compatible mechanics
4. CURSE/BLESSING: Optional curse mechanics with removal conditions, or blessing with activation
5. LORE: Creation story, legendary wielders, connection to Regent domains or Rift origins
6. ATTUNEMENT RITUAL: Flavor text describing the attunement process
7. COMBAT USE: How to use effectively in combat, synergies with specific jobs/paths
8. DESCRIPTION: Read-aloud boxed text for when players first discover this relic`;
		await enhance("relic", seed);
	};

	const handleCopy = () => {
		if (!currentRelic.name) return;
		navigator.clipboard.writeText(relicToMarkdown(currentRelic, enhancedText));
		toast({
			title: "Copied",
			description: "Relic stat block copied to clipboard as Markdown.",
		});
	};

	const handleExportMarkdown = () => {
		if (!currentRelic.name) return;
		downloadMarkdown(
			`relic-${currentRelic.name}`,
			relicToMarkdown(currentRelic, enhancedText),
		);
		toast({ title: "Exported", description: "Relic exported as Markdown." });
	};

	const handleExportJson = () => {
		if (!currentRelic.name) return;
		downloadJson(`relic-${currentRelic.name}`, currentRelic);
		toast({ title: "Exported", description: "Relic exported as JSON." });
	};

	const loadRelic = (relic: Relic) => {
		setCurrentRelic(relic);
		toast({
			title: "Loaded",
			description: `${relic.name} loaded into the workshop.`,
		});
	};

	const deleteRelic = (id: string) => {
		const updated = relics.filter((r) => r.id !== id);
		setRelics(updated);
		void saveNow(updated);
	};

	const handleSeedFromCompendium = async () => {
		const context = await loadWardenGenerationContext({
			types: ["relics", "artifacts", "sigils", "runes", "regents"],
		});
		const inspiration =
			context.pickOne("relics", { rank: currentRelic.rank }) ||
			context.pickOne("artifacts", { rank: currentRelic.rank });
		if (!inspiration) {
			toast({
				title: "No compendium seed found",
				description: "No relic or artifact entries were available.",
				variant: "destructive",
			});
			return;
		}

		const sigil = context.pickOne("sigils", { theme: inspiration.name });
		const rune = context.pickOne("runes", { theme: inspiration.name });
		const regent = context.pickOne("regents", { theme: inspiration.name });
		// Catalogue relics store very-rare in underscore form (very_rare); the
		// rarity ladder is canonical hyphen form. Normalize before matching so
		// a seeded inspiration keeps its true tier (incl. mythic) instead of
		// silently falling back to the current draft's rarity.
		const inspirationRarity = inspiration.rarity
			? (inspiration.rarity.toLowerCase().replace(/_/g, "-") as RelicRarity)
			: null;
		const rarity =
			inspirationRarity && RELIC_RARITY_LEVELS.includes(inspirationRarity)
				? inspirationRarity
				: currentRelic.rarity;
		const type = resolveRelicType(inspiration.entry.item_type);
		const seededProperties: RelicProperty[] = [
			{
				id: `${Date.now()}-seed-origin`,
				name: `${inspiration.name} Pattern`,
				description:
					inspiration.description ||
					`A canonical ${inspiration.type} pattern recovered from the compendium.`,
				type: "passive",
			},
			...(sigil
				? [
						{
							id: `${Date.now()}-seed-sigil`,
							name: `${sigil.name} Inscription`,
							description:
								sigil.description ||
								"Sigil logic braided into the relic's activation matrix.",
							type: "active" as const,
						},
					]
				: []),
			...(rune
				? [
						{
							id: `${Date.now()}-seed-rune`,
							name: `${rune.name} Rune Echo`,
							description:
								rune.description ||
								"Rune resonance stabilizes the relic's System interface.",
							type: "bonus" as const,
						},
					]
				: []),
		];

		setCurrentRelic({
			...currentRelic,
			name: currentRelic.name || inspiration.name,
			type,
			rarity,
			description: [
				currentRelic.description,
				`Compendium seed: ${inspiration.name}${regent ? `, aligned to ${regent.name}` : ""}.`,
				inspiration.description,
			]
				.filter(Boolean)
				.join("\n\n"),
			properties: [...currentRelic.properties, ...seededProperties],
		});
		toast({
			title: "Compendium seed applied",
			description: `${inspiration.name} linked into the relic draft.`,
		});
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "weapon":
				return Sword;
			case "armor":
				return Shield;
			case "accessory":
				return Sparkles;
			default:
				return Wand2;
		}
	};

	const getRarityColor = (rarity: string) => {
		const colors: Record<string, string> = {
			common: "text-gray-400 border-gray-400/30 bg-gray-400/10",
			uncommon: "text-green-400 border-green-400/30 bg-green-400/10",
			rare: "text-blue-400 border-blue-400/30 bg-blue-400/10",
			"very-rare": "text-violet-400 border-violet-400/30 bg-violet-400/10",
			epic: "text-purple-400 border-purple-400/30 bg-purple-400/10",
			legendary: "text-amber-400 border-amber-400/30 bg-amber-400/10",
			artifact: "text-rose-400 border-rose-400/30 bg-rose-400/10",
		};
		return colors[rarity] || colors.common;
	};

	useEffect(() => {
		if (isLoading || hydratedRef.current) return;
		if (Array.isArray(storedRelics) && storedRelics.length > 0) {
			setRelics(storedRelics);
		}
		hydratedRef.current = true;
	}, [isLoading, storedRelics]);

	useEffect(() => {
		if (!hydratedRef.current) return;
		void saveNow(debouncedRelics);
	}, [debouncedRelics, saveNow]);

	const guideline = RELIC_BALANCE_GUIDELINES[currentRelic.rarity];

	const content = (
		<div
			className={embedded ? "w-full" : "container mx-auto px-4 py-8 max-w-6xl"}
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
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Relic Synthesis Chamber
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Forge specialized armaments and conceptual objects functioning
						outside normative System constraints.
					</ManaFlowText>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<AscendantWindow title="RELIC DESIGN">
						<div className="space-y-4">
							<Button
								type="button"
								variant="outline"
								className="w-full gap-2"
								onClick={() => void handleSeedFromCompendium()}
							>
								<Sparkles className="w-4 h-4" />
								Seed From Compendium
							</Button>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Relic Name</Label>
									<Input
										id="name"
										value={currentRelic.name || ""}
										onChange={(e) =>
											setCurrentRelic({
												...currentRelic,
												name: e.target.value,
											})
										}
										placeholder={`e.g., Umbral ${MONARCH_LABEL}'s Dagger`}
									/>
								</div>
								<div>
									<Label htmlFor="rank">Rift Rank</Label>
									<Select
										value={currentRelic.rank || ""}
										onValueChange={(value) =>
											setCurrentRelic({ ...currentRelic, rank: value })
										}
									>
										<SelectTrigger id="rank">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{RELIC_RANKS.map((rank) => (
												<SelectItem key={rank} value={rank}>
													Rank {rank}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="type">Relic Type</Label>
									<Select
										value={currentRelic.type || ""}
										onValueChange={(value: Relic["type"]) =>
											setCurrentRelic({ ...currentRelic, type: value })
										}
									>
										<SelectTrigger id="type">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{RELIC_TYPES.map((type) => (
												<SelectItem key={type} value={type}>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="rarity">Rarity</Label>
									<Select
										value={currentRelic.rarity || ""}
										onValueChange={(value: Relic["rarity"]) =>
											setCurrentRelic({ ...currentRelic, rarity: value })
										}
									>
										<SelectTrigger id="rarity">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{RELIC_RARITY_LEVELS.map((rarity) => (
												<SelectItem key={rarity} value={rarity}>
													{rarity.charAt(0).toUpperCase() +
														rarity.slice(1).replace("-", " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={currentRelic.description || ""}
									onChange={(e) =>
										setCurrentRelic({
											...currentRelic,
											description: e.target.value,
										})
									}
									placeholder="Describe the relic's appearance, history, and lore..."
									rows={4}
								/>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="attunement"
									checked={currentRelic.attunement}
									onChange={(e) =>
										setCurrentRelic({
											...currentRelic,
											attunement: e.target.checked,
										})
									}
									className="w-4 h-4"
									aria-label="Requires Attunement"
								/>
								<Label htmlFor="attunement" className="cursor-pointer">
									Requires Attunement
								</Label>
							</div>
						</div>
					</AscendantWindow>

					<AscendantWindow title="ADD PROPERTY">
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="prop-name">Property Name</Label>
									<Input
										id="prop-name"
										value={newProperty.name || ""}
										onChange={(e) =>
											setNewProperty({ ...newProperty, name: e.target.value })
										}
										placeholder="e.g., +1 Attack Bonus"
									/>
								</div>
								<div>
									<Label htmlFor="prop-type">Type</Label>
									<Select
										value={newProperty.type || ""}
										onValueChange={(value: RelicProperty["type"]) =>
											setNewProperty({ ...newProperty, type: value })
										}
									>
										<SelectTrigger id="prop-type">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{RELIC_PROPERTY_TYPES.map((type) => (
												<SelectItem key={type} value={type}>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div>
								<Label htmlFor="prop-desc">Property Description</Label>
								<Textarea
									id="prop-desc"
									value={newProperty.description || ""}
									onChange={(e) =>
										setNewProperty({
											...newProperty,
											description: e.target.value,
										})
									}
									placeholder="Describe what this property does..."
									rows={3}
								/>
							</div>
							<Button onClick={addProperty} className="w-full">
								<Plus className="w-4 h-4 mr-2" />
								Add Property
							</Button>
						</div>
					</AscendantWindow>

					<AscendantWindow title="PROPERTIES">
						{currentRelic.properties.length === 0 ? (
							<AscendantText className="block text-muted-foreground text-center py-4">
								No properties yet. Add properties to define the relic's
								abilities.
							</AscendantText>
						) : (
							<div className="space-y-2">
								{currentRelic.properties.map((prop) => (
									<div
										key={prop.id}
										className="p-3 rounded-lg border border-border bg-muted/30 flex items-start justify-between"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<Badge variant="outline">{prop.type}</Badge>
												<span className="font-heading font-semibold">
													{prop.name}
												</span>
											</div>
											<div className="block text-sm text-muted-foreground">
												<AutoLinkText text={prop.description} />
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeProperty(prop.id)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						)}
					</AscendantWindow>
				</div>

				<div className="space-y-6">
					<AscendantWindow title="BALANCE GUIDE" variant="quest">
						<div className="space-y-4">
							<Badge className={getRarityColor(currentRelic.rarity)}>
								{currentRelic.rarity.toUpperCase().replace("-", " ")}
							</Badge>
							<AscendantText className="block text-sm text-muted-foreground">
								{guideline.description}
							</AscendantText>
							<div className="space-y-2 text-xs">
								<div>
									Properties:{" "}
									{typeof guideline.properties === "number"
										? guideline.properties
										: `${guideline.properties[0]}-${guideline.properties[1]}`}
								</div>
								<div>Max Bonus: +{guideline.maxBonus}</div>
							</div>
						</div>
					</AscendantWindow>

					<AscendantWindow title="RELIC PREVIEW">
						{currentRelic.name ? (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{(() => {
											const Icon = getTypeIcon(currentRelic.type);
											return <Icon className="w-5 h-5 text-primary" />;
										})()}
										<h3 className="font-heading font-semibold">
											{currentRelic.name}
										</h3>
									</div>
									<Badge className={getRarityColor(currentRelic.rarity)}>
										{formatRarityLabel(currentRelic.rarity)}
									</Badge>
								</div>
								<div className="text-xs text-muted-foreground">
									Rank {currentRelic.rank} • {currentRelic.type}
									{currentRelic.attunement && " • Requires Attunement"}
								</div>
								{currentRelic.description && (
									<div className="block text-sm text-muted-foreground">
										<AutoLinkText text={currentRelic.description} />
									</div>
								)}
								{currentRelic.properties.length > 0 && (
									<div className="space-y-2 pt-2 border-t border-border">
										<div className="text-xs font-heading font-semibold">
											Properties:
										</div>
										{currentRelic.properties.map((prop) => (
											<div key={prop.id} className="text-xs">
												<Badge variant="outline" className="text-xs mr-2">
													{prop.type}
												</Badge>
												<span className="font-semibold">{prop.name}:</span>{" "}
												<span className="text-muted-foreground">
													<AutoLinkText text={prop.description} />
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						) : (
							<AscendantText className="block text-muted-foreground text-sm text-center py-4">
								Relic preview will appear here
							</AscendantText>
						)}
					</AscendantWindow>

					<AscendantWindow title="SAVED RELICS">
						{relics.length === 0 ? (
							<AscendantText className="block text-muted-foreground text-sm text-center py-4">
								No saved relics yet. Save a relic to build your library.
							</AscendantText>
						) : (
							<div className="space-y-1">
								{relics.map((r) => (
									<div
										key={r.id}
										className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/40 transition-colors"
									>
										<button
											type="button"
											onClick={() => loadRelic(r)}
											className="flex-1 min-w-0 text-left"
											title="Load this relic"
										>
											<span className="font-heading text-sm block truncate">
												{r.name}
											</span>
											<span className="text-[11px] text-muted-foreground">
												{formatRarityLabel(r.rarity)} · Rank {r.rank} · {r.type}
											</span>
										</button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-7 w-7 shrink-0"
											onClick={() => loadRelic(r)}
											title="Load"
										>
											<RotateCcw className="w-3.5 h-3.5" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-7 w-7 shrink-0"
											onClick={() => deleteRelic(r.id)}
											title="Delete"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</Button>
									</div>
								))}
							</div>
						)}
					</AscendantWindow>
				</div>
			</div>

			<div className="mt-6 space-y-2">
				<Button onClick={saveRelic} className="w-full btn-umbral" size="lg">
					<Save className="w-4 h-4 mr-2" />
					Save Relic
				</Button>
				{currentRelic.name && (
					<Button
						onClick={handleCopy}
						variant="outline"
						className="w-full"
						size="lg"
					>
						<Copy className="w-4 h-4 mr-2" />
						Copy Relic Stats
					</Button>
				)}
				{currentRelic.name && (
					<div className="flex gap-2">
						<Button
							onClick={handleExportMarkdown}
							variant="outline"
							className="flex-1 gap-2"
							size="lg"
						>
							<FileText className="w-4 h-4" />
							Markdown
						</Button>
						<Button
							onClick={handleExportJson}
							variant="outline"
							className="flex-1 gap-2"
							size="lg"
						>
							<FileJson className="w-4 h-4" />
							JSON
						</Button>
					</div>
				)}
				{currentRelic.name && (
					<Button
						onClick={handleAIEnhance}
						className="w-full gap-2"
						variant="outline"
						size="lg"
						disabled={isEnhancing}
					>
						{isEnhancing ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Sparkles className="w-4 h-4" />
						)}
						{isEnhancing ? "Enhancing..." : "Enhance with AI"}
					</Button>
				)}
				{enhancedText && (
					<div className="pt-4 border-t border-primary/30">
						<div className="flex items-center gap-2 mb-2">
							<Sparkles className="w-4 h-4 text-primary" />
							<span className="text-xs font-display text-primary">
								AI-ENHANCED RELIC DETAILS
							</span>
						</div>
						<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-none sm:max-h-[500px] overflow-y-auto">
							<AutoLinkText text={enhancedText || ""} />
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return embedded ? content : <Layout>{content}</Layout>;
};

export default RelicWorkshop;
