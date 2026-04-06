import {
	Archive,
	Download,
	Eye,
	FileJson,
	FileUp,
	Plus,
	Save,
	Share2,
	Trash2,
	Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import {
	type HomebrewContentType,
	type HomebrewRecord,
	type HomebrewVisibilityScope,
	useDeleteHomebrewContent,
	useHomebrewLibrary,
	useHomebrewVersions,
	useSaveHomebrewContent,
	useSetHomebrewStatus,
} from "@/hooks/useHomebrewContent";

type ScopeFilter = "mine" | "public" | "campaign" | "all";

const DEFAULT_DATA = '{\n  "features": [],\n  "notes": ""\n}';

const CONTENT_TYPES: HomebrewContentType[] = [
	"job",
	"path",
	"relic",
	"spell",
	"item",
];

const VISIBILITY_OPTIONS: HomebrewVisibilityScope[] = [
	"private",
	"campaign",
	"public",
];

const downloadJson = (payload: unknown, filename: string) => {
	const blob = new Blob([JSON.stringify(payload, null, 2)], {
		type: "application/json",
	});
	const href = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = href;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(href);
};

const parseTags = (raw: string): string[] =>
	raw
		.split(",")
		.map((tag) => tag.trim())
		.filter((tag, index, all) => tag.length > 0 && all.indexOf(tag) === index);

export function HomebrewWorkbench() {
	const { toast } = useToast();
	const importInputRef = useRef<HTMLInputElement | null>(null);

	const [scope, setScope] = useState<ScopeFilter>("mine");
	const [scopeCampaignId, setScopeCampaignId] = useState<string>("none");

	const [editingId, setEditingId] = useState<string | null>(null);
	const [contentType, setContentType] = useState<HomebrewContentType>("job");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [tagsText, setTagsText] = useState("");
	const [sourceBook, setSourceBook] = useState("");
	const [visibilityScope, setVisibilityScope] =
		useState<HomebrewVisibilityScope>("private");
	const [campaignId, setCampaignId] = useState<string>("none");
	const [dataText, setDataText] = useState(DEFAULT_DATA);

	const myCampaigns = useMyCampaigns();
	const joinedCampaigns = useJoinedCampaigns();

	const campaignOptions = useMemo(() => {
		const seen = new Set<string>();
		const merged = [
			...(myCampaigns.data || []),
			...(joinedCampaigns.data || []),
		];
		return merged
			.filter((campaign) => {
				if (seen.has(campaign.id)) return false;
				seen.add(campaign.id);
				return true;
			})
			.map((campaign) => ({ id: campaign.id, name: campaign.name }));
	}, [joinedCampaigns.data, myCampaigns.data]);

	const campaignScopeId =
		scope === "campaign" && scopeCampaignId !== "none" ? scopeCampaignId : null;
	const {
		data: records = [],
		isLoading,
		error,
	} = useHomebrewLibrary({
		scope,
		campaignId: campaignScopeId,
	});

	const selectedRecord = useMemo(
		() => records.find((record) => record.id === editingId) ?? null,
		[editingId, records],
	);

	const { data: versions = [] } = useHomebrewVersions(editingId);

	const saveHomebrew = useSaveHomebrewContent();
	const deleteHomebrew = useDeleteHomebrewContent();
	const setStatus = useSetHomebrewStatus();

	const resetForm = () => {
		setEditingId(null);
		setContentType("job");
		setName("");
		setDescription("");
		setTagsText("");
		setSourceBook("");
		setVisibilityScope("private");
		setCampaignId("none");
		setDataText(DEFAULT_DATA);
	};

	const loadRecord = (record: HomebrewRecord) => {
		setEditingId(record.id);
		setContentType(record.content_type);
		setName(record.name);
		setDescription(record.description);
		setTagsText(record.tags.join(", "));
		setSourceBook(record.source_book || "");
		setVisibilityScope(record.visibility_scope);
		setCampaignId(record.campaign_id || "none");
		setDataText(JSON.stringify(record.data ?? {}, null, 2));
	};

	const handleSave = async () => {
		if (!name.trim()) {
			toast({
				title: "Name required",
				description: "Provide a name before saving homebrew content.",
				variant: "destructive",
			});
			return;
		}

		let parsedData: Record<string, unknown>;
		try {
			const parsed = JSON.parse(dataText);
			if (
				typeof parsed !== "object" ||
				parsed === null ||
				Array.isArray(parsed)
			) {
				throw new Error("Data must be a JSON object.");
			}
			parsedData = parsed as Record<string, unknown>;
		} catch (error) {
			toast({
				title: "Invalid JSON payload",
				description:
					error instanceof Error
						? error.message
						: "Could not parse JSON payload.",
				variant: "destructive",
			});
			return;
		}

		const result = await saveHomebrew.mutateAsync({
			id: editingId ?? undefined,
			contentType,
			name,
			description,
			tags: parseTags(tagsText),
			sourceBook: sourceBook.trim() || null,
			visibilityScope,
			campaignId:
				visibilityScope === "campaign" && campaignId !== "none"
					? campaignId
					: null,
			data: parsedData,
		});

		if (result.record) {
			loadRecord(result.record);
		}
	};

	const handleDelete = async (id: string) => {
		await deleteHomebrew.mutateAsync({ id });
		if (editingId === id) {
			resetForm();
		}
	};

	const handleTogglePublish = async (record: HomebrewRecord) => {
		const nextStatus = record.status === "published" ? "draft" : "published";
		const result = await setStatus.mutateAsync({
			id: record.id,
			status: nextStatus,
			visibilityScope:
				nextStatus === "published" && record.visibility_scope === "private"
					? "public"
					: record.visibility_scope,
			campaignId: record.campaign_id,
		});

		if (result.record) {
			loadRecord(result.record);
		}
	};

	const handleArchive = async (record: HomebrewRecord) => {
		await setStatus.mutateAsync({
			id: record.id,
			status: "archived",
			visibilityScope: record.visibility_scope,
			campaignId: record.campaign_id,
		});

		if (editingId === record.id) {
			resetForm();
		}
	};

	const handleExport = (record: HomebrewRecord) => {
		downloadJson(
			record,
			`homebrew-${record.name.replace(/\s+/g, "-").toLowerCase()}.json`,
		);
	};

	const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		try {
			const text = await file.text();
			const parsed = JSON.parse(text) as Partial<HomebrewRecord>;
			setEditingId(null);
			setContentType((parsed.content_type as HomebrewContentType) || "job");
			setName(parsed.name || file.name.replace(/\.json$/i, ""));
			setDescription(parsed.description || "");
			setTagsText(Array.isArray(parsed.tags) ? parsed.tags.join(", ") : "");
			setSourceBook(parsed.source_book || "");
			setVisibilityScope(
				parsed.visibility_scope === "campaign" ||
					parsed.visibility_scope === "public" ||
					parsed.visibility_scope === "private"
					? parsed.visibility_scope
					: "private",
			);
			setCampaignId(parsed.campaign_id || "none");
			setDataText(
				JSON.stringify((parsed.data as Record<string, unknown>) || {}, null, 2),
			);
			toast({
				title: "Import loaded",
				description: "Review imported data, then save to persist it.",
			});
		} catch (error) {
			toast({
				title: "Import failed",
				description:
					error instanceof Error
						? error.message
						: "Could not parse import file.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-6" data-testid="homebrew-workbench">
			<AscendantWindow title="HOME BREW STUDIO">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
					<div>
						<Label htmlFor="homebrew-scope">Browse Scope</Label>
						<Select
							value={scope}
							onValueChange={(value) => setScope(value as ScopeFilter)}
						>
							<SelectTrigger id="homebrew-scope">
								<SelectValue placeholder="Select scope" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="mine">My Content</SelectItem>
								<SelectItem value="public">Published Public</SelectItem>
								<SelectItem value="campaign">Campaign Shared</SelectItem>
								<SelectItem value="all">All Accessible</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{scope === "campaign" && (
						<div>
							<Label htmlFor="homebrew-scope-campaign">Campaign</Label>
							<Select
								value={scopeCampaignId}
								onValueChange={setScopeCampaignId}
							>
								<SelectTrigger id="homebrew-scope-campaign">
									<SelectValue placeholder="Select campaign" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">Select campaign</SelectItem>
									{campaignOptions.map((campaign) => (
										<SelectItem key={campaign.id} value={campaign.id}>
											{campaign.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="md:col-span-2 flex flex-wrap items-end gap-2">
						<Button variant="outline" onClick={resetForm}>
							<Plus className="w-4 h-4 mr-2" />
							New Draft
						</Button>
						<Button
							variant="outline"
							onClick={() => importInputRef.current?.click()}
						>
							<Upload className="w-4 h-4 mr-2" />
							Import JSON
						</Button>
						<input
							ref={importInputRef}
							type="file"
							accept="application/json,.json"
							className="hidden"
							aria-label="Import homebrew JSON file"
							title="Import homebrew JSON file"
							onChange={handleImport}
						/>
						{selectedRecord && (
							<Button
								variant="outline"
								onClick={() => handleExport(selectedRecord)}
							>
								<Download className="w-4 h-4 mr-2" />
								Export Selected
							</Button>
						)}
					</div>
				</div>

				{error instanceof Error && (
					<p className="mt-4 text-sm text-destructive">{error.message}</p>
				)}
			</AscendantWindow>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<AscendantWindow title="EDITOR" className="xl:col-span-2">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<Label htmlFor="homebrew-type">Type</Label>
							<Select
								value={contentType}
								onValueChange={(value) =>
									setContentType(value as HomebrewContentType)
								}
							>
								<SelectTrigger id="homebrew-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CONTENT_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="homebrew-name">Name</Label>
							<Input
								id="homebrew-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</div>
						<div className="md:col-span-2">
							<Label htmlFor="homebrew-description">Description</Label>
							<Textarea
								id="homebrew-description"
								rows={3}
								value={description}
								onChange={(event) => setDescription(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="homebrew-tags">Tags (comma separated)</Label>
							<Input
								id="homebrew-tags"
								value={tagsText}
								onChange={(event) => setTagsText(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="homebrew-source">Source Book</Label>
							<Input
								id="homebrew-source"
								value={sourceBook}
								onChange={(event) => setSourceBook(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="homebrew-visibility">Visibility</Label>
							<Select
								value={visibilityScope}
								onValueChange={(value) =>
									setVisibilityScope(value as HomebrewVisibilityScope)
								}
							>
								<SelectTrigger id="homebrew-visibility">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{VISIBILITY_OPTIONS.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{visibilityScope === "campaign" && (
							<div>
								<Label htmlFor="homebrew-campaign">Campaign</Label>
								<Select value={campaignId} onValueChange={setCampaignId}>
									<SelectTrigger id="homebrew-campaign">
										<SelectValue placeholder="Select campaign" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">Select campaign</SelectItem>
										{campaignOptions.map((campaign) => (
											<SelectItem key={campaign.id} value={campaign.id}>
												{campaign.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
						<div className="md:col-span-2">
							<Label htmlFor="homebrew-json">Payload (JSON)</Label>
							<Textarea
								id="homebrew-json"
								rows={12}
								className="font-mono text-xs"
								value={dataText}
								onChange={(event) => setDataText(event.target.value)}
							/>
						</div>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<Button onClick={handleSave} disabled={saveHomebrew.isPending}>
							<Save className="w-4 h-4 mr-2" />
							{editingId ? "Update Draft" : "Create Draft"}
						</Button>

						{selectedRecord && (
							<>
								<Button
									variant="outline"
									onClick={() => handleTogglePublish(selectedRecord)}
									disabled={setStatus.isPending}
								>
									<Share2 className="w-4 h-4 mr-2" />
									{selectedRecord.status === "published"
										? "Unpublish"
										: "Publish"}
								</Button>
								<Button
									variant="outline"
									onClick={() => handleArchive(selectedRecord)}
									disabled={setStatus.isPending}
								>
									<Archive className="w-4 h-4 mr-2" />
									Archive
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDelete(selectedRecord.id)}
									disabled={deleteHomebrew.isPending}
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete
								</Button>
							</>
						)}
					</div>
				</AscendantWindow>

				<div className="space-y-6">
					<AscendantWindow title="LIBRARY">
						{isLoading ? (
							<p className="text-sm text-muted-foreground">
								Loading homebrew content...
							</p>
						) : records.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No homebrew entries found for this scope.
							</p>
						) : (
							<div className="space-y-2 max-h-[420px] overflow-auto pr-1">
								{records.map((record) => (
									<button
										key={record.id}
										type="button"
										onClick={() => loadRecord(record)}
										className="w-full text-left rounded border border-border bg-muted/30 p-3 hover:border-primary/40"
									>
										<div className="flex items-center justify-between gap-2">
											<p className="font-heading font-semibold truncate">
												{record.name}
											</p>
											<Badge
												variant={
													record.status === "published" ? "default" : "outline"
												}
											>
												{record.status}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											{record.content_type} · {record.visibility_scope}
										</p>
										<div className="mt-2 flex flex-wrap gap-1">
											{record.tags.slice(0, 3).map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="text-[10px]"
												>
													{tag}
												</Badge>
											))}
										</div>
									</button>
								))}
							</div>
						)}
					</AscendantWindow>

					{selectedRecord && (
						<AscendantWindow title="SELECTED ENTRY">
							<div className="space-y-2 text-sm">
								<p className="font-heading font-semibold">
									{selectedRecord.name}
								</p>
								<p className="text-muted-foreground">
									Version {selectedRecord.version}
								</p>
								<p className="text-muted-foreground">
									Updated {new Date(selectedRecord.updated_at).toLocaleString()}
								</p>
								<div className="flex flex-wrap gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleExport(selectedRecord)}
									>
										<FileJson className="w-4 h-4 mr-2" />
										Export
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleTogglePublish(selectedRecord)}
									>
										<Eye className="w-4 h-4 mr-2" />
										{selectedRecord.status === "published"
											? "Set Draft"
											: "Publish"}
									</Button>
								</div>
							</div>
						</AscendantWindow>
					)}

					{editingId && (
						<AscendantWindow title="VERSION HISTORY">
							{versions.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No previous versions yet.
								</p>
							) : (
								<div className="space-y-2 max-h-[220px] overflow-auto pr-1">
									{versions.map((version) => (
										<div
											key={version.id}
											className="rounded border border-border p-2 text-xs"
										>
											<p className="font-semibold">v{version.version_number}</p>
											<p className="text-muted-foreground">
												{new Date(version.created_at).toLocaleString()}
											</p>
											{version.change_note && (
												<p className="mt-1 text-muted-foreground">
													{version.change_note}
												</p>
											)}
											<Button
												variant="ghost"
												size="sm"
												className="mt-1 h-7 px-2"
												onClick={() =>
													setDataText(JSON.stringify(version.snapshot, null, 2))
												}
											>
												<FileUp className="w-3 h-3 mr-1" />
												Load Snapshot
											</Button>
										</div>
									))}
								</div>
							)}
						</AscendantWindow>
					)}
				</div>
			</div>
		</div>
	);
}
