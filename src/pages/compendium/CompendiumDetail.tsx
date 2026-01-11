import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumbs } from '@/components/compendium/Breadcrumbs';
import { DetailLayout } from '@/components/compendium/DetailLayout';
import { QuickReference } from '@/components/compendium/QuickReference';
import { RelatedContent } from '@/components/compendium/RelatedContent';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { error as logError } from '@/lib/logger';
import { useQuery } from '@tanstack/react-query';
import { TableOfContents } from '@/components/compendium/TableOfContents';
import { JobDetail } from '@/components/compendium/JobDetail';
import { PowerDetail } from '@/components/compendium/PowerDetail';
import { RuneDetail } from '@/components/compendium/RuneDetail';
import { MonsterDetail } from '@/components/compendium/MonsterDetail';
import { EquipmentDetail } from '@/components/compendium/EquipmentDetail';
import { RelicDetail } from '@/components/compendium/RelicDetail';
import { FeatDetail } from '@/components/compendium/FeatDetail';
import { SkillDetail } from '@/components/compendium/SkillDetail';
import { BackgroundDetail } from '@/components/compendium/BackgroundDetail';
import { ConditionDetail } from '@/components/compendium/ConditionDetail';
import { MonarchDetail } from '@/components/compendium/MonarchDetail';
import { PathDetail } from '@/components/compendium/PathDetail';
import { SovereignDetail } from '@/components/compendium/SovereignDetail';
import { resolveRef, type EntryType, isValidEntryType, getTableName } from '@/lib/compendiumResolver';

const CompendiumDetail = () => {
  const { type, id } = useParams<{ type: EntryType; id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Fetch related content (must be before early returns per React hooks rules)
  const { data: relatedEntries = [] } = useQuery({
    queryKey: ['related-content', type, id, entry],
    queryFn: async () => {
      if (!type || !id || !entry) return [];
      
      // Fetch entries with similar tags
      const entryTags = ((entry as { tags?: string[] }).tags || []) as string[];
      if (entryTags.length === 0) return [];

      const related: Array<{ id: string; name: string; type: string; description?: string }> = [];
      
      // Query different tables based on type
      const tablesToQuery: EntryType[] = ['monsters', 'equipment', 'relics', 'jobs', 'powers', 'runes'].filter(
        (t): t is EntryType => t !== type && isValidEntryType(t)
      );
      
      for (const tableType of tablesToQuery.slice(0, 2)) {
        try {
          const tableName = getTableName(tableType);
          
          const { data, error: queryError } = await supabase
            .from(tableName)
            .select('id, name, display_name, description')
            .overlaps('tags', entryTags)
            .neq('id', id)
            .limit(3);
          
          if (!queryError && data && Array.isArray(data)) {
            // Type guard to ensure data is valid and not an error
            // First cast to unknown to bypass union type issues, then validate
            const items = data as unknown[];
            const validData = items.filter((item): item is { id: string; name: string; display_name?: string | null; description?: string } => {
              if (typeof item !== 'object' || item === null) return false;
              if ('error' in item) return false; // Filter out error objects
              const obj = item as Record<string, unknown>;
              if (!('id' in obj) || !('name' in obj)) return false;
              if (typeof obj.id !== 'string' || typeof obj.name !== 'string') return false;
              return true;
            });
            
            related.push(...validData.map((item) => ({
              id: item.id,
              name: item.display_name || item.name,
              type: tableType,
              description: item.description || undefined,
            })));
          }
        } catch (err) {
          // Continue to next table on error
        }
      }
      
      return related.slice(0, 6);
    },
    enabled: !!type && !!id && !!entry,
  });

  useEffect(() => {
    const fetchEntry = async () => {
      if (!type || !id) return;
      
      setLoading(true);
      setError(null);
      
      // Validate entry type
      if (!isValidEntryType(type)) {
        setError('Invalid entry type');
        setLoading(false);
        return;
      }

      try {
        // Use centralized resolver
        const entity = await resolveRef(type, id);

        if (!entity) {
          setError('Entry not found');
        } else {
          setEntry(entity);
        }
      } catch (err) {
        logError('Failed to load entry:', err);
        setError('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchEntry();
    }
  }, [type, id]);

  // Generate TOC items based on entry type
  const getTocItems = () => {
    if (!entry || !type) return [];
    
    const entryName = (entry as { display_name?: string | null; name?: string }).display_name || (entry as { name?: string }).name || '';
    const items: Array<{ id: string; title: string; level: number }> = [
      { id: 'entry-header', title: entryName, level: 1 },
    ];
    
    // Type-specific sections
    if (type === 'monsters') {
      items.push(
        { id: 'monster-stats', title: 'Core Stats', level: 2 },
        { id: 'monster-abilities', title: 'Ability Scores', level: 2 },
        { id: 'monster-traits', title: 'Traits', level: 2 },
        { id: 'monster-actions', title: 'Actions', level: 2 },
        { id: 'monster-description', title: 'Description', level: 2 }
      );
    } else if (type === 'jobs') {
      items.push(
        { id: 'job-proficiencies', title: 'Proficiencies', level: 2 },
        { id: 'job-paths', title: 'Paths', level: 2 },
        { id: 'job-features', title: 'Class Features', level: 2 }
      );
    } else if (type === 'powers') {
      items.push(
        { id: 'power-properties', title: 'Casting Properties', level: 2 },
        { id: 'power-description', title: 'Description', level: 2 }
      );
    } else if (type === 'runes') {
      items.push(
        { id: 'rune-requirements', title: 'Requirements', level: 2 },
        { id: 'rune-effect', title: 'Effect', level: 2 },
        { id: 'rune-inscription', title: 'Inscription', level: 2 }
      );
    }
    
    return items;
  };

  const renderDetail = () => {
    if (!entry || !type) return null;

    // Cast entry to any to avoid strict type checking for dynamic data
    const data = entry as Record<string, unknown>;

    switch (type) {
      case 'jobs':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <JobDetail data={data as any} />;
      case 'paths':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <PathDetail data={data as any} />;
      case 'powers':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <PowerDetail data={data as any} />;
      case 'runes':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <RuneDetail data={data as any} />;
      case 'relics':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <RelicDetail data={data as any} />;
      case 'monsters':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <MonsterDetail data={data as any} />;
      case 'backgrounds':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <BackgroundDetail data={data as any} />;
      case 'conditions':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <ConditionDetail data={data as any} />;
      case 'monarchs':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <MonarchDetail data={data as any} />;
      case 'feats':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <FeatDetail data={data as any} />;
      case 'skills':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <SkillDetail data={data as any} />;
      case 'equipment':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <EquipmentDetail data={data as any} />;
      case 'sovereigns':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <SovereignDetail data={data as any} />;
      default:
        return <div>Unknown entry type</div>;
    }
  };

  if (!entry || !type) {
    if (loading) {
      return (
        <Layout>
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </Layout>
      );
    }
    
    if (error) {
      return (
        <Layout>
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <SystemWindow title="ERROR" className="max-w-lg mx-auto">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => navigate('/compendium')} className="mt-4">
                Return to Compendium
              </Button>
            </SystemWindow>
          </div>
        </Layout>
      );
    }
    
    return null;
  }

  const entryData = entry as Record<string, unknown> & {
    name: string;
    display_name?: string | null;
    type: string;
    source_book?: string | null;
    tags?: string[] | null;
    rarity?: string | null;
    gate_rank?: string | null;
    level?: number | null;
    cr?: string | null;
  };

  const isFavorite = favorites.has(`${type}:${id || ''}`);
  const entryDisplayName = entryData.display_name || entryData.name;
  
  const handleToggleFavorite = () => {
    if (!id) return;
    const wasFavorite = isFavorite;
    toggleFavorite(type, id);
    toast({
      title: wasFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: `${entryDisplayName} has been ${wasFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link copied',
        description: 'Shareable link copied to clipboard.',
      });
    }).catch((err) => {
      logError('Failed to copy to clipboard:', err);
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(entry, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entryDisplayName}-${type}-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export complete',
      description: `${entryDisplayName} exported successfully.`,
    });
  };


  const categoryLabels: Record<string, string> = {
    jobs: 'Jobs',
    paths: 'Paths',
    powers: 'Powers',
    runes: 'Runes',
    relics: 'Relics',
    monsters: 'Monsters',
    backgrounds: 'Backgrounds',
    conditions: 'Conditions',
    monarchs: 'Monarchs',
    feats: 'Feats',
    skills: 'Skills',
    equipment: 'Equipment',
    sovereigns: 'Sovereigns',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/compendium')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compendium
          </Button>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Compendium', href: '/compendium' },
            { label: categoryLabels[type] || type, href: `/compendium?category=${type}` },
            { label: entryDisplayName },
          ]}
        />

        <DetailLayout
          main={renderDetail()}
          sidebar={
            <>
              <QuickReference
                entry={{ ...entryData, name: entryDisplayName }}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
                onExport={handleExport}
              />
              {getTocItems().length > 2 && (
                <TableOfContents items={getTocItems()} />
              )}
              {relatedEntries.length > 0 && (
                <RelatedContent
                  title="Related Content"
                  entries={relatedEntries}
                />
              )}
            </>
          }
        />
      </div>
    </Layout>
  );
};

export default CompendiumDetail;
