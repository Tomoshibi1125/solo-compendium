import { Pause, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCampaignSessions } from "@/hooks/useCampaignSessions";
import { useSessionReplay } from "@/hooks/useSessionReplay";

/**
 * Misty Pearl H4 — Bureau Field Recorder scrubber UI.
 *
 * Lists completed sessions and lets the Warden replay one event-by-
 * event. The events flow back onto the Bureau Directive Bus so the
 * Pixi stage, initiative tracker, and chat surface reconstruct the
 * past automatically.
 */
export interface SessionReplayPanelProps {
	campaignId: string;
	canManage: boolean;
}

const SPEEDS = [0.5, 1, 2, 4] as const;

function formatElapsed(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	return h > 0
		? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
		: `${m}:${String(s).padStart(2, "0")}`;
}

/** Human-readable one-liner for a merged session-timeline event. */
function describeEvent(kind: string, payload: Record<string, unknown>): string {
	const round = payload.round;
	switch (kind) {
		case "combat:roundStart":
			return `Round ${round ?? "?"} began`;
		case "combat:roundEnd":
			return `Round ${round ?? "?"} ended`;
		case "combat:turnStart":
			return `${payload.actorName || "A combatant"}'s turn began${round ? ` (round ${round})` : ""}`;
		case "combat:turnEnd":
			return `${payload.actorName || "A combatant"}'s turn ended`;
		case "effect:applied":
			return `${payload.effectName || "An effect"} applied${payload.targetName ? ` to ${payload.targetName}` : ""}`;
		case "effect:expired":
			return `${payload.effectName || "An effect"} expired`;
		case "roll:submitted":
			return `${payload.actor || "Someone"} rolled ${payload.result}${payload.formula ? ` (${payload.formula})` : ""}`;
		default:
			return kind;
	}
}

const EVENT_ACCENT: Record<string, string> = {
	"combat:roundStart": "text-primary",
	"combat:roundEnd": "text-primary",
	"combat:turnStart": "text-solar-glow",
	"combat:turnEnd": "text-muted-foreground",
	"effect:applied": "text-destructive",
	"effect:expired": "text-muted-foreground",
	"roll:submitted": "text-foreground",
};

export function SessionReplayPanel({
	campaignId,
	canManage,
}: SessionReplayPanelProps) {
	const { data: sessions = [] } = useCampaignSessions(campaignId);
	const [selectedSessionId, setSelectedSessionId] = useState<string | "all">(
		"all",
	);

	const replay = useSessionReplay({
		campaignId,
		sessionId: selectedSessionId === "all" ? null : selectedSessionId,
	});

	const totalSpanMs = useMemo(() => {
		if (replay.events.length < 2) return 0;
		const first = Date.parse(replay.events[0].created_at);
		const last = Date.parse(replay.events[replay.events.length - 1].created_at);
		return Math.max(0, last - first);
	}, [replay.events]);

	if (!canManage) {
		// Bureau Field Recorder is a Warden-only surface for now —
		// player-side replay would expose un-fogged regions the player
		// shouldn't yet have seen.
		return null;
	}

	return (
		<AscendantWindow title="BUREAU FIELD RECORDER">
			<section
				className="space-y-3"
				data-testid="session-replay-panel"
				aria-label="Bureau Field Recorder"
			>
				<p className="text-xs text-muted-foreground">
					Scrub through past Bureau events. The replay feeds the Directive Bus
					so the Rift stage, initiative tracker, and chat reconstruct the moment
					automatically.
				</p>

				<div className="flex flex-wrap items-center gap-2">
					<Select
						value={selectedSessionId}
						onValueChange={(v) => setSelectedSessionId(v)}
					>
						<SelectTrigger
							className="h-8 w-64 text-xs"
							data-testid="session-replay-select"
						>
							<SelectValue placeholder="Choose a session" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All campaign events</SelectItem>
							{sessions.map((s) => (
								<SelectItem key={s.id} value={s.id}>
									{s.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={String(replay.speed)}
						onValueChange={(v) => replay.setSpeed(Number(v))}
					>
						<SelectTrigger
							className="h-8 w-24 text-xs"
							data-testid="session-replay-speed"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SPEEDS.map((s) => (
								<SelectItem key={s} value={String(s)}>
									{s}×
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						size="sm"
						variant="outline"
						onClick={replay.playing ? replay.pause : replay.play}
						disabled={replay.events.length === 0}
						data-testid="session-replay-play"
					>
						{replay.playing ? (
							<>
								<Pause className="w-3.5 h-3.5 mr-1" /> Pause
							</>
						) : (
							<>
								<Play className="w-3.5 h-3.5 mr-1" /> Play
							</>
						)}
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={replay.stop}
						disabled={replay.events.length === 0}
						data-testid="session-replay-stop"
					>
						<RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
					</Button>
				</div>

				<div className="space-y-1">
					<input
						type="range"
						min={0}
						max={totalSpanMs}
						step={Math.max(1, Math.floor(totalSpanMs / 1000))}
						value={Math.min(replay.cursor, totalSpanMs)}
						onChange={(e) => replay.setCursor(Number(e.target.value))}
						disabled={replay.events.length === 0}
						className="w-full accent-primary"
						aria-label="Replay timeline"
						data-testid="session-replay-scrubber"
					/>
					<div className="flex justify-between text-[11px] font-mono text-muted-foreground">
						<span data-testid="session-replay-cursor">
							{formatElapsed(replay.cursor)}
						</span>
						<span>
							{replay.events.length} event
							{replay.events.length === 1 ? "" : "s"}
						</span>
						<span>{formatElapsed(totalSpanMs)}</span>
					</div>
				</div>

				{replay.isLoading && (
					<p className="text-[11px] text-muted-foreground animate-pulse">
						Loading Bureau archives…
					</p>
				)}
				{!replay.isLoading && replay.events.length === 0 && (
					<p className="text-[11px] text-muted-foreground">
						No events recorded for this scope yet. Combat turns, effects, and
						rolls stream into the archive automatically once a session runs.
					</p>
				)}

				{replay.events.length > 0 && (
					<ol
						className="max-h-64 space-y-0.5 overflow-y-auto rounded border border-border/50 bg-muted/10 p-2 text-xs"
						data-testid="session-replay-timeline"
					>
						{replay.events.map((event, idx) => {
							const startTs = Date.parse(replay.events[0].created_at);
							const offsetMs = Date.parse(event.created_at) - startTs;
							const played = offsetMs <= replay.cursor;
							return (
								<li
									key={event.id}
									data-testid="session-replay-event"
									className={`flex items-baseline gap-2 rounded px-1.5 py-0.5 ${
										played ? "opacity-100" : "opacity-40"
									} ${idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"}`}
								>
									<span className="shrink-0 font-mono text-[10px] text-muted-foreground">
										{formatElapsed(offsetMs)}
									</span>
									<span
										className={
											EVENT_ACCENT[event.kind] ?? "text-muted-foreground"
										}
									>
										{describeEvent(event.kind, event.payload)}
									</span>
								</li>
							);
						})}
					</ol>
				)}
			</section>
		</AscendantWindow>
	);
}
