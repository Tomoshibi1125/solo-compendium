import { useState } from 'react';
import { Swords, Wand2, Sparkles, Star } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionCard } from './ActionCard';
import { useEquipment } from '@/hooks/useEquipment';
import { usePowers } from '@/hooks/usePowers';
import { useFeatures } from '@/hooks/useFeatures';
import { useCharacter } from '@/hooks/useCharacters';
import { useCharacterRuneInscriptions } from '@/hooks/useRunes';
import { getAbilityModifier, getProficiencyBonus } from '@/types/solo-leveling';
import { parseModifiers, applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { logger } from '@/lib/logger';
import type { AbilityScore } from '@/types/solo-leveling';
import type { Database } from '@/integrations/supabase/types';

type Rune = Database['public']['Tables']['compendium_runes']['Row'];

export function ActionsList({ characterId }: { characterId: string }) {
  const { data: character } = useCharacter(characterId);
  const { equipment } = useEquipment(characterId);
  const { powers } = usePowers(characterId);
  const { features } = useFeatures(characterId);
  const { data: activeRunes = [] } = useCharacterRuneInscriptions(characterId);
  const useRune = useUseRune();

  if (!character) return null;

  const handleUseRune = async (inscriptionId: string) => {
    try {
      await useRune.mutateAsync({ inscriptionId });
    } catch (error) {
      // Error handling is done by the mutation
      logger.error('Failed to use rune:', error);
    }
  };

  // Get equipment modifiers for abilities
  const equipmentMods = applyEquipmentModifiers(
    character.armor_class,
    character.speed,
    character.abilities,
    equipment
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

  // Apply rune bonuses
  const equippedActiveRunes = activeRunes.filter(ri => 
    ri.equipment?.is_equipped && 
    (!ri.equipment.requires_attunement || ri.equipment.is_attuned) &&
    ri.is_active
  );

  const runeBonuses = applyRuneBonuses(
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
  );

  // Final abilities with all modifiers
  const finalAbilities = { ...equipmentModifiedAbilities };
  Object.entries(runeBonuses.abilities).forEach(([ability, value]) => {
    if (ability in finalAbilities && value > (equipmentModifiedAbilities[ability as keyof typeof equipmentModifiedAbilities] || 0)) {
      finalAbilities[ability as keyof typeof finalAbilities] = value;
    }
  });

  const proficiencyBonus = getProficiencyBonus(character.level);
  const strMod = getAbilityModifier(finalAbilities.STR);
  const agiMod = getAbilityModifier(finalAbilities.AGI);

  // Get equipped weapons
  const weapons = equipment.filter(
    e => e.is_equipped && (e.item_type === 'weapon' || e.item_type?.includes('weapon'))
  );

  // Get rune attack and damage bonuses for each weapon
  const weaponRuneAttackBonuses = new Map<string, number>();
  const weaponRuneDamageBonuses = new Map<string, string>();
  equippedActiveRunes.forEach(ri => {
    if (ri.equipment?.is_equipped && ri.rune.passive_bonuses) {
      const bonuses = ri.rune.passive_bonuses as Record<string, unknown>;
      const weaponName = ri.equipment.name;
      if (bonuses.attack_bonus && typeof bonuses.attack_bonus === 'number') {
        weaponRuneAttackBonuses.set(weaponName, (weaponRuneAttackBonuses.get(weaponName) || 0) + bonuses.attack_bonus);
      }
      if (bonuses.damage_bonus && typeof bonuses.damage_bonus === 'string') {
        const existing = weaponRuneDamageBonuses.get(weaponName) || '';
        weaponRuneDamageBonuses.set(weaponName, existing ? `${existing} + ${bonuses.damage_bonus}` : bonuses.damage_bonus);
      }
    }
  });

  // Calculate attack bonuses for weapons (with rune bonuses)
  const weaponActions = weapons.map(weapon => {
    const modifiers = parseModifiers(weapon.properties || []);
    const attackMod = modifiers.attack || 0;
    const runeAttackBonus = weaponRuneAttackBonuses.get(weapon.name) || 0;
    
    // Determine if weapon uses STR or AGI (default to STR for melee, AGI for ranged)
    const isRanged = weapon.item_type?.includes('ranged') || weapon.name.toLowerCase().includes('bow');
    const abilityMod = isRanged ? agiMod : strMod;
    const attackBonus = abilityMod + proficiencyBonus + attackMod + runeAttackBonus;

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
    
    // Add rune damage bonuses
    const runeDamageBonus = weaponRuneDamageBonuses.get(weapon.name);
    if (runeDamageBonus) {
      damage += ` + ${runeDamageBonus}`;
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

  // Get rune active abilities (runes with activation_action)
  const runeActions = equippedActiveRunes
    .filter(ri => ri.rune.effect_type === 'active' || ri.rune.effect_type === 'both')
    .filter(ri => ri.rune.activation_action && ri.rune.activation_action !== 'passive')
    .map(ri => ({
      name: `${ri.rune.name} (${ri.equipment?.name || 'Rune'})`,
      type: (ri.rune.activation_action || 'action') as 'action' | 'bonus-action' | 'reaction',
      description: ri.rune.effect_description || ri.rune.description || '',
      range: ri.rune.range || undefined,
      uses: ri.rune.uses_per_rest && ri.rune.uses_per_rest !== 'at-will' ? {
        current: ri.uses_current ?? 0,
        max: ri.uses_max ?? (ri.rune.uses_per_rest.includes('proficiency') ? proficiencyBonus : 
             ri.rune.uses_per_rest.includes('level') ? character.level :
             parseInt(ri.rune.uses_per_rest) || 1),
      } : undefined,
      recharge: ri.rune.recharge || undefined,
      activationCost: ri.rune.activation_cost ? `${ri.rune.activation_cost_amount || 0} ${ri.rune.activation_cost}` : undefined,
      inscriptionId: ri.id, // Store inscription ID for use tracking
    }));

  return (
    <SystemWindow title="ACTIONS">
      <Tabs defaultValue="weapons" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="runes" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Runes ({runeActions.length})
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

        <TabsContent value="runes" className="space-y-3 mt-4">
          {runeActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active rune abilities</p>
              <p className="text-xs mt-1">Inscribe runes with active abilities on equipped items to use them</p>
            </div>
          ) : (
            runeActions.map((action, i) => (
              <ActionCard
                key={i}
                name={action.name}
                type={action.type}
                description={action.description}
                range={action.range}
                uses={action.uses}
                recharge={action.recharge}
                inscriptionId={action.inscriptionId}
                onUse={action.inscriptionId ? () => handleUseRune(action.inscriptionId!) : undefined}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </SystemWindow>
  );
}


