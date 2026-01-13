import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, Trash2, Edit, Plus, Search, Filter, Image as ImageIcon, Users, Skull, Crown, Gem, Shield, Sword, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import './TokenLibrary.css';

type TokenType = 'character' | 'monster' | 'npc' | 'prop' | 'effect' | 'custom';
type TokenCategory = 'hunter' | 'monster' | 'boss' | 'npc' | 'treasure' | 'trap' | 'effect' | 'other';

interface Token {
  id: string;
  name: string;
  type: TokenType;
  category: TokenCategory;
  imageUrl?: string;
  emoji?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  color?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
}

const DEFAULT_TOKENS: Token[] = [
  // Hunters
  { id: 'hunter-1', name: 'Hunter (E-Rank)', type: 'character', category: 'hunter', emoji: '⚔️', size: 'medium', tags: ['hunter', 'e-rank'], createdAt: new Date().toISOString() },
  { id: 'hunter-2', name: 'Hunter (D-Rank)', type: 'character', category: 'hunter', emoji: '🗡️', size: 'medium', tags: ['hunter', 'd-rank'], createdAt: new Date().toISOString() },
  { id: 'hunter-3', name: 'Hunter (C-Rank)', type: 'character', category: 'hunter', emoji: '⚡', size: 'medium', tags: ['hunter', 'c-rank'], createdAt: new Date().toISOString() },
  { id: 'hunter-4', name: 'Hunter (B-Rank)', type: 'character', category: 'hunter', emoji: '🔥', size: 'medium', tags: ['hunter', 'b-rank'], createdAt: new Date().toISOString() },
  { id: 'hunter-5', name: 'Hunter (A-Rank)', type: 'character', category: 'hunter', emoji: '💎', size: 'medium', tags: ['hunter', 'a-rank'], createdAt: new Date().toISOString() },
  { id: 'hunter-6', name: 'Hunter (S-Rank)', type: 'character', category: 'hunter', emoji: '👑', size: 'large', tags: ['hunter', 's-rank'], createdAt: new Date().toISOString() },
  
  // Monsters
  { id: 'monster-1', name: 'Monster (E-Rank)', type: 'monster', category: 'monster', emoji: '👹', size: 'small', tags: ['monster', 'e-rank'], createdAt: new Date().toISOString() },
  { id: 'monster-2', name: 'Monster (D-Rank)', type: 'monster', category: 'monster', emoji: '👺', size: 'small', tags: ['monster', 'd-rank'], createdAt: new Date().toISOString() },
  { id: 'monster-3', name: 'Monster (C-Rank)', type: 'monster', category: 'monster', emoji: '🐉', size: 'medium', tags: ['monster', 'c-rank'], createdAt: new Date().toISOString() },
  { id: 'monster-4', name: 'Monster (B-Rank)', type: 'monster', category: 'monster', emoji: '🦑', size: 'medium', tags: ['monster', 'b-rank'], createdAt: new Date().toISOString() },
  { id: 'monster-5', name: 'Monster (A-Rank)', type: 'monster', category: 'monster', emoji: '👾', size: 'large', tags: ['monster', 'a-rank'], createdAt: new Date().toISOString() },
  { id: 'monster-6', name: 'Monster (S-Rank)', type: 'monster', category: 'monster', emoji: '🔥', size: 'huge', tags: ['monster', 's-rank'], createdAt: new Date().toISOString() },
  
  // Bosses
  { id: 'boss-1', name: 'Boss (E-Rank)', type: 'monster', category: 'boss', emoji: '👑', size: 'large', color: '#ef4444', tags: ['boss', 'e-rank'], createdAt: new Date().toISOString() },
  { id: 'boss-2', name: 'Boss (D-Rank)', type: 'monster', category: 'boss', emoji: '👑', size: 'large', color: '#f97316', tags: ['boss', 'd-rank'], createdAt: new Date().toISOString() },
  { id: 'boss-3', name: 'Boss (C-Rank)', type: 'monster', category: 'boss', emoji: '👑', size: 'large', color: '#eab308', tags: ['boss', 'c-rank'], createdAt: new Date().toISOString() },
  { id: 'boss-4', name: 'Boss (B-Rank)', type: 'monster', category: 'boss', emoji: '👑', size: 'huge', color: '#3b82f6', tags: ['boss', 'b-rank'], createdAt: new Date().toISOString() },
  { id: 'boss-5', name: 'Boss (A-Rank)', type: 'monster', category: 'boss', emoji: '👑', size: 'huge', color: '#8b5cf6', tags: ['boss', 'a-rank'], createdAt: new Date().toISOString() },
  { id: 'boss-6', name: 'Boss (S-Rank)', type: 'monster', category: 'boss', emoji: '💀', size: 'huge', color: '#ec4899', tags: ['boss', 's-rank'], createdAt: new Date().toISOString() },
  
  // NPCs
  { id: 'npc-1', name: 'NPC - Hunter', type: 'npc', category: 'npc', emoji: '🧑', size: 'medium', tags: ['npc', 'hunter'], createdAt: new Date().toISOString() },
  { id: 'npc-2', name: 'NPC - Merchant', type: 'npc', category: 'npc', emoji: '🛒', size: 'medium', tags: ['npc', 'merchant'], createdAt: new Date().toISOString() },
  { id: 'npc-3', name: 'NPC - Guild Master', type: 'npc', category: 'npc', emoji: '👔', size: 'medium', tags: ['npc', 'guild'], createdAt: new Date().toISOString() },
  { id: 'npc-4', name: 'NPC - Civilian', type: 'npc', category: 'npc', emoji: '🧍', size: 'medium', tags: ['npc', 'civilian'], createdAt: new Date().toISOString() },
  
  // Props & Effects
  { id: 'treasure-1', name: 'Treasure Chest', type: 'prop', category: 'treasure', emoji: '📦', size: 'small', tags: ['treasure', 'chest'], createdAt: new Date().toISOString() },
  { id: 'treasure-2', name: 'Relic', type: 'prop', category: 'treasure', emoji: '💎', size: 'small', tags: ['treasure', 'relic'], createdAt: new Date().toISOString() },
  { id: 'trap-1', name: 'Trap', type: 'prop', category: 'trap', emoji: '⚠️', size: 'small', color: '#ef4444', tags: ['trap'], createdAt: new Date().toISOString() },
  { id: 'effect-1', name: 'Fire Effect', type: 'effect', category: 'effect', emoji: '🔥', size: 'medium', tags: ['effect', 'fire'], createdAt: new Date().toISOString() },
  { id: 'effect-2', name: 'Shadow Effect', type: 'effect', category: 'effect', emoji: '🌑', size: 'medium', tags: ['effect', 'shadow'], createdAt: new Date().toISOString() },
  { id: 'effect-3', name: 'Mana Effect', type: 'effect', category: 'effect', emoji: '✨', size: 'medium', tags: ['effect', 'mana'], createdAt: new Date().toISOString() },
];

import type { LucideIcon } from 'lucide-react';

const TOKEN_CATEGORIES: { value: TokenCategory; label: string; icon: LucideIcon; color: string }[] = [
  { value: 'hunter', label: 'Hunters', icon: Sword, color: 'text-blue-400' },
  { value: 'monster', label: 'Monsters', icon: Skull, color: 'text-red-400' },
  { value: 'boss', label: 'Bosses', icon: Crown, color: 'text-purple-400' },
  { value: 'npc', label: 'NPCs', icon: Users, color: 'text-green-400' },
  { value: 'treasure', label: 'Treasure', icon: Gem, color: 'text-yellow-400' },
  { value: 'trap', label: 'Traps', icon: Shield, color: 'text-orange-400' },
  { value: 'effect', label: 'Effects', icon: ImageIcon, color: 'text-cyan-400' },
  { value: 'other', label: 'Other', icon: ImageIcon, color: 'text-gray-400' },
];

const SIZE_VALUES = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const TokenLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory | 'all'>('all');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [newToken, setNewToken] = useState<Partial<Token>>({
    name: '',
    type: 'custom',
    category: 'other',
    size: 'medium',
    tags: [],
  });

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = () => {
    const saved = localStorage.getItem('vtt-tokens');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTokens(parsed);
      } catch (e) {
        // Invalid data, use defaults
        setTokens(DEFAULT_TOKENS);
      }
    } else {
      setTokens(DEFAULT_TOKENS);
    }
  };

  const saveTokens = (updatedTokens: Token[]) => {
    setTokens(updatedTokens);
    localStorage.setItem('vtt-tokens', JSON.stringify(updatedTokens));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Compress image for preview
    try {
      const { compressImage } = await import('@/lib/imageOptimization');
      const compressedBlob = await compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
        format: 'webp',
      });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(compressedBlob);
    } catch (error) {
      // Fallback to original file if compression fails
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress image before uploading
      const { compressImage } = await import('@/lib/imageOptimization');
      const compressedBlob = await compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
        format: 'webp',
      });

      // Generate unique filename with .webp extension
      const fileName = `token-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `tokens/${fileName}`;

      // Upload compressed image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('custom-tokens')
        .upload(filePath, compressedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('custom-tokens')
        .getPublicUrl(filePath);

      // Update newToken with image URL
      setNewToken({ ...newToken, imageUrl: publicUrl });

      toast({
        title: 'Image uploaded',
        description: 'Token image has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNewToken({ ...newToken, imageUrl: undefined });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleCreateToken = () => {
    if (!newToken.name) {
      toast({
        title: 'Error',
        description: 'Please enter a token name.',
        variant: 'destructive',
      });
      return;
    }

    const token: Token = {
      id: `token-${Date.now()}`,
      name: newToken.name,
      type: newToken.type || 'custom',
      category: newToken.category || 'other',
      size: newToken.size || 'medium',
      emoji: newToken.emoji,
      color: newToken.color,
      imageUrl: newToken.imageUrl,
      tags: newToken.tags || [],
      notes: newToken.notes,
      createdAt: new Date().toISOString(),
    };

    saveTokens([...tokens, token]);
    setIsCreating(false);
    setImagePreview(null);
    setNewToken({
      name: '',
      type: 'custom',
      category: 'other',
      size: 'medium',
      tags: [],
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    toast({
      title: 'Created!',
      description: 'Token created successfully.',
    });
  };

  const handleDeleteToken = (id: string) => {
    const updated = tokens.filter(t => t.id !== id);
    saveTokens(updated);
    toast({
      title: 'Deleted!',
      description: 'Token deleted.',
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vtt-tokens-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'Token library exported.',
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          saveTokens(imported);
          toast({
            title: 'Imported!',
            description: `${imported.length} tokens imported.`,
          });
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Invalid file format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = !searchQuery || 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: TokenCategory) => {
    const cat = TOKEN_CATEGORIES.find(c => c.value === category);
    return cat?.icon || ImageIcon;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            TOKEN LIBRARY
          </h1>
          <p className="text-muted-foreground font-heading">
            Manage tokens and assets for your VTT sessions. Create custom tokens, organize by category, and export/import libraries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SystemWindow title="SEARCH & FILTER">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Tokens</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="space-y-1 mt-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        'w-full text-left p-2 rounded border text-sm transition-all',
                        selectedCategory === 'all'
                          ? 'bg-primary/20 border-primary/50'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      All Tokens
                    </button>
                    {TOKEN_CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.value}
                          onClick={() => setSelectedCategory(category.value)}
                          className={cn(
                            'w-full text-left p-2 rounded border text-sm transition-all flex items-center gap-2',
                            selectedCategory === category.value
                              ? 'bg-primary/20 border-primary/50'
                              : 'border-border hover:bg-muted/50'
                          )}
                        >
                          <Icon className={cn('w-4 h-4', category.color)} />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="ACTIONS">
              <div className="space-y-2">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Library
                </Button>
                <label className="w-full">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Library
                    </span>
                  </Button>
                </label>
              </div>
            </SystemWindow>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {isCreating ? (
              <SystemWindow title="CREATE TOKEN">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token-name">Token Name</Label>
                    <Input
                      id="token-name"
                      value={newToken.name || ''}
                      onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                      placeholder="Token name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="token-type">Type</Label>
                      <Select value={newToken.type} onValueChange={(value) => setNewToken({ ...newToken, type: value as TokenType })}>
                        <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="character">Character</SelectItem>
                          <SelectItem value="monster">Monster</SelectItem>
                          <SelectItem value="npc">NPC</SelectItem>
                          <SelectItem value="prop">Prop</SelectItem>
                          <SelectItem value="effect">Effect</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="token-category">Category</Label>
                      <Select value={newToken.category} onValueChange={(value) => setNewToken({ ...newToken, category: value as TokenCategory })}>
                        <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {TOKEN_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="token-size">Size</Label>
                      <Select value={newToken.size} onValueChange={(value) => setNewToken({ ...newToken, size: value as Token['size'] })}>
                        <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (32px)</SelectItem>
                          <SelectItem value="medium">Medium (48px)</SelectItem>
                          <SelectItem value="large">Large (64px)</SelectItem>
                          <SelectItem value="huge">Huge (96px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="token-emoji">Emoji/Icon</Label>
                      <Input
                        id="token-emoji"
                        value={newToken.emoji || ''}
                        onChange={(e) => setNewToken({ ...newToken, emoji: e.target.value })}
                        placeholder="🎲"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Token Image</Label>
                    <div className="space-y-2 mt-2">
                      {imagePreview || newToken.imageUrl ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || newToken.imageUrl}
                            alt="Token preview"
                            className="w-24 h-24 rounded-lg object-cover border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={handleRemoveImage}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg border border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          aria-label="Upload token image"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => imageInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Select Image
                        </Button>
                        {imagePreview && !newToken.imageUrl && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleUploadImage}
                            disabled={uploading}
                            className="gap-2"
                          >
                            {uploading ? 'Uploading...' : 'Upload'}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, or WebP. Max 5MB. Image will override emoji if set.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="token-color">Color (hex)</Label>
                    <Input
                      id="token-color"
                      type="color"
                      value={newToken.color || '#3b82f6'}
                      onChange={(e) => setNewToken({ ...newToken, color: e.target.value })}
                      className="h-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateToken} className="flex-1">
                      Create Token
                    </Button>
                    <Button
                      onClick={() => {
                        setIsCreating(false);
                        setNewToken({
                          name: '',
                          type: 'custom',
                          category: 'other',
                          size: 'medium',
                          tags: [],
                        });
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </SystemWindow>
            ) : (
              <>
                <SystemWindow title={`TOKENS (${filteredTokens.length})`}>
                  {filteredTokens.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground font-heading">
                        No tokens found. {searchQuery ? 'Try a different search.' : 'Create your first token!'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredTokens.map((token) => {
                        const CategoryIcon = getCategoryIcon(token.category);
                        const size = SIZE_VALUES[token.size];
                        
                        return (
                          <div
                            key={token.id}
                            className={cn(
                              'p-4 rounded-lg border border-border bg-background/50 hover:bg-muted/50 transition-all cursor-pointer group',
                              selectedToken?.id === token.id && 'ring-2 ring-primary'
                            )}
                            onClick={() => setSelectedToken(token)}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div
                                className={cn(
                                  'token-display',
                                  `token-display-${token.size}`,
                                  token.color ? `border-[${token.color}]` : 'border-border'
                                )}
                                style={{
                                  backgroundColor: token.color ? `${token.color}20` : undefined,
                                }}
                              >
                                {token.imageUrl ? (
                                  <img
                                    src={token.imageUrl}
                                    alt={token.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  token.emoji || '🎲'
                                )}
                              </div>
                              <div className="text-center w-full">
                                <div className="font-heading font-semibold text-sm mb-1 truncate">
                                  {token.name}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                  <CategoryIcon className="w-3 h-3" />
                                  <Badge variant="outline" className="text-xs">
                                    {token.size}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteToken(token.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SystemWindow>

                {selectedToken && (
                  <SystemWindow title="TOKEN DETAILS">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'token-detail-display',
                              `token-detail-display-${selectedToken.size}`,
                              selectedToken.color ? `border-[${selectedToken.color}]` : 'border-border'
                            )}
                            style={{
                              backgroundColor: selectedToken.color ? `${selectedToken.color}20` : undefined,
                            }}
                          >
                            {selectedToken.imageUrl ? (
                              <img
                                src={selectedToken.imageUrl}
                                alt={selectedToken.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              selectedToken.emoji || '🎲'
                            )}
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-xl">{selectedToken.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{selectedToken.type}</Badge>
                              <Badge variant="outline">{selectedToken.category}</Badge>
                              <Badge variant="outline">{selectedToken.size}</Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedToken(null)}
                        >
                          Close
                        </Button>
                      </div>

                      {selectedToken.tags.length > 0 && (
                        <div>
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedToken.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedToken.notes && (
                        <div>
                          <Label>Notes</Label>
                          <p className="text-sm text-muted-foreground mt-1">{selectedToken.notes}</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(selectedToken.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </SystemWindow>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TokenLibrary;

