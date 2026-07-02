import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	FileJson,
	FileText,
	Loader2,
	RefreshCw,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantText, ManaFlowText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { GenerationHistoryPanel } from "@/components/warden-directives/GenerationHistoryPanel";
import { useEmbedded } from "@/contexts/EmbeddedContext";
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
import {
	emptyHistory,
	type GenerationHistoryState,
	type HistoryEntry,
	makeEntryId,
	pushGeneration,
	removeGeneration,
	restoreGeneration,
	togglePin,
} from "@/lib/generationHistory";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

type EventType = "world" | "encounter" | "complication";

interface GeneratedEvent {
	id: string;
	type: EventType;
	title: string;
	description: string;
	/** Mechanical effects (skill checks, combat triggers, environmental rules). */
	mechanics: string;
	/** Parsed save/check DC, when the mechanics text states one. */
	dc: number | null;
	severity: "Minor" | "Moderate" | "Severe" | "Critical";
	riftScale: string;
	consequences: string;
	linkedContent?: WardenLinkedEntry[];
	aiEnhanced?: string;
}

const SEVERITIES: GeneratedEvent["severity"][] = [
	"Minor",
	"Moderate",
	"Severe",
	"Critical",
];

const RIFT_SCALE: Record<EventType, string[]> = {
	world: ["Localized", "Sector-wide", "Regional"],
	encounter: ["Personal", "Cell-level", "Faction-level"],
	complication: ["Momentary", "Scene-long", "Prolonged"],
};

const TYPE_LABEL: Record<EventType, string> = {
	world: "World Event",
	encounter: "NPC Encounter",
	complication: "Complication",
};

const pick = <T,>(arr: readonly T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];

/** Most authored entries lead with a name before a colon ("Rift Surge: …"). */
function deriveTitle(description: string, type: EventType): string {
	const idx = description.indexOf(":");
	if (idx > 2 && idx <= 60) return description.slice(0, idx).trim();
	return TYPE_LABEL[type];
}

function bodyAfterTitle(description: string): string {
	const idx = description.indexOf(":");
	return idx > 2 && idx <= 60 ? description.slice(idx + 1).trim() : description;
}

function parseDc(text: string): number | null {
	const m = text.match(/DC\s*(\d+)/i);
	return m ? Number(m[1]) : null;
}

function generateEvent(type: EventType): GeneratedEvent {
	const table: WardenEventTableEntry[] =
		type === "world"
			? WORLD_EVENTS
			: type === "encounter"
				? NPC_ENCOUNTERS
				: EVENT_COMPLICATIONS;
	const selection = pick(table);
	const description = formatRegentVernacular(selection.description);
	const mechanics = formatRegentVernacular(selection.impact);
	const severity = pick(SEVERITIES);
	const consequences =
		severity === "Critical" || severity === "Severe"
			? "Left unaddressed, the effect escalates each round and spills into the next scene; a decisive response is required to contain it."
			: "A timely, coordinated response contains the effect within the scene; ignoring it lets the impact linger.";
	return {
		id: makeEntryId(),
		type,
		title: deriveTitle(description, type),
		description: bodyAfterTitle(description),
		mechanics,
		dc: parseDc(mechanics),
		severity,
		riftScale: pick(RIFT_SCALE[type]),
		consequences,
	};
}

function eventToMarkdown(event: GeneratedEvent): string {
	const linked =
		event.linkedContent && event.linkedContent.length > 0
			? `\n\n**Linked Compendium Signals:** ${event.linkedContent
					.map((e) => `${e.name} (${e.type})`)
					.join(", ")}`
			: "";
	return formatRegentVernacular(`# ${event.title}

- **Type:** ${TYPE_LABEL[event.type]}
- **Severity:** ${event.severity}
- **Rift Scale:** ${event.riftScale}${event.dc != null ? `\n- **DC:** ${event.dc}` : ""}

${event.description}

## Mechanics
${event.mechanics}

## Consequences
${event.consequences}${linked}
${event.aiEnhanced ? `\n## Warden Detail (AI)\n${event.aiEnhanced}\n` : ""}`);
}

/* Cool severity ramp: teal → cyan → violet → crimson (no warm hues). */
const SEVERITY_COLOR: Record<GeneratedEvent["severity"], string> = {
	Minor: "text-success border-success/40",
	Moderate: "text-warning border-warning/40",
	Severe: "text-resurge border-resurge/40",
	Critical: "text-destructive border-destructive/50",
};

interface EventToolState {
	eventType: EventType;
	current: GeneratedEvent | null;
	history: HistoryEntry<GeneratedEvent>[];
}

const RandomEventGenerator = () => {
	const navigate = useNavigate();
	const embedded = useEmbedded();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<EventToolState>("random_event_generator", {
		initialState: { eventType: "world", current: null, history: [] },
		storageKey: "solo-compendium.Warden-tools.random-event-generator.v1",
	});

	const [eventType, setEventType] = useState<EventType>("world");
	const [histState, setHistState] = useState<
		GenerationHistoryState<GeneratedEvent>
	>(emptyHistory<GeneratedEvent>());
	const event = histState.current;
	const [isGenerating, setIsGenerating] = useState(false);

	const hydrated = useMemo(() => {
		const raw = storedState as unknown as {
			eventType?: EventType;
			current?: GeneratedEvent | null;
			history?: HistoryEntry<GeneratedEvent>[];
			event?: (GeneratedEvent & { impact?: string }) | null;
		};
		const type = raw.eventType ?? "world";
		if (Array.isArray(raw.history)) {
			return {
				eventType: type,
				hist: { current: raw.current ?? null, history: raw.history },
			};
		}
		// Migrate legacy { eventType, event } (with `impact` instead of `mechanics`).
		if (raw.event) {
			const legacy = raw.event;
			const migrated: GeneratedEvent = {
				id: legacy.id ?? makeEntryId(),
				type: legacy.type ?? type,
				title: legacy.title ?? TYPE_LABEL[type],
				description: legacy.description ?? "",
				mechanics: legacy.mechanics ?? legacy.impact ?? "",
				dc: legacy.dc ?? parseDc(legacy.mechanics ?? legacy.impact ?? ""),
				severity: legacy.severity ?? "Moderate",
				riftScale: legacy.riftScale ?? RIFT_SCALE[type][0],
				consequences: legacy.consequences ?? "",
				linkedContent: legacy.linkedContent,
				aiEnhanced: legacy.aiEnhanced,
			};
			return { eventType: type, hist: { current: migrated, history: [] } };
		}
		return { eventType: type, hist: emptyHistory<GeneratedEvent>() };
	}, [storedState]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setEventType(hydrated.eventType);
		setHistState(hydrated.hist);
		hydratedRef.current = true;
	}, [hydrated, isLoading]);

	const savePayload = useMemo<EventToolState>(
		() => ({
			eventType,
			current: histState.current,
			history: histState.history,
		}),
		[eventType, histState],
	);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = async () => {
		clearEnhanced();
		setIsGenerating(true);
		try {
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
								theme: result.mechanics,
							}),
						]
					: eventType === "encounter"
						? [
								...generationContext.pickMany("anomalies", 1, {
									theme: result.description,
								}),
								...generationContext.pickMany("equipment", 1, {
									theme: result.mechanics,
								}),
							]
						: [
								...generationContext.pickMany("conditions", 1, {
									theme: result.description,
								}),
								...generationContext.pickMany("items", 1, {
									theme: result.mechanics,
								}),
							];
			result.linkedContent = linkedContent.slice(0, 3);
			setHistState((prev) =>
				pushGeneration(
					prev,
					result,
					`${result.title} · ${TYPE_LABEL[result.type]}`,
				),
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const updateCurrent = (
		updater: (current: GeneratedEvent) => GeneratedEvent,
	) => {
		setHistState((prev) => {
			if (!prev.current) return prev;
			const next = updater(prev.current);
			return {
				current: next,
				history: prev.history.map((entry) =>
					entry.id === next.id ? { ...entry, record: next } : entry,
				),
			};
		});
	};

	const handleAIEnhance = async () => {
		if (!event) return;
		const seed = `Generate a complete, detailed random event for a Rift Ascendant TTRPG campaign.

SEED DATA:
- Type: ${event.type}
- Title: ${event.title}
- Severity: ${event.severity} · Rift Scale: ${event.riftScale}
- Description: ${event.description}
- Mechanics: ${event.mechanics}
- Linked Content: ${event.linkedContent?.map((entry) => `${entry.name} (${entry.type})`).join("; ") || "None"}

Expand with read-aloud boxed text, detailed mechanics (DCs, triggers), success/failure/partial consequences, NPC stat references, lore ties to Rift activity, and 2-3 follow-up hooks. Keep the listed mechanics intact.`;
		const result = await enhance("event", seed);
		if (result) {
			updateCurrent((current) => ({ ...current, aiEnhanced: result }));
		}
	};

	const handleCopy = () => {
		if (!event) return;
		navigator.clipboard.writeText(eventToMarkdown(event));
		toast({
			title: "Copied!",
			description: "Event copied to clipboard as Markdown.",
		});
	};

	const handleExportMarkdown = () => {
		if (!event) return;
		downloadMarkdown(`event-${event.title}`, eventToMarkdown(event));
		toast({ title: "Exported", description: "Event exported as Markdown." });
	};

	const handleExportJson = () => {
		if (!event) return;
		downloadJson(`event-${event.title}`, event);
		toast({ title: "Exported", description: "Event exported as JSON." });
	};

	const getEventColor = (type: string) => {
		switch (type) {
			case "world":
				return "text-purple-400 border-purple-400/30 bg-purple-400/10";
			case "encounter":
				return "text-blue-400 border-blue-400/30 bg-blue-400/10";
			case "complication":
				return "text-gate-a border-gate-a/30 bg-gate-a/10";
			default:
				return "text-muted-foreground";
		}
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
						title="Systemic Entropy Generator"
						description={
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="font-heading"
							>
								Induce non-deterministic anomalies, unpredicted conceptual
								entities, and localized destabilization protocols into active
								regions.
							</ManaFlowText>
						}
					/>
				</div>
			)}

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
						Generate {TYPE_LABEL[eventType]}
					</Button>
					{event && (
						<Button
							onClick={handleAIEnhance}
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
						<div className="flex flex-wrap items-center gap-2">
							<Badge className={getEventColor(event.type)}>
								{TYPE_LABEL[event.type].toUpperCase()}
							</Badge>
							<Badge
								variant="outline"
								className={SEVERITY_COLOR[event.severity]}
							>
								{event.severity}
							</Badge>
							<Badge variant="outline">{event.riftScale}</Badge>
							{event.dc != null && (
								<Badge variant="outline" className="text-gate-s">
									DC {event.dc}
								</Badge>
							)}
						</div>

						<p className="text-lg font-heading">{event.description}</p>

						<div className="p-4 rounded-lg bg-muted/30 border border-border">
							<div className="flex items-start gap-2">
								<AlertTriangle className="w-5 h-5 text-gate-s mt-0.5 shrink-0" />
								<div>
									<h4 className="font-heading font-semibold mb-1">Mechanics</h4>
									<AscendantText className="block text-sm text-muted-foreground">
										{event.mechanics}
									</AscendantText>
								</div>
							</div>
						</div>

						<div>
							<h4 className="font-heading font-semibold mb-1">Consequences</h4>
							<p className="text-sm text-muted-foreground">
								{event.consequences}
							</p>
						</div>

						{event.linkedContent && event.linkedContent.length > 0 && (
							<div>
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

						{event.aiEnhanced && (
							<div className="pt-4 border-t border-primary/30">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-display text-primary">
										AI-ENHANCED DETAILS
									</span>
								</div>
								<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-none sm:max-h-[500px] overflow-y-auto">
									{event.aiEnhanced}
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
						<div className="p-4 rounded-lg border border-gate-a/30 bg-gate-a/10">
							<h4 className="font-heading font-semibold text-gate-a mb-2">
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
	);

	return embedded ? content : <Layout>{content}</Layout>;
};

export default RandomEventGenerator;
