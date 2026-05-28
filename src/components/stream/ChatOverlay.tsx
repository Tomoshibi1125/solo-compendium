import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	type CampaignMessage,
	useCampaignMessages,
	useCampaignMessagesRealtime,
} from "@/hooks/useCampaignChat";

/**
 * Misty Pearl D1 — Chat overlay (OBS Browser Source).
 *
 * Renders the newest few campaign messages with a configurable fade.
 * Designed to drop into OBS / Streamlabs / Twitch Studio over a
 * streamer's existing layout.
 */
export interface ChatOverlayProps {
	campaignId: string;
	fadeMs?: number;
	limit?: number;
}

const MESSAGE_COLORS: Record<CampaignMessage["message_type"], string> = {
	chat: "border-l-primary/80",
	roll: "border-l-amber-400/80",
	rift: "border-l-violet-400/80",
	whisper: "border-l-emerald-400/80",
};

export function ChatOverlay({
	campaignId,
	fadeMs = 8000,
	limit = 5,
}: ChatOverlayProps) {
	const { data } = useCampaignMessages(campaignId);
	const [visible, setVisible] = useState<CampaignMessage[]>([]);
	// Realtime listener — overlay just needs to refresh state on new messages.
	const handleNewMessage = useCallback(() => {
		// `useCampaignMessages` invalidates internally; this is a no-op
		// signal handler so the overlay re-renders promptly when new
		// messages land.
	}, []);
	useCampaignMessagesRealtime(campaignId, handleNewMessage);

	useEffect(() => {
		const next = (data ?? []).slice(0, limit);
		setVisible(next);
		if (next.length === 0) return;
		const timer = window.setTimeout(() => setVisible([]), fadeMs);
		return () => window.clearTimeout(timer);
	}, [data, limit, fadeMs]);

	return (
		<div
			className="fixed bottom-6 left-6 max-w-[420px] space-y-2 pointer-events-none"
			data-testid="stream-chat-overlay"
		>
			<AnimatePresence>
				{visible.map((message) => (
					<motion.div
						key={message.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35 }}
						className={`rounded-r-md border-l-4 bg-black/65 backdrop-blur-sm px-3 py-2 text-sm text-white ${MESSAGE_COLORS[message.message_type]}`}
					>
						<p className="text-[10px] uppercase tracking-[0.3em] text-[var(--stream-accent)]">
							{message.character_name || "Operative"}
						</p>
						<p className="text-sm">{message.content}</p>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

export default ChatOverlay;
