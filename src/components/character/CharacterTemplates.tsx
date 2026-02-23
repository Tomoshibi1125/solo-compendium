import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Swords, Shield, Zap } from 'lucide-react';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  job: string;
  path?: string;
  background?: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const TEMPLATES: CharacterTemplate[] = [
  {
    id: 'destroyer-vanguard',
    name: 'Vanguard Destroyer',
    description: 'A frontline combat master with tactical superiority',
    job: 'Destroyer',
    path: 'Guardian',
    background: 'Former E-Rank',
    level: 1,
    icon: Shield,
    tags: ['frontline', 'tactical', 'melee'],
  },
  {
    id: 'mage-blast',
    name: 'Blaster Mage',
    description: 'A damage-focused spellcaster who devastates the battlefield',
    job: 'Mage',
    path: 'Evoker',
    background: 'Academy Graduate',
    level: 1,
    icon: Zap,
    tags: ['damage', 'ranged', 'spellcaster'],
  },
  {
    id: 'assassin-shadow',
    name: 'Stealth Assassin',
    description: 'A precision hunter who strikes from the shadows',
    job: 'Assassin',
    path: 'Shadow',
    background: 'Independent Contractor',
    level: 1,
    icon: Swords,
    tags: ['stealth', 'damage', 'mobile'],
  },
  {
    id: 'umbral-revenant',
    name: 'Umbral Revenant',
    description: 'A death magic hunter commanding an undead legion',
    job: 'Revenant',
    path: 'Umbral Regent',
    background: 'Reawakened Ascendant',
    level: 1,
    icon: Sparkles,
    tags: ['summoner', 'undead', 'umbral'],
  },
];

interface CharacterTemplatesProps {
  onTemplateSelect?: (template: CharacterTemplate) => void;
  className?: string;
}

export function CharacterTemplates({ onTemplateSelect, className }: CharacterTemplatesProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createFromTemplate = useMutation({
    mutationFn: async (template: CharacterTemplate) => {
      // Navigate to character creation with template pre-filled
      navigate(`/characters/new?template=${template.id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Template Selected',
        description: 'Character creation started with template',
      });
    },
  });

  return (
    <SystemWindow title="CHARACTER TEMPLATES" className={className}>
      <p className="text-sm text-muted-foreground mb-4">
        Quick-start character creation with pre-configured builds
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          const displayName = formatMonarchVernacular(template.name);
          const displayDescription = formatMonarchVernacular(template.description);
          const displayPath = template.path ? formatMonarchVernacular(template.path) : '';
          return (
            <button
              key={template.id}
              type="button"
              className="w-full text-left p-4 rounded border bg-muted/30 hover:bg-muted/50 transition-colors"
              onClick={() => {
                if (onTemplateSelect) {
                  onTemplateSelect(template);
                } else {
                  createFromTemplate.mutate(template);
                }
              }}
            >
              <div className="flex items-start gap-3 mb-2">
                <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">{displayName}</h3>
                  <p className="text-sm text-muted-foreground">{displayDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  {formatMonarchVernacular(template.job)}
                </Badge>
                {template.path && (
                  <Badge variant="outline" className="text-xs">
                    {displayPath}
                  </Badge>
                )}
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {formatMonarchVernacular(tag)}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </SystemWindow>
  );
}


