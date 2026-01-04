import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  Wand2, 
  Package, 
  AlertCircle,
  Moon,
  Sun,
  Loader2,
  Edit,
  Plus,
  Download
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCharacter, useUpdateCharacter } from '@/hooks/useCharacters';
import { calculateCharacterStats, formatModifier } from '@/lib/characterCalculations';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { getAllSkills, calculateSkillModifier, calculatePassiveSkill } from '@/lib/skills';
import { EquipmentList } from '@/components/character/EquipmentList';
import { PowersList } from '@/components/character/PowersList';
import { ActionsList } from '@/components/character/ActionsList';
import { FeaturesList } from '@/components/character/FeaturesList';
import { ExportDialog } from '@/components/character/ExportDialog';
import { ABILITY_NAMES, type AbilityScore } from '@/types/solo-leveling';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEquipment } from '@/hooks/useEquipment';
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
import { Textarea } from '@/components/ui/textarea';

const CharacterSheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: character, isLoading } = useCharacter(id || '');
  const updateCharacter = useUpdateCharacter();
  const { equipment } = useEquipment(id || '');
  const [hpEditOpen, setHpEditOpen] = useState(false);
  const [hpEditValue, setHpEditValue] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SystemWindow title="CHARACTER NOT FOUND" className="max-w-lg mx-auto">
            <p className="text-muted-foreground mb-4">The character you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/characters')}>Back to Characters</Button>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  const baseStats = calculateCharacterStats({
    level: character.level,
    abilities: character.abilities,
    savingThrowProficiencies: character.saving_throw_proficiencies || [],
    skillProficiencies: character.skill_proficiencies || [],
    skillExpertise: character.skill_expertise || [],
    armorClass: character.armor_class,
    speed: character.speed,
  });

  // Apply equipment modifiers
  const equipmentMods = applyEquipmentModifiers(
    baseStats.armorClass,
    character.speed,
    character.abilities,
    equipment
  );

  const calculatedStats = {
    ...baseStats,
    armorClass: equipmentMods.armorClass,
    speed: equipmentMods.speed,
  };

  // Calculate skills
  const allSkills = getAllSkills();
  const skills = allSkills.reduce((acc, skill) => {
    acc[skill.name] = {
      modifier: calculateSkillModifier(
        skill.name,
        character.abilities,
        character.skill_proficiencies || [],
        character.skill_expertise || [],
        calculatedStats.proficiencyBonus
      ),
      passive: calculatePassiveSkill(
        skill.name,
        character.abilities,
        character.skill_proficiencies || [],
        character.skill_expertise || [],
        calculatedStats.proficiencyBonus
      ),
      ability: skill.ability,
      proficient: (character.skill_proficiencies || []).includes(skill.name),
      expertise: (character.skill_expertise || []).includes(skill.name),
    };
    return acc;
  }, {} as Record<string, {
    modifier: number;
    passive: number;
    ability: AbilityScore;
    proficient: boolean;
    expertise: boolean;
  }>);

  const handleShortRest = async () => {
    try {
      const { executeShortRest } = await import('@/lib/restSystem');
      await executeShortRest(character.id);

      // Refresh character data
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { updated_at: new Date().toISOString() },
      });

      toast({
        title: 'Short rest completed',
        description: 'Hit dice restored. Short-rest features recharged.',
      });
    } catch (error) {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete short rest.',
        variant: 'destructive',
      });
    }
  };

  const handleLongRest = async () => {
    try {
      const { executeLongRest } = await import('@/lib/restSystem');
      await executeLongRest(character.id);

      // Refresh character data
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { updated_at: new Date().toISOString() },
      });

      toast({
        title: 'Long rest completed',
        description: 'All resources restored. Features recharged. Exhaustion reduced by 1.',
      });
    } catch (error) {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete long rest.',
        variant: 'destructive',
      });
    }
  };

  const handleHPChange = async () => {
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
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          hp_current: Math.min(newHP, character.hp_max + (character.hp_temp || 0)),
        },
      });
      setHpEditOpen(false);
      setHpEditValue('');
    } catch (error) {
      toast({
        title: 'Failed to update HP',
        description: 'Could not update hit points.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/characters')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Characters
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(true)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/characters/${character.id}/edit`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Info */}
            <SystemWindow title={character.name.toUpperCase()} className="border-primary/50">
              {character.portrait_url && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={character.portrait_url}
                    alt={character.name}
                    className="w-32 h-32 rounded-lg object-cover border border-primary/30"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Level</span>
                  <span className="font-display text-2xl font-bold">{character.level}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Job</span>
                  <span className="font-heading">{character.job || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Path</span>
                  <span className="font-heading">{character.path || 'None'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Background</span>
                  <span className="font-heading">{character.background || 'None'}</span>
                </div>
              </div>
            </SystemWindow>

            {/* Core Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SystemWindow title="HIT POINTS" compact>
                <div className="flex items-center justify-between mb-2">
                  <Heart className={cn(
                    "w-6 h-6",
                    character.hp_current < character.hp_max * 0.25 ? "text-destructive" :
                    character.hp_current < character.hp_max * 0.5 ? "text-orange-400" :
                    "text-red-400"
                  )} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setHpEditValue(character.hp_current.toString());
                      setHpEditOpen(true);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "font-display text-3xl font-bold mb-1",
                    character.hp_current < character.hp_max * 0.5 && "text-destructive"
                  )}>
                    {character.hp_current}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    / {character.hp_max}
                    {character.hp_temp > 0 && ` + ${character.hp_temp} temp`}
                  </div>
                </div>
              </SystemWindow>

              <SystemWindow title="ARMOR CLASS" compact>
                <Shield className="w-6 h-6 text-blue-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.armorClass}</div>
                {equipmentMods.armorClass !== baseStats.armorClass && (
                  <div className="text-xs text-muted-foreground">
                    Base: {baseStats.armorClass} + {equipmentMods.armorClass - baseStats.armorClass}
                  </div>
                )}
              </SystemWindow>

              <SystemWindow title="INITIATIVE" compact>
                <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">
                  {formatModifier(calculatedStats.initiative)}
                </div>
              </SystemWindow>

              <SystemWindow title="SPEED" compact>
                <Swords className="w-6 h-6 text-green-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.speed} ft</div>
                {equipmentMods.speed !== character.speed && (
                  <div className="text-xs text-muted-foreground">
                    Base: {character.speed} + {equipmentMods.speed - character.speed}
                  </div>
                )}
              </SystemWindow>
            </div>

            {/* Ability Scores */}
            <SystemWindow title="ABILITY SCORES">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
                  const baseScore = character.abilities[ability];
                  const equipmentBonus = equipmentMods.abilityModifiers[ability.toLowerCase() as keyof typeof equipmentMods.abilityModifiers] || 0;
                  const totalScore = baseScore + equipmentBonus;
                  const modifier = calculatedStats.abilityModifiers[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  
                  return (
                    <div key={ability} className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">{ABILITY_NAMES[ability]}</div>
                      <div className="font-display text-2xl font-bold mb-1">
                        {totalScore}
                        {equipmentBonus !== 0 && (
                          <span className={cn(
                            "text-xs ml-1",
                            equipmentBonus > 0 ? "text-green-400" : "text-red-400"
                          )}>
                            ({equipmentBonus > 0 ? '+' : ''}{equipmentBonus})
                          </span>
                        )}
                      </div>
                      <div className={cn(
                        "text-sm font-heading",
                        modifier >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {formatModifier(modifier)}
                      </div>
                      {isProficient && (
                        <Badge variant="secondary" className="mt-1 text-xs">Prof</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Saving Throws */}
            <SystemWindow title="SAVING THROWS">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
                  const save = calculatedStats.savingThrows[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  
                  return (
                    <div key={ability} className="flex items-center justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm font-heading">{ABILITY_NAMES[ability]}</span>
                      <div className="flex items-center gap-2">
                        {isProficient && <Badge variant="secondary" className="text-xs">P</Badge>}
                        <span className={cn(
                          "font-display font-bold",
                          save >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatModifier(save)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Resources */}
            <div className="grid grid-cols-2 gap-4">
              <SystemWindow title="HIT DICE" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.hit_dice_current}/{character.hit_dice_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.hit_dice_size}</div>
                </div>
              </SystemWindow>

              <SystemWindow title="SYSTEM FAVOR" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.system_favor_current}/{character.system_favor_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.system_favor_die}</div>
                </div>
              </SystemWindow>
            </div>

            {/* Conditions */}
            {character.conditions && character.conditions.length > 0 && (
              <SystemWindow title="CONDITIONS" variant="alert">
                <div className="flex flex-wrap gap-2">
                  {character.conditions.map((condition) => (
                    <Badge key={condition} variant="destructive">{condition}</Badge>
                  ))}
                </div>
              </SystemWindow>
            )}

            {/* Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={handleShortRest}
                className="gap-2"
                disabled={updateCharacter.isPending}
              >
                <Moon className="w-4 h-4" />
                Short Rest
              </Button>
              <Button
                variant="outline"
                onClick={handleLongRest}
                className="gap-2"
                disabled={updateCharacter.isPending}
              >
                <Sun className="w-4 h-4" />
                Long Rest
              </Button>
              {character.level < 20 && (
                <Button
                  variant="default"
                  onClick={() => navigate(`/characters/${character.id}/level-up`)}
                  className="gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Level Up
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            {/* Proficiencies */}
            <SystemWindow title="PROFICIENCIES">
              <div className="space-y-3">
                {character.armor_proficiencies && character.armor_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Armor</span>
                    <div className="flex flex-wrap gap-1">
                      {character.armor_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.weapon_proficiencies && character.weapon_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Weapons</span>
                    <div className="flex flex-wrap gap-1">
                      {character.weapon_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.tool_proficiencies && character.tool_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Tools</span>
                    <div className="flex flex-wrap gap-1">
                      {character.tool_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.skill_proficiencies && character.skill_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {character.skill_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SystemWindow>

            {/* Skills */}
            <SystemWindow title="SKILLS">
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {Object.entries(skills).map(([skillName, skill]) => (
                  <div
                    key={skillName}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-heading">{skillName}</span>
                      <span className="text-xs text-muted-foreground">({ABILITY_NAMES[skill.ability]})</span>
                      {skill.expertise && <Badge variant="default" className="text-xs">E</Badge>}
                      {skill.proficient && !skill.expertise && <Badge variant="secondary" className="text-xs">P</Badge>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">Passive: {skill.passive}</span>
                      <span className={cn(
                        "font-display font-bold min-w-[3rem] text-right",
                        skill.modifier >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {formatModifier(skill.modifier)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SystemWindow>

            {/* Actions */}
            <ActionsList characterId={character.id} />

            {/* Features */}
            <FeaturesList characterId={character.id} />

            {/* Equipment */}
            <EquipmentList characterId={character.id} />

            {/* Powers */}
            <PowersList characterId={character.id} />

            {/* Portrait Upload */}
            <SystemWindow title="PORTRAIT">
              <PortraitUpload
                characterId={character.id}
                currentPortraitUrl={character.portrait_url}
                onUploadComplete={() => {
                  // Refresh character data
                  window.location.reload();
                }}
              />
            </SystemWindow>

            {/* Notes */}
            <SystemWindow title="NOTES">
              <Textarea
                className="min-h-[100px] resize-y"
                placeholder="Add notes about your character..."
                value={character.notes || ''}
                onChange={async (e) => {
                  try {
                    await updateCharacter.mutateAsync({
                      id: character.id,
                      data: { notes: e.target.value },
                    });
                  } catch (error) {
                    toast({
                      title: 'Failed to save',
                      description: 'Could not update notes.',
                      variant: 'destructive',
                    });
                  }
                }}
              />
            </SystemWindow>
          </div>
        </div>
      </div>

      {/* HP Edit Dialog */}
      <Dialog open={hpEditOpen} onOpenChange={setHpEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hit Points</DialogTitle>
            <DialogDescription>
              Set the character's current hit points (max: {character.hp_max + (character.hp_temp || 0)})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="hp">Current HP</Label>
              <Input
                id="hp"
                type="number"
                value={hpEditValue}
                onChange={(e) => setHpEditValue(e.target.value)}
                min={0}
                max={character.hp_max + (character.hp_temp || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHpEditOpen(false)}>Cancel</Button>
            <Button onClick={handleHPChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        character={character}
      />
    </Layout>
  );
};

export default CharacterSheet;

