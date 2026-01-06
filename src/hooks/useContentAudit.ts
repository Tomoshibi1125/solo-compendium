/**
 * Content Audit Hook
 * 
 * Performs comprehensive audit of database content:
 * - Counts entries per table
 * - Checks data completeness
 * - Identifies missing fields
 * - Analyzes data quality
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logErrorWithContext } from '@/lib/errorHandling';

export interface TableAudit {
  tableName: string;
  totalCount: number;
  withDescription: number;
  withImage: number;
  withSourceBook: number;
  withTags: number;
  missingDescription: number;
  missingImage: number;
  missingSourceBook: number;
  completeness: number; // Percentage
  sampleEntries: Array<{ id: string; name: string }>;
}

export interface ContentAuditReport {
  timestamp: string;
  tables: TableAudit[];
  summary: {
    totalEntries: number;
    totalWithImages: number;
    totalWithDescriptions: number;
    averageCompleteness: number;
    tablesAudited: number;
  };
  recommendations: string[];
}

/**
 * Audit a single compendium table
 */
async function auditTable(tableName: string): Promise<TableAudit> {
  try {
    const table = tableName as keyof Database['public']['Tables'];
    
    // Get total count
    const { count: totalCount } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    // Get entries with descriptions
    const { count: withDescription } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .select('id', { count: 'exact', head: true })
      .not('description', 'is', null)
      .neq('description', '');

    // Get entries with images
    const { count: withImage } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .select('id', { count: 'exact', head: true })
      .not('image_url', 'is', null)
      .neq('image_url', '');

    // Get entries with source_book
    const { count: withSourceBook } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .select('id', { count: 'exact', head: true })
      .not('source_book', 'is', null)
      .neq('source_book', '');

    // Get entries with tags
    const { count: withTags } = await supabase
      .from(table as keyof Database['public']['Tables'])
      .select('id', { count: 'exact', head: true })
      .not('tags', 'is', null);

    // Get sample entries
    const { data: samples } = await supabase
      .from(table as keyof Database['public']['Tables'])
      .select('id, name')
      .limit(5);

    const total = totalCount || 0;
    const missingDescription = total - (withDescription || 0);
    const missingImage = total - (withImage || 0);
    const missingSourceBook = total - (withSourceBook || 0);

    // Calculate completeness (weighted average)
    const completeness = total > 0
      ? Math.round(
          ((withDescription || 0) / total * 0.4 +
           (withImage || 0) / total * 0.3 +
           (withSourceBook || 0) / total * 0.2 +
           (withTags || 0) / total * 0.1) * 100
        )
      : 0;

    return {
      tableName,
      totalCount: total,
      withDescription: withDescription || 0,
      withImage: withImage || 0,
      withSourceBook: withSourceBook || 0,
      withTags: withTags || 0,
      missingDescription,
      missingImage,
      missingSourceBook,
      completeness,
      sampleEntries: (samples ? (samples as unknown[]).filter((item): item is { id: string; name: string } => {
        if (typeof item !== 'object' || item === null) return false;
        const obj = item as Record<string, unknown>;
        if (!('id' in obj) || !('name' in obj)) return false;
        if (typeof obj.id !== 'string' || typeof obj.name !== 'string') return false;
        return true;
      }) : []),
    };
  } catch (error) {
    logErrorWithContext(error, `auditTable:${tableName}`);
    return {
      tableName,
      totalCount: 0,
      withDescription: 0,
      withImage: 0,
      withSourceBook: 0,
      withTags: 0,
      missingDescription: 0,
      missingImage: 0,
      missingSourceBook: 0,
      completeness: 0,
      sampleEntries: [],
    };
  }
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(report: ContentAuditReport): string[] {
  const recommendations: string[] = [];
  const { summary, tables } = report;

  // Overall completeness
  if (summary.averageCompleteness < 50) {
    recommendations.push('⚠️ Overall content completeness is below 50%. Consider adding missing descriptions and images.');
  } else if (summary.averageCompleteness < 75) {
    recommendations.push('ℹ️ Content completeness is good but could be improved. Focus on adding missing images.');
  }

  // Image coverage
  const imageCoverage = (summary.totalWithImages / summary.totalEntries) * 100;
  if (imageCoverage < 30) {
    recommendations.push('🖼️ Less than 30% of entries have images. Consider generating or adding images for better visual appeal.');
  }

  // Description coverage
  const descriptionCoverage = (summary.totalWithDescriptions / summary.totalEntries) * 100;
  if (descriptionCoverage < 80) {
    recommendations.push('📝 Some entries are missing descriptions. Add descriptions to improve content quality.');
  }

  // Table-specific recommendations
  tables.forEach((table) => {
    if (table.totalCount === 0) {
      recommendations.push(`📋 ${table.tableName} table is empty. Consider adding content.`);
    } else if (table.completeness < 50) {
      recommendations.push(`⚠️ ${table.tableName} has low completeness (${table.completeness}%). Review and improve entries.`);
    }
  });

  // Source book coverage
  const tablesMissingSource = tables.filter(t => t.missingSourceBook > t.totalCount * 0.1);
  if (tablesMissingSource.length > 0) {
    recommendations.push('📚 Some entries are missing source book information. Add source_book for better provenance tracking.');
  }

  return recommendations;
}

/**
 * Hook to perform content audit
 */
export function useContentAudit() {
  return useQuery({
    queryKey: ['content-audit'],
    queryFn: async (): Promise<ContentAuditReport> => {
      // List of compendium tables to audit
      const tablesToAudit = [
        'compendium_jobs',
        'compendium_job_paths',
        'compendium_job_features',
        'compendium_powers',
        'compendium_relics',
        'compendium_equipment',
        'compendium_monsters',
        'compendium_backgrounds',
        'compendium_conditions',
        'compendium_feats',
        'compendium_skills',
        'compendium_monarchs',
        'compendium_monarch_features',
        'compendium_sovereigns',
        'compendium_sovereign_features',
        'compendium_runes',
        'compendium_shadow_soldiers',
      ];

      // Audit all tables in parallel
      const tableAudits = await Promise.all(
        tablesToAudit.map(table => auditTable(table))
      );

      // Filter out tables that don't exist or have errors
      const validAudits = tableAudits.filter(audit => audit.totalCount >= 0);

      // Calculate summary
      const totalEntries = validAudits.reduce((sum, audit) => sum + audit.totalCount, 0);
      const totalWithImages = validAudits.reduce((sum, audit) => sum + audit.withImage, 0);
      const totalWithDescriptions = validAudits.reduce((sum, audit) => sum + audit.withDescription, 0);
      const averageCompleteness = validAudits.length > 0
        ? Math.round(
            validAudits.reduce((sum, audit) => sum + audit.completeness, 0) / validAudits.length
          )
        : 0;

      const report: ContentAuditReport = {
        timestamp: new Date().toISOString(),
        tables: validAudits,
        summary: {
          totalEntries,
          totalWithImages,
          totalWithDescriptions,
          averageCompleteness,
          tablesAudited: validAudits.length,
        },
        recommendations: [],
      };

      // Generate recommendations
      report.recommendations = generateRecommendations(report);

      return report;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
}

