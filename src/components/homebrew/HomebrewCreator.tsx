import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Sword, 
  BookOpen, 
  Gem, 
  Save, 
  Eye, 
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Sparkles,
  Target,
  Shield,
  Zap,
  Loader2,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIEnhance } from '@/hooks/useAIEnhance';
import { cn } from '@/lib/utils';

interface HomebrewContent {
  id: string;
  name: string;
  type: 'job' | 'path' | 'relic' | 'spell' | 'item';
  description: string;
  data: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const HomebrewCreator = () => {
  const [currentForm, setCurrentForm] = useState<any>({});
  const [activeTab, setActiveTab] = useState('job');
  const [isPreview, setIsPreview] = useState(false);
  const [savedContent, setSavedContent] = useState<HomebrewContent[]>([]);
  const { toast } = useToast();
  const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

  const handleAIEnhance = async () => {
    if (!currentForm.name && !currentForm.description) {
      toast({ title: 'Nothing to enhance', description: 'Add a name or description first.', variant: 'destructive' });
      return;
    }
    const seed = `Enhance this homebrew ${activeTab} for a System Ascendant TTRPG campaign.

CONTENT:
- Name: ${currentForm.name || 'Unnamed'}
- Type: ${activeTab}
- Description: ${currentForm.description || 'No description yet'}
- Additional Data: ${JSON.stringify(currentForm, null, 2)}

Provide a fully enhanced version with:
1. Rich lore and flavor text fitting the System Ascendant universe
2. Balanced mechanical details (stats, abilities, effects)
3. Prerequisites and requirements if applicable
4. Integration hooks with existing SA systems (Regents, Gates, Runes)`;
    const result = await enhance('homebrew-' + activeTab, seed);
    if (result) {
      toast({ title: 'AI Enhancement Complete', description: 'Review the enhanced content below.' });
    }
  };

  const handleExport = () => {
    if (savedContent.length === 0) {
      toast({ title: 'Nothing to export', description: 'Save some content first.' });
      return;
    }
    const blob = new Blob([JSON.stringify(savedContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sa-homebrew-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: `${savedContent.length} items exported.` });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text) as HomebrewContent[];
        if (Array.isArray(imported)) {
          setSavedContent(prev => [...prev, ...imported]);
          toast({ title: 'Imported!', description: `${imported.length} items imported.` });
        }
      } catch {
        toast({ title: 'Import failed', description: 'Invalid JSON file.', variant: 'destructive' });
      }
    };
    input.click();
  };

  // Update current form when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'job':
        setCurrentForm(jobForm);
        break;
      case 'path':
        setCurrentForm(pathForm);
        break;
      case 'relic':
        setCurrentForm(relicForm);
        break;
    }
  }, [activeTab]);

  // Update form state when individual forms change
  const updateCurrentForm = (updates: any) => {
    setCurrentForm(updates);
  };

  // Form states for different content types
  const [jobForm, setJobForm] = useState<{
    name: string;
    description: string;
    hitDie: string;
    primaryAbility: string;
    features: string;
    prerequisites: string;
  }>({
    name: '',
    description: '',
    hitDie: 'd8',
    primaryAbility: 'STR',
    features: '',
    prerequisites: ''
  });

  const [pathForm, setPathForm] = useState<{
    name: string;
    description: string;
    requirements: string;
    features: string;
    levels: string;
  }>({
    name: '',
    description: '',
    requirements: '',
    features: '',
    levels: ''
  });

  const [relicForm, setRelicForm] = useState<{
    name: string;
    description: string;
    rarity: string;
    properties: string;
    cost: string;
    attunement: boolean;
  }>({
    name: '',
    description: '',
    rarity: 'uncommon',
    properties: '',
    cost: '',
    attunement: false
  });

  const contentTemplates = {
    job: {
      title: 'Create Custom Job',
      description: 'Design a unique character class with special abilities and progression',
      icon: Sword,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      form: jobForm,
      setForm: setJobForm
    },
    path: {
      title: 'Create Custom Path',
      description: 'Create a specialized path or subclass with unique features',
      icon: BookOpen,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
      form: pathForm,
      setForm: setPathForm
    },
    relic: {
      title: 'Create Custom Relic',
      description: 'Design powerful magical items with unique properties',
      icon: Gem,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      form: relicForm,
      setForm: setRelicForm
    }
  } as const;

  const handleSave = () => {
    const newContent: HomebrewContent = {
      id: Date.now().toString(),
      name: currentForm.name || `New ${activeTab}`,
      type: activeTab as HomebrewContent['type'],
      description: currentForm.description || '',
      data: activeTab === 'job' ? jobForm : activeTab === 'path' ? pathForm : relicForm,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSavedContent([...savedContent, newContent]);
    toast({
      title: 'Content Created',
      description: `${newContent.name} has been saved to your homebrew collection.`,
    });
  };

  const handleDuplicate = (content: HomebrewContent) => {
    const duplicated = {
      ...content,
      id: Date.now().toString(),
      name: `${content.name} (Copy)`,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedContent([...savedContent, duplicated]);
    toast({
      title: 'Content Duplicated',
      description: `${content.name} has been duplicated.`,
    });
  };

  const handleDelete = (id: string) => {
    setSavedContent(savedContent.filter(c => c.id !== id));
    toast({
      title: 'Content Deleted',
      description: 'The homebrew content has been removed.',
    });
  };

  const renderForm = () => {
    const currentTemplate = contentTemplates[activeTab as keyof typeof contentTemplates];
    const Icon = currentTemplate.icon;

    if (isPreview) {
      return (
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Mode
            </CardTitle>
            <CardDescription>
              This is how your content will appear to players
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-bold text-lg">{currentTemplate.form.name || 'Untitled Content'}</h3>
              <p className="text-muted-foreground mt-2">{currentTemplate.form.description || 'No description provided'}</p>
              <Badge variant="outline" className="mt-3">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {currentTemplate.title}
          </CardTitle>
          <CardDescription>
            {currentTemplate.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                data-testid="homebrew-name"
                placeholder="Enter content name..."
                value={currentForm.name}
                onChange={(e) => updateCurrentForm({ name: e.target.value })}
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                data-testid="homebrew-description"
                placeholder="Describe your content..."
                value={currentForm.description}
                onChange={(e) => updateCurrentForm({ description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {activeTab === 'job' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hitDie">Hit Die</Label>
                <Select value={jobForm.hitDie} onValueChange={(value) => setJobForm({...jobForm, hitDie: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d6">d6</SelectItem>
                    <SelectItem value="d8">d8</SelectItem>
                    <SelectItem value="d10">d10</SelectItem>
                    <SelectItem value="d12">d12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryAbility">Primary Ability</Label>
                <Select value={jobForm.primaryAbility} onValueChange={(value) => setJobForm({...jobForm, primaryAbility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STR">Strength</SelectItem>
                    <SelectItem value="DEX">Dexterity</SelectItem>
                    <SelectItem value="CON">Constitution</SelectItem>
                    <SelectItem value="INT">Intelligence</SelectItem>
                    <SelectItem value="WIS">Wisdom</SelectItem>
                    <SelectItem value="CHA">Charisma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeTab === 'relic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={relicForm.rarity} onValueChange={(value) => setRelicForm({...relicForm, rarity: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="very-rare">Very Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (GP)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0"
                  value={relicForm.cost}
                  onChange={(e) => setRelicForm({...relicForm, cost: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-4">
            <Label htmlFor="features">Advanced Options</Label>
            <Textarea
              id="features"
              placeholder={activeTab === 'job' ? 'Features (one per line)...' : 
                       activeTab === 'path' ? 'Path requirements and features...' :
                       'Magical properties and effects...'}
              value={currentForm.features}
              onChange={(e) => updateCurrentForm({ features: e.target.value })}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Content
            </Button>
            <Button onClick={handleAIEnhance} disabled={isEnhancing} className="flex items-center gap-2 btn-umbral">
              {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
            </Button>
            <Button variant="outline" onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={handleImport} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
          {enhancedText && (
            <div className="mt-4 border-t border-primary/30 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-display text-primary">AI-ENHANCED CONTENT</span>
                <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs" onClick={clearEnhanced}>Dismiss</Button>
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                {enhancedText}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Homebrew Creator Studio
        </h1>
        <p className="text-muted-foreground text-lg">
          Design custom content for your campaigns. Create unique jobs, paths, and relics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Panel */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="job" className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                Job
              </TabsTrigger>
              <TabsTrigger value="path" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Path
              </TabsTrigger>
              <TabsTrigger value="relic" className="flex items-center gap-2">
                <Gem className="w-4 h-4" />
                Relic
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="job" className="mt-6">
              {renderForm()}
            </TabsContent>
            <TabsContent value="path" className="mt-6">
              {renderForm()}
            </TabsContent>
            <TabsContent value="relic" className="mt-6">
              {renderForm()}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create from Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Existing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Content Validator
              </Button>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              {savedContent.length === 0 ? (
                <p className="text-muted-foreground text-sm">No content created yet</p>
              ) : (
                <div className="space-y-3">
                  {savedContent.slice(-5).map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{content.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleDuplicate(content)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(content.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Creator Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Zap className="w-4 h-4" />
                <AlertDescription>
                  <strong>Balance is key:</strong> Consider how your content affects game balance when creating powerful items or abilities.
                </AlertDescription>
              </Alert>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Use clear, descriptive names</p>
                <p>• Provide detailed descriptions</p>
                <p>• Test content before sharing</p>
                <p>• Follow existing formatting patterns</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomebrewCreator;
