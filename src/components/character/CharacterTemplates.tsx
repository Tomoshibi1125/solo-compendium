import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
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
    id: 'striker-tank',
    name: 'Tank Striker',
    description: 'A frontline warrior focused on defense and protection',
    job: 'Striker',
    path: 'Guardian',
    background: 'Former E-Rank',
    level: 1,
    icon: Shield,
    tags: ['tank', 'defensive', 'melee'],
  },
  {
    id: 'mage-blast',
    name: 'Blaster Mage',
    description: 'A damage-focused spellcaster',
    job: 'Mage',
    path: 'Evoker',
    background: 'Academy Graduate',
    level: 1,
    icon: Zap,
    tags: ['damage', 'ranged', 'spellcaster'],
  },
  {
    id: 'assassin-rogue',
    name: 'Stealth Assassin',
    description: 'A sneaky damage dealer with high mobility',
    job: 'Assassin',
    path: 'Shadow',
    background: 'Independent Contractor',
    level: 1,
    icon: Swords,
    tags: ['stealth', 'damage', 'mobile'],
  },
  {
    id: 'umbral-monarch',
    name: 'Umbral Monarch',
    description: 'A necromancer with an umbral legion',
    job: 'Necromancer',
    path: 'Umbral Monarch',
    background: 'Reawakened Ascendant',
    level: 1,
    icon: Sparkles,
    tags: ['summoner', 'necromancer', 'umbral'],
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
            <div
              key={template.id}
              className="p-4 rounded border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
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
            </div>
          );
        })}
      </div>
    </SystemWindow>
  );
}


