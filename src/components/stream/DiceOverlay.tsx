import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useCampaignMessages } from "@/hooks/useCampaignChat";

/**
 * Misty Pearl D1 — Dice overlay (OBS Browser Source).
 *
 * Shows the last "roll" message as a card that lingers for 5 s, then
 * fades out. Streamlabs / Twitch Studio composite it on top of the
 * gameplay layer.
 */
interface DiceOverlayProps {
	campaignId: string;
}

interface ParsedRoll {
	actor: string;
	formula: string;
	result: string;
	when: number;
}

function parseRollMessage(
	raw: string,
): { formula: string; result: string } | null {
	// Try to match patterns produced by the in-app dice roller:
	//   "rolled `1d20+5` → **15**"
	//   "Kael rolled 1d20+5 = 17"
	const arrow = raw.match(/`([^`]+)`[^\d-]*([+-]?\d+)/);
	if (arrow) {
		return { formula: arrow[1].trim(), result: arrow[2] };
	}
	const eq = raw.match(/(\b[0-9d+\- ]+\b)\s*[=→]\s*\*{0,2}([+-]?\d+)/);
	if (eq) {
		return { formula: eq[1].trim(), result: eq[2] };
	}
	return null;
}

export function DiceOverlay({ campaignId }: DiceOverlayProps) {
	const { data } = useCampaignMessages(campaignId);

	const lastRoll = useMemo<ParsedRoll | null>(() => {
		for (const message of data ?? []) {
			if (message.message_type !== "roll") continue;
			const parsed = parseRollMessage(message.content);
			if (!parsed) continue;
			return {
				actor: message.character_name ?? "Operative",
				formula: parsed.formula,
				result: parsed.result,
				when: new Date(message.created_at).getTime(),
			};
		}
		return null;
	}, [data]);

	return (
		<div
			className="fixed top-6 right-6 pointer-events-none"
			data-testid="stream-dice-overlay"
		>
			<AnimatePresence>
				{lastRoll && (
					<motion.div
						key={lastRoll.when}
						initial={{ opacity: 0, y: -20, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.4 }}
						className="rounded-lg border border-[var(--stream-accent)]/60 bg-black/70 backdrop-blur-md px-4 py-3 shadow-lg"
					>
						<p className="text-[10px] uppercase tracking-[0.4em] text-[var(--stream-accent)]">
							{lastRoll.actor} · Field Roll
						</p>
						<div className="mt-1 flex items-baseline gap-2">
							<span className="font-mono text-sm text-white/70">
								{lastRoll.formula}
							</span>
							<span className="font-resurge text-3xl text-[var(--stream-accent)]">
								{lastRoll.result}
							</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
