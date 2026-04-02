import { ArrowLeft, Dice6, Loader2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { usePreferredCampaignSelection } from "@/hooks/usePreferredCampaignSelection";
import { useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { formatRegentVernacular } from "@/lib/vernacular";

// System Ascendant themed reference tables
const GATE_COMPLICATIONS = [
	"Mana surge causes random power effects",
	"Rift structure shifts, changing layout",
	"Monster reinforcements arrive",
	"Environmental hazard activates (fire, ice, poison)",
	"Time distortion slows/speeds ascendant team",
	"Shadow corruption spreads",
	"Rift boss awakens early",
	"Core instability causes tremors",
	"Mana depletion reduces power effectiveness",
	"Illusionary duplicates confuse ascendants",
	"Rift rank increases mid-encounter",
	"Monster evolution triggers",
];

const GATE_REWARDS = [
	"Standard core yield",
	"Enhanced core (double value)",
	"Rare material drop",
	"Relic fragment",
	"System favor bonus",
	"Experience multiplier",
	"Unique monster part",
	"Rift completion bonus",
	"Hidden treasure cache",
	"Regent blessing",
	"Skill point bonus",
	"Legendary core shard",
];

const GATE_HAZARDS = [
	"Mana vortex (random teleportation)",
	"Shadow trap (damage + condition)",
	"Collapsing structure",
	"Poisonous miasma",
	"Extreme temperature zone",
	"Gravity distortion",
	"Time dilation field",
	"Mana drain zone",
	"Monster spawning point",
	"Core radiation",
	"Dimensional rift",
	"System interference",
];

const NPC_MOTIVATIONS = [
	"Seeking power through Rifts",
	"Protecting loved ones",
	"Revenge against monsters",
	"Researching Rift phenomena",
	"Building an ascendant organization",
	"Seeking the Umbral Regent",
	"Escaping past trauma",
	"Proving their worth",
	"Accumulating wealth",
	"Uncovering secrets",
	"Protecting humanity",
	"Achieving immortality",
];

const NPC_SECRETS = [
	"Former S-Rank ascendant (lost power)",
	"Working for a Regent",
	"Has a cursed relic",
	"Knows about the reset",
	"Is actually a monster",
	"Has System favor debt",
	"Betrayed their Ascendant team",
	"Seeking forbidden knowledge",
	"Has a hidden Rift",
	"Is being hunted",
	"Knows the Prime Architect personally",
	"Has a duplicate identity",
];

const GATE_THEMES = [
	"Abyssal Realm (undead focus)",
	"Elemental Chaos (elemental focus)",
	"Beast Domain (animal focus)",
	"Construct Forge (construct focus)",
	"Abyssal Depths (fiend focus)",
	"Celestial Spire (celestial focus)",
	"Prime Architect's Domain (shadow focus)",
	"Necromantic Lab (undead + construct)",
	"Mana Nexus (elemental + aberration)",
	"Umbral Regent's Memory",
	"System Testing Ground",
	"Post-Reset Fragment",
];

const GATE_BIOMES = [
	"Urban ruins",
	"Dark forest",
	"Underground caverns",
	"Floating platforms",
	"Crystal caves",
	"Shadow wasteland",
	"Mana-infused jungle",
	"Frozen tundra",
	"Volcanic depths",
	"Sky fortress",
	"Underwater ruins",
	"Dimensional pocket",
];

const TREASURE_TIERS = {
	"E-Rank": [
		"Common relic (dormant)",
		"Basic materials",
		"Standard credits",
		"Minor consumables",
		"Low-tier equipment",
	],
	"D-Rank": [
		"Uncommon relic (dormant)",
		"Quality materials",
		"Enhanced credits",
		"Useful consumables",
		"Mid-tier equipment",
	],
	"C-Rank": [
		"Rare relic (dormant/awakened)",
		"Rare materials",
		"Significant credits",
		"Powerful consumables",
		"High-tier equipment",
	],
	"B-Rank": [
		"Very rare relic (awakened)",
		"Exotic materials",
		"Large credit sum",
		"Legendary consumables",
		"Masterwork equipment",
	],
	"A-Rank": [
		"Legendary relic (awakened/resonant)",
		"Legendary materials",
		"Massive credit sum",
		"Unique consumables",
		"Artifact equipment",
	],
	"S-Rank": [
		"Regent relic (resonant)",
		"Regent materials",
		"Incredible credit sum",
		"System-granted consumables",
		"Regent equipment",
	],
};

function rollTable<T>(table: T[]): T {
	return table[Math.floor(Math.random() * table.length)];
}

type RollableTablesState = {
	activeTab: "gates" | "rewards" | "npcs" | "treasure";
	results: Record<string, string>;
};

const RollableTables = () => {
	const navigate = useNavigate();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<RollableTablesState>("rollable_tables", {
		initialState: {
			activeTab: "gates",
			results: {},
		},
		storageKey: "solo-compendium.PW-tools.rollable-tables.v1",
	});

	const { user } = useAuth();
	const { campaignId: selectedCampaignId } =
		usePreferredCampaignSelection("rollable_tables");
	const { toast } = useToast();

	const [activeTab, setActiveTab] =
		useState<RollableTablesState["activeTab"]>("gates");
	const [results, setResults] = useState<Record<string, string>>({});

	const hydrated = useMemo(() => {
		return {
			activeTab: storedState.activeTab ?? "gates",
			results: storedState.results ?? {},
		} satisfies RollableTablesState;
	}, [storedState.activeTab, storedState.results]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setActiveTab(hydrated.activeTab);
		setResults(hydrated.results);
		hydratedRef.current = true;
	}, [hydrated.activeTab, hydrated.results, isLoading]);

	const savePayload = useMemo(
		() => ({ activeTab, results }) satisfies RollableTablesState,
		[activeTab, results],
	);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance } = useAIEnhance();

	const handleAIEnhance = async () => {
		const filledResults = Object.entries(results).filter(([, v]) => v);
		if (filledResults.length === 0) return;
		const seed = `Expand these rollable table results into fully detailed TTRPG content for a System Ascendant campaign.

ROLLED RESULTS:
${filledResults.map(([key, value]) => `- ${key}: ${value}`).join("\n")}

For EACH result, provide:
1. Full description (2-3 sentences) with sensory details and atmosphere
2. Mechanical effects: DCs, damage, conditions, durations, saves as applicable
3. Lore context: How it connects to Rifts, Regents, the System, Ascendants
4. Tactical implications: How players/PW should use this in play
5. Follow-up hooks: What this result leads to next`;
		await enhance("table-results", seed);
	};

	const roll = (key: string, table: string[]) => {
		const result = formatRegentVernacular(rollTable(table));
		setResults((prev) => {
			const next = { ...prev, [key]: result };
			if (hydratedRef.current && !isLoading) {
				void saveNow({ activeTab, results: next });
			}
			return next;
		});
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
				message_type: "system",
				content: `**[PW Rolled ${title}]**\n${content}`,
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
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-protocols")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to System Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Protocol Warden Tables
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Rollable tables from the Protocol Warden's Guide, adapted for the
						post-reset world.
					</DataStreamText>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={(value) => {
						const nextTab = value as RollableTablesState["activeTab"];
						setActiveTab(nextTab);
						if (hydratedRef.current && !isLoading) {
							void saveNow({ activeTab: nextTab, results });
						}
					}}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="gates">Rifts</TabsTrigger>
						<TabsTrigger value="rewards">Rewards</TabsTrigger>
						<TabsTrigger value="npcs">NPCs</TabsTrigger>
						<TabsTrigger value="treasure">Treasure</TabsTrigger>
					</TabsList>

					<TabsContent value="gates" className="space-y-4 mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<SystemWindow title="RIFT COMPLICATIONS">
								<div className="space-y-3">
									<Button
										onClick={() => roll("complication", GATE_COMPLICATIONS)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Complication
									</Button>
									{results.complication && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="destructive" className="mb-2">
												Complication
											</Badge>
											<p className="font-heading">{results.complication}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign(
														"Rift Complication",
														results.complication,
													)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>

							<SystemWindow title="RIFT HAZARDS">
								<div className="space-y-3">
									<Button
										onClick={() => roll("hazard", GATE_HAZARDS)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Hazard
									</Button>
									{results.hazard && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="destructive" className="mb-2">
												Hazard
											</Badge>
											<p className="font-heading">{results.hazard}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign("Rift Hazard", results.hazard)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>

							<SystemWindow title="RIFT THEMES">
								<div className="space-y-3">
									<Button
										onClick={() => roll("theme", GATE_THEMES)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Theme
									</Button>
									{results.theme && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="secondary" className="mb-2">
												Theme
											</Badge>
											<p className="font-heading">{results.theme}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign("Rift Theme", results.theme)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>

							<SystemWindow title="RIFT BIOMES">
								<div className="space-y-3">
									<Button
										onClick={() => roll("biome", GATE_BIOMES)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Biome
									</Button>
									{results.biome && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="secondary" className="mb-2">
												Biome
											</Badge>
											<p className="font-heading">{results.biome}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign("Rift Biome", results.biome)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>
						</div>
					</TabsContent>

					<TabsContent value="rewards" className="space-y-4 mt-6">
						<SystemWindow title="RIFT REWARDS">
							<div className="space-y-3">
								<Button
									onClick={() => roll("reward", GATE_REWARDS)}
									className="w-full gap-2"
								>
									<Dice6 className="w-4 h-4" />
									Roll Reward
								</Button>
								{results.reward && (
									<div className="p-3 rounded border bg-muted/30 relative group">
										<Badge variant="default" className="mb-2">
											Reward
										</Badge>
										<p className="font-heading">{results.reward}</p>
										<Button
											size="sm"
											variant="ghost"
											className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() =>
												shareToCampaign("Rift Reward", results.reward)
											}
										>
											Share
										</Button>
									</div>
								)}
							</div>
						</SystemWindow>
					</TabsContent>

					<TabsContent value="npcs" className="space-y-4 mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<SystemWindow title="NPC MOTIVATIONS">
								<div className="space-y-3">
									<Button
										onClick={() => roll("motivation", NPC_MOTIVATIONS)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Motivation
									</Button>
									{results.motivation && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="secondary" className="mb-2">
												Motivation
											</Badge>
											<p className="font-heading">{results.motivation}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign("NPC Motivation", results.motivation)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>

							<SystemWindow title="NPC SECRETS">
								<div className="space-y-3">
									<Button
										onClick={() => roll("secret", NPC_SECRETS)}
										className="w-full gap-2"
									>
										<Dice6 className="w-4 h-4" />
										Roll Secret
									</Button>
									{results.secret && (
										<div className="p-3 rounded border bg-muted/30 relative group">
											<Badge variant="destructive" className="mb-2">
												Secret
											</Badge>
											<p className="font-heading">{results.secret}</p>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() =>
													shareToCampaign("NPC Secret", results.secret)
												}
											>
												Share
											</Button>
										</div>
									)}
								</div>
							</SystemWindow>
						</div>
					</TabsContent>

					<TabsContent value="treasure" className="space-y-4 mt-6">
						<SystemWindow title="TREASURE BY RIFT RANK">
							<div className="space-y-4">
								{Object.entries(TREASURE_TIERS).map(([rank, items]) => (
									<div key={rank} className="border rounded p-3">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-heading font-semibold">
												{rank} Rifts
											</h3>
											<Button
												size="sm"
												variant="outline"
												onClick={() => roll(`treasure-${rank}`, items)}
												className="gap-2"
											>
												<Dice6 className="w-3 h-3" />
												Roll
											</Button>
										</div>
										{results[`treasure-${rank}`] && (
											<div className="mt-2 p-2 rounded bg-muted/30 relative group">
												<Badge variant="default" className="mb-1">
													{rank}
												</Badge>
												<p className="font-heading text-sm">
													{results[`treasure-${rank}`]}
												</p>
												<Button
													size="sm"
													variant="ghost"
													className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-xs"
													onClick={() =>
														shareToCampaign(
															`Treasure (${rank})`,
															results[`treasure-${rank}`],
														)
													}
												>
													Share
												</Button>
											</div>
										)}
										<div className="text-xs text-muted-foreground mt-2">
											{items.map(formatRegentVernacular).join(", ")}
										</div>
									</div>
								))}
							</div>
						</SystemWindow>
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
							<SystemWindow title="AI-ENHANCED RESULTS">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-display text-primary">
										AI-ENHANCED DETAILS
									</span>
								</div>
								<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
									{enhancedText}
								</div>
							</SystemWindow>
						)}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default RollableTables;
