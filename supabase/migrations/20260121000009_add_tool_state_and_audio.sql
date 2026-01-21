-- Shared tool state + persistence tables

-- User tool states (DM/Player tool state snapshots)
CREATE TABLE IF NOT EXISTS public.user_tool_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_key TEXT NOT NULL,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tool_key)
);
CREATE INDEX IF NOT EXISTS user_tool_states_user_id_idx ON public.user_tool_states(user_id);
CREATE INDEX IF NOT EXISTS user_tool_states_tool_key_idx ON public.user_tool_states(tool_key);
ALTER TABLE public.user_tool_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tool_states_select"
  ON public.user_tool_states
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "user_tool_states_insert"
  ON public.user_tool_states
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_tool_states_update"
  ON public.user_tool_states
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "user_tool_states_delete"
  ON public.user_tool_states
  FOR DELETE
  USING (user_id = auth.uid());
CREATE TRIGGER update_user_tool_states_updated_at
  BEFORE UPDATE ON public.user_tool_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.user_tool_states IS 'Persisted user-specific tool state snapshots.';

-- Campaign tool states (shared campaign-level state like VTT scenes)
CREATE TABLE IF NOT EXISTS public.campaign_tool_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  tool_key TEXT NOT NULL,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, tool_key)
);
CREATE INDEX IF NOT EXISTS campaign_tool_states_campaign_id_idx ON public.campaign_tool_states(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_tool_states_tool_key_idx ON public.campaign_tool_states(tool_key);
ALTER TABLE public.campaign_tool_states ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_campaign_system(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND dm_id = p_user_id
  ) OR EXISTS (
    SELECT 1
    FROM public.campaign_members
    WHERE campaign_id = p_campaign_id
      AND user_id = p_user_id
      AND role = 'co-system'
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_campaign_system(UUID, UUID) TO authenticated;
CREATE POLICY "campaign_tool_states_select"
  ON public.campaign_tool_states
  FOR SELECT
  USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_tool_states_insert"
  ON public.campaign_tool_states
  FOR INSERT
  WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_tool_states_update"
  ON public.campaign_tool_states
  FOR UPDATE
  USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_tool_states_delete"
  ON public.campaign_tool_states
  FOR DELETE
  USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_tool_states_updated_at
  BEFORE UPDATE ON public.campaign_tool_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.campaign_tool_states IS 'Persisted campaign-level tool state snapshots.';
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_tool_states;

-- Compendium notes (per-user)
CREATE TABLE IF NOT EXISTS public.compendium_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS compendium_notes_user_id_idx ON public.compendium_notes(user_id);
CREATE INDEX IF NOT EXISTS compendium_notes_entry_idx ON public.compendium_notes(entry_type, entry_id);
ALTER TABLE public.compendium_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "compendium_notes_select"
  ON public.compendium_notes
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "compendium_notes_insert"
  ON public.compendium_notes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "compendium_notes_update"
  ON public.compendium_notes
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "compendium_notes_delete"
  ON public.compendium_notes
  FOR DELETE
  USING (user_id = auth.uid());
CREATE TRIGGER update_compendium_notes_updated_at
  BEFORE UPDATE ON public.compendium_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.compendium_notes IS 'User notes for compendium entries.';

-- VTT journal entries (campaign shared, with player visibility)
CREATE TABLE IF NOT EXISTS public.vtt_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'note' CHECK (category IN ('session', 'note', 'lore', 'handout')),
  visible_to_players BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vtt_journal_entries_campaign_idx ON public.vtt_journal_entries(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vtt_journal_entries_user_idx ON public.vtt_journal_entries(user_id);
ALTER TABLE public.vtt_journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vtt_journal_entries_select"
  ON public.vtt_journal_entries
  FOR SELECT
  USING (
    public.is_campaign_system(campaign_id)
    OR (visible_to_players = true AND public.is_campaign_member(campaign_id))
  );
CREATE POLICY "vtt_journal_entries_insert"
  ON public.vtt_journal_entries
  FOR INSERT
  WITH CHECK (
    public.is_campaign_system(campaign_id)
    AND user_id = auth.uid()
  );
CREATE POLICY "vtt_journal_entries_update"
  ON public.vtt_journal_entries
  FOR UPDATE
  USING (public.is_campaign_system(campaign_id));
CREATE POLICY "vtt_journal_entries_delete"
  ON public.vtt_journal_entries
  FOR DELETE
  USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_vtt_journal_entries_updated_at
  BEFORE UPDATE ON public.vtt_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.vtt_journal_entries IS 'Shared campaign journal entries with player visibility controls.';

-- Audio library (tracks + playlists)
CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  category TEXT NOT NULL,
  duration DOUBLE PRECISION NOT NULL,
  storage_path TEXT NOT NULL,
  volume DOUBLE PRECISION NOT NULL DEFAULT 0.7,
  loop BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  mood TEXT,
  license TEXT NOT NULL DEFAULT 'Custom Upload',
  source TEXT NOT NULL DEFAULT 'Custom Upload',
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audio_tracks_user_id_idx ON public.audio_tracks(user_id);
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audio_tracks_select"
  ON public.audio_tracks
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "audio_tracks_insert"
  ON public.audio_tracks
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "audio_tracks_update"
  ON public.audio_tracks
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "audio_tracks_delete"
  ON public.audio_tracks
  FOR DELETE
  USING (user_id = auth.uid());
CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE ON public.audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.audio_tracks IS 'User audio tracks stored in Supabase Storage.';

CREATE TABLE IF NOT EXISTS public.audio_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tracks TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  auto_play BOOLEAN NOT NULL DEFAULT false,
  shuffle BOOLEAN NOT NULL DEFAULT false,
  repeat TEXT NOT NULL DEFAULT 'none',
  crossfade DOUBLE PRECISION NOT NULL DEFAULT 2,
  volume DOUBLE PRECISION NOT NULL DEFAULT 0.7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audio_playlists_user_id_idx ON public.audio_playlists(user_id);
ALTER TABLE public.audio_playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audio_playlists_select"
  ON public.audio_playlists
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "audio_playlists_insert"
  ON public.audio_playlists
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "audio_playlists_update"
  ON public.audio_playlists
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "audio_playlists_delete"
  ON public.audio_playlists
  FOR DELETE
  USING (user_id = auth.uid());
CREATE TRIGGER update_audio_playlists_updated_at
  BEFORE UPDATE ON public.audio_playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
COMMENT ON TABLE public.audio_playlists IS 'User audio playlists.';

-- Character backups (snapshot storage)
CREATE TABLE IF NOT EXISTS public.character_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  backup_data JSONB NOT NULL,
  backup_name TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS character_backups_user_id_idx ON public.character_backups(user_id);
CREATE INDEX IF NOT EXISTS character_backups_character_id_idx ON public.character_backups(character_id, created_at DESC);
ALTER TABLE public.character_backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "character_backups_select"
  ON public.character_backups
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "character_backups_insert"
  ON public.character_backups
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE id = character_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "character_backups_update"
  ON public.character_backups
  FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "character_backups_delete"
  ON public.character_backups
  FOR DELETE
  USING (user_id = auth.uid());
COMMENT ON TABLE public.character_backups IS 'User character snapshot backups.';

-- Audio storage bucket (private, per-user folder)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-tracks',
  'audio-tracks',
  false,
  52428800,
  ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac', 'audio/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audio-tracks bucket (per-user folder)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Audio tracks are viewable by owner'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Audio tracks are viewable by owner"\n'
        || 'ON storage.objects FOR SELECT\n'
        || 'USING (\n'
        || '  bucket_id = ''audio-tracks'' AND\n'
        || '  auth.role() = ''authenticated'' AND\n'
        || '  (storage.foldername(name))[1] = auth.uid()::text\n'
        || ');';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Audio tracks are insertable by owner'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Audio tracks are insertable by owner"\n'
        || 'ON storage.objects FOR INSERT\n'
        || 'WITH CHECK (\n'
        || '  bucket_id = ''audio-tracks'' AND\n'
        || '  auth.role() = ''authenticated'' AND\n'
        || '  (storage.foldername(name))[1] = auth.uid()::text\n'
        || ');';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Audio tracks are updatable by owner'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Audio tracks are updatable by owner"\n'
        || 'ON storage.objects FOR UPDATE\n'
        || 'USING (\n'
        || '  bucket_id = ''audio-tracks'' AND\n'
        || '  auth.role() = ''authenticated'' AND\n'
        || '  (storage.foldername(name))[1] = auth.uid()::text\n'
        || ');';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Audio tracks are deletable by owner'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Audio tracks are deletable by owner"\n'
        || 'ON storage.objects FOR DELETE\n'
        || 'USING (\n'
        || '  bucket_id = ''audio-tracks'' AND\n'
        || '  auth.role() = ''authenticated'' AND\n'
        || '  (storage.foldername(name))[1] = auth.uid()::text\n'
        || ');';
    END IF;
  END IF;
END $$;
