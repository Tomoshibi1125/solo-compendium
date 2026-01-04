import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, Shield, Database, Sparkles } from 'lucide-react';
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-arise/20 to-shadow-purple/20 border border-arise/30 flex items-center justify-center">
              <Database className="w-6 h-6 text-arise" />
            </div>
            <div>
              <h1 className="font-arise text-4xl font-bold gradient-text-system tracking-wider">
                SYSTEM ADMIN
              </h1>
              <p className="text-muted-foreground font-heading">
                Import and validate homebrew content for the compendium
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <SystemWindow title="IMPORT CONTENT" className="border-arise/30">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="font-heading flex items-center gap-2">
                    <Upload className="w-4 h-4 text-arise" />
                    Upload JSON File
                  </Label>
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
                      className="w-full gap-2 border-arise/30 hover:bg-arise/10 hover:border-arise/50"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content" className="font-heading flex items-center gap-2">
                    <FileText className="w-4 h-4 text-arise" />
                    Or Paste JSON Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setValidationResult(null);
                      setImportResult(null);
                    }}
                    placeholder='{"jobs": [...], "powers": [...], ...}'
                    className="mt-2 font-mono text-sm min-h-[300px] border-arise/20 focus:border-arise/50"
                  />
                </div>

                <div className="p-3 rounded-lg bg-arise/5 border border-arise/20 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dry-run"
                      checked={dryRun}
                      onCheckedChange={(checked) => setDryRun(checked === true)}
                      className="border-arise/50 data-[state=checked]:bg-arise data-[state=checked]:border-arise"
                    />
                    <Label htmlFor="dry-run" className="cursor-pointer font-heading">
                      Dry run (validate only, don't import)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overwrite"
                      checked={overwrite}
                      onCheckedChange={(checked) => setOverwrite(checked === true)}
                      className="border-arise/50 data-[state=checked]:bg-arise data-[state=checked]:border-arise"
                    />
                    <Label htmlFor="overwrite" className="cursor-pointer font-heading">
                      Overwrite existing entries
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleValidate}
                    variant="outline"
                    className="flex-1 gap-2 border-arise/30 hover:bg-arise/10 hover:border-arise/50"
                    disabled={!content.trim()}
                  >
                    <Shield className="w-4 h-4" />
                    Validate
                  </Button>
                  <Button
                    onClick={handleImport}
                    className="flex-1 gap-2 bg-gradient-to-r from-arise to-shadow-purple hover:shadow-arise/30 hover:shadow-lg transition-all"
                    disabled={!content.trim() || loading || (validationResult && !validationResult.valid)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {dryRun ? 'Dry Run' : 'Import'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SystemWindow>

            {/* Example Template */}
            <SystemWindow title="EXAMPLE TEMPLATE" variant="quest" className="border-amber-500/30">
              <p className="text-sm text-muted-foreground mb-4 font-heading">
                Load a sample JSON template to get started with custom content creation.
              </p>
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
                className="w-full gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
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
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    validationResult.valid ? "bg-green-500/10" : "bg-destructive/10"
                  )}>
                    {validationResult.valid ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <div>
                          <span className="font-arise font-semibold text-green-400 tracking-wide">VALID</span>
                          <p className="text-xs text-muted-foreground">Content bundle is ready for import</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-destructive" />
                        <div>
                          <span className="font-arise font-semibold text-destructive tracking-wide">INVALID</span>
                          <p className="text-xs text-muted-foreground">Please fix errors before importing</p>
                        </div>
                      </>
                    )}
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-arise font-semibold text-destructive mb-2 tracking-wide">
                        ERRORS ({validationResult.errors.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {validationResult.errors.map((error, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20">
                            <div className="font-mono text-xs text-muted-foreground">{error.path}</div>
                            <div className="font-heading">{error.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-arise font-semibold text-amber-400 mb-2 tracking-wide">
                        WARNINGS ({validationResult.warnings.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {validationResult.warnings.map((warning, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            <div className="font-mono text-xs text-muted-foreground">{warning.path}</div>
                            <div className="font-heading">{warning.message}</div>
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
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    importResult.success ? "bg-green-500/10" : "bg-destructive/10"
                  )}>
                    {importResult.success ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <div>
                          <span className="font-arise font-semibold text-green-400 tracking-wide">
                            {dryRun ? 'DRY RUN COMPLETE' : 'IMPORT SUCCESSFUL'}
                          </span>
                          <p className="text-xs text-muted-foreground">Content has been processed</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-destructive" />
                        <div>
                          <span className="font-arise font-semibold text-destructive tracking-wide">IMPORT FAILED</span>
                          <p className="text-xs text-muted-foreground">Check errors below</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <h4 className="font-arise font-semibold mb-3 text-arise tracking-wide">IMPORTED ITEMS</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Jobs', value: importResult.imported.jobs },
                        { label: 'Paths', value: importResult.imported.job_paths },
                        { label: 'Features', value: importResult.imported.job_features },
                        { label: 'Powers', value: importResult.imported.powers },
                        { label: 'Relics', value: importResult.imported.relics },
                        { label: 'Monsters', value: importResult.imported.monsters },
                        { label: 'Backgrounds', value: importResult.imported.backgrounds },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center p-2 rounded bg-arise/5 border border-arise/20">
                          <span className="text-sm text-muted-foreground font-heading">{item.label}</span>
                          <Badge className={cn(
                            "font-arise",
                            item.value > 0 ? "bg-arise/20 text-arise border-arise/30" : "bg-muted"
                          )}>
                            {item.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-arise font-semibold text-destructive mb-2 tracking-wide">
                        ERRORS ({importResult.errors.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {importResult.errors.map((error, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20 font-heading">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-arise font-semibold text-amber-400 mb-2 tracking-wide">
                        WARNINGS ({importResult.warnings.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {importResult.warnings.map((warning, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20 font-heading">
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SystemWindow>
            )}

            {/* Empty State */}
            {!validationResult && !importResult && (
              <SystemWindow title="AWAITING INPUT" className="border-muted-foreground/20">
                <div className="text-center py-12">
                  <Database className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-heading">
                    Upload or paste JSON content to begin validation
                  </p>
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
