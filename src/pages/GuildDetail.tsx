import {
	ArrowLeft,
	ArrowUp,
	ChevronDown,
	Copy,
	Crown,
	Loader2,
	Settings,
	Shield,
	Sword,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
	useDeleteGuild,
	useGuild,
	useGuildMembers,
	useLevelUpNPC,
	useRecruitNPC,
	useSetNPCLevelingMode,
} from "@/hooks/useGuilds";
import {
	getUnaffiliatedNPCs,
	type SandboxNPC,
} from "@/data/compendium/sandbox-npcs";
import { useAuth } from "@/lib/auth/authContext";
import { getLocalUserId } from "@/lib/guestStore";

const GuildDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState("roster");
	const [recruitDialogOpen, setRecruitDialogOpen] = useState(false);
	const [selectedNPC, setSelectedNPC] = useState<SandboxNPC | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { data: guild, isLoading } = useGuild(id || "");
	const { data: members = [] } = useGuildMembers(id || "");
	const recruitNPC = useRecruitNPC();
	const levelUpNPC = useLevelUpNPC();
	const setLevelingMode = useSetNPCLevelingMode();
	const deleteGuild = useDeleteGuild();

	const currentUserId = user?.id || getLocalUserId();
	const isLeader = guild?.leader_user_id === currentUserId;

	const recruitedNPCIds = members
		.filter((m) => m.npc_id)
		.map((m) => m.npc_id);
	const availableNPCs = getUnaffiliatedNPCs().filter(
		(npc) => !recruitedNPCIds.includes(npc.id),
	);

	const handleRecruit = async () => {
		if (!selectedNPC || !id) return;
		await recruitNPC.mutateAsync({
			guildId: id,
			npc: selectedNPC,
		});
		setRecruitDialogOpen(false);
		setSelectedNPC(null);
	};

	const handleLevelUp = async (memberId: string) => {
		if (!id) return;
		await levelUpNPC.mutateAsync({ guildId: id, memberId });
	};

	const handleDeleteGuild = async () => {
		if (!id) return;
		await deleteGuild.mutateAsync(id);
		navigate("/guilds");
	};

	const handleCopyShareCode = () => {
		if (!guild) return;
		navigator.clipboard.writeText(guild.share_code);
		toast({
			title: "Share code copied!",
			description: "Share this code to invite members to your guild.",
		});
	};

	if (isLoading || (!guild && id)) {
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
							Loading Guild Archives...
						</ManaFlowText>
					</div>
				</div>
			</Layout>
		);
	}

	if (!guild) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
					<AscendantWindow title="GUILD NOT FOUND" variant="alert">
						<p className="text-destructive mb-4 text-center">
							This guild does not exist or you don't have access.
						</p>
						<div className="flex justify-center">
							<Button asChild>
								<Link to="/guilds">Back to Guilds</Link>
							</Button>
						</div>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	const playerMembers = members.filter((m) => m.user_id);
	const npcMembers = members.filter((m) => m.npc_id);

	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
				<Button variant="ghost" className="mb-4 sm:mb-6 min-h-[44px]" asChild>
					<Link to="/guilds">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Guilds
					</Link>
				</Button>

				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="leading-tight"
						>
							{guild.name.toUpperCase()}
						</RiftHeading>
						{isLeader && (
							<Badge className="bg-primary/20 text-primary border-primary/30 w-fit">
								<Crown className="w-3 h-3 mr-1" /> Guild Leader
							</Badge>
						)}
					</div>
					{guild.motto && (
						<p className="text-sm italic text-muted-foreground mb-2">
							"{guild.motto}"
						</p>
					)}
					{guild.description && (
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-sm sm:text-base leading-relaxed"
						>
							{guild.description}
						</ManaFlowText>
					)}
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-3 sm:grid-cols-4">
						<TabsTrigger value="roster" className="gap-2 text-xs sm:text-sm min-h-[44px]">
							<Users className="w-3 h-3 sm:w-4 sm:h-4" />
							Roster
						</TabsTrigger>
						<TabsTrigger value="recruitment" className="gap-2 text-xs sm:text-sm min-h-[44px]">
							<UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
							Recruit
						</TabsTrigger>
						<TabsTrigger value="info" className="gap-2 text-xs sm:text-sm min-h-[44px]">
							<Shield className="w-3 h-3 sm:w-4 sm:h-4" />
							Info
						</TabsTrigger>
						{isLeader && (
							<TabsTrigger value="settings" className="gap-2 text-xs sm:text-sm min-h-[44px]">
								<Settings className="w-3 h-3 sm:w-4 sm:h-4" />
								Settings
							</TabsTrigger>
						)}
					</TabsList>

					{/* ROSTER TAB */}
					<TabsContent value="roster" className="space-y-6">
						{/* Player Members */}
						<AscendantWindow title="PLAYER MEMBERS">
							{playerMembers.length === 0 ? (
								<AscendantText className="block text-muted-foreground text-center py-8">
									No player members yet. Share the guild code to invite players.
								</AscendantText>
							) : (
								<div className="space-y-2">
									{playerMembers.map((member) => (
										<div
											key={member.id}
											className="flex items-center justify-between p-3 bg-muted/50 rounded"
										>
											<div className="flex items-center gap-3">
												{member.role === "leader" && (
													<Crown className="w-4 h-4 text-primary" />
												)}
												<div>
													<p className="font-heading font-semibold">
														{member.characters?.name || "Unlinked Member"}
													</p>
													{member.characters && (
														<AscendantText className="block text-xs text-muted-foreground">
															Level {member.characters.level}{" "}
															{member.characters.job || "Unknown"}
														</AscendantText>
													)}
												</div>
											</div>
											<Badge variant="outline" className="text-xs">
												{member.role}
											</Badge>
										</div>
									))}
								</div>
							)}
						</AscendantWindow>

						{/* NPC Recruits */}
						<AscendantWindow title="NPC RECRUITS">
							{npcMembers.length === 0 ? (
								<div className="text-center py-8 space-y-3">
									<Sword className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
									<AscendantText className="block text-muted-foreground">
										No NPCs recruited yet. Visit the Recruitment tab to find
										unaffiliated NPCs.
									</AscendantText>
								</div>
							) : (
								<div className="space-y-3">
									{npcMembers.map((member) => {
										const npc = member.npc_data;
										const currentLevel = member.npc_level || npc?.level || 1;
										const maxLevel = npc?.leveling.maxLevel || 10;
										const canLevelUp = currentLevel < maxLevel;
										const isAutoLevel = member.npc_leveling_mode === "auto";

										return (
											<div
												key={member.id}
												className="rounded-lg border border-border bg-muted/30 p-4"
											>
												<div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<p className="font-heading font-semibold">
																{member.npc_name}
															</p>
															<Badge variant="outline" className="text-xs">
																L{currentLevel}
															</Badge>
															{npc?.faction && (
																<Badge className="text-xs bg-primary/10 text-primary border-primary/20">
																	{npc.faction.replace(/_/g, " ")}
																</Badge>
															)}
														</div>
														{npc && (
															<>
																<p className="text-xs text-muted-foreground">
																	{npc.title} · {npc.job}
																</p>
																<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
																	{npc.personality}
																</p>
																<div className="flex flex-wrap gap-1 mt-2">
																	{npc.keyAbilities.slice(0, 3).map((ability) => (
																		<Badge
																			key={ability}
																			variant="secondary"
																			className="text-xs"
																		>
																			{ability.split("(")[0].trim()}
																		</Badge>
																	))}
																</div>
															</>
														)}
													</div>
													{isLeader && (
														<div className="flex flex-col gap-2">
															<div className="flex items-center gap-2">
																<AscendantText className="text-xs text-muted-foreground">
																	Leveling:
																</AscendantText>
																<Select
																	value={member.npc_leveling_mode || "auto"}
																	onValueChange={(value) => {
																		if (id) {
																			setLevelingMode.mutate({
																				guildId: id,
																				memberId: member.id,
																				mode: value as "auto" | "manual",
																			});
																		}
																	}}
																>
																	<SelectTrigger className="w-24 h-7 text-xs">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="auto">Auto</SelectItem>
																		<SelectItem value="manual">Manual</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															{canLevelUp && (
																<Button
																	size="sm"
																	variant="outline"
																	className="gap-1 text-xs h-7"
																	onClick={() => handleLevelUp(member.id)}
																	disabled={levelUpNPC.isPending}
																>
																	<ArrowUp className="w-3 h-3" />
																	Level Up → L{currentLevel + 1}
																</Button>
															)}
															{!canLevelUp && (
																<Badge className="text-xs bg-amber-500/20 text-amber-400">
																	MAX LEVEL ({maxLevel})
																</Badge>
															)}
														</div>
													)}
												</div>
												{/* Stats bar */}
												<div className="flex gap-4 mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
													<span>
														HP: <strong className="text-foreground">{npc ? npc.hp + (currentLevel - npc.level) * npc.leveling.hpPerLevel : "?"}</strong>
													</span>
													<span>
														AC: <strong className="text-foreground">{npc?.ac ?? "?"}</strong>
													</span>
													<span>
														Level: <strong className="text-foreground">{currentLevel}/{maxLevel}</strong>
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</AscendantWindow>
					</TabsContent>

					{/* RECRUITMENT TAB */}
					<TabsContent value="recruitment" className="space-y-6">
						<AscendantWindow title="AVAILABLE RECRUITS">
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="text-sm mb-4"
							>
								Unaffiliated NPCs from the campaign world who can be recruited
								into your guild.
							</ManaFlowText>
							{availableNPCs.length === 0 ? (
								<AscendantText className="block text-muted-foreground text-center py-8">
									All available NPCs have been recruited!
								</AscendantText>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{availableNPCs.map((npc) => (
										<div
											key={npc.id}
											className="rounded-lg border border-border bg-muted/30 p-3 hover:border-primary/50 transition-colors cursor-pointer"
											onClick={() => {
												setSelectedNPC(npc);
												setRecruitDialogOpen(true);
											}}
										>
											<div className="flex items-start justify-between mb-2">
												<div>
													<p className="font-heading font-semibold text-sm">
														{npc.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{npc.title} · L{npc.level} {npc.job}
													</p>
												</div>
												<Badge className="text-xs bg-primary/10 text-primary border-primary/20">
													{npc.faction.replace(/_/g, " ")}
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground line-clamp-2">
												{npc.description}
											</p>
											<div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
												<Shield className="w-3 h-3" />
												<span className="line-clamp-1">
													{npc.recruitCondition}
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</AscendantWindow>
					</TabsContent>

					{/* INFO TAB */}
					<TabsContent value="info" className="space-y-6">
						<AscendantWindow title="GUILD INFO">
							<div className="space-y-4">
								{isLeader && (
									<>
										<div className="flex items-center justify-between p-2 bg-muted/50 rounded">
											<span className="text-xs font-display text-muted-foreground">
												SHARE CODE
											</span>
											<div className="flex items-center gap-2">
												<span className="font-mono font-bold text-lg text-primary">
													{guild.share_code}
												</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={handleCopyShareCode}
												>
													<Copy className="w-3 h-3" />
												</Button>
											</div>
										</div>
										<p className="text-xs text-muted-foreground">
											Share this code with players to let them join your guild.
										</p>
									</>
								)}
								<div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded">
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											Total Members
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{members.length}
										</p>
									</div>
									<div>
										<AscendantText className="block text-xs text-muted-foreground">
											NPC Recruits
										</AscendantText>
										<p className="text-2xl font-heading font-bold text-primary">
											{npcMembers.length}
										</p>
									</div>
								</div>
							</div>
						</AscendantWindow>
					</TabsContent>

					{/* SETTINGS TAB (Leader only) */}
					{isLeader && (
						<TabsContent value="settings" className="space-y-6">
							<AscendantWindow title="DANGER ZONE" variant="alert">
								<div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded">
									<div>
										<p className="font-heading font-semibold text-destructive">
											Disband Guild
										</p>
										<p className="text-xs text-muted-foreground">
											Permanently dissolve the guild. All members and recruits
											will be released.
										</p>
									</div>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => setDeleteDialogOpen(true)}
									>
										<Trash2 className="w-4 h-4 mr-1" />
										Disband
									</Button>
								</div>
							</AscendantWindow>
						</TabsContent>
					)}
				</Tabs>
			</div>

			{/* Recruit NPC Dialog */}
			<Dialog open={recruitDialogOpen} onOpenChange={setRecruitDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<UserPlus className="w-5 h-5 text-primary" />
							RECRUIT NPC
						</DialogTitle>
						<DialogDescription>
							{selectedNPC
								? `Review ${selectedNPC.name}'s profile before recruiting.`
								: "Select an NPC to recruit."}
						</DialogDescription>
					</DialogHeader>
					{selectedNPC && (
						<div className="space-y-4">
							<div className="p-4 bg-muted/50 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<div>
										<p className="font-heading font-bold text-lg">
											{selectedNPC.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{selectedNPC.title} · Level {selectedNPC.level}{" "}
											{selectedNPC.job}
										</p>
									</div>
									<div className="text-right text-xs text-muted-foreground">
										<p>HP: {selectedNPC.hp}</p>
										<p>AC: {selectedNPC.ac}</p>
									</div>
								</div>
								<p className="text-sm mt-2">{selectedNPC.description}</p>
								<div className="mt-3 p-2 bg-background/50 rounded border border-border/50">
									<p className="text-xs font-heading text-amber-400 mb-1">
										RECRUITMENT CONDITION
									</p>
									<p className="text-xs text-muted-foreground">
										{selectedNPC.recruitCondition}
									</p>
								</div>
								<div className="mt-3">
									<p className="text-xs font-heading text-muted-foreground mb-1">
										ABILITIES
									</p>
									<div className="flex flex-wrap gap-1">
										{selectedNPC.keyAbilities.map((ability) => (
											<Badge
												key={ability}
												variant="secondary"
												className="text-xs"
											>
												{ability}
											</Badge>
										))}
									</div>
								</div>
								<div className="mt-3 text-xs text-muted-foreground">
									<p>
										Max Level: {selectedNPC.leveling.maxLevel} ·
										HP/Level: +{selectedNPC.leveling.hpPerLevel}
									</p>
								</div>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRecruitDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="btn-umbral"
							onClick={handleRecruit}
							disabled={recruitNPC.isPending}
						>
							{recruitNPC.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Recruiting...
								</>
							) : (
								<>
									<UserPlus className="w-4 h-4 mr-2" />
									Recruit {selectedNPC?.name}
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="border-destructive/30">
					<DialogHeader>
						<DialogTitle className="text-destructive">DISBAND GUILD</DialogTitle>
						<DialogDescription>
							Are you sure you want to permanently disband{" "}
							<strong>{guild.name}</strong>? All members and NPC recruits will
							be released.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteGuild}
							disabled={deleteGuild.isPending}
						>
							{deleteGuild.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Disbanding...
								</>
							) : (
								"Disband Permanently"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default GuildDetail;
