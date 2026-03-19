import { Dice6, Heart, Shield, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useActiveCharacter } from "@/hooks/useActiveCharacter";
import { useCharacterDerivedStats } from "@/hooks/useCharacterDerivedStats";
import {
	useCharacterResources,
	useCharacterSheetState,
} from "@/hooks/useCharacterSheetState";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { useEquipment } from "@/hooks/useEquipment";
import { useRunes } from "@/hooks/useRunes";
import { useSigils } from "@/hooks/useSigils";
import { formatModifier } from "@/lib/characterCalculations";

export function GlobalCharacterHUD() {
	const location = useLocation();
	const { activeCharacter: character } = useActiveCharacter();
	const charId = character?.id || "";

	const { equipment } = useEquipment(charId);
	const { data: runes } = useRunes(charId);
	const { data: sigils } = useSigils(charId);
	const { state: sheetState } = useCharacterSheetState(charId);

	const derivedStats = useCharacterDerivedStats(
		character as unknown as CharacterWithAbilities | null,
		equipment || [],
		runes || [],
		sigils || [],
		sheetState?.customModifiers || [],
	);

	const [characterResources] = useCharacterResources(charId);

	const isAuthPage =
		location.pathname.startsWith("/login") ||
		location.pathname.startsWith("/auth") ||
		location.pathname.startsWith("/setup");

	if (isAuthPage || !character) return null;

	return (
		<div className="sticky top-16 z-30 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md shadow-lg hidden md:block">
			<div className="container mx-auto px-8 h-12 flex items-center justify-between gap-6">
				{/* Quick Identity */}
				<div className="flex items-center gap-3">
					<span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">
						ACTIVE_ASCENDANT:
					</span>
					<span className="font-display font-bold text-sm tracking-wide text-primary uppercase">
						{character.name}
					</span>
					<Badge
						variant="outline"
						className="h-5 text-[10px] border-primary/30 text-primary/70"
					>
						LVL {character.level}
					</Badge>
				</div>

				{/* Core HUD Stats */}
				<div className="flex items-center gap-8 flex-1 justify-center max-w-2xl">
					{/* HP Bar */}
					<div className="flex items-center gap-3 flex-1 min-w-[200px]">
						<Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
						<div className="flex-1 space-y-1">
							<div className="flex justify-between text-[10px] font-mono leading-none">
								<span>HP</span>
								<span>
									{character.hp_current} / {character.hp_max}
								</span>
							</div>
							<Progress
								value={(character.hp_current / character.hp_max) * 100}
								className="h-1.5 bg-red-950/30"
							/>
						</div>
					</div>

					{/* Quick Defense/Init/Speed */}
					<div className="flex items-center gap-6 text-sm font-display">
						<div
							className="flex items-center gap-2 group cursor-help"
							title="Armor Class"
						>
							<Shield className="w-4 h-4 text-blue-400" />
							<span className="font-bold text-blue-100">
								{derivedStats?.calculatedStats.armorClass ??
									character.armor_class}
							</span>
						</div>
						<div
							className="flex items-center gap-2 group cursor-help"
							title="Initiative"
						>
							<Zap className="w-4 h-4 text-yellow-400" />
							<span className="font-bold text-yellow-100">
								{formatModifier(derivedStats?.calculatedStats.initiative ?? 0)}
							</span>
						</div>
						<div
							className="flex items-center gap-2 group cursor-help"
							title="System Favor"
						>
							<Dice6 className="w-4 h-4 text-purple-400" />
							<span className="font-bold text-purple-100">
								{character.system_favor_current}
							</span>
						</div>
					</div>
				</div>

				{/* Notifications / Toggles */}
				<div className="flex items-center gap-4">
					{characterResources.inspiration.inspiration_points > 0 && (
						<Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse text-[10px]">
							INSPIRATION
						</Badge>
					)}
					{character.exhaustion_level > 0 && (
						<Badge variant="destructive" className="text-[10px]">
							EXHAUSTION {character.exhaustion_level}
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}
