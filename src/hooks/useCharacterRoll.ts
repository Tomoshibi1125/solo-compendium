import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRecordRoll } from '@/hooks/useRollHistory';
import { useAuth } from '@/lib/auth/authContext';

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
      'athletics': 'strength',
      'acrobatics': 'dexterity',
      'sleight_of_hand': 'dexterity',
      'stealth': 'dexterity',
      'arcana': 'intelligence',
      'history': 'intelligence',
      'investigation': 'intelligence',
      'nature': 'intelligence',
      'religion': 'intelligence',
      'animal_handling': 'wisdom',
      'insight': 'wisdom',
      'medicine': 'wisdom',
      'perception': 'wisdom',
      'survival': 'wisdom',
      'deception': 'charisma',
      'intimidation': 'charisma',
      'performance': 'charisma',
      'persuasion': 'charisma',
    };
    
    const ability = skillAbilityMap[skill] || 'strength';
    const baseMod = getAbilityModifier(ability);
    const isProficient = skillProficiencies.includes(skill);
    return baseMod + (isProficient ? proficiencyBonus : 0);
  };

  const roll = useCallback((
    rollKey: string,
    modifier: number,
    kind: 'ability' | 'save' | 'skill',
    label?: string,
    campaignId?: string
  ) => {
    if (!rollKey || typeof rollKey !== 'string') {
      toast({ title: 'Roll failed', description: 'Invalid roll target', variant: 'destructive' });
      return null;
    }

    if (!Number.isFinite(modifier)) {
      toast({ title: 'Roll failed', description: 'Modifier unavailable', variant: 'destructive' });
      return null;
    }

    // Generate a random d20 roll
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier;
    
    // Determine if it's a critical success/failure
    const isCritical = d20 === 20;
    const isFumble = d20 === 1;
    
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
      rolls: [d20],
      context: rollDescription,
      modifiers: { base: modifier, proficiency: proficiencyBonus },
    });
    
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
