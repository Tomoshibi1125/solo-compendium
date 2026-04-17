import {
	type LucideIcon,
	Mail,
	Send,
	ShieldAlert,
	Terminal,
	Trophy,
	User,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { type BroadcastTheme, useVTTBroadcast } from "@/hooks/useVTTBroadcast";
import { cn } from "@/lib/utils";

interface WardenBroadcastPanelProps {
	campaignId: string;
	sessionId?: string;
}

const THEME_OPTIONS: {
	id: BroadcastTheme;
	label: string;
	icon: LucideIcon;
	color: string;
}[] = [
	{ id: "rift", label: "Rift", icon: Terminal, color: "text-amethyst-500" },
	{
		id: "warden",
		label: "Warden",
		icon: ShieldAlert,
		color: "text-orange-500",
	},
	{ id: "red-gate", label: "Red Gate", icon: Zap, color: "text-red-600" },
	{ id: "boss", label: "Boss", icon: ShieldAlert, color: "text-red-700" },
	{
		id: "achievement",
		label: "Achievement",
		icon: Trophy,
		color: "text-yellow-500",
	},
	{ id: "whisper", label: "Whisper", icon: Mail, color: "text-purple-400" },
];

export const WardenBroadcastPanel: React.FC<WardenBroadcastPanelProps> = ({
	campaignId,
	sessionId,
}) => {
	const { data: members = [] } = useCampaignMembers(campaignId);
	const { sendBroadcast } = useVTTBroadcast(campaignId, sessionId);

	const [message, setMessage] = useState("");
	const [selectedTheme, setSelectedTheme] = useState<BroadcastTheme>("warden");
	const [targetIds, setTargetIds] = useState<string[]>([]);
	const [isSending, setIsSending] = useState(false);

	const playersOnly = members.filter((m) => m.role === "ascendant");

	const handleSend = async () => {
		if (!message.trim()) return;
		setIsSending(true);
		await sendBroadcast(
			message,
			selectedTheme,
			targetIds.length > 0 ? targetIds : null,
		);
		setMessage("");
		setIsSending(false);
	};

	const toggleTarget = (userId: string) => {
		setTargetIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	return (
		<AscendantWindow
			title="PROTOCOL WARDEN BROADCAST"
			variant="regent"
			className="max-h-[800px] overflow-y-auto"
		>
			<div className="space-y-6">
				{/* Theme Selector */}
				<div className="grid grid-cols-3 gap-2">
					{THEME_OPTIONS.map((t) => {
						const Icon = t.icon;
						return (
							<button
								key={t.id}
								type="button"
								onClick={() => setSelectedTheme(t.id)}
								className={cn(
									"flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:bg-white/5",
									selectedTheme === t.id
										? "bg-white/10 border-amethyst-500 shadow-[0_0_10px_rgba(157,78,221,0.2)]"
										: "border-white/10 opacity-50",
								)}
							>
								<Icon className={cn("w-5 h-5 mb-1", t.color)} />
								<span className="text-[0.6rem] uppercase tracking-tighter font-bold">
									{t.label}
								</span>
							</button>
						);
					})}
				</div>

				{/* Message Input */}
				<div className="space-y-2">
					<Label className="text-[0.65rem] uppercase text-foreground/70 font-black tracking-widest">
						Transmission Content
					</Label>
					<textarea
						className="w-full h-32 bg-[#0a0619]/50 border-white/10 rounded-md p-3 text-sm font-mono focus:border-amethyst-500 focus:ring-1 focus:ring-amethyst-500 outline-none transition-all placeholder:opacity-30"
						placeholder="Type your rift announcement or narrative flavor here..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</div>

				{/* Target Selection */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="text-[0.65rem] uppercase text-foreground/70 font-black tracking-widest flex items-center gap-2">
							<Users className="w-3 h-3" /> Target Entities
						</Label>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-6 text-[0.6rem] px-2"
							onClick={() => setTargetIds([])}
						>
							BROADCAST TO ALL
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
						{playersOnly.length === 0 ? (
							<p className="text-[0.6rem] text-foreground/70 italic text-center p-4">
								No active player entities detected in campaign.
							</p>
						) : (
							playersOnly.map((member) => (
								<button
									key={member.user_id}
									type="button"
									className={cn(
										"flex items-center justify-between w-full p-2 px-3 rounded border transition-all text-left",
										targetIds.includes(member.user_id)
											? "bg-amethyst-900/20 border-amethyst-500/50"
											: "bg-white/5 border-white/5 hover:bg-white/10",
									)}
									onClick={() => toggleTarget(member.user_id)}
								>
									<div className="flex items-center gap-2">
										<User className="w-3 h-3 text-amethyst-400" />
										<span className="text-xs font-heading">
											{member.user_id.split("-")[0]}...
										</span>
										{member.role === "ascendant" && (
											<Badge
												variant="outline"
												className="text-[0.5rem] py-0 h-4 uppercase"
											>
												Ascendant
											</Badge>
										)}
									</div>
									<Checkbox
										checked={targetIds.includes(member.user_id)}
										onCheckedChange={() => toggleTarget(member.user_id)}
										className="rounded-full border-amethyst-500 data-[state=checked]:bg-amethyst-500"
									/>
								</button>
							))
						)}
					</div>
				</div>

				{/* Send Actions */}
				<div className="flex gap-2 pt-2">
					<Button
						type="button"
						className="flex-1 bg-amethyst-600 hover:bg-amethyst-700 text-white font-bold h-12 relative overflow-hidden group shadow-[0_0_15px_rgba(157,78,221,0.3)]"
						disabled={!message.trim() || isSending}
						onClick={handleSend}
					>
						<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
						<Send className="w-4 h-4 mr-2" />
						INITIATE BROADCAST
					</Button>
				</div>
			</div>
		</AscendantWindow>
	);
};
