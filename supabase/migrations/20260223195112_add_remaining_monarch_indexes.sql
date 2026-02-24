-- Add missing indexes for remaining monarch foreign keys (backwards compatibility)
-- These indexes are needed for the monarch columns we kept for backwards compatibility

-- ============================================================
-- compendium_sovereigns monarch foreign key indexes (for backwards compatibility)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_a_id 
ON public.compendium_sovereigns(monarch_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_b_id 
ON public.compendium_sovereigns(monarch_b_id);

-- ============================================================
-- active_sessions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_active_sessions_created_by 
ON public.active_sessions(created_by);
