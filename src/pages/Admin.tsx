import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { parseJSONContent, importContentBundle, type ImportResult } from '@/lib/contentImporter';
import { validateContentBundle, type ValidationResult } from '@/lib/contentValidator';
import { cn } from '@/lib/utils';

const Admin = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [overwrite, setOverwrite] = useState(false);

  const handleValidate = () => {
    try {
      const parsed = parseJSONContent(content);
      const result = validateContentBundle(parsed);
      setValidationResult(result);
      
      if (result.valid) {
        toast({
          title: 'Validation successful',
          description: 'Content bundle is valid and ready to import.',
        });
      } else {
        toast({
          title: 'Validation failed',
          description: `Found ${result.errors.length} error(s).`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Parse error',
        description: error instanceof Error ? error.message : 'Failed to parse JSON',
        variant: 'destructive',
      });
      setValidationResult({
        valid: false,
        errors: [{ path: 'root', message: error instanceof Error ? error.message : 'Parse error' }],
        warnings: [],
      });
    }
  };

  const handleImport = async () => {
    if (!validationResult || !validationResult.valid) {
      toast({
        title: 'Validation required',
        description: 'Please validate the content first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const parsed = parseJSONContent(content);
      const result = await importContentBundle(parsed, { dryRun, overwrite });
      setImportResult(result);

      if (result.success) {
        toast({
          title: dryRun ? 'Dry run complete' : 'Import successful',
          description: `Imported ${Object.values(result.imported).reduce((a, b) => a + b, 0)} items.`,
        });
      } else {
        toast({
          title: 'Import failed',
          description: `Encountered ${result.errors.length} error(s).`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Import error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      setValidationResult(null);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            CONTENT ADMIN
          </h1>
          <p className="text-muted-foreground font-heading">
            Import and validate homebrew content for the compendium
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <SystemWindow title="IMPORT CONTENT">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload JSON File</Label>
                  <div className="mt-2">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="w-full gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Or Paste JSON Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setValidationResult(null);
                      setImportResult(null);
                    }}
                    placeholder='{"jobs": [...], "powers": [...], ...}'
                    className="mt-2 font-mono text-sm min-h-[300px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dry-run"
                    checked={dryRun}
                    onCheckedChange={(checked) => setDryRun(checked === true)}
                  />
                  <Label htmlFor="dry-run" className="cursor-pointer">
                    Dry run (validate only, don't import)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite"
                    checked={overwrite}
                    onCheckedChange={(checked) => setOverwrite(checked === true)}
                  />
                  <Label htmlFor="overwrite" className="cursor-pointer">
                    Overwrite existing entries
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleValidate}
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={!content.trim()}
                  >
                    <FileText className="w-4 h-4" />
                    Validate
                  </Button>
                  <Button
                    onClick={handleImport}
                    className="flex-1 gap-2"
                    disabled={!content.trim() || loading || (validationResult && !validationResult.valid)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {dryRun ? 'Dry Run' : 'Import'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SystemWindow>

            {/* Example Template */}
            <SystemWindow title="EXAMPLE TEMPLATE" variant="quest">
              <Button
                variant="outline"
                onClick={() => {
                  const example = {
                    version: "1.0.0",
                    jobs: [
                      {
                        name: "Example Job",
                        description: "An example job for testing",
                        primary_abilities: ["STR", "AGI"],
                        saving_throw_proficiencies: ["STR", "AGI"],
                        hit_die: 10,
                        source_kind: "homebrew",
                        source_name: "Solo Compendium Homebrew",
                      }
                    ],
                  };
                  setContent(JSON.stringify(example, null, 2));
                }}
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                Load Example Template
              </Button>
            </SystemWindow>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Validation Results */}
            {validationResult && (
              <SystemWindow
                title="VALIDATION RESULTS"
                className={cn(
                  validationResult.valid ? "border-green-500/30" : "border-destructive/30"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {validationResult.valid ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-heading font-semibold text-green-400">Valid</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span className="font-heading font-semibold text-destructive">Invalid</span>
                      </>
                    )}
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-destructive mb-2">
                        Errors ({validationResult.errors.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {validationResult.errors.map((error, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20">
                            <div className="font-mono text-xs text-muted-foreground">{error.path}</div>
                            <div>{error.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-amber-400 mb-2">
                        Warnings ({validationResult.warnings.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {validationResult.warnings.map((warning, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            <div className="font-mono text-xs text-muted-foreground">{warning.path}</div>
                            <div>{warning.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SystemWindow>
            )}

            {/* Import Results */}
            {importResult && (
              <SystemWindow
                title="IMPORT RESULTS"
                className={cn(
                  importResult.success ? "border-green-500/30" : "border-destructive/30"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {importResult.success ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-heading font-semibold text-green-400">
                          {dryRun ? 'Dry Run Complete' : 'Import Successful'}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span className="font-heading font-semibold text-destructive">Import Failed</span>
                      </>
                    )}
                  </div>

                  <div>
                    <h4 className="font-heading font-semibold mb-2">Imported Items</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Jobs:</span>
                        <Badge>{importResult.imported.jobs}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Paths:</span>
                        <Badge>{importResult.imported.job_paths}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Features:</span>
                        <Badge>{importResult.imported.job_features}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Powers:</span>
                        <Badge>{importResult.imported.powers}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Relics:</span>
                        <Badge>{importResult.imported.relics}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monsters:</span>
                        <Badge>{importResult.imported.monsters}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Backgrounds:</span>
                        <Badge>{importResult.imported.backgrounds}</Badge>
                      </div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-destructive mb-2">
                        Errors ({importResult.errors.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {importResult.errors.map((error, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-amber-400 mb-2">
                        Warnings ({importResult.warnings.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {importResult.warnings.map((warning, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

