import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Users, Swords, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonItem {
  id: string;
  name: string;
  type: 'character' | 'monster' | 'shadow' | 'power' | 'relic';
  data: Record<string, unknown>;
}

interface ComparisonToolProps {
  type: 'characters' | 'monsters' | 'shadows' | 'powers' | 'relics';
  className?: string;
}

export function ComparisonTool({ type, className }: ComparisonToolProps) {
  const [selectedItems, setSelectedItems] = useState<ComparisonItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  // Fetch items based on type
  const { data: items = [] } = useQuery({
    queryKey: [`comparison-${type}`, selectedId],
    queryFn: async () => {
      const tableMap: Record<string, string> = {
        characters: 'characters',
        monsters: 'compendium_monsters',
        shadows: 'compendium_shadow_soldiers',
        powers: 'compendium_powers',
        relics: 'compendium_relics',
      };

      const tableName = tableMap[type];
      if (!tableName) return [];

      const { data, error } = await supabase
        .from(tableName as keyof Database['public']['Tables'])
        .select('*')
        .limit(100);

      if (error) throw error;
      return (data || []) as Array<{ id: string; name?: string; [key: string]: unknown }>;
    },
  });

  const addItem = () => {
    if (!selectedId) return;

    const item = items.find((i: { id: string; name?: string }) => i.id === selectedId);
    if (!item || !item.name) return;

    if (selectedItems.find(si => si.id === item.id)) return; // Already added

    setSelectedItems(prev => [...prev, {
      id: item.id,
      name: item.name,
      type: type.slice(0, -1) as ComparisonItem['type'], // Remove 's' from end
      data: item,
    }]);

    setSelectedId('');
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: ComparisonItem['type']) => {
    switch (type) {
      case 'character': return Users;
      case 'monster': return Crown;
      case 'shadow': return Sparkles;
      case 'power': return Sparkles;
      case 'relic': return Sparkles;
      default: return Swords;
    }
  };

  if (selectedItems.length === 0) {
    return (
      <SystemWindow title="COMPARISON TOOL" className={className}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`Select ${type.slice(0, -1)} to compare...`} />
              </SelectTrigger>
              <SelectContent>
                {items.filter((item: { id: string; name?: string }) => item.name).map((item: { id: string; name: string }) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addItem} disabled={!selectedId}>
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add items to compare their stats side-by-side
          </p>
        </div>
      </SystemWindow>
    );
  }

  return (
    <SystemWindow title="COMPARISON TOOL" className={className}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`Add more ${type}...`} />
            </SelectTrigger>
            <SelectContent>
              {items
                .filter((item: { id: string; name?: string }) => item.name && !selectedItems.find(si => si.id === item.id))
                .map((item: { id: string; name: string }) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={addItem} disabled={!selectedId}>
            Add
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle sm:px-0 px-4">
            <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Stat</th>
                {selectedItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <th key={item.id} className="text-center p-2 min-w-[150px]">
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-heading">{item.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-5 sm:w-5 min-h-[32px] min-w-[32px]"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from comparison`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Common stats comparison */}
              {type === 'characters' && selectedItems.length > 0 && (
                <>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">Level</td>
                    {selectedItems.map(sel => (
                      <td key={sel.id} className="p-2 text-center">
                        {(sel.data as { level?: number }).level ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">HP</td>
                    {selectedItems.map(sel => {
                      const data = sel.data as { hp_current?: number; hp_max?: number };
                      return (
                        <td key={sel.id} className="p-2 text-center">
                          {data.hp_current ?? 'N/A'}/{data.hp_max ?? 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">AC</td>
                    {selectedItems.map(sel => (
                      <td key={sel.id} className="p-2 text-center">
                        {(sel.data as { armor_class?: number }).armor_class ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              {type === 'monsters' && selectedItems.length > 0 && (
                <>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">CR</td>
                    {selectedItems.map(sel => (
                      <td key={sel.id} className="p-2 text-center">
                        {(sel.data as { cr?: string }).cr ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">HP</td>
                    {selectedItems.map(sel => (
                      <td key={sel.id} className="p-2 text-center">
                        {(sel.data as { hit_points_average?: number }).hit_points_average ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-heading text-sm">AC</td>
                    {selectedItems.map(sel => (
                      <td key={sel.id} className="p-2 text-center">
                        {(sel.data as { armor_class?: number }).armor_class ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </SystemWindow>
  );
}

