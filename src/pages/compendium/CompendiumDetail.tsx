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
import { JobDetail } from '@/components/compendium/JobDetail';
import { PowerDetail } from '@/components/compendium/PowerDetail';
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

type EntryType = 'jobs' | 'paths' | 'powers' | 'relics' | 'monsters' | 'backgrounds' | 'conditions' | 'monarchs' | 'feats' | 'skills' | 'equipment' | 'sovereigns';

const tableMap: Record<EntryType, string> = {
  jobs: 'compendium_jobs',
  paths: 'compendium_job_paths',
  powers: 'compendium_powers',
  relics: 'compendium_relics',
  monsters: 'compendium_monsters',
  backgrounds: 'compendium_backgrounds',
  conditions: 'compendium_conditions',
  monarchs: 'compendium_monarchs',
  feats: 'compendium_feats',
  skills: 'compendium_skills',
  equipment: 'compendium_equipment',
  sovereigns: 'compendium_sovereigns',
};

const CompendiumDetail = () => {
  const { type, id } = useParams<{ type: EntryType; id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntry = async () => {
      if (!type || !id) return;
      
      setLoading(true);
      setError(null);
      
      const tableName = tableMap[type as EntryType];
      if (!tableName) {
        setError('Invalid entry type');
        setLoading(false);
        return;
      }

      try {
        // Use type assertion to handle dynamic table names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: fetchError } = await (supabase.from(tableName as any) as ReturnType<typeof supabase.from>)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          setError('Entry not found');
        } else {
          setEntry(data);
        }
      } catch (err) {
        // Error is handled by React Query's error state
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
    
    const entryName = (entry as { name?: string }).name || '';
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
    type: string;
    source_book?: string | null;
    tags?: string[] | null;
    rarity?: string | null;
    gate_rank?: string | null;
    level?: number | null;
    cr?: string | null;
  };

  const isFavorite = favorites.has(`${type}:${id || ''}`);
  
  const handleToggleFavorite = () => {
    if (!id) return;
    const wasFavorite = isFavorite;
    toggleFavorite(type, id);
    toast({
      title: wasFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: `${entryData.name} has been ${wasFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link copied',
        description: 'Shareable link copied to clipboard.',
      });
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(entry, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entryData.name}-${type}-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export complete',
      description: `${entryData.name} exported successfully.`,
    });
  };

  // Fetch related content
  const { data: relatedEntries = [] } = useQuery({
    queryKey: ['related-content', type, id],
    queryFn: async () => {
      if (!type || !id) return [];
      
      // Fetch entries with similar tags
      const entryTags = (entryData.tags || []) as string[];
      if (entryTags.length === 0) return [];

      const related: Array<{ id: string; name: string; type: string; description?: string }> = [];
      
      // Query different tables based on type
      const tablesToQuery = ['monsters', 'equipment', 'relics', 'jobs', 'powers'].filter(t => t !== type);
      
      for (const tableType of tablesToQuery.slice(0, 2)) {
        try {
          const tableName = tableMap[tableType as EntryType];
          if (!tableName) continue;
          
          const { data } = await supabase
            .from(tableName as any)
            .select('id, name, description')
            .overlaps('tags', entryTags)
            .neq('id', id)
            .limit(3);
          
          if (data) {
            related.push(...data.map(item => ({ ...item, type: tableType })));
          }
        } catch (e) {
          // Ignore errors
        }
      }
      
      return related.slice(0, 5);
    },
    enabled: !!type && !!id && !!entry,
  });

  const categoryLabels: Record<string, string> = {
    jobs: 'Jobs',
    paths: 'Paths',
    powers: 'Powers',
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
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Compendium', href: '/compendium' },
            { label: categoryLabels[type] || type, href: `/compendium?category=${type}` },
            { label: entryData.name },
          ]}
        />

        <DetailLayout
          main={renderDetail()}
          sidebar={
            <>
              <QuickReference
                entry={entryData}
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