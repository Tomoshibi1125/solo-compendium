import { useState, useEffect } from 'react';
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
import { FileText, User, BookOpen, Dice6, Settings, Home, Search } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { data: characters } = useCharacters();
  const [search, setSearch] = useState('');

  // Search compendium items
  const { data: compendiumResults } = useQuery({
    queryKey: ['command-palette-compendium', search],
    queryFn: async () => {
      if (!search || search.length < 2) return [];
      
      const results: Array<{ id: string; name: string; type: string; href: string }> = [];
      
      // Search jobs
      const { data: jobs } = await supabase
        .from('compendium_jobs')
        .select('id, name')
        .ilike('name', `%${search}%`)
        .limit(5);
      if (jobs) {
        jobs.forEach(job => {
          results.push({ id: job.id, name: job.name, type: 'Job', href: `/compendium/jobs/${job.id}` });
        });
      }

      // Search powers
      const { data: powers } = await supabase
        .from('compendium_powers')
        .select('id, name')
        .ilike('name', `%${search}%`)
        .limit(5);
      if (powers) {
        powers.forEach(power => {
          results.push({ id: power.id, name: power.name, type: 'Power', href: `/compendium/powers/${power.id}` });
        });
      }

      // Search equipment
      const { data: equipment } = await supabase
        .from('compendium_equipment')
        .select('id, name')
        .ilike('name', `%${search}%`)
        .limit(5);
      if (equipment) {
        equipment.forEach(item => {
          results.push({ id: item.id, name: item.name, type: 'Equipment', href: `/compendium/equipment/${item.id}` });
        });
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
    { id: 'dm-tools', name: 'DM Tools', href: '/dm-tools', icon: Settings },
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
        <CommandEmpty>No results found.</CommandEmpty>

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
              .filter(char => !search || char.name.toLowerCase().includes(search.toLowerCase()))
              .slice(0, 5)
              .map((character) => (
                <CommandItem
                  key={character.id}
                  onSelect={() => handleSelect(`/characters/${character.id}`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {character.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    Level {character.level} {character.job || 'Hunter'}
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
                {item.name}
                <span className="ml-2 text-xs text-muted-foreground">{item.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

