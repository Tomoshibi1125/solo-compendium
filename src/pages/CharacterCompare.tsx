import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCharacters } from '@/hooks/useCharacters';
import { useCharacter } from '@/hooks/useCharacters';
import { calculateCharacterStats, formatModifier } from '@/lib/characterCalculations';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

const CharacterCompare = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: characters = [], isLoading: charactersLoading } = useCharacters();
  
  const char1Id = searchParams.get('char1') || '';
  const char2Id = searchParams.get('char2') || '';
  
  const { data: char1, isLoading: loading1 } = useCharacter(char1Id);
  const { data: char2, isLoading: loading2 } = useCharacter(char2Id);

  const handleChar1Change = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('char1', id);
    } else {
      newParams.delete('char1');
    }
    setSearchParams(newParams);
  };

  const handleChar2Change = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('char2', id);
    } else {
      newParams.delete('char2');
    }
    setSearchParams(newParams);
  };

  const isLoading = charactersLoading || loading1 || loading2;
  const hasBoth = char1 && char2;

  const stats1 = char1 ? calculateCharacterStats({
    level: char1.level,
    abilities: char1.abilities,
    savingThrowProficiencies: char1.saving_throw_proficiencies || [],
    skillProficiencies: char1.skill_proficiencies || [],
    skillExpertise: char1.skill_expertise || [],
    armorClass: char1.armor_class,
    speed: char1.speed,
  }) : null;
  const stats2 = char2 ? calculateCharacterStats({
    level: char2.level,
    abilities: char2.abilities,
    savingThrowProficiencies: char2.saving_throw_proficiencies || [],
    skillProficiencies: char2.skill_proficiencies || [],
    skillExpertise: char2.skill_expertise || [],
    armorClass: char2.armor_class,
    speed: char2.speed,
  }) : null;

  const StatRow = ({ label, value1, value2, higherIsBetter = true }: {
    label: string;
    value1: number | string | null;
    value2: number | string | null;
    higherIsBetter?: boolean;
  }) => {
    if (value1 === null || value2 === null) return null;
    
    const num1 = typeof value1 === 'string' ? parseFloat(value1) : value1;
    const num2 = typeof value2 === 'string' ? parseFloat(value2) : value2;
    
    if (isNaN(num1) || isNaN(num2)) {
      return (
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-border/50">
          <div className="font-heading text-sm text-muted-foreground">{label}</div>
          <div className="text-sm">{value1}</div>
          <div className="text-sm">{value2}</div>
        </div>
      );
    }

    const diff = num1 - num2;
    const winner1 = higherIsBetter ? diff > 0 : diff < 0;
    const winner2 = higherIsBetter ? diff < 0 : diff > 0;

    return (
      <div className="grid grid-cols-3 gap-4 py-2 border-b border-border/50">
        <div className="font-heading text-sm text-muted-foreground">{label}</div>
        <div className={cn(
          "text-sm font-semibold",
          winner1 && "text-green-400",
          winner2 && "text-red-400"
        )}>
          {value1}
          {diff !== 0 && (
            <span className="ml-2 text-xs">
              ({diff > 0 ? '+' : ''}{diff.toFixed(0)})
            </span>
          )}
        </div>
        <div className={cn(
          "text-sm font-semibold",
          winner2 && "text-green-400",
          winner1 && "text-red-400"
        )}>
          {value2}
          {diff !== 0 && (
            <span className="ml-2 text-xs">
              ({diff < 0 ? '+' : ''}{-diff.toFixed(0)})
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/characters')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Characters
          </Button>
        </div>

        <SystemWindow title="COMPARE ASCENDANTS" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-heading text-muted-foreground mb-2 block">
                  Ascendant 1
                </p>
                <Select value={char1Id} onValueChange={handleChar1Change}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first ascendant" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name} (Level {char.level} {formatMonarchVernacular(char.job || 'Unknown')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-heading text-muted-foreground mb-2 block">
                  Ascendant 2
                </p>
                <Select value={char2Id} onValueChange={handleChar2Change}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second ascendant" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name} (Level {char.level} {formatMonarchVernacular(char.job || 'Unknown')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SystemWindow>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && hasBoth && stats1 && stats2 && (
          <div className="space-y-6">
            {/* Basic Info */}
            <SystemWindow title="BASIC INFORMATION">
              <div className="space-y-2">
                <StatRow label="Name" value1={char1.name} value2={char2.name} higherIsBetter={false} />
                <StatRow label="Level" value1={char1.level} value2={char2.level} />
                <StatRow
                  label="Job"
                  value1={formatMonarchVernacular(char1.job || 'Unknown')}
                  value2={formatMonarchVernacular(char2.job || 'Unknown')}
                  higherIsBetter={false}
                />
                <StatRow
                  label="Path"
                  value1={formatMonarchVernacular(char1.path || 'N/A')}
                  value2={formatMonarchVernacular(char2.path || 'N/A')}
                  higherIsBetter={false}
                />
              </div>
            </SystemWindow>

            {/* Ability Scores */}
            <SystemWindow title="ABILITY SCORES">
              <div className="space-y-2">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => (
                  <StatRow
                    key={ability}
                    label={ABILITY_NAMES[ability]}
                    value1={char1.abilities[ability]}
                    value2={char2.abilities[ability]}
                  />
                ))}
              </div>
            </SystemWindow>

            {/* Combat Stats */}
            <SystemWindow title="COMBAT STATISTICS">
              <div className="space-y-2">
                <StatRow label="Hit Points" value1={char1.hp_current} value2={char2.hp_current} />
                <StatRow label="Max HP" value1={char1.hp_max} value2={char2.hp_max} />
                <StatRow label="Armor Class" value1={stats1.armorClass} value2={stats2.armorClass} />
                <StatRow label="Speed" value1={char1.speed} value2={char2.speed} />
                <StatRow label="Proficiency Bonus" value1={`+${stats1.proficiencyBonus}`} value2={`+${stats2.proficiencyBonus}`} />
              </div>
            </SystemWindow>

            {/* Saving Throws */}
            <SystemWindow title="SAVING THROWS">
              <div className="space-y-2">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
                  const save1 = stats1.savingThrows[ability];
                  const save2 = stats2.savingThrows[ability];
                  return (
                    <StatRow
                      key={ability}
                      label={ABILITY_NAMES[ability]}
                      value1={formatModifier(save1)}
                      value2={formatModifier(save2)}
                    />
                  );
                })}
              </div>
            </SystemWindow>
          </div>
        )}

        {!isLoading && !hasBoth && (
          <SystemWindow>
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-heading">
                Select two ascendants to compare their stats
              </p>
            </div>
          </SystemWindow>
        )}
      </div>
    </Layout>
  );
};

export default CharacterCompare;


