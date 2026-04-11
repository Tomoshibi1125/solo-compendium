import { Crown, Loader2, LogOut, Plus, Shield, Users } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	useCreateGuild,
	useJoinedGuilds,
	useLeaveGuild,
	useMyGuilds,
} from "@/hooks/useGuilds";

const Guilds = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [guildName, setGuildName] = useState("");
	const [guildDescription, setGuildDescription] = useState("");
	const [guildMotto, setGuildMotto] = useState("");

	const { data: myGuilds = [], isLoading: loadingMy } = useMyGuilds();
	const { data: joinedGuilds = [], isLoading: loadingJoined } =
		useJoinedGuilds();
	const createGuild = useCreateGuild();
	const leaveGuild = useLeaveGuild();

	const handleCreateGuild = async () => {
		if (!guildName.trim()) {
			toast({
				title: "Name required",
				description: "Please enter a guild name.",
				variant: "destructive",
			});
			return;
		}

		try {
			const guildId = await createGuild.mutateAsync({
				name: guildName,
				description: guildDescription || undefined,
				motto: guildMotto || undefined,
			});
			setCreateDialogOpen(false);
			setGuildName("");
			setGuildDescription("");
			setGuildMotto("");
			navigate(`/guilds/${guildId}`);
		} catch {
			// Error handled by mutation
		}
	};

	const handleLeaveGuild = async (guildId: string) => {
		try {
			await leaveGuild.mutateAsync(guildId);
		} catch {
			// Error handled by mutation
		}
	};

	const allGuilds = [...myGuilds, ...joinedGuilds];
	const isLoading = loadingMy || loadingJoined;

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
					<div>
						<RiftHeading level={1} variant="sovereign" dimensional>
							GUILD HALL
						</RiftHeading>
						<ManaFlowText
							variant="rift"
							speed="slow"
							className="text-muted-foreground mt-2"
						>
							Establish or join a guild. Recruit NPCs, manage your roster, and
							forge alliances across campaigns.
						</ManaFlowText>
					</div>
					<Button
						className="btn-umbral gap-2"
						onClick={() => setCreateDialogOpen(true)}
					>
						<Plus className="w-4 h-4" />
						Establish Guild
					</Button>
				</div>

				{isLoading ? (
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
							Loading Guild Registry...
						</ManaFlowText>
					</div>
				) : allGuilds.length === 0 ? (
					<AscendantWindow title="NO GUILDS FOUND">
						<div className="text-center py-12 space-y-4">
							<Shield className="w-16 h-16 text-primary mx-auto opacity-50" />
							<RiftHeading level={2} variant="gate" dimensional>
								Begin Your Legacy
							</RiftHeading>
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="max-w-lg mx-auto"
							>
								Establish your own guild to recruit NPCs, manage members, and
								build reputation across campaigns. Every great organization
								starts with a single founder.
							</ManaFlowText>
							<Button
								className="btn-umbral"
								onClick={() => setCreateDialogOpen(true)}
							>
								<Plus className="w-4 h-4 mr-2" />
								Establish Your First Guild
							</Button>
						</div>
					</AscendantWindow>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{allGuilds.map((guild) => {
							const isLeader = myGuilds.some((g) => g.id === guild.id);
							return (
								<AscendantWindow
									key={guild.id}
									title={guild.name.toUpperCase()}
									className="flex flex-col"
								>
									<div className="flex-1 space-y-3">
										<div className="flex items-center gap-2">
											{isLeader ? (
												<Crown className="w-4 h-4 text-primary" />
											) : (
												<Users className="w-4 h-4 text-accent" />
											)}
											<AscendantText className="text-xs font-display text-muted-foreground">
												{isLeader ? "GUILD LEADER" : "MEMBER"}
											</AscendantText>
										</div>
										{guild.motto && (
											<p className="text-sm italic text-muted-foreground">
												"{guild.motto}"
											</p>
										)}
										{guild.description && (
											<AscendantText className="block text-sm text-muted-foreground line-clamp-2">
												{guild.description}
											</AscendantText>
										)}
										{isLeader && (
											<div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
												<span className="text-muted-foreground">
													Share Code:
												</span>
												<span className="font-mono font-bold text-primary">
													{guild.share_code}
												</span>
											</div>
										)}
									</div>
									<div className="flex gap-2 mt-4 pt-4 border-t border-border">
										<Button className="flex-1" variant="outline" asChild>
											<Link to={`/guilds/${guild.id}`}>View Guild</Link>
										</Button>
										{!isLeader && (
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive"
												onClick={() => handleLeaveGuild(guild.id)}
											>
												<LogOut className="w-4 h-4" />
											</Button>
										)}
									</div>
								</AscendantWindow>
							);
						})}
					</div>
				)}
			</div>

			{/* Create Guild Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-primary" />
							ESTABLISH GUILD
						</DialogTitle>
						<DialogDescription>
							Found a new guild. Recruit NPCs from your campaigns, invite other
							players, and build your organization.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="guild-name">Guild Name *</Label>
							<Input
								id="guild-name"
								value={guildName}
								onChange={(e) => setGuildName(e.target.value)}
								placeholder="e.g. The Iron Vanguard"
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="guild-motto">Motto</Label>
							<Input
								id="guild-motto"
								value={guildMotto}
								onChange={(e) => setGuildMotto(e.target.value)}
								placeholder="e.g. Through fire, we forge"
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="guild-description">Description</Label>
							<Textarea
								id="guild-description"
								value={guildDescription}
								onChange={(e) => setGuildDescription(e.target.value)}
								placeholder="Describe your guild's purpose and values..."
								className="mt-1"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="btn-umbral"
							onClick={handleCreateGuild}
							disabled={createGuild.isPending || !guildName.trim()}
						>
							{createGuild.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Establishing...
								</>
							) : (
								<>
									<Shield className="w-4 h-4 mr-2" />
									Establish Guild
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default Guilds;
