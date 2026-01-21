import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Shield, Sword, Wand2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserToolState } from '@/hooks/useToolState';
import { MONARCH_LABEL } from '@/lib/vernacular';

interface RelicProperty {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'bonus';
}

interface Relic {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'tool';
  rank: string;
  description: string;
  properties: RelicProperty[];
  attunement: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';
}

const RELIC_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];
const RELIC_TYPES = ['weapon', 'armor', 'accessory', 'tool'];
const RARITY_LEVELS = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

const BALANCE_GUIDELINES = {
  common: {
    properties: 1,
    maxBonus: 1,
    description: 'Basic relics with simple benefits. +1 to attacks or AC, minor utility.',
  },
  uncommon: {
    properties: 1-2,
    maxBonus: 2,
    description: 'Improved relics. +1 to attacks and damage, or +2 AC, minor active abilities.',
  },
  rare: {
    properties: 2-3,
    maxBonus: 3,
    description: 'Powerful relics. +2 bonuses, significant active abilities, or unique effects.',
  },
  'very-rare': {
    properties: 3-4,
    maxBonus: 4,
    description: 'Exceptional relics. +3 bonuses, powerful active abilities, multiple effects.',
  },
  legendary: {
    properties: 4-5,
    maxBonus: 5,
    description: 'Artifact-level relics. +4 or higher bonuses, game-changing abilities.',
  },
};

const RelicWorkshop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const hydratedRef = useRef(false);
  const [relics, setRelics] = useState<Relic[]>([]);
  
  const initialRelicId = useRef(Date.now().toString()).current;
  
  const [currentRelic, setCurrentRelic] = useState<Relic>({
    id: initialRelicId,
    name: '',
    type: 'weapon',
    rank: 'C',
    description: '',
    properties: [],
    attunement: false,
    rarity: 'uncommon',
  });
  const [newProperty, setNewProperty] = useState<Omit<RelicProperty, 'id'>>({
    name: '',
    description: '',
    type: 'passive',
  });
  const { state: storedRelics, isLoading, saveNow } = useUserToolState<Relic[]>('relic_workshop', {
    initialState: [],
    storageKey: 'dm-relics',
  });
  const debouncedRelics = useDebounce(relics, 600);

  const addProperty = () => {
    if (!newProperty.name) return;
    
    const property: RelicProperty = {
      id: `${Date.now()}-${Math.random()}`,
      ...newProperty,
    };
    
    setCurrentRelic({
      ...currentRelic,
      properties: [...currentRelic.properties, property],
    });
    
    setNewProperty({ name: '', description: '', type: 'passive' });
  };

  const removeProperty = (id: string) => {
    setCurrentRelic({
      ...currentRelic,
      properties: currentRelic.properties.filter(p => p.id !== id),
    });
  };

  const saveRelic = () => {
    if (!currentRelic.name) {
      toast({
        title: 'Error',
        description: 'Please enter a relic name.',
        variant: 'destructive',
      });
      return;
    }

    const updated = relics.filter(r => r.id !== currentRelic.id);
    updated.push(currentRelic);
    setRelics(updated);
    void saveNow(updated);

    toast({
      title: 'Saved!',
      description: 'Relic saved successfully.',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return Sword;
      case 'armor': return Shield;
      case 'accessory': return Sparkles;
      default: return Wand2;
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
      uncommon: 'text-green-400 border-green-400/30 bg-green-400/10',
      rare: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      'very-rare': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
      legendary: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    };
    return colors[rarity] || colors.common;
  };

  useEffect(() => {
    if (isLoading || hydratedRef.current) return;
    if (Array.isArray(storedRelics) && storedRelics.length > 0) {
      setRelics(storedRelics);
    }
    hydratedRef.current = true;
  }, [isLoading, storedRelics]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    void saveNow(debouncedRelics);
  }, [debouncedRelics, saveNow]);

  const guideline = BALANCE_GUIDELINES[currentRelic.rarity];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Warden Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            RELIC WORKSHOP
          </h1>
          <p className="text-muted-foreground font-heading">
            Design custom relics balanced within the System Ascendant 5e SRD system guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SystemWindow title="RELIC DESIGN">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Relic Name</Label>
                    <Input
                      id="name"
                      value={currentRelic.name}
                      onChange={(e) => setCurrentRelic({ ...currentRelic, name: e.target.value })}
                      placeholder={`e.g., Umbral ${MONARCH_LABEL}'s Dagger`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">Rift Rank</Label>
                    <Select
                      value={currentRelic.rank}
                      onValueChange={(value) => setCurrentRelic({ ...currentRelic, rank: value })}
                    >
                      <SelectTrigger id="rank">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELIC_RANKS.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            Rank {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Relic Type</Label>
                    <Select
                      value={currentRelic.type}
                      onValueChange={(value: Relic['type']) => setCurrentRelic({ ...currentRelic, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELIC_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select
                      value={currentRelic.rarity}
                      onValueChange={(value: Relic['rarity']) => setCurrentRelic({ ...currentRelic, rarity: value })}
                    >
                      <SelectTrigger id="rarity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RARITY_LEVELS.map((rarity) => (
                          <SelectItem key={rarity} value={rarity}>
                            {rarity.charAt(0).toUpperCase() + rarity.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentRelic.description}
                    onChange={(e) => setCurrentRelic({ ...currentRelic, description: e.target.value })}
                    placeholder="Describe the relic's appearance, history, and lore..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="attunement"
                    checked={currentRelic.attunement}
                    onChange={(e) => setCurrentRelic({ ...currentRelic, attunement: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="attunement" className="cursor-pointer">
                    Requires Attunement
                  </Label>
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="ADD PROPERTY">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prop-name">Property Name</Label>
                    <Input
                      id="prop-name"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      placeholder="e.g., +1 Attack Bonus"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prop-type">Type</Label>
                    <Select
                      value={newProperty.type}
                      onValueChange={(value: RelicProperty['type']) => setNewProperty({ ...newProperty, type: value })}
                    >
                      <SelectTrigger id="prop-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passive">Passive</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="prop-desc">Property Description</Label>
                  <Textarea
                    id="prop-desc"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    placeholder="Describe what this property does..."
                    rows={3}
                  />
                </div>
                <Button onClick={addProperty} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </SystemWindow>

            <SystemWindow title="PROPERTIES">
              {currentRelic.properties.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No properties yet. Add properties to define the relic's abilities.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentRelic.properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 rounded-lg border border-border bg-muted/30 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{prop.type}</Badge>
                          <span className="font-heading font-semibold">{prop.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{prop.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProperty(prop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SystemWindow>
          </div>

          <div className="space-y-6">
            <SystemWindow title="BALANCE GUIDE" variant="quest">
              <div className="space-y-4">
                <Badge className={getRarityColor(currentRelic.rarity)}>
                  {currentRelic.rarity.toUpperCase().replace('-', ' ')}
                </Badge>
                <p className="text-sm text-muted-foreground">{guideline.description}</p>
                <div className="space-y-2 text-xs">
                  <div>Properties: {typeof guideline.properties === 'number' ? guideline.properties : `${guideline.properties[0]}-${guideline.properties[1]}`}</div>
                  <div>Max Bonus: +{guideline.maxBonus}</div>
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="RELIC PREVIEW">
              {currentRelic.name ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getTypeIcon(currentRelic.type);
                        return <Icon className="w-5 h-5 text-primary" />;
                      })()}
                      <h3 className="font-heading font-semibold">{currentRelic.name}</h3>
                    </div>
                    <Badge className={getRarityColor(currentRelic.rarity)}>
                      {currentRelic.rarity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rank {currentRelic.rank} • {currentRelic.type}
                    {currentRelic.attunement && ' • Requires Attunement'}
                  </div>
                  {currentRelic.description && (
                    <p className="text-sm text-muted-foreground">{currentRelic.description}</p>
                  )}
                  {currentRelic.properties.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="text-xs font-heading font-semibold">Properties:</div>
                      {currentRelic.properties.map((prop) => (
                        <div key={prop.id} className="text-xs">
                          <Badge variant="outline" className="text-xs mr-2">{prop.type}</Badge>
                          <span className="font-semibold">{prop.name}:</span>{' '}
                          <span className="text-muted-foreground">{prop.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Relic preview will appear here
                </p>
              )}
            </SystemWindow>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={saveRelic} className="w-full btn-umbral" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Relic
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RelicWorkshop;




