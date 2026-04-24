import { format } from "date-fns";
import {
	Edit,
	FileText,
	Loader2,
	Lock,
	Plus,
	Share2,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useCampaignNotes,
	useCreateCampaignNote,
	useDeleteCampaignNote,
	useUpdateCampaignNote,
} from "@/hooks/useCampaignNotes";
import { useCampaignMembers, useHasWardenAccess } from "@/hooks/useCampaigns";
import { useAuth } from "@/lib/auth/authContext";
import {
	decodeCampaignNoteContent,
	encodeCampaignNoteContent,
	parseCampaignNoteSegments,
} from "@/lib/campaignNoteContent";
import {
	canEditNote,
	canViewNote,
	createPrivacySettings,
	filterVisibleNotes,
	type NotePermission,
	type NoteVisibility,
	type SecuredNote,
} from "@/lib/notePrivacy";

interface CampaignNotesProps {
	campaignId: string;
}

export function CampaignNotes({ campaignId }: CampaignNotesProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingNote, setEditingNote] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("general");
	const [visibility, setVisibility] = useState<NoteVisibility>("private");
	const [showTitleOnly, setShowTitleOnly] = useState(false);
	const [playerPermissions, setPlayerPermissions] = useState<
		Record<string, NotePermission>
	>({});

	const { data: notes = [], isLoading } = useCampaignNotes(campaignId);
	const { data: members = [] } = useCampaignMembers(campaignId);
	const { data: hasWardenAccess = false } = useHasWardenAccess(campaignId);
	const { user } = useAuth();
	const createNote = useCreateCampaignNote();
	const updateNote = useUpdateCampaignNote();
	const deleteNote = useDeleteCampaignNote();
	const campaignPlayers = useMemo(
		() =>
			members
				.filter((member) => member.role === "ascendant")
				.map((member) => ({
					userId: member.user_id,
					label:
						typeof member.characters?.name === "string"
							? member.characters.name
							: `Player ${member.user_id.slice(0, 8)}`,
				})),
		[members],
	);

	// Bridge Supabase notes into SecuredNote format for privacy filtering
	const securedNotes: SecuredNote[] = useMemo(
		() =>
			notes.map((note) => {
				const decoded = decodeCampaignNoteContent({
					content: note.content,
					ownerId: note.user_id,
					isShared: note.is_shared,
				});
				return {
					id: note.id,
					title: note.title,
					content: decoded.body,
					campaignId,
					privacy: decoded.privacy,
					createdAt: note.created_at,
					updatedAt: note.updated_at,
					category:
						(note.category as SecuredNote["category"]) || "campaign_note",
				};
			}),
		[campaignId, notes],
	);

	const userId = user?.id ?? "";
	const visibleNotes = filterVisibleNotes(
		securedNotes,
		userId,
		hasWardenAccess,
	);

	const handleOpenDialog = (noteId?: string) => {
		if (noteId) {
			const note = securedNotes.find((entry) => entry.id === noteId);
			if (note) {
				setEditingNote(noteId);
				setTitle(note.title);
				setContent(note.content || "");
				setCategory(note.category || "general");
				setVisibility(note.privacy.visibility);
				setShowTitleOnly(note.privacy.showTitleOnly);
				setPlayerPermissions(note.privacy.playerPermissions);
			}
		} else {
			setEditingNote(null);
			setTitle("");
			setContent("");
			setCategory("general");
			setVisibility("private");
			setShowTitleOnly(false);
			setPlayerPermissions({});
		}
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingNote(null);
		setTitle("");
		setContent("");
		setCategory("general");
		setVisibility("private");
		setShowTitleOnly(false);
		setPlayerPermissions({});
	};

	const handlePlayerPermissionChange = (
		playerId: string,
		permission: NotePermission,
	) => {
		setPlayerPermissions((prev) => {
			if (permission === "none") {
				const { [playerId]: _removed, ...remaining } = prev;
				return remaining;
			}
			return {
				...prev,
				[playerId]: permission,
			};
		});
	};

	const handleSave = async () => {
		if (!title.trim()) return;

		const ownerId =
			securedNotes.find((note) => note.id === editingNote)?.privacy.ownerId ??
			userId ??
			"local-owner";
		const privacy = createPrivacySettings(ownerId);
		privacy.visibility = hasWardenAccess ? visibility : "private";
		privacy.showTitleOnly =
			hasWardenAccess && privacy.visibility === "per-player"
				? showTitleOnly
				: false;
		privacy.playerPermissions =
			hasWardenAccess && privacy.visibility === "per-player"
				? playerPermissions
				: {};
		const encodedContent = encodeCampaignNoteContent({
			body: content,
			privacy,
		});
		const isShared = privacy.visibility === "shared";

		if (editingNote) {
			await updateNote.mutateAsync({
				noteId: editingNote,
				campaignId,
				title,
				content: encodedContent,
				category,
				isShared,
			});
		} else {
			await createNote.mutateAsync({
				campaignId,
				title,
				content: encodedContent,
				category,
				isShared,
			});
		}
		handleCloseDialog();
	};

	const handleDelete = async (noteId: string) => {
		if (confirm("Delete this note?")) {
			await deleteNote.mutateAsync({ noteId, campaignId });
		}
	};

	const getCategoryColor = (cat: string) => {
		switch (cat) {
			case "session":
				return "bg-primary/20 text-primary";
			case "npc":
				return "bg-resurge/20 text-resurge";
			case "location":
				return "bg-green-500/20 text-green-400";
			case "quest":
				return "bg-yellow-500/20 text-yellow-400";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	return (
		<>
			<AscendantWindow
				title="CAMPAIGN NOTES"
				className="h-[500px] flex flex-col"
			>
				<div className="flex justify-between items-center mb-4">
					<p className="text-sm text-muted-foreground">
						Session logs, notes, and information for this campaign
					</p>
					<Button size="sm" onClick={() => handleOpenDialog()}>
						<Plus className="w-4 h-4 mr-2" />
						New Note
					</Button>
				</div>
				<div className="flex-1 overflow-y-auto space-y-3">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
						</div>
					) : notes.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No notes yet. Create your first note!
						</p>
					) : visibleNotes.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No notes visible with your permissions.
						</p>
					) : (
						visibleNotes.map((secured) => {
							const note = notes.find((n) => n.id === secured.id);
							if (!note) return null;
							const userCanEdit = canEditNote(secured, userId, hasWardenAccess);
							const userCanViewContent = canViewNote(
								secured,
								userId,
								hasWardenAccess,
							);
							const canViewSecretBlocks =
								hasWardenAccess || secured.privacy.ownerId === userId;
							const segments = parseCampaignNoteSegments(secured.content);
							return (
								<div
									key={note.id}
									className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
								>
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-2">
											<FileText className="w-4 h-4 text-primary" />
											<h4 className="font-heading font-semibold">
												{note.title}
											</h4>
											<Badge
												variant="secondary"
												className={getCategoryColor(note.category)}
											>
												{note.category}
											</Badge>
											<Badge
												variant="outline"
												className="text-[10px] uppercase"
											>
												{secured.privacy.visibility}
											</Badge>
											{secured.privacy.visibility === "shared" ? (
												<Share2 className="w-3 h-3 text-muted-foreground" />
											) : (
												<Lock className="w-3 h-3 text-muted-foreground" />
											)}
										</div>
										{userCanEdit && (
											<div className="flex gap-1">
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7"
													onClick={() => handleOpenDialog(note.id)}
												>
													<Edit className="w-3 h-3" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7"
													onClick={() => handleDelete(note.id)}
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										)}
									</div>
									{userCanViewContent ? (
										<div className="space-y-2">
											{segments.map((segment) =>
												segment.kind === "text" ? (
													segment.content.trim() ? (
														<p
															key={`${note.id}-${segment.id}`}
															className="text-sm whitespace-pre-wrap"
														>
															{segment.content}
														</p>
													) : null
												) : canViewSecretBlocks ? (
													<div
														key={`${note.id}-${segment.id}`}
														className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 space-y-1"
													>
														<p className="text-[10px] uppercase tracking-wide text-amber-300">
															{segment.label || "Secret"}
														</p>
														<p className="text-sm whitespace-pre-wrap">
															{segment.content}
														</p>
													</div>
												) : (
													<div
														key={`${note.id}-${segment.id}`}
														className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
													>
														Secret text hidden.
													</div>
												),
											)}
										</div>
									) : (
										<p className="text-xs italic text-muted-foreground">
											Visible by title only.
										</p>
									)}
									<p className="text-xs text-muted-foreground mt-2">
										{format(new Date(note.updated_at), "PPp")}
									</p>
								</div>
							);
						})
					)}
				</div>
			</AscendantWindow>

			<Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingNote ? "Edit Note" : "Create Note"}
						</DialogTitle>
						<DialogDescription>
							Add a note for this campaign. Use [[secret]]...[[/secret]] for
							Warden-only sections inside an otherwise visible note.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label htmlFor="note-title">Title</Label>
							<Input
								id="note-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Session 1: The First Rift"
								className="mt-1"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="note-category">Category</Label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger className="mt-1">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="general">General</SelectItem>
										<SelectItem value="session">Session Log</SelectItem>
										<SelectItem value="npc">NPC</SelectItem>
										<SelectItem value="location">Location</SelectItem>
										<SelectItem value="quest">Quest</SelectItem>
										<SelectItem value="lore">Lore</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="note-visibility">Visibility</Label>
								<Select
									value={hasWardenAccess ? visibility : "private"}
									onValueChange={(value: NoteVisibility) =>
										setVisibility(value)
									}
									disabled={!hasWardenAccess}
								>
									<SelectTrigger id="note-visibility" className="mt-1">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="private">Private</SelectItem>
										<SelectItem value="shared">Shared</SelectItem>
										<SelectItem value="per-player">Per-player</SelectItem>
									</SelectContent>
								</Select>
								{!hasWardenAccess && (
									<p className="mt-1 text-xs text-muted-foreground">
										Only the Warden can grant player visibility.
									</p>
								)}
							</div>
						</div>
						{hasWardenAccess && visibility === "per-player" && (
							<div className="space-y-3 rounded-lg border border-border/60 p-3">
								<div className="flex items-center gap-3">
									<Switch
										id="note-show-title-only"
										checked={showTitleOnly}
										onCheckedChange={setShowTitleOnly}
									/>
									<Label
										htmlFor="note-show-title-only"
										className="cursor-pointer"
									>
										Show title to players without content access
									</Label>
								</div>
								<div className="space-y-2">
									{campaignPlayers.length === 0 ? (
										<p className="text-sm text-muted-foreground">
											No player members are available for per-player
											permissions.
										</p>
									) : (
										campaignPlayers.map((player) => (
											<div
												key={player.userId}
												className="grid grid-cols-[1fr_140px] items-center gap-3"
											>
												<div className="text-sm">{player.label}</div>
												<Select
													value={playerPermissions[player.userId] || "none"}
													onValueChange={(value: NotePermission) =>
														handlePlayerPermissionChange(player.userId, value)
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="none">No access</SelectItem>
														<SelectItem value="read">Read</SelectItem>
														<SelectItem value="write">Write</SelectItem>
													</SelectContent>
												</Select>
											</div>
										))
									)}
								</div>
							</div>
						)}
						<div>
							<Label htmlFor="note-content">Content</Label>
							<Textarea
								id="note-content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Write your notes here..."
								className="mt-1 min-h-[200px]"
								rows={8}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleCloseDialog}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={
								!title.trim() || createNote.isPending || updateNote.isPending
							}
						>
							{createNote.isPending || updateNote.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								"Save Note"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
