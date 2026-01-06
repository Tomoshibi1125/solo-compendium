/**
 * Content Audit Page
 * 
 * Displays comprehensive database content audit report.
 * Shows statistics, completeness metrics, and recommendations.
 */

import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentAudit, type ContentAuditReport } from '@/hooks/useContentAudit';
import { 
  FileText, 
  Image, 
  Book, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Download,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

function AuditTable({ report }: { report: ContentAuditReport }) {
  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-400';
    if (completeness >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompletenessBadge = (completeness: number) => {
    if (completeness >= 80) return 'default';
    if (completeness >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Table Statistics
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Table</th>
              <th className="text-right p-2">Total</th>
              <th className="text-right p-2">With Desc</th>
              <th className="text-right p-2">With Image</th>
              <th className="text-right p-2">With Source</th>
              <th className="text-right p-2">Completeness</th>
            </tr>
          </thead>
          <tbody>
            {report.tables
              .filter(table => table.totalCount > 0)
              .sort((a, b) => b.totalCount - a.totalCount)
              .map((table) => (
                <tr key={table.tableName} className="border-b hover:bg-muted/30">
                  <td className="p-2 font-medium">{table.tableName.replace('compendium_', '')}</td>
                  <td className="text-right p-2">{table.totalCount.toLocaleString()}</td>
                  <td className="text-right p-2">
                    {table.withDescription} ({Math.round((table.withDescription / table.totalCount) * 100)}%)
                  </td>
                  <td className="text-right p-2">
                    {table.withImage} ({Math.round((table.withImage / table.totalCount) * 100)}%)
                  </td>
                  <td className="text-right p-2">
                    {table.withSourceBook} ({Math.round((table.withSourceBook / table.totalCount) * 100)}%)
                  </td>
                  <td className="text-right p-2">
                    <Badge variant={getCompletenessBadge(table.completeness)}>
                      {table.completeness}%
                    </Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCards({ report }: { report: ContentAuditReport }) {
  const { summary } = report;

  const imageCoverage = summary.totalEntries > 0
    ? Math.round((summary.totalWithImages / summary.totalEntries) * 100)
    : 0;

  const descriptionCoverage = summary.totalEntries > 0
    ? Math.round((summary.totalWithDescriptions / summary.totalEntries) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SystemWindow title="TOTAL ENTRIES" className="text-center">
        <div className="text-3xl font-bold text-primary">{summary.totalEntries.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1">
          Across {summary.tablesAudited} tables
        </div>
      </SystemWindow>

      <SystemWindow title="COMPLETENESS" className="text-center">
        <div className={cn(
          "text-3xl font-bold",
          summary.averageCompleteness >= 80 ? "text-green-400" :
          summary.averageCompleteness >= 60 ? "text-yellow-400" : "text-red-400"
        )}>
          {summary.averageCompleteness}%
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Average across all tables
        </div>
      </SystemWindow>

      <SystemWindow title="WITH IMAGES" className="text-center">
        <div className="text-3xl font-bold text-blue-400">{imageCoverage}%</div>
        <div className="text-sm text-muted-foreground mt-1">
          {summary.totalWithImages.toLocaleString()} entries
        </div>
      </SystemWindow>

      <SystemWindow title="WITH DESCRIPTIONS" className="text-center">
        <div className="text-3xl font-bold text-green-400">{descriptionCoverage}%</div>
        <div className="text-sm text-muted-foreground mt-1">
          {summary.totalWithDescriptions.toLocaleString()} entries
        </div>
      </SystemWindow>
    </div>
  );
}

function Recommendations({ recommendations }: { recommendations: string[] }) {
  if (recommendations.length === 0) {
    return (
      <SystemWindow title="RECOMMENDATIONS">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>All content looks good! No recommendations at this time.</span>
        </div>
      </SystemWindow>
    );
  }

  return (
    <SystemWindow title="RECOMMENDATIONS">
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-2 p-2 rounded bg-muted/30">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{rec}</span>
          </div>
        ))}
      </div>
    </SystemWindow>
  );
}

export function ContentAudit() {
  const { data: report, isLoading, error } = useContentAudit();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['content-audit'] });
  };

  const handleExport = () => {
    if (!report) return;

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <SystemWindow title="CONTENT AUDIT">
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <SystemWindow title="CONTENT AUDIT" variant="alert">
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground">
                Failed to load audit report. Please try again.
              </p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Audit</h1>
              <p className="text-muted-foreground">
                Comprehensive database content analysis and quality metrics
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <SummaryCards report={report} />

          {/* Recommendations */}
          <Recommendations recommendations={report.recommendations} />

          {/* Detailed Table Statistics */}
          <SystemWindow title="DETAILED STATISTICS">
            <AuditTable report={report} />
          </SystemWindow>

          {/* Empty Tables */}
          {report.tables.filter(t => t.totalCount === 0).length > 0 && (
            <SystemWindow title="EMPTY TABLES" variant="alert">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  The following tables have no entries:
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.tables
                    .filter(t => t.totalCount === 0)
                    .map((table) => (
                      <Badge key={table.tableName} variant="outline">
                        {table.tableName.replace('compendium_', '')}
                      </Badge>
                    ))}
                </div>
              </div>
            </SystemWindow>
          )}
        </div>
      </div>
    </Layout>
  );
}

