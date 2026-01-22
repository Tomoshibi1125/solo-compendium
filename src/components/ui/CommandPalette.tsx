import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useCharacters } from '@/hooks/useCharacters';
import { FileText, User, BookOpen, Dice6, Settings, Home } from 'lucide-react';
import { getTableName, type EntryType } from '@/lib/compendiumResolver';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { data: characters } = useCharacters();
  const [search, setSearch] = useState('');
  const canonicalSearch = normalizeMonarchSearch(search.toLowerCase());

  // Search compendium items
  const { data: compendiumResults } = useQuery({
    queryKey: ['command-palette-compendium', search],
    queryFn: async () => {
      if (!search || search.length < 2) return [];

      const results: Array<{ id: string; name: string; type: string; href: string }> = [];
      const canonicalQuery = normalizeMonarchSearch(search);

      // Search common compendium types using resolver table names
      const searchTypes: Array<{ type: EntryType; label: string; route: string }> = [
        { type: 'jobs', label: 'Job', route: 'jobs' },
        { type: 'powers', label: 'Power', route: 'powers' },
        { type: 'equipment', label: 'Equipment', route: 'equipment' },
      ];

      for (const { type, label, route } of searchTypes) {
        try {
          const tableName = getTableName(type);
          const { data } = await supabase
            .from(tableName)
            .select('id, name, display_name')
            .or(`name.ilike.%${canonicalQuery}%,display_name.ilike.%${canonicalQuery}%`)
            .limit(5);

          if (data && Array.isArray(data)) {
            // Type guard to filter out error objects
            const items = data as unknown[];
            const validItems = items.filter((item): item is { id: string; name: string; display_name?: string | null } => {
              if (typeof item !== 'object' || item === null) return false;
              if ('error' in item) return false; // Filter out error objects
              const obj = item as Record<string, unknown>;
              return typeof obj.id === 'string' && typeof obj.name === 'string';
            });

            validItems.forEach((item) => {
              results.push({
                id: item.id,
                name: item.display_name || item.name,
                type: label,
                href: `/compendium/${route}/${item.id}`
              });
            });
          }
        } catch {
          // Continue to next type on error
        }
      }

      return results;
    },
    enabled: open && search.length >= 2,
  });

  // Navigation actions
  const navigationActions = [
    { id: 'home', name: 'Go to Home', href: '/', icon: Home },
    { id: 'compendium', name: 'Open Compendium', href: '/compendium', icon: BookOpen },
    { id: 'characters', name: 'My Characters', href: '/characters', icon: User },
    { id: 'dice', name: 'Dice Roller', href: '/dice', icon: Dice6 },
    { id: 'dm-tools', name: 'Warden Tools', href: '/dm-tools', icon: Settings },
  ];

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search characters, compendium, or navigate..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found for "{search}"</CommandEmpty>

        {/* Navigation */}
        {(!search || search.length < 2) && (
          <CommandGroup heading="Navigation">
            {navigationActions.map((action) => (
              <CommandItem
                key={action.id}
                onSelect={() => handleSelect(action.href)}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.name}
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Characters */}
        {characters && characters.length > 0 && (
          <CommandGroup heading="Characters">
            {characters
              .filter(char =>
                !search ||
                normalizeMonarchSearch(char.name.toLowerCase()).includes(canonicalSearch)
              )
              .slice(0, 5)
              .map((character) => (
                <CommandItem
                  key={character.id}
                  onSelect={() => handleSelect(`/characters/${character.id}`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {formatMonarchVernacular(character.name)}
                  <span className="ml-2 text-xs text-muted-foreground">
                    Level {character.level} {formatMonarchVernacular(character.job || 'Ascendant')}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}

        {/* Compendium Results */}
        {compendiumResults && compendiumResults.length > 0 && (
          <CommandGroup heading="Compendium">
            {compendiumResults.map((item) => (
              <CommandItem
                key={`${item.type}-${item.id}`}
                onSelect={() => handleSelect(item.href)}
              >
                <FileText className="mr-2 h-4 w-4" />
                {formatMonarchVernacular(item.name)}
                <span className="ml-2 text-xs text-muted-foreground">
                  {formatMonarchVernacular(item.type)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}


