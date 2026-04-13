import { useQueryClient } from "@tanstack/react-query";
import {
	Copy,
	Crown,
	ExternalLink,
	Loader2,
	LogOut,
	MoreVertical,
	Plus,
	RefreshCw,
	Shield,
	Sparkles,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCampaignSandboxInjector } from "@/hooks/useCampaignSandboxInjector";
import {
	useCreateCampaign,
	useDeleteCampaign,
	useJoinedCampaigns,
	useLeaveCampaign,
	useMyCampaigns,
	useRegenerateShareCode,
} from "@/hooks/useCampaigns";
import { useAuth } from "@/lib/auth/authContext";
import { getLocalUserId } from "@/lib/guestStore";
import { cn } from "@/lib/utils";

const Campaigns = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [campaignName, setCampaignName] = useState("");
	const [campaignDescription, setCampaignDescription] = useState("");
	const [importSandbox, setImportSandbox] = useState(false);

	const { user } = useAuth();
	const { data: myCampaigns = [], isLoading: loadingMy } = useMyCampaigns();
	const { data: joinedCampaigns = [], isLoading: loadingJoined } =
		useJoinedCampaigns();
	const createCampaign = useCreateCampaign();
	const leaveCampaign = useLeaveCampaign();
	const deleteCampaign = useDeleteCampaign();
	const regenerateShareCode = useRegenerateShareCode();
	const { injectSandbox } = useCampaignSandboxInjector(null);

	const handleDeleteCampaign = async (campaignId: string) => {
		if (confirm("Are you sure you want to permanently delete this campaign? This cannot be undone.")) {
			await deleteCampaign.mutateAsync(campaignId);
		}
	};

	const handleRegenerateCode = async (campaignId: string) => {
		if (confirm("Are you sure you want to regenerate the share code? The old code will no longer work.")) {
			await regenerateShareCode.mutateAsync(campaignId);
		}
	};

	const handleCreateCampaign = async () => {
		if (!campaignName.trim()) {
			toast({
				title: "Name required",
				description: "Please enter a campaign name.",
				variant: "destructive",
			});
			return;
		}

		try {
			const campaignId = await createCampaign.mutateAsync({
				name: campaignName,
				description: campaignDescription || undefined,
			});

			// Seed optimistic cache with a temporary share code —
			// the mutation itself will overwrite this with real data from Supabase
			const wardenId = user?.id || getLocalUserId();
			const now = new Date().toISOString();
			const tempShareCode = Array.from(
				{ length: 6 },
				() =>
					"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)],
			).join("");

			// Only seed if the mutation hasn't already populated the cache
			const existingCached = queryClient.getQueryData([
				"campaigns",
				campaignId,
			]);
			if (!existingCached) {
				queryClient.setQueryData(["campaigns", campaignId], {
					id: campaignId,
					name: campaignName,
					description: campaignDescription || null,
					warden_id: wardenId,
					share_code: tempShareCode,
					is_active: true,
					created_at: now,
					updated_at: now,
					settings: { leveling_mode: "milestone" },
				});
			}

			// Seed warden access so CampaignDetail shows share code immediately
			queryClient.setQueryData(
				["campaigns", campaignId, "has-system-access"],
				true,
			);
			queryClient.setQueryData(
				["campaigns", campaignId, "role"],
				"warden" as const,
			);
			queryClient.setQueryData(
				["campaigns", campaignId, "members"],
				[
					{
						id: crypto.randomUUID(),
						campaign_id: campaignId,
						user_id: wardenId,
						character_id: null,
						role: "warden",
						joined_at: now,
					},
				],
			);

			// Inject sandbox module if requested — only for authenticated users
			// whose campaign was verified by the RPC + post-check
			if (importSandbox && user) {
				void injectSandbox(campaignId);
				toast({
					title: "Campaign Established",
					description:
						'Importing "The Shadow of the Regent" sandbox module in the background...',
				});
			} else if (importSandbox && !user) {
				toast({
					title: "Campaign Established",
					description:
						"Sign in to import the sandbox module with full wiki, maps, and encounters.",
				});
			}

			setCreateDialogOpen(false);
			setCampaignName("");
			setCampaignDescription("");
			setImportSandbox(false);
			navigate(`/campaigns/${campaignId}`);
		} catch {
			// Error handled by mutation
		}
	};

	const handleCopyShareLink = (shareCode: string) => {
		const shareUrl = `${window.location.origin}/campaigns/join/${shareCode}`;
		navigator.clipboard.writeText(shareUrl);
		toast({
			title: "Share link copied!",
			description: "Ascendants can use this link to join your campaign.",
		});
	};

	const handleLeaveCampaign = async (campaignId: string) => {
		if (confirm("Are you sure you want to leave this campaign?")) {
			await leaveCampaign.mutateAsync(campaignId);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
					<div className="min-w-0 flex-1">
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="mb-2 leading-tight"
						>
							Campaign Registry
						</RiftHeading>
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-sm sm:text-base"
						>
							Establish or join campaigns to hunt across the Rift's domain
						</ManaFlowText>
					</div>
					<Button
						onClick={() => setCreateDialogOpen(true)}
						className="gap-2 font-heading bg-gradient-to-r from-resurge to-shadow-purple hover:shadow-resurge/30 hover:shadow-lg transition-all min-h-[44px] px-4 sm:px-6"
					>
						<Plus className="w-4 h-4" />
						<span className="hidden sm:inline">Create Campaign</span>
						<span className="sm:hidden">Create</span>
					</Button>
				</div>

				{/* My Campaigns (Warden) */}
				<div className="mb-8">
					<RiftHeading
						level={2}
						variant="sovereign"
						className="mb-4 flex items-center gap-2"
					>
						<Crown className="w-5 h-5 text-amber-400" />
						Campaigns I Lead
					</RiftHeading>
					{loadingMy ? (
						<div className="flex flex-col items-center justify-center py-12 gap-4">
							<div className="relative">
								<div className="w-12 h-12 border-4 border-amber-500/20 rounded-full" />
								<div className="absolute inset-0 w-12 h-12 border-4 border-t-amber-400 rounded-full animate-spin" />
							</div>
							<ManaFlowText
								variant="rift"
								speed="fast"
								className="text-muted-foreground font-heading animate-pulse"
							>
								Loading campaigns...
							</ManaFlowText>
						</div>
					) : myCampaigns.length === 0 ? (
						<AscendantWindow
							title="NO CAMPAIGNS FOUND"
							className="text-center py-8 border-amber-500/30"
						>
							<Crown className="w-12 h-12 mx-auto text-amber-400/50 mb-4" />
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="text-muted-foreground mb-4"
							>
								You haven't established any campaigns yet. Create one to unite
								Ascendants under your banner.
							</ManaFlowText>
							<Button
								onClick={() => setCreateDialogOpen(true)}
								className="bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-amber-500/30 hover:shadow-lg min-h-[44px]"
							>
								<Crown className="w-4 h-4 mr-2" />
								<span className="hidden sm:inline">
									Establish Your Campaign
								</span>
								<span className="sm:hidden">Create Campaign</span>
							</Button>
						</AscendantWindow>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
							{myCampaigns.map((campaign) => (
								<div
									key={campaign.id}
									className={cn(
										"rounded-[2px] p-5 transition-all duration-300 group relative overflow-hidden backdrop-blur-md",
										"border-l-4 border-y border-r border-amber-500/30 border-l-amber-500 bg-black/60",
										"hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_hsl(var(--amber-500)/0.2)] focus:outline-none",
									)}
								>
									{/* Background glow */}
									<div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

									<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 relative gap-2">
										<div className="flex items-center gap-2">
											<Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
											<h3 className="font-resurge text-base sm:text-lg font-semibold tracking-wide group-hover:text-amber-400 transition-colors leading-tight">
												{campaign.name.toUpperCase()}
											</h3>
										</div>
										<span className="text-xs font-resurge text-amber-400 bg-amber-500/10 px-2 py-1 rounded whitespace-nowrap">
											WARDEN
										</span>
									</div>

									<AscendantText className="block text-xs sm:text-sm text-muted-foreground mb-4 min-h-[2.5rem] sm:min-h-[3rem] relative leading-relaxed">
										{campaign.description || "No description provided."}
									</AscendantText>

									<div className="space-y-3 relative">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/40 rounded-[2px] border border-amber-500/20 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] gap-2">
											<span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
												SHARE CODE
											</span>
											<span className="font-mono font-bold text-lg sm:text-xl text-amber-400 tracking-widest text-center sm:text-right">
												{campaign.share_code}
											</span>
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 min-h-[36px]"
												onClick={() => handleCopyShareLink(campaign.share_code)}
											>
												<Copy className="w-3 h-3" />
												<span className="hidden sm:inline">Copy Link</span>
												<span className="sm:hidden">Copy</span>
											</Button>
											<Link to={`/campaigns/${campaign.id}`} className="flex-1">
												<Button
													size="sm"
													className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-amber-500/30 hover:shadow-lg min-h-[36px]"
												>
													<ExternalLink className="w-3 h-3" />
													<span className="hidden sm:inline">Open</span>
													<span className="sm:hidden">View</span>
												</Button>
											</Link>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className="px-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 min-h-[36px]"
													>
														<MoreVertical className="w-4 h-4 text-amber-400" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48 bg-black/95 border-amber-500/30">
													<DropdownMenuItem 
														onClick={() => handleRegenerateCode(campaign.id)}
														className="gap-2 cursor-pointer focus:bg-amber-500/20 focus:text-amber-400"
													>
														<RefreshCw className="w-4 h-4" />
														Regenerate Code
													</DropdownMenuItem>
													<DropdownMenuItem 
														onClick={() => handleDeleteCampaign(campaign.id)}
														className="text-destructive gap-2 cursor-pointer focus:bg-destructive/20 focus:text-destructive"
													>
														<Trash2 className="w-4 h-4" />
														Delete Campaign
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Joined Campaigns (Ascendant) */}
				<div>
					<RiftHeading
						level={2}
						variant="gate"
						className="mb-4 flex items-center gap-2"
					>
						<Users className="w-5 h-5 text-resurge" />
						Campaigns I've Joined
					</RiftHeading>
					{loadingJoined ? (
						<div className="flex flex-col items-center justify-center py-12 gap-4">
							<div className="relative">
								<div className="w-12 h-12 border-4 border-resurge/20 rounded-full" />
								<div className="absolute inset-0 w-12 h-12 border-4 border-t-resurge rounded-full animate-spin" />
							</div>
							<AscendantText className="block text-muted-foreground font-heading animate-pulse">
								Searching campaigns...
							</AscendantText>
						</div>
					) : joinedCampaigns.length === 0 ? (
						<AscendantWindow
							title="NO JOINED CAMPAIGNS"
							className="text-center py-8"
						>
							<Shield className="w-12 h-12 mx-auto text-resurge/50 mb-4" />
							<AscendantText className="block text-muted-foreground mb-4">
								You haven't joined any campaigns yet. Ask your Warden for a
								share code or link.
							</AscendantText>
							<Link to="/campaigns/join">
								<Button className="bg-gradient-to-r from-resurge to-shadow-purple min-h-[44px]">
									<UserPlus className="w-4 h-4 mr-2" />
									<span className="hidden sm:inline">Join Campaign</span>
									<span className="sm:hidden">Join</span>
								</Button>
							</Link>
						</AscendantWindow>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
							{joinedCampaigns.map((campaign) => (
								<div
									key={campaign.id}
									className={cn(
										"rounded-[2px] p-5 transition-all duration-300 group relative overflow-hidden backdrop-blur-md",
										"border-l-4 border-y border-r border-resurge/30 border-l-resurge bg-black/60",
										"hover:border-resurge/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_hsl(var(--resurge)/0.2)] focus:outline-none",
									)}
								>
									{/* Background glow */}
									<div className="absolute -bottom-10 -right-10 w-32 h-32 bg-resurge/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

									<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 relative gap-2">
										<div className="flex items-center gap-2">
											<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-resurge" />
											<h3 className="font-resurge text-base sm:text-lg font-semibold tracking-wide group-hover:text-resurge transition-colors leading-tight">
												{campaign.name.toUpperCase()}
											</h3>
										</div>
									</div>

									<AscendantText className="block text-xs sm:text-sm text-muted-foreground mb-4 min-h-[2.5rem] sm:min-h-[3rem] relative leading-relaxed">
										{campaign.description || "No description provided."}
									</AscendantText>

									<div className="space-y-3 relative">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/40 rounded-[2px] border border-resurge/20 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] gap-2">
											<span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
												YOUR ROLE
											</span>
											<span
												className={cn(
													"font-heading font-semibold px-2 py-1 rounded text-sm",
													campaign.member_role === "co-system"
														? "text-amber-400 bg-amber-500/10"
														: "text-resurge bg-resurge/10",
												)}
											>
												{campaign.member_role === "co-system"
													? "Co-System"
													: "Ascendant"}
											</span>
										</div>
										<div className="flex gap-2">
											<Link to={`/campaigns/${campaign.id}`} className="flex-1">
												<Button
													size="sm"
													className="w-full gap-2 bg-gradient-to-r from-resurge to-shadow-purple min-h-[36px]"
												>
													<ExternalLink className="w-3 h-3" />
													<span className="hidden sm:inline">Open</span>
													<span className="sm:hidden">View</span>
												</Button>
											</Link>
											<Button
												variant="outline"
												size="sm"
												className="gap-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 text-destructive min-h-[36px]"
												onClick={() => handleLeaveCampaign(campaign.id)}
											>
												<LogOut className="w-3 h-3" />
												<span className="hidden sm:inline">Leave</span>
												<span className="sm:hidden">Exit</span>
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Create Campaign Dialog */}
				<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
					<DialogContent className="border-resurge/30 bg-background/95 backdrop-blur-xl w-[calc(100%-2rem)] max-w-md">
						<DialogHeader>
							<DialogTitle className="font-resurge text-xl flex items-center gap-2 tracking-wide">
								<Sparkles className="w-5 h-5 text-resurge" />
								CREATE NEW CAMPAIGN
							</DialogTitle>
							<DialogDescription>
								Establish your campaign and share the code with your Ascendants.
								They can join from anywhere in the realm.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div>
								<Label htmlFor="campaign-name" className="font-heading">
									Campaign Name
								</Label>
								<Input
									id="campaign-name"
									value={campaignName}
									onChange={(e) => setCampaignName(e.target.value)}
									placeholder="The Shadow Legion"
									className="mt-1 border-resurge/30 focus:border-resurge/50"
								/>
							</div>
							<div>
								<Label htmlFor="campaign-description" className="font-heading">
									Description (Optional)
								</Label>
								<Textarea
									id="campaign-description"
									value={campaignDescription}
									onChange={(e) => setCampaignDescription(e.target.value)}
									placeholder="A campaign dedicated to clearing the highest rank rifts..."
									className="mt-1 border-resurge/30 focus:border-resurge/50"
									rows={3}
								/>
							</div>
							<div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-resurge/20 bg-resurge/5 p-4 mt-2">
								<Checkbox
									id="import-sandbox"
									checked={importSandbox}
									onCheckedChange={(checked) =>
										setImportSandbox(checked === true)
									}
									className="border-resurge data-[state=checked]:bg-resurge"
								/>
								<div className="space-y-1 leading-none">
									<Label
										htmlFor="import-sandbox"
										className="text-sm font-heading font-medium leading-none cursor-pointer flex items-center gap-2"
									>
										<Sparkles className="w-3.5 h-3.5 text-resurge" />
										IMPORT "THE SHADOW OF THE REGENT"
									</Label>
									<p className="text-[10px] text-muted-foreground font-mono">
										Pre-populate with full lore, maps, and encounters.
									</p>
								</div>
							</div>
						</div>
						<DialogFooter className="flex-col sm:flex-row gap-2">
							<Button
								variant="outline"
								onClick={() => setCreateDialogOpen(false)}
								className="font-heading w-full sm:w-auto min-h-[44px]"
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateCampaign}
								disabled={createCampaign.isPending}
								className="font-heading bg-gradient-to-r from-resurge to-shadow-purple"
							>
								{createCampaign.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Crown className="w-4 h-4 mr-2" />
										Establish Campaign
									</>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
};

export default Campaigns;
