import { useState } from 'react';
import { X, ArrowLeftRight, Download, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface CompendiumItem {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  level?: number;
  description?: string;
  properties?: string[];
  stats?: Record<string, unknown>;
  image_url?: string;
}

interface ComparisonToolProps {
  items: CompendiumItem[];
  onAddItem?: (item: CompendiumItem) => void;
  className?: string;
}

export function ComparisonTool({ items, onAddItem, className }: ComparisonToolProps) {
  const { toast } = useToast();
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CompendiumItem[]>([]);
  const availableItems = items.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id)
  );

  const addToComparison = (item: CompendiumItem) => {
    if (selectedItems.length >= 4) {
      toast({
        title: 'Comparison Full',
        description: 'You can compare up to 4 items at once.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedItems.some(selected => selected.id === item.id)) {
      toast({
        title: 'Already Added',
        description: 'This item is already in the comparison.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedItems([...selectedItems, item]);
    toast({
      title: 'Added to Comparison',
      description: `${formatMonarchVernacular(item.name)} has been added to the comparison.`,
    });
  };

  const handleAddItem = (item: CompendiumItem) => {
    addToComparison(item);
    onAddItem?.(item);
  };

  const removeFromComparison = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const clearComparison = () => {
    setSelectedItems([]);
  };

  const exportComparison = () => {
    const comparisonData = {
      items: selectedItems.map((item) => ({
        ...item,
        name: formatMonarchVernacular(item.name),
        type: formatMonarchVernacular(item.type),
        rarity: item.rarity ? formatMonarchVernacular(item.rarity) : item.rarity,
        description: item.description ? formatMonarchVernacular(item.description) : item.description,
        properties: item.properties ? item.properties.map(formatMonarchVernacular) : item.properties,
      })),
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compendium-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Comparison Exported',
      description: 'Comparison data has been downloaded.',
    });
  };

  const shareComparison = async () => {
    try {
      const shareText = `Comparing ${selectedItems.map(item => formatMonarchVernacular(item.name)).join(', ')}`;
      const shareData = {
        title: 'Compendium Comparison',
        text: shareText,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Link Copied',
          description: 'Comparison link copied to clipboard.',
        });
      }
    } catch {
      toast({
        title: 'Share Failed',
        description: 'Could not share comparison.',
        variant: 'destructive',
      });
    }
  };

  const getStatValue = (item: CompendiumItem, statKey: string) => {
    if (!item.stats) return 'N/A';
    
    const value = item.stats[statKey];
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return formatMonarchVernacular(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.map((entry) => (typeof entry === 'string' ? formatMonarchVernacular(entry) : String(entry))).join(', ');
    return JSON.stringify(value);
  };

  const getAllStatKeys = () => {
    const statKeys = new Set<string>();
    selectedItems.forEach(item => {
      if (item.stats) {
        Object.keys(item.stats).forEach(key => statKeys.add(key));
      }
    });
    return Array.from(statKeys).sort();
  };

  if (selectedItems.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-center py-6">
          <p className="text-muted-foreground">No items selected for comparison</p>
        </div>
        {availableItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Add items to compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex items-center justify-between gap-2 p-3 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                  onClick={() => handleAddItem(item)}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{formatMonarchVernacular(item.name)}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {formatMonarchVernacular(item.type)}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedItems.length} items</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCompareDialogOpen(true)}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              View Comparison
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearComparison}
            >
              Clear All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportComparison}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={shareComparison}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedItems.map((item) => (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm">{formatMonarchVernacular(item.name)}</CardTitle>
                    <p className="text-xs text-muted-foreground">{formatMonarchVernacular(item.type)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFromComparison(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {item.rarity && (
                    <Badge variant="outline" className="text-xs">
                      {formatMonarchVernacular(item.rarity)}
                    </Badge>
                  )}
                  {item.level && (
                    <Badge variant="outline" className="text-xs">
                      Level {item.level}
                    </Badge>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {formatMonarchVernacular(item.description)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Item Comparison</DialogTitle>
            <DialogDescription>
              Detailed comparison of {selectedItems.length} items
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedItems.map((item) => (
                    <Card key={`basic-${item.id}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{formatMonarchVernacular(item.name)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> {formatMonarchVernacular(item.type)}
                          </div>
                          {item.rarity && (
                            <div>
                              <span className="font-medium">Rarity:</span> {formatMonarchVernacular(item.rarity)}
                            </div>
                          )}
                          {item.level && (
                            <div>
                              <span className="font-medium">Level:</span> {item.level}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Stats Comparison */}
              {getAllStatKeys().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="space-y-4">
                    {getAllStatKeys().map((statKey) => (
                      <div key={statKey}>
                        <h4 className="font-medium mb-2 capitalize">
                          {statKey.replace(/_/g, ' ')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {selectedItems.map((item) => (
                            <div
                              key={`stat-${item.id}-${statKey}`}
                              className="p-3 border rounded-md"
                            >
                              <div className="text-sm font-medium">{formatMonarchVernacular(item.name)}</div>
                              <div className="text-lg">
                                {getStatValue(item, statKey)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Properties */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedItems.map((item) => (
                    <Card key={`props-${item.id}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{formatMonarchVernacular(item.name)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {item.properties && item.properties.length > 0 ? (
                            item.properties.map((prop, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                                {formatMonarchVernacular(prop)}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No properties</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedItems.map((item) => (
                    <Card key={`desc-${item.id}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{formatMonarchVernacular(item.name)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.description ? formatMonarchVernacular(item.description) : 'No description available'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
