import { formatDistanceToNow } from "date-fns";
import {
	Calendar,
	Loader2,
	Plus,
	Save,
	ScrollText,
	Sparkles,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import { useCampaignSandboxInjector } from "@/hooks/useCampaignSandboxInjector";
import {
	type CampaignSessionLogType,
	type CampaignSessionStatus,
	useAddCampaignSessionLog,
	useCampaignSessionLogs,
	useCampaignSessions,
	useDeleteCampaignSession,
	useUpsertCampaignSession,
} from "@/hooks/useCampaignSessions";

const STATUS_OPTIONS: CampaignSessionStatus[] = [
	"planned",
	"in_progress",
	"completed",
	"cancelled",
];
const LOG_TYPES: CampaignSessionLogType[] = [
	"session",
	"recap",
	"loot",
	"event",
	"note",
];

interface CampaignSessionsPanelProps {
	campaignId: string;
	canManage: boolean;
}

export function CampaignSessionsPanel({
	campaignId,
	canManage,
}: CampaignSessionsPanelProps) {
	const { toast } = useToast();
	const { data: sessions = [], isLoading: sessionsLoading } =
		useCampaignSessions(campaignId);
	const { data: logs = [], isLoading: logsLoading } =
		useCampaignSessionLogs(campaignId);

	const upsertSession = useUpsertCampaignSession();
	const deleteSession = useDeleteCampaignSession();
	const addLog = useAddCampaignSessionLog();
	const sendMessage = useSendCampaignMessage();
	const { injectSandbox, isInjecting } = useCampaignSandboxInjector(campaignId);

	const [sessionTitle, setSessionTitle] = useState("");
	const [sessionDescription, setSessionDescription] = useState("");
	const [sessionScheduledFor, setSessionScheduledFor] = useState("");
	const [sessionLocation, setSessionLocation] = useState("");

	const [logSessionId, setLogSessionId] = useState("none");
	const [logType, setLogType] = useState<CampaignSessionLogType>("session");
	const [logTitle, setLogTitle] = useState("");
	const [logContent, setLogContent] = useState("");
	const [logVisible, setLogVisible] = useState(true);

	const sessionNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const session of sessions) {
			map.set(session.id, session.title);
		}
		return map;
	}, [sessions]);

	const createSession = async () => {
		if (!sessionTitle.trim()) {
			toast({
				title: "Session title required",
				description: "Add a session title before saving.",
				variant: "destructive",
			});
			return;
		}

		await upsertSession.mutateAsync({
			campaignId,
			title: sessionTitle.trim(),
			description: sessionDescription.trim() || null,
			scheduledFor: sessionScheduledFor
				? new Date(sessionScheduledFor).toISOString()
				: null,
			location: sessionLocation.trim() || null,
			status: "planned",
		});

		await sendMessage
			.mutateAsync({
				campaignId,
				content: `**System**: A new session has been scheduled - "${sessionTitle.trim()}"`,
			})
			.catch(console.error);

		setSessionTitle("");
		setSessionDescription("");
		setSessionScheduledFor("");
		setSessionLocation("");
	};

	const changeStatus = async (
		sessionId: string,
		status: CampaignSessionStatus,
	) => {
		await upsertSession.mutateAsync({
			campaignId,
			sessionId,
			status,
		});

		// Broadcast status change
		const title = sessionNameById.get(sessionId) || "Session";
		await sendMessage
			.mutateAsync({
				campaignId,
				content: `**System**: Status for "${title}" changed to ${status.replace("_", " ")}.`,
			})
			.catch(console.error);
	};

	const createLog = async () => {
		if (!logTitle.trim() || !logContent.trim()) {
			toast({
				title: "Log title and content are required",
				description: "Fill in both fields before adding a campaign log.",
				variant: "destructive",
			});
			return;
		}

		await addLog.mutateAsync({
			campaignId,
			sessionId: logSessionId === "none" ? null : logSessionId,
			logType,
			title: logTitle.trim(),
			content: logContent.trim(),
			isPlayerVisible: logVisible,
			metadata: {},
		});

		if (logVisible) {
			await sendMessage
				.mutateAsync({
					campaignId,
					content: `**System**: A new campaign log ("${logTitle.trim()}") has been added.`,
				})
				.catch(console.error);
		}

		setLogTitle("");
		setLogContent("");
		setLogSessionId("none");
		setLogType("session");
		setLogVisible(true);
	};

	return (
		<div className="space-y-6" data-testid="campaign-sessions-panel">
			<AscendantWindow title="SESSION SCHEDULE">
				{canManage && (
					<div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
						<h3 className="font-heading font-semibold flex items-center gap-2">
							<Plus className="w-4 h-4" />
							Create Session
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<Label htmlFor="session-title">Title</Label>
								<Input
									id="session-title"
									value={sessionTitle}
									onChange={(event) => setSessionTitle(event.target.value)}
									placeholder="Session 12: Siege of the Rift Citadel"
								/>
							</div>
							<div>
								<Label htmlFor="session-location">Location</Label>
								<Input
									id="session-location"
									value={sessionLocation}
									onChange={(event) => setSessionLocation(event.target.value)}
									placeholder="Discord / Table / VTT"
								/>
							</div>
							<div>
								<Label htmlFor="session-date">Scheduled For</Label>
								<Input
									id="session-date"
									type="datetime-local"
									value={sessionScheduledFor}
									onChange={(event) =>
										setSessionScheduledFor(event.target.value)
									}
								/>
							</div>
							<div className="md:col-span-2">
								<Label htmlFor="session-description">Description</Label>
								<Textarea
									id="session-description"
									rows={2}
									value={sessionDescription}
									onChange={(event) =>
										setSessionDescription(event.target.value)
									}
									placeholder="Prep goals, expected encounters, and story beats"
								/>
							</div>
						</div>
						<Button onClick={createSession} disabled={upsertSession.isPending}>
							<Save className="w-4 h-4 mr-2" />
							Save Session
						</Button>
					</div>
				)}

				{sessionsLoading ? (
					<div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
						<Loader2 className="w-4 h-4 animate-spin" />
						Syncing schedules...
					</div>
				) : sessions.length === 0 ? (
					<div className="text-center py-8 rounded-lg border border-dashed border-border bg-muted/5">
						<Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
						<p className="text-sm text-muted-foreground font-heading mb-4">
							No scheduled sessions yet.
						</p>
						{canManage && (
							<div className="flex items-center justify-center gap-3">
								<Button
									variant="outline"
									size="sm"
									className="border-primary/40 hover:border-primary hover:bg-primary/10 gap-2"
									onClick={() => injectSandbox()}
									disabled={isInjecting}
								>
									{isInjecting ? (
										<Loader2 className="w-4 h-4 animate-spin text-primary" />
									) : (
										<Sparkles className="w-4 h-4 text-primary" />
									)}
									{isInjecting
										? "Processing Sandbox..."
										: "Import Sandbox Sessions"}
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-3">
						{sessions.map((session) => (
							<div
								key={session.id}
								className="rounded-lg border border-border bg-muted/20 p-3"
							>
								<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
									<div>
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-heading font-semibold">
												{session.title}
											</p>
											<Badge variant="outline">
												{session.status.replace("_", " ")}
											</Badge>
										</div>
										<div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
											<span className="inline-flex items-center gap-1">
												<Calendar className="w-3 h-3" />
												{session.scheduled_for
													? new Date(session.scheduled_for).toLocaleString()
													: "No date set"}
											</span>
											{session.location && <span>{session.location}</span>}
											<span>
												Updated{" "}
												{formatDistanceToNow(new Date(session.updated_at), {
													addSuffix: true,
												})}
											</span>
										</div>
										{session.description && (
											<p className="text-sm text-muted-foreground mt-2">
												{session.description}
											</p>
										)}
									</div>

									{canManage && (
										<div className="flex flex-wrap gap-2">
											<Select
												value={session.status}
												onValueChange={(value) =>
													changeStatus(
														session.id,
														value as CampaignSessionStatus,
													)
												}
											>
												<SelectTrigger
													aria-label={`Status for ${session.title}`}
													className="h-8 w-36"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{STATUS_OPTIONS.map((status) => (
														<SelectItem key={status} value={status}>
															{status.replace("_", " ")}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													deleteSession.mutate({
														campaignId,
														sessionId: session.id,
													})
												}
												disabled={deleteSession.isPending}
											>
												<Trash2 className="w-4 h-4 mr-1" />
												Delete
											</Button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</AscendantWindow>

			<AscendantWindow title="SESSION LOG">
				{canManage && (
					<div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
						<h3 className="font-heading font-semibold flex items-center gap-2">
							<ScrollText className="w-4 h-4" />
							Add Campaign Log
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<Label htmlFor="log-session">Linked Session</Label>
								<Select value={logSessionId} onValueChange={setLogSessionId}>
									<SelectTrigger id="log-session">
										<SelectValue placeholder="No linked session" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No linked session</SelectItem>
										{sessions.map((session) => (
											<SelectItem key={session.id} value={session.id}>
												{session.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="log-type">Log Type</Label>
								<Select
									value={logType}
									onValueChange={(value) =>
										setLogType(value as CampaignSessionLogType)
									}
								>
									<SelectTrigger id="log-type">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LOG_TYPES.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="md:col-span-2">
								<Label htmlFor="log-title">Title</Label>
								<Input
									id="log-title"
									value={logTitle}
									onChange={(event) => setLogTitle(event.target.value)}
									placeholder="Aftermath summary"
								/>
							</div>
							<div className="md:col-span-2">
								<Label htmlFor="log-content">Content</Label>
								<Textarea
									id="log-content"
									rows={4}
									value={logContent}
									onChange={(event) => setLogContent(event.target.value)}
									placeholder="What happened, what changed, and what to prep next"
								/>
							</div>
							<div className="md:col-span-2 flex items-center justify-between rounded border border-border bg-background px-3 py-2">
								<Label htmlFor="log-visible">Visible to players</Label>
								<Switch
									id="log-visible"
									checked={logVisible}
									onCheckedChange={setLogVisible}
								/>
							</div>
						</div>
						<Button onClick={createLog} disabled={addLog.isPending}>
							<Plus className="w-4 h-4 mr-2" />
							Save Log Entry
						</Button>
					</div>
				)}

				{logsLoading ? (
					<p className="text-sm text-muted-foreground">Loading logs...</p>
				) : logs.length === 0 ? (
					<p className="text-sm text-muted-foreground">No campaign logs yet.</p>
				) : (
					<div className="space-y-3">
						{logs.map((log) => (
							<div
								key={log.id}
								className="rounded-lg border border-border bg-muted/20 p-3"
							>
								<div className="flex flex-wrap items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<p className="font-heading font-semibold">{log.title}</p>
										<Badge variant="outline">{log.log_type}</Badge>
										{!log.is_player_visible && (
											<Badge variant="destructive">private</Badge>
										)}
									</div>
									<span className="text-xs text-muted-foreground">
										{new Date(log.created_at).toLocaleString()}
									</span>
								</div>
								{log.session_id && (
									<p className="text-xs text-muted-foreground mt-1">
										Session:{" "}
										{sessionNameById.get(log.session_id) || "Unknown session"}
									</p>
								)}
								<p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
									{log.content}
								</p>
							</div>
						))}
					</div>
				)}
			</AscendantWindow>
		</div>
	);
}
