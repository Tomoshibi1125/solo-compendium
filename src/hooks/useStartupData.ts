import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { staticDataProvider } from '@/data/compendium/staticDataProvider';
import type { StaticCompendiumEntry } from '@/data/compendium/staticDataProvider';
import type { Database } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

// Define the interface to match Compendium.tsx exactly
export interface CompendiumEntry {
  id: string;
  name: string;
  type: 'jobs' | 'paths' | 'powers' | 'runes' | 'relics' | 'monsters' | 'backgrounds' | 'conditions' | 'monarchs' | 'feats' | 'skills' | 'equipment' | 'shadow-soldiers' | 'techniques' | 'items' | 'spells' | 'artifacts' | 'locations' | 'sovereigns';
  rarity?: string;
  description: string; // Required in Compendium.tsx
  level?: number;
  cr?: string;
  gate_rank?: string;
  is_boss?: boolean;
  tags?: string[] | null;
  created_at?: string;
  source_book?: string | null;
  image_url?: string | null;
  isFavorite: boolean;
  // Type-specific fields
  power_level?: number | null;
  school?: string | null;
  title?: string | null;
  theme?: string | null;
  prerequisites?: string | Record<string, unknown> | null;
  fusion_theme?: string | null;
  equipment_type?: string | null;
  ability?: string | null;
  rune_type?: string | null;
  rune_category?: string | null;
}

// ALL categories to preload at startup - comprehensive loading
const STARTUP_CATEGORIES = [
  'jobs', 'paths', 'powers', 'runes', 'relics', 'monsters', 
  'backgrounds', 'conditions', 'monarchs', 'feats', 'skills', 
  'equipment', 'shadow-soldiers'
] as const;

type StartupCategory = (typeof STARTUP_CATEGORIES)[number];

const STARTUP_TABLES: Record<StartupCategory, keyof Database['public']['Tables']> = {
  jobs: 'compendium_jobs',
  paths: 'compendium_job_paths',
  powers: 'compendium_powers',
  runes: 'compendium_runes',
  relics: 'compendium_relics',
  monsters: 'compendium_monsters',
  backgrounds: 'compendium_backgrounds',
  conditions: 'compendium_conditions',
  monarchs: 'compendium_monarchs',
  feats: 'compendium_feats',
  skills: 'compendium_skills',
  equipment: 'compendium_equipment',
  'shadow-soldiers': 'compendium_shadow_soldiers',
};
const STARTUP_LIMIT = 50; // Load more items per category for comprehensive display

interface StartupData {
  entries: CompendiumEntry[];
  categories: string[];
  totalCounts: Record<string, number>;
}

export const useStartupData = () => {
  return useQuery({
    queryKey: ['startup-data'],
    queryFn: async (): Promise<StartupData> => {
      const allEntries: CompendiumEntry[] = [];
      const totalCounts: Record<string, number> = {};

      if (!isSupabaseConfigured) {
        // Use static data for development/preview - load ALL categories with COMPLETE data
        for (const category of STARTUP_CATEGORIES) {
          let data: StaticCompendiumEntry[] = [];
          
          switch (category) {
            case 'jobs':
              data = await staticDataProvider.getJobs('');
              break;
            case 'monsters':
              data = await staticDataProvider.getMonsters('');
              break;
            case 'powers':
              data = await staticDataProvider.getSpells('');
              break;
            case 'equipment':
              data = await staticDataProvider.getItems('');
              break;
            case 'paths':
              data = await staticDataProvider.getPaths('');
              break;
            case 'runes':
              data = await staticDataProvider.getRunes('');
              break;
            case 'backgrounds':
              data = await staticDataProvider.getBackgrounds('');
              break;
            case 'relics':
              data = await staticDataProvider.getRelics('');
              break;
            case 'conditions':
              data = await staticDataProvider.getConditions('');
              break;
            case 'monarchs':
              data = await staticDataProvider.getMonarchs('');
              break;
            case 'feats':
              data = await staticDataProvider.getFeats('');
              break;
            case 'skills':
              data = await staticDataProvider.getSkills('');
              break;
            case 'shadow-soldiers':
              data = await staticDataProvider.getShadowSoldiers('');
              break;
            default:
              data = [];
              break;
          }

          // Transform and limit to startup limit
          const limitedData = data.slice(0, STARTUP_LIMIT);
          allEntries.push(...limitedData.map(item => ({
            id: item.id,
            name: item.display_name || item.name,
            type: category as CompendiumEntry['type'],
            description: item.description || 'No description available', // Ensure description is always provided
            rarity: item.rarity || 'common',
            tags: item.tags || [],
            created_at: item.created_at,
            source_book: item.source_book,
            image_url: item.image_url,
            isFavorite: false,
            // Include type-specific fields
            ...(category === 'monsters' && {
              cr: item.cr,
              gate_rank: item.gate_rank,
              is_boss: item.is_boss,
            }),
            ...(category === 'powers' && {
              power_level: item.power_level,
              school: item.school,
            }),
            ...(category === 'runes' && {
              rune_type: item.rune_type,
              rune_category: item.rune_category,
              rarity: item.rarity,
            }),
            ...(category === 'equipment' && {
              equipment_type: item.equipment_type,
              damage: item.damage,
              armor_class: item.armor_class,
            }),
            ...(category === 'skills' && {
              ability: item.ability,
            }),
            ...(category === 'feats' && {
              prerequisites: item.prerequisites,
            }),
            ...(category === 'monarchs' && {
              title: item.title,
              theme: item.theme,
            }),
            ...(category === 'shadow-soldiers' && {
              role: item.role,
              rank: item.rank,
            }),
            ...(category === 'relics' && {
              equipment_type: item.equipment_type,
            }),
          })));

          totalCounts[category] = data.length;
        }

        return {
          entries: allEntries,
          categories: [...STARTUP_CATEGORIES],
          totalCounts,
        };
      }

      // Use Supabase for production
      try {
        // Parallel fetch of ALL startup categories
        const promises = STARTUP_CATEGORIES.map(async (category) => {
          let query;
          
          switch (category) {
            case 'jobs':
              query = supabase
                .from('compendium_jobs')
                .select('id, name, display_name, description, created_at, tags, source_book, image_url')
                .limit(STARTUP_LIMIT);
              break;
            case 'monsters':
              query = supabase
                .from('compendium_monsters')
                .select('id, name, display_name, description, created_at, tags, source_book, image_url, cr, gate_rank, is_boss')
                .limit(STARTUP_LIMIT);
              break;
            case 'powers':
              query = supabase
                .from('compendium_powers')
                .select('id, name, display_name, description, created_at, tags, source_book, power_level, school')
                .limit(STARTUP_LIMIT);
              break;
            case 'paths':
              query = supabase
                .from('compendium_job_paths')
                .select('id, name, display_name, description, created_at, tags, source_book')
                .limit(STARTUP_LIMIT);
              break;
            case 'runes':
              query = supabase
                .from('compendium_runes')
                .select('id, name, display_name, description, created_at, tags, source_book, rune_level, rune_type, rune_category, rarity')
                .limit(STARTUP_LIMIT);
              break;
            case 'relics':
              query = supabase
                .from('compendium_relics')
                .select('id, name, display_name, description, created_at, tags, source_book, rarity, item_type, image_url')
                .limit(STARTUP_LIMIT);
              break;
            case 'backgrounds':
              query = supabase
                .from('compendium_backgrounds')
                .select('id, name, display_name, description, created_at, tags, source_book')
                .limit(STARTUP_LIMIT);
              break;
            case 'conditions':
              query = supabase
                .from('compendium_conditions')
                .select('id, name, display_name, description, created_at')
                .limit(STARTUP_LIMIT);
              break;
            case 'monarchs':
              query = supabase
                .from('compendium_monarchs')
                .select('id, name, display_name, description, created_at, tags, source_book, title, theme')
                .limit(STARTUP_LIMIT);
              break;
            case 'feats':
              query = supabase
                .from('compendium_feats')
                .select('id, name, display_name, description, created_at, tags, source_book, prerequisites')
                .limit(STARTUP_LIMIT);
              break;
            case 'skills':
              query = supabase
                .from('compendium_skills')
                .select('id, name, display_name, description, created_at, source_book, ability')
                .limit(STARTUP_LIMIT);
              break;
            case 'equipment':
              query = supabase
                .from('compendium_equipment')
                .select('id, name, display_name, description, created_at, tags, source_book, equipment_type, damage, armor_class, image_url')
                .limit(STARTUP_LIMIT);
              break;
            case 'shadow-soldiers':
              query = supabase
                .from('compendium_shadow_soldiers')
                .select('id, name, display_name, description, created_at, tags, source_book, role, rank')
                .limit(STARTUP_LIMIT);
              break;
            default:
              return { entries: [], count: 0 };
          }

          const { data, error } = await query;
          if (error || !data) return { entries: [], count: 0 };

          // Get total count for this category
          const tableName = STARTUP_TABLES[category];
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          const transformedEntries = data.map((item) => ({
            id: item.id,
            name: item.display_name || item.name,
            type: category as CompendiumEntry['type'],
            description: item.description || 'No description available', // Ensure description is always provided
            rarity: item.rarity || 'common',
            tags: item.tags || [],
            created_at: item.created_at,
            source_book: item.source_book,
            image_url: item.image_url,
            isFavorite: false,
            // Include type-specific fields
            ...(category === 'monsters' && {
              cr: item.cr,
              gate_rank: item.gate_rank,
              is_boss: item.is_boss,
            }),
            ...(category === 'powers' && {
              power_level: item.power_level,
              school: item.school,
            }),
            ...(category === 'runes' && {
              rune_type: item.rune_type,
              rune_category: item.rune_category,
              level: item.rune_level,
            }),
            ...(category === 'equipment' && {
              equipment_type: item.equipment_type,
              damage: item.damage,
              armor_class: item.armor_class,
            }),
            ...(category === 'skills' && {
              ability: item.ability,
            }),
            ...(category === 'feats' && {
              prerequisites: item.prerequisites,
            }),
            ...(category === 'monarchs' && {
              title: item.title,
              theme: item.theme,
            }),
            ...(category === 'shadow-soldiers' && {
              role: item.role,
              rank: item.rank,
            }),
          }));

          return { entries: transformedEntries, count: count || 0 };
        });

        const results = await Promise.all(promises);
        
        results.forEach((result, index) => {
          allEntries.push(...result.entries);
          totalCounts[STARTUP_CATEGORIES[index]] = result.count;
        });

        return {
          entries: allEntries,
          categories: [...STARTUP_CATEGORIES],
          totalCounts,
        };
      } catch (error) {
        logger.error('Failed to load startup data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

