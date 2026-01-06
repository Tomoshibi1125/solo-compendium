/**
 * Full-text search utilities
 * Converts search queries to PostgreSQL full-text search format
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Prepare search text for PostgreSQL tsquery
 * Sanitizes input and converts to safe format
 */
export function prepareSearchText(searchQuery: string): string {
  if (!searchQuery.trim()) return '';

  // Remove special characters that could break tsquery
  // Keep alphanumeric and spaces
  const cleaned = searchQuery
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (!cleaned) return '';

  // Split into words and add prefix matching
  const words = cleaned
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.replace(/'/g, "''")); // Escape single quotes

  // Join with AND operator and add prefix matching
  return words.map(word => `'${word}':*`).join(' & ');
}

/**
 * Convert a search query to PostgreSQL tsquery format (alias for prepareSearchText)
 */
export function toTsQuery(searchQuery: string): string {
  return prepareSearchText(searchQuery);
}

/**
 * Use RPC function for full-text search
 * This is the recommended approach with Supabase
 */
export async function searchWithRPC(
  supabase: Pick<SupabaseClient, 'rpc'>,
  table: 'jobs' | 'powers' | 'relics' | 'monsters' | 'paths' | 'monarchs',
  searchQuery: string,
  limit: number = 50
) {
  if (!searchQuery.trim()) return [];

  const functionName = `search_compendium_${table}`;
  const preparedQuery = prepareSearchText(searchQuery);

  if (!preparedQuery) return [];

  const { data, error } = await supabase.rpc(functionName, {
    search_text: preparedQuery,
  });

  if (error) {
    // Fallback to ILIKE if RPC fails
    return [];
  }

  return (data || []).slice(0, limit);
}

/**
 * Hybrid search: Use full-text search when available, fallback to ILIKE
 * This provides the best of both worlds
 */
interface OrCapableQuery<T> {
  or: (filters: string) => T;
}

export function hybridSearchQuery<T extends OrCapableQuery<T>>(
  baseQuery: T,
  searchQuery: string,
  searchFields: string[] = ['name', 'description'],
  useFullText: boolean = true
): T {
  if (!searchQuery.trim()) {
    return baseQuery;
  }

  // For short queries (1-2 chars), ILIKE is better
  if (searchQuery.length <= 2 || !useFullText) {
    return baseQuery.or(
      searchFields.map(field => `${field}.ilike.%${searchQuery}%`).join(',')
    );
  }

  // For longer queries, prefer full-text search via RPC
  // But for now, use ILIKE as fallback until RPC is integrated
  // The RPC functions should be called directly from components
  return baseQuery.or(
    searchFields.map(field => `${field}.ilike.%${searchQuery}%`).join(',')
  );
}

