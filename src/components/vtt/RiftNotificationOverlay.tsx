import { AnimatePresence, motion } from "framer-motion";
import { Howl } from "howler";
import { Mail, ShieldAlert, Terminal, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { BroadcastPayload, BroadcastTheme } from "@/hooks/useVTTBroadcast";
import { cn } from "@/lib/utils";

// Rift Ascendant Themes (Amethyst/Obsidian/Crimson/Warden)
const THEMES: Record<
	BroadcastTheme,
	{
		icon: React.ComponentType<{ className?: string }>;
		color: string;
		glow: string;
		label: string;
		sound: string;
	}
> = {
	rift: {
		icon: Terminal,
		color: "text-[#9d4edd]",
		glow: "shadow-[#9d4edd]",
		label: "RIFT ANNOUNCEMENT",
		sound: "https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3", // Placeholder chime
	},
	warden: {
		icon: ShieldAlert,
		color: "text-[#ea580c]",
		glow: "shadow-[#ea580c]",
		label: "WARDEN DIRECTIVE",
		sound: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
	},
	"red-gate": {
		icon: Zap,
		color: "text-[#ff0000]",
		glow: "shadow-[#ff0000]",
		label: "RED GATE ALERT",
		sound: "https://assets.mixkit.co/active_storage/sfx/2566/2566-preview.mp3",
	},
	boss: {
		icon: ShieldAlert,
		color: "text-[#ff0000]",
		glow: "shadow-[#ff0000]",
		label: "BOSS ENCOUNTER",
		sound: "https://assets.mixkit.co/active_storage/sfx/2566/2566-preview.mp3",
	},
	achievement: {
		icon: Trophy,
		color: "text-[#fbbf24]",
		glow: "shadow-[#fbbf24]",
		label: "ASCENDANT TRIUMPH",
		sound: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
	},
	whisper: {
		icon: Mail,
		color: "text-[#a855f7]",
		glow: "shadow-[#a855f7]",
		label: "ENCRYPTED TRANSMISSION",
		sound: "https://assets.mixkit.co/active_storage/sfx/1344/1344-preview.mp3",
	},
};

interface RiftNotificationOverlayProps {
	notifications: BroadcastPayload[];
	onDismiss: (id: string) => void;
}

export const RiftNotificationOverlay: React.FC<
	RiftNotificationOverlayProps
> = ({ notifications, onDismiss }) => {
	const [activeNote, setActiveNote] = useState<BroadcastPayload | null>(null);

	useEffect(() => {
		if (notifications.length > 0 && !activeNote) {
			const next = notifications[0];
			setActiveNote(next);

			// Play sound
			const theme = THEMES[next.message_type as BroadcastTheme] || THEMES.rift;
			const sound = new Howl({ src: [theme.sound], volume: 0.5 });
			sound.play();

			// Auto-dismiss transient flash after 8 seconds
			const timer = setTimeout(() => {
				onDismiss(next.id);
				setActiveNote(null);
			}, 8000);

			return () => clearTimeout(timer);
		}
	}, [notifications, activeNote, onDismiss]);

	return (
		<div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-[90%] max-w-2xl">
			<AnimatePresence>
				{activeNote && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: -50, filter: "blur(10px)" }}
						animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, scale: 1.1, y: 30, filter: "blur(20px)" }}
						transition={{ type: "spring", damping: 20, stiffness: 100 }}
						className={cn(
							"relative sa-card p-1 overflow-hidden pointer-events-auto",
							"border-t-2 bg-[#0a0619]/95 backdrop-blur-3xl",
							THEMES[activeNote.message_type as BroadcastTheme]?.color.replace(
								"text-",
								"border-",
							) || "border-primary",
						)}
					>
						{/* Background Glitch Effect Overlay */}
						<motion.div
							animate={{ opacity: [0.05, 0.15, 0.05] }}
							transition={{
								duration: 0.1,
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="absolute inset-0 bg-grid-white/[0.02]"
						/>

						<div className="relative p-6 px-10 flex flex-col items-center">
							<div className="flex items-center gap-3 mb-2">
								{(() => {
									const themeConfig =
										THEMES[activeNote.message_type as BroadcastTheme] ||
										THEMES.rift;
									const ThemeIcon = themeConfig.icon;
									return (
										<ThemeIcon className={cn("w-6 h-6", themeConfig.color)} />
									);
								})()}
								<span
									className={cn(
										"text-[0.65rem] font-black tracking-[0.3em] uppercase",
										THEMES[activeNote.message_type as BroadcastTheme]?.color,
									)}
								>
									{THEMES[activeNote.message_type as BroadcastTheme]?.label}
								</span>
							</div>

							<h2 className="text-xl md:text-2xl font-heading font-bold text-white text-center mb-4 sa-glow-text">
								{activeNote.message}
							</h2>

							<div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#9d4edd] to-transparent opacity-50 mb-4" />

							<p className="text-[0.7rem] italic text-foreground/70 opacity-70">
								Transmission secured from:{" "}
								{activeNote.sender_name || "Ascendant Intelligence"}
							</p>

							{/* Scanning Line Animation */}
							<motion.div
								animate={{ x: ["-200%", "200%"] }}
								transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
								className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
