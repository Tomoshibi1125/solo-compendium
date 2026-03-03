import { Star, Swords, Wand2 } from "lucide-react";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharacterExtras } from "@/hooks/useCharacterExtras";
import {
	featureModifiersToCustomModifiers,
	useCharacterFeatures,
} from "@/hooks/useCharacterFeatures";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import { useCharacter } from "@/hooks/useCharacters";
import { useEquipment } from "@/hooks/useEquipment";
import { useFeatures } from "@/hooks/useFeatures";
import { usePowers } from "@/hooks/usePowers";
import {
	normalizeCustomModifiers,
	sumCustomModifiers,
} from "@/lib/customModifiers";
import {
	applyEquipmentModifiers,
	parseModifiers,
} from "@/lib/equipmentModifiers";
import type { AbilityScore } from "@/types/system-rules";
import { getAbilityModifier, getProficiencyBonus } from "@/types/system-rules";
import { ActionCard } from "./ActionCard";

export interface ActionItem {
	name: string;
	type: string;
	description: string;
	attackBonus?: number;
	damage?: string;
	range?: string;
	uses?: { current: number; max: number };
	recharge?: string;
}

export function ActionsList({
	characterId,
	campaignId,
}: {
	characterId: string;
	campaignId?: string;
}) {
	const { data: character } = useCharacter(characterId);
	const { equipment } = useEquipment(characterId);
	const { powers } = usePowers(characterId);
	const { features } = useFeatures(characterId);
	const { state: sheetState } = useCharacterSheetState(characterId);
	const { extras } = useCharacterExtras(characterId);
	const { data: charFeatures = [] } = useCharacterFeatures(characterId);
	const baseModifiers = normalizeCustomModifiers(sheetState.customModifiers);
	const homebrewModifiers = featureModifiersToCustomModifiers(charFeatures);
	const customModifiers = [...baseModifiers, ...homebrewModifiers];
	if (!character) return null;

	// Get equipment modifiers for abilities
	const equipmentMods = applyEquipmentModifiers(
		character.armor_class,
		character.speed,
		character.abilities,
		equipment.map((item) => ({
			...item,
			properties: item.properties ?? undefined,
		})),
	);

	// Combine ability modifiers from equipment
	const equipmentModifiedAbilities = { ...character.abilities };
	Object.entries(equipmentMods.abilityModifiers || {}).forEach(
		([key, value]) => {
			if (value !== 0) {
				const ability =
					key.toUpperCase() as keyof typeof equipmentModifiedAbilities;
				if (ability in equipmentModifiedAbilities) {
					equipmentModifiedAbilities[ability] =
						(equipmentModifiedAbilities[ability] || 0) + value;
				}
			}
		},
	);

	// Apply rune bonuses
	// Final abilities with all modifiers
	const finalAbilities = { ...equipmentModifiedAbilities };
	const abilityKeys: AbilityScore[] = [
		"STR",
		"AGI",
		"VIT",
		"INT",
		"SENSE",
		"PRE",
	];
	abilityKeys.forEach((ability) => {
		const bonus = sumCustomModifiers(customModifiers, "ability", ability);
		if (bonus !== 0) {
			finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
		}
	});

	const proficiencyBonus = getProficiencyBonus(character.level);
	const strMod = getAbilityModifier(finalAbilities.STR);
	const agiMod = getAbilityModifier(finalAbilities.AGI);

	const getWeaponAbilityMod = (weapon: { properties?: string[] | null }) => {
		const props = (weapon.properties || []).map((p) => p.toLowerCase());
		const isFinesse = props.includes("finesse");
		const isRanged =
			props.some((p) => p.startsWith("range")) || props.includes("ammunition");
		const isThrown = props.includes("thrown");

		if (isRanged && !isThrown) return agiMod;
		if (isFinesse) return Math.max(strMod, agiMod);
		return strMod;
	};

	// Get equipped weapons
	const weapons = equipment.filter(
		(e) =>
			e.is_equipped &&
			(e.item_type === "weapon" || e.item_type?.includes("weapon")),
	);

	// Calculate attack bonuses for weapons
	const weaponActions: ActionItem[] = weapons.map((weapon) => {
		const modifiers = parseModifiers(weapon.properties || []);
		const attackMod = modifiers.attack || 0;

		const abilityMod = getWeaponAbilityMod(weapon);
		const props = (weapon.properties || []).map((p) => p.toLowerCase());
		const isRanged =
			props.some((p) => p.startsWith("range")) || props.includes("ammunition");
		const customAttackBonus = sumCustomModifiers(
			customModifiers,
			"attack",
			isRanged ? "ranged" : "melee",
		);
		const attackBonus =
			abilityMod + proficiencyBonus + attackMod + customAttackBonus;

		// Parse damage from properties or use default
		let damage = "1d8";
		const damageMatch = weapon.properties?.find((p) =>
			p.toLowerCase().includes("damage"),
		);
		if (damageMatch) {
			const damageValue = damageMatch.match(/(\d+d\d+(?:\+\d+)?)/i);
			if (damageValue) damage = damageValue[1];
		} else {
			// Default damage based on weapon type
			damage = isRanged ? "1d6" : "1d8";
			if (modifiers.damage) {
				damage += `+${modifiers.damage}`;
			} else if (abilityMod !== 0) {
				damage += abilityMod >= 0 ? `+${abilityMod}` : `${abilityMod}`;
			}
		}

		const customDamageBonus = sumCustomModifiers(
			customModifiers,
			"damage",
			isRanged ? "ranged" : "melee",
		);
		if (customDamageBonus !== 0) {
			const normalized = damage.replace(/\s+/g, "");
			const match = normalized.match(/(\d+d\d+)([+-]\d+)?/i);
			if (match) {
				const baseDice = match[1];
				const baseMod = parseInt(match[2] || "0", 10);
				const totalMod = baseMod + customDamageBonus;
				damage =
					totalMod !== 0
						? `${baseDice}${totalMod >= 0 ? "+" : ""}${totalMod}`
						: baseDice;
			} else {
				damage +=
					customDamageBonus > 0
						? `+${customDamageBonus}`
						: `${customDamageBonus}`;
			}
		}

		return {
			name: weapon.name,
			type: "action" as string,
			description: weapon.description || "Weapon attack",
			attackBonus,
			damage,
			range: "Melee",
		};
	});

	// Get Wildshape extra attacks
	const activeWildshape = extras.find(
		(e) => e.is_active && e.extra_type === "wildshape" && e.monster,
	);
	const wildshapeActions: ActionItem[] = (
		activeWildshape?.monster?.actions || []
	).map((action) => ({
		name: `[${activeWildshape?.name}] ${action.name}`,
		type: (action.action_type || "action") as string,
		description: action.description,
		attackBonus: action.attack_bonus || undefined,
		damage: action.damage || undefined,
		range: undefined,
	}));

	const allAttacks = [...weaponActions, ...wildshapeActions];

	const standardActions: ActionItem[] = [
		{
			name: "Dash",
			type: "action",
			description:
				"Gain extra movement for the current turn equal to your speed.",
		},
		{
			name: "Disengage",
			type: "action",
			description: "Your movement doesn't provoke opportunity attacks.",
		},
		{
			name: "Dodge",
			type: "action",
			description:
				"Until your next turn, attacks against you have disadvantage and you have advantage on Dex saves.",
		},
		{
			name: "Help",
			type: "action",
			description:
				"Give an ally advantage on their next ability check or attack roll.",
		},
		{
			name: "Hide",
			type: "action",
			description: "Make a Stealth check to become unseen.",
		},
		{
			name: "Ready",
			type: "action",
			description:
				"Decide a trigger and what perceivable circumstance will trigger your reaction.",
		},
		{
			name: "Search",
			type: "action",
			description:
				"Make a Perception or Investigation check to find something.",
		},
		{
			name: "Use an Object",
			type: "action",
			description: "Interact with an object that requires your action.",
		},
	];

	// Get prepared powers
	const preparedPowers = powers.filter((p) => p.is_prepared);

	const powerActions: ActionItem[] = preparedPowers.map((power) => ({
		name: power.name,
		type: "action" as string, // Could be enhanced to read from power data
		description: power.description || "",
		range: power.range || undefined,
		// Powers don't have attack/damage rolls in the same way
	}));

	// Get active features with action types
	const featureActions: ActionItem[] = features
		.filter((f) => f.is_active && f.action_type && f.action_type !== "passive")
		.map((feature) => ({
			name: feature.name,
			type: (feature.action_type || "action") as string,
			description: feature.description || "",
			uses:
				feature.uses_max !== null
					? {
							current: feature.uses_current || 0,
							max: feature.uses_max,
						}
					: undefined,
			recharge: feature.recharge || undefined,
		}));

	// Group all actions by their action economy type
	const groupedActions = {
		action: [
			...weaponActions,
			...wildshapeActions,
			...powerActions,
			...featureActions,
			...standardActions,
		].filter((a) => a.type === "action" || !a.type),
		bonusAction: [
			...weaponActions,
			...wildshapeActions,
			...powerActions,
			...featureActions,
		].filter(
			(a) =>
				a.type === "bonus-action" ||
				a.type === "bonus action" ||
				a.type === "bonus action (bonus action)",
		),
		reaction: [
			...weaponActions,
			...wildshapeActions,
			...powerActions,
			...featureActions,
		].filter((a) => a.type === "reaction"),
		other: [
			...weaponActions,
			...wildshapeActions,
			...powerActions,
			...featureActions,
		].filter(
			(a) => a.type === "passive" || a.type === "special" || a.type === "other",
		),
	};

	return (
		<SystemWindow title="ACTIONS">
			<Tabs defaultValue="action" className="w-full">
				<TabsList className="grid w-full grid-cols-4 h-12">
					<TabsTrigger
						value="action"
						className="text-xs sm:text-sm flex flex-col items-center justify-center p-1"
					>
						<Swords className="w-3 h-3 mb-0.5" />
						<span className="leading-tight">Action</span>
						<span className="text-[10px] opacity-70">
							({groupedActions.action.length})
						</span>
					</TabsTrigger>
					<TabsTrigger
						value="bonusAction"
						className="text-xs sm:text-sm flex flex-col items-center justify-center p-1"
					>
						<Star className="w-3 h-3 mb-0.5" />
						<span className="leading-tight">Bonus</span>
						<span className="text-[10px] opacity-70">
							({groupedActions.bonusAction.length})
						</span>
					</TabsTrigger>
					<TabsTrigger
						value="reaction"
						className="text-xs sm:text-sm flex flex-col items-center justify-center p-1"
					>
						<Wand2 className="w-3 h-3 mb-0.5" />
						<span className="leading-tight">Reaction</span>
						<span className="text-[10px] opacity-70">
							({groupedActions.reaction.length})
						</span>
					</TabsTrigger>
					<TabsTrigger
						value="other"
						className="text-xs sm:text-sm flex flex-col items-center justify-center p-1"
					>
						<span className="w-3 h-3 mb-0.5 flex items-center justify-center rounded-full border text-[8px]">
							?
						</span>
						<span className="leading-tight">Other</span>
						<span className="text-[10px] opacity-70">
							({groupedActions.other.length})
						</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="action" className="space-y-3 mt-4">
					{groupedActions.action.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Swords className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No Actions Available</p>
							<p className="text-xs mt-1">Equip weapons or prepare powers</p>
						</div>
					) : (
						groupedActions.action.map((action, i) => (
							<ActionCard
								key={i}
								{...action}
								characterId={characterId}
								campaignId={campaignId}
							/>
						))
					)}
				</TabsContent>

				<TabsContent value="bonusAction" className="space-y-3 mt-4">
					{groupedActions.bonusAction.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No Bonus Actions</p>
						</div>
					) : (
						groupedActions.bonusAction.map((action, i) => (
							<ActionCard
								key={i}
								{...action}
								characterId={characterId}
								campaignId={campaignId}
							/>
						))
					)}
				</TabsContent>

				<TabsContent value="reaction" className="space-y-3 mt-4">
					{groupedActions.reaction.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No Reactions</p>
						</div>
					) : (
						groupedActions.reaction.map((action, i) => (
							<ActionCard
								key={i}
								{...action}
								characterId={characterId}
								campaignId={campaignId}
							/>
						))
					)}
				</TabsContent>

				<TabsContent value="other" className="space-y-3 mt-4">
					{groupedActions.other.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<span className="w-12 h-12 mx-auto mb-2 opacity-50 flex items-center justify-center rounded-full border text-2xl">
								?
							</span>
							<p>No Other Actions</p>
						</div>
					) : (
						groupedActions.other.map((action, i) => (
							<ActionCard
								key={i}
								{...action}
								characterId={characterId}
								campaignId={campaignId}
							/>
						))
					)}
				</TabsContent>
			</Tabs>
		</SystemWindow>
	);
}
