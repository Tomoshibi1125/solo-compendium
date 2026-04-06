import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	Loader2,
	RefreshCw,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatRegentVernacular } from "@/lib/vernacular";

const WORLD_EVENTS: { description: string; impact: string }[] = [
	{
		description:
			"Rift Surge: Multiple Type-II Rifts have manifested across the sector, causing localized reality thinning.",
		impact:
			"All Rift-related skill checks are made with DISADVANTAGE; Mana-recovery rates are increased by 50% for 24 hours.",
	},
	{
		description:
			"Awakened Council Lockdown: The Council has issued an 'Orange Protocol' alert, restricting all non-sanctioned travel.",
		impact:
			"Presence checks against official NPCs are DC 20; forged permits are required for sector transit.",
	},
	{
		description:
			"Umbral Regent Fragment: A high-density energy signature corresponding to an Umbral Regent has been detected in a nearby subway terminal.",
		impact:
			"A Level-appropriate Elite encounter is triggered; party gains 2500 bonus Exp if the fragment is contained within 3 rounds.",
	},
	{
		description:
			"Mana Storm: High-frequency atmospheric mana discharge is interfering with bio-electric signals.",
		impact:
			"All Long-Range communication is JAMMED; spellcasters must succeed on a DC 14 Sense save or lose 1 random spell slot.",
	},
	{
		description:
			"System Calibration: The Global System is undergoing a scheduled 'Integrity Sweep,' temporarily disabling auto-looting and map overlays.",
		impact:
			"Navigation checks are DC 18; Survival checks for tracking are required to avoid getting lost.",
	},
	{
		description:
			"Guild Proxy War: The Iron Legion and the Azure Wing are engaged in an open territory dispute in the commercial district.",
		impact:
			"Combat encounters may involve a third party; prices for all consumables are increased by 200% due to rationing.",
	},
	{
		description:
			"Shadow Corruption Leak: A ruptured Shadow Containment Unit is leaking concentrated miasma into the groundwater.",
		impact:
			"Vitality saves (DC 15) required every 4 hours or gain 1 level of Exhaustion; water-based healing is ineffective.",
	},
	{
		description:
			"The Absolute's Decree: A localized 'Safe Zone' has been established by the Rift's core logic.",
		impact:
			"Hostile entities cannot enter the 1-mile radius; all healing during Short Rests is doubled within the zone.",
	},
];

const NPC_ENCOUNTERS: { description: string; impact: string }[] = [
	{
		description:
			"The Information Broker 'Zero': A masked individual offering decrypted council logs for a steep price.",
		impact:
			"NPC can reveal 1 hidden plot point for 50,000 Credits or a Rare Relic; failing a Persuasion check reveals the party's location to enemies.",
	},
	{
		description:
			"A Wounded Sentinel: An elite Council enforcer found pinned under Rift debris, clutching a sealed data drive.",
		impact:
			"Rescue (DC 18 Medicine/Strength) awards a 'Council Favor' (Advantage on next Council interaction); leaving them results in a 'Bounty' mark.",
	},
	{
		description:
			"The Wandering Merchant 'Kyros': A neutral-aligned inter-dimensional entity trading Void-Data for soul-bound items.",
		impact:
			"Allows the party to trade 1 permanent stat point for a random Legendary Sigil; trade is irreversible.",
	},
	{
		description:
			"Rogue AI Fragment: A fragmented holographic entity appearing as a distorted version of the party's Warden.",
		impact:
			"Intelligence check (DC 16) to stabilize; success grants +2 to all Hack/System checks for the duration of the mission.",
	},
	{
		description:
			"S-Rank Deserter: A legendary walker who has 'disconnected' from the Rift, hiding in the slums.",
		impact:
			"Provides a 'Manual of the Hidden Path' (+1 to Sense) if convinced of the party's discretion; failing to hide encounter alerts the Council.",
	},
];

const COMPLICATIONS: { description: string; impact: string }[] = [
	{
		description:
			"Chronal Distortion: Time is flowing irregularly. Seconds stretch into minutes, then snap back violently.",
		impact:
			"All participants roll 1d20 for initiative at the start of EVERY round; -10ft to movement for all entities.",
	},
	{
		description:
			"Gravity Well: A localized rift anomaly has increased the gravitational constant by 4x.",
		impact:
			"Movement speed is HALVED; Jump distance is 0; falling damage is tripled; Heavy Carapace Armor users must save (DC 15 STR) or be restrained.",
	},
	{
		description:
			"System Static: Visual and auditory sensors are being flooded with meaningless binary data.",
		impact:
			"All creatures have 'Partial Concealment' (20% miss chance); Perception checks are made with DISADVANTAGE.",
	},
	{
		description:
			"Mana Osmosis: The environment is actively draining mana directly from biological hosts.",
		impact:
			"Lose 1 MP or 1 Spell Slot every 2 rounds of combat; non-casters lose 1d6 HP every turn as their life force is sapped.",
	},
	{
		description:
			"Reality Bleed: The barrier between Earth and the Void has vanished here. Conceptual horrors are visible.",
		impact:
			"Sanity check (DC 14 Sense Save) per round or become 'Frightened' for 1 minute; Psychic damage is doubled in this region.",
	},
];

interface GeneratedEvent {
	type: "world" | "encounter" | "complication";
	title: string;
	description: string;
	impact: string;
}

function generateEvent(
	type: "world" | "encounter" | "complication",
): GeneratedEvent {
	let selection: { description: string; impact: string };
	let title = "";

	if (type === "world") {
		selection = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
		title = "Systemic World Displacement";
	} else if (type === "encounter") {
		selection =
			NPC_ENCOUNTERS[Math.floor(Math.random() * NPC_ENCOUNTERS.length)];
		title = "Significant Entity Interaction";
	} else {
		selection = COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)];
		title = "Hazardous Environmental Anomaly";
	}

	return {
		type,
		title,
		description: formatRegentVernacular(selection.description),
		impact: formatRegentVernacular(selection.impact),
	};
}

const RandomEventGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{
		eventType: GeneratedEvent["type"];
		event: GeneratedEvent | null;
	}>("random_event_generator", {
		initialState: {
			eventType: "world",
			event: null,
		},
		storageKey: "solo-compendium.Warden-tools.random-event-generator.v1",
	});

	const [eventType, setEventType] = useState<GeneratedEvent["type"]>("world");
	const [event, setEvent] = useState<GeneratedEvent | null>(null);

	const hydrated = useMemo(() => {
		return {
			eventType: storedState.eventType ?? "world",
			event: storedState.event ?? null,
		};
	}, [storedState.event, storedState.eventType]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setEventType(hydrated.eventType);
		setEvent(hydrated.event);
		hydratedRef.current = true;
	}, [hydrated.event, hydrated.eventType, isLoading]);

	const savePayload = useMemo(() => ({ eventType, event }), [event, eventType]);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const handleGenerate = () => {
		const result = generateEvent(eventType);
		setEvent(result);
	};

	const handleCopy = () => {
		if (!event) return;
		const text = `${event.title}: ${event.description}\n\nImpact: ${event.impact}`;
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Event copied to clipboard.",
		});
	};

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const getEventColor = (type: string) => {
		switch (type) {
			case "world":
				return "text-purple-400 border-purple-400/30 bg-purple-400/10";
			case "encounter":
				return "text-blue-400 border-blue-400/30 bg-blue-400/10";
			case "complication":
				return "text-orange-400 border-orange-400/30 bg-orange-400/10";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
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
						Systemic Entropy Generator
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Induce non-deterministic anomalies, unpredicted conceptual entities,
						and localized destabilization protocols into active regions.
					</ManaFlowText>
				</div>

				<AscendantWindow title="GENERATE EVENT" className="mb-6">
					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-2">
							<Button
								variant={eventType === "world" ? "default" : "outline"}
								onClick={() => setEventType("world")}
								className="flex-1"
							>
								World Event
							</Button>
							<Button
								variant={eventType === "encounter" ? "default" : "outline"}
								onClick={() => setEventType("encounter")}
								className="flex-1"
							>
								NPC Encounter
							</Button>
							<Button
								variant={eventType === "complication" ? "default" : "outline"}
								onClick={() => setEventType("complication")}
								className="flex-1"
							>
								Complication
							</Button>
						</div>

						<Button
							onClick={() => {
								clearEnhanced();
								handleGenerate();
							}}
							className="w-full btn-umbral"
							size="lg"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							Generate{" "}
							{eventType === "world"
								? "World Event"
								: eventType === "encounter"
									? "NPC Encounter"
									: "Complication"}
						</Button>
						{event && (
							<Button
								onClick={async () => {
									if (!event) return;
									const seed = `Generate a complete, detailed random event for a Rift Ascendant TTRPG campaign.

SEED DATA:
- Type: ${event.type}
- Title: ${event.title}
- Description: ${event.description}
- Impact: ${event.impact}

Provide ALL of the following sections with full detail:

1. DESCRIPTION: Read-aloud boxed text (2-3 paragraphs) with sensory details
2. MECHANICS: Skill checks required (DCs), combat triggers, environmental effects
3. CONSEQUENCES: Success/failure/partial outcomes with mechanical effects (HP, conditions, items)
4. NPCs INVOLVED: Brief stat blocks (AC/HP/CR) or compendium references
5. LORE: How the event ties to Rift activity, Regent domains, Rift anomalies
6. FOLLOW-UP: 2-3 sequel hooks this event creates for future sessions
7. TACTICAL OPTIONS: What clever players might do, alternative approaches`;
									await enhance("event", seed);
								}}
								className="w-full gap-2 mt-2"
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
					</div>
				</AscendantWindow>

				{event && (
					<AscendantWindow title={event.title} className="mb-6">
						<div className="space-y-4">
							<Badge className={getEventColor(event.type)}>
								{event.type.toUpperCase()}
							</Badge>

							<div className="pt-2">
								<p className="text-lg font-heading mb-4">{event.description}</p>
								<div className="p-4 rounded-lg bg-muted/30 border border-border">
									<div className="flex items-start gap-2">
										<AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
										<div>
											<h4 className="font-heading font-semibold mb-1">
												Impact
											</h4>
											<AscendantText className="block text-sm text-muted-foreground">
												{event.impact}
											</AscendantText>
										</div>
									</div>
								</div>
							</div>

							{enhancedText && (
								<div className="pt-4 border-t border-primary/30">
									<div className="flex items-center gap-2 mb-2">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-xs font-display text-primary">
											AI-ENHANCED DETAILS
										</span>
									</div>
									<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
										{enhancedText}
									</div>
								</div>
							)}

							<div className="flex gap-2 pt-2">
								<Button
									onClick={handleCopy}
									variant="outline"
									className="flex-1"
								>
									<Copy className="w-4 h-4 mr-2" />
									Copy Event
								</Button>
								<Button
									onClick={() => {
										clearEnhanced();
										handleGenerate();
									}}
									variant="outline"
									className="flex-1"
								>
									<RefreshCw className="w-4 h-4 mr-2" />
									Regenerate
								</Button>
							</div>
						</div>
					</AscendantWindow>
				)}

				<AscendantWindow title="EVENT TYPES" variant="quest">
					<div className="space-y-4 text-sm">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 rounded-lg border border-purple-400/30 bg-purple-400/10">
								<h4 className="font-heading font-semibold text-purple-400 mb-2">
									World Events
								</h4>
								<AscendantText className="block text-muted-foreground text-xs">
									Large-scale events that affect the world or region. Use these
									for major plot developments.
								</AscendantText>
							</div>
							<div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
								<h4 className="font-heading font-semibold text-blue-400 mb-2">
									NPC Encounters
								</h4>
								<AscendantText className="block text-muted-foreground text-xs">
									Random encounters with NPCs that can provide opportunities,
									information, or complications.
								</AscendantText>
							</div>
							<div className="p-4 rounded-lg border border-orange-400/30 bg-orange-400/10">
								<h4 className="font-heading font-semibold text-orange-400 mb-2">
									Complications
								</h4>
								<AscendantText className="block text-muted-foreground text-xs">
									Unexpected complications that add difficulty or urgency to
									current situations.
								</AscendantText>
							</div>
						</div>
					</div>
				</AscendantWindow>
			</div>
		</Layout>
	);
};

export default RandomEventGenerator;
