import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	Copy,
	Loader2,
	Plus,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import { getRandomEquipment } from "@/lib/compendiumAutopopulate";
import { MONARCH_LABEL } from "@/lib/vernacular";

interface RelicProperty {
	id: string;
	name: string;
	description: string;
	type: "passive" | "active" | "bonus";
}

export interface Relic {
	id: string;
	name: string;
	type: "weapon" | "armor" | "accessory" | "tool";
	rank: string;
	description: string;
	properties: RelicProperty[];
	attunement: boolean;
	rarity: "common" | "uncommon" | "rare" | "very-rare" | "legendary";
}

const RELIC_RANKS = ["E", "D", "C", "B", "A", "S"];
const RELIC_TYPES = ["weapon", "armor", "accessory", "tool"];
const RARITY_LEVELS = ["common", "uncommon", "rare", "very-rare", "legendary"];

const BALANCE_GUIDELINES = {
	common: {
		properties: 1,
		maxBonus: 1,
		description:
			"Basic relics with simple benefits. +1 to attacks or AC, minor utility.",
	},
	uncommon: {
		properties: 1 - 2,
		maxBonus: 2,
		description:
			"Improved relics. +1 to attacks and damage, or +2 AC, minor active abilities.",
	},
	rare: {
		properties: 2 - 3,
		maxBonus: 3,
		description:
			"Powerful relics. +2 bonuses, significant active abilities, or unique effects.",
	},
	"very-rare": {
		properties: 3 - 4,
		maxBonus: 4,
		description:
			"Exceptional relics. +3 bonuses, powerful active abilities, multiple effects.",
	},
	legendary: {
		properties: 4 - 5,
		maxBonus: 5,
		description:
			"Artifact-level relics. +4 or higher bonuses, game-changing abilities.",
	},
};

const RelicWorkshop = () => {
	const navigate = useNavigate();
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
		storageKey: "dm-relics",
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
		const seed = `Generate a complete, detailed relic for a System Ascendant TTRPG campaign.

SEED DATA:
- Name: ${currentRelic.name}
- Type: ${currentRelic.type}
- Rank: ${currentRelic.rank}
- Rarity: ${currentRelic.rarity}
- Attunement: ${currentRelic.attunement ? "Yes" : "No"}
- Description: ${currentRelic.description || "None provided"}
- Properties: ${currentRelic.properties.map((p) => `${p.name} (${p.type}): ${p.description}`).join("; ") || "None"}

Provide ALL of the following sections with full detail:

1. STATS: Type, rarity, attunement requirements, weight, value in GP
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
		const text = `RELIC: ${currentRelic.name}
Type: ${currentRelic.type}
Rank: ${currentRelic.rank}
Rarity: ${currentRelic.rarity}
Attunement: ${currentRelic.attunement ? "Required" : "None"}
Description: ${currentRelic.description || "None provided"}
Properties: ${currentRelic.properties.map((p) => `${p.name} (${p.type}): ${p.description}`).join("; ") || "None"}

---
D&D BEYOND STYLE RELIC STAT BLOCK:

STATS:
• Type: ${currentRelic.type}
• Rarity: ${currentRelic.rarity}
• Attunement: ${currentRelic.attunement ? `Required by character of ${currentRelic.rank} Rank or higher` : "None required"}
• Weight: [Standard for ${currentRelic.type} type]
• Value: [${currentRelic.rarity === "legendary" ? "10,000+" : currentRelic.rarity === "very-rare" ? "5,000+" : currentRelic.rarity === "rare" ? "2,000+" : currentRelic.rarity === "uncommon" ? "500+" : "100+"} GP]

PROPERTIES:
${
	currentRelic.properties
		.map(
			(property, i) => `${i + 1}. ${property.name} (${property.type}):
   • Effect: ${property.description}
   • Activation: [Action type and requirements]
   • Uses: [Per day or recharge]
   • Duration: [Effect duration]
   • Save DC: [If applicable]`,
		)
		.join("\n\n") || "None"
}

ABILITIES:
ABILITY 1: [Primary ability name]
• Description: [How the ability functions]
• Activation: [Action, bonus action, or reaction]
• Duration: [Instant, concentration, or timed]
• Recharge: [How often it can be used]

ABILITY 2: [Secondary ability name]
• Description: [Supporting or defensive function]
• Activation: [Usage requirements]
• Duration: [Effect length]
• Recharge: [Reset conditions]

${
	currentRelic.rarity === "rare" ||
	currentRelic.rarity === "very-rare" ||
	currentRelic.rarity === "legendary"
		? `ABILITY 3: [Advanced ability]
• Description: [High-level function]
• Activation: [Complex requirements]
• Duration: [Extended effect]
• Recharge: [Limited usage]`
		: ""
}

${
	currentRelic.rarity === "very-rare" || currentRelic.rarity === "legendary"
		? `ABILITY 4: [Ultimate ability]
• Description: [Maximum power effect]
• Activation: [Special conditions]
• Duration: [Permanent or very long]
• Recharge: [Once per day or week]`
		: ""
}

CURSE/BLESSING:
${
	currentRelic.rarity === "rare" ||
	currentRelic.rarity === "very-rare" ||
	currentRelic.rarity === "legendary"
		? `• Curse: [Negative effect and removal conditions]
• Blessing: [Positive effect and activation]`
		: "• None"
}

LORE:
• Creation Story: [How this relic was forged]
• Legendary Wielders: [Famous past users]
• Connection to Regents: [Which Regent domain influenced its creation]
• Rift Origins: [If created from Rift materials]
• System Significance: [Why the System created this item]

ATTUNEMENT RITUAL:
"[Flavor text describing the attunement process, including any special requirements, ceremonies, or personal sacrifices needed to bond with the relic]"

COMBAT USE:
• Primary Function: [How to use in combat situations]
• Synergies: [Works best with specific jobs/paths]
• Tactical Advantages: [Strategic benefits in battle]
• Limitations: [Restrictions or drawbacks]

DESCRIPTION:
${currentRelic.description || "No description provided"}

READ-ALOUD DISCOVERY:
"[Detailed description of how the players discover this relic, including its appearance, any magical aura, and initial impressions of its power]"`;

		navigator.clipboard.writeText(text);
		toast({
			title: "Copied",
			description: "Complete relic stat block copied to clipboard.",
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
			"very-rare": "text-purple-400 border-purple-400/30 bg-purple-400/10",
			legendary: "text-amber-400 border-amber-400/30 bg-amber-400/10",
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

	const guideline = BALANCE_GUIDELINES[currentRelic.rarity];

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Relic Synthesis Chamber
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Forge specialized armaments and conceptual objects functioning
						outside normative System constraints.
					</DataStreamText>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<SystemWindow title="RELIC DESIGN">
							<div className="space-y-4">
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
												{RARITY_LEVELS.map((rarity) => (
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
						</SystemWindow>

						<SystemWindow title="ADD PROPERTY">
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
												<SelectItem value="passive">Passive</SelectItem>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="bonus">Bonus</SelectItem>
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
						</SystemWindow>

						<SystemWindow title="PROPERTIES">
							{currentRelic.properties.length === 0 ? (
								<SystemText className="block text-muted-foreground text-center py-4">
									No properties yet. Add properties to define the relic's
									abilities.
								</SystemText>
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
						</SystemWindow>
					</div>

					<div className="space-y-6">
						<SystemWindow title="BALANCE GUIDE" variant="quest">
							<div className="space-y-4">
								<Badge className={getRarityColor(currentRelic.rarity)}>
									{currentRelic.rarity.toUpperCase().replace("-", " ")}
								</Badge>
								<SystemText className="block text-sm text-muted-foreground">
									{guideline.description}
								</SystemText>
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
						</SystemWindow>

						<SystemWindow title="RELIC PREVIEW">
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
											{currentRelic.rarity}
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
								<SystemText className="block text-muted-foreground text-sm text-center py-4">
									Relic preview will appear here
								</SystemText>
							)}
						</SystemWindow>
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
							<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
								<AutoLinkText text={enhancedText || ""} />
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default RelicWorkshop;
