import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Sparkles, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const WORLD_EVENTS = [
  'Gate Surge: Multiple Gates appear simultaneously in an area',
  'Hunter Association Alert: High-priority mission issued',
  'Shadow Monarch Fragment Detected: Powerful energy signature located',
  'Mana Storm: Abnormal mana concentration causes strange phenomena',
  'Guild Conflict: Two major guilds have a territorial dispute',
  'Mysterious Disappearances: Hunters go missing in a specific area',
  'New Gate Rank Discovered: Previously unknown Gate rank appears',
  'System Anomaly: The System behaves unexpectedly',
  'Monarch Activity: Evidence of Monarch presence detected',
  'Relic Discovery: Ancient relic found, causing a rush',
  'Gate Breach: A Gate fails to close properly',
  'Hunter Awakening Event: Multiple new Hunters awaken at once',
  'Corporate Interest: Large corporation takes interest in Gate activity',
  'Media Attention: Gate incident draws public attention',
  'Political Movement: Government interference with Hunter operations',
  'Ancient Gate Opens: Long-dormant Gate activates',
  'Shadow Corruption Spread: Shadow energy spreads beyond Gates',
  'Hunter Association Scandal: Internal conflict revealed',
  'Gate Ecology Change: Monsters adapt or mutate unexpectedly',
  'Divine Intervention: Supreme Deity\'s influence becomes visible',
];

const NPC_ENCOUNTERS = [
  'Rival Hunter Team: Encounter competitive hunters',
  'Information Broker: NPC offers valuable information',
  'Wounded Hunter: Needs assistance or has a warning',
  'Mysterious Stranger: NPC with unclear motives',
  'Gate Survivor: Civilian trapped in Gate needs help',
  'Hunter Association Agent: Official with a mission',
  'Relic Merchant: Sells or trades relics',
  'Gate Researcher: Scientist studying Gates',
  'Former S-Rank: Retired hunter with stories and advice',
  'Shadow Soldier: Encounter with a shadow creature',
  'Monarch Cultist: Dangerous individual with Monarch ties',
  'Gate Master: Experienced DM/Gate Master offers guidance',
  'Corporate Representative: Business person with an offer',
  'Media Reporter: Journalist investigating Gates',
  'Child Hunter: Young awakened individual in danger',
];

const COMPLICATIONS = [
  'Weather turns severe',
  'Communication devices malfunction',
  'Unexpected monster reinforcements',
  'Time distortion affects area',
  'Allies turn hostile',
  'Environmental hazard activates',
  'Gate structure changes',
  'Shadow corruption spreads',
  'Third party intervenes',
  'Information is misleading or false',
];

interface GeneratedEvent {
  type: 'world' | 'encounter' | 'complication';
  title: string;
  description: string;
  impact: string;
}

function generateEvent(type: 'world' | 'encounter' | 'complication'): GeneratedEvent {
  let title = '';
  let description = '';
  let impact = '';

  if (type === 'world') {
    const event = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
    title = 'World Event';
    description = event;
    impact = 'This event affects the larger world and may create new opportunities or complications for the party.';
  } else if (type === 'encounter') {
    const encounter = NPC_ENCOUNTERS[Math.floor(Math.random() * NPC_ENCOUNTERS.length)];
    title = 'NPC Encounter';
    description = encounter;
    impact = 'This encounter can provide roleplay opportunities, information, resources, or complications.';
  } else {
    const complication = COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)];
    title = 'Complication';
    description = complication;
    impact = 'This complication adds difficulty or urgency to the current situation.';
  }

  return { type, title, description, impact };
}

const RandomEventGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventType, setEventType] = useState<'world' | 'encounter' | 'complication'>('world');
  const [event, setEvent] = useState<GeneratedEvent | null>(null);

  const handleGenerate = () => {
    const result = generateEvent(eventType);
    setEvent(result);
  };

  const handleCopy = () => {
    if (!event) return;
    const text = `${event.title}: ${event.description}\n\nImpact: ${event.impact}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Event copied to clipboard.',
    });
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'world':
        return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'encounter':
        return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'complication':
        return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            RANDOM EVENT GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate random events, NPC encounters, and complications to keep sessions dynamic and unpredictable.
          </p>
        </div>

        <SystemWindow title="GENERATE EVENT" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={eventType === 'world' ? 'default' : 'outline'}
                onClick={() => setEventType('world')}
                className="flex-1"
              >
                World Event
              </Button>
              <Button
                variant={eventType === 'encounter' ? 'default' : 'outline'}
                onClick={() => setEventType('encounter')}
                className="flex-1"
              >
                NPC Encounter
              </Button>
              <Button
                variant={eventType === 'complication' ? 'default' : 'outline'}
                onClick={() => setEventType('complication')}
                className="flex-1"
              >
                Complication
              </Button>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full btn-shadow-monarch"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {eventType === 'world' ? 'World Event' : eventType === 'encounter' ? 'NPC Encounter' : 'Complication'}
            </Button>
          </div>
        </SystemWindow>

        {event && (
          <SystemWindow title={event.title} className="mb-6">
            <div className="space-y-4">
              <Badge className={getEventColor(event.type)}>
                {event.type.toUpperCase()}
              </Badge>

              <div className="pt-2">
                <p className="text-lg font-heading mb-4">{event.description}</p>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold mb-1">Impact</h4>
                      <p className="text-sm text-muted-foreground">{event.impact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Event
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </SystemWindow>
        )}

        <SystemWindow title="EVENT TYPES" variant="quest">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-purple-400/30 bg-purple-400/10">
                <h4 className="font-heading font-semibold text-purple-400 mb-2">World Events</h4>
                <p className="text-muted-foreground text-xs">
                  Large-scale events that affect the world or region. Use these for major plot developments.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
                <h4 className="font-heading font-semibold text-blue-400 mb-2">NPC Encounters</h4>
                <p className="text-muted-foreground text-xs">
                  Random encounters with NPCs that can provide opportunities, information, or complications.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-orange-400/30 bg-orange-400/10">
                <h4 className="font-heading font-semibold text-orange-400 mb-2">Complications</h4>
                <p className="text-muted-foreground text-xs">
                  Unexpected complications that add difficulty or urgency to current situations.
                </p>
              </div>
            </div>
          </div>
        </SystemWindow>
      </div>
    </Layout>
  );
};

export default RandomEventGenerator;

