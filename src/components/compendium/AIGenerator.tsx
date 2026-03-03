import React, { useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function AIGenerator() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isGeneratorEnabled, setIsGeneratorEnabled] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            // Placeholder for actual Gemini generation logic targeting compendium JSON structures
            await new Promise(resolve => setTimeout(resolve, 2000));
            setResult(`{ "name": "\${prompt} Boss", "hit_points": 150, "armor_class": 16 }`);
            toast({
                title: "Generation Complete",
                description: "Review the generated data below.",
            });
        } catch (error: any) {
            toast({
                title: "Generation Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                    <Label htmlFor="enable-ai-gen" className="text-base font-semibold flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-purple-500" />
                        AI Protocol Warden (Content Generation)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Optional tool to instantly generate monsters, items, or locations using Gemini.
                    </p>
                </div>
                <Switch
                    id="enable-ai-gen"
                    checked={isGeneratorEnabled}
                    onCheckedChange={setIsGeneratorEnabled}
                />
            </div>

            {isGeneratorEnabled && (
                <SystemWindow title="AI PROTOCOL WARDEN" className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>What would you like to create?</Label>
                        <Textarea
                            placeholder="e.g., 'A CR 4 fire elemental boss that splits into smaller embers when damaged'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Generate Content
                    </Button>

                    {result && (
                        <div className="mt-4 space-y-2">
                            <Label>Generated Output (JSON)</Label>
                            <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-[300px]">
                                {result}
                            </pre>
                            <Button className="w-full mt-2" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Compendium
                            </Button>
                        </div>
                    )}
                </SystemWindow>
            )}
        </div>
    );
}
