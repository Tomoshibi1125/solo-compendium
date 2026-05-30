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
					<div className="flex justify-between text-[10px] font-mono text-muted-foreground">
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
					<p className="text-[10px] text-muted-foreground animate-pulse">
						Loading Bureau archives…
					</p>
				)}
				{!replay.isLoading && replay.events.length === 0 && (
					<p className="text-[10px] text-muted-foreground">
						No events recorded for this scope yet. Events stream into the
						archive automatically once a session starts.
					</p>
				)}
			</section>
		</AscendantWindow>
	);
}

export default SessionReplayPanel;
