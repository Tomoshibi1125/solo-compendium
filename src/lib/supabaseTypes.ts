import type { Database } from '@/integrations/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Type-safe table access helpers
export type TableName = keyof Database['public']['Tables'];

// Helper to get table types
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// Type-safe Supabase client extension
export type TypedSupabaseClient = SupabaseClient<Database>;

// Helper function to safely access tables
export function getTable<T extends TableName>(client: SupabaseClient<Database>, table: T) {
  return client.from(table);
}

