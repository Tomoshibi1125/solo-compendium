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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatRegentVernacular } from "@/lib/vernacular";

const WORLD_EVENTS = [
	"Rift Surge: Multiple Rifts appear simultaneously in an area",
	"Awakened Council Alert: High-priority mission issued",
	"Umbral Regent Fragment Detected: Powerful energy signature located",
	"Mana Storm: Abnormal mana concentration causes strange phenomena",
	"Guild Conflict: Two major guilds have a territorial dispute",
	"Mysterious Disappearances: Ascendants go missing in a specific area",
	"New Rift Rank Discovered: Previously unknown Rift rank appears",
	"System Anomaly: The System behaves unexpectedly",
	"Regent Activity: Evidence of Regent presence detected",
	"Relic Discovery: Ancient relic found, causing a rush",
	"Rift Breach: A Rift fails to close properly",
	"Ascendant Awakening Event: Multiple new Ascendants awaken at once",
	"Corporate Interest: Large corporation takes interest in Rift activity",
	"Media Attention: Rift incident draws public attention",
	"Political Movement: Government interference with Ascendant operations",
	"Ancient Rift Opens: Long-dormant Rift activates",
	"Shadow Corruption Spread: Shadow energy spreads beyond Rifts",
	"Awakened Council Scandal: Internal conflict revealed",
	"Rift Ecology Change: Monsters adapt or mutate unexpectedly",
	"Divine Intervention: Prime Architect's influence becomes visible",
];

const NPC_ENCOUNTERS = [
	"Rival Ascendant Team: Encounter competitive ascendants",
	"Information Broker: NPC offers valuable information",
	"Wounded Ascendant: Needs assistance or has a warning",
	"Mysterious Stranger: NPC with unclear motives",
	"Rift Survivor: Civilian trapped in Rift needs help",
	"Awakened Council Agent: Official with a mission",
	"Relic Merchant: Sells or trades relics",
	"Rift Researcher: Scientist studying Rifts",
	"Former S-Rank: Retired ascendant with stories and advice",
	"Umbral Legionnaire: Encounter with a shadow creature",
	"Regent Cultist: Dangerous individual with Regent ties",
	"Protocol Warden: Experienced Warden offers guidance",
	"Corporate Representative: Business person with an offer",
	"Media Reporter: Journalist investigating Rifts",
	"Child Ascendant: Young awakened individual in danger",
];

const COMPLICATIONS = [
	"Weather turns severe",
	"Communication devices malfunction",
	"Unexpected monster reinforcements",
	"Time distortion affects area",
	"Allies turn hostile",
	"Environmental hazard activates",
	"Rift structure changes",
	"Shadow corruption spreads",
	"Third party intervenes",
	"Information is misleading or false",
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
	let title = "";
	let description = "";
	let impact = "";

	if (type === "world") {
		const event = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
		title = "World Event";
		description = formatRegentVernacular(event);
		impact =
			"This event affects the larger world and may create new opportunities or complications for the party.";
	} else if (type === "encounter") {
		const encounter =
			NPC_ENCOUNTERS[Math.floor(Math.random() * NPC_ENCOUNTERS.length)];
		title = "NPC Encounter";
		description = formatRegentVernacular(encounter);
		impact =
			"This encounter can provide roleplay opportunities, information, resources, or complications.";
	} else {
		const complication =
			COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)];
		title = "Complication";
		description = formatRegentVernacular(complication);
		impact =
			"This complication adds difficulty or urgency to the current situation.";
	}

	return { type, title, description, impact };
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
		storageKey: "solo-compendium.dm-tools.random-event-generator.v1",
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
						Systemic Entropy Generator
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Induce non-deterministic anomalies, unpredicted conceptual entities,
						and localized destabilization protocols into active regions.
					</DataStreamText>
				</div>

				<SystemWindow title="GENERATE EVENT" className="mb-6">
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
									const seed = `Generate a complete, detailed random event for a System Ascendant TTRPG campaign.

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
5. LORE: How the event ties to Rift activity, Regent domains, System anomalies
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
				</SystemWindow>

				{event && (
					<SystemWindow title={event.title} className="mb-6">
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
											<SystemText className="block text-sm text-muted-foreground">
												{event.impact}
											</SystemText>
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
					</SystemWindow>
				)}

				<SystemWindow title="EVENT TYPES" variant="quest">
					<div className="space-y-4 text-sm">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 rounded-lg border border-purple-400/30 bg-purple-400/10">
								<h4 className="font-heading font-semibold text-purple-400 mb-2">
									World Events
								</h4>
								<SystemText className="block text-muted-foreground text-xs">
									Large-scale events that affect the world or region. Use these
									for major plot developments.
								</SystemText>
							</div>
							<div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
								<h4 className="font-heading font-semibold text-blue-400 mb-2">
									NPC Encounters
								</h4>
								<SystemText className="block text-muted-foreground text-xs">
									Random encounters with NPCs that can provide opportunities,
									information, or complications.
								</SystemText>
							</div>
							<div className="p-4 rounded-lg border border-orange-400/30 bg-orange-400/10">
								<h4 className="font-heading font-semibold text-orange-400 mb-2">
									Complications
								</h4>
								<SystemText className="block text-muted-foreground text-xs">
									Unexpected complications that add difficulty or urgency to
									current situations.
								</SystemText>
							</div>
						</div>
					</div>
				</SystemWindow>
			</div>
		</Layout>
	);
};

export default RandomEventGenerator;
