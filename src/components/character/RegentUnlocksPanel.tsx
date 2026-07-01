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
import { RegentCatchUpModal } from "@/components/character/RegentCatchUpModal";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	useRegentUnlockGrants,
	useRegentUnlocks,
} from "@/hooks/useRegentUnlocks";
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
	// After a player spends a credit, drive the one-time retroactive catch-up
	// picker for the newly-attuned regent.
	const [catchUpFor, setCatchUpFor] = useState<{
		regentId: string;
		unlockId: string;
	} | null>(null);

	const { data: character } = useCharacter(characterId);
	const {
		unlocks = [],
		updateUnlock,
		consumeGrantAsync,
		isConsuming,
	} = useRegentUnlocks(characterId);
	const { grants, availableCredits } = useRegentUnlockGrants(characterId);

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

		// D3: thematic matching. Each regent theme has an ability affinity;
		// score a candidate by the SUM of the character's scores in its
		// affine abilities, plus a bonus when the theme aligns with the
		// character's job emphasis. This surfaces regents that actually fit
		// the build (a high-STR Berserker sees Strength/War/Titan themes
		// first) instead of the previous char-code noise.
		const abilityOf = (key: string) => abilities[key] || 10;

		// theme (lowercased) → abilities it draws on
		const THEME_AFFINITY: Record<string, string[]> = {
			shadow: ["AGI", "PRE"],
			umbral: ["AGI", "PRE"],
			dragon: ["STR", "PRE"],
			beast: ["STR", "VIT"],
			frost: ["INT", "SENSE"],
			destruction: ["STR", "INT"],
			steel: ["VIT", "STR"],
			war: ["STR", "PRE"],
			radiant: ["PRE", "SENSE"],
			plague: ["VIT", "INT"],
			gravity: ["INT", "SENSE"],
			spatial: ["INT", "SENSE"],
			mimic: ["AGI", "INT"],
			blood: ["VIT", "STR"],
			titan: ["STR", "VIT"],
		};

		// Job → thematic keywords it favors (bonus when a regent matches).
		const jobThemeBonus: Record<string, string[]> = {
			berserker: ["war", "titan", "beast", "destruction"],
			destroyer: ["destruction", "war", "titan"],
			mage: ["frost", "gravity", "spatial"],
			technomancer: ["steel", "spatial", "gravity"],
			esper: ["gravity", "spatial", "mimic"],
			striker: ["shadow", "beast"],
			assassin: ["shadow", "umbral", "blood"],
			stalker: ["beast", "shadow"],
			"holy knight": ["radiant", "war"],
			herald: ["radiant", "plague"],
			summoner: ["beast", "blood"],
			revenant: ["umbral", "plague", "blood"],
			idol: ["radiant", "mimic"],
			contractor: ["mimic", "shadow"],
		};
		const job = (character?.job ?? "").trim().toLowerCase();
		const favored = new Set(jobThemeBonus[job] ?? []);

		const scoreOf = (theme: string | null): number => {
			const t = (theme ?? "").trim().toLowerCase();
			const affinity = THEME_AFFINITY[t];
			// Base: sum of affine ability scores (or overall average for
			// unknown themes so they still rank sensibly).
			const base = affinity
				? affinity.reduce((sum, ab) => sum + abilityOf(ab), 0)
				: (abilityOf("STR") +
						abilityOf("AGI") +
						abilityOf("VIT") +
						abilityOf("INT") +
						abilityOf("SENSE") +
						abilityOf("PRE")) /
					3;
			// Job alignment bonus.
			return base + (favored.has(t) ? 12 : 0);
		};

		const ranked = [...availableLockedRegents].sort((a, b) => {
			const diff = scoreOf(b.theme) - scoreOf(a.theme);
			// Stable tie-break by name so the list is deterministic.
			return diff !== 0 ? diff : (a.name || "").localeCompare(b.name || "");
		});

		return ranked.slice(0, 3);
	}, [availableLockedRegents, character]);

	// Spend a Warden-granted credit on the chosen regent. Players can only reach
	// here when they hold an unspent credit (availableCredits > 0) — there is no
	// self-unlock. The Warden grants the opportunity; the player picks 1-of-3.
	const handleConsume = async () => {
		if (!selectedRegentId) return;
		const grant = grants[0];
		if (!grant) return;

		const regent = allRegents.find((r) => r.id === selectedRegentId);
		const regentName = regent
			? formatRegentVernacular(regent.title || regent.name)
			: "A Regent";

		try {
			const unlock = await consumeGrantAsync({
				grantId: grant.id,
				regentId: selectedRegentId,
				questTitle: grant.quest_title,
				isPrimary: unlocks.length === 0,
			});

			await ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`${REGENT_LABEL} Unlocked`,
					regentName,
					"SA",
				)
				.catch(console.error);

			setOpen(false);
			setSelectedRegentId("");
			// Open the one-time catch-up picker for the accumulated regent picks.
			if (unlock?.id) {
				setCatchUpFor({ regentId: selectedRegentId, unlockId: unlock.id });
			}
		} catch (err) {
			console.error(err);
		}
	};

	// Show the catch-up picker for a freshly-attuned regent, or for any existing
	// unlock whose retroactive picks were never granted (caught_up_at_level null).
	const pendingCatchUp = unlocks.find(
		(u: { caught_up_at_level: number | null }) => u.caught_up_at_level == null,
	);
	const catchUpTarget =
		catchUpFor ??
		(pendingCatchUp
			? { regentId: pendingCatchUp.regent_id, unlockId: pendingCatchUp.id }
			: null);

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

				{/* Awaiting a Warden grant: no self-unlock, no credit yet. */}
				{unlocks.length < 2 && availableCredits === 0 && (
					<div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
						<Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							Complete a{" "}
							<span className="text-regent-gold">regent-tagged quest</span> and
							have your Warden confirm it. They will award you a {REGENT_LABEL}{" "}
							unlock — then you choose from three paths here.
						</p>
					</div>
				)}

				{/* Spend a Warden-granted credit - Caps at 2 regents */}
				{unlocks.length < 2 &&
					availableCredits > 0 &&
					adaptiveChoices.length > 0 && (
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="w-full border-regent-gold/40 hover:border-regent-gold hover:bg-regent-gold/10 font-display tracking-wider"
								>
									<Unlock className="h-4 w-4 mr-2 text-regent-gold" />
									APPROACH THE THRONE (Attune {REGENT_LABEL})
								</Button>
							</DialogTrigger>
							<DialogContent className="bg-card border-regent-gold/40 max-w-lg">
								<DialogHeader>
									<DialogTitle className="font-display text-xl gradient-text-regent flex items-center gap-2">
										<Crown className="h-5 w-5" />
										The Rift Analyzes Your Potential...
									</DialogTitle>
									<div className="text-sm text-muted-foreground mt-2">
										Your Warden confirmed{" "}
										<span className="text-regent-gold">
											{formatRegentVernacular(grants[0]?.quest_title ?? "")}
										</span>
										. The Rift offers exactly three paths to ascendancy, drawn
										from your highest capabilities. Choose wisely; a{" "}
										{REGENT_LABEL.toLowerCase()} overlay is a profound
										evolution.
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

									<Button
										className="w-full font-display tracking-wider bg-regent-gold hover:bg-regent-gold/80 text-background"
										onClick={handleConsume}
										disabled={!selectedRegentId || isConsuming}
									>
										<Crown className="h-4 w-4 mr-2" />
										{isConsuming
											? "ATTUNING..."
											: `ATTUNE ${REGENT_LABEL.toUpperCase()} POWER`}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					)}

				{catchUpTarget && (
					<RegentCatchUpModal
						characterId={characterId}
						regentId={catchUpTarget.regentId}
						unlockId={catchUpTarget.unlockId}
						campaignId={campaignId}
						open
						onComplete={() => setCatchUpFor(null)}
					/>
				)}
			</div>
		</AscendantWindow>
	);
}
