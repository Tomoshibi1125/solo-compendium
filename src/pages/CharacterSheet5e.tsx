import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  Moon,
  Sun,
  Loader2,
  Edit,
  Plus,
  Download,
  Dice6,
  Share2,
  Copy,
  Check,
  Undo2,
  Redo2,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCharacter, useUpdateCharacter } from '@/hooks/useCharacters';
import { createCharacterSheet, CharacterSheetSystem } from '@/lib/5eCharacterSheet';
import { SpellSystem } from '@/lib/5eSpellSystem';
import { Formatters } from '@/lib/5eUIIntegration';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { isLocalCharacterId } from '@/lib/guestStore';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextNotes } from '@/components/character/RichTextNotes';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import './CharacterSheet5e.css';

const CharacterSheet5e = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';
  const shareToken = searchParams.get('token') || undefined;
  const isReadOnly = !!shareToken;
  const { data: character, isLoading } = useCharacter(id || '', shareToken);
  const isLocal = !!character && isLocalCharacterId(character.id);
  const { data: characterCampaign } = useCampaignByCharacterId(character?.id || '');
  const updateCharacter = useUpdateCharacter();

  const [isEditing, setIsEditing] = useState(false);
  const [tempCharacter, setTempCharacter] = useState<any>(character);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SystemWindow title="ASCENDANT NOT FOUND" className="max-w-lg mx-auto">
            <p className="text-muted-foreground mb-4">The Ascendant you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/characters')}>Back to Ascendants</Button>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  // Create 5e character sheet
  const [sheet, setSheet] = useState(() => createCharacterSheet(character as any));

  useEffect(() => {
    if (character) {
      setSheet(createCharacterSheet(character as any));
      setTempCharacter(character as any);
    }
  }, [character]);

  const shareLink = character?.share_token 
    ? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
    : null;

  const handleGenerateShareLink = async () => {
    if (!character) return;
    try {
      // This would generate a share token
      toast({
        title: 'Share link generated',
        description: 'Share link copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Failed to generate share link',
        description: 'Could not generate share link.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareLinkCopied(true);
      toast({
        title: 'Link copied',
        description: 'Share link copied to clipboard.',
      });
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!tempCharacter) return;
    try {
      await updateCharacter.mutateAsync({ id: tempCharacter.id, data: tempCharacter as any });
      setSheet(createCharacterSheet(tempCharacter as any));
      setIsEditing(false);
      toast({
        title: 'Character saved',
        description: 'Character updated successfully.',
      });
    } catch {
      toast({
        title: 'Failed to save',
        description: 'Could not update character.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setTempCharacter(character);
    setIsEditing(false);
  };

  const handleApplyDamage = (damage: number) => {
    if (!character || isReadOnly) return;
    const updatedSheet = CharacterSheetSystem.applyDamage(sheet, damage);
    if (updateCharacter) {
      void updateCharacter.mutateAsync({ id: updatedSheet.character.id, data: updatedSheet.character as any });
    }
  };

  const handleApplyHealing = (healing: number) => {
    if (!character || isReadOnly) return;
    const updatedSheet = CharacterSheetSystem.applyHealing(sheet, healing);
    if (updateCharacter) {
      void updateCharacter.mutateAsync({ id: updatedSheet.character.id, data: updatedSheet.character as any });
    }
  };

  const handleLongRest = () => {
    if (!character || isReadOnly) return;
    const updatedSheet = CharacterSheetSystem.longRest(sheet);
    if (updateCharacter) {
      void updateCharacter.mutateAsync({ id: updatedSheet.character.id, data: updatedSheet.character as any });
    }
    toast({
      title: 'Long rest completed',
      description: 'All resources restored. Features recharged.',
    });
  };

  const handleAbilityChange = (ability: string, value: number) => {
    if (!tempCharacter) return;
    const updated = {
      ...tempCharacter,
      abilities: {
        ...tempCharacter.abilities,
        [ability]: Math.max(1, Math.min(20, value))
      }
    };
    setTempCharacter(updated);
  };

  const handleHPChange = (type: 'current' | 'temp', value: number) => {
    if (!tempCharacter) return;
    const hitPoints = (tempCharacter as any).hitPoints ?? { current: 0, max: 0, temp: 0 };
    const updated = {
      ...tempCharacter,
      hitPoints: {
        ...hitPoints,
        [type]: Math.max(0, value)
      }
    };
    setTempCharacter(updated);
  };

  // Get spell slots display
  const spellSlots = SpellSystem.getCharacterSpellSlots(sheet.character);
  const spellSlotDisplay = Object.entries(spellSlots)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => {
      const levelName = level === 'cantrips' ? 'Cantrips' : `Level ${level.replace('level', '')}`;
      return `${levelName}: ${count}`;
    });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>
              <p className="text-gray-600">Level {character.level} {character.job}</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Save
                  </Button>
                  <Button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    Edit
                  </Button>
                  <Button onClick={handleLongRest} className="bg-purple-600 hover:bg-purple-700">
                    Long Rest
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ability Scores */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Ability Scores</h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(sheet.character.abilities).map(([ability, score]) => (
                    <div key={ability} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-gray-700">
                        {Formatters.abilityScore(ability as any, score)}
                      </div>
                      {isEditing && (
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={tempCharacter?.abilities[ability as keyof typeof tempCharacter.abilities]}
                          onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value))}
                          className="mt-2 w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Combat Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Combat Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded">
                    <div className="font-medium text-red-700">
                      {Formatters.hitPoints(sheet.character)}
                    </div>
                    {isEditing && (
                      <div className="mt-2 space-y-2">
                        <Input
                          type="number"
                          min="0"
                          value={tempCharacter?.hitPoints.current}
                          onChange={(e) => handleHPChange('current', parseInt(e.target.value))}
                          placeholder="Current HP"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={tempCharacter?.hitPoints.temp}
                          onChange={(e) => handleHPChange('temp', parseInt(e.target.value))}
                          placeholder="Temp HP"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-medium text-blue-700">
                      {Formatters.armorClass(sheet.character)}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-medium text-green-700">
                      {Formatters.initiative(sheet.character)}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium text-purple-700">
                      {Formatters.speed(sheet.character)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proficiency Bonus */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Proficiency Bonus</h2>
                <div className="bg-yellow-50 p-3 rounded inline-block">
                  <div className="font-medium text-yellow-700">
                    Proficiency Bonus: +{sheet.calculated.proficiencyBonus}
                  </div>
                </div>
              </div>

              {/* Saving Throws */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Saving Throws</h2>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(sheet.calculated.savingThrows).map(([ability, bonus]) => (
                    <div key={ability} className="bg-gray-50 p-2 rounded text-sm">
                      {Formatters.savingThrow(ability as any, bonus, sheet.character.savingThrowProficiencies.includes(ability as any))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(sheet.calculated.skills).map(([skill, bonus]) => (
                    <div key={skill} className="bg-gray-50 p-2 rounded text-sm">
                      {Formatters.skill(skill, bonus, sheet.character.skillProficiencies.includes(skill), sheet.character.skillExpertise.includes(skill))}
                    </div>
                  ))}
                </div>
              </div>

              {/* System Favor */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">System Favor</h2>
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="font-medium text-indigo-700">
                    {Formatters.systemFavor(sheet.character)}
                  </div>
                </div>
              </div>

              {/* Spellcasting */}
              {sheet.spellcasting.canCastSpells && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Spellcasting</h2>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium text-purple-700 mb-2">
                      Spell Save DC: {sheet.spellcasting.spellSaveDC}
                    </div>
                    <div className="font-medium text-purple-700 mb-2">
                      Spell Attack Bonus: +{sheet.spellcasting.spellAttackBonus}
                    </div>
                    <div className="text-sm text-purple-600">
                      {spellSlotDisplay.join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Conditions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Status</h2>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-medium text-orange-700 mb-1">
                    {Formatters.conditions(sheet.character)}
                  </div>
                  <div className="text-sm text-orange-600">
                    {Formatters.deathSaves(sheet.character)}
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Equipment</h2>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-700">
                    {Formatters.equipment(sheet.character)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {!isEditing && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleApplyDamage(10)}
                      className="w-full bg-red-600 hover:bg-red-700 text-sm"
                    >
                      Take 10 Damage
                    </Button>
                    <Button
                      onClick={() => handleApplyHealing(10)}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm"
                    >
                      Heal 10 HP
                    </Button>
                    <Button
                      onClick={() => handleApplyDamage(sheet.character.hitPoints.current)}
                      className="w-full bg-red-800 hover:bg-red-900 text-sm"
                    >
                      Drop to 0 HP
                    </Button>
                  </div>
                </div>
              )}

              {/* Character Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Character Summary</h2>
                <div className="bg-gray-100 p-4 rounded">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {Formatters.characterSummary(sheet.character)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
  );
};

export default CharacterSheet5e;
