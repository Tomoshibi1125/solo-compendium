/**
 * AbilitiesPanel — top-level character "Abilities" tab on the character sheet.
 *
 * Hosts three sub-tabs:
 *   • Powers      — spells/cantrips (delegates to PowersList with hideHeader)
 *   • Techniques  — Sword Arts / techniques (delegates to TechniquesList)
 *   • Resources   — limited-use feature charges (delegates to LimitedUseTracker)
 *
 * Sub-tabs share the same characterId/campaignId context. The outer tab on the
 * sheet keeps its `value="powers"` storage key for backward compatibility — only
 * the visible label is renamed to "Abilities" in CharacterSheetV2.
 */

import { Gauge, ScrollText, Sword, Wand2 } from "lucide-react";
import { useState } from "react";
import { LimitedUseAggregator } from "@/components/character/LimitedUseAggregator";
import { LimitedUseTracker } from "@/components/character/LimitedUseTracker";
import { PowersList } from "@/components/character/PowersList";
import { SpellSlotsDisplay } from "@/components/character/SpellSlotsDisplay";
import { SpellsList } from "@/components/character/SpellsList";
import { TechniquesList } from "@/components/character/TechniquesList";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharacter } from "@/hooks/useCharacters";
import type { useSpellCasting } from "@/hooks/useSpellCasting";
import { getCasterType } from "@/lib/characterCalculations";
import type { DetailData } from "@/types/character";

interface AbilitiesPanelProps {
	characterId: string;
	campaignId?: string;
	spellCasting?: ReturnType<typeof useSpellCasting>;
	onSelectDetail?: (detail: DetailData, type?: string) => void;
}

export function AbilitiesPanel({
	characterId,
	campaignId,
	spellCasting,
	onSelectDetail,
}: AbilitiesPanelProps) {
	const [activeSubTab, setActiveSubTab] = useState<
		"spells" | "powers" | "techniques" | "resources"
	>("spells");
	const { data: character } = useCharacter(characterId);
	const isCaster = !!character?.job && getCasterType(character.job) !== "none";

	return (
		<AscendantWindow title="ABILITIES">
			<Tabs
				value={activeSubTab}
				onValueChange={(value) =>
					setActiveSubTab(
						value as "spells" | "powers" | "techniques" | "resources",
					)
				}
				className="w-full"
			>
				<TabsList className="grid grid-cols-4 mb-4">
					<TabsTrigger
						value="spells"
						className="gap-2 data-[state=active]:text-primary"
					>
						<ScrollText className="w-3.5 h-3.5" />
						<span className="text-xs uppercase tracking-wider">Spells</span>
					</TabsTrigger>
					<TabsTrigger
						value="powers"
						className="gap-2 data-[state=active]:text-primary"
					>
						<Wand2 className="w-3.5 h-3.5" />
						<span className="text-xs uppercase tracking-wider">Powers</span>
					</TabsTrigger>
					<TabsTrigger
						value="techniques"
						className="gap-2 data-[state=active]:text-primary"
					>
						<Sword className="w-3.5 h-3.5" />
						<span className="text-xs uppercase tracking-wider">Techniques</span>
					</TabsTrigger>
					<TabsTrigger
						value="resources"
						className="gap-2 data-[state=active]:text-primary"
					>
						<Gauge className="w-3.5 h-3.5" />
						<span className="text-xs uppercase tracking-wider">Resources</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="spells" className="mt-0 outline-none">
					<SpellsList
						characterId={characterId}
						spellCasting={spellCasting}
						campaignId={campaignId}
						onSelectDetail={onSelectDetail}
						hideHeader
					/>
				</TabsContent>

				<TabsContent value="powers" className="mt-0 outline-none">
					<PowersList
						characterId={characterId}
						spellCasting={spellCasting}
						campaignId={campaignId}
						onSelectDetail={onSelectDetail}
						hideHeader
					/>
				</TabsContent>

				<TabsContent value="techniques" className="mt-0 outline-none">
					<TechniquesList
						characterId={characterId}
						campaignId={campaignId}
						onSelectDetail={onSelectDetail}
						hideHeader
					/>
				</TabsContent>

				<TabsContent value="resources" className="mt-0 outline-none space-y-4">
					{isCaster && (
						<SpellSlotsDisplay
							characterId={characterId}
							job={character?.job ?? null}
							level={character?.level ?? 1}
							abilities={character?.abilities ?? undefined}
						/>
					)}
					{/* Interactive trackers for features that carry structured uses. */}
					<LimitedUseTracker characterId={characterId} />
					{/* Auto-derived limited-use features from job/path/regent data. */}
					<LimitedUseAggregator characterId={characterId} />
				</TabsContent>
			</Tabs>
		</AscendantWindow>
	);
}
