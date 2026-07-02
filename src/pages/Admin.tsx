import {
	AlertCircle,
	Ban,
	BarChart3,
	CheckCircle,
	Database,
	Download,
	FileText,
	Image,
	Loader2,
	ScrollText,
	Shield,
	Sparkles,
	Undo2,
	Upload,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	useAdminAuditLog,
	useAdminUsers,
	useSetUserBan,
	useSetUserRole,
} from "@/hooks/useAdminUsers";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	type ImportResult,
	importContentBundle,
	parseJSONContent,
} from "@/lib/contentImporter";
import {
	type ValidationResult,
	validateContentBundle,
} from "@/lib/contentValidator";
import { cn } from "@/lib/utils";

const AUDIT_ACTION_LABELS: Record<string, string> = {
	set_role: "Role changed",
	ban_user: "Account suspended",
	unban_user: "Account reinstated",
};

const Admin = () => {
	const { toast } = useToast();
	const { user: currentUser } = useAuth();
	const { data: users = [], isLoading: usersLoading } = useAdminUsers();
	const { data: auditLog = [] } = useAdminAuditLog();
	const setUserRole = useSetUserRole();
	const setUserBan = useSetUserBan();
	const [content, setContent] = useState("");
	const [validationResult, setValidationResult] =
		useState<ValidationResult | null>(null);
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
					title: "Validation successful",
					description: "Content bundle is valid and ready to import.",
				});
			} else {
				toast({
					title: "Validation failed",
					description: `Found ${result.errors.length} error(s).`,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Parse error",
				description:
					error instanceof Error ? error.message : "Failed to parse JSON",
				variant: "destructive",
			});
			setValidationResult({
				valid: false,
				errors: [
					{
						path: "root",
						message: error instanceof Error ? error.message : "Parse error",
					},
				],
				warnings: [],
			});
		}
	};

	const handleImport = async () => {
		if (!validationResult || !validationResult.valid) {
			toast({
				title: "Validation required",
				description: "Please validate the content first.",
				variant: "destructive",
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
					title: dryRun ? "Dry run complete" : "Import successful",
					description: `Imported ${Object.values(result.imported).reduce((a, b) => a + b, 0)} items.`,
				});
			} else {
				toast({
					title: "Import failed",
					description: `Encountered ${result.errors.length} error(s).`,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Import error",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
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
						<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-resurge/20 to-shadow-purple/20 border border-resurge/30 flex items-center justify-center">
							<Database className="w-6 h-6 text-resurge" />
						</div>
						<div className="flex-1">
							<RiftHeading
								level={1}
								variant="sovereign"
								dimensional
								className="tracking-wider"
							>
								Rift Console
							</RiftHeading>
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="font-heading"
							>
								Import and validate operational parameters for the Rift
								Compendium.
							</ManaFlowText>
						</div>
						<div className="flex gap-2">
							<Link to="/warden-directives/content-audit">
								<Button
									variant="outline"
									className="gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge/50"
								>
									<BarChart3 className="w-4 h-4" />
									Content Audit
								</Button>
							</Link>
							<Link to="/warden-directives/selection-protocols">
								<Button
									variant="outline"
									className="gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge/50"
								>
									<Shield className="w-4 h-4" />
									Selection Protocols
								</Button>
							</Link>
							<Link to="/warden-directives/art-generation">
								<Button
									variant="outline"
									className="gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge/50"
								>
									<Image className="w-4 h-4" />
									Art Generation
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Input Section */}
					<div className="space-y-6">
						<AscendantWindow
							title="IMPORT CONTENT"
							className="border-resurge/30"
						>
							<div className="space-y-4">
								<div>
									<Label
										htmlFor="file-upload"
										className="font-heading flex items-center gap-2"
									>
										<Upload className="w-4 h-4 text-resurge" />
										Upload JSON File
									</Label>
									<div className="mt-2">
										<input
											aria-label="Upload JSON content file"
											id="file-upload"
											type="file"
											accept=".json"
											onChange={handleFileUpload}
											className="hidden"
										/>
										<Button
											variant="outline"
											onClick={() =>
												document.getElementById("file-upload")?.click()
											}
											className="w-full gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge/50"
										>
											<Upload className="w-4 h-4" />
											Choose File
										</Button>
									</div>
								</div>

								<div>
									<Label
										htmlFor="content"
										className="font-heading flex items-center gap-2"
									>
										<FileText className="w-4 h-4 text-resurge" />
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
										className="mt-2 font-mono text-sm min-h-[300px] border-resurge/20 focus:border-resurge/50"
									/>
								</div>

								<div className="p-3 rounded-lg bg-resurge/5 border border-resurge/20 space-y-3">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="dry-run"
											checked={dryRun}
											onCheckedChange={(checked) => setDryRun(checked === true)}
											className="border-resurge/50 data-[state=checked]:bg-resurge data-[state=checked]:border-resurge"
										/>
										<Label
											htmlFor="dry-run"
											className="cursor-pointer font-heading"
										>
											Dry run (validate only, don't import)
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox
											id="overwrite"
											checked={overwrite}
											onCheckedChange={(checked) =>
												setOverwrite(checked === true)
											}
											className="border-resurge/50 data-[state=checked]:bg-resurge data-[state=checked]:border-resurge"
										/>
										<Label
											htmlFor="overwrite"
											className="cursor-pointer font-heading"
										>
											Overwrite existing entries
										</Label>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										onClick={handleValidate}
										variant="outline"
										className="flex-1 gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge/50"
										disabled={!content.trim()}
									>
										<Shield className="w-4 h-4" />
										Validate
									</Button>
									<Button
										onClick={handleImport}
										className="flex-1 gap-2 bg-gradient-to-r from-resurge to-shadow-purple hover:shadow-resurge/30 hover:shadow-lg transition-all"
										disabled={
											!content.trim() ||
											loading ||
											(validationResult && !validationResult.valid) ||
											undefined
										}
									>
										{loading ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Importing...
											</>
										) : (
											<>
												<Sparkles className="w-4 h-4" />
												{dryRun ? "Dry Run" : "Import"}
											</>
										)}
									</Button>
								</div>
							</div>
						</AscendantWindow>

						{/* Example Template */}
						<AscendantWindow
							title="EXAMPLE TEMPLATE"
							variant="quest"
							className="border-warning/30"
						>
							<AscendantText className="block text-sm text-muted-foreground mb-4 font-heading">
								Load a sample JSON template to get started with custom content
								creation.
							</AscendantText>
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
												source_name: "Rift Ascendant Homebrew",
											},
										],
									};
									setContent(JSON.stringify(example, null, 2));
								}}
								className="w-full gap-2 border-warning/30 hover:bg-warning/10 hover:border-warning/50"
							>
								<Download className="w-4 h-4" />
								Load Example Template
							</Button>
						</AscendantWindow>
					</div>

					{/* Results Section */}
					<div className="space-y-6">
						{/* Validation Results */}
						{validationResult && (
							<AscendantWindow
								title="VALIDATION RESULTS"
								className={cn(
									validationResult.valid
										? "border-success/30"
										: "border-destructive/30",
								)}
							>
								<div className="space-y-4">
									<div
										className={cn(
											"flex items-center gap-3 p-3 rounded-lg",
											validationResult.valid
												? "bg-success/10"
												: "bg-destructive/10",
										)}
									>
										{validationResult.valid ? (
											<>
												<CheckCircle className="w-6 h-6 text-success" />
												<div>
													<span className="font-resurge font-semibold text-success tracking-wide">
														VALID
													</span>
													<AscendantText className="block text-xs text-muted-foreground">
														Content bundle is ready for import
													</AscendantText>
												</div>
											</>
										) : (
											<>
												<AlertCircle className="w-6 h-6 text-destructive" />
												<div>
													<span className="font-resurge font-semibold text-destructive tracking-wide">
														INVALID
													</span>
													<AscendantText className="block text-xs text-muted-foreground">
														Please fix errors before importing
													</AscendantText>
												</div>
											</>
										)}
									</div>

									{validationResult.errors.length > 0 && (
										<div>
											<h4 className="font-resurge font-semibold text-destructive mb-2 tracking-wide">
												ERRORS ({validationResult.errors.length})
											</h4>
											<div className="space-y-1 max-h-48 overflow-y-auto">
												{validationResult.errors.map((error, _i) => (
													<div
														key={JSON.stringify(error)}
														className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20"
													>
														<div className="font-mono text-xs text-muted-foreground">
															{error.path}
														</div>
														<div className="font-heading">{error.message}</div>
													</div>
												))}
											</div>
										</div>
									)}

									{validationResult.warnings.length > 0 && (
										<div>
											<h4 className="font-resurge font-semibold text-warning mb-2 tracking-wide">
												WARNINGS ({validationResult.warnings.length})
											</h4>
											<div className="space-y-1 max-h-48 overflow-y-auto">
												{validationResult.warnings.map((warning, _i) => (
													<div
														key={JSON.stringify(warning)}
														className="text-sm p-2 rounded bg-warning/10 border border-warning/20"
													>
														<div className="font-mono text-xs text-muted-foreground">
															{warning.path}
														</div>
														<div className="font-heading">
															{warning.message}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</AscendantWindow>
						)}

						{/* Import Results */}
						{importResult && (
							<AscendantWindow
								title="IMPORT RESULTS"
								className={cn(
									importResult.success
										? "border-success/30"
										: "border-destructive/30",
								)}
							>
								<div className="space-y-4">
									<div
										className={cn(
											"flex items-center gap-3 p-3 rounded-lg",
											importResult.success
												? "bg-success/10"
												: "bg-destructive/10",
										)}
									>
										{importResult.success ? (
											<>
												<CheckCircle className="w-6 h-6 text-success" />
												<div>
													<span className="font-resurge font-semibold text-success tracking-wide">
														{dryRun ? "DRY RUN COMPLETE" : "IMPORT SUCCESSFUL"}
													</span>
													<AscendantText className="block text-xs text-muted-foreground">
														Content has been processed
													</AscendantText>
												</div>
											</>
										) : (
											<>
												<AlertCircle className="w-6 h-6 text-destructive" />
												<div>
													<span className="font-resurge font-semibold text-destructive tracking-wide">
														IMPORT FAILED
													</span>
													<AscendantText className="block text-xs text-muted-foreground">
														Check errors below
													</AscendantText>
												</div>
											</>
										)}
									</div>

									<div>
										<h4 className="font-resurge font-semibold mb-3 text-resurge tracking-wide">
											IMPORTED ITEMS
										</h4>
										<div className="grid grid-cols-2 gap-2">
											{[
												{ label: "Jobs", value: importResult.imported.jobs },
												{
													label: "Paths",
													value: importResult.imported.job_paths,
												},
												{
													label: "Features",
													value: importResult.imported.job_features,
												},
												{
													label: "Powers",
													value: importResult.imported.powers,
												},
												{
													label: "Relics",
													value: importResult.imported.relics,
												},
												{
													label: "Anomalies",
													value: importResult.imported.Anomalies,
												},
												{
													label: "Backgrounds",
													value: importResult.imported.backgrounds,
												},
											].map((item) => (
												<div
													key={item.label}
													className="flex justify-between items-center p-2 rounded bg-resurge/5 border border-resurge/20"
												>
													<span className="text-sm text-muted-foreground font-heading">
														{item.label}
													</span>
													<Badge
														className={cn(
															"font-resurge",
															item.value > 0
																? "bg-resurge/20 text-resurge border-resurge/30"
																: "bg-muted",
														)}
													>
														{item.value}
													</Badge>
												</div>
											))}
										</div>
									</div>

									{importResult.errors.length > 0 && (
										<div>
											<h4 className="font-resurge font-semibold text-destructive mb-2 tracking-wide">
												ERRORS ({importResult.errors.length})
											</h4>
											<div className="space-y-1 max-h-48 overflow-y-auto">
												{importResult.errors.map((error, _i) => (
													<div
														key={error}
														className="text-sm p-2 rounded bg-destructive/10 border border-destructive/20 font-heading"
													>
														{error}
													</div>
												))}
											</div>
										</div>
									)}

									{importResult.warnings.length > 0 && (
										<div>
											<h4 className="font-resurge font-semibold text-warning mb-2 tracking-wide">
												WARNINGS ({importResult.warnings.length})
											</h4>
											<div className="space-y-1 max-h-48 overflow-y-auto">
												{importResult.warnings.map((warning, _i) => (
													<div
														key={warning}
														className="text-sm p-2 rounded bg-warning/10 border border-warning/20 font-heading"
													>
														{warning}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</AscendantWindow>
						)}

						{/* Empty State */}
						{!validationResult && !importResult && (
							<AscendantWindow
								title="AWAITING INPUT"
								className="border-muted-foreground/20"
							>
								<div className="text-center py-12">
									<Database className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
									<AscendantText className="block text-muted-foreground font-heading">
										Upload or paste JSON content to begin validation
									</AscendantText>
								</div>
							</AscendantWindow>
						)}
					</div>
				</div>

				{/* User management + audit trail (Supabase-backed only) */}
				<div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
					<AscendantWindow
						title="USER REGISTRY"
						className="border-resurge/30 xl:col-span-2"
					>
						{!isSupabaseConfigured ? (
							<AscendantText className="block text-sm text-muted-foreground font-heading py-6 text-center">
								User management requires the Supabase backend. Guest-mode data
								lives only in this browser.
							</AscendantText>
						) : usersLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-resurge" />
							</div>
						) : users.length === 0 ? (
							<AscendantText className="block text-sm text-muted-foreground font-heading py-6 text-center">
								No registered accounts visible. Only wardens can view the
								registry.
							</AscendantText>
						) : (
							<div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
								{users.map((account) => {
									const isSelf = account.id === currentUser?.id;
									const banned = Boolean(account.banned_at);
									return (
										<div
											key={account.id}
											className="flex flex-wrap items-center gap-3 rounded border border-border bg-muted/30 p-3"
										>
											<Users className="w-4 h-4 text-resurge shrink-0" />
											<div className="min-w-0 flex-1">
												<p className="font-heading font-semibold truncate">
													{account.display_name || account.email}
													{isSelf && (
														<span className="ml-2 text-xs text-muted-foreground">
															(you)
														</span>
													)}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{account.email} · joined{" "}
													{new Date(account.created_at).toLocaleDateString()}
												</p>
											</div>
											{banned && (
												<Badge variant="destructive" className="uppercase">
													Suspended
												</Badge>
											)}
											<Select
												value={account.role}
												onValueChange={(value) =>
													setUserRole.mutate({ userId: account.id, value })
												}
												disabled={isSelf || setUserRole.isPending}
											>
												<SelectTrigger className="w-32 h-8">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="warden">Warden</SelectItem>
													<SelectItem value="ascendant">Ascendant</SelectItem>
												</SelectContent>
											</Select>
											<Button
												variant={banned ? "outline" : "destructive"}
												size="sm"
												className="gap-1"
												disabled={isSelf || setUserBan.isPending}
												onClick={() =>
													setUserBan.mutate({
														userId: account.id,
														value: !banned,
													})
												}
											>
												{banned ? (
													<>
														<Undo2 className="w-3.5 h-3.5" />
														Reinstate
													</>
												) : (
													<>
														<Ban className="w-3.5 h-3.5" />
														Suspend
													</>
												)}
											</Button>
										</div>
									);
								})}
							</div>
						)}
					</AscendantWindow>

					<AscendantWindow
						title="ADMIN AUDIT LOG"
						className="border-resurge/30"
					>
						{!isSupabaseConfigured ? (
							<AscendantText className="block text-sm text-muted-foreground font-heading py-6 text-center">
								Audit history requires the Supabase backend.
							</AscendantText>
						) : auditLog.length === 0 ? (
							<div className="text-center py-8">
								<ScrollText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
								<AscendantText className="block text-sm text-muted-foreground font-heading">
									No admin actions recorded yet.
								</AscendantText>
							</div>
						) : (
							<div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
								{auditLog.map((entry) => {
									const target = users.find(
										(account) => account.id === entry.target_user_id,
									);
									const details = entry.details as {
										from?: string;
										to?: string;
									} | null;
									return (
										<div
											key={entry.id}
											className="rounded border border-border bg-muted/30 p-2 text-xs"
										>
											<p className="font-heading font-semibold">
												{AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
												{details?.to ? ` → ${details.to}` : ""}
											</p>
											<p className="text-muted-foreground">
												{target
													? (target.display_name ?? target.email)
													: (entry.target_user_id ?? "—")}
											</p>
											<p className="text-muted-foreground">
												{entry.created_at
													? new Date(entry.created_at).toLocaleString()
													: ""}
											</p>
										</div>
									);
								})}
							</div>
						)}
					</AscendantWindow>
				</div>
			</div>
		</Layout>
	);
};

export default Admin;
