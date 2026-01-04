import { useState } from 'react';
import { Swords, Wand2, Sparkles, Star } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionCard } from './ActionCard';
import { useEquipment } from '@/hooks/useEquipment';
import { usePowers } from '@/hooks/usePowers';
import { useFeatures } from '@/hooks/useFeatures';
import { useCharacter } from '@/hooks/useCharacters';
import { getAbilityModifier, getProficiencyBonus } from '@/types/solo-leveling';
import { parseModifiers, applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import type { AbilityScore } from '@/types/solo-leveling';

export function ActionsList({ characterId }: { characterId: string }) {
  const { data: character } = useCharacter(characterId);
  const { equipment } = useEquipment(characterId);
  const { powers } = usePowers(characterId);
  const { features } = useFeatures(characterId);

  if (!character) return null;

  // Get equipment modifiers for abilities
  const equipmentMods = applyEquipmentModifiers(
    character.armor_class,
    character.speed,
    character.abilities,
    equipment
  );

  const proficiencyBonus = getProficiencyBonus(character.level);
  const strMod = getAbilityModifier(character.abilities.STR + (equipmentMods.abilityModifiers.str || 0));
  const agiMod = getAbilityModifier(character.abilities.AGI + (equipmentMods.abilityModifiers.agi || 0));

  // Get equipped weapons
  const weapons = equipment.filter(
    e => e.is_equipped && (e.item_type === 'weapon' || e.item_type?.includes('weapon'))
  );

  // Calculate attack bonuses for weapons
  const weaponActions = weapons.map(weapon => {
    const modifiers = parseModifiers(weapon.properties || []);
    const attackMod = modifiers.attack || 0;
    
    // Determine if weapon uses STR or AGI (default to STR for melee, AGI for ranged)
    const isRanged = weapon.item_type?.includes('ranged') || weapon.name.toLowerCase().includes('bow');
    const abilityMod = isRanged ? agiMod : strMod;
    const attackBonus = abilityMod + proficiencyBonus + attackMod;

    // Parse damage from properties or use default
    let damage = '1d8';
    const damageMatch = weapon.properties?.find(p => p.toLowerCase().includes('damage'));
    if (damageMatch) {
      const damageValue = damageMatch.match(/(\d+d\d+(?:\+\d+)?)/i);
      if (damageValue) damage = damageValue[1];
    } else {
      // Default damage based on weapon type
      damage = isRanged ? '1d6' : '1d8';
      if (modifiers.damage) {
        damage += `+${modifiers.damage}`;
      } else if (abilityMod !== 0) {
        damage += abilityMod >= 0 ? `+${abilityMod}` : `${abilityMod}`;
      }
    }

    return {
      name: weapon.name,
      type: 'action' as const,
      description: weapon.description || 'Weapon attack',
      attackBonus,
      damage,
      range: 'Melee' as const,
    };
  });

  // Get prepared powers
  const preparedPowers = powers.filter(p => p.is_prepared);

  const powerActions = preparedPowers.map(power => ({
    name: power.name,
    type: 'action' as const, // Could be enhanced to read from power data
    description: power.description || '',
    range: power.range || undefined,
    // Powers don't have attack/damage rolls in the same way
  }));

  // Get active features with action types
  const featureActions = features
    .filter(f => f.is_active && f.action_type && f.action_type !== 'passive')
    .map(feature => ({
      name: feature.name,
      type: (feature.action_type || 'action') as 'action' | 'bonus-action' | 'reaction',
      description: feature.description || '',
      uses: feature.uses_max !== null ? {
        current: feature.uses_current || 0,
        max: feature.uses_max,
      } : undefined,
      recharge: feature.recharge || undefined,
    }));

  return (
    <SystemWindow title="ACTIONS">
      <Tabs defaultValue="weapons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weapons" className="gap-2">
            <Swords className="w-4 h-4" />
            Attacks ({weaponActions.length})
          </TabsTrigger>
          <TabsTrigger value="powers" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Powers ({powerActions.length})
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <Star className="w-4 h-4" />
            Features ({featureActions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weapons" className="space-y-3 mt-4">
          {weaponActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Swords className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No weapons equipped</p>
              <p className="text-xs mt-1">Equip a weapon to see attack actions</p>
            </div>
          ) : (
            weaponActions.map((action, i) => (
              <ActionCard
                key={i}
                name={action.name}
                type={action.type}
                description={action.description}
                attackBonus={action.attackBonus}
                damage={action.damage}
                range={action.range}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="powers" className="space-y-3 mt-4">
          {powerActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No prepared powers</p>
              <p className="text-xs mt-1">Prepare powers to see them here</p>
            </div>
          ) : (
            powerActions.map((action, i) => (
              <ActionCard
                key={i}
                name={action.name}
                type={action.type}
                description={action.description}
                range={action.range}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-3 mt-4">
          {featureActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active features</p>
              <p className="text-xs mt-1">Features with actions will appear here</p>
            </div>
          ) : (
            featureActions.map((action, i) => (
              <ActionCard
                key={i}
                name={action.name}
                type={action.type}
                description={action.description}
                uses={action.uses}
                recharge={action.recharge}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </SystemWindow>
  );
}


