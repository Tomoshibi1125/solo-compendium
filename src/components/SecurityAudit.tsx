import { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bug, 
  Server, 
  TrendingUp, 
  RefreshCw, 
  Download, 
  Info, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface SecurityVulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'infrastructure' | 'code' | 'configuration';
  status: 'open' | 'in-progress' | 'resolved' | 'false-positive';
  discoveredAt: Date;
  resolvedAt?: Date;
  discoveredBy: string;
  assignedTo?: string;
  cwe?: string;
  cvss?: number;
  affectedComponents: string[];
  remediation: string;
  references: string[];
  evidence?: string;
  exploitAvailable: boolean;
  priority: number;
}

type VulnerabilityFilters = {
  severity?: SecurityVulnerability['severity'];
  category?: SecurityVulnerability['category'];
  status?: SecurityVulnerability['status'];
  limit?: number;
  offset?: number;
};

export interface SecurityScan {
  id: string;
  name: string;
  type: 'automated' | 'manual' | 'penetration' | 'code-review' | 'configuration';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  vulnerabilities: SecurityVulnerability[];
  coverage: {
    total: number;
    scanned: number;
    percentage: number;
  };
  config: SecurityScanConfig;
  results: SecurityScanResults;
}

export interface SecurityScanConfig {
  target: string;
  type: 'automated' | 'manual' | 'penetration' | 'code-review' | 'configuration';
  depth: 'shallow' | 'medium' | 'deep';
  includeTests: boolean;
  includeDependencies: boolean;
  includeInfrastructure: boolean;
  customRules: string[];
  exclusions: string[];
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

export interface SecurityScanResults {
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  categories: Record<string, {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  }>;
  trends: Array<{
    date: Date;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  }>;
  recommendations: string[];
}

export interface SecurityMetrics {
  overallScore: number;
  vulnerabilityCount: number;
  resolvedCount: number;
  averageResolutionTime: number;
  scanFrequency: number;
  coverage: number;
  complianceScore: number;
  riskScore: number;
  trends: Array<{
    date: Date;
    score: number;
    vulnerabilities: number;
  }>;
}

export class SecurityAuditManager {
  private apiBase: string;
  private apiKey: string;

  constructor(apiBase: string, apiKey: string) {
    this.apiBase = apiBase;
    this.apiKey = apiKey;
  }

  async runSecurityScan(config: SecurityScanConfig): Promise<SecurityScan> {
    try {
      const response = await fetch(`${this.apiBase}/security/scans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Security scan failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to run security scan:', error);
      throw error;
    }
  }

  async getScans(): Promise<SecurityScan[]> {
    try {
      const response = await fetch(`${this.apiBase}/security/scans`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch scans: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get scans:', error);
      throw error;
    }
  }

  async getScan(id: string): Promise<SecurityScan> {
    try {
      const response = await fetch(`${this.apiBase}/security/scans/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get scan: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get scan:', error);
      throw error;
    }
  }

  async getVulnerabilities(filters?: VulnerabilityFilters): Promise<SecurityVulnerability[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    try {
      const response = await fetch(`${this.apiBase}/security/vulnerabilities?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vulnerabilities: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get vulnerabilities:', error);
      throw error;
    }
  }

  async updateVulnerability(id: string, updates: Partial<SecurityVulnerability>): Promise<SecurityVulnerability> {
    try {
      const response = await fetch(`${this.apiBase}/security/vulnerabilities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update vulnerability: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to update vulnerability:', error);
      throw error;
    }
  }

  async getMetrics(): Promise<SecurityMetrics> {
    try {
      const response = await fetch(`${this.apiBase}/security/metrics`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get metrics:', error);
      throw error;
    }
  }

  async generateReport(scanId: string, format: 'json' | 'pdf' | 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiBase}/security/scans/${scanId}/report?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      logger.error('Failed to generate report:', error);
      throw error;
    }
  }

  async runPenetrationTest(config: SecurityScanConfig): Promise<SecurityScan> {
    const penTestConfig = {
      ...config,
      type: 'penetration' as const,
      depth: 'deep' as const,
    };

    return this.runSecurityScan(penTestConfig);
  }

  async runCodeReview(target: string): Promise<SecurityScan> {
    const config: SecurityScanConfig = {
      target,
      type: 'code-review',
      depth: 'medium',
      includeTests: true,
      includeDependencies: true,
      includeInfrastructure: false,
      customRules: [],
      exclusions: [],
    };

    return this.runSecurityScan(config);
  }

  async runInfrastructureScan(target: string): Promise<SecurityScan> {
    const config: SecurityScanConfig = {
      target,
      type: 'configuration',
      depth: 'deep',
      includeTests: false,
      includeDependencies: false,
      includeInfrastructure: true,
      customRules: [],
      exclusions: [],
    };

    return this.runSecurityScan(config);
  }
}

// React hook for security audit functionality
export function useSecurityAudit() {
  const [scans, setScans] = useState<SecurityScan[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<SecurityVulnerability[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const auditManager = useMemo(
    () =>
      new SecurityAuditManager(
        process.env.SECURITY_API_URL || 'https://api.solo-compendium.com',
        process.env.SECURITY_API_KEY || ''
      ),
    []
  );

  const fetchScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const scanData = await auditManager.getScans();
      setScans(scanData);
    } catch (error) {
      logger.error('Failed to fetch security scans:', error);
      setError('Failed to fetch security scans');
      toast({
        title: 'Error',
        description: 'Could not load security scans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [auditManager, toast]);

  const fetchVulnerabilities = useCallback(async (filters?: VulnerabilityFilters) => {
    try {
      const vulnData = await auditManager.getVulnerabilities(filters);
      setVulnerabilities(vulnData);
    } catch (error) {
      logger.error('Failed to fetch vulnerabilities:', error);
      toast({
        title: 'Error',
        description: 'Could not load vulnerabilities',
        variant: 'destructive',
      });
    }
  }, [auditManager, toast]);

  const fetchMetrics = useCallback(async () => {
    try {
      const metricsData = await auditManager.getMetrics();
      setMetrics(metricsData);
    } catch (error) {
      logger.error('Failed to fetch metrics:', error);
    }
  }, [auditManager]);

  const runSecurityScan = useCallback(async (config: SecurityScanConfig) => {
    setLoading(true);
    
    try {
      const scan = await auditManager.runSecurityScan(config);
      setScans(prev => [scan, ...prev]);
      
      toast({
        title: 'Security Scan Started',
        description: `${scan.name} is now running`,
      });
      
      return scan;
    } catch (error) {
      toast({
        title: 'Scan Failed',
        description: 'Could not start security scan',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auditManager, toast]);

  const runPenetrationTest = useCallback(async (target: string) => {
    const config: SecurityScanConfig = {
      target,
      type: 'penetration',
      depth: 'deep',
      includeTests: true,
      includeDependencies: true,
      includeInfrastructure: true,
      customRules: [],
      exclusions: [],
    };

    return runSecurityScan(config);
  }, [runSecurityScan]);

  const updateVulnerability = useCallback(async (id: string, updates: Partial<SecurityVulnerability>) => {
    try {
      const updated = await auditManager.updateVulnerability(id, updates);
      setVulnerabilities(prev => prev.map(v => v.id === id ? updated : v));
      
      toast({
        title: 'Vulnerability Updated',
        description: 'Status has been updated successfully',
      });
      
      return updated;
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update vulnerability',
        variant: 'destructive',
      });
      throw error;
    }
  }, [auditManager, toast]);

  const generateReport = useCallback(async (scanId: string, format: 'json' | 'pdf' | 'csv' = 'pdf') => {
    try {
      const blob = await auditManager.generateReport(scanId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${scanId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Report Generated',
        description: `Security report has been downloaded`,
      });
    } catch (error) {
      logger.error('Failed to generate security report:', error);
      toast({
        title: 'Report Failed',
        description: 'Could not generate security report',
        variant: 'destructive',
      });
    }
  }, [auditManager, toast]);

  useEffect(() => {
    fetchScans();
    fetchVulnerabilities();
    fetchMetrics();
  }, [fetchScans, fetchVulnerabilities, fetchMetrics]);

  return {
    scans,
    vulnerabilities,
    metrics,
    loading,
    error,
    runSecurityScan,
    runPenetrationTest,
    updateVulnerability,
    generateReport,
    refresh: () => {
      fetchScans();
      fetchVulnerabilities();
      fetchMetrics();
    },
  };
}

// React component for security dashboard
export function SecurityDashboard() {
  const {
    scans,
    vulnerabilities,
    metrics,
    loading,
    runSecurityScan,
    runPenetrationTest,
    generateReport,
    refresh
  } = useSecurityAudit();

  const getSeverityColor = (severity: SecurityVulnerability['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'info': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: SecurityVulnerability['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const criticalVulnerabilities = vulnerabilities.filter(v => v.severity === 'critical');
  const highVulnerabilities = vulnerabilities.filter(v => v.severity === 'high');
  const openVulnerabilities = vulnerabilities.filter(v => v.status === 'open');

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Audit</h1>
          <p className="text-muted-foreground">
            Comprehensive security monitoring and vulnerability management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.overallScore}/100</div>
              <Progress value={metrics.overallScore} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Vulnerabilities</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{openVulnerabilities.length}</div>
              <p className="text-xs text-muted-foreground">
                {criticalVulnerabilities.length} critical, {highVulnerabilities.length} high
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.riskScore}</div>
              <p className="text-xs text-muted-foreground">
                Lower is better
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
              <Progress value={metrics.complianceScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Vulnerabilities Alert */}
      {criticalVulnerabilities.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Security Alert:</strong> {criticalVulnerabilities.length} critical vulnerabilities detected. 
            Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => runSecurityScan({
                target: 'application',
                type: 'automated',
                depth: 'medium',
                includeTests: true,
                includeDependencies: true,
                includeInfrastructure: false,
                customRules: [],
                exclusions: [],
              })}
              disabled={loading}
              className="w-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              Run Security Scan
            </Button>
            
            <Button 
              onClick={() => runPenetrationTest('application')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Bug className="w-4 h-4 mr-2" />
              Penetration Test
            </Button>
            
            <Button 
              onClick={() => runSecurityScan({
                target: 'infrastructure',
                type: 'configuration',
                depth: 'deep',
                includeTests: false,
                includeDependencies: false,
                includeInfrastructure: true,
                customRules: [],
                exclusions: [],
              })}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Server className="w-4 h-4 mr-2" />
              Infrastructure Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No scans yet</h3>
              <p className="text-sm text-muted-foreground">
                Run your first security scan to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      scan.status === 'completed' ? 'bg-green-500' :
                      scan.status === 'running' ? 'bg-blue-500 animate-pulse' :
                      scan.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <h4 className="font-semibold">{scan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {scan.type} - {scan.coverage.percentage}% coverage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {scan.results.summary.critical + scan.results.summary.high} issues
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {scan.completedAt ? new Date(scan.completedAt).toLocaleDateString() : 'In progress'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport(scan.id)}
                      disabled={scan.status !== 'completed'}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Vulnerabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vulnerabilities</CardTitle>
        </CardHeader>
        <CardContent>
          {vulnerabilities.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No vulnerabilities found</h3>
              <p className="text-sm text-muted-foreground">
                Your application appears to be secure
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vulnerabilities.slice(0, 10).map((vulnerability) => (
                <div key={vulnerability.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(vulnerability.severity)}`}>
                      {getSeverityIcon(vulnerability.severity)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{vulnerability.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {vulnerability.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{vulnerability.category}</Badge>
                        <Badge variant="outline">{vulnerability.severity}</Badge>
                        {vulnerability.cwe && (
                          <Badge variant="outline">CWE-{vulnerability.cwe}</Badge>
                        )}
                        {vulnerability.exploitAvailable && (
                          <Badge variant="destructive">Exploit Available</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={vulnerability.status === 'open' ? 'destructive' : 'secondary'}>
                      {vulnerability.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// React component for vulnerability management
export function VulnerabilityManagement() {
  const {
    vulnerabilities,
    updateVulnerability
  } = useSecurityAudit();

  const [filter, setFilter] = useState<{
    severity?: SecurityVulnerability['severity'];
    category?: SecurityVulnerability['category'];
    status?: SecurityVulnerability['status'];
  }>({});

  const filteredVulnerabilities = vulnerabilities.filter(v => {
    if (filter.severity && v.severity !== filter.severity) return false;
    if (filter.category && v.category !== filter.category) return false;
    if (filter.status && v.status !== filter.status) return false;
    return true;
  });

  const handleStatusUpdate = useCallback(async (id: string, status: SecurityVulnerability['status']) => {
    try {
      await updateVulnerability(id, { status, resolvedAt: status === 'resolved' ? new Date() : undefined });
    } catch (error) {
      logger.error('Failed to update vulnerability status:', error);
    }
  }, [updateVulnerability]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vulnerability Management</h1>
          <p className="text-muted-foreground">
            Track and remediate security vulnerabilities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="severity-filter" className="text-sm font-medium">Severity</label>
              <select 
                id="severity-filter"
                className="w-full mt-1 p-2 border rounded"
                value={filter.severity || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  severity: e.target.value as SecurityVulnerability['severity'] || undefined 
                }))}
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="text-sm font-medium">Category</label>
              <select 
                id="category-filter"
                className="w-full mt-1 p-2 border rounded"
                value={filter.category || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  category: e.target.value as SecurityVulnerability['category'] || undefined 
                }))}
              >
                <option value="">All Categories</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="data">Data</option>
                <option value="network">Network</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="code">Code</option>
                <option value="configuration">Configuration</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="text-sm font-medium">Status</label>
              <select 
                id="status-filter"
                className="w-full mt-1 p-2 border rounded"
                value={filter.status || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  status: e.target.value as SecurityVulnerability['status'] || undefined 
                }))}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="false-positive">False Positive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilter({})}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Vulnerabilities ({filteredVulnerabilities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVulnerabilities.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No vulnerabilities found</h3>
              <p className="text-sm text-muted-foreground">
                No vulnerabilities match your current filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVulnerabilities.map((vulnerability) => (
                <div key={vulnerability.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{vulnerability.title}</h3>
                        <Badge variant={vulnerability.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {vulnerability.severity}
                        </Badge>
                        <Badge variant="outline">{vulnerability.category}</Badge>
                        <Badge variant={vulnerability.status === 'open' ? 'destructive' : 'secondary'}>
                          {vulnerability.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {vulnerability.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Affected Components:</h4>
                          <div className="flex flex-wrap gap-1">
                            {vulnerability.affectedComponents.map((component, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-1">Remediation:</h4>
                          <p className="text-sm text-muted-foreground">
                            {vulnerability.remediation}
                          </p>
                        </div>
                      </div>
                      
                      {vulnerability.evidence && (
                        <div className="mb-3">
                          <h4 className="font-medium text-sm mb-1">Evidence:</h4>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {vulnerability.evidence}
                          </pre>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                          Discovered: {new Date(vulnerability.discoveredAt).toLocaleDateString()} by {vulnerability.discoveredBy}
                        </div>
                        <div>
                          Priority: {vulnerability.priority}
                          {vulnerability.cvss && ` - CVSS: ${vulnerability.cvss}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {vulnerability.status === 'open' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(vulnerability.id, 'in-progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {vulnerability.status === 'in-progress' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(vulnerability.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedVulnerability(vulnerability)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main security audit component
export function SecurityAudit() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vulnerabilities'>('dashboard');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'vulnerabilities')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <SecurityDashboard />
        </TabsContent>
        <TabsContent value="vulnerabilities">
          <VulnerabilityManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

