type Path = Record<string, any>;
import { useMemo } from 'react';
import type { CharacterWithAbilities as Character } from '@/hooks/useCharacters';
import { calculateCharacterStats, calculateHPMax } from '@/lib/characterCalculations';
import { getAbilityModifier } from '@/types/system-rules';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { getUnarmoredDefenseBaseAC } from '@/lib/unarmoredDefense';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { getActiveConditionEffects } from '@/lib/conditions';
import { calculateEncumbrance, calculateTotalWeight, calculateCarryingCapacity } from '@/lib/encumbrance';
import { getAllSkills, calculateSkillModifier, type SkillDefinition } from '@/lib/skills';
import { resolveAdvantageFromCustomModifiers, sumCustomModifiers, type CustomModifier } from '@/lib/customModifiers';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

export type SheetSkill = {
    modifier: number;
    passive: number;
    ability: AbilityScore;
    proficient: boolean;
    expertise: boolean;
};

export type SheetSkillMap = Record<string, SheetSkill>;

export interface CharacterStatsResult {
    calculatedStats: ReturnType<typeof calculateCharacterStats>;
    skills: SheetSkillMap;
    encumbranceBarClass: string;
    encumbranceValue: number;
    encumbranceMax: number;
    finalAbilities: Record<AbilityScore, number>;
    customAbilityBonuses: number;
    allSkills: SkillDefinition[];
    equipmentMods: ReturnType<typeof applyEquipmentModifiers>;
    runeBonuses: ReturnType<typeof applyRuneBonuses>;
    finalSpeed: number;
    finalInitiative: number;
    initiativeAdvantage: string;
    baseStats: ReturnType<typeof calculateCharacterStats>;
}

export function useCharacterStats(
    character: Character | null | undefined,
    equipment: any[] | undefined | null,
    activeRunes: any[],
    customModifiers: CustomModifier[]
): CharacterStatsResult | null {
    return useMemo(() => {
        if (!character) return null;
        const baseStats = calculateCharacterStats({
            level: character.level || 1,
            abilities: character.abilities || { STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
            savingThrowProficiencies: character.saving_throw_proficiencies || [],
            skillProficiencies: character.skill_proficiencies || [],
            skillExpertise: character.skill_expertise || [],
            armorClass: character.armor_class || 10,
            speed: character.speed || 30,
        });



        const equippedArmor = (equipment || []).some((item: any) => {
            const props = (item.properties || []).map((p: Path) => p.toLowerCase());
            if (!item.is_equipped) return false;
            if (item.requires_attunement && !item.is_attuned) return false;
            return props.includes('light') || props.includes('medium') || props.includes('heavy');
        });

        const unarmoredDefenseBase = equippedArmor
            ? null
            : getUnarmoredDefenseBaseAC(character.job, character.abilities);

        const baseACForEquipment = unarmoredDefenseBase ?? baseStats.armorClass;

        // Apply equipment modifiers
        const equipmentMods = applyEquipmentModifiers(
            baseACForEquipment,
            character.speed,
            character.abilities,
            equipment?.map(item => ({
                ...item,
                properties: item.properties || undefined,
                is_equipped: item.is_equipped || false,
                is_attuned: item.is_attuned || false,
                requires_attunement: item.requires_attunement || false,
            })) || []
        );

        // Combine ability modifiers from equipment
        const equipmentModifiedAbilities = { ...character.abilities };
        Object.entries(equipmentMods.abilityModifiers || {}).forEach(([key, value]) => {
            if (value !== 0) {
                const ability = key.toUpperCase() as keyof typeof equipmentModifiedAbilities;
                if (ability in equipmentModifiedAbilities) {
                    equipmentModifiedAbilities[ability] = (equipmentModifiedAbilities[ability] || 0) + value;
                }
            }
        });

        // Apply rune bonuses from equipped items
        const equippedActiveRunes = activeRunes.filter(ri =>
            ri.equipment?.is_equipped &&
            (!ri.equipment.requires_attunement || ri.equipment.is_attuned) &&
            ri.is_active
        );

        const runeBonuses = useMemo(() => applyRuneBonuses(
            {
                ac: equipmentMods.armorClass,
                speed: equipmentMods.speed,
                abilities: equipmentModifiedAbilities,
                attackBonus: equipmentMods.attackBonus,
                damageBonus: typeof equipmentMods.damageBonus === 'number'
                    ? (equipmentMods.damageBonus > 0 ? `+${equipmentMods.damageBonus}` : '')
                    : (equipmentMods.damageBonus || ''),
            },
            equippedActiveRunes.map(ri => ({ rune: ri.rune, is_active: ri.is_active }))
        ), [equipmentMods, equipmentModifiedAbilities, equippedActiveRunes]);

        // Final abilities with all modifiers
        const finalAbilities = { ...equipmentModifiedAbilities };
        Object.entries(runeBonuses.abilities).forEach(([ability, value]) => {
            if (ability in finalAbilities && value > (equipmentModifiedAbilities[ability as keyof typeof equipmentModifiedAbilities] || 0)) {
                finalAbilities[ability as keyof typeof finalAbilities] = value;
            }
        });

        const customAbilityBonuses = ABILITY_KEYS.reduce((acc, ability) => {
            // Sum bonuses from custom modifiers and character features
            const bonus = sumCustomModifiers(customModifiers, 'ability', ability);
            const featureBonus = sumCustomModifiers(customModifiers, 'ability_bonus', ability);
            return acc + bonus + featureBonus;
        }, 0);

        ABILITY_KEYS.forEach((ability) => {
            const bonus = sumCustomModifiers(customModifiers, 'ability', ability) +
                sumCustomModifiers(customModifiers, 'ability_bonus', ability);
            if (bonus !== 0) {
                finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
            }
        });

        // Calculate initiative (AGI modifier + initiative bonuses)
        const initiativeAdvantage = resolveAdvantageFromCustomModifiers(customModifiers, ['initiative', 'initiative_advantage']);
        const initiativeBonus = sumCustomModifiers(customModifiers, 'initiative_bonus') +
            sumCustomModifiers(customModifiers, 'initiative');
        const finalInitiative = getAbilityModifier(finalAbilities.AGI) + initiativeBonus;

        // HP calculation (with feature bonuses like Mana-Dense Physiology)
        const hpMaxBonus = sumCustomModifiers(customModifiers, 'hp-max') +
            sumCustomModifiers(customModifiers, 'hp_max');
        const finalHPMax = calculateHPMax(character.level, character.hit_dice_size || 8, getAbilityModifier(finalAbilities.VIT)) + hpMaxBonus;

        // Speed (with feature bonuses)
        const speedBonus = sumCustomModifiers(customModifiers, 'speed') +
            sumCustomModifiers(customModifiers, 'speed_bonus');
        let finalSpeed = (character.speed || 30) + speedBonus;

        // AC calculation
        const featureACBonus = sumCustomModifiers(customModifiers, 'ac_bonus');
        const baseACValue = sumCustomModifiers(customModifiers, 'ac_base');
        let finalAC = baseStats.armorClass + featureACBonus;
        if (baseACValue > 0) {
            finalAC = Math.max(finalAC, baseACValue + getAbilityModifier(finalAbilities.AGI) + featureACBonus);
        }

        // Recalculate saving throws with modified abilities
        const customSaveBonuses = ABILITY_KEYS.reduce((acc, ability) => {
            acc[ability] = sumCustomModifiers(customModifiers, 'save', ability);
            return acc;
        }, {} as Record<AbilityScore, number>);
        const finalSavingThrows: Record<AbilityScore, number> = {
            STR: getAbilityModifier(finalAbilities.STR) + (character.saving_throw_proficiencies?.includes('STR') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.STR,
            AGI: getAbilityModifier(finalAbilities.AGI) + (character.saving_throw_proficiencies?.includes('AGI') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.AGI,
            VIT: getAbilityModifier(finalAbilities.VIT) + (character.saving_throw_proficiencies?.includes('VIT') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.VIT,
            INT: getAbilityModifier(finalAbilities.INT) + (character.saving_throw_proficiencies?.includes('INT') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.INT,
            SENSE: getAbilityModifier(finalAbilities.SENSE) + (character.saving_throw_proficiencies?.includes('SENSE') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.SENSE,
            PRE: getAbilityModifier(finalAbilities.PRE) + (character.saving_throw_proficiencies?.includes('PRE') ? (baseStats.proficiencyBonus || 2) : 0) + customSaveBonuses.PRE,
        };

        // Calculate encumbrance
        const totalWeight = calculateTotalWeight(equipment || []);
        const carryingCapacity = calculateCarryingCapacity(finalAbilities.STR);
        const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);

        // Apply speed penalty from encumbrance
        finalSpeed = runeBonuses.speed;
        if (encumbrance.status === 'heavy') {
            finalSpeed = Math.max(0, finalSpeed - 10);
        } else if (encumbrance.status === 'overloaded') {
            finalSpeed = Math.max(0, finalSpeed - 20);
        }

        // Apply condition-based speed modifiers (e.g., grappled/restrained -> 0)
        const conditionEffects = getActiveConditionEffects(character.conditions || []);
        if (conditionEffects.speedModifier === 'zero') {
            finalSpeed = 0;
        } else if (typeof conditionEffects.speedModifier === 'number') {
            finalSpeed = Math.max(0, finalSpeed + conditionEffects.speedModifier);
        }

        const customAcBonus = sumCustomModifiers(customModifiers, 'ac');
        const customSpeedBonus = sumCustomModifiers(customModifiers, 'speed');
        const customInitiativeBonus = sumCustomModifiers(customModifiers, 'initiative');
        const customHpMaxBonus = sumCustomModifiers(customModifiers, 'hp-max');

        const calculatedStats = {
            ...baseStats,
            initiative: baseStats.initiative + customInitiativeBonus,
            savingThrows: finalSavingThrows,
            armorClass: runeBonuses.ac + customAcBonus,
            speed: Math.max(0, finalSpeed + customSpeedBonus),
            hpMax: Math.max(1, (character.hp_max ?? 1) + customHpMaxBonus),
            encumbrance,
        };

        const encumbranceMax = Math.max(calculatedStats.encumbrance.carryingCapacity, 1);
        const encumbranceValue = Math.min(calculatedStats.encumbrance.totalWeight, encumbranceMax);
        const encumbranceBarClass = {
            unencumbered: 'character-sheet-encumbrance--unencumbered',
            light: 'character-sheet-encumbrance--light',
            medium: 'character-sheet-encumbrance--medium',
            heavy: 'character-sheet-encumbrance--heavy',
            overloaded: 'character-sheet-encumbrance--overloaded',
        }[calculatedStats.encumbrance.status];

        // Calculate skills with modified abilities
        const allSkills: SkillDefinition[] = getAllSkills();
        const skills = allSkills.reduce<SheetSkillMap>((acc, skill) => {
            const baseModifier = calculateSkillModifier(
                skill.name,
                finalAbilities,
                character.skill_proficiencies || [],
                character.skill_expertise || [],
                calculatedStats.proficiencyBonus
            );
            const equipmentSkillBonus =
                (equipmentMods.skillBonuses?.[skill.name] || 0) + (equipmentMods.skillBonuses?.['*'] || 0);
            const customSkillBonus = sumCustomModifiers(customModifiers, 'skill', skill.name);
            const modifier = baseModifier + equipmentSkillBonus + customSkillBonus;
            acc[skill.name] = {
                modifier,
                passive: 10 + modifier,
                ability: skill.ability,
                proficient: (character.skill_proficiencies || []).includes(skill.name),
                expertise: (character.skill_expertise || []).includes(skill.name),
            };
            return acc;
        }, {});

        return {
            calculatedStats,
            skills,
            encumbranceBarClass,
            encumbranceValue,
            encumbranceMax,
            finalAbilities,
            customAbilityBonuses,
            allSkills,
            equipmentMods,
            runeBonuses,
            finalSpeed,
            finalInitiative,
            initiativeAdvantage,
            baseStats,
        };
    }, [character, equipment, activeRunes, customModifiers]);
}





