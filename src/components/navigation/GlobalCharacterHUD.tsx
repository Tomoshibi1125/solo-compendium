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
		character,
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
		<div className="sticky top-16 z-30 w-full border-b border-primary/20 bg-background/90 backdrop-blur-md shadow-lg transition-all duration-300">
			<div className="container mx-auto px-4 md:px-8 h-14 md:h-12 flex items-center justify-between gap-4 md:gap-6">
				{/* Quick Identity */}
				<div className="flex items-center gap-2 md:gap-3 min-w-0">
					{character.portrait_url && (
						<div className="w-8 h-8 rounded-[2px] border border-primary/40 overflow-hidden hidden sm:block shrink-0">
							<img
								src={character.portrait_url}
								alt={character.name}
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-3 min-w-0">
						<span className="font-display font-bold text-[10px] md:text-sm tracking-wide text-primary uppercase truncate">
							{character.name}
						</span>
						<Badge
							variant="outline"
							className="h-4 md:h-5 text-[8px] md:text-[10px] border-primary/30 text-primary/70 w-fit px-1 shrink-0"
						>
							LVL {character.level}
						</Badge>
					</div>
				</div>

				{/* Core HUD Stats */}
				<div className="flex items-center gap-4 md:gap-8 flex-1 justify-end md:justify-center">
					{/* HP Bar */}
					<div className="flex items-center gap-2 md:gap-3 flex-1 max-w-[120px] md:max-w-none md:min-w-[200px]">
						<Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500/20 shrink-0" />
						<div className="flex-1 space-y-0.5 md:space-y-1">
							<div className="flex justify-between text-[8px] md:text-[10px] font-mono leading-none">
								<span className="hidden xs:inline">HP</span>
								<span>
									{character.hp_current}/{character.hp_max}
								</span>
							</div>
							<Progress
								value={(character.hp_current / character.hp_max) * 100}
								className="h-1 md:h-1.5 bg-red-950/30"
							/>
						</div>
					</div>

					{/* Quick Defense/Init/Favor */}
					<div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-sm font-display shrink-0">
						<div
							className="flex items-center gap-1.5 md:gap-2 group cursor-help"
							title="Armor Class"
						>
							<Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
							<span className="font-bold text-blue-100">
								{derivedStats?.calculatedStats.armorClass ??
									character.armor_class}
							</span>
						</div>
						<div
							className="flex items-center gap-1.5 md:gap-2 group cursor-help hidden xs:flex"
							title="Initiative"
						>
							<Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
							<span className="font-bold text-yellow-100">
								{formatModifier(derivedStats?.calculatedStats.initiative ?? 0)}
							</span>
						</div>
						<div
							className="flex items-center gap-1.5 md:gap-2 group cursor-help"
							title="Rift Favor"
						>
							<Dice6 className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
							<span className="font-bold text-purple-100">
								{character.rift_favor_current}
							</span>
						</div>
					</div>
				</div>

				{/* Notifications / Toggles - Only show on larger mobile/desktop to prevent cramming */}
				<div className="hidden sm:flex items-center gap-4 shrink-0">
					{characterResources.inspiration.inspiration_points > 0 && (
						<Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse text-[10px]">
							INSPIRE
						</Badge>
					)}
					{character.exhaustion_level > 0 && (
						<Badge variant="destructive" className="text-[10px]">
							EXH {character.exhaustion_level}
						</Badge>
					)}
				</div>
			</div>
			{/* Scanner Line Overlay */}
			<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
		</div>
	);
}
