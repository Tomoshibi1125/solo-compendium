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
import {
	EVENT_COMPLICATIONS,
	NPC_ENCOUNTERS,
	type WardenEventTableEntry,
	WORLD_EVENTS,
} from "@/data/wardenGeneratorContent";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

interface GeneratedEvent {
	type: "world" | "encounter" | "complication";
	title: string;
	description: string;
	impact: string;
	linkedContent?: WardenLinkedEntry[];
}

function generateEvent(
	type: "world" | "encounter" | "complication",
): GeneratedEvent {
	let selection: WardenEventTableEntry;
	let title = "";

	if (type === "world") {
		selection = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
		title = "Systemic World Displacement";
	} else if (type === "encounter") {
		selection =
			NPC_ENCOUNTERS[Math.floor(Math.random() * NPC_ENCOUNTERS.length)];
		title = "Significant Entity Interaction";
	} else {
		selection =
			EVENT_COMPLICATIONS[
				Math.floor(Math.random() * EVENT_COMPLICATIONS.length)
			];
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

	const handleGenerate = async () => {
		const result = generateEvent(eventType);
		const generationContext = await loadWardenGenerationContext({
			types: [
				"locations",
				"anomalies",
				"conditions",
				"items",
				"equipment",
				"relics",
				"regents",
			],
		});
		const linkedContent =
			eventType === "world"
				? [
						...generationContext.pickMany("locations", 1, {
							theme: result.description,
						}),
						...generationContext.pickMany("regents", 1, {
							theme: result.impact,
						}),
					]
				: eventType === "encounter"
					? [
							...generationContext.pickMany("anomalies", 1, {
								theme: result.description,
							}),
							...generationContext.pickMany("equipment", 1, {
								theme: result.impact,
							}),
						]
					: [
							...generationContext.pickMany("conditions", 1, {
								theme: result.description,
							}),
							...generationContext.pickMany("items", 1, {
								theme: result.impact,
							}),
							...generationContext.pickMany("relics", 1, {
								theme: result.impact,
							}),
						].slice(0, 2);
		result.linkedContent = linkedContent.slice(0, 3);
		if (result.linkedContent.length > 0) {
			result.description = `${result.description} Linked compendium signals: ${result.linkedContent.map((entry) => entry.name).join(", ")}.`;
		}
		setEvent(result);
	};

	const handleCopy = () => {
		if (!event) return;
		const linked =
			event.linkedContent?.map((entry) => `${entry.name} (${entry.type})`) ||
			[];
		const text = `${event.title}: ${event.description}\n\nImpact: ${event.impact}${linked.length > 0 ? `\n\nLinked Content: ${linked.join(", ")}` : ""}`;
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
								void handleGenerate();
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
- Linked Content: ${event.linkedContent?.map((entry) => `${entry.name} (${entry.type})`).join("; ") || "None"}

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

							{event.linkedContent && event.linkedContent.length > 0 && (
								<div className="pt-2">
									<h4 className="font-heading font-semibold mb-2">
										Linked Compendium Signals
									</h4>
									<div className="flex flex-wrap gap-2">
										{event.linkedContent.map((entry) => (
											<Badge
												key={`${entry.type}:${entry.id}`}
												variant="outline"
												className="text-xs"
											>
												{entry.name} · {entry.type}
											</Badge>
										))}
									</div>
								</div>
							)}

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
										void handleGenerate();
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
