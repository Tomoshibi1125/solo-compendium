import {
	AlertTriangle,
	Download,
	Loader2,
	MessageSquare,
	RefreshCw,
	Save,
	Send,
	Shield,
	Sparkles,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
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
import { useToast } from "@/hooks/use-toast";
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import { useCampaignSandboxInjector } from "@/hooks/useCampaignSandboxInjector";
import {
	useCampaign,
	useDeleteCampaign,
	useHasWardenAccess,
	useRegenerateShareCode,
	useUpdateCampaign,
} from "@/hooks/useCampaigns";
import { useNotifyDiscord } from "@/hooks/useNotifyDiscord";
import { BureauDirectiveExtensionsPanel } from "@/components/campaign/BureauDirectiveExtensionsPanel";
import type { Json } from "@/integrations/supabase/types";
import {
	getAutomatedCombat,
	getLevelingMode,
	type LevelingMode,
} from "@/lib/campaignSettings";

interface CampaignSettingsProps {
	campaignId: string;
}

export function CampaignSettings({ campaignId }: CampaignSettingsProps) {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { data: campaign } = useCampaign(campaignId);
	const { data: hasWardenAccess, isLoading: loadingAccess } =
		useHasWardenAccess(campaignId);
	const [name, setName] = useState(campaign?.name || "");
	const [description, setDescription] = useState(campaign?.description || "");
	const [isActive, setIsActive] = useState(campaign?.is_active ?? true);
	const [contentSharingEnabled, setContentSharingEnabled] = useState(false);
	const [levelingMode, setLevelingMode] = useState<LevelingMode>(
		getLevelingMode(campaign?.settings),
	);
	const [automatedCombat, setAutomatedCombat] = useState<boolean>(
		getAutomatedCombat(campaign?.settings),
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");

	// Misty Pearl E3 — Discord webhook bridge.
	const [discordWebhookUrl, setDiscordWebhookUrl] = useState(
		campaign?.discord_webhook_url ?? "",
	);
	const [discordTesting, setDiscordTesting] = useState(false);
	const { notify } = useNotifyDiscord();

	// Misty Pearl G2 — Discord two-way bot.
	const [discordAppId, setDiscordAppId] = useState(
		campaign?.discord_app_id ?? "",
	);
	const [discordPublicKey, setDiscordPublicKey] = useState(
		campaign?.discord_public_key ?? "",
	);

	// Misty Pearl I3 — Comm-Net LiveKit SFU opt-in.
	const [livekitUrl, setLivekitUrl] = useState(campaign?.livekit_url ?? "");
	const [livekitApiKey, setLivekitApiKey] = useState(
		campaign?.livekit_api_key ?? "",
	);
	const [livekitApiSecret, setLivekitApiSecret] = useState("");

	const { injectSandbox, isInjecting, progressString } =
		useCampaignSandboxInjector(campaignId);

	// Update when campaign data loads
	useEffect(() => {
		if (campaign) {
			setName(campaign.name);
			setDescription(campaign.description || "");
			setIsActive(campaign.is_active);
			setLevelingMode(getLevelingMode(campaign.settings));
			setAutomatedCombat(getAutomatedCombat(campaign.settings));
			const settings = campaign.settings as Record<string, unknown> | null;
			setContentSharingEnabled(
				(settings?.content_sharing_enabled as boolean) ?? false,
			);
			setDiscordWebhookUrl(campaign.discord_webhook_url ?? "");
			setDiscordAppId(campaign.discord_app_id ?? "");
			setDiscordPublicKey(campaign.discord_public_key ?? "");
			setLivekitUrl(campaign.livekit_url ?? "");
			setLivekitApiKey(campaign.livekit_api_key ?? "");
			// Secret never round-trips; cleared on hydrate so the user
			// only writes a new value when they explicitly type one in.
			setLivekitApiSecret("");
		}
	}, [campaign]);

	const updateCampaign = useUpdateCampaign();
	const sendMessage = useSendCampaignMessage();
	const deleteCampaign = useDeleteCampaign();
	const regenerateShareCode = useRegenerateShareCode();

	const handleSave = async () => {
		if (!name.trim()) {
			toast({
				title: "Name required",
				description: "Campaign name cannot be empty.",
				variant: "destructive",
			});
			return;
		}
		if (!campaign) {
			toast({
				title: "Campaign unavailable",
				description: "Campaign details are still loading. Try again shortly.",
				variant: "destructive",
			});
			return;
		}

		const baseSettings =
			campaign.settings &&
			typeof campaign.settings === "object" &&
			!Array.isArray(campaign.settings)
				? (campaign.settings as Record<string, Json>)
				: {};

		updateCampaign.mutate(
			{
				campaignId,
				updates: {
					name: name.trim(),
					description: description.trim() || null,
					is_active: isActive,
					settings: {
						...baseSettings,
						leveling_mode: levelingMode,
						automated_combat: automatedCombat,
						content_sharing_enabled: contentSharingEnabled,
					},
					// Misty Pearl E3 — trim and null out empty URLs so the
					// edge function never tries to POST to an empty string.
					discord_webhook_url: discordWebhookUrl.trim() || null,
					// Misty Pearl G2 — Discord two-way bot configuration.
					discord_app_id: discordAppId.trim() || null,
					discord_public_key: discordPublicKey.trim() || null,
					// Misty Pearl I3 — Comm-Net LiveKit SFU opt-in. Secret
					// only sent when the user typed a fresh value.
					livekit_url: livekitUrl.trim() || null,
					livekit_api_key: livekitApiKey.trim() || null,
					...(livekitApiSecret.trim()
						? { livekit_api_secret: livekitApiSecret.trim() }
						: {}),
				},
			},
			{
				onSuccess: () => {
					// Broadcast settings update to the campaign chat
					sendMessage
						.mutateAsync({
							campaignId,
							content: `**Campaign**: The Warden has updated the campaign rules/settings.`,
						})
						.catch(console.error);
				},
			},
		);
	};

	const handleDeleteCampaign = async () => {
		if (deleteConfirmText !== campaign?.name) {
			toast({
				title: "Confirmation required",
				description: "Type the campaign name exactly to confirm deletion.",
				variant: "destructive",
			});
			return;
		}
		await deleteCampaign.mutateAsync(campaignId);
		setDeleteDialogOpen(false);
		navigate("/campaigns");
	};

	const handleRegenerateShareCode = () => {
		regenerateShareCode.mutate(campaignId);
	};

	// Misty Pearl E3 — Send a test message through the configured webhook.
	const handleTestDiscord = async () => {
		setDiscordTesting(true);
		try {
			const result = await notify({
				campaignId,
				kind: "test",
				payload: { actor: name || "Warden" },
			});
			if (result.delivered) {
				toast({
					title: "Test relay delivered",
					description: "Check your Discord channel.",
				});
			} else {
				toast({
					title: "Test relay not delivered",
					description:
						result.reason === "no_webhook_configured"
							? "Save the webhook URL first, then try again."
							: result.error || "Discord webhook did not accept the message.",
					variant: "destructive",
				});
			}
		} finally {
			setDiscordTesting(false);
		}
	};

	if (loadingAccess) {
		return (
			<AscendantWindow
				title="CAMPAIGN SETTINGS"
				className="h-[400px] flex flex-col"
			>
				<div className="flex items-center justify-center flex-1">
					<Loader2 className="w-6 h-6 animate-spin text-primary" />
				</div>
			</AscendantWindow>
		);
	}

	if (!hasWardenAccess) {
		return (
			<AscendantWindow
				title="CAMPAIGN SETTINGS"
				variant="alert"
				className="h-[400px] flex flex-col"
			>
				<div className="flex flex-col items-center justify-center flex-1 text-center">
					<Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
					<p className="text-muted-foreground font-heading mb-2">
						Access Restricted
					</p>
					<p className="text-sm text-muted-foreground">
						Only the Warden can access campaign settings.
					</p>
				</div>
			</AscendantWindow>
		);
	}

	if (!campaign) return null;

	return (
		<>
			<AscendantWindow title="CAMPAIGN SETTINGS" className="flex flex-col">
				<div className="flex-1 overflow-y-auto space-y-4">
					<div>
						<Label htmlFor="campaign-name">Campaign Name</Label>
						<Input
							id="campaign-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="campaign-description">Description</Label>
						<Textarea
							id="campaign-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="mt-1"
							rows={4}
						/>
					</div>
					<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
						<div>
							<Label htmlFor="campaign-active">Campaign Active</Label>
							<p className="text-xs text-muted-foreground">
								Inactive campaigns cannot accept new members
							</p>
						</div>
						<Switch
							id="campaign-active"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
					</div>
					<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
						<div>
							<Label htmlFor="content-sharing">Content Sharing</Label>
							<p className="text-xs text-muted-foreground">
								Allow campaign members to access your compendium content
							</p>
						</div>
						<Switch
							id="content-sharing"
							checked={contentSharingEnabled}
							onCheckedChange={setContentSharingEnabled}
						/>
					</div>
					<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
						<div>
							<Label htmlFor="campaign-leveling-mode">Leveling Mode</Label>
							<p className="text-xs text-muted-foreground">
								Choose XP or milestone advancement for this campaign
							</p>
						</div>
						<Select
							value={levelingMode}
							onValueChange={(value) => setLevelingMode(value as LevelingMode)}
						>
							<SelectTrigger id="campaign-leveling-mode" className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="milestone">Milestone</SelectItem>
								<SelectItem value="xp">XP</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Misty Pearl E3 — Discord Uplink */}
					<div className="p-3 bg-muted/50 rounded space-y-2">
						<div className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-primary" />
							<Label
								htmlFor="discord-webhook-url"
								className="font-heading font-semibold"
							>
								Discord Uplink
							</Label>
						</div>
						<p className="text-xs text-muted-foreground">
							Optional. Paste a Discord channel webhook URL to mirror session
							reminders and Warden broadcasts into a Discord guild. The
							webhook URL is treated as low-sensitivity — anyone with it can
							post to the channel.
						</p>
						<div className="flex gap-2">
							<Input
								id="discord-webhook-url"
								type="url"
								inputMode="url"
								placeholder="https://discord.com/api/webhooks/..."
								value={discordWebhookUrl}
								onChange={(e) => setDiscordWebhookUrl(e.target.value)}
								data-testid="discord-webhook-url-input"
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleTestDiscord}
								disabled={discordTesting || !discordWebhookUrl.trim()}
								aria-label="Send a test message to Discord"
								data-testid="discord-webhook-test-btn"
							>
								{discordTesting ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Send className="w-4 h-4" />
								)}
								<span className="ml-2 hidden sm:inline">Test</span>
							</Button>
						</div>
					</div>

					{/* Misty Pearl G2 — Discord Two-Way Bot */}
					<div className="p-3 bg-muted/50 rounded space-y-2">
						<div className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-primary" />
							<Label
								htmlFor="discord-app-id"
								className="font-heading font-semibold"
							>
								Discord Two-Way Bot
							</Label>
						</div>
						<p className="text-xs text-muted-foreground">
							Optional. Register a Discord application in the{" "}
							<a
								href="https://discord.com/developers/applications"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								Developer Portal
							</a>
							, paste the Application ID and Public Key below, point its
							Interactions Endpoint at the{" "}
							<code className="text-[10px] bg-muted px-1">
								/discord-command?campaign={campaignId}
							</code>{" "}
							Supabase function, then run{" "}
							<code className="text-[10px] bg-muted px-1">
								scripts/register-discord-commands.ts
							</code>{" "}
							once. Operatives link with{" "}
							<code className="text-[10px] bg-muted px-1">
								/link code:&lt;share-code&gt;
							</code>
							.
						</p>
						<div>
							<Label htmlFor="discord-app-id" className="text-xs">
								Application ID
							</Label>
							<Input
								id="discord-app-id"
								value={discordAppId}
								onChange={(e) => setDiscordAppId(e.target.value)}
								placeholder="e.g. 1234567890123456789"
								className="mt-1 font-mono text-xs"
								data-testid="discord-app-id-input"
							/>
						</div>
						<div>
							<Label htmlFor="discord-public-key" className="text-xs">
								Public Key (hex)
							</Label>
							<Input
								id="discord-public-key"
								value={discordPublicKey}
								onChange={(e) => setDiscordPublicKey(e.target.value)}
								placeholder="64-char hex from the Application's General Information tab"
								className="mt-1 font-mono text-xs"
								data-testid="discord-public-key-input"
							/>
						</div>
					</div>

					{/* Misty Pearl I3 — Comm-Net LiveKit transport */}
					<div className="p-3 bg-muted/50 rounded space-y-2">
						<div className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-primary" />
							<Label
								htmlFor="livekit-url"
								className="font-heading font-semibold"
							>
								Comm-Net SFU (LiveKit) — optional
							</Label>
						</div>
						<p className="text-xs text-muted-foreground">
							Default Comm-Net is mesh P2P (great for ≤6 operatives). For
							larger parties or mobile-heavy tables, point a{" "}
							<a
								href="https://livekit.io"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary"
							>
								LiveKit
							</a>{" "}
							server here (free Cloud tier or MIT self-host). Tokens are
							minted server-side by the{" "}
							<code className="text-[10px] bg-muted px-1">
								mint-livekit-token
							</code>{" "}
							edge function; the secret never reaches the browser.
						</p>
						<div>
							<Label htmlFor="livekit-url" className="text-xs">
								URL
							</Label>
							<Input
								id="livekit-url"
								type="url"
								inputMode="url"
								placeholder="wss://your-livekit.example.com"
								value={livekitUrl}
								onChange={(e) => setLivekitUrl(e.target.value)}
								className="mt-1 font-mono text-xs"
								data-testid="livekit-url-input"
							/>
						</div>
						<div>
							<Label htmlFor="livekit-api-key" className="text-xs">
								API Key
							</Label>
							<Input
								id="livekit-api-key"
								placeholder="APIxxxxxxxxx"
								value={livekitApiKey}
								onChange={(e) => setLivekitApiKey(e.target.value)}
								className="mt-1 font-mono text-xs"
								data-testid="livekit-api-key-input"
							/>
						</div>
						<div>
							<Label htmlFor="livekit-api-secret" className="text-xs">
								API Secret (write-only — leave blank to keep current)
							</Label>
							<Input
								id="livekit-api-secret"
								type="password"
								autoComplete="new-password"
								placeholder="Set once; never displayed back."
								value={livekitApiSecret}
								onChange={(e) => setLivekitApiSecret(e.target.value)}
								className="mt-1 font-mono text-xs"
								data-testid="livekit-api-secret-input"
							/>
						</div>
					</div>
				</div>
				<div className="pt-4 border-t border-border space-y-3">
					<Button
						onClick={handleSave}
						className="w-full"
						disabled={updateCampaign.isPending}
					>
						{updateCampaign.isPending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</AscendantWindow>

			{/* Misty Pearl G3 — Bureau Directive Extensions (modules) */}
			<BureauDirectiveExtensionsPanel campaignId={campaignId} />

			{/* Share Code Management */}
			<AscendantWindow title="SHARE CODE MANAGEMENT" className="flex flex-col">
				<div className="space-y-4">
					<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
						<div>
							<p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
								CURRENT SHARE CODE
							</p>
							<p className="font-mono font-bold text-xl text-primary mt-1">
								{campaign.share_code}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleRegenerateShareCode}
							disabled={regenerateShareCode.isPending}
							className="gap-2"
						>
							<RefreshCw
								className={`w-4 h-4 ${regenerateShareCode.isPending ? "animate-spin" : ""}`}
							/>
							{regenerateShareCode.isPending ? "Regenerating..." : "Regenerate"}
						</Button>
					</div>
					<p className="text-xs text-muted-foreground">
						Regenerating the share code invalidates the old one. Anyone with the
						old code or link will no longer be able to join.
					</p>
				</div>
			</AscendantWindow>

			{/* Module Management */}
			<AscendantWindow title="MODULE MANAGEMENT" className="flex flex-col">
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded gap-3">
						<div>
							<p className="font-heading font-semibold text-primary flex items-center gap-2">
								<Sparkles className="w-4 h-4" />
								The Shadow of the Regent
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Import or re-import the sandbox module into this campaign.
								Populates VTT maps, wiki, and encounters.
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => injectSandbox(campaignId)}
							disabled={isInjecting}
							className="gap-2 min-w-[140px]"
						>
							{isInjecting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Injecting...
								</>
							) : (
								<>
									<Download className="w-4 h-4 mr-2" />
									Import Module
								</>
							)}
						</Button>
					</div>
					{isInjecting && (
						<p className="text-xs text-primary animate-pulse text-right">
							{progressString || "Processing..."}
						</p>
					)}
				</div>
			</AscendantWindow>

			{/* Danger Zone */}
			<AscendantWindow
				title="DANGER ZONE"
				variant="alert"
				className="flex flex-col"
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded">
						<div>
							<p className="font-heading font-semibold text-destructive">
								Delete Campaign
							</p>
							<p className="text-xs text-muted-foreground">
								Permanently delete this campaign and all its data. This action
								cannot be undone.
							</p>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => setDeleteDialogOpen(true)}
							className="gap-2"
						>
							<Trash2 className="w-4 h-4" />
							Delete
						</Button>
					</div>
				</div>
			</AscendantWindow>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="border-destructive/30">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="w-5 h-5" />
							DELETE CAMPAIGN
						</DialogTitle>
						<DialogDescription>
							This will permanently delete <strong>{campaign.name}</strong> and
							all associated data (wiki, sessions, VTT maps, handouts, notes,
							chat, members). This action is irreversible.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label htmlFor="delete-confirm" className="text-sm">
							Type <strong>{campaign.name}</strong> to confirm:
						</Label>
						<Input
							id="delete-confirm"
							value={deleteConfirmText}
							onChange={(e) => setDeleteConfirmText(e.target.value)}
							className="mt-2 border-destructive/30"
							placeholder={campaign.name}
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setDeleteConfirmText("");
							}}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteCampaign}
							disabled={
								deleteConfirmText !== campaign.name || deleteCampaign.isPending
							}
						>
							{deleteCampaign.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete Permanently
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
