import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { supabase } from '@/integrations/supabase/client';
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/compendium')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Compendium
        </Button>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <SystemWindow title="ERROR" className="max-w-lg mx-auto">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => navigate('/compendium')} className="mt-4">
              Return to Compendium
            </Button>
          </SystemWindow>
        ) : (
          renderDetail()
        )}
      </div>
    </Layout>
  );
};

export default CompendiumDetail;