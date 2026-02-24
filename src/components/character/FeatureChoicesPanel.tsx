import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatMonarchVernacular, MONARCH_LABEL } from '@/lib/vernacular';
import { getMaxPowerLevelForJobAtLevel } from '@/lib/characterCreation';
import type { AbilityScore } from '@/types/system-rules';
import type { FeatureModifier } from '@/hooks/useCharacterFeatures';

type ChoiceGroupRow = {
  id: string;
  feature_id: string;
  choice_key: string;
  choice_count: number;
  prompt: string | null;
};

type ChoiceOptionRow = {
  id: string;
  group_id: string;
  option_key: string;
  name: string;
  description: string | null;
  grants: unknown;
};

type CharacterChoiceRow = {
  group_id: string;
  option_id: string;
};

function normalizeGrants(grants: unknown): Array<Record<string, unknown>> {
  if (!grants) return [];
  if (Array.isArray(grants)) return grants as Array<Record<string, unknown>>;
  return [];
}

function extractGrantedPowerNames(grants: unknown): string[] {
  const normalized = normalizeGrants(grants);
  const names: string[] = [];
  for (const grant of normalized) {
    if (grant.type === 'power' && typeof grant.name === 'string') {
      names.push(grant.name);
    }
  }
  return names;
}

function asUuidArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === 'string') as string[];
}

function isAbilityScore(value: unknown): value is AbilityScore {
  return value === 'STR' || value === 'AGI' || value === 'VIT' || value === 'INT' || value === 'SENSE' || value === 'PRE';
}

export function FeatureChoicesPanel({ characterId }: { characterId: string }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [selectedOptionByGroupId, setSelectedOptionByGroupId] = useState<Record<string, string>>({});

  const { data: character } = useQuery({
    queryKey: ['feature-choice-character', characterId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('characters')
        .select('id, job, path, level, regent_overlays, monarch_overlays')
        .eq('id', characterId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(characterId) && !characterId.startsWith('local_'),
  });

  const characterJob = (character as any)?.job as string | undefined;
  const characterPath = (character as any)?.path as string | undefined;
  const characterLevel = (character as any)?.level as number | undefined;

  const { data: choiceData, isLoading } = useQuery({
    queryKey: ['feature-choice-metadata', characterId, characterJob, characterPath, characterLevel],
    queryFn: async () => {
      if (!characterJob) return null;

      const regentOverlayIds = asUuidArray((character as any)?.regent_overlays);
      const monarchOverlayIds = asUuidArray((character as any)?.monarch_overlays);
      const overlayIds = regentOverlayIds.length > 0 ? regentOverlayIds : monarchOverlayIds;

      let regentNames: string[] = [];
      if (overlayIds.length > 0) {
        const { data: regents, error: regentsError } = await (supabase as any)
          .from('compendium_regents' as any)
          .select('name')
          .in('id', overlayIds);
        if (regentsError) throw regentsError;
        regentNames = ((regents || []) as unknown as Array<{ name: string }>).map((r) => r.name).filter(Boolean);
      }

      const eligiblePowerNames = new Set<string>();
      {
        const job = characterJob;
        const path = characterPath || '';
        const maxPowerLevel = getMaxPowerLevelForJobAtLevel(characterJob, characterLevel ?? 1);

        const regentList = regentNames.map((name) => `"${String(name).replace(/\"/g, '')}"`).join(',');
        const regentFilter = regentList ? `regent_names.ov.{${regentList}}` : '';
        const orParts = [
          `job_names.cs.{"${String(job).replace(/\"/g, '')}"}`,
          path ? `path_names.cs.{"${String(path).replace(/\"/g, '')}"}` : '',
          regentFilter,
        ].filter(Boolean);

        const { data: eligibleRows, error: eligibleError } = await (supabase as any)
          .from('compendium_powers')
          .select('name')
          .or(orParts.join(','))
          .lte('power_level', maxPowerLevel);

        if (eligibleError) throw eligibleError;
        for (const row of (eligibleRows || []) as Array<{ name: string }>) {
          if (row?.name) eligiblePowerNames.add(row.name);
        }
      }

      const { data: jobRow } = await supabase
        .from('compendium_jobs')
        .select('id')
        .eq('name', characterJob)
        .maybeSingle();

      if (!jobRow) return null;

      const { data: features } = await supabase
        .from('compendium_job_features')
        .select('id, name, description, level, is_path_feature, path_id')
        .eq('job_id', jobRow.id)
        .lte('level', characterLevel);

      const featureIds = (features || []).map((f: any) => f.id).filter(Boolean);
      if (featureIds.length === 0) return null;

      const { data: groups } = await (supabase as any)
        .from('compendium_feature_choice_groups')
        .select('*')
        .in('feature_id', featureIds);

      const groupRows = (groups || []) as ChoiceGroupRow[];
      if (groupRows.length === 0) return null;

      const groupIds = groupRows.map((g) => g.id);

      const { data: options } = await (supabase as any)
        .from('compendium_feature_choice_options')
        .select('*')
        .in('group_id', groupIds)
        .order('name');

      const filteredOptions = ((options || []) as ChoiceOptionRow[]).filter((opt) => {
        const grantedPowers = extractGrantedPowerNames(opt.grants);
        if (grantedPowers.length === 0) return true;
        return grantedPowers.every((name) => eligiblePowerNames.has(name));
      });

      const { data: existingChoices } = await (supabase as any)
        .from('character_feature_choices')
        .select('group_id, option_id')
        .eq('character_id', characterId);

      const existing = (existingChoices || []) as CharacterChoiceRow[];
      const chosenGroupIds = new Set(existing.map((row) => row.group_id));

      const pendingGroups = groupRows.filter((g) => !chosenGroupIds.has(g.id));
      if (pendingGroups.length === 0) return null;

      const featureById = new Map<string, any>((features || []).map((f: any) => [f.id, f]));

      return {
        features: features || [],
        featureById,
        pendingGroups,
        options: filteredOptions,
        eligiblePowerNames,
      };
    },
    enabled: Boolean(characterId) && Boolean(characterJob) && Boolean(characterLevel) && !characterId.startsWith('local_'),
  });

  const pendingGroups = choiceData?.pendingGroups || [];
  const options = choiceData?.options || [];

  const optionsByGroupId = useMemo(() => {
    const map = new Map<string, ChoiceOptionRow[]>();
    for (const opt of options) {
      const existing = map.get(opt.group_id) || [];
      existing.push(opt);
      map.set(opt.group_id, existing);
    }
    return map;
  }, [options]);

  const isReady = pendingGroups.every((g) => Boolean(selectedOptionByGroupId[g.id]));

  const handleCommit = async () => {
    if (!choiceData) return;
    if (!isReady) {
      toast({
        title: 'Selection required',
        description: 'Complete all required selections before confirming.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { data: characterRow } = await supabase
        .from('characters')
        .select('skill_proficiencies, skill_expertise, tool_proficiencies')
        .eq('id', characterId)
        .maybeSingle();
      const skillProficiencies = new Set<string>(
        Array.isArray((characterRow as any)?.skill_proficiencies)
          ? (((characterRow as any).skill_proficiencies as unknown as string[]) || [])
          : []
      );
      const skillExpertise = new Set<string>(
        Array.isArray((characterRow as any)?.skill_expertise)
          ? (((characterRow as any).skill_expertise as unknown as string[]) || [])
          : []
      );
      const toolProficiencies = new Set<string>(
        Array.isArray((characterRow as any)?.tool_proficiencies)
          ? (((characterRow as any).tool_proficiencies as unknown as string[]) || [])
          : []
      );

      const { data: existingFeatures } = await supabase
        .from('character_features')
        .select('name')
        .eq('character_id', characterId);
      const existingFeatureNames = new Set((existingFeatures || []).map((row: { name: string }) => row.name));

      const { data: existingPowers } = await supabase
        .from('character_powers')
        .select('name')
        .eq('character_id', characterId);
      const existingPowerNames = new Set((existingPowers || []).map((row) => row.name));

      const { data: existingEquipment } = await supabase
        .from('character_equipment')
        .select('name')
        .eq('character_id', characterId);
      const existingEquipmentNames = new Set((existingEquipment || []).map((row: { name: string }) => row.name));

      const { data: existingAbilities } = await supabase
        .from('character_abilities')
        .select('ability, score')
        .eq('character_id', characterId);
      const abilityScoreByKey = new Map<AbilityScore, number>();
      for (const row of (existingAbilities || []) as Array<{ ability: AbilityScore; score: number }>) {
        if (isAbilityScore(row.ability)) {
          abilityScoreByKey.set(row.ability, row.score);
        }
      }

      for (const group of pendingGroups) {
        const optionId = selectedOptionByGroupId[group.id];
        const option = options.find((o) => o.id === optionId);
        if (!option) continue;

        if ((choiceData as any)?.eligiblePowerNames instanceof Set) {
          const eligiblePowerNames = (choiceData as any).eligiblePowerNames as Set<string>;
          const grantedPowers = extractGrantedPowerNames(option.grants);
          const invalidPower = grantedPowers.find((name) => !eligiblePowerNames.has(name));
          if (invalidPower) {
            toast({
              title: 'Ineligible power',
              description: formatMonarchVernacular(`"${invalidPower}" is not eligible for your Job / Path / ${MONARCH_LABEL} overlays.`),
              variant: 'destructive',
            });
            continue;
          }
        }

        await (supabase as any).from('character_feature_choices').upsert({
          character_id: characterId,
          feature_id: group.feature_id,
          group_id: group.id,
          option_id: option.id,
          level_chosen: (character?.level as number) || 1,
        }, { onConflict: 'character_id,group_id' });

        const grants = normalizeGrants(option.grants);
        for (const grant of grants) {
          if (grant.type === 'feature' && typeof grant.name === 'string') {
            if (existingFeatureNames.has(grant.name)) continue;
            await supabase.from('character_features').insert({
              character_id: characterId,
              name: grant.name,
              source: `Choice: ${group.choice_key}`,
              level_acquired: (character?.level as number) || 1,
              description: typeof grant.description === 'string' ? grant.description : null,
              action_type: typeof grant.action_type === 'string' ? grant.action_type : null,
              is_active: true,
            });

            existingFeatureNames.add(grant.name);
          }

          if (grant.type === 'feat' && typeof grant.name === 'string') {
            if (existingFeatureNames.has(grant.name)) continue;

            const featName = grant.name;

            const { data: featRow } = await supabase
              .from('compendium_feats')
              .select('name, description, benefits')
              .eq('name', featName)
              .maybeSingle();

            const featDescription =
              typeof grant.description === 'string'
                ? grant.description
                : featRow?.description || null;

            const benefits = Array.isArray(featRow?.benefits)
              ? (featRow?.benefits as unknown as string[])
              : [];
            const benefitsText = benefits.length > 0 ? benefits.map((b) => `- ${b}`).join('\n') : '';
            const fullDescription = featDescription
              ? benefitsText
                ? `${featDescription}\n\n${benefitsText}`
                : featDescription
              : benefitsText || null;

            const buildFeatModifiers = (benefitLines: string[]): FeatureModifier[] => {
              const mods: FeatureModifier[] = [];

              const push = (type: FeatureModifier['type'], value: number, target: string | null, source: string) => {
                mods.push({ type, value, target: target ?? undefined, source });
              };

              for (const raw of benefitLines) {
                const text = String(raw || '').trim();
                if (!text) continue;
                const lower = text.toLowerCase();

                // Ability increases: "Increase STR or AGI by 1", "Increase any ability score by 2"
                const incAny = lower.match(/increase\s+(?:any\s+)?ability\s+score\s+by\s+(\d+)/i);
                if (incAny?.[1]) {
                  // Can't pick ability here; leave to existing ability_increase grants.
                  continue;
                }

                const incSpecific = lower.match(/increase\s+(str|strength|agi|dex|dexterity|vitality|vit|con|constitution|int|intelligence|sense|wis|wisdom|pre|presence|cha|charisma)\s+by\s+(\d+)/i);
                if (incSpecific?.[1] && incSpecific?.[2]) {
                  const amount = parseInt(incSpecific[2], 10);
                  const keyRaw = incSpecific[1];
                  const toAbility: Record<string, AbilityScore> = {
                    str: 'STR', strength: 'STR',
                    agi: 'AGI', dex: 'AGI', dexterity: 'AGI', agility: 'AGI',
                    vit: 'VIT', vitality: 'VIT', con: 'VIT', constitution: 'VIT',
                    int: 'INT', intelligence: 'INT',
                    sense: 'SENSE', wis: 'SENSE', wisdom: 'SENSE',
                    pre: 'PRE', presence: 'PRE', cha: 'PRE', charisma: 'PRE',
                  };
                  const ability = toAbility[keyRaw];
                  if (ability && Number.isFinite(amount) && amount !== 0) {
                    push('ability', amount, ability, featName);
                    continue;
                  }
                }

                // Flat numeric bonuses
                const speed = lower.match(/speed\s+(?:increases|increase|bonus)\s+by\s+(\d+)\s*(?:ft|feet)?/i);
                if (speed?.[1]) {
                  push('speed', parseInt(speed[1], 10), null, featName);
                  continue;
                }

                const ac = lower.match(/\+\s*(\d+)\s*(?:bonus\s+)?to\s+ac/i);
                if (ac?.[1]) {
                  push('ac', parseInt(ac[1], 10), null, featName);
                  continue;
                }

                const initiative = lower.match(/\+\s*(\d+)\s*(?:bonus\s+)?to\s+initiative/i);
                if (initiative?.[1]) {
                  push('initiative', parseInt(initiative[1], 10), null, featName);
                  continue;
                }

                const hpPerLevel = lower.match(/hp\s+maximum\s+increases\s+by\s+(\d+)\s+per\s+level/i);
                if (hpPerLevel?.[1]) {
                  // We don't know character level here reliably; handled elsewhere.
                  continue;
                }

                const hpFlat = lower.match(/(?:max\s+)?hp\s+maximum\s+increases\s+by\s+(\d+)/i);
                if (hpFlat?.[1]) {
                  push('hp-max', parseInt(hpFlat[1], 10), null, featName);
                  continue;
                }

                // Skill/save bonuses: "+1 to Constitution saving throws", "+2 to Investigation"
                const saveBonus = lower.match(/\+\s*(\d+)\s+to\s+([a-z]+)\s+saving\s+throws?/i);
                if (saveBonus?.[1] && saveBonus?.[2]) {
                  const amount = parseInt(saveBonus[1], 10);
                  const key = saveBonus[2].trim();
                  const toAbility: Record<string, AbilityScore> = {
                    str: 'STR', strength: 'STR',
                    agi: 'AGI', dex: 'AGI', dexterity: 'AGI', agility: 'AGI',
                    vit: 'VIT', vitality: 'VIT', con: 'VIT', constitution: 'VIT',
                    int: 'INT', intelligence: 'INT',
                    sense: 'SENSE', wis: 'SENSE', wisdom: 'SENSE',
                    pre: 'PRE', presence: 'PRE', cha: 'PRE', charisma: 'PRE',
                  };
                  const ability = toAbility[key];
                  if (ability) {
                    push('save', amount, ability, featName);
                    continue;
                  }
                }

                const skillBonus = lower.match(/\+\s*(\d+)\s+to\s+([a-z][a-z\s']+)/i);
                if (skillBonus?.[1] && skillBonus?.[2]) {
                  const amount = parseInt(skillBonus[1], 10);
                  const rawSkill = skillBonus[2].trim();
                  if (!rawSkill.includes('saving') && rawSkill !== 'ac' && rawSkill !== 'initiative') {
                    const canonical = rawSkill
                      .split(/\s+/)
                      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
                      .join(' ')
                      .replaceAll("'S", "'s");
                    push('skill', amount, canonical, featName);
                    continue;
                  }
                }

                // Advantage patterns
                if (lower.includes('advantage on initiative')) {
                  push('advantage', 0, 'initiative', featName);
                  continue;
                }

                const advSave = lower.match(/advantage\s+on\s+saves?\s+against\s+([a-z\s]+)/i);
                if (advSave?.[1]) {
                  const key = advSave[1].trim();
                  // e.g. "poison" -> save:poison (consumed by roll advantage resolver)
                  if (key.length > 0) {
                    push('advantage', 0, `save:${key}`, featName);
                    continue;
                  }
                }
              }

              return mods;
            };

            const featModifiers = buildFeatModifiers(benefits);

            await supabase.from('character_features').insert({
              character_id: characterId,
              name: featName,
              source: `Feat (Choice: ${group.choice_key})`,
              level_acquired: (character?.level as number) || 1,
              description: fullDescription,
              action_type: null,
              is_active: true,
              modifiers: featModifiers.length > 0 ? (featModifiers as any) : null,
            });

            existingFeatureNames.add(featName);
          }

          if (grant.type === 'ability_increase') {
            const ability = (grant.ability ?? null) as unknown;
            const amount = (grant.amount ?? null) as unknown;

            if (!isAbilityScore(ability)) continue;
            const numeric = typeof amount === 'number' ? amount : Number(amount);
            if (!Number.isFinite(numeric) || numeric === 0) continue;

            const current = abilityScoreByKey.get(ability) ?? 10;
            const nextScore = Math.min(20, current + numeric);

            await supabase
              .from('character_abilities')
              .update({ score: nextScore })
              .eq('character_id', characterId)
              .eq('ability', ability);

            abilityScoreByKey.set(ability, nextScore);
          }

          if (grant.type === 'tool_proficiency' && typeof grant.name === 'string') {
            const toolName = grant.name;
            if (toolProficiencies.has(toolName)) continue;

            const next = [...toolProficiencies, toolName].sort();
            await supabase
              .from('characters')
              .update({ tool_proficiencies: next as any })
              .eq('id', characterId);
            toolProficiencies.add(toolName);
          }

          if (grant.type === 'technique' && typeof grant.name === 'string') {
            const techName = grant.name;
            const { data: techRow } = await supabase
        .from('compendium_techniques' as any)
        .select('id')
        .eq('name', techName)
        .maybeSingle();
      const techId = (techRow as {id?: string} | null)?.id;
      if (!techId) continue;

            await supabase
              .from('character_techniques' as any)
              .upsert(
                {
                  character_id: characterId,
                  technique_id: techId,
                  source: `Choice: ${group.choice_key}`,
                } as any,
                { onConflict: 'character_id,technique_id' }
              );
          }

          if (grant.type === 'skill_proficiency' && typeof grant.name === 'string') {
            const skillName = grant.name;
            if (skillProficiencies.has(skillName)) continue;

            const next = [...skillProficiencies, skillName].sort();
            await supabase
              .from('characters')
              .update({ skill_proficiencies: next as any })
              .eq('id', characterId);
            skillProficiencies.add(skillName);
          }

          if (grant.type === 'skill_expertise' && typeof grant.name === 'string') {
            const skillName = grant.name;
            if (skillExpertise.has(skillName)) continue;

            const next = [...skillExpertise, skillName].sort();
            await supabase
              .from('characters')
              .update({ skill_expertise: next as any })
              .eq('id', characterId);
            skillExpertise.add(skillName);
          }

          if (grant.type === 'power' && typeof grant.name === 'string') {
            const powerName = grant.name;
            if (existingPowerNames.has(powerName)) continue;

            const { data: powerRow } = await supabase
              .from('compendium_powers')
              .select('name, power_level, casting_time, range, duration, concentration, description, higher_levels')
              .eq('name', powerName)
              .maybeSingle();

            if (!powerRow?.name) continue;

            await supabase.from('character_powers').insert({
              character_id: characterId,
              name: powerRow.name,
              power_level: powerRow.power_level ?? 0,
              source: `Choice: ${group.choice_key}`,
              casting_time: powerRow.casting_time ?? null,
              range: powerRow.range ?? null,
              duration: powerRow.duration ?? null,
              concentration: powerRow.concentration ?? false,
              is_prepared: true,
              is_known: true,
              description: powerRow.description ?? null,
              higher_levels: powerRow.higher_levels ?? null,
            });

            existingPowerNames.add(powerName);
          }

          if (grant.type === 'equipment' && typeof grant.name === 'string') {
            const itemName = grant.name;
            if (existingEquipmentNames.has(itemName)) continue;

            const { data: equipRow } = await supabase
              .from('compendium_equipment')
              .select('name, equipment_type, description, properties, weight, cost_credits, armor_class, damage, damage_type')
              .eq('name', itemName)
              .maybeSingle();

            if (equipRow?.name) {
              await supabase.from('character_equipment').insert({
                character_id: characterId,
                name: equipRow.name,
                item_type: (equipRow.equipment_type as any) || 'gear',
                quantity: 1,
                description: equipRow.description ?? null,
                properties: (equipRow.properties as any) ?? null,
                weight: (equipRow.weight as any) ?? null,
                value_credits: (equipRow.cost_credits as any) ?? null,
              });
              existingEquipmentNames.add(itemName);
              continue;
            }

            const { data: relicRow } = await supabase
              .from('compendium_relics')
              .select('name, description, rarity, relic_tier, properties, value_credits, requires_attunement')
              .eq('name', itemName)
              .maybeSingle();
            if (!relicRow?.name) continue;

            await supabase.from('character_equipment').insert({
              character_id: characterId,
              name: relicRow.name,
              item_type: 'relic',
              rarity: relicRow.rarity as any,
              relic_tier: relicRow.relic_tier as any,
              requires_attunement: relicRow.requires_attunement ?? false,
              is_attuned: false,
              quantity: 1,
              description: relicRow.description ?? null,
              properties: (relicRow.properties as any) ?? null,
              value_credits: (relicRow.value_credits as any) ?? null,
            });

            existingEquipmentNames.add(itemName);
          }

          if (grant.type === 'rune' && typeof grant.name === 'string') {
            const { data: runeRow } = await supabase
              .from('compendium_runes')
              .select('id')
              .eq('name', grant.name)
              .maybeSingle();
            if (!runeRow?.id) continue;

            await supabase
              .from('character_rune_knowledge')
              .upsert(
                {
                  character_id: characterId,
                  rune_id: runeRow.id,
                  learned_from: 'feature_choice',
                  mastery_level: 1,
                  can_teach: false,
                } as any,
                { onConflict: 'character_id,rune_id' }
              );
          }
        }
      }

      toast({
        title: 'Selection recorded',
        description: 'The System has bound your chosen protocol.',
      });
    } catch {
      toast({
        title: 'Selection failed',
        description: 'Could not record your selection. Try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (characterId.startsWith('local_')) {
    return null;
  }

  if (isLoading) {
    return (
      <SystemWindow title="SELECTION PROTOCOL">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Scanning for required selections...
        </div>
      </SystemWindow>
    );
  }

  if (!choiceData) return null;

  return (
    <SystemWindow title="SELECTION PROTOCOL">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          The System requires additional binding choices before your build is fully compliant.
        </div>

        {pendingGroups.map((group) => {
          const feature = (choiceData.featureById.get(group.feature_id) as any) || null;
          const groupOptions = optionsByGroupId.get(group.id) || [];
          const label = group.prompt || feature?.name || group.choice_key;

          return (
            <div key={group.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
              <Label className="text-sm font-heading">
                {formatMonarchVernacular(label)}
              </Label>
              <Select
                value={selectedOptionByGroupId[group.id] || ''}
                onValueChange={(value) => setSelectedOptionByGroupId((prev) => ({ ...prev, [group.id]: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {formatMonarchVernacular(opt.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(() => {
                const chosenId = selectedOptionByGroupId[group.id];
                const chosen = groupOptions.find((o) => o.id === chosenId);
                if (!chosen?.description) return null;
                return (
                  <div className="text-xs text-muted-foreground">
                    {formatMonarchVernacular(chosen.description)}
                  </div>
                );
              })()}
            </div>
          );
        })}

        <div className="flex justify-end">
          <Button onClick={handleCommit} disabled={!isReady || saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Binding...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Selection
              </>
            )}
          </Button>
        </div>
      </div>
    </SystemWindow>
  );
}
