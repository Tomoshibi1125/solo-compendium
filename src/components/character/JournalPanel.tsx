import { format } from "date-fns";
import parse from "html-react-parser";
import {
	BookOpen,
	Calendar,
	Edit,
	Plus,
	Save,
	Tag,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	type JournalEntry,
	useCharacterJournal,
	useCreateJournalEntry,
	useDeleteJournalEntry,
	useUpdateJournalEntry,
} from "@/hooks/useCharacterJournal";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { logger } from "@/lib/logger";
import { sanitizeRichText } from "@/lib/sanitize";
import { RichTextNotes } from "./RichTextNotes";

interface JournalPanelProps {
	characterId: string;
}

export function JournalPanel({ characterId }: JournalPanelProps) {
	const [hasError, setHasError] = useState(false);
	const { data: entries = [], isLoading } = useCharacterJournal(characterId);
	const createEntry = useCreateJournalEntry();
	const updateEntry = useUpdateJournalEntry();
	const deleteEntry = useDeleteJournalEntry();

	const [isCreating, setIsCreating] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [newTags, setNewTags] = useState("");

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editContent, setEditContent] = useState("");
	const [editTags, setEditTags] = useState("");

	const ascendantTools = useAscendantTools();

	if (hasError) {
		return (
			<div className="p-4 text-center">
				<p className="text-destructive">Journal temporarily unavailable</p>
				<Button
					onClick={() => setHasError(false)}
					variant="outline"
					className="mt-2"
				>
					Retry
				</Button>
			</div>
		);
	}

	const handleCreate = async () => {
		try {
			if (!newTitle.trim()) return;

			await createEntry.mutateAsync({
				character_id: characterId,
				title: newTitle,
				content: newContent || null,
				session_date: new Date().toISOString().split("T")[0],
				tags: newTags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					"Journal Entry Added",
					newTitle,
					"SA",
				)
				.catch(console.error);

			setIsCreating(false);
			setNewTitle("");
			setNewContent("");
			setNewTags("");
		} catch (error) {
			logger.error("Failed to create journal entry:", error);
			setHasError(true);
		}
	};

	const handleUpdate = async () => {
		try {
			if (!editingId || !editTitle.trim()) return;

			await updateEntry.mutateAsync({
				id: editingId,
				characterId,
				title: editTitle,
				content: editContent || null,
				tags: editTags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					"Journal Entry Edited",
					editTitle,
					"SA",
				)
				.catch(console.error);

			setEditingId(null);
		} catch (error) {
			logger.error("Failed to update journal entry:", error);
			setHasError(true);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteEntry.mutateAsync({ id, characterId });
			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					"Journal Entry Removed",
					"Deleted an entry",
					"SA",
				)
				.catch(console.error);
		} catch (error) {
			logger.error("Failed to delete journal entry:", error);
			setHasError(true);
		}
	};

	const startEditing = (entry: JournalEntry) => {
		setEditingId(entry.id);
		setEditTitle(entry.title);
		setEditContent(entry.content || "");
		setEditTags((entry.tags || []).join(", "));
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
					<div className="h-3 bg-muted rounded w-1/2"></div>
				</div>
				<div className="animate-pulse">
					<div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
					<div className="h-3 bg-muted rounded w-2/3"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Card className="border-arise/30 bg-arise/5">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-arise flex items-center gap-2">
							<BookOpen className="w-5 h-5 text-arise" />
							Ascendant's Journal
						</CardTitle>
						<Button
							onClick={() => setIsCreating(true)}
							size="sm"
							className="bg-arise hover:bg-arise/80 text-white border-arise/30"
						>
							<Plus className="h-4 w-4 mr-1" />
							New Entry
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{isCreating && (
						<Card className="border-arise/30 bg-arise/5">
							<CardContent className="p-4 space-y-3">
								<Input
									aria-label="Entry Title"
									placeholder="Entry Title"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									className="bg-background/50"
								/>
								<div className="bg-background/50 rounded-md">
									<RichTextNotes
										value={newContent}
										onChange={setNewContent}
										className="min-h-[150px]"
										placeholder="Describe your adventures..."
									/>
								</div>
								<Input
									aria-label="Tags (comma-separated)"
									placeholder="Tags (comma-separated)"
									value={newTags}
									onChange={(e) => setNewTags(e.target.value)}
									className="bg-background/50"
								/>
								<div className="flex gap-2">
									<Button
										size="sm"
										onClick={handleCreate}
										disabled={!newTitle.trim() || createEntry.isPending}
										className="bg-arise hover:bg-arise/80"
									>
										<Save className="h-4 w-4 mr-1" />
										Save Entry
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											setIsCreating(false);
											setNewTitle("");
											setNewContent("");
											setNewTags("");
										}}
									>
										Cancel
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{!isLoading && entries.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p className="font-heading">
								No journal entries yet. Chronicle your adventures!
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{entries.map((entry) => (
								<Card
									key={entry.id}
									className="border-muted/30 bg-background/30 hover:border-primary/30 transition-colors"
								>
									<CardContent className="p-4">
										{editingId === entry.id ? (
											<div className="space-y-3">
												<Input
													aria-label="Edit Title"
													value={editTitle}
													onChange={(e) => setEditTitle(e.target.value)}
													className="bg-background/50"
												/>
												<div className="bg-background/50 rounded-md">
													<RichTextNotes
														value={editContent}
														onChange={setEditContent}
														className="min-h-[150px]"
													/>
												</div>
												<Input
													aria-label="Edit Tags"
													value={editTags}
													onChange={(e) => setEditTags(e.target.value)}
													className="bg-background/50"
												/>
												<div className="flex gap-2">
													<Button
														size="sm"
														onClick={handleUpdate}
														disabled={
															!editTitle.trim() || updateEntry.isPending
														}
														className="bg-arise hover:bg-arise/80"
													>
														<Save className="h-4 w-4 mr-1" />
														Update
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => setEditingId(null)}
													>
														Cancel
													</Button>
												</div>
											</div>
										) : (
											<>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1">
														<h4 className="font-semibold text-foreground">
															{entry.title}
														</h4>
														{entry.session_date && (
															<p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
																<Calendar className="h-3 w-3" />
																{format(
																	new Date(entry.session_date),
																	"MMM d, yyyy",
																)}
															</p>
														)}
													</div>
													<div className="flex gap-1">
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 text-muted-foreground hover:text-primary"
															onClick={() => startEditing(entry)}
														>
															<Edit className="h-3.5 w-3.5" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 text-muted-foreground hover:text-destructive"
															onClick={() => handleDelete(entry.id)}
														>
															<Trash2 className="h-3.5 w-3.5" />
														</Button>
													</div>
												</div>

												{entry.content && (
													<div className="text-primary/70 leading-relaxed text-sm prose prose-invert prose-bond max-w-none mt-2">
														{parse(sanitizeRichText(entry.content))}
													</div>
												)}

												{entry.tags && entry.tags.length > 0 && (
													<div className="flex flex-wrap gap-1 mt-2">
														{entry.tags.map((tag) => (
															<Badge
																key={`tag-${tag}`}
																variant="secondary"
																className="text-xs bg-primary/10 text-primary"
															>
																<Tag className="h-2.5 w-2.5 mr-1" />
																{tag}
															</Badge>
														))}
													</div>
												)}
											</>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
