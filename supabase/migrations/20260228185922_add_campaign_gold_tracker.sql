-- Add party_gold column to campaigns table
ALTER TABLE public.campaigns
ADD COLUMN party_gold JSONB DEFAULT '{"gp": 0, "sp": 0, "cp": 0, "pp": 0, "ep": 0}'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.campaigns.party_gold IS 'JSON object storing the shared party wealth with 5e coin denominations.';
