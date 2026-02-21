import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dice1 } from 'lucide-react';
import { useCharacterRoll } from '@/hooks/useCharacterRoll';
import { useCampaignDice } from '@/hooks/useCampaignDice';
import { useAuth } from '@/lib/auth/authContext';

interface InlineRollButtonProps {
  characterId: string;
  characterName: string;
  rollType: 'ability' | 'save' | 'skill';
  rollKey: string;
  label: string;
  modifier?: number;
  campaignId?: string;
  disabled?: boolean;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export function InlineRollButton({
  characterId,
  characterName,
  rollType,
  rollKey,
  label,
  modifier,
  campaignId,
  disabled = false,
  size = 'sm',
  variant = 'outline'
}: InlineRollButtonProps) {
  const { user } = useAuth();
  const characterRoll = useCharacterRoll({
    characterId,
    characterName,
    abilities: {},
    proficiencyBonus: 2,
    savingThrowProficiencies: [],
    skillProficiencies: []
  });

  const { rollInCampaign } = useCampaignDice();

  const handleRoll = async () => {
    try {
      let result;
      
      if (campaignId) {
        // Use campaign-scoped rolling
        result = await rollInCampaign(campaignId, {
          dice_formula: '1d20',
          result: 0, // Will be calculated by the hook
          roll_type: rollType,
          rolls: [0], // Will be populated by the hook
          context: label,
          modifiers: { modifier: modifier || 0 },
          character_id: characterId
        });
      } else {
        // Use character rolling
        switch (rollType) {
          case 'ability':
            result = await characterRoll.rollAbilityCheck(rollKey);
            break;
          case 'save':
            result = await characterRoll.rollSavingThrow(rollKey);
            break;
          case 'skill':
            result = await characterRoll.rollSkillCheck(rollKey);
            break;
          default:
            result = await characterRoll.roll(rollKey, modifier || 0, rollType, label);
        }
      }

      // The roll result will be displayed via toast from the hooks
      return result;
    } catch (error) {
      console.error('Roll error:', error);
    }
  };

  const getRollIcon = () => {
    return <Dice1 className="h-3 w-3" />;
  };

  const getModifierDisplay = () => {
    if (modifier === undefined || modifier === 0) return '';
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRoll}
      disabled={disabled || !user}
      className="inline-flex items-center gap-1 hover:bg-primary/10 transition-colors"
    >
      {getRollIcon()}
      <span>{label}</span>
      {getModifierDisplay() && (
        <Badge variant="secondary" className="text-xs">
          {getModifierDisplay()}
        </Badge>
      )}
    </Button>
  );
}

// Convenience components for common roll types
export function AbilityRollButton(props: Omit<InlineRollButtonProps, 'rollType'>) {
  return <InlineRollButton {...props} rollType="ability" />;
}

export function SaveRollButton(props: Omit<InlineRollButtonProps, 'rollType'>) {
  return <InlineRollButton {...props} rollType="save" />;
}

export function SkillRollButton(props: Omit<InlineRollButtonProps, 'rollType'>) {
  return <InlineRollButton {...props} rollType="skill" />;
}
