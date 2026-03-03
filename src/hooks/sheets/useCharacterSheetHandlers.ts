import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logAndToastError } from '@/lib/logger';
import type { CharacterWithAbilities as Character } from '@/hooks/useCharacters';
import { type CustomModifier } from '@/lib/customModifiers';
import { type AbilityScore } from '@/types/system-rules';
import { calculateTotalTempHP, applyResourceRest, type CustomResource } from '@/lib/characterResources';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';
import { useCharacterSheetState } from '@/hooks/useCharacterSheetState';

interface HandlersProps {
    character: Character | null | undefined;
    isReadOnly: boolean;
    campaignId: string | null;
    isCampaignConnected: boolean;
    effectiveTempHp: number;
    customModifiers: CustomModifier[];
    sheetState: ReturnType<typeof useCharacterSheetState>['state'];
    saveSheetState: ReturnType<typeof useCharacterSheetState>['saveSheetState'];
    updateCharacter: any; // Using any for brevity here, assumed passed from hook
    updateAbilities: any;
    recordRoll: any;
    broadcastDiceRoll: any;
    playerTools: ReturnType<ReturnType<typeof useGlobalDDBeyondIntegration>['usePlayerToolsEnhancements']>;
    concentration: any;
}

export function useCharacterSheetHandlers({
    character,
    isReadOnly,
    campaignId,
    isCampaignConnected,
    effectiveTempHp,
    customModifiers,
    sheetState,
    saveSheetState,
    updateCharacter,
    updateAbilities,
    recordRoll,
    broadcastDiceRoll,
    playerTools,
    concentration,
}: HandlersProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [hpEditOpen, setHpEditOpen] = useState(false);
    const [hpEditValue, setHpEditValue] = useState('');
    const [hpDeltaValue, setHpDeltaValue] = useState('');
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [shortRestOpen, setShortRestOpen] = useState(false);
    const [longRestOpen, setLongRestOpen] = useState(false);

    // Draft states
    const [abilityDrafts, setAbilityDrafts] = useState<Record<AbilityScore, string>>({
        STR: '10', AGI: '10', VIT: '10', INT: '10', SENSE: '10', PRE: '10',
    });
    const [customModifiersDraft, setCustomModifiersDraft] = useState<CustomModifier[]>([]);
    const [proficiencyDialogOpen, setProficiencyDialogOpen] = useState(false);
    const [armorProficienciesDraft, setArmorProficienciesDraft] = useState('');
    const [weaponProficienciesDraft, setWeaponProficienciesDraft] = useState('');
    const [toolProficienciesDraft, setToolProficienciesDraft] = useState('');
    const [customConditionDraft, setCustomConditionDraft] = useState('');
    const [armorClassDraft, setArmorClassDraft] = useState('');
    const [speedDraft, setSpeedDraft] = useState('');
    const [hpMaxDraft, setHpMaxDraft] = useState('');

    const [lastDeathSaveResult, setLastDeathSaveResult] = useState<{ roll: number; message: string } | null>(null);

    const characterResources = sheetState.resources;

    // Sync draft states when character data changes
    useEffect(() => {
        if (!character) return;
        setAbilityDrafts({
            STR: character.abilities?.STR?.toString() || '10',
            AGI: character.abilities?.AGI?.toString() || '10',
            VIT: character.abilities?.VIT?.toString() || '10',
            INT: character.abilities?.INT?.toString() || '10',
            SENSE: character.abilities?.SENSE?.toString() || '10',
            PRE: character.abilities?.PRE?.toString() || '10',
        });
        setArmorClassDraft((character.armor_class || 10)?.toString() || '10');
        setSpeedDraft((character.speed || 30)?.toString() || '30');
        setHpMaxDraft((character.hp_max || 1)?.toString() || '10');
    }, [character]);

    useEffect(() => {
        setCustomModifiersDraft(customModifiers);
    }, [customModifiers]);

    const applyRestResourceUpdates = useCallback(async (restType: 'short' | 'long') => {
        if (isReadOnly) return;
        const nextResources = applyResourceRest(characterResources, restType);
        try {
            await saveSheetState({ resources: nextResources });
        } catch {
            // Resource rest updates should not block completing rests.
        }
    }, [isReadOnly, characterResources, saveSheetState]);

    const handleShortRest = useCallback(async () => {
        if (!character) return;
        try {
            const { executeShortRest } = await import('@/lib/restSystem');
            await executeShortRest(character.id);

            queryClient.invalidateQueries({ queryKey: ['character', character.id] });
            queryClient.invalidateQueries({ queryKey: ['features', character.id] });
            await applyRestResourceUpdates('short');

            toast({
                title: 'Short rest completed',
                description: 'Hit dice restored. Short-rest features recharged.',
            });

            const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
            recordRoll.mutate({
                dice_formula: 'Rest',
                result: 0,
                rolls: [],
                roll_type: 'rest',
                context: 'Short Rest completed',
                modifiers: null,
                campaign_id: campaignId ?? null,
                character_id: character.id,
            });

            if (scope === 'campaign') {
                broadcastDiceRoll('Rest', 0, {
                    characterName: character.name,
                    rollType: 'rest',
                    context: 'Short Rest completed',
                    rolls: [],
                });
            }
        } catch {
            toast({
                title: 'Failed to rest',
                description: 'Could not complete short rest.',
                variant: 'destructive',
            });
        }
    }, [character?.id, queryClient, applyRestResourceUpdates, toast, campaignId, isCampaignConnected, broadcastDiceRoll, recordRoll, character?.name]);

    const handleLongRest = async () => {
        if (!character) return;
        try {
            const { executeLongRest } = await import('@/lib/restSystem');
            const result = await executeLongRest(character.id);

            queryClient.invalidateQueries({ queryKey: ['character', character.id] });
            queryClient.invalidateQueries({ queryKey: ['features', character.id] });
            await applyRestResourceUpdates('long');

            const hpHealed = (character.hp_max || 1) - (character.hp_current || 1);
            if (hpHealed > 0) {
                playerTools.trackHealthChange(character.id, hpHealed, 'healing').catch((e: Error) => logAndToastError(e, "Operation Failed"));
            }

            if ((character.exhaustion_level || 0) > 0) {
                playerTools.trackConditionChange(character.id, 'Exhaustion', 'remove').catch((e: Error) => logAndToastError(e, "Operation Failed"));
            }

            toast({
                title: 'Long rest completed',
                description: 'All resources restored. Features recharged. Exhaustion reduced by 1.',
            });

            const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
            recordRoll.mutate({
                dice_formula: 'Rest',
                result: 0,
                rolls: [],
                roll_type: 'rest',
                context: 'Long Rest completed',
                modifiers: null,
                campaign_id: campaignId ?? null,
                character_id: character.id,
            });

            if (scope === 'campaign') {
                broadcastDiceRoll('Rest', 0, {
                    characterName: character.name,
                    rollType: 'rest',
                    context: 'Long Rest completed',
                    rolls: [],
                });
            }

            if (result?.questAssignmentError) {
                toast({
                    title: 'Daily quests not assigned',
                    description: result.questAssignmentError,
                    variant: 'destructive',
                });
            }
        } catch {
            toast({
                title: 'Failed to rest',
                description: 'Could not complete long rest.',
                variant: 'destructive',
            });
        }
    };

    const rollAndRecord = (options: {
        title: string;
        formula: string;
        rollType: string;
        context: string;
        modifier?: number;
    }) => {
        if (!character) return;
        try {
            const roll = rollDiceString(options.formula);
            const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
            const message = `${options.title}: ${formatRollResult(roll)}${scope === 'campaign' ? ' (shared)' : ''}`;
            toast({
                title: 'Dice Roll',
                description: message,
            });
            recordRoll.mutate({
                dice_formula: roll.dice,
                result: roll.result,
                rolls: roll.rolls,
                roll_type: options.rollType,
                context: options.context,
                modifiers: typeof options.modifier === 'number' ? { modifier: options.modifier } : null,
                campaign_id: campaignId ?? null,
                character_id: character.id,
            });

            if (scope === 'campaign') {
                broadcastDiceRoll(options.formula, roll.result, {
                    characterName: character.name,
                    rollType: options.rollType,
                    context: options.context,
                    rolls: roll.rolls,
                });
            }
        } catch {
            toast({
                title: 'Roll failed',
                description: 'Could not execute roll.',
                variant: 'destructive',
            });
        }
    };

    const handleResourceRoll = (resource: CustomResource) => {
        if (!resource.dieSize) return;
        rollAndRecord({
            title: resource.name,
            formula: `1d${resource.dieSize}`,
            rollType: 'resource',
            context: `${resource.name} resource roll`,
        });
    };

    const handleHPChange = async () => {
        if (!character) return;
        const newHP = parseInt(hpEditValue);
        if (isNaN(newHP) || newHP < 0) {
            toast({
                title: 'Invalid HP',
                description: 'Please enter a valid number.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const clampedHP = Math.min(newHP, (character.hp_max || 1) + effectiveTempHp);
            await updateCharacter.mutateAsync({
                id: character.id,
                data: {
                    hp_current: clampedHP,
                },
            });

            const diff = clampedHP - (character.hp_current || 1);
            if (diff !== 0) {
                playerTools.trackHealthChange(
                    character.id,
                    Math.abs(diff),
                    diff > 0 ? 'healing' : 'damage'
                ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
            }

            setHpEditOpen(false);
            setHpEditValue('');
        } catch {
            toast({
                title: 'Failed to update HP',
                description: 'Could not update hit points.',
                variant: 'destructive',
            });
        }
    };

    const applyHpDelta = async (direction: 'damage' | 'heal') => {
        if (!character || isReadOnly) return;
        const delta = parseInt(hpDeltaValue);
        if (isNaN(delta) || delta <= 0) {
            toast({
                title: 'Invalid amount',
                description: 'Enter a positive number.',
                variant: 'destructive',
            });
            return;
        }

        const maxHp = (character.hp_max || 1) + effectiveTempHp;
        const nextHp = direction === 'damage'
            ? Math.max((character.hp_current || 1) - delta, 0)
            : Math.min((character.hp_current || 1) + delta, maxHp);

        try {
            await updateCharacter.mutateAsync({
                id: character.id,
                data: { hp_current: nextHp },
            });

            playerTools.trackHealthChange(character.id, delta, direction === 'damage' ? 'damage' : 'healing').catch((e: Error) => logAndToastError(e, "Operation Failed"));

            if (direction === 'damage' && concentration.state.isConcentrating) {
                const result = concentration.takeDamage(delta);
                if (result) {
                    const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
                    if (scope === 'campaign') {
                        const context = `Concentration Save (DC ${result.dc}) - ${result.success ? 'Success' : 'Failed!'}`;

                        recordRoll.mutate({
                            dice_formula: '1d20',
                            result: result.total,
                            rolls: [result.roll],
                            roll_type: 'save',
                            context,
                            modifiers: { modifier: result.modifier },
                            campaign_id: campaignId ?? null,
                            character_id: character.id,
                        });

                        broadcastDiceRoll('1d20', result.total, {
                            characterName: character.name,
                            rollType: 'save',
                            context,
                            rolls: [result.roll],
                        });

                        if (result.concentrationLost && result.spellName) {
                            playerTools.trackConditionChange(
                                character.id,
                                `Concentrating on ${result.spellName}`,
                                'remove'
                            ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
                            toast({ title: 'Concentration Lost!', description: `Failed save for ${result.spellName}`, variant: 'destructive' });
                        } else {
                            toast({ title: 'Concentration Maintained', description: `Passed save for ${result.spellName}` });
                        }
                    }
                }
            }

            setHpDeltaValue('');
            toast({
                title: direction === 'damage' ? 'Damage applied' : 'Healed',
                description: `HP is now ${nextHp}/${(character.hp_max || 1)}.`,
            });
        } catch {
            toast({
                title: 'Failed to update HP',
                description: 'Could not update hit points.',
                variant: 'destructive',
            });
        }
    };

    const handleAbilityCommit = async (ability: AbilityScore) => {
        if (!character || isReadOnly) return;
        const raw = abilityDrafts[ability];
        const parsed = parseInt(raw, 10);
        if (Number.isNaN(parsed) || parsed < 1 || parsed > 30) {
            toast({
                title: 'Invalid ability score',
                description: 'Ability scores must be between 1 and 30.',
                variant: 'destructive',
            });
            setAbilityDrafts((prev) => ({
                ...prev,
                [ability]: (character.abilities?.[ability] || 10)?.toString() || '10',
            }));
            return;
        }
        if (parsed === (character.abilities?.[ability] || 10)) return;
        try {
            await updateAbilities.mutateAsync({
                characterId: character.id,
                abilities: {
                    ...character.abilities,
                    [ability]: parsed,
                },
            });
        } catch {
            setAbilityDrafts((prev) => ({
                ...prev,
                [ability]: (character.abilities?.[ability] || 10)?.toString() || '10',
            }));
        }
    };

    const handleArmorClassCommit = async () => {
        if (!character || isReadOnly) return;
        const parsed = parseInt(armorClassDraft, 10);
        if (Number.isNaN(parsed) || parsed < 0) {
            toast({
                title: 'Invalid armor class',
                description: 'Armor class must be a non-negative number.',
                variant: 'destructive',
            });
            setArmorClassDraft((character.armor_class || 10).toString());
            return;
        }
        if (parsed === (character.armor_class || 10)) return;
        try {
            await updateCharacter.mutateAsync({
                id: character.id,
                data: { armor_class: parsed },
            });
        } catch {
            setArmorClassDraft((character.armor_class || 10).toString());
        }
    };

    const handleSpeedCommit = async () => {
        if (!character || isReadOnly) return;
        const parsed = parseInt(speedDraft, 10);
        if (Number.isNaN(parsed) || parsed < 0) {
            toast({
                title: 'Invalid speed',
                description: 'Speed must be a non-negative number.',
                variant: 'destructive',
            });
            setSpeedDraft((character.speed || 30).toString());
            return;
        }
        if (parsed === (character.speed || 30)) return;
        try {
            await updateCharacter.mutateAsync({
                id: character.id,
                data: { speed: parsed },
            });
        } catch {
            setSpeedDraft((character.speed || 30).toString());
        }
    };

    const handleHpMaxCommit = async () => {
        if (!character || isReadOnly) return;
        const parsed = parseInt(hpMaxDraft, 10);
        if (Number.isNaN(parsed) || parsed <= 0) {
            toast({
                title: 'Invalid max HP',
                description: 'Max HP must be greater than 0.',
                variant: 'destructive',
            });
            setHpMaxDraft((character.hp_max || 1).toString());
            return;
        }
        if (parsed === (character.hp_max || 1)) return;
        const nextCurrent = Math.min((character.hp_current || 1), parsed + effectiveTempHp);
        try {
            await updateCharacter.mutateAsync({
                id: character.id,
                data: {
                    hp_max: parsed,
                    hp_current: nextCurrent,
                },
            });
        } catch {
            setHpMaxDraft((character.hp_max || 1).toString());
        }
    };

    const handleToggleSavingThrowProficiency = (ability: AbilityScore) => {
        if (!character || isReadOnly) return;
        const current = character.saving_throw_proficiencies || [];
        const next = current.includes(ability)
            ? current.filter((item: string) => item !== ability)
            : [...current, ability];
        updateCharacter.mutate({
            id: character.id,
            data: { saving_throw_proficiencies: next },
        });
    };

    const handleToggleSkillProficiency = (skillName: string) => {
        if (!character || isReadOnly) return;
        const currentProfs = character.skill_proficiencies || [];
        const currentExpertise = character.skill_expertise || [];
        const isProficient = currentProfs.includes(skillName);
        const nextProfs = isProficient
            ? currentProfs.filter((item: string) => item !== skillName)
            : [...currentProfs, skillName];
        const nextExpertise = isProficient
            ? currentExpertise.filter((item: string) => item !== skillName)
            : currentExpertise;
        updateCharacter.mutate({
            id: character.id,
            data: {
                skill_proficiencies: nextProfs,
                skill_expertise: nextExpertise,
            },
        });
    };

    const handleToggleSkillExpertise = (skillName: string) => {
        if (!character || isReadOnly) return;
        const currentProfs = character.skill_proficiencies || [];
        const currentExpertise = character.skill_expertise || [];
        const isExpert = currentExpertise.includes(skillName);
        const nextExpertise = isExpert
            ? currentExpertise.filter((item: string) => item !== skillName)
            : [...currentExpertise, skillName];
        const nextProfs = isExpert
            ? currentProfs
            : currentProfs.includes(skillName)
                ? currentProfs
                : [...currentProfs, skillName];
        updateCharacter.mutate({
            id: character.id,
            data: {
                skill_proficiencies: nextProfs,
                skill_expertise: nextExpertise,
            },
        });
    };

    const handleResourcesChange = async (nextResources: typeof characterResources) => {
        if (!character || isReadOnly) return;
        try {
            await saveSheetState({ resources: nextResources });
        } catch {
            return;
        }
        const nextTempHp = calculateTotalTempHP(nextResources);
        if (nextTempHp !== (character.hp_temp || 0)) {
            updateCharacter.mutate({
                id: character.id,
                data: { hp_temp: nextTempHp },
            });

            playerTools.trackHealthChange(character.id, nextTempHp, 'temp').catch((e: Error) => logAndToastError(e, "Operation Failed"));
        }

        const currentInspiration = characterResources.inspiration;
        const nextInspiration = nextResources.inspiration;

        if (nextInspiration.inspiration_points > currentInspiration.inspiration_points) {
            playerTools.trackConditionChange(character.id, 'Inspiration', 'add').catch((e: Error) => logAndToastError(e, "Operation Failed"));
        } else if (nextInspiration.inspiration_points < currentInspiration.inspiration_points) {
            playerTools.trackConditionChange(character.id, 'Inspiration', 'remove').catch((e: Error) => logAndToastError(e, "Operation Failed"));
        }
    };

    const handleResourceAdjust = (
        field: 'hit_dice_current' | 'system_favor_current',
        delta: number,
    ) => {
        if (!character || isReadOnly) return;
        const maxLookup = {
            hit_dice_current: (character.hit_dice_max || 1),
            system_favor_current: (character.system_favor_max || 0),
        };
        const currentValue = (character[field] || 0);
        const nextValue = Math.max(0, Math.min(maxLookup[field], currentValue + delta));
        const updates: { hit_dice_current?: number; system_favor_current?: number } = {};
        if (field === 'hit_dice_current') updates.hit_dice_current = nextValue;
        if (field === 'system_favor_current') updates.system_favor_current = nextValue;
        updateCharacter.mutate({
            id: character.id,
            data: updates,
        });

        if (field === 'hit_dice_current' && delta !== 0) {
            playerTools.trackCustomFeatureUsage(
                character.id,
                'Hit Dice',
                delta < 0 ? 'spend' : 'regain',
                '5e'
            ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
        }
        if (field === 'system_favor_current' && delta !== 0) {
            playerTools.trackCustomFeatureUsage(
                character.id,
                'System Favor',
                delta < 0 ? 'spend' : 'regain',
                'SA'
            ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
        }
    };

    const handleExhaustionChange = (delta: number) => {
        if (!character || isReadOnly) return;
        const nextValue = Math.max(0, Math.min(6, (character.exhaustion_level || 0) + delta));
        updateCharacter.mutate({
            id: character.id,
            data: { exhaustion_level: nextValue },
        });

        if (delta !== 0) {
            playerTools.trackConditionChange(
                character.id,
                `Exhaustion Level ${nextValue}`,
                delta > 0 ? 'add' : 'remove'
            ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
        }
    };

    const handleToggleCondition = (conditionName: string) => {
        if (!character || isReadOnly) return;
        const current = character.conditions || [];
        const normalized = conditionName.toLowerCase();
        const exists = current.some((item: string) => item.toLowerCase() === normalized);
        const next = exists
            ? current.filter((item: string) => item.toLowerCase() !== normalized)
            : [...current, conditionName];
        updateCharacter.mutate({
            id: character.id,
            data: { conditions: next },
        });

        playerTools.trackConditionChange(
            character.id,
            conditionName,
            !exists ? 'add' : 'remove'
        ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
    };

    const handleAddCustomCondition = () => {
        if (!character || isReadOnly) return;
        const trimmed = customConditionDraft.trim();
        if (!trimmed) return;
        const current = character.conditions || [];
        const exists = current.some((item: string) => item.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            setCustomConditionDraft('');
            return;
        }
        updateCharacter.mutate({
            id: character.id,
            data: { conditions: [...current, trimmed] },
        });
        setCustomConditionDraft('');

        playerTools.trackConditionChange(
            character.id,
            trimmed,
            'add'
        ).catch((e: Error) => logAndToastError(e, "Operation Failed"));
    };

    const openProficiencyDialog = () => {
        if (!character) return;
        setArmorProficienciesDraft((character.armor_proficiencies || []).join(', '));
        setWeaponProficienciesDraft((character.weapon_proficiencies || []).join(', '));
        setToolProficienciesDraft((character.tool_proficiencies || []).join(', '));
        setProficiencyDialogOpen(true);
    };

    const parseCommaList = (value: string) =>
        value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const handleSaveProficiencies = async () => {
        if (!character || isReadOnly) return;
        try {
            await updateCharacter.mutateAsync({
                id: character.id,
                data: {
                    armor_proficiencies: parseCommaList(armorProficienciesDraft),
                    weapon_proficiencies: parseCommaList(weaponProficienciesDraft),
                    tool_proficiencies: parseCommaList(toolProficienciesDraft),
                },
            });
            setProficiencyDialogOpen(false);
        } catch {
            // Error handled by mutation
        }
    };

    const createModifierId = () => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }
        return `mod_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    };

    const persistCustomModifiers = async (next: CustomModifier[]) => {
        if (isReadOnly) return;
        await saveSheetState({ customModifiers: next });
    };

    const handleAddCustomModifier = async () => {
        const next: CustomModifier[] = [
            ...customModifiersDraft,
            {
                id: createModifierId(),
                type: 'ability' as const,
                target: 'STR',
                value: 1,
                source: 'Custom',
                condition: '',
                enabled: true,
            },
        ];
        setCustomModifiersDraft(next);
        await persistCustomModifiers(next);
    };

    const handleRemoveCustomModifier = async (id: string) => {
        const next = customModifiersDraft.filter((modifier) => modifier.id !== id);
        setCustomModifiersDraft(next);
        await persistCustomModifiers(next);
    };

    const handleUpdateCustomModifier = (
        id: string,
        updates: Partial<CustomModifier>,
        persist = false,
    ) => {
        const next = customModifiersDraft.map((modifier) =>
            modifier.id === id ? { ...modifier, ...updates } : modifier,
        );
        setCustomModifiersDraft(next);
        if (persist) {
            void persistCustomModifiers(next);
        }
    };

    return {
        state: {
            hpEditOpen, setHpEditOpen,
            hpEditValue, setHpEditValue,
            hpDeltaValue, setHpDeltaValue,
            exportDialogOpen, setExportDialogOpen,
            shareDialogOpen, setShareDialogOpen,
            shareLinkCopied, setShareLinkCopied,
            editDialogOpen, setEditDialogOpen,
            isEditMode, setIsEditMode,
            shortRestOpen, setShortRestOpen,
            longRestOpen, setLongRestOpen,
            abilityDrafts, setAbilityDrafts,
            customModifiersDraft, setCustomModifiersDraft,
            proficiencyDialogOpen, setProficiencyDialogOpen,
            armorProficienciesDraft, setArmorProficienciesDraft,
            weaponProficienciesDraft, setWeaponProficienciesDraft,
            toolProficienciesDraft, setToolProficienciesDraft,
            customConditionDraft, setCustomConditionDraft,
            armorClassDraft, setArmorClassDraft,
            speedDraft, setSpeedDraft,
            hpMaxDraft, setHpMaxDraft,
            lastDeathSaveResult, setLastDeathSaveResult,
            characterResources
        },
        handlers: {
            applyRestResourceUpdates,
            handleShortRest,
            handleLongRest,
            rollAndRecord,
            handleResourceRoll,
            handleHPChange,
            applyHpDelta,
            handleAbilityCommit,
            handleArmorClassCommit,
            handleSpeedCommit,
            handleHpMaxCommit,
            handleToggleSavingThrowProficiency,
            handleToggleSkillProficiency,
            handleToggleSkillExpertise,
            handleResourcesChange,
            handleResourceAdjust,
            handleExhaustionChange,
            handleToggleCondition,
            handleAddCustomCondition,
            openProficiencyDialog,
            handleSaveProficiencies,
            handleAddCustomModifier,
            handleRemoveCustomModifier,
            handleUpdateCustomModifier
        }
    };
}





