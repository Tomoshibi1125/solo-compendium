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
import { usePowers } from '@/hooks/usePowers';
import { useToast } from '@/hooks/use-toast';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

export function AddPowerDialog({
  open,
  onOpenChange,
  characterId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { addPower } = usePowers(characterId);
  const { toast } = useToast();

  const { data: powers = [], isLoading } = useQuery({
    queryKey: ['compendium-powers', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('compendium_powers')
        .select('*')
        .limit(20);

      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const canonicalQuery = normalizeMonarchSearch(trimmedQuery);
        query = query.ilike('name', `%${canonicalQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  const handleAdd = async (power: typeof powers[0]) => {
    const displayName = formatMonarchVernacular(power.name);
    try {
      await addPower({
        character_id: characterId,
        name: power.name,
        power_level: power.power_level,
        source: 'Compendium',
        casting_time: power.casting_time || null,
        range: power.range || null,
        duration: power.duration || null,
        concentration: power.concentration || false,
        description: power.description || null,
        higher_levels: power.higher_levels || null,
        is_prepared: false,
        is_known: true,
      });

      toast({
        title: 'Power added',
        description: `${displayName} has been added to your powers.`,
      });

      onOpenChange(false);
      setSearchQuery('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add power.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Power</DialogTitle>
          <DialogDescription>
            Search and add powers from the compendium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search powers..."
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
            ) : powers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No powers found' : 'Search for powers to add'}
              </div>
            ) : (
              powers.map((power) => (
                <div
                  key={power.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold">
                          {formatMonarchVernacular(power.name)}
                        </span>
                        {power.power_level > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Level {power.power_level}
                          </Badge>
                        )}
                        {power.concentration && (
                          <Badge variant="destructive" className="text-xs">Concentration</Badge>
                        )}
                      </div>
                      {power.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {formatMonarchVernacular(power.description)}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        {power.casting_time && <span>{formatMonarchVernacular(power.casting_time)}</span>}
                        {power.range && <span>{formatMonarchVernacular(power.range)}</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(power)}
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


