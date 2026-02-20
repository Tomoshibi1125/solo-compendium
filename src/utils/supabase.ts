import { supabase } from '@/integrations/supabase/client';

// Re-export the shared Supabase client so legacy imports from "src/utils/supabase" continue to work.
export default supabase;
