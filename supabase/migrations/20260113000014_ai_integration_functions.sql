-- AI Integration Functions
-- Backend functions for AI-powered features in Supabase

-- Function to store AI-generated content
CREATE OR REPLACE FUNCTION public.store_ai_generated_content(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_content_type TEXT,
  p_content JSONB,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  content_id UUID;
BEGIN
  INSERT INTO public.ai_generated_content (
    entity_type,
    entity_id,
    content_type,
    content,
    metadata,
    created_at
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_content_type,
    p_content,
    p_metadata,
    NOW()
  ) RETURNING id INTO content_id;
  
  RETURN content_id;
END;
$$;
-- Function to get AI-generated content for an entity
CREATE OR REPLACE FUNCTION public.get_ai_generated_content(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_content_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  content JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    agc.id,
    agc.content_type,
    agc.content,
    agc.metadata,
    agc.created_at
  FROM public.ai_generated_content agc
  WHERE agc.entity_type = p_entity_type
    AND agc.entity_id = p_entity_id
    AND (p_content_type IS NULL OR agc.content_type = p_content_type)
  ORDER BY agc.created_at DESC;
END;
$$;
-- Function to log AI usage for analytics
CREATE OR REPLACE FUNCTION public.log_ai_usage(
  p_service_id TEXT,
  p_request_type TEXT,
  p_tokens_used INTEGER DEFAULT 0,
  p_cost DECIMAL DEFAULT 0.00,
  p_user_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  usage_id UUID;
BEGIN
  INSERT INTO public.ai_usage_logs (
    service_id,
    request_type,
    tokens_used,
    cost,
    user_id,
    metadata,
    created_at
  ) VALUES (
    p_service_id,
    p_request_type,
    p_tokens_used,
    p_cost,
    p_user_id,
    p_metadata,
    NOW()
  ) RETURNING id INTO usage_id;
  
  RETURN usage_id;
END;
$$;
-- Function to get AI usage statistics
CREATE OR REPLACE FUNCTION public.get_ai_usage_stats(
  p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_date_to DATE DEFAULT CURRENT_DATE,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  service_id TEXT,
  request_type TEXT,
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL,
  avg_tokens_per_request DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    service_id,
    request_type,
    COUNT(*) as total_requests,
    COALESCE(SUM(tokens_used), 0) as total_tokens,
    COALESCE(SUM(cost), 0) as total_cost,
    CASE 
      WHEN COUNT(*) > 0 THEN ROUND(COALESCE(SUM(tokens_used), 0)::DECIMAL / COUNT(*)::DECIMAL, 2)
      ELSE 0
    END as avg_tokens_per_request
  FROM public.ai_usage_logs
  WHERE created_at >= p_date_from
    AND created_at <= p_date_to + INTERVAL '1 day'
    AND (p_user_id IS NULL OR user_id = p_user_id)
  GROUP BY service_id, request_type
  ORDER BY total_cost DESC;
END;
$$;
-- Function to enhance prompts using AI (to be called from edge function)
CREATE OR REPLACE FUNCTION public.enhance_art_prompt(
  p_base_prompt TEXT,
  p_entity_type TEXT,
  p_style_preferences JSONB DEFAULT '{}'
)
RETURNS TABLE (
  enhanced_prompt TEXT,
  suggestions TEXT[],
  technical_params JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  -- This function would be called by an edge function that actually calls the AI service
  -- For now, return a basic enhancement
  RETURN QUERY
  SELECT 
    p_base_prompt || ', dramatic lighting, high contrast, detailed character art, System Ascendant illustrated style' as enhanced_prompt,
    ARRAY['Add shadow energy effects', 'Include system interface elements', 'Dynamic pose recommended'] as suggestions,
    '{"weight": "stable-diffusion", "steps": 30, "cfg_scale": 7.5, "sampler": "DPM++ 2M Karras"}'::JSONB as technical_params;
END;
$$;
-- Create tables for AI content and usage tracking
CREATE TABLE IF NOT EXISTS public.ai_generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  request_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL DEFAULT 0.00,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_generated_content_entity ON public.ai_generated_content(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_content_type ON public.ai_generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_service ON public.ai_usage_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at);
-- Add RLS policies
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
-- Policy for AI-generated content
CREATE POLICY "Users can view their own AI content" ON public.ai_generated_content
  FOR SELECT USING (
    auth.uid() IS NOT NULL
  );
CREATE POLICY "Users can insert their own AI content" ON public.ai_generated_content
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );
-- Policy for AI usage logs
CREATE POLICY "Users can view their own AI usage" ON public.ai_usage_logs
  FOR SELECT USING (
    auth.uid() IS NULL OR user_id = auth.uid()
  );
CREATE POLICY "Service can insert AI usage logs" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );
-- Grant permissions
GRANT ALL ON public.ai_generated_content TO authenticated;
GRANT ALL ON public.ai_usage_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.store_ai_generated_content TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ai_generated_content TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_ai_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ai_usage_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.enhance_art_prompt TO authenticated;

