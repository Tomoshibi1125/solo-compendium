import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	BookOpen,
	CalendarClock,
	Crown,
	FileText,
	Layers,
	Loader2,
	MessageSquare,
	Settings,
	Share2,
	UserPlus,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CampaignCharacters } from "@/components/campaign/CampaignCharacters";
import { CampaignChat } from "@/components/campaign/CampaignChat";
import { CampaignHandouts } from "@/components/campaign/CampaignHandouts";
import { CampaignInviteModal } from "@/components/campaign/CampaignInviteModal";
import { CampaignNotes } from "@/components/campaign/CampaignNotes";
import { CampaignProtocolControls } from "@/components/campaign/CampaignProtocolControls";
import { CampaignRegentOversight } from "@/components/campaign/CampaignRegentOversight";
import { CampaignRollFeed } from "@/components/campaign/CampaignRollFeed";
import { CampaignSessionsPanel } from "@/components/campaign/CampaignSessionsPanel";
import { CampaignSettings } from "@/components/campaign/CampaignSettings";
import { CampaignWiki } from "@/components/campaign/CampaignWiki";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
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
import { RoleBadge } from "@/components/ui/RoleBadge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import {
	type Campaign,
	useCampaign,
	useCampaignMembers,
	useCampaignRole,
	useHasWardenAccess,
	useLinkCampaignCharacter,
} from "@/hooks/useCampaigns";
import { useCharacters } from "@/hooks/useCharacters";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

const CampaignDetail = () => {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("overview");
	const [inviteModalOpen, setInviteModalOpen] = useState(false);
	const [attachDialogOpen, setAttachDialogOpen] = useState(false);
	const [selectedCharacterToAttach, setSelectedCharacterToAttach] =
		useState("");
	const [loadingTimedOut, setLoadingTimedOut] = useState(false);

	const { user, loading } = useAuth();
	const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";
	const isE2E = import.meta.env.VITE_E2E === "true";

	const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || "");

	// Safety net: if campaign doesn't load within 8 seconds, stop showing spinner
	useEffect(() => {
		if (!loadingCampaign || campaign) {
			setLoadingTimedOut(false);
			return;
		}
		const timer = setTimeout(() => setLoadingTimedOut(true), 8000);
		return () => clearTimeout(timer);
	}, [loadingCampaign, campaign]);
	const { data: members = [], isLoading: loadingMembers } = useCampaignMembers(
		id || "",
	);
	const { data: hasWardenAccess = false } = useHasWardenAccess(id || "");
	const { data: userRole, isLoading: loadingRole } = useCampaignRole(id || "");

	const { data: myCharacters = [] } = useCharacters();
	const linkCharacter = useLinkCampaignCharacter();
	const sendMessage = useSendCampaignMessage();

	const handleAttachCharacter = async () => {
		if (!selectedCharacterToAttach || !id) return;
		await linkCharacter.mutateAsync({
			campaignId: id,
			characterId: selectedCharacterToAttach,
		});
		const char = myCharacters.find((c) => c.id === selectedCharacterToAttach);
		if (char) {
			await sendMessage.mutateAsync({
				campaignId: id,
				content: `**System**: ${char.name} has joined the campaign.`,
			});
		}
		setAttachDialogOpen(false);
		setSelectedCharacterToAttach("");
	};

	// Real-time updates for campaign members
	useEffect(() => {
		if (!id) return;
		if (!isSupabaseConfigured || isE2E || loading || (guestEnabled && !user))
			return;

		const channel = supabase
			.channel(`campaign:${id}:members`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "campaign_members",
					filter: `campaign_id=eq.${id}`,
				},
				() => {
					queryClient.invalidateQueries({
						queryKey: ["campaigns", id, "members"],
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [id, loading, queryClient, user]);

	if ((loadingCampaign || (!campaign && id)) && !loadingTimedOut) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="relative">
							<div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
							<div className="absolute inset-0 w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
						</div>
						<ManaFlowText
							variant="rift"
							speed="fast"
							className="text-muted-foreground font-heading animate-pulse"
						>
							Syncing Campaign Archives...
						</ManaFlowText>
					</div>
				</div>
			</Layout>
		);
	}

	if (!campaign) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
					<AscendantWindow title="CAMPAIGN NOT FOUND" variant="alert">
						<p className="text-destructive mb-4 text-center">
							This campaign does not exist or you don't have access to it.
						</p>
						<div className="flex justify-center">
							<Button asChild>
								<Link to="/campaigns">Back to Campaigns</Link>
							</Button>
						</div>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	return (
		<>
			<Layout>
				<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
					<Button variant="ghost" className="mb-4 sm:mb-6 min-h-[44px]" asChild>
						<Link to="/campaigns">
							<ArrowLeft className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">Back to Campaigns</span>
							<span className="sm:hidden">Back</span>
						</Link>
					</Button>

					<div className="mb-6 sm:mb-8">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-2">
							<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
								<RiftHeading
									level={1}
									variant="sovereign"
									dimensional
									className="leading-tight"
								>
									{campaign.name.toUpperCase()}
								</RiftHeading>
								{!loadingRole && userRole && <RoleBadge role={userRole} />}
							</div>
							{hasWardenAccess && (
								<Button
									variant="outline"
									className="border-primary/50 hover:border-primary hover:bg-primary/10 gap-2"
									asChild
								>
									<Link to={`/campaigns/${id}/book`}>
										<BookOpen className="w-4 h-4" />
										Module Book
									</Link>
								</Button>
							)}
						</div>
						{campaign.description && (
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="text-sm sm:text-base leading-relaxed"
							>
								{campaign.description}
							</ManaFlowText>
						)}
					</div>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-6"
					>
						<TabsList
							className={cn(
								hasWardenAccess
									? "grid w-full grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
									: "grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-7",
							)}
						>
							<TabsTrigger
								value="overview"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Users className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Overview</span>
								<span className="sm:hidden">Overview</span>
							</TabsTrigger>
							<TabsTrigger
								value="vtt"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Layers className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">VTT</span>
								<span className="sm:hidden">VTT</span>
							</TabsTrigger>
							<TabsTrigger
								value="wiki"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Wiki</span>
								<span className="sm:hidden">Wiki</span>
							</TabsTrigger>
							<TabsTrigger
								value="sessions"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<CalendarClock className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Sessions</span>
								<span className="sm:hidden">Sessions</span>
							</TabsTrigger>
							<TabsTrigger
								value="chat"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Chat</span>
								<span className="sm:hidden">Chat</span>
							</TabsTrigger>
							<TabsTrigger
								value="notes"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<FileText className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Notes</span>
								<span className="sm:hidden">Notes</span>
							</TabsTrigger>
							<TabsTrigger
								value="handouts"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<FileText className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Handouts</span>
								<span className="sm:hidden">Handouts</span>
							</TabsTrigger>
							<TabsTrigger
								value="characters"
								className="gap-2 text-xs sm:text-sm min-h-[44px]"
							>
								<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Characters</span>
								<span className="sm:hidden">Characters</span>
							</TabsTrigger>
							{hasWardenAccess && (
								<TabsTrigger
									value="settings"
									className="gap-2 text-xs sm:text-sm min-h-[44px]"
								>
									<Settings className="w-3 h-3 sm:w-4 sm:h-4" />
									<span className="hidden sm:inline">Settings</span>
									<span className="sm:hidden">Settings</span>
								</TabsTrigger>
							)}
							{hasWardenAccess && (
								<TabsTrigger
									value="oversight"
									className="gap-2 text-xs sm:text-sm min-h-[44px]"
								>
									<Crown className="w-3 h-3 sm:w-4 sm:h-4" />
									<span className="hidden sm:inline">Regent Oversight</span>
									<span className="sm:hidden">Oversight</span>
								</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value="vtt">
							<AscendantWindow title="VIRTUAL TABLETOP" variant="quest">
								<div className="space-y-6 text-center py-12">
									<Layers className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
									<RiftHeading
										level={2}
										variant="gate"
										dimensional
										className="mb-4 text-center mx-auto"
									>
										Full-Featured VTT Interface
									</RiftHeading>
									<ManaFlowText
										variant="rift"
										speed="slow"
										className="max-w-2xl mx-auto mb-6"
									>
										Access the complete Virtual Tabletop system with maps,
										tokens, initiative tracking, dice rolling, chat, fog of war,
										and more. Everything you need for running sessions online.
									</ManaFlowText>
									<div className="flex items-center justify-center gap-4 flex-wrap">
										<Button className="btn-umbral" size="lg" asChild>
											<Link to={`/campaigns/${id}/vtt`}>
												<Layers className="w-5 h-5 mr-2" />
												Launch VTT
											</Link>
										</Button>
										{hasWardenAccess && (
											<Button
												variant="outline"
												size="lg"
												className="border-primary/50 hover:border-primary hover:bg-primary/10"
												asChild
											>
												<Link to={`/campaigns/${id}/book`}>
													<BookOpen className="w-5 h-5 mr-2" />
													Campaign Book
												</Link>
											</Button>
										)}
									</div>
									<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
										<div className="p-4 rounded-lg border border-border bg-muted/30">
											<h3 className="font-heading font-semibold mb-2">
												Token Management
											</h3>
											<AscendantText className="block text-xs text-muted-foreground">
												Place character tokens, Anomalies, and NPCs. Drag,
												rotate, and manage HP directly on tokens.
											</AscendantText>
										</div>
										<div className="p-4 rounded-lg border border-border bg-muted/30">
											<h3 className="font-heading font-semibold mb-2">
												Initiative Tracking
											</h3>
											<AscendantText className="block text-xs text-muted-foreground">
												Track combat initiative with automatic sorting. Manage
												turn order and combat flow.
											</AscendantText>
										</div>
										<div className="p-4 rounded-lg border border-border bg-muted/30">
											<h3 className="font-heading font-semibold mb-2">
												Dice & Chat
											</h3>
											<AscendantText className="block text-xs text-muted-foreground">
												Roll dice with full notation support. Chat with party
												members in real-time.
											</AscendantText>
										</div>
									</div>
								</div>
							</AscendantWindow>
						</TabsContent>

						<TabsContent value="overview" className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Campaign Info */}
								<AscendantWindow title="CAMPAIGN INFO">
									<div className="space-y-4">
										{hasWardenAccess ? (
											<div className="space-y-4">
												<div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border rounded-lg text-center gap-3">
													<UserPlus className="w-8 h-8 text-primary opacity-80" />
													<div className="space-y-1">
														<p className="font-heading font-semibold text-lg">
															Recruit Ascendants
														</p>
														<AscendantText className="block text-xs text-muted-foreground max-w-[250px] mx-auto">
															Manage share codes, single-use tokens, and
															invitations for this campaign.
														</AscendantText>
													</div>
													<Button
														className="w-full mt-2"
														onClick={() => setInviteModalOpen(true)}
													>
														<UserPlus className="w-4 h-4 mr-2" />
														Invite Players
													</Button>
												</div>
											</div>
										) : (
											<div className="text-center py-6">
												<AscendantText className="block text-sm text-muted-foreground font-heading mb-2">
													Share code and invite links are only visible to the
													Warden.
												</AscendantText>
												<AscendantText className="block text-xs text-muted-foreground">
													Ask your Warden for the share code to invite others.
												</AscendantText>
											</div>
										)}
									</div>
								</AscendantWindow>

								{/* Live Roll Feed (Warden only) */}
								{hasWardenAccess && <CampaignRollFeed campaignId={id || ""} />}

								{/* Campaign Members */}
								<AscendantWindow title="MEMBERS">
									{loadingMembers ? (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="w-6 h-6 animate-spin text-primary" />
										</div>
									) : members.length === 0 ? (
										<AscendantText className="block text-muted-foreground text-center py-8">
											No members yet
										</AscendantText>
									) : (
										<div className="space-y-2">
											{members.map((member) => {
												// Check if this member is the Rift (Warden)
												const isWarden = campaign.warden_id === member.user_id;
												const isMe = member.user_id === user?.id;
												return (
													<div
														key={member.id}
														className="flex items-center justify-between p-3 bg-muted/50 rounded"
													>
														<div className="flex items-center gap-3">
															{isWarden && (
																<Crown className="w-4 h-4 text-primary" />
															)}
															{member.role === "co-warden" && !isWarden && (
																<Crown className="w-4 h-4 text-accent" />
															)}
															<div>
																<p className="font-heading font-semibold">
																	{member.characters?.name ||
																		"No Ascendant linked"}
																</p>
																{member.characters && (
																	<AscendantText className="block text-xs text-muted-foreground">
																		Level {member.characters.level}{" "}
																		{formatRegentVernacular(
																			member.characters.job || "Unknown",
																		)}
																	</AscendantText>
																)}
																{isMe && !member.characters && (
																	<Button
																		size="sm"
																		variant="outline"
																		className="mt-1 h-7 text-xs"
																		onClick={() => setAttachDialogOpen(true)}
																	>
																		Attach Ascendant
																	</Button>
																)}
															</div>
														</div>
														<span className="text-xs font-display text-muted-foreground">
															{isWarden
																? "System"
																: member.role === "co-warden"
																	? "Co-Warden"
																	: "Ascendant"}
														</span>
													</div>
												);
											})}
										</div>
									)}
								</AscendantWindow>
							</div>
						</TabsContent>

						<TabsContent value="chat">
							<CampaignChat campaignId={id || ""} />
						</TabsContent>

						<TabsContent value="sessions">
							<CampaignSessionsPanel
								campaignId={id || ""}
								canManage={hasWardenAccess}
							/>
						</TabsContent>

						<TabsContent value="wiki">
							<CampaignWiki campaignId={id || ""} />
						</TabsContent>

						<TabsContent value="notes">
							<CampaignNotes campaignId={id || ""} />
						</TabsContent>

						<TabsContent value="handouts">
							<CampaignHandouts campaignId={id || ""} />
						</TabsContent>

						<TabsContent value="characters">
							<CampaignCharacters campaignId={id || ""} />
						</TabsContent>

						{hasWardenAccess && (
							<TabsContent value="settings" className="space-y-6">
								<CampaignSettings campaignId={id || ""} />
								<CampaignProtocolControls campaignId={id || ""} />
							</TabsContent>
						)}
						{hasWardenAccess && (
							<TabsContent value="oversight">
								<CampaignRegentOversight campaignId={id || ""} />
							</TabsContent>
						)}
					</Tabs>
				</div>

				<Dialog open={attachDialogOpen} onOpenChange={setAttachDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Attach Ascendant</DialogTitle>
							<DialogDescription>
								Select one of your existing Ascendants to permanently link to
								this campaign.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<Select
								value={selectedCharacterToAttach}
								onValueChange={setSelectedCharacterToAttach}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select an Ascendant" />
								</SelectTrigger>
								<SelectContent>
									{myCharacters.map((char) => (
										<SelectItem key={char.id} value={char.id}>
											{char.name} - Level {char.level}{" "}
											{formatRegentVernacular(char.job ?? "")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setAttachDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleAttachCharacter}
								disabled={!selectedCharacterToAttach || linkCharacter.isPending}
							>
								{linkCharacter.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Attaching...
									</>
								) : (
									"Attach"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Layout>

			{campaign && (
				<CampaignInviteModal
					campaign={campaign as Campaign}
					open={inviteModalOpen}
					onOpenChange={setInviteModalOpen}
				/>
			)}
		</>
	);
};

export default CampaignDetail;
