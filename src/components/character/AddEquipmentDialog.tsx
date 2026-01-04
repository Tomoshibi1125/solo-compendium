import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEquipment } from '@/hooks/useEquipment';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function AddEquipmentDialog({
  open,
  onOpenChange,
  characterId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { addEquipment } = useEquipment(characterId);
  const { toast } = useToast();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['compendium-equipment', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('compendium_equipment')
        .select('*')
        .limit(20);

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  const handleAdd = async (item: typeof equipment[0]) => {
    try {
      await addEquipment({
        character_id: characterId,
        name: item.name,
        item_type: item.equipment_type || 'gear',
        description: item.description || null,
        properties: item.properties || [],
        weight: item.weight || null,
        quantity: 1,
      });

      toast({
        title: 'Equipment added',
        description: `${item.name} has been added to your inventory.`,
      });

      onOpenChange(false);
      setSearchQuery('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add equipment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Equipment</DialogTitle>
          <DialogDescription>
            Search and add equipment from the compendium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No equipment found' : 'Search for equipment to add'}
              </div>
            ) : (
              equipment.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.equipment_type}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(item)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


