-- Add warden broadcast targeting to campaign_messages
ALTER TABLE IF EXISTS public.campaign_messages
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'chat',
  ADD COLUMN IF NOT EXISTS target_user_ids UUID[] DEFAULT NULL;

-- Update the existing Row Level Security (RLS) policies for campaign_messages
-- 1. "Users can view messages in their campaigns" needs to check target_user_ids!
-- Let's drop the original SELECT policy so we can recreate it:
DROP POLICY IF EXISTS "Users can view messages in their campaigns" ON public.campaign_messages;

CREATE POLICY "Users can view messages in their campaigns"
  ON public.campaign_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_messages.campaign_id
      AND (
        dm_id = auth.uid() OR EXISTS (
          SELECT 1 FROM campaign_members
          WHERE campaign_id = campaigns.id AND user_id = auth.uid()
        )
      )
    )
    AND (
      -- If target_user_ids is null or empty, it's public to campaign members.
      -- If it's not null, only members in the array OR the DM can view it.
      -- Or the user who sent it can view it.
      (target_user_ids IS NULL OR array_length(target_user_ids, 1) IS NULL) OR
      (auth.uid() = ANY(target_user_ids)) OR
      (user_id = auth.uid()) OR
      EXISTS (
        SELECT 1 FROM campaigns
        WHERE id = campaign_messages.campaign_id AND dm_id = auth.uid()
      )
    )
  );
