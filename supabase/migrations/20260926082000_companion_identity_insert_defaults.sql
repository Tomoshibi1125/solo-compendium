-- C1's BEFORE INSERT triggers create the registry row, but the NOT NULL
-- mapping columns otherwise look required to generated API clients. Give each
-- new row a stable proposed identity before its trigger creates the instance.
BEGIN;

ALTER TABLE public.character_extras
  ALTER COLUMN companion_instance_id SET DEFAULT gen_random_uuid();
ALTER TABLE public.character_tamed_anomalies
  ALTER COLUMN companion_instance_id SET DEFAULT gen_random_uuid();
ALTER TABLE public.campaign_tamed_anomalies
  ALTER COLUMN companion_instance_id SET DEFAULT gen_random_uuid();

COMMIT;
