import { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Download, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Filter, 
  Search,
  Clock,
  Users,
  DollarSign,
  Package,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: 'campaign' | 'character' | 'item' | 'map' | 'module' | 'template';
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  price: {
    type: 'free' | 'paid' | 'donation';
    amount?: number;
    currency?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  downloads: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  fileSize?: number;
  preview?: string;
  content?: string;
  requirements?: string[];
  compatibility: string[];
  license: string;
  featured: boolean;
  verified: boolean;
}

export interface MarketplaceReview {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

export interface MarketplaceStats {
  totalItems: number;
  totalDownloads: number;
  totalRevenue: number;
  topCategories: Array<{
    category: string;
    count: number;
    downloads: number;
  }>;
  trendingItems: MarketplaceItem[];
  featuredItems: MarketplaceItem[];
  recentItems: MarketplaceItem[];
}

export class MarketplaceManager {
  private apiBase: string;
  private apiKey: string;

  constructor(apiBase: string, apiKey: string) {
    this.apiBase = apiBase;
    this.apiKey = apiKey;
  }

  async uploadItem(itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'downloads' | 'views'>, file?: File): Promise<MarketplaceItem> {
    const formData = new FormData();
    
    // Add item data
    Object.entries(itemData).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch(`${this.apiBase}/marketplace/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to upload item:', error);
      throw error;
    }
  }

  async getItems(filters?: {
    type?: MarketplaceItem['type'];
    category?: string;
    tags?: string[];
    priceType?: MarketplaceItem['price']['type'];
    sortBy?: 'created' | 'updated' | 'downloads' | 'rating' | 'trending';
    sortOrder?: 'asc' | 'desc';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: MarketplaceItem[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    try {
      const response = await fetch(`${this.apiBase}/marketplace/items?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get items:', error);
      throw error;
    }
  }

  async getItem(id: string): Promise<MarketplaceItem> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get item:', error);
      throw error;
    }
  }

  async updateItem(id: string, updates: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to update item:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }
    } catch (error) {
      logger.error('Failed to delete item:', error);
      throw error;
    }
  }

  async downloadItem(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download item: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      logger.error('Failed to download item:', error);
      throw error;
    }
  }

  async rateItem(id: string, rating: number, comment?: string): Promise<MarketplaceReview> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error(`Failed to rate item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to rate item:', error);
      throw error;
    }
  }

  async getReviews(itemId: string): Promise<MarketplaceReview[]> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/items/${itemId}/reviews`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get reviews: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get reviews:', error);
      throw error;
    }
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get stats:', error);
      throw error;
    }
  }

  async searchItems(query: string, filters?: any): Promise<MarketplaceItem[]> {
    const result = await this.getItems({ ...filters, search: query });
    return result.items;
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiBase}/marketplace/categories`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get categories: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get categories:', error);
      throw error;
    }
  }
}

// React hook for marketplace functionality
export function useMarketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    type?: MarketplaceItem['type'];
    category?: string;
    tags?: string[];
    priceType?: MarketplaceItem['price']['type'];
    sortBy?: 'created' | 'updated' | 'downloads' | 'rating' | 'trending';
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }>({});
  const { toast } = useToast();

  const marketplaceManager = useMemo(() => new MarketplaceManager(
    process.env.MARKETPLACE_API_URL || 'https://api.solo-compendium.com',
    process.env.MARKETPLACE_API_KEY || ''
  ), []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await marketplaceManager.getItems(filters);
      setItems(result.items);
    } catch (error) {
      setError('Failed to fetch marketplace items');
      toast({
        title: 'Error',
        description: 'Could not load marketplace items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [marketplaceManager, filters, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await marketplaceManager.getStats();
      setStats(statsData);
    } catch (error) {
      logger.error('Failed to fetch stats:', error);
    }
  }, [marketplaceManager]);

  const uploadItem = useCallback(async (itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'downloads' | 'views'>, file?: File) => {
    try {
      const item = await marketplaceManager.uploadItem(itemData, file);
      setItems(prev => [item, ...prev]);
      
      toast({
        title: 'Item Uploaded',
        description: `${item.title} has been added to the marketplace`,
      });
      
      return item;
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Could not upload your item',
        variant: 'destructive',
      });
      throw error;
    }
  }, [marketplaceManager, toast]);

  const downloadItem = useCallback(async (id: string, title: string) => {
    try {
      const blob = await marketplaceManager.downloadItem(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download Started',
        description: `Downloading ${title}`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download the item',
        variant: 'destructive',
      });
    }
  }, [marketplaceManager, toast]);

  const rateItem = useCallback(async (id: string, rating: number, comment?: string) => {
    try {
      const review = await marketplaceManager.rateItem(id, rating, comment);
      
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, rating: { ...item.rating, average: rating, count: item.rating.count + 1 } }
          : item
      ));
      
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback',
      });
      
      return review;
    } catch (error) {
      toast({
        title: 'Review Failed',
        description: 'Could not submit your review',
        variant: 'destructive',
      });
      throw error;
    }
  }, [marketplaceManager, toast]);

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const searchItems = useCallback(async (query: string) => {
    try {
      const searchResults = await marketplaceManager.searchItems(query, filters);
      setItems(searchResults);
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Could not search items',
        variant: 'destructive',
      });
    }
  }, [marketplaceManager, filters, toast]);

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [fetchItems, fetchStats]);

  return {
    items,
    stats,
    loading,
    error,
    filters,
    uploadItem,
    downloadItem,
    rateItem,
    updateFilters,
    searchItems,
    refresh: fetchItems,
  };
}

// React component for marketplace upload
export function MarketplaceUpload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'campaign' as MarketplaceItem['type'],
    category: '',
    tags: [] as string[],
    price: { type: 'free' as MarketplaceItem['price']['type'] },
    requirements: [] as string[],
    compatibility: [] as string[],
    license: 'MIT',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadItem } = useMarketplace();
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      await uploadItem({
        ...formData,
        author: {
          id: 'current-user',
          name: 'Current User',
          verified: false
        },
        version: '1.0.0',
        featured: false,
        verified: false
      }, file || undefined);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'campaign',
        category: '',
        tags: [],
        price: { type: 'free' },
        requirements: [],
        compatibility: [],
        license: 'MIT',
      });
      setFile(null);
      
      toast({
        title: 'Success',
        description: 'Your item has been uploaded to the marketplace',
      });
    } catch (error) {
      // Error already handled by hook
    } finally {
      setIsUploading(false);
    }
  }, [formData, file, uploadItem, toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload to Marketplace
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter item title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as MarketplaceItem['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="item">Item</SelectItem>
                  <SelectItem value="map">Map</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your item"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priceType" className="text-sm font-medium">Price Type</label>
              <Select
                value={formData.price.type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  price: { ...prev.price, type: value as MarketplaceItem['price']['type'] }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.price.type === 'paid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                <Input
                  id="amount"
                  type="number"
                  value={((formData.price as any).amount) || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, amount: parseFloat(e.target.value) || 0, currency: (prev.price as any).currency || 'USD' }
                  }))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">Currency</label>
                <Input
                  id="currency"
                  value={(formData.price as any).currency || 'USD'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, currency: e.target.value }
                  }))}
                  placeholder="Enter currency"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">File</label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".zip,.json,.txt,.md"
            />
            {file && (
              <div className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              placeholder="Enter tags"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="requirements" className="text-sm font-medium">Requirements (comma-separated)</label>
            <Input
              id="requirements"
              value={formData.requirements.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                requirements: e.target.value.split(',').map(req => req.trim()).filter(Boolean)
              }))}
              placeholder="Enter requirements"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="license" className="text-sm font-medium">License</label>
            <Select
              value={formData.license}
              onValueChange={(value) => setFormData(prev => ({ ...prev, license: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select license" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MIT">MIT</SelectItem>
                <SelectItem value="CC0">Creative Commons CC0</SelectItem>
                <SelectItem value="CC-BY">Creative Commons BY</SelectItem>
                <SelectItem value="CC-BY-SA">Creative Commons BY-SA</SelectItem>
                <SelectItem value="Proprietary">Proprietary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !formData.title || !formData.description}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// React component for marketplace browse
export function MarketplaceBrowse() {
  const {
    items,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    searchItems,
    downloadItem,
    rateItem,
    refresh
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'downloads' | 'rating' | 'trending'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = useCallback((query: string) => {
      setSearchQuery(query);
      searchItems(query);
    }, [searchItems]);

  const handleSortChange = useCallback((newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      updateFilters({ ...filters, sortBy: newSortBy, sortOrder: newSortOrder });
    }, [updateFilters, filters]);

  const handleFilterChange = useCallback((key: string, value: any) => {
      updateFilters({ ...filters, [key]: value });
    }, [updateFilters, filters]);

  const categories = [
    'Fantasy', 'Sci-Fi', 'Horror', 'Adventure', 'Mystery', 'Romance', 'Historical', 'Modern'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trendingItems.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Marketplace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="item">Item</SelectItem>
                  <SelectItem value="map">Map</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Select
                value={filters.priceType || ''}
                onValueChange={(value) => handleFilterChange('priceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort</label>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split('-') as [typeof sortBy, typeof sortOrder];
                  handleSortChange(newSortBy, newSortOrder);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created-desc">Newest First</SelectItem>
                  <SelectItem value="created-asc">Oldest First</SelectItem>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="downloads-desc">Most Downloaded</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="trending-desc">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error loading marketplace</div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={refresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                      {item.verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {item.rating.average.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.rating.count})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">
                        {item.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.author.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {item.price.type === 'free' ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Free
                  </Badge>
                ) : item.price.type === 'donation' ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Donation
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {item.price.currency} {item.price.amount}
                  </Badge>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadItem(item.id, item.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rateItem(item.id, 5)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate
                  </Button>
                </div>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {item.requirements && item.requirements.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Requirements:</strong> {item.requirements.join(', ')}
                  </div>
                )}

                {item.compatibility && item.compatibility.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Compatible with:</strong> {item.compatibility.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && !error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No items found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Main marketplace component
export function Marketplace() {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Share and discover custom campaigns, characters, items, and more
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'browse' | 'upload')}>
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          <MarketplaceBrowse />
        </TabsContent>
        <TabsContent value="upload">
          <MarketplaceUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}

