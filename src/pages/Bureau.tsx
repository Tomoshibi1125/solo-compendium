import {
	AlertTriangle,
	BadgeCheck,
	Building2,
	Megaphone,
	ScrollText,
	Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PREBUILT_QUEST_CONTRACTS } from "@/data/compendium/quest-contracts";
import {
	type BureauContract,
	useAcceptBureauContract,
	useBureauContracts,
	useBureauGuildLeaderboard,
	useCloseBureauContract,
	usePublishBureauContract,
} from "@/hooks/useBureauContracts";
import { useCharacters } from "@/hooks/useCharacters";
import { useJoinedGuilds, useMyGuilds } from "@/hooks/useGuilds";
import { useAuth } from "@/lib/auth/authContext";
import type { GuildQuestRank } from "@/lib/guildQuests";
import { QUEST_RANK_ORDER } from "@/lib/guildQuests";
import { guildLevelForContribution } from "@/lib/guildTreasury";
import {
	HUNTER_RANK_THRESHOLDS,
	hunterRankStyleForLevel,
	nextHunterRankAt,
} from "@/lib/hunterRank";
import { rankToGateBadge } from "@/lib/rankColors";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

const STATUS_LABEL: Record<BureauContract["status"], string> = {
	published: "OPEN",
	accepted: "ACCEPTED",
	closed: "CLOSED",
};

export default function Bureau() {
	const { user } = useAuth();
	const isWarden = user?.role === "warden";

	const { data: contracts = [], isLoading: contractsLoading } =
		useBureauContracts();
	const { data: characters = [] } = useCharacters();
	const { data: myGuilds = [] } = useMyGuilds();
	const { data: joinedGuilds = [] } = useJoinedGuilds();
	const { data: leaderboard = [] } = useBureauGuildLeaderboard();

	const publishContract = usePublishBureauContract();
	const acceptContract = useAcceptBureauContract();
	const closeContract = useCloseBureauContract();

	// Publish form (Warden only)
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [rank, setRank] = useState<GuildQuestRank>("E");
	const [kind, setKind] = useState<"contract" | "alert">("contract");
	const [templateId, setTemplateId] = useState<string>("");

	// Accept target guild per contract id
	const [acceptGuild, setAcceptGuild] = useState<Record<string, string>>({});

	const acceptableGuilds = useMemo(() => {
		const seen = new Set<string>();
		return [...myGuilds, ...joinedGuilds].filter((g) => {
			if (seen.has(g.id)) return false;
			seen.add(g.id);
			return true;
		});
	}, [myGuilds, joinedGuilds]);

	const alerts = contracts.filter(
		(c) => c.kind === "alert" && c.status === "published",
	);
	const boardContracts = contracts.filter((c) => c.kind === "contract");

	const applyTemplate = (id: string) => {
		setTemplateId(id);
		const template = PREBUILT_QUEST_CONTRACTS.find((q) => q.id === id);
		if (!template) return;
		setTitle(template.title);
		setSummary(template.summary);
		setRank(template.rank);
		setKind("contract");
	};

	const handlePublish = () => {
		if (!title.trim()) return;
		publishContract.mutate(
			{
				kind,
				title: title.trim(),
				summary: summary.trim() || null,
				rank,
				sourceQuestId: templateId || null,
			},
			{
				onSuccess: () => {
					setTitle("");
					setSummary("");
					setTemplateId("");
				},
			},
		);
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-5xl space-y-6 book-print-root">
				<PageHeader
					title="The Bureau"
					description="Licensing, rank evaluation, and Rift-contract dispatch for registered Ascendants."
				/>

				{/* Rift-break alerts */}
				{alerts.length > 0 && (
					<AscendantWindow title="RIFT-BREAK ALERTS">
						<div className="space-y-3">
							{alerts.map((alert) => (
								<div
									key={alert.id}
									className="flex items-start gap-3 rounded-[2px] border border-destructive/40 bg-destructive/10 p-3"
								>
									<AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<span className="font-heading uppercase tracking-widest text-sm">
												{alert.title}
											</span>
											<Badge
												variant="outline"
												className={cn("text-xs", rankToGateBadge(alert.rank))}
											>
												Rank {alert.rank}
											</Badge>
										</div>
										{alert.summary && (
											<p className="text-xs text-muted-foreground mt-1">
												{alert.summary}
											</p>
										)}
									</div>
									{isWarden && user && alert.publisher_user_id === user.id && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => closeContract.mutate(alert.id)}
										>
											Stand down
										</Button>
									)}
								</div>
							))}
						</div>
					</AscendantWindow>
				)}

				{/* Warden publish console */}
				{isWarden && (
					<AscendantWindow title="DISPATCH CONSOLE (WARDEN)">
						<div className="space-y-3">
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label htmlFor="bureau-template">From canon contract</Label>
									<Select value={templateId} onValueChange={applyTemplate}>
										<SelectTrigger id="bureau-template">
											<SelectValue placeholder="Start from a template (optional)" />
										</SelectTrigger>
										<SelectContent>
											{PREBUILT_QUEST_CONTRACTS.slice(0, 40).map((q) => (
												<SelectItem key={q.id} value={q.id}>
													[{q.rank}] {q.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<Label htmlFor="bureau-kind">Posting type</Label>
										<Select
											value={kind}
											onValueChange={(v) => setKind(v as "contract" | "alert")}
										>
											<SelectTrigger id="bureau-kind">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="contract">Rift contract</SelectItem>
												<SelectItem value="alert">Rift-break alert</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label htmlFor="bureau-rank">Rank</Label>
										<Select
											value={rank}
											onValueChange={(v) => setRank(v as GuildQuestRank)}
										>
											<SelectTrigger id="bureau-rank">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{QUEST_RANK_ORDER.map((r) => (
													<SelectItem key={r} value={r}>
														{r}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor="bureau-title">Title</Label>
								<Input
									id="bureau-title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Containment: Threshold bleed at the Transit Yards"
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="bureau-summary">Briefing</Label>
								<Textarea
									id="bureau-summary"
									value={summary}
									onChange={(e) => setSummary(e.target.value)}
									placeholder="Short dispatch briefing for the board."
									rows={2}
								/>
							</div>
							<Button
								onClick={handlePublish}
								disabled={!title.trim() || publishContract.isPending}
								className="gap-2"
							>
								<Megaphone className="w-4 h-4" />
								{kind === "alert" ? "Broadcast alert" : "Publish contract"}
							</Button>
						</div>
					</AscendantWindow>
				)}

				{/* Dispatch board */}
				<AscendantWindow title="DISPATCH BOARD">
					{contractsLoading ? (
						<p className="text-sm text-muted-foreground">
							Contacting the Bureau…
						</p>
					) : boardContracts.length === 0 ? (
						<div className="text-sm text-muted-foreground flex items-center gap-2">
							<ScrollText className="w-4 h-4" />
							No contracts on the board.{" "}
							{isWarden
								? "Publish one from the dispatch console above."
								: "Check back after the next Bureau dispatch."}
						</div>
					) : (
						<div className="space-y-3">
							{boardContracts.map((contract) => {
								const isOpen = contract.status === "published";
								const selectedGuild = acceptGuild[contract.id] ?? "";
								return (
									<div
										key={contract.id}
										className="rounded-[2px] border border-border bg-black/40 p-3 space-y-2"
									>
										<div className="flex flex-wrap items-center gap-2">
											<Badge
												variant="outline"
												className={cn(
													"text-xs",
													rankToGateBadge(contract.rank),
												)}
											>
												Rank {contract.rank}
											</Badge>
											<span className="font-heading uppercase tracking-widest text-sm">
												{contract.title}
											</span>
											<Badge
												variant={isOpen ? "default" : "outline"}
												className="text-[11px] ml-auto"
											>
												{STATUS_LABEL[contract.status]}
											</Badge>
										</div>
										{contract.summary && (
											<p className="text-xs text-muted-foreground">
												{contract.summary}
											</p>
										)}
										{isOpen && acceptableGuilds.length > 0 && (
											<div className="flex flex-wrap items-center gap-2 pt-1">
												<Select
													value={selectedGuild}
													onValueChange={(v) =>
														setAcceptGuild((prev) => ({
															...prev,
															[contract.id]: v,
														}))
													}
												>
													<SelectTrigger className="w-56">
														<SelectValue placeholder="Accept as guild…" />
													</SelectTrigger>
													<SelectContent>
														{acceptableGuilds.map((g) => (
															<SelectItem key={g.id} value={g.id}>
																{g.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Button
													size="sm"
													disabled={!selectedGuild || acceptContract.isPending}
													onClick={() =>
														acceptContract.mutate({
															contractId: contract.id,
															guildId: selectedGuild,
														})
													}
												>
													Accept contract
												</Button>
												{isWarden &&
													user &&
													contract.publisher_user_id === user.id && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => closeContract.mutate(contract.id)}
														>
															Withdraw
														</Button>
													)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</AscendantWindow>

				{/* License registry + rank evaluation */}
				<AscendantWindow title="LICENSE REGISTRY">
					{characters.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No licensed Ascendants on file.{" "}
							<Link to="/characters/new" className="text-primary underline">
								Register one
							</Link>
							.
						</p>
					) : (
						<div className="space-y-3">
							{characters.map((character) => {
								const style = hunterRankStyleForLevel(character.level);
								const next = nextHunterRankAt(character.level);
								return (
									<div
										key={character.id}
										className="flex flex-wrap items-center gap-3 rounded-[2px] border border-border bg-black/40 p-3"
									>
										<div
											className={cn(
												"w-10 h-10 rounded-[2px] border flex items-center justify-center font-heading text-lg",
												style.color,
												style.bg,
												style.border,
											)}
										>
											{style.rank}
										</div>
										<div className="min-w-0 flex-1">
											<div className="font-heading uppercase tracking-widest text-sm">
												{character.name}
											</div>
											<div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
												{formatRegentVernacular(character.job ?? "Unassigned")}{" "}
												· Level {character.level} · License{" "}
												{character.id.slice(0, 8).toUpperCase()}
											</div>
										</div>
										<div className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
											<BadgeCheck className="w-4 h-4 text-primary/70" />
											{next
												? `Evaluation: ${next.rank}-certification at level ${next.minLevel}`
												: "Evaluation: S-certified — ceiling reached"}
										</div>
									</div>
								);
							})}
							<p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
								Bureau ladder:{" "}
								{HUNTER_RANK_THRESHOLDS.map(
									(t) => `${t.rank} (Lv ${t.minLevel}+)`,
								).join(" · ")}
							</p>
						</div>
					)}
				</AscendantWindow>

				{/* Guild leaderboard */}
				<AscendantWindow title="GUILD STANDINGS">
					{leaderboard.length === 0 ? (
						<div className="text-sm text-muted-foreground flex items-center gap-2">
							<Building2 className="w-4 h-4" />
							No active guilds registered with the Bureau.
						</div>
					) : (
						<div className="space-y-2">
							{leaderboard.map((guild, index) => (
								<div
									key={guild.id}
									className="flex items-center gap-3 rounded-[2px] border border-border bg-black/40 px-3 py-2"
								>
									<span className="w-6 text-center font-heading text-muted-foreground">
										{index + 1}
									</span>
									{index === 0 && (
										<Trophy className="w-4 h-4 text-primary/80" />
									)}
									<span className="font-heading uppercase tracking-widest text-sm flex-1 min-w-0 truncate">
										{guild.name}
									</span>
									<Badge
										variant="outline"
										className={cn(
											"text-xs",
											rankToGateBadge(guild.guild_rank ?? "E"),
										)}
									>
										{guild.guild_rank ?? "E"}
									</Badge>
									<span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
										Lv {guildLevelForContribution(guild.contribution)} ·{" "}
										{guild.member_count} members
									</span>
								</div>
							))}
							<p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
								Bureau balance doctrine: no guild too strong — standings are
								public record.
							</p>
						</div>
					)}
				</AscendantWindow>
			</div>
		</Layout>
	);
}
