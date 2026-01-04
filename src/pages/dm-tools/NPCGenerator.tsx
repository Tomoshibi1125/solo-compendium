import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const HUNTER_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];
const NPC_ROLES = [
  'Hunter Association Official', 'Gate Researcher', 'Relic Merchant', 'Information Broker',
  'Former S-Rank Hunter', 'Monarch Cultist', 'System Analyst', 'Gate Survivor',
  'Monster Hunter', 'Core Collector', 'Shadow Network Agent', 'Independent Contractor'
];
const PERSONALITIES = [
  'Cautious and methodical', 'Bold and reckless', 'Mysterious and secretive',
  'Friendly and helpful', 'Paranoid and suspicious', 'Confident and arrogant',
  'Humble and wise', 'Greedy and opportunistic', 'Loyal and protective',
  'Neutral and detached', 'Passionate and driven', 'Cynical and jaded'
];
const MOTIVATIONS = [
  'Seeking power through Gates', 'Protecting loved ones', 'Revenge against monsters',
  'Researching Gate phenomena', 'Building a hunter organization', 'Seeking the Shadow Monarch',
  'Escaping past trauma', 'Proving their worth', 'Accumulating wealth',
  'Uncovering secrets', 'Protecting humanity', 'Achieving immortality'
];
const SECRETS = [
  'Former S-Rank hunter (lost power)', 'Working for a Monarch', 'Has a cursed relic',
  'Knows about the reset', 'Is actually a monster', 'Has System favor debt',
  'Betrayed their hunter team', 'Seeking forbidden knowledge', 'Has a hidden Gate',
  'Is being hunted', 'Knows the Supreme Deity personally', 'Has a duplicate identity'
];
const QUIRKS = [
  'Always checks for traps', 'Collects monster cores obsessively', 'Speaks in riddles',
  'Has a telltale scar', 'Never removes their mask', 'Quotes the System',
  'Tracks Gate statistics', 'Has a pet shadow', 'Wears outdated equipment',
  'Mentions the reset frequently', 'Avoids eye contact', 'Always has a backup plan'
];

interface GeneratedNPC {
  name: string;
  rank: string;
  role: string;
  personality: string;
  motivation: string;
  secret: string;
  quirk: string;
  description: string;
}

const NAMES = [
  'Kim Min-Su', 'Park Ji-Hoon', 'Lee Soo-Jin', 'Choi Hae-Won', 'Jung Tae-Hyun',
  'Yoon Seo-Yeon', 'Kang Min-Jae', 'Han So-Ra', 'Shin Dong-Hyun', 'Oh Yeon-Ju',
  'Baek Ji-Woo', 'Lim Hyun-Seok', 'Song Mi-Rae', 'Kwon Joon-Ho', 'Moon Ji-Ah'
];

function generateNPC(): GeneratedNPC {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const rank = HUNTER_RANKS[Math.floor(Math.random() * HUNTER_RANKS.length)];
  const role = NPC_ROLES[Math.floor(Math.random() * NPC_ROLES.length)];
  const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  const secret = SECRETS[Math.floor(Math.random() * SECRETS.length)];
  const quirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];

  const description = `${name} is a ${rank}-Rank ${role}. They are ${personality} and are motivated by ${motivation.toLowerCase()}. Their secret: ${secret.toLowerCase()}. They have a quirk: ${quirk.toLowerCase()}.`;

  return {
    name,
    rank,
    role,
    personality,
    motivation,
    secret,
    quirk,
    description,
  };
}

const NPCGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [npc, setNpc] = useState<GeneratedNPC | null>(null);

  const handleGenerate = () => {
    const newNPC = generateNPC();
    setNpc(newNPC);
    toast({
      title: 'NPC Generated',
      description: `Generated ${newNPC.name}.`,
    });
  };

  const handleCopy = () => {
    if (!npc) return;
    const text = `NPC: ${npc.name}\nRank: ${npc.rank}\nRole: ${npc.role}\nPersonality: ${npc.personality}\nMotivation: ${npc.motivation}\nSecret: ${npc.secret}\nQuirk: ${npc.quirk}\n\n${npc.description}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'NPC details copied to clipboard.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to System Tools
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            NPC GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate NPCs with personalities, motivations, secrets, and quirks for your Solo Leveling campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SystemWindow title="GENERATOR">
              <Button
                onClick={handleGenerate}
                className="w-full gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                Generate NPC
              </Button>
            </SystemWindow>
          </div>

          <div className="lg:col-span-2">
            {npc ? (
              <SystemWindow title={npc.name.toUpperCase()}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <Badge>{npc.rank}-Rank</Badge>
                    <span className="text-muted-foreground">{npc.role}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-display text-muted-foreground">PERSONALITY</span>
                      <p className="font-heading">{npc.personality}</p>
                    </div>
                    <div>
                      <span className="text-xs font-display text-muted-foreground">MOTIVATION</span>
                      <p className="font-heading">{npc.motivation}</p>
                    </div>
                    <div>
                      <span className="text-xs font-display text-muted-foreground">SECRET</span>
                      <Badge variant="destructive" className="mt-1">{npc.secret}</Badge>
                    </div>
                    <div>
                      <span className="text-xs font-display text-muted-foreground">QUIRK</span>
                      <Badge variant="secondary" className="mt-1">{npc.quirk}</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <span className="text-xs font-display text-muted-foreground">DESCRIPTION</span>
                    <p className="text-sm text-muted-foreground mt-2">{npc.description}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </SystemWindow>
            ) : (
              <SystemWindow title="NO NPC GENERATED">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Click "Generate NPC" to create a random NPC</p>
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NPCGenerator;

