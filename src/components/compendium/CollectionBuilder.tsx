import { useState } from 'react';
import { Plus, X, Share2, Download, Users, Lock, Globe, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

interface CollectionItem {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  level?: number;
  image_url?: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  items: CollectionItem[];
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  shares: number;
  forks: number;
}

interface CollectionBuilderProps {
  collections: Collection[];
  onCreateCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'shares' | 'forks'>) => void;
  onUpdateCollection: (id: string, updates: Partial<Collection>) => void;
  onDeleteCollection: (id: string) => void;
  onShareCollection: (id: string) => string;
  onForkCollection: (id: string) => Collection;
  availableItems: CollectionItem[];
  className?: string;
}

export function CollectionBuilder({
  collections,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onShareCollection,
  onForkCollection,
  availableItems,
  className
}: CollectionBuilderProps) {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [shareLink, setShareLink] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: [] as string[],
    items: [] as CollectionItem[]
  });
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isPublic: false,
      tags: [],
      items: []
    });
    setTagInput('');
    setSearchQuery('');
  };

  const handleCreateCollection = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a collection name.',
        variant: 'destructive',
      });
      return;
    }

    onCreateCollection(formData);
    resetForm();
    setCreateDialogOpen(false);
    toast({
      title: 'Collection Created',
      description: 'Your collection has been created successfully.',
    });
  };

  const handleEditCollection = () => {
    if (!selectedCollection || !formData.name.trim()) return;

    onUpdateCollection(selectedCollection.id, formData);
    setEditDialogOpen(false);
    setSelectedCollection(null);
    resetForm();
    toast({
      title: 'Collection Updated',
      description: 'Your collection has been updated successfully.',
    });
  };

  const handleDeleteCollection = (id: string) => {
    onDeleteCollection(id);
    toast({
      title: 'Collection Deleted',
      description: 'Your collection has been deleted.',
    });
  };

  const handleShareCollection = (collection: Collection) => {
    const link = onShareCollection(collection.id);
    setShareLink(link);
    setSelectedCollection(collection);
    setShareDialogOpen(true);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Link Copied',
        description: 'Share link copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleForkCollection = (collection: Collection) => {
    const forked = onForkCollection(collection.id);
    toast({
      title: 'Collection Forked',
      description: `You have forked "${formatMonarchVernacular(collection.name)}".`,
    });
  };

  const openEditDialog = (collection: Collection) => {
    setSelectedCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
      tags: collection.tags,
      items: collection.items
    });
    setEditDialogOpen(true);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addItem = (item: CollectionItem) => {
    if (formData.items.some(existing => existing.id === item.id)) {
      toast({
        title: 'Already Added',
        description: 'This item is already in the collection.',
        variant: 'destructive',
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const filteredItems = availableItems.filter((item) => {
    const canonicalQuery = normalizeMonarchSearch(searchQuery.toLowerCase());
    return (
      normalizeMonarchSearch(item.name.toLowerCase()).includes(canonicalQuery) ||
      normalizeMonarchSearch(item.type.toLowerCase()).includes(canonicalQuery)
    );
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Collections</h2>
          <p className="text-muted-foreground">Organize and share your favorite compendium items</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{formatMonarchVernacular(collection.name)}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatMonarchVernacular(collection.description)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {collection.isPublic ? (
                    <Globe className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span>{collection.items.length} items</span>
                    <span>{collection.shares} shares</span>
                    <span>{collection.forks} forks</span>
                  </div>
                </div>

                {/* Tags */}
                {collection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {formatMonarchVernacular(tag)}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(collection)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareCollection(collection)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleForkCollection(collection)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCollection(collection.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Organize your favorite compendium items into a collection
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collection Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="collection-name">Name</Label>
                <Input
                  id="collection-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter collection name"
                />
              </div>

              <div>
                <Label htmlFor="collection-description">Description</Label>
                <Textarea
                  id="collection-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your collection"
                  rows={3}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {formatMonarchVernacular(tag)}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked as boolean }))}
                />
                <Label htmlFor="is-public" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Make public
                </Label>
              </div>
            </div>

            {/* Item Selection */}
            <div className="space-y-4">
              <div>
                <Label>Add Items</Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items to add..."
                  className="mt-2"
                />
              </div>

              <ScrollArea className="h-64 border rounded-md p-2">
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer"
                      onClick={() => addItem(item)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">
                          {formatMonarchVernacular(item.type)[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{formatMonarchVernacular(item.name)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatMonarchVernacular(item.type)} {item.rarity && `• ${formatMonarchVernacular(item.rarity)}`}
                          </div>
                        </div>
                      </div>
                      <Plus className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Selected Items */}
              <div>
                <Label>Selected Items ({formData.items.length})</Label>
                <ScrollArea className="h-32 border rounded-md p-2 mt-2">
                  <div className="space-y-1">
                    {formData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-1 border rounded"
                      >
                        <div className="text-sm">{formatMonarchVernacular(item.name)}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update your collection details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked as boolean }))}
                />
                <Label htmlFor="edit-public" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Make public
                </Label>
              </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCollection}>
              Update Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Collection</DialogTitle>
            <DialogDescription>
              Share "{selectedCollection ? formatMonarchVernacular(selectedCollection.name) : ''}" with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Share Link</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyShareLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {selectedCollection?.shares} shares
              </div>
              <div className="flex items-center gap-1">
                <Copy className="w-4 h-4" />
                {selectedCollection?.forks} forks
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
