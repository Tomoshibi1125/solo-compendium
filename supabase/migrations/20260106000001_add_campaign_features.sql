-- Campaign Chat Messages
CREATE TABLE IF NOT EXISTS campaign_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Notes/Session Logs
CREATE TABLE IF NOT EXISTS campaign_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'session' CHECK (note_type IN ('session', 'note', 'recap')),
  session_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Character Shares (for sharing character sheets)
CREATE TABLE IF NOT EXISTS campaign_character_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, character_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS campaign_messages_campaign_id_idx ON campaign_messages(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS campaign_messages_user_id_idx ON campaign_messages(user_id);
CREATE INDEX IF NOT EXISTS campaign_notes_campaign_id_idx ON campaign_notes(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS campaign_notes_user_id_idx ON campaign_notes(user_id);
CREATE INDEX IF NOT EXISTS campaign_character_shares_campaign_id_idx ON campaign_character_shares(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_character_shares_character_id_idx ON campaign_character_shares(character_id);

-- RLS Policies for campaign_messages
ALTER TABLE campaign_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their campaigns"
  ON campaign_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_messages.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can send messages in their campaigns"
  ON campaign_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_messages.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can edit their own messages"
  ON campaign_messages FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages, DMs can delete any"
  ON campaign_messages FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_messages.campaign_id AND dm_id = auth.uid()
    )
  );

-- RLS Policies for campaign_notes
ALTER TABLE campaign_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes in their campaigns"
  ON campaign_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_notes.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can create notes in their campaigns"
  ON campaign_notes FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_notes.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can edit their own notes, DMs can edit any"
  ON campaign_notes FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_notes.campaign_id AND dm_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own notes, DMs can delete any"
  ON campaign_notes FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_notes.campaign_id AND dm_id = auth.uid()
    )
  );

-- RLS Policies for campaign_character_shares
ALTER TABLE campaign_character_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shared characters in their campaigns"
  ON campaign_character_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_character_shares.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can share their own characters"
  ON campaign_character_shares FOR INSERT
  WITH CHECK (
    shared_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM characters
      WHERE id = campaign_character_shares.character_id AND user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_character_shares.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members
        WHERE campaign_id = campaigns.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can update their own shares"
  ON campaign_character_shares FOR UPDATE
  USING (shared_by = auth.uid());

CREATE POLICY "Users can delete their own shares"
  ON campaign_character_shares FOR DELETE
  USING (shared_by = auth.uid());

-- Updated_at triggers
CREATE TRIGGER update_campaign_messages_updated_at
  BEFORE UPDATE ON campaign_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_notes_updated_at
  BEFORE UPDATE ON campaign_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get campaign member count
CREATE OR REPLACE FUNCTION get_campaign_member_count(p_campaign_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM campaign_members
    WHERE campaign_id = p_campaign_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

