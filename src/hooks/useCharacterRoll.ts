import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRecordRoll } from '@/hooks/useRollHistory';
import { useAuth } from '@/lib/auth/authContext';
import { rollCheck } from '@/lib/rollEngine';
import { useCampaignDice } from '@/hooks/useCampaignDice';

interface CharacterRollProps {
  characterId: string;
  characterName: string;
  abilities: Record<string, number>;
  proficiencyBonus: number;
  savingThrowProficiencies: string[];
  skillProficiencies: string[];
}

export function useCharacterRoll({
  characterId,
  characterName,
  abilities,
  proficiencyBonus,
  savingThrowProficiencies,
  skillProficiencies,
}: CharacterRollProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const recordRoll = useRecordRoll();
  const { rollInCampaign } = useCampaignDice();

  const getAbilityModifier = (ability: string): number => {
    const score = abilities[ability] || 10;
    return Math.floor((score - 10) / 2);
  };

  const getSaveModifier = (ability: string): number => {
    const baseMod = getAbilityModifier(ability);
    const isProficient = savingThrowProficiencies.includes(ability);
    return baseMod + (isProficient ? proficiencyBonus : 0);
  };

  const getSkillModifier = (skill: string): number => {
    // Map skills to their abilities
    const skillAbilityMap: Record<string, string> = {
      'athletics': 'str',
      'Athletics': 'str',
      'acrobatics': 'agi',
      'Acrobatics': 'agi',
      'sleight_of_hand': 'agi',
      'Sleight of Hand': 'agi',
      'stealth': 'agi',
      'Stealth': 'agi',
      'arcana': 'int',
      'Arcana': 'int',
      'history': 'int',
      'History': 'int',
      'investigation': 'int',
      'Investigation': 'int',
      'nature': 'int',
      'Nature': 'int',
      'religion': 'int',
      'Religion': 'int',
      'insight': 'sense',
      'Insight': 'sense',
      'medicine': 'sense',
      'Medicine': 'sense',
      'perception': 'sense',
      'Perception': 'sense',
      'survival': 'sense',
      'Survival': 'sense',
      'deception': 'pre',
      'Deception': 'pre',
      'intimidation': 'pre',
      'Intimidation': 'pre',
      'performance': 'pre',
      'Performance': 'pre',
      'persuasion': 'pre',
      'Persuasion': 'pre',
    };

    const ability = skillAbilityMap[skill] || 'str';
    const baseMod = getAbilityModifier(ability);
    const isProficient = skillProficiencies.includes(skill);
    return baseMod + (isProficient ? proficiencyBonus : 0);
  };

  const roll = useCallback((
    rollKey: string,
    modifier: number,
    kind: 'ability' | 'save' | 'skill',
    label?: string,
    campaignId?: string,
    advantage?: 'advantage' | 'disadvantage' | 'normal'
  ) => {
    if (!rollKey || typeof rollKey !== 'string') {
      toast({ title: 'Roll failed', description: 'Invalid roll target', variant: 'destructive' });
      return null;
    }

    if (!Number.isFinite(modifier)) {
      toast({ title: 'Roll failed', description: 'Modifier unavailable', variant: 'destructive' });
      return null;
    }

    const result = rollCheck(modifier, advantage);
    const d20 = result.rolls[0] ?? 0;
    const total = result.total;

    // Determine if it's a critical success/failure
    const isCritical = result.isNatural20;
    const isFumble = result.isNatural1;

    // Create roll description
    const rollDescription = label || rollKey;
    const rollType = kind === 'ability' ? 'Ability Check' :
      kind === 'save' ? 'Saving Throw' : 'Skill Check';

    // Record the roll
    recordRoll.mutate({
      character_id: characterId,
      campaign_id: campaignId || null,
      dice_formula: `1d20+${modifier}`,
      result: total,
      roll_type: kind,
      rolls: result.droppedRolls ? [d20, ...(result.droppedRolls || [])] : [d20],
      context: rollDescription,
      modifiers: {
        base: modifier,
        proficiency: proficiencyBonus,
        advantage: advantage ?? 'normal',
        dropped: result.droppedRolls ?? null,
      },
    });

    if (campaignId) {
      rollInCampaign(campaignId, {
        dice_formula: `1d20+${modifier}`,
        result: total,
        roll_type: kind,
        rolls: result.droppedRolls ? [d20, ...(result.droppedRolls || [])] : [d20],
        context: rollDescription,
        modifiers: {
          base: modifier,
          proficiency: proficiencyBonus,
          advantage: advantage ?? 'normal',
          dropped: result.droppedRolls ?? null,
        },
        character_id: characterId,
      });
    }

    // Show toast notification
    toast({
      title: `${characterName} - ${rollType}`,
      description: `${rollDescription}: ${d20} + ${modifier} = ${total}${isCritical ? ' (Critical!)' : isFumble ? ' (Fumble!)' : ''}`,
      duration: 3000,
    });

    return { d20, modifier, total, isCritical, isFumble };
  }, [characterId, characterName, proficiencyBonus, recordRoll, toast]);

  // Convenience methods for common rolls
  const rollAbilityCheck = useCallback((ability: string, campaignId?: string) => {
    const modifier = getAbilityModifier(ability);
    return roll(ability, modifier, 'ability', undefined, campaignId);
  }, [roll]);

  const rollSavingThrow = useCallback((ability: string, campaignId?: string) => {
    const modifier = getSaveModifier(ability);
    return roll(`${ability} Save`, modifier, 'save', undefined, campaignId);
  }, [roll]);

  const rollSkillCheck = useCallback((skill: string, campaignId?: string) => {
    const modifier = getSkillModifier(skill);
    return roll(skill, modifier, 'skill', undefined, campaignId);
  }, [roll]);

  return {
    roll,
    rollAbilityCheck,
    rollSavingThrow,
    rollSkillCheck,
    getAbilityModifier,
    getSaveModifier,
    getSkillModifier
  };
}
