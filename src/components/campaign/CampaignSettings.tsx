import {
	AlertTriangle,
	Loader2,
	RefreshCw,
	Save,
	Shield,
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
import {
	useCampaign,
	useDeleteCampaign,
	useHasWardenAccess,
	useRegenerateShareCode,
	useUpdateCampaign,
} from "@/hooks/useCampaigns";
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
				},
			},
			{
				onSuccess: () => {
					// Broadcast settings update to the campaign chat
					sendMessage
						.mutateAsync({
							campaignId,
							content: `**System**: The Warden has updated the campaign rules/settings.`,
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
			<AscendantWindow
				title="CAMPAIGN SETTINGS"
				className="flex flex-col"
			>
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
							<RefreshCw className={`w-4 h-4 ${regenerateShareCode.isPending ? "animate-spin" : ""}`} />
							{regenerateShareCode.isPending ? "Regenerating..." : "Regenerate"}
						</Button>
					</div>
					<p className="text-xs text-muted-foreground">
						Regenerating the share code invalidates the old one. Anyone with the
						old code or link will no longer be able to join.
					</p>
				</div>
			</AscendantWindow>

			{/* Danger Zone */}
			<AscendantWindow title="DANGER ZONE" variant="alert" className="flex flex-col">
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
							This will permanently delete{" "}
							<strong>{campaign.name}</strong> and all associated data
							(wiki, sessions, VTT maps, handouts, notes, chat, members).
							This action is irreversible.
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
								deleteConfirmText !== campaign.name ||
								deleteCampaign.isPending
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
