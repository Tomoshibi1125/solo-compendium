import {
	BookOpen,
	Edit,
	FileText,
	Globe,
	HelpCircle,
	Lock,
	MapPin,
	Plus,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useHasDMAccess } from "@/hooks/useCampaigns";
import { useCampaignWiki, type WikiArticle } from "@/hooks/useCampaignWiki";
import { cn } from "@/lib/utils";

const CATEGORIES = [
	{ id: "lore", label: "Lore", icon: FileText },
	{ id: "npc", label: "NPCs", icon: Users },
	{ id: "location", label: "Locations", icon: MapPin },
	{ id: "quest", label: "Quests", icon: HelpCircle },
	{ id: "faction", label: "Factions", icon: BookOpen },
];

export function CampaignWiki({ campaignId }: { campaignId: string }) {
	const { articles, isLoading, addArticle, updateArticle, removeArticle } =
		useCampaignWiki(campaignId);
	const { data: hasDMAccess } = useHasDMAccess(campaignId);

	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [editingArticle, setEditingArticle] = useState<WikiArticle | null>(
		null,
	);

	// View state derivation
	const filteredArticles = useMemo(() => {
		return articles.filter((article) => {
			const matchSearch =
				article.title.toLowerCase().includes(search.toLowerCase()) ||
				article.category.toLowerCase().includes(search.toLowerCase());
			// Players can only see public articles, DM sees all
			const matchVisibility = hasDMAccess ? true : article.is_public;
			return matchSearch && matchVisibility;
		});
	}, [articles, search, hasDMAccess]);

	const groupedArticles = useMemo(() => {
		const groups: Record<string, WikiArticle[]> = {};
		for (const cat of CATEGORIES) {
			groups[cat.id] = [];
		}
		for (const article of filteredArticles) {
			if (!groups[article.category]) groups[article.category] = [];
			groups[article.category].push(article);
		}
		return groups;
	}, [filteredArticles]);

	const selectedArticle = useMemo(() => {
		return filteredArticles.find((a) => a.id === selectedId) || null;
	}, [filteredArticles, selectedId]);

	// If selected article becomes unavailable (deleted or permission change), deselect
	if (selectedId && !selectedArticle && !isLoading) {
		setSelectedId(null);
	}

	const navigateToArticleTitle = (title: string) => {
		const target = articles.find(
			(a) => a.title.toLowerCase() === title.toLowerCase(),
		);
		if (target && (hasDMAccess || target.is_public)) {
			setSelectedId(target.id);
		}
	};

	const processWikiLinks = (text: string) => {
		// Replace [[Article Name]] with [Article Name](wiki://Article Name)
		return text.replace(/\[\[(.*?)\]\]/g, "[$1](wiki://$1)");
	};

	// Editor Handlers
	const handleCreateNew = () => {
		setEditingArticle(null);
		setIsEditorOpen(true);
	};

	const handleEdit = (article: WikiArticle) => {
		setEditingArticle(article);
		setIsEditorOpen(true);
	};

	const handleDelete = async (id: string, title: string) => {
		if (
			window.confirm(
				`Are you sure you want to delete "${title}"? This cannot be undone.`,
			)
		) {
			await removeArticle(id);
			if (selectedId === id) setSelectedId(null);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px] max-h-[80vh]">
			{/* Sidebar Navigation */}
			<div className="col-span-1 border border-border bg-card rounded-md flex flex-col overflow-hidden">
				<div className="p-3 border-b border-border bg-muted/30">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-display font-bold flex items-center gap-2 text-sm">
							<BookOpen className="w-4 h-4 text-primary" />
							LORE HUB
						</h3>
						{hasDMAccess && (
							<Button
								size="icon"
								variant="ghost"
								className="h-8 w-8 text-primary"
								onClick={handleCreateNew}
							>
								<Plus className="w-4 h-4" />
							</Button>
						)}
					</div>
					<div className="relative">
						<Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
						<Input
							placeholder="Search wiki..."
							className="pl-8 h-9 text-xs"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<ScrollArea className="flex-1 p-2">
					{isLoading ? (
						<p className="text-xs text-center text-muted-foreground py-4">
							Loading archives...
						</p>
					) : filteredArticles.length === 0 ? (
						<p className="text-xs text-center text-muted-foreground py-4">
							No accessible articles found.
						</p>
					) : (
						<div className="space-y-4 pb-4">
							{CATEGORIES.map(
								(category) =>
									groupedArticles[category.id]?.length > 0 && (
										<div key={category.id}>
											<div className="flex items-center gap-2 px-2 py-1 mb-1 text-xs font-heading font-bold text-muted-foreground uppercase">
												<category.icon className="w-3 h-3" />
												{category.label}
											</div>
											<ul className="space-y-0.5">
												{groupedArticles[category.id].map((article) => (
													<li key={article.id}>
														<button
															type="button"
															onClick={() => setSelectedId(article.id)}
															className={cn(
																"w-full text-left px-3 py-1.5 rounded text-sm transition-colors flex items-center justify-between group",
																selectedId === article.id
																	? "bg-primary/20 text-primary border border-primary/30"
																	: "hover:bg-muted text-foreground",
															)}
														>
															<span className="truncate pr-2">
																{article.title}
															</span>
															{!article.is_public && hasDMAccess && (
																<Lock className="w-3 h-3 text-muted-foreground opacity-50 shrink-0" />
															)}
														</button>
													</li>
												))}
											</ul>
										</div>
									),
							)}
						</div>
					)}
				</ScrollArea>
			</div>

			{/* Main Content Area */}
			<div className="col-span-1 lg:col-span-3 border border-border bg-card rounded-md flex flex-col overflow-hidden relative">
				{selectedArticle ? (
					<>
						{/* Toolbar */}
						<div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Badge
									variant="outline"
									className={cn(
										"uppercase text-[10px]",
										selectedArticle.is_public
											? "border-green-500/50 text-green-400"
											: "border-amber-500/50 text-amber-400",
									)}
								>
									{selectedArticle.is_public ? (
										<>
											<Globe className="w-3 h-3 mr-1" /> Public
										</>
									) : (
										<>
											<Lock className="w-3 h-3 mr-1" /> Hidden
										</>
									)}
								</Badge>
								<span className="text-xs font-mono text-muted-foreground">
									Updated:{" "}
									{new Date(selectedArticle.updated_at).toLocaleDateString()}
								</span>
							</div>

							{hasDMAccess && (
								<div className="flex items-center gap-2">
									<Button
										size="sm"
										variant="outline"
										className="h-7 text-xs"
										onClick={() => handleEdit(selectedArticle)}
									>
										<Edit className="w-3 h-3 mr-1" /> Edit
									</Button>
									<Button
										size="icon"
										variant="outline"
										className="h-7 w-7 text-destructive hover:text-white hover:bg-destructive"
										onClick={() =>
											handleDelete(selectedArticle.id, selectedArticle.title)
										}
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</div>
							)}
						</div>

						{/* Reading View */}
						<ScrollArea className="flex-1 p-6 md:p-10">
							<div className="max-w-3xl mx-auto pb-12">
								<h1 className="font-display text-4xl font-bold text-foreground mb-8 border-b border-border pb-4">
									{selectedArticle.title}
								</h1>

								<div
									className="prose prose-invert prose-emerald max-w-none 
                                prose-headings:font-display prose-headings:text-primary 
                                prose-a:text-accent prose-a:no-underline"
								>
									<ReactMarkdown
										components={{
											a: ({ node, href, children, ...props }) => {
												if (href?.startsWith("wiki://")) {
													const title = decodeURIComponent(
														href.replace("wiki://", ""),
													);
													const exists = articles.some(
														(a) =>
															a.title.toLowerCase() === title.toLowerCase() &&
															(hasDMAccess || a.is_public),
													);
													return (
														<button
															type="button"
															onClick={(e) => {
																e.preventDefault();
																navigateToArticleTitle(title);
															}}
															className={cn(
																"inline-flex items-center underline decoration-dotted underline-offset-4 cursor-pointer align-baseline px-1 mx-0.5 rounded transition-colors",
																exists
																	? "text-primary hover:bg-primary/20"
																	: "text-muted-foreground decoration-destructive/50 hover:bg-destructive/10",
															)}
															title={
																exists
																	? `Go to ${title}`
																	: `Article ${title} not found`
															}
														>
															<BookOpen className="w-3 h-3 mr-1 opacity-50 block" />
															{children}
														</button>
													);
												}
												return (
													<a
														href={href}
														target="_blank"
														rel="noreferrer"
														className="text-secondary hover:underline"
														{...props}
													>
														{children}
													</a>
												);
											},
										}}
									>
										{processWikiLinks(selectedArticle.content)}
									</ReactMarkdown>
								</div>
							</div>
						</ScrollArea>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-hatching opacity-50">
						<Globe className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
						<h2 className="font-display text-xl text-foreground">
							The System Lore Hub
						</h2>
						<p className="text-sm text-muted-foreground max-w-md mt-2 font-heading">
							Select an article from the index to read. Wrap titles in double
							brackets to create cross-links (e.g.{" "}
							<code>[[Shadow Regent]]</code>).
						</p>
					</div>
				)}
			</div>

			<WikiEditorDialog
				isOpen={isEditorOpen}
				onClose={() => setIsEditorOpen(false)}
				article={editingArticle}
				onSubmit={async (data) => {
					if (editingArticle) {
						await updateArticle({ updates: data, id: editingArticle.id });
					} else {
						const payload = data as Omit<
							WikiArticle,
							"campaign_id" | "id" | "created_at" | "updated_at" | "created_by"
						>;
						const newlyCreated = await addArticle(payload);
						if (newlyCreated) setSelectedId(newlyCreated.id);
					}
					setIsEditorOpen(false);
				}}
			/>
		</div>
	);
}

function WikiEditorDialog({
	isOpen,
	onClose,
	article,
	onSubmit,
}: {
	isOpen: boolean;
	onClose: () => void;
	article: WikiArticle | null;
	onSubmit: (data: {
		title: string;
		content: string;
		category: string;
		is_public: boolean;
	}) => Promise<void>;
}) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("lore");
	const [isPublic, setIsPublic] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Sync state when article prop changes
	useMemo(() => {
		if (isOpen) {
			setTitle(article?.title || "");
			setContent(article?.content || "");
			setCategory(article?.category || "lore");
			setIsPublic(article ? article.is_public : false);
		}
	}, [article, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;
		setIsSubmitting(true);
		try {
			await onSubmit({ title, content, category, is_public: isPublic });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col border-primary/20 bg-background/95 backdrop-blur-md">
				<DialogHeader>
					<DialogTitle className="font-display text-2xl text-primary">
						{article ? "EDIT ARCHIVE" : "NEW REGISTRY ENTRY"}
					</DialogTitle>
					<DialogDescription>
						Log information into the System database. Use Markdown for
						formatting.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 pb-2"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
						<div className="space-y-2">
							<Label>Article Title</Label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. The Shadow Regent"
								required
								className="font-bold border-muted-foreground/30 focus-visible:ring-primary"
							/>
						</div>

						<div className="space-y-2">
							<Label>Classification</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="border-muted-foreground/30 focus:ring-primary">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CATEGORIES.map((cat) => (
										<SelectItem value={cat.id} key={cat.id}>
											<span className="flex items-center gap-2">
												<cat.icon className="w-4 h-4" /> {cat.label}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex items-center gap-3 shrink-0 rounded-md border border-border p-3 bg-muted/20">
						<Switch
							id="public-toggle"
							checked={isPublic}
							onCheckedChange={setIsPublic}
						/>
						<div className="flex flex-col">
							<Label
								htmlFor="public-toggle"
								className="flex items-center gap-1.5 cursor-pointer"
							>
								{isPublic ? (
									<Globe className="w-3.5 h-3.5 text-green-400" />
								) : (
									<Lock className="w-3.5 h-3.5 text-amber-400" />
								)}
								{isPublic ? "Public Record" : "Restricted File (DM Only)"}
							</Label>
							<span className="text-[10px] text-muted-foreground">
								{isPublic
									? "All Ascendants can read this article."
									: "Hidden from players."}
							</span>
						</div>
					</div>

					<div className="flex-1 flex flex-col min-h-[300px] space-y-2">
						<Label className="flex justify-between items-end">
							<span>Main Content (Markdown)</span>
							<span className="text-[10px] text-muted-foreground font-normal">
								Link to other articles using [[Article Title]]
							</span>
						</Label>
						<Textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Record the details here..."
							className="flex-1 font-mono text-sm resize-none bg-black/40 border-muted-foreground/30 focus-visible:ring-primary"
						/>
					</div>

					<DialogFooter className="shrink-0 pt-4">
						<Button
							variant="outline"
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting || !title.trim()}
							className="btn-umbral gap-2 shadow-primary/20"
						>
							{isSubmitting ? "ENCODING..." : "SAVE TO DATABASE"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
