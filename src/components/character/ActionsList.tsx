import { Swords, Wand2, Star } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionCard } from './ActionCard';
import { useEquipment } from '@/hooks/useEquipment';
import { usePowers } from '@/hooks/usePowers';
import { useFeatures } from '@/hooks/useFeatures';
import { useCharacter } from '@/hooks/useCharacters';
import { useCharacterSheetState } from '@/hooks/useCharacterSheetState';
import { getAbilityModifier, getProficiencyBonus } from '@/types/system-rules';
import { parseModifiers, applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import { normalizeCustomModifiers, sumCustomModifiers } from '@/lib/customModifiers';
import { useCharacterFeatures, featureModifiersToCustomModifiers } from '@/hooks/useCharacterFeatures';
import { formatMonarchVernacular } from '@/lib/vernacular';
import type { AbilityScore } from '@/types/system-rules';

export function ActionsList({ characterId }: { characterId: string }) {
  const { data: character } = useCharacter(characterId);
  const { equipment } = useEquipment(characterId);
  const { powers } = usePowers(characterId);
  const { features } = useFeatures(characterId);
  const { state: sheetState } = useCharacterSheetState(characterId);
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
    equipment.map(item => ({
      ...item,
      properties: item.properties ?? undefined
    }))
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
  // Final abilities with all modifiers
  const finalAbilities = { ...equipmentModifiedAbilities };
  const abilityKeys: AbilityScore[] = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];
  abilityKeys.forEach((ability) => {
    const bonus = sumCustomModifiers(customModifiers, 'ability', ability);
    if (bonus !== 0) {
      finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
    }
  });

  const proficiencyBonus = getProficiencyBonus(character.level);
  const strMod = getAbilityModifier(finalAbilities.STR);
  const agiMod = getAbilityModifier(finalAbilities.AGI);

  const getWeaponAbilityMod = (weapon: { properties?: string[] | null }) => {
    const props = (weapon.properties || []).map((p) => p.toLowerCase());
    const isFinesse = props.includes('finesse');
    const isRanged = props.some((p) => p.startsWith('range')) || props.includes('ammunition');
    const isThrown = props.includes('thrown');

    if (isRanged && !isThrown) return agiMod;
    if (isFinesse) return Math.max(strMod, agiMod);
    return strMod;
  };

  // Get equipped weapons
  const weapons = equipment.filter(
    e => e.is_equipped && (e.item_type === 'weapon' || e.item_type?.includes('weapon'))
  );

  // Calculate attack bonuses for weapons
  const weaponActions = weapons.map(weapon => {
    const modifiers = parseModifiers(weapon.properties || []);
    const attackMod = modifiers.attack || 0;
    
    const abilityMod = getWeaponAbilityMod(weapon);
    const props = (weapon.properties || []).map((p) => p.toLowerCase());
    const isRanged = props.some((p) => p.startsWith('range')) || props.includes('ammunition');
    const customAttackBonus = sumCustomModifiers(customModifiers, 'attack', isRanged ? 'ranged' : 'melee');
    const attackBonus = abilityMod + proficiencyBonus + attackMod + customAttackBonus;

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
    
    const customDamageBonus = sumCustomModifiers(customModifiers, 'damage', isRanged ? 'ranged' : 'melee');
    if (customDamageBonus !== 0) {
      const normalized = damage.replace(/\s+/g, '');
      const match = normalized.match(/(\d+d\d+)([+-]\d+)?/i);
      if (match) {
        const baseDice = match[1];
        const baseMod = parseInt(match[2] || '0', 10);
        const totalMod = baseMod + customDamageBonus;
        damage = totalMod !== 0
          ? `${baseDice}${totalMod >= 0 ? '+' : ''}${totalMod}`
          : baseDice;
      } else {
        damage += customDamageBonus > 0 ? `+${customDamageBonus}` : `${customDamageBonus}`;
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
                characterId={characterId}
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
                characterId={characterId}
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
                characterId={characterId}
              />
            ))
          )}
        </TabsContent>

      </Tabs>
    </SystemWindow>
  );
}



