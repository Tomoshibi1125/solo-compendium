import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, KeyRound } from 'lucide-react';
import { aiService } from '@/lib/ai/aiService';
import {
  DEFAULT_AI_USER_SETTINGS,
  loadAIUserSettings,
  saveAIUserSettings,
} from '@/lib/ai/userSettings';
import type { AIUserProvider, AIUserSettings } from '@/lib/ai/userSettings';
import { cn } from '@/lib/utils';

interface AIProviderSettingsProps {
  className?: string;
}

const FREE_PROVIDER_LABEL = 'Pollinations (Free)';
const FREE_PROVIDER_ENDPOINT = 'https://text.pollinations.ai';

export function AIProviderSettings({ className }: AIProviderSettingsProps) {
  const [settings, setSettings] = useState<AIUserSettings>(DEFAULT_AI_USER_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadAIUserSettings());
  }, []);

  const setProvider = (provider: AIUserProvider) => {
    setSettings((prev) => ({ ...prev, provider }));
  };

  const handleSave = () => {
    saveAIUserSettings(settings);
    aiService.applyUserSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleUseFree = () => {
    const next = { ...DEFAULT_AI_USER_SETTINGS, provider: 'free' as const };
    setSettings(next);
    saveAIUserSettings(next);
    aiService.applyUserSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const showCustomWarning = settings.provider === 'custom' && !settings.apiKey.trim();

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Provider Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Free provider: {FREE_PROVIDER_LABEL} ({FREE_PROVIDER_ENDPOINT})
        </div>

        <RadioGroup
          value={settings.provider}
          onValueChange={(value) => setProvider(value as AIUserProvider)}
          className="grid gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="ai-provider-free" value="free" />
            <Label htmlFor="ai-provider-free">Use free provider</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="ai-provider-custom" value="custom" />
            <Label htmlFor="ai-provider-custom">Use my API key</Label>
          </div>
        </RadioGroup>

        {settings.provider === 'custom' && (
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-api-base">API base URL</Label>
              <Input
                id="ai-api-base"
                value={settings.apiBase}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, apiBase: event.target.value }))
                }
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-model">Model</Label>
              <Input
                id="ai-model"
                value={settings.model}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, model: event.target.value }))
                }
                placeholder="gpt-4o-mini"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-api-key" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                API key
              </Label>
              <Input
                id="ai-api-key"
                type="password"
                autoComplete="off"
                value={settings.apiKey}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, apiKey: event.target.value }))
                }
                placeholder="Paste your API key"
              />
              <p className="text-xs text-muted-foreground">
                Stored locally in this browser only.
              </p>
            </div>
          </div>
        )}

        {showCustomWarning && (
          <Alert variant="destructive">
            <AlertDescription>Custom provider selected but no API key is set.</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleSave}>
            Save settings
          </Button>
          <Button type="button" variant="outline" onClick={handleUseFree}>
            Use free provider
          </Button>
          {saved && <span className="text-xs text-emerald-600">Saved.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
