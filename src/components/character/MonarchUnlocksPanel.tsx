import { useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Crown,
	Flame,
	Info,
	Lock,
	Scroll,
	Skull,
	Sparkles,
	Star,
	Unlock,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useCharacter } from "@/hooks/useCharacters";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	useCharacterMonarchUnlocks,
	useSetPrimaryMonarch,
	useUnlockMonarch,
} from "@/hooks/useRegentUnlocks";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { supabase } from "@/integrations/supabase/client";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { cn } from "@/lib/utils";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

interface MonarchUnlocksPanelProps {
	characterId: string;
	campaignId?: string;
}

// Enhanced theme colors with System Ascendant aesthetic
const themeColors: Record<
	string,
	{ bg: string; text: string; border: string; glow: string }
> = {
	Shadow: {
		bg: "bg-shadow-purple/15",
		text: "text-shadow-purple",
		border: "border-shadow-purple/40",
		glow: "shadow-[0_0_12px_hsl(var(--shadow-purple)/0.3)]",
	},
	Frost: {
		bg: "bg-mana-cyan/15",
		text: "text-mana-cyan",
		border: "border-mana-cyan/40",
		glow: "shadow-[0_0_12px_hsl(var(--mana-cyan)/0.3)]",
	},
	Plague: {
		bg: "bg-accent/15",
		text: "text-accent",
		border: "border-accent/40",
		glow: "shadow-[0_0_12px_hsl(var(--accent)/0.3)]",
	},
	Stone: {
		bg: "bg-gate-d/15",
		text: "text-gate-d",
		border: "border-gate-d/40",
		glow: "",
	},
	Beast: {
		bg: "bg-gilded-reaper/15",
		text: "text-gilded-reaper",
		border: "border-gilded-reaper/40",
		glow: "shadow-[0_0_10px_hsl(var(--gilded-reaper)/0.3)]",
	},
	Beasts: {
		bg: "bg-gilded-reaper/15",
		text: "text-gilded-reaper",
		border: "border-gilded-reaper/40",
		glow: "shadow-[0_0_10px_hsl(var(--gilded-reaper)/0.3)]",
	},
	Iron: {
		bg: "bg-silver-commander/15",
		text: "text-silver-commander",
		border: "border-silver-commander/40",
		glow: "",
	},
	Destruction: {
		bg: "bg-gate-a/15",
		text: "text-gate-a",
		border: "border-gate-a/40",
		glow: "shadow-[0_0_12px_hsl(var(--gate-a)/0.3)]",
	},
	"White Flames": {
		bg: "bg-foreground/10",
		text: "text-foreground",
		border: "border-foreground/30",
		glow: "shadow-[0_0_12px_hsl(var(--foreground)/0.2)]",
	},
	Transfiguration: {
		bg: "bg-arise-violet/15",
		text: "text-arise-violet",
		border: "border-arise-violet/40",
		glow: "shadow-[0_0_12px_hsl(var(--arise-violet)/0.3)]",
	},
	Beginning: {
		bg: "bg-arise-violet/15",
		text: "text-arise-violet",
		border: "border-arise-violet/40",
		glow: "shadow-[0_0_15px_hsl(var(--arise-violet)/0.4)]",
	},
};

const themeIcons: Record<string, React.ReactNode> = {
	Shadow: <Skull className="h-4 w-4" />,
	Destruction: <Flame className="h-4 w-4" />,
	Frost: <Sparkles className="h-4 w-4" />,
	Plague: <Zap className="h-4 w-4" />,
	Iron: <Crown className="h-4 w-4" />,
	Beast: <Crown className="h-4 w-4" />,
	Beasts: <Crown className="h-4 w-4" />,
	Beginning: <Star className="h-4 w-4" />,
	"White Flames": <Flame className="h-4 w-4" />,
	Transfiguration: <Sparkles className="h-4 w-4" />,
	Stone: <Crown className="h-4 w-4" />,
};

export function MonarchUnlocksPanel({
	characterId,
	campaignId,
}: MonarchUnlocksPanelProps) {
	const [open, setOpen] = useState(false);
	const [selectedMonarchId, setSelectedMonarchId] = useState("");
	const [questName, setQuestName] = useState("");
	const [dmNotes, setDmNotes] = useState("");

	const { data: character } = useCharacter(characterId);
	const { unlocks = [] } = useCharacterMonarchUnlocks(characterId);
	const unlockMonarch = useUnlockMonarch();
	const setPrimary = useSetPrimaryMonarch();

	const { toast } = useToast();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const ddbEnhancements = usePlayerToolsEnhancements();

	// Fetch all regents
	const { data: allRegents = [] } = useQuery({
		queryKey: ["all-regents", characterId, campaignId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("compendium_regents" as never)
				.select("id, name, title, theme, source_book")
				.order("name");

			if (!error && data && data.length > 0) {
				return filterRowsBySourcebookAccess(
					data,
					(regent) => (regent as Record<string, any>).source_book,
					{ campaignId },
				);
			}

			// Static fallback
			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);
			const staticRegents = await staticDataProvider.getRegents("");
			return staticRegents.map((r) => ({
				id: r.id,
				name: r.name,
				title: r.title ?? null,
				theme: r.theme ?? null,
				source_book: r.source_book ?? "System Ascendant Canon",
			}));
		},
	});

	const unlockedIds = new Set(unlocks.map((u: any) => u.regent_id));
	const availableLockedRegents = allRegents.filter(
		(r: Record<string, any>) => !unlockedIds.has(r.id),
	);
	const hasJob = !!character?.job;
	const hasPath = !!character?.path;
	const canUnlockSovereign = hasJob && hasPath && unlocks.length >= 2;

	// --- ADAPTIVE 3-CHOICE LOGIC ---
	// The system analyzes character stats to offer exactly 3 regent choices.
	const adaptiveChoices = useMemo(() => {
		if (availableLockedRegents.length <= 3) return availableLockedRegents;

		// Safely extract abilities with fallbacks
		const abilities = character?.abilities as
			| Record<string, number>
			| undefined;
		if (!abilities) return availableLockedRegents.slice(0, 3);

		const strength = abilities.STR || 10;
		const dexterity = abilities.AGI || 10;
		const constitution = abilities.VIT || 10;
		const intelligence = abilities.INT || 10;
		const wisdom = abilities.SENSE || 10;
		const charisma = abilities.PRE || 10;

		// Simple heuristic:
		// Martial sum (Str + Dex + Con) vs Caster sum (Int + Wis + Cha)
		const martialSum = strength + dexterity + constitution;
		const casterSum = intelligence + wisdom + charisma;

		// Sort regents by some thematic relevance
		const shuffled = [...availableLockedRegents].sort((a: any, b: any) => {
			// Deterministic based on character stats and regent ID length
			const aId = a.id || "";
			const bId = b.id || "";
			const weightA =
				martialSum * (aId.charCodeAt(0) || 1) +
				casterSum * (aId.charCodeAt(aId.length - 1) || 1);
			const weightB =
				martialSum * (bId.charCodeAt(0) || 1) +
				casterSum * (bId.charCodeAt(bId.length - 1) || 1);
			return weightB - weightA;
		});

		// Take top 3
		return shuffled.slice(0, 3);
	}, [availableLockedRegents, character]);

	const handleUnlock = () => {
		if (!selectedMonarchId || !questName.trim()) return;

		const regent = allRegents.find(
			(r: Record<string, any>) => r.id === selectedMonarchId,
		) as Record<string, any>;
		const regentName = regent
			? formatRegentVernacular(regent.title || regent.name)
			: "A Regent";

		unlockMonarch.mutate(
			{
				characterId,
				regentId: selectedMonarchId,
				questName: questName.trim(),
				dmNotes: dmNotes.trim() || undefined,
				isPrimary: unlocks.length === 0,
			},
			{
				onSuccess: () => {
					const contextMsg = `Unlocked ${REGENT_LABEL} Overlay: ${regentName}`;

					ddbEnhancements
						.trackCustomFeatureUsage(
							characterId,
							`${REGENT_LABEL} Unlocked`,
							regentName,
							"SA",
						)
						.catch(console.error);

					toast({
						title: `${REGENT_LABEL} Unlocked!`,
						description: `${regentName} power acquired.`,
					});

					setOpen(false);
					setSelectedMonarchId("");
					setQuestName("");
					setDmNotes("");
				},
			},
		);
	};

	return (
		<SystemWindow
			title={`${REGENT_LABEL.toUpperCase()} UNLOCKS - DIVINE AUTHORITY`}
			variant="monarch"
			className="border-monarch-gold/30"
		>
			<div className="space-y-4">
				{/* Status Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-monarch-gold/20 flex items-center justify-center">
							<Crown className="h-5 w-5 text-monarch-gold" />
						</div>
						<div>
							<p className="font-heading text-sm text-muted-foreground">
								{REGENT_LABEL_PLURAL} Unlocked
							</p>
							<p className="font-display text-lg text-monarch-gold">
								{unlocks.length} / 2 Required
							</p>
						</div>
					</div>
					{canUnlockSovereign && (
						<Badge className="bg-arise-violet/20 text-arise-violet border-arise-violet/40 font-display animate-pulse-2s">
							<Star className="h-3 w-3 mr-1" />
							Sovereign Ready
						</Badge>
					)}
				</div>

				{unlocks.length > 0 && (
					<>
						<Separator className="bg-monarch-gold/20" />

						<div className="space-y-3">
							{unlocks.map((unlock: any, index: number) => {
								const regent = (unlock as Record<string, any>).regent;
								if (!regent) return null;

								const themeStyle =
									themeColors[regent.theme] || themeColors["Shadow"];
								const icon = themeIcons[regent.theme] || (
									<Crown className="h-4 w-4" />
								);
								const displayTitle = formatRegentVernacular(
									regent.title || regent.name,
								);

								return (
									<div
										key={unlock.id}
										className={cn(
											"p-4 rounded-lg border transition-all duration-300",
											themeStyle.border,
											themeStyle.bg,
											unlock.is_primary && themeStyle.glow,
											index < 2 && "animate-arise",
										)}
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"p-2 rounded-lg bg-card",
														themeStyle.text,
													)}
												>
													{icon}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span
															className={cn(
																"font-heading font-semibold",
																themeStyle.text,
															)}
														>
															{displayTitle}
														</span>
														{unlock.is_primary && (
															<Badge
																variant="outline"
																className="bg-monarch-gold/20 text-monarch-gold border-monarch-gold/40 text-xs"
															>
																<Star className="h-3 w-3 mr-1" />
																Primary
															</Badge>
														)}
													</div>
													<Badge
														variant="outline"
														className={cn(
															"text-xs mt-1",
															themeStyle.text,
															themeStyle.border,
														)}
													>
														{regent.theme} Theme
													</Badge>
												</div>
											</div>

											{!unlock.is_primary && unlocks.length > 1 && (
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														setPrimary.mutate({
															characterId,
															unlockId: unlock.id,
														})
													}
													className="text-xs hover:bg-monarch-gold/10"
												>
													<Star className="h-3 w-3 mr-1" />
													Set Primary
												</Button>
											)}
										</div>

										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<Scroll className="h-3 w-3" />
											<span>
												Quest: {formatRegentVernacular(unlock.quest_name)}
											</span>
										</div>

										{unlock.dm_notes && (
											<p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-monarch-gold/30 pl-2">
												{formatRegentVernacular(unlock.dm_notes)}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</>
				)}

				{unlocks.length === 0 && (
					<div className="text-center py-6">
						<Lock className="h-10 w-10 text-monarch-gold/30 mx-auto mb-3" />
						<p className="text-sm text-muted-foreground font-heading">
							No {REGENT_LABEL_PLURAL} unlocked yet
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Complete {REGENT_LABEL} quests marked by your Warden to unlock
							divine power
						</p>
					</div>
				)}

				{/* Sovereign Status */}
				{canUnlockSovereign && (
					<div className="p-4 rounded-lg border border-arise-violet/40 bg-arise-violet/5">
						<div className="flex items-center gap-2 mb-2">
							<CheckCircle className="h-4 w-4 text-arise-violet" />
							<span className="font-display text-sm text-arise-violet tracking-wider">
								SOVEREIGN FUSION AVAILABLE
							</span>
						</div>
						<p className="text-xs text-muted-foreground">
							With two {REGENT_LABEL_PLURAL} unlocked, use the{" "}
							<span className="text-arise-violet">Gemini Protocol</span> in the
							Compendium to generate your unique Sovereign abilities.
						</p>
					</div>
				)}

				{/* Unlock New Regent - Caps at 2 */}
				{unlocks.length < 2 && adaptiveChoices.length > 0 && (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="w-full border-monarch-gold/40 hover:border-monarch-gold hover:bg-monarch-gold/10 font-display tracking-wider"
							>
								<Unlock className="h-4 w-4 mr-2 text-monarch-gold" />
								APPROACH THE THRONE (Unlock {REGENT_LABEL})
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-card border-monarch-gold/40 max-w-lg">
							<DialogHeader>
								<DialogTitle className="font-display text-xl gradient-text-monarch flex items-center gap-2">
									<Crown className="h-5 w-5" />
									The System Analyzes Your Potential...
								</DialogTitle>
								<div className="text-sm text-muted-foreground mt-2">
									Based on your capabilities and growth, the System offers
									exactly three paths to ascendancy. Choose wisely; a{" "}
									{REGENT_LABEL.toLowerCase()} overlay is a profound evolution.
								</div>
							</DialogHeader>

							<div className="space-y-4 pt-2">
								<div className="space-y-3">
									<Label className="font-heading text-monarch-gold">
										Adaptive Choices
									</Label>
									<div className="grid grid-cols-1 gap-2">
										{adaptiveChoices.map((regent: any) => (
											<div
												key={regent.id}
												className={cn(
													"p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between",
													selectedMonarchId === regent.id
														? "border-monarch-gold bg-monarch-gold/10 shadow-[0_0_10px_hsl(var(--monarch-gold)/0.2)]"
														: "border-border hover:border-monarch-gold/50 bg-background/50",
												)}
												onClick={() => setSelectedMonarchId(regent.id)}
											>
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"w-8 h-8 rounded-full flex items-center justify-center",
															selectedMonarchId === regent.id
																? "bg-monarch-gold text-background"
																: "bg-muted text-muted-foreground",
														)}
													>
														{themeIcons[regent.theme] || (
															<Crown className="h-4 w-4" />
														)}
													</div>
													<div>
														<div className="font-heading font-semibold text-sm">
															{formatRegentVernacular(
																regent.title || regent.name,
															)}
														</div>
														<div className="text-xs text-muted-foreground">
															{regent.theme} Theme
														</div>
													</div>
												</div>
												{selectedMonarchId === regent.id && (
													<CheckCircle className="h-4 w-4 text-monarch-gold" />
												)}
											</div>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<Label className="font-heading">Quest Name *</Label>
									<Input
										placeholder="e.g., Trial of the Shadow Throne"
										value={questName}
										onChange={(e) => setQuestName(e.target.value)}
										className="bg-background"
									/>
								</div>

								<div className="space-y-2">
									<Label className="font-heading">
										Warden Notes (optional)
									</Label>
									<Textarea
										placeholder="Notes about how the quest was completed..."
										value={dmNotes}
										onChange={(e) => setDmNotes(e.target.value)}
										rows={3}
										className="bg-background"
									/>
								</div>

								<Button
									className="w-full font-display tracking-wider bg-monarch-gold hover:bg-monarch-gold/80 text-background"
									onClick={handleUnlock}
									disabled={
										!selectedMonarchId ||
										!questName.trim() ||
										unlockMonarch.isPending
									}
								>
									<Crown className="h-4 w-4 mr-2" />
									UNLOCK {REGENT_LABEL.toUpperCase()} POWER
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</div>
		</SystemWindow>
	);
}
