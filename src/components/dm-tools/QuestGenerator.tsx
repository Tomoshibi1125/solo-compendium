import { useState } from 'react';
import { Wand2, Loader2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from '@/components/AIContentGeneratorClass';

const QUEST_TYPES = [
  'Main Quest',
  'Side Quest',
  'Personal Quest',
  'Faction Quest',
  'Exploration Quest',
  'Combat Quest',
  'Mystery Quest',
  'Social Quest',
];

const DIFFICULTY_LEVELS = [
  'Easy',
  'Medium',
  'Hard',
  'Very Hard',
  'Legendary',
];

const QUEST_THEMES = [
  'Fantasy',
  'Mystery',
  'Horror',
  'Adventure',
  'Intrigue',
  'Survival',
  'Exploration',
  'Combat',
];

export function QuestGenerator() {
  const [questType, setQuestType] = useState('Main Quest');
  const [difficulty, setDifficulty] = useState('Medium');
  const [theme, setTheme] = useState('Fantasy');
  const [setting, setSetting] = useState('');
  const [partyLevel, setPartyLevel] = useState('5');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedQuest, setGeneratedQuest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQuest = async () => {
    if (!setting.trim()) {
      toast({
        title: 'Setting required',
        description: 'Please provide a setting or location for the quest.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a detailed ${questType.toLowerCase()} for a D&D 5e campaign.

Quest Details:
- Type: ${questType}
- Difficulty: ${difficulty}
- Theme: ${theme}
- Setting/Location: ${setting}
- Party Level: ${partyLevel}
${additionalDetails ? `- Additional Details: ${additionalDetails}` : ''}

Please provide a complete quest structure including:
1. Quest Title
2. Quest Hook (how players get involved)
3. Main Objectives
4. Key NPCs with motivations and secrets
5. Encounters and challenges
6. Potential complications
7. Rewards and consequences
8. Plot twists or secrets
9. Resolution options

Make it detailed, engaging, and suitable for level ${partyLevel} players. Include System Ascendant specific elements where appropriate.`;

      const aiGenerator = new AIContentGenerator();
      const result = await aiGenerator.generateContent(prompt, {
        type: 'quest',
        tone: 'epic',
        length: 'long',
        complexity: 'moderate',
      });

      setGeneratedQuest(result.content);
      toast({
        title: 'Quest generated!',
        description: 'Your AI-generated quest is ready.',
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'Could not generate quest. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedQuest) return;
    try {
      await navigator.clipboard.writeText(generatedQuest);
      toast({
        title: 'Copied!',
        description: 'Quest copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const exportQuest = () => {
    if (!generatedQuest) return;
    const blob = new Blob([generatedQuest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-quest.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Exported!',
      description: 'Quest exported as text file.',
    });
  };

  return (
    <SystemWindow title="AI QUEST GENERATOR" className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quest-type">Quest Type</Label>
            <Select value={questType} onValueChange={setQuestType}>
              <SelectTrigger id="quest-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUEST_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUEST_THEMES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="party-level">Party Level</Label>
            <Input
              id="party-level"
              type="number"
              min="1"
              max="20"
              value={partyLevel}
              onChange={(e) => setPartyLevel(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="setting">Setting/Location *</Label>
          <Input
            id="setting"
            placeholder="e.g., Forgotten ruins in the Whispering Forest"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="additional-details">Additional Details (Optional)</Label>
          <Textarea
            id="additional-details"
            placeholder="Any specific elements, plot hooks, or requirements..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={generateQuest}
          disabled={isGenerating || !setting.trim()}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Quest...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Quest
            </>
          )}
        </Button>

        {generatedQuest && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportQuest}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {generatedQuest}
              </pre>
            </div>
          </div>
        )}
      </div>
    </SystemWindow>
  );
}
