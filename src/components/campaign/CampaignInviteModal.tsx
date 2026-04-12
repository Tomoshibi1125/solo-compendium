import { formatDistanceToNow } from "date-fns";
import { Copy, Link as LinkIcon, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
	useCampaignInviteAuditLogs,
	useCampaignInvites,
	useCreateCampaignInvite,
	useDeleteCampaignInvite,
} from "@/hooks/useCampaignInvites";
import type { Campaign } from "@/hooks/useCampaigns";
import {
	buildCampaignInviteUrl,
	campaignInviteStatusLabel,
	campaignInviteStatusMessage,
	deriveCampaignInviteStatus,
} from "@/lib/campaignInviteUtils";

interface CampaignInviteModalProps {
	campaign: Campaign;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CampaignInviteModal({
	campaign,
	open,
	onOpenChange,
}: CampaignInviteModalProps) {
	const { toast } = useToast();
	const campaignId = campaign.id;

	const { data: invites = [], isLoading: invitesLoading } =
		useCampaignInvites(campaignId);
	useCampaignInviteAuditLogs(campaignId);
	const createInvite = useCreateCampaignInvite();
	const deleteInvite = useDeleteCampaignInvite();

	const [inviteRole, setInviteRole] = useState<"ascendant" | "co-system">(
		"ascendant",
	);
	const [inviteExpiresAt, setInviteExpiresAt] = useState("");
	const [inviteMaxUses, setInviteMaxUses] = useState(1);
	const [inviteEmail, setInviteEmail] = useState("");
	const [revokeReason] = useState("");

	const handleCreateInvite = async () => {
		const expiresAt = inviteExpiresAt
			? new Date(inviteExpiresAt).toISOString()
			: null;
		await createInvite.mutateAsync({
			campaignId,
			role: inviteRole,
			expiresAt,
			maxUses: inviteMaxUses,
			inviteEmail: inviteEmail.trim() || undefined,
		});
		setInviteEmail("");
		setInviteExpiresAt("");
		setInviteMaxUses(1);
	};

	const handleCopyInvite = async (token: string) => {
		const url = buildCampaignInviteUrl(window.location.origin, token);
		await navigator.clipboard.writeText(url);
		toast({
			title: "Invite Link Copied",
			description: "Ready to share with your Ascendant.",
		});
	};

	const handleCopyJoinCode = async (joinCode: string) => {
		await navigator.clipboard.writeText(joinCode);
		toast({
			title: "Join Code Copied",
			description: "Ascendants can enter this code to join.",
		});
	};

	const handleCopyShareLink = async () => {
		const shareUrl = `${window.location.origin}/campaigns/join/${campaign.share_code}`;
		await navigator.clipboard.writeText(shareUrl);
		toast({
			title: "Global Share Link Copied",
			description: "Anyone with this link can attempt to join the campaign.",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-primary/30 max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="font-resurge text-2xl tracking-wide flex items-center gap-2">
						<Users className="w-5 h-5 text-primary" />
						INVITE ASCENDANTS
					</DialogTitle>
					<DialogDescription>
						Bring players into "{campaign.name}" via global share codes or
						secure single-use tokens.
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="quick" className="w-full mt-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="quick" className="gap-2">
							<LinkIcon className="w-4 h-4" />
							Quick Share
						</TabsTrigger>
						<TabsTrigger value="advanced" className="gap-2">
							<Plus className="w-4 h-4" />
							Advanced Tokens
						</TabsTrigger>
					</TabsList>

					<TabsContent value="quick" className="space-y-6 pt-4">
						<div className="bg-muted/30 p-6 rounded-lg border border-border text-center space-y-4">
							<h3 className="font-heading text-lg font-semibold text-primary">
								Permanent Share Code
							</h3>
							<p className="font-mono text-4xl tracking-[0.25em] font-bold">
								{campaign.share_code}
							</p>
							<AscendantText className="block text-sm text-muted-foreground max-w-md mx-auto">
								This code never expires and can be used by anyone to immediately
								join your campaign directly as an Ascendant.
							</AscendantText>
							<div className="flex justify-center gap-3 pt-4">
								<Button onClick={() => handleCopyJoinCode(campaign.share_code)}>
									<Copy className="w-4 h-4 mr-2" />
									Copy Code
								</Button>
								<Button variant="outline" onClick={handleCopyShareLink}>
									<LinkIcon className="w-4 h-4 mr-2" />
									Copy Join URL
								</Button>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="advanced" className="space-y-6 pt-4">
						<div className="bg-muted/20 p-4 border border-border rounded-lg space-y-4">
							<h4 className="font-heading font-medium">Create Secure Invite</h4>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div>
									<Label htmlFor="invite-role">Role</Label>
									<Select
										value={inviteRole}
										onValueChange={(value) =>
											setInviteRole(value as "ascendant" | "co-system")
										}
									>
										<SelectTrigger id="invite-role">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="ascendant">Ascendant</SelectItem>
											<SelectItem value="co-system">Co-System</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="invite-expire">Expires At</Label>
									<Input
										id="invite-expire"
										type="datetime-local"
										value={inviteExpiresAt}
										onChange={(e) => setInviteExpiresAt(e.target.value)}
									/>
								</div>
								<div>
									<Label htmlFor="invite-uses">Max Uses</Label>
									<Input
										id="invite-uses"
										type="number"
										min={1}
										value={inviteMaxUses}
										onChange={(e) =>
											setInviteMaxUses(Math.max(1, Number(e.target.value) || 1))
										}
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="invite-email">Invite Email (optional)</Label>
								<Input
									id="invite-email"
									type="email"
									value={inviteEmail}
									onChange={(e) => setInviteEmail(e.target.value)}
									placeholder="ascendant@example.com"
								/>
							</div>
							<Button
								onClick={handleCreateInvite}
								className="w-full"
								disabled={createInvite.isPending}
							>
								{createInvite.isPending
									? "Generating..."
									: "Generate Secure Link"}
							</Button>
						</div>

						<div className="space-y-3">
							<h4 className="font-heading font-medium">Active Tokens</h4>
							{invitesLoading ? (
								<p className="text-xs text-muted-foreground animate-pulse">
									Loading...
								</p>
							) : invites.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No secure tokens generated.
								</p>
							) : (
								<div className="space-y-2">
									{invites.map((invite) => {
										const status = deriveCampaignInviteStatus(invite);
										const isRevoked = status === "revoked";
										const remaining = Math.max(
											invite.max_uses - invite.used_count,
											0,
										);

										return (
											<div
												key={invite.id}
												className="p-3 bg-card border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
											>
												<div>
													<div className="flex items-center gap-2 mb-1">
														<Badge variant="outline" className="text-[10px]">
															{invite.role === "co-system"
																? "Co-System"
																: "Ascendant"}
														</Badge>
														{status === "active" ? (
															<Badge className="bg-emerald-600 text-white text-[10px]">
																Active
															</Badge>
														) : (
															<Badge
																variant="destructive"
																className="text-[10px]"
															>
																{campaignInviteStatusLabel(status)}
															</Badge>
														)}
													</div>
													<p className="text-xs text-muted-foreground">
														{remaining} uses remaining ·{" "}
														{invite.expires_at
															? `Expires ${formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })}`
															: "Never expires"}
													</p>
													<p className="text-[10px] text-muted-foreground mt-1">
														{campaignInviteStatusMessage(status)}
													</p>
												</div>

												<div className="flex flex-wrap gap-2">
													{invite.join_code && (
														<Button
															size="sm"
															variant="outline"
															className="h-7 text-xs px-2"
															onClick={() =>
																handleCopyJoinCode(invite.join_code ?? "")
															}
														>
															Copy Code
														</Button>
													)}
													<Button
														size="sm"
														variant="secondary"
														className="h-7 text-xs px-2"
														onClick={() =>
															handleCopyInvite(invite.join_code || invite.token)
														}
													>
														Copy Link
													</Button>
													<Button
														size="sm"
														variant="destructive"
														disabled={isRevoked}
														className="h-7 text-xs px-2"
														onClick={() =>
															deleteInvite.mutate({
																campaignId,
																inviteId: invite.id,
																reason: revokeReason || undefined,
															})
														}
													>
														<Trash2 className="w-3 h-3" />
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
