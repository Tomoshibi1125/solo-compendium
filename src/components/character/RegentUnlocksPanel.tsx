import { useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Crown,
	Flame,
	Lock,
	Scroll,
	Skull,
	Sparkles,
	Star,
	Unlock,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { cn } from "@/lib/utils";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

interface RegentUnlocksPanelProps {
	characterId: string;
	campaignId?: string;
}

// Enhanced theme colors with Rift Ascendant aesthetic
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
		bg: "bg-resurge-violet/15",
		text: "text-resurge-violet",
		border: "border-resurge-violet/40",
		glow: "shadow-[0_0_12px_hsl(var(--resurge-violet)/0.3)]",
	},
	Beginning: {
		bg: "bg-resurge-violet/15",
		text: "text-resurge-violet",
		border: "border-resurge-violet/40",
		glow: "shadow-[0_0_15px_hsl(var(--resurge-violet)/0.4)]",
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

export function RegentUnlocksPanel({
	characterId,
	campaignId,
}: RegentUnlocksPanelProps) {
	const [open, setOpen] = useState(false);
	const [selectedRegentId, setSelectedRegentId] = useState("");
	const [questName, setQuestName] = useState("");
	const [dmNotes, setDmNotes] = useState("");

	const { data: character } = useCharacter(characterId);
	const {
		unlocks = [],
		unlockRegent,
		updateUnlock,
		isUnlocking,
	} = useRegentUnlocks(characterId);

	const { toast } = useToast();
	const ascendantTools = useAscendantTools();

	// Fetch all regents from canonical static with entitlement filtering.
	const { data: allRegents = [] } = useQuery({
		queryKey: ["all-regents", characterId, campaignId],
		queryFn: async () => {
			const entries = await listCanonicalEntries("regents", undefined, {
				campaignId,
			});
			return entries
				.slice()
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((r) => ({
					id: r.id,
					name: r.name,
					title: r.title ?? null,
					theme: r.theme ?? null,
					source_book: r.source_book ?? "Rift Ascendant Canon",
				}));
		},
	});

	const unlockedIds = new Set(
		unlocks.map((u: { regent_id: string }) => u.regent_id),
	);
	const availableLockedRegents = allRegents.filter(
		(r) => !unlockedIds.has(r.id),
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
		const agility = abilities.AGI || 10;
		const vitality = abilities.VIT || 10;
		const intelligence = abilities.INT || 10;
		const sense = abilities.SENSE || 10;
		const presence = abilities.PRE || 10;

		// Simple heuristic:
		// Martial sum (Str + Dex + Con) vs Caster sum (Int + Wis + Cha)
		const martialSum = strength + agility + vitality;
		const casterSum = intelligence + sense + presence;

		// Sort regents by some thematic relevance
		const shuffled = [...availableLockedRegents].sort((a, b) => {
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
		if (!selectedRegentId || !questName.trim()) return;

		const regent = allRegents.find((r) => r.id === selectedRegentId);
		const regentName = regent
			? formatRegentVernacular(regent.title || regent.name)
			: "A Regent";

		unlockRegent(
			{
				regentId: selectedRegentId,
				questName: questName.trim(),
				dmNotes: dmNotes.trim() || undefined,
				isPrimary: unlocks.length === 0,
			},
			{
				onSuccess: async () => {
					const _contextMsg = `Unlocked ${REGENT_LABEL} Overlay: ${regentName}`;

					await ascendantTools
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
					setSelectedRegentId("");
					setQuestName("");
					setDmNotes("");
				},
			},
		);
	};

	return (
		<AscendantWindow
			title={`${REGENT_LABEL.toUpperCase()} UNLOCKS - DIVINE AUTHORITY`}
			variant="regent"
			className="border-regent-gold/30"
		>
			<div className="space-y-4">
				{/* Status Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-regent-gold/20 flex items-center justify-center">
							<Crown className="h-5 w-5 text-regent-gold" />
						</div>
						<div>
							<p className="font-heading text-sm text-muted-foreground">
								{REGENT_LABEL_PLURAL} Unlocked
							</p>
							<p className="font-display text-lg text-regent-gold">
								{unlocks.length} / 2 Required
							</p>
						</div>
					</div>
					{canUnlockSovereign && (
						<Badge className="bg-resurge-violet/20 text-resurge-violet border-resurge-violet/40 font-display animate-pulse-2s">
							<Star className="h-3 w-3 mr-1" />
							Sovereign Ready
						</Badge>
					)}
				</div>

				{unlocks.length > 0 && (
					<>
						<Separator className="bg-regent-gold/20" />

						<div className="space-y-3">
							{unlocks.map((unlock, index) => {
								const regent = unlock.regent;
								if (!regent) return null;

								const themeStyle =
									themeColors[regent.theme as string] || themeColors.Shadow;
								const icon = themeIcons[regent.theme as string] || (
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
											index < 2 && "animate-resurge",
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
																className="bg-regent-gold/20 text-regent-gold border-regent-gold/40 text-xs"
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
														{regent.theme as string} Theme
													</Badge>
												</div>
											</div>

											{!unlock.is_primary && unlocks.length > 1 && (
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														updateUnlock({
															unlockId: unlock.id,
															updates: { is_primary: true },
														})
													}
													className="text-xs hover:bg-regent-gold/10"
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
											<p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-regent-gold/30 pl-2">
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
						<Lock className="h-10 w-10 text-regent-gold/30 mx-auto mb-3" />
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
					<div className="p-4 rounded-lg border border-resurge-violet/40 bg-resurge-violet/5">
						<div className="flex items-center gap-2 mb-2">
							<CheckCircle className="h-4 w-4 text-resurge-violet" />
							<span className="font-display text-sm text-resurge-violet tracking-wider">
								SOVEREIGN FUSION AVAILABLE
							</span>
						</div>
						<p className="text-xs text-muted-foreground">
							With two {REGENT_LABEL_PLURAL} unlocked, use the{" "}
							<span className="text-resurge-violet">Gemini Protocol</span> in
							the Compendium to generate your unique Sovereign abilities.
						</p>
					</div>
				)}

				{/* Unlock New Regent - Caps at 2 */}
				{unlocks.length < 2 && adaptiveChoices.length > 0 && (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="w-full border-regent-gold/40 hover:border-regent-gold hover:bg-regent-gold/10 font-display tracking-wider"
							>
								<Unlock className="h-4 w-4 mr-2 text-regent-gold" />
								APPROACH THE THRONE (Unlock {REGENT_LABEL})
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-card border-regent-gold/40 max-w-lg">
							<DialogHeader>
								<DialogTitle className="font-display text-xl gradient-text-regent flex items-center gap-2">
									<Crown className="h-5 w-5" />
									The Rift Analyzes Your Potential...
								</DialogTitle>
								<div className="text-sm text-muted-foreground mt-2">
									Based on your capabilities and growth, the Rift offers exactly
									three paths to ascendancy. Choose wisely; a{" "}
									{REGENT_LABEL.toLowerCase()} overlay is a profound evolution.
								</div>
							</DialogHeader>

							<div className="space-y-4 pt-2">
								<div className="space-y-3">
									<Label className="font-heading text-regent-gold">
										Adaptive Choices
									</Label>
									<div className="grid grid-cols-1 gap-2">
										{adaptiveChoices.map((regent) => {
											if (!regent.id) return null;
											return (
												<button
													type="button"
													key={regent.id}
													className={cn(
														"w-full text-left p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between",
														selectedRegentId === regent.id
															? "border-regent-gold bg-regent-gold/10 shadow-[0_0_10px_hsl(var(--regent-gold)/0.2)]"
															: "border-border hover:border-regent-gold/50 bg-background/50",
													)}
													onClick={() => setSelectedRegentId(regent.id)}
												>
													<div className="flex items-center gap-3">
														<div
															className={cn(
																"w-8 h-8 rounded-full flex items-center justify-center",
																selectedRegentId === regent.id
																	? "bg-regent-gold text-background"
																	: "bg-muted text-muted-foreground",
															)}
														>
															{themeIcons[regent.theme as string] || (
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
													{selectedRegentId === regent.id && (
														<CheckCircle className="h-4 w-4 text-regent-gold" />
													)}
												</button>
											);
										})}
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
									className="w-full font-display tracking-wider bg-regent-gold hover:bg-regent-gold/80 text-background"
									onClick={handleUnlock}
									disabled={
										!selectedRegentId || !questName.trim() || isUnlocking
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
		</AscendantWindow>
	);
}
