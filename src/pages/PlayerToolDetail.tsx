import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Dice6, ScrollText, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { EquipmentList } from '@/components/character/EquipmentList';
import { CurrencyManager } from '@/components/character/CurrencyManager';
import { RunesList } from '@/components/character/RunesList';
import { ActionsList } from '@/components/character/ActionsList';
import { PowersList } from '@/components/character/PowersList';
import { FeaturesList } from '@/components/character/FeaturesList';
import { CharacterArtPanel } from '@/components/character/CharacterArtPanel';
import { useActiveCharacter } from '@/hooks/useActiveCharacter';
import { QuestLog } from '@/pages/player-tools/QuestLog';
import { formatMonarchVernacular } from '@/lib/vernacular';

const TOOL_TITLES: Record<string, { title: string; subtitle: string }> = {
  'character-sheet': {
    title: 'Character Sheet',
    subtitle: 'Review stats, abilities, and full ascendant details.',
  },
  inventory: {
    title: 'Inventory',
    subtitle: 'Manage equipment, currency, and relic resources.',
  },
  abilities: {
    title: 'Abilities & Skills',
    subtitle: 'Track actions, powers, and feature uses.',
  },
  'character-art': {
    title: 'Character Art Generator',
    subtitle: 'Create portrait art for your ascendant.',
  },
  'compendium-viewer': {
    title: 'Compendium Viewer',
    subtitle: 'Browse the complete compendium.',
  },
  'quest-log': {
    title: 'Quest Log',
    subtitle: 'Track daily quests, rewards, and progress.',
  },
  'dice-roller': {
    title: 'Dice Roller',
    subtitle: 'Roll checks, attacks, and saves.',
  },
};

const requiresCharacter = (toolId: string) =>
  ['character-sheet', 'inventory', 'abilities', 'character-art', 'quest-log'].includes(toolId);

export default function PlayerToolDetail() {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const { characters, activeCharacter, activeCharacterId, setActiveCharacter, isLoading } = useActiveCharacter();

  const tool = toolId ? TOOL_TITLES[toolId] : null;

  const shouldRedirect = useMemo(() => {
    if (!toolId) return null;
    if (toolId === 'compendium-viewer') return '/compendium';
    if (toolId === 'dice-roller') return '/dice';
    if (toolId === 'character-sheet' && activeCharacter?.id) {
      return `/characters/${activeCharacter.id}`;
    }
    return null;
  }, [activeCharacter?.id, toolId]);

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }

  if (!tool || !toolId) {
    return <Navigate to="/player-tools" replace />;
  }

  const showCharacterSelector = requiresCharacter(toolId) && characters.length > 1;

  const renderCharacterGate = () => {
    if (!requiresCharacter(toolId)) return null;
    if (isLoading) {
      return <div className="text-sm text-muted-foreground">Loading ascendant data...</div>;
    }
    if (!activeCharacter) {
      return (
        <SystemWindow title="NO ACTIVE ASCENDANT">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Create an ascendant to unlock player tools.</p>
            <Button onClick={() => navigate('/characters/new')}>Create Ascendant</Button>
          </div>
        </SystemWindow>
      );
    }
    return null;
  };

  const renderToolContent = () => {
    if (!activeCharacter && requiresCharacter(toolId)) {
      return renderCharacterGate();
    }

    switch (toolId) {
      case 'character-sheet':
        return (
          <SystemWindow title="ACTIVE ASCENDANT">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {activeCharacter?.name} | Level {activeCharacter?.level} {formatMonarchVernacular(activeCharacter?.job || 'Unawakened')}
              </div>
              <Button onClick={() => navigate(`/characters/${activeCharacter?.id}`)} className="gap-2">
                <ScrollText className="w-4 h-4" />
                Open Character Sheet
              </Button>
            </div>
          </SystemWindow>
        );
      case 'inventory':
        return activeCharacter ? (
          <div className="space-y-6">
            <CurrencyManager characterId={activeCharacter.id} />
            <EquipmentList characterId={activeCharacter.id} />
            <RunesList characterId={activeCharacter.id} />
          </div>
        ) : null;
      case 'abilities':
        return activeCharacter ? (
          <div className="space-y-6">
            <ActionsList characterId={activeCharacter.id} />
            <PowersList characterId={activeCharacter.id} />
            <FeaturesList characterId={activeCharacter.id} />
          </div>
        ) : null;
      case 'character-art':
        return activeCharacter ? (
          <CharacterArtPanel
            characterId={activeCharacter.id}
            characterData={{
              name: activeCharacter.name,
              appearance: activeCharacter.appearance || '',
              backstory: activeCharacter.backstory || '',
              job: activeCharacter.job || undefined,
              level: activeCharacter.level,
            }}
          />
        ) : null;
      case 'quest-log':
        return activeCharacter ? <QuestLog characterId={activeCharacter.id} /> : null;
      default:
        return (
          <SystemWindow title="TOOL UNAVAILABLE">
            <div className="text-sm text-muted-foreground">This tool is not configured yet.</div>
          </SystemWindow>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/player-tools')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Player Tools
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{tool.title}</h1>
            <p className="text-muted-foreground">{tool.subtitle}</p>
          </div>
          {toolId === 'compendium-viewer' && (
            <Button onClick={() => navigate('/compendium')} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Open Compendium
            </Button>
          )}
          {toolId === 'dice-roller' && (
            <Button onClick={() => navigate('/dice')} className="gap-2">
              <Dice6 className="w-4 h-4" />
              Open Dice Roller
            </Button>
          )}
          {toolId === 'character-art' && (
            <Button onClick={() => navigate('/dm-tools/art-generator')} variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Warden Art Tools
            </Button>
          )}
        </div>

        {showCharacterSelector && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Active Ascendant</span>
            <Select value={activeCharacterId || ''} onValueChange={setActiveCharacter}>
              <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select an ascendant" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    {character.name} (Level {character.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {renderToolContent()}
      </div>
    </Layout>
  );
}

