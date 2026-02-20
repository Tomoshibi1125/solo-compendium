import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const roll = useCallback((
    rollKey: string,
    modifier: number,
    kind: 'ability' | 'save' | 'skill',
    label?: string
  ) => {
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
    
    // Show toast notification
    toast({
      title: `${characterName} - ${rollType}`,
      description: `${rollDescription}: ${d20} + ${modifier} = ${total}${isCritical ? ' (Critical!)' : isFumble ? ' (Fumble!)' : ''}`,
      duration: 3000,
    });

    // In a full implementation, this would also:
    // - Send the roll to the VTT/campaign log
    // - Update character resources if needed
    // - Apply any special effects from critical hits/fumbles
    
    return { d20, modifier, total, isCritical, isFumble };
  }, [characterName, toast]);

  return { roll };
}
