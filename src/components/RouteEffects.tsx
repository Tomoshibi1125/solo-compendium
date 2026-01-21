import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidEntryType, resolveRef, type EntryType } from '@/lib/compendiumResolver';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { getLocalCharacterWithAbilities, isLocalCharacterId } from '@/lib/guestStore';
import { formatMonarchVernacular, MONARCH_LABEL_PLURAL } from '@/lib/vernacular';

const BASE_TITLE = 'System Ascendant';
const ACTIVE_CHARACTER_STORAGE_KEY = 'solo-compendium.active-character';

const COMPENDIUM_LABELS: Record<EntryType, string> = {
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
  sovereigns: 'Sovereigns',
  'shadow-soldiers': 'Umbral Legion',
  items: 'Items',
  spells: 'Spells',
  techniques: 'Techniques',
  artifacts: 'Artifacts',
  locations: 'Locations',
};

const PLAYER_TOOL_LABELS: Record<string, string> = {
  'character-sheet': 'Character Sheet',
  inventory: 'Inventory',
  abilities: 'Abilities & Skills',
  'character-art': 'Character Art Generator',
  'compendium-viewer': 'Compendium Viewer',
  'quest-log': 'Quest Log',
  'party-view': 'Party View',
  'dice-roller': 'Dice Roller',
  achievements: 'Achievements',
};

const PLAYER_TOOLS_WITH_CHARACTER = new Set([
  'character-sheet',
  'inventory',
  'abilities',
  'character-art',
  'quest-log',
  'achievements',
]);

const WARDEN_TOOL_LABELS: Record<string, string> = {
  'system-console': 'System Console',
  'content-audit': 'Content Audit',
  'art-generation': 'Art Generation',
  'encounter-builder': 'Encounter Builder',
  'initiative-tracker': 'Initiative Tracker',
  'rollable-tables': 'Rollable Tables',
  'gate-generator': 'Rift Generator',
  'npc-generator': 'NPC Generator',
  'treasure-generator': 'Treasure Generator',
  'quest-generator': 'Quest Generator',
  'session-planner': 'Session Planner',
  'random-event-generator': 'Random Event Generator',
  'relic-workshop': 'Relic Workshop',
  'party-tracker': 'Party Tracker',
  'dungeon-map-generator': 'Dungeon Map Generator',
  'token-library': 'Token Library',
  'art-generator': 'Art Generator',
  'audio-manager': 'Audio Manager',
  'vtt-map': 'VTT Map',
};

const resolveTitle = (pathname: string) => {
  if (pathname === '/' || pathname.startsWith('/login')) {
    return `${BASE_TITLE} - Login`;
  }
  if (pathname.startsWith('/setup')) {
    return `${BASE_TITLE} - Setup`;
  }
  if (pathname.startsWith('/landing')) {
    return `${BASE_TITLE} - Landing`;
  }
  if (pathname.startsWith('/player-tools')) {
    const segments = pathname.split('/').filter(Boolean);
    const toolId = segments[1];
    if (toolId && PLAYER_TOOL_LABELS[toolId]) {
      return `${BASE_TITLE} - Player Tools: ${PLAYER_TOOL_LABELS[toolId]}`;
    }
    return `${BASE_TITLE} - Player Tools`;
  }
  if (pathname.startsWith('/compendium')) {
    return `${BASE_TITLE} - Compendium`;
  }
  if (pathname.startsWith('/characters/new')) {
    return `${BASE_TITLE} - Create Character`;
  }
  if (pathname.startsWith('/characters/compare')) {
    return `${BASE_TITLE} - Compare Characters`;
  }
  if (pathname.startsWith('/characters')) {
    return `${BASE_TITLE} - Characters`;
  }
  if (pathname.startsWith('/dice')) {
    return `${BASE_TITLE} - Dice Roller`;
  }
  if (pathname.startsWith('/favorites')) {
    return `${BASE_TITLE} - Favorites`;
  }
  if (pathname.startsWith('/campaigns')) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[1] === 'join') {
      return `${BASE_TITLE} - Join Campaign`;
    }
    if (segments[2] === 'vtt') {
      return `${BASE_TITLE} - VTT`;
    }
    if (segments[2] === 'journal') {
      return `${BASE_TITLE} - Campaign Journal`;
    }
    return `${BASE_TITLE} - Campaigns`;
  }
  if (pathname.startsWith('/dm-tools')) {
    const segments = pathname.split('/').filter(Boolean);
    const toolId = segments[1];
    if (toolId && WARDEN_TOOL_LABELS[toolId]) {
      return `${BASE_TITLE} - Warden Tools: ${WARDEN_TOOL_LABELS[toolId]}`;
    }
    return `${BASE_TITLE} - Warden Tools`;
  }
  if (pathname.startsWith('/admin')) {
    const segments = pathname.split('/').filter(Boolean);
    const adminKey = segments[1] ?? 'system-console';
    const adminLabel = adminKey === 'audit'
      ? 'Content Audit'
      : adminKey === 'art-generation'
        ? 'Art Generation'
        : 'System Console';
    return `${BASE_TITLE} - Warden Tools: ${adminLabel}`;
  }
  if (pathname.startsWith('/auth')) {
    return `${BASE_TITLE} - Auth`;
  }
  return BASE_TITLE;
};

export function RouteEffects() {
  const { pathname } = useLocation();
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const compendiumMatch = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'compendium' || segments.length < 3) return null;
    const type = segments[1];
    const id = segments[2];
    return { type, id };
  }, [pathname]);
  const characterMatch = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'characters' || segments.length < 2) return null;
    const id = segments[1];
    if (id === 'new' || id === 'compare') return null;
    const detail = segments[2] || null;
    return { id, detail };
  }, [pathname]);
  const playerToolMatch = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'player-tools' || segments.length < 2) return null;
    const toolId = segments[1];
    return { toolId };
  }, [pathname]);
  const campaignMatch = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'campaigns' || segments.length < 2) return null;
    const id = segments[1];
    if (id === 'join') return null;
    const detail = segments[2] || null;
    return { id, detail };
  }, [pathname]);

  useEffect(() => {
    setDynamicTitle(null);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    if (!compendiumMatch) return undefined;

    const { type, id } = compendiumMatch;
    if (!isValidEntryType(type)) return undefined;

    const updateTitle = async () => {
      const entry = await resolveRef(type, id);
      if (!active || !entry) return;
      const label = formatMonarchVernacular(COMPENDIUM_LABELS[type] ?? 'Compendium');
      const resolvedName =
        (entry as { display_name?: string | null; title?: string | null }).display_name ||
        (entry as { title?: string | null }).title ||
        entry.name;
      setDynamicTitle(`${BASE_TITLE} - ${label}: ${formatMonarchVernacular(resolvedName)}`);
    };

    void updateTitle();

    return () => {
      active = false;
    };
  }, [compendiumMatch]);

  useEffect(() => {
    let active = true;
    if (!characterMatch) return undefined;

    const { id, detail } = characterMatch;

    const updateTitle = async () => {
      let name: string | null = null;
      if (isLocalCharacterId(id)) {
        name = getLocalCharacterWithAbilities(id)?.name || null;
      } else if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('characters')
          .select('name')
          .eq('id', id)
          .maybeSingle();
        if (!error && data?.name) {
          name = data.name;
        }
      }
      if (!active || !name) return;
      const label = detail === 'level-up' ? 'Level Up' : 'Character';
      setDynamicTitle(`${BASE_TITLE} - ${label}: ${name}`);
    };

    void updateTitle();

    return () => {
      active = false;
    };
  }, [characterMatch]);

  useEffect(() => {
    let active = true;
    if (!playerToolMatch) return undefined;

    const { toolId } = playerToolMatch;
    const label = toolId ? PLAYER_TOOL_LABELS[toolId] : null;
    if (!label) return undefined;

    const updateTitle = async () => {
      if (!PLAYER_TOOLS_WITH_CHARACTER.has(toolId)) {
        setDynamicTitle(`${BASE_TITLE} - Player Tools: ${label}`);
        return;
      }

      const activeId =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(ACTIVE_CHARACTER_STORAGE_KEY)
          : null;
      if (!activeId) {
        setDynamicTitle(`${BASE_TITLE} - Player Tools: ${label}`);
        return;
      }

      let name: string | null = null;
      if (isLocalCharacterId(activeId)) {
        name = getLocalCharacterWithAbilities(activeId)?.name || null;
      } else if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('characters')
          .select('name')
          .eq('id', activeId)
          .maybeSingle();
        if (!error && data?.name) {
          name = data.name;
        }
      }
      if (!active) return;
      const suffix = name ? `: ${name}` : '';
      setDynamicTitle(`${BASE_TITLE} - Player Tools: ${label}${suffix}`);
    };

    void updateTitle();

    return () => {
      active = false;
    };
  }, [playerToolMatch]);

  useEffect(() => {
    let active = true;
    if (!campaignMatch) return undefined;

    const { id, detail } = campaignMatch;

    const updateTitle = async () => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('campaigns')
        .select('name')
        .eq('id', id)
        .maybeSingle();
      if (!active || error || !data?.name) return;
      const label = detail === 'vtt'
        ? 'VTT'
        : detail === 'journal'
          ? 'Campaign Journal'
          : 'Campaign';
      setDynamicTitle(`${BASE_TITLE} - ${label}: ${data.name}`);
    };

    void updateTitle();

    return () => {
      active = false;
    };
  }, [campaignMatch]);

  useEffect(() => {
    const title = dynamicTitle ?? resolveTitle(pathname);
    if (document.title !== title) {
      document.title = title;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [dynamicTitle, pathname]);

  return null;
}



