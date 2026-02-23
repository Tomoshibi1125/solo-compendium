import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InlineRollButton, AbilityRollButton, SaveRollButton, SkillRollButton } from './InlineRollButton';
import { useAuth } from '@/lib/auth/authContext';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

interface CharacterRollsPanelProps {
  characterId: string;
  characterName: string;
  abilities: Record<string, number>;
  proficiencyBonus: number;
  savingThrowProficiencies: string[];
  skills: Array<{
    name: string;
    ability: string;
    proficiency: string;
  }>;
  campaignId?: string;
  className?: string;
}

export function CharacterRollsPanel({
  characterId,
  characterName,
  abilities,
  proficiencyBonus,
  savingThrowProficiencies,
  skills,
  campaignId,
  className
}: CharacterRollsPanelProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Calculate ability modifiers
  const getAbilityModifier = (ability: number) => Math.floor((ability - 10) / 2);

  // Calculate saving throw modifiers
  const getSaveModifier = (ability: string) => {
    const baseMod = getAbilityModifier(abilities[ability.toLowerCase()] || 10);
    const isProficient = savingThrowProficiencies?.includes(ability.toLowerCase());
    return baseMod + (isProficient ? proficiencyBonus : 0);
  };

  // Calculate skill modifiers
  const getSkillModifier = (skill: any) => {
    if (!skill) return 0;
    
    const abilityMod = getAbilityModifier(abilities[skill.ability.toLowerCase()] || 10);
    
    if (skill.proficiency === 'proficient') {
      return abilityMod + proficiencyBonus;
    } else if (skill.proficiency === 'expertise') {
      return abilityMod + (proficiencyBonus * 2);
    }
    return abilityMod;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Rolls</CardTitle>
        <p className="text-sm text-muted-foreground">
          One-click rolls with auto-populated modifiers
          {campaignId && (
            <Badge variant="secondary" className="ml-2">
              Campaign: {campaignId}
            </Badge>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Ability Checks */}
        <div>
          <h4 className="font-medium mb-2">Ability Checks</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ABILITY_KEYS.map((ability) => (
              <AbilityRollButton
                key={ability}
                characterId={characterId}
                characterName={characterName}
                rollKey={ability.toLowerCase()}
                label={ability}
                modifier={getAbilityModifier(abilities[ability.toLowerCase()] || abilities[ability] || 10)}
                campaignId={campaignId}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Saving Throws */}
        <div>
          <h4 className="font-medium mb-2">Saving Throws</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ABILITY_KEYS.map((ability) => (
              <SaveRollButton
                key={ability}
                characterId={characterId}
                characterName={characterName}
                rollKey={ability.toLowerCase()}
                label={ABILITY_NAMES[ability]}
                modifier={getSaveModifier(ability)}
                campaignId={campaignId}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Skills */}
        <div>
          <h4 className="font-medium mb-2">Skills</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {skills?.map((skill: any) => (
              <SkillRollButton
                key={skill.name}
                characterId={characterId}
                characterName={characterName}
                rollKey={skill.name}
                label={skill.name}
                modifier={getSkillModifier(skill)}
                campaignId={campaignId}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Common Actions */}
        <div>
          <h4 className="font-medium mb-2">Common Actions</h4>
          <div className="flex flex-wrap gap-2">
            <InlineRollButton
              characterId={characterId}
              characterName={characterName}
              rollType="ability"
              rollKey="initiative"
              label="Initiative"
              modifier={getAbilityModifier(abilities.agi || abilities.AGI || 10)}
              campaignId={campaignId}
            />
            <InlineRollButton
              characterId={characterId}
              characterName={characterName}
              rollType="ability"
              rollKey="perception"
              label="Perception"
              modifier={getSkillModifier(skills?.find((s: any) => s.name === 'Perception'))}
              campaignId={campaignId}
            />
            <InlineRollButton
              characterId={characterId}
              characterName={characterName}
              rollType="ability"
              rollKey="stealth"
              label="Stealth"
              modifier={getSkillModifier(skills?.find((s: any) => s.name === 'Stealth'))}
              campaignId={campaignId}
            />
          </div>
        </div>

        {/* Campaign Context Info */}
        {campaignId && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Campaign Mode:</strong> All rolls will be shared with your campaign chat and recorded in the campaign's roll history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
