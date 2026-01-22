import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
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
import { ShadowSoldierDetail } from '@/components/compendium/ShadowSoldierDetail';
import { SovereignDetail } from '@/components/compendium/SovereignDetail';
import { SpellDetail } from '@/components/compendium/SpellDetail';
import { TechniqueDetail } from '@/components/compendium/TechniqueDetail';
import { ArtifactDetail } from '@/components/compendium/ArtifactDetail';
import { LocationDetail } from '@/components/compendium/LocationDetail';
import { ItemDetail } from '@/components/compendium/ItemDetail';
import { resolveRef, type EntryType, type CompendiumEntity, isValidEntryType, entryTypes, listStaticEntries } from '@/lib/compendiumResolver';
import { formatMonarchVernacular, MONARCH_LABEL_PLURAL } from '@/lib/vernacular';

type JobDetailData = Parameters<typeof JobDetail>[0]['data'];
type PathDetailData = Parameters<typeof PathDetail>[0]['data'];
type PowerDetailData = Parameters<typeof PowerDetail>[0]['data'];
type RuneDetailData = Parameters<typeof RuneDetail>[0]['data'];
type RelicDetailData = Parameters<typeof RelicDetail>[0]['data'];
type MonsterDetailData = Parameters<typeof MonsterDetail>[0]['data'];
type BackgroundDetailData = Parameters<typeof BackgroundDetail>[0]['data'];
type ConditionDetailData = Parameters<typeof ConditionDetail>[0]['data'];
type MonarchDetailData = Parameters<typeof MonarchDetail>[0]['data'];
type FeatDetailData = Parameters<typeof FeatDetail>[0]['data'];
type SkillDetailData = Parameters<typeof SkillDetail>[0]['data'];
type EquipmentDetailData = Parameters<typeof EquipmentDetail>[0]['data'];
type ShadowSoldierDetailData = Parameters<typeof ShadowSoldierDetail>[0]['data'];
type ItemDetailData = Parameters<typeof ItemDetail>[0]['data'];
type SpellDetailData = Parameters<typeof SpellDetail>[0]['data'];
type TechniqueDetailData = Parameters<typeof TechniqueDetail>[0]['data'];
type ArtifactDetailData = Parameters<typeof ArtifactDetail>[0]['data'];
type LocationDetailData = Parameters<typeof LocationDetail>[0]['data'];
type SovereignDetailData = Parameters<typeof SovereignDetail>[0]['data'];

const CompendiumDetail = () => {
  const { type, id } = useParams<{ type: EntryType; id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<CompendiumEntity | null>(null);
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
      const entryTags = Array.isArray(entry.tags) ? entry.tags : [];
      if (entryTags.length === 0) return [];

      const related: Array<{ id: string; name: string; type: string; description?: string }> = [];
      const normalizedTags = entryTags.map((tag) => tag.toLowerCase());
      const candidateTypes = entryTypes.filter((entryType) => entryType !== type);

      for (const entryType of candidateTypes) {
        if (related.length >= 6) break;

        const staticEntries = await listStaticEntries(entryType);
        if (!staticEntries) continue;

        const matches = staticEntries
          .filter((item) => {
            const tags = item.tags || [];
            if (!Array.isArray(tags) || tags.length === 0) return false;
            return tags.some((tag) => normalizedTags.includes(tag.toLowerCase()));
          })
          .filter((item) => !(entryType === type && item.id === id))
          .slice(0, 3);

        related.push(
          ...matches.map((item) => ({
            id: item.id,
            name: formatMonarchVernacular(item.display_name || item.name),
            type: entryType,
            description: item.description ? formatMonarchVernacular(item.description) : undefined,
          }))
        );
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
    
    const entryNameRaw = (entry as { display_name?: string | null; name?: string }).display_name || (entry as { name?: string }).name || '';
    const entryName = formatMonarchVernacular(entryNameRaw);
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
    } else if (type === 'shadow-soldiers') {
      items.push(
        { id: 'soldier-description', title: 'Overview', level: 2 },
        { id: 'soldier-role', title: 'Combat Role', level: 2 },
        { id: 'soldier-tags', title: 'Tags', level: 2 }
      );
    } else if (type === 'spells') {
      items.push(
        { id: 'spell-stats', title: 'Spell Stats', level: 2 },
        { id: 'spell-effect', title: 'Effect', level: 2 },
        { id: 'spell-description', title: 'Description', level: 2 }
      );
    } else if (type === 'techniques') {
      items.push(
        { id: 'technique-activation', title: 'Activation', level: 2 },
        { id: 'technique-effects', title: 'Effects', level: 2 },
        { id: 'technique-mechanics', title: 'Mechanics', level: 2 },
        { id: 'technique-description', title: 'Description', level: 2 }
      );
    } else if (type === 'artifacts') {
      items.push(
        { id: 'artifact-properties', title: 'Properties', level: 2 },
        { id: 'artifact-abilities', title: 'Abilities', level: 2 },
        { id: 'artifact-lore', title: 'Lore', level: 2 },
        { id: 'artifact-mechanics', title: 'Mechanics', level: 2 }
      );
    } else if (type === 'items') {
      items.push(
        { id: 'item-properties', title: 'Properties', level: 2 },
        { id: 'item-effects', title: 'Effects', level: 2 },
        { id: 'item-description', title: 'Description', level: 2 }
      );
    } else if (type === 'locations') {
      items.push(
        { id: 'location-details', title: 'Details', level: 2 },
        { id: 'location-encounters', title: 'Encounters', level: 2 },
        { id: 'location-treasures', title: 'Treasures', level: 2 }
      );
    } else if (type === 'sovereigns') {
      items.push(
        { id: 'sovereign-overview', title: 'Overview', level: 2 },
        { id: 'sovereign-fusion', title: 'Fusion Components', level: 2 },
        { id: 'sovereign-features', title: 'Abilities', level: 2 }
      );
    }
    
    return items;
  };

  const renderDetail = () => {
    if (!entry || !type) return null;

    const data = entry as unknown;

    switch (type) {
      case 'jobs':
        return <JobDetail data={data as JobDetailData} />;
      case 'paths':
        return <PathDetail data={data as PathDetailData} />;
      case 'powers':
        return <PowerDetail data={data as PowerDetailData} />;
      case 'runes':
        return <RuneDetail data={data as RuneDetailData} />;
      case 'relics':
        return <RelicDetail data={data as RelicDetailData} />;
      case 'monsters':
        return <MonsterDetail data={data as MonsterDetailData} />;
      case 'backgrounds':
        return <BackgroundDetail data={data as BackgroundDetailData} />;
      case 'conditions':
        return <ConditionDetail data={data as ConditionDetailData} />;
      case 'monarchs':
        return <MonarchDetail data={data as MonarchDetailData} />;
      case 'feats':
        return <FeatDetail data={data as FeatDetailData} />;
      case 'skills':
        return <SkillDetail data={data as SkillDetailData} />;
      case 'equipment':
        return <EquipmentDetail data={data as EquipmentDetailData} />;
      case 'shadow-soldiers':
        return <ShadowSoldierDetail data={data as ShadowSoldierDetailData} />;
      case 'items':
        return <ItemDetail data={data as ItemDetailData} />;
      case 'spells':
        return <SpellDetail data={data as SpellDetailData} />;
      case 'techniques':
        return <TechniqueDetail data={data as TechniqueDetailData} />;
      case 'artifacts':
        return <ArtifactDetail data={data as ArtifactDetailData} />;
      case 'locations':
        return <LocationDetail data={data as LocationDetailData} />;
      case 'sovereigns':
        return <SovereignDetail data={data as SovereignDetailData} />;
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

  const entryData = entry as CompendiumEntity & {
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
  const entryDisplayNameRaw = entryData.display_name || entryData.name;
  const entryDisplayName = formatMonarchVernacular(entryDisplayNameRaw);
  
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
    const dataStr = formatMonarchVernacular(JSON.stringify(entry, null, 2));
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
    monarchs: MONARCH_LABEL_PLURAL,
    feats: 'Feats',
    skills: 'Skills',
    equipment: 'Equipment',
    items: 'Items',
    spells: 'Spells',
    techniques: 'Techniques',
    artifacts: 'Artifacts',
    locations: 'Locations',
    sovereigns: 'Sovereigns',
    'shadow-soldiers': 'Umbral Legion',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/compendium')} aria-label="Back to Compendium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compendium
          </Button>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Compendium', href: '/compendium' },
            { label: formatMonarchVernacular(categoryLabels[type] || type), href: `/compendium?category=${type}` },
            { label: entryDisplayName },
          ]}
        />

        <span id="entry-header" className="scroll-mt-4" />

        <DetailLayout
          main={renderDetail()}
          sidebar={
            <>
              <QuickReference
                entry={{ ...entryData, name: entryData.name, display_name: entryDisplayName }}
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

