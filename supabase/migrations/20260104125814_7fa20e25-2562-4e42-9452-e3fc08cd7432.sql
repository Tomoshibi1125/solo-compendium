-- Fix function search_path security warnings
ALTER FUNCTION generate_share_code() SET search_path = public;
ALTER FUNCTION create_campaign_with_code(TEXT, TEXT, UUID) SET search_path = public;
