/**
 * CampaignQuestsPanel — the campaign quest board. Wardens author quests and
 * mark them complete; the party sees objectives/rewards and claims rewards
 * onto a character. Wires the re-homed session_quests subsystem.
 */
import { Check, ScrollText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCharacters } from "@/hooks/useCharacters";
import {
	type SessionQuestRow,
	useClaimQuestRewards,
	useCompleteQuest,
	useCreateQuest,
	useDeleteQuest,
	useSessionQuests,
} from "@/hooks/useSessionQuests";

interface Props {
	campaignId: string;
	isWarden: boolean;
}

export function CampaignQuestsPanel({ campaignId, isWarden }: Props) {
	const { data: quests = [], isLoading } = useSessionQuests(campaignId);
	const createQuest = useCreateQuest();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [objectives, setObjectives] = useState("");
	const [xp, setXp] = useState("");
	const [gold, setGold] = useState("");

	const handleCreate = () => {
		if (!title.trim()) return;
		createQuest.mutate(
			{
				campaignId,
				title: title.trim(),
				description: description.trim(),
				objectives: objectives
					.split("\n")
					.map((o) => o.trim())
					.filter(Boolean),
				rewards: {
					...(xp ? { xp: Number(xp) } : {}),
					...(gold ? { gold: Number(gold) } : {}),
				},
			},
			{
				onSuccess: () => {
					setTitle("");
					setDescription("");
					setObjectives("");
					setXp("");
					setGold("");
				},
			},
		);
	};

	return (
		<div className="space-y-4">
			{isWarden && (
				<Card className="p-4 border-primary/20 bg-black/40 space-y-3">
					<h3 className="font-heading text-sm uppercase tracking-widest text-primary">
						Post a Quest
					</h3>
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Quest title"
					/>
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Description / hook"
						className="min-h-[60px]"
					/>
					<Textarea
						value={objectives}
						onChange={(e) => setObjectives(e.target.value)}
						placeholder="Objectives — one per line"
						className="min-h-[60px]"
					/>
					<div className="flex gap-2">
						<div className="flex-1">
							<Label className="text-xs">XP reward</Label>
							<Input
								type="number"
								value={xp}
								onChange={(e) => setXp(e.target.value)}
								placeholder="0"
							/>
						</div>
						<div className="flex-1">
							<Label className="text-xs">Gold / credits</Label>
							<Input
								type="number"
								value={gold}
								onChange={(e) => setGold(e.target.value)}
								placeholder="0"
							/>
						</div>
					</div>
					<Button
						onClick={handleCreate}
						disabled={!title.trim() || createQuest.isPending}
					>
						Post Quest
					</Button>
				</Card>
			)}

			{isLoading ? (
				<div className="text-sm text-muted-foreground">Loading quests…</div>
			) : quests.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
					<ScrollText className="w-8 h-8 mb-2 opacity-50" />
					<p className="text-sm">
						No quests posted yet.{isWarden ? " Post one above." : ""}
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{quests.map((quest) => (
						<QuestCard
							key={quest.id}
							quest={quest}
							campaignId={campaignId}
							isWarden={isWarden}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function QuestCard({
	quest,
	campaignId,
	isWarden,
}: {
	quest: SessionQuestRow;
	campaignId: string;
	isWarden: boolean;
}) {
	const { data: myCharacters = [] } = useCharacters();
	const complete = useCompleteQuest();
	const remove = useDeleteQuest();
	const claim = useClaimQuestRewards();
	const [claimCharId, setClaimCharId] = useState("");

	const rewardBits: string[] = [];
	if (quest.rewards?.xp) rewardBits.push(`${quest.rewards.xp} XP`);
	if (quest.rewards?.gold) rewardBits.push(`${quest.rewards.gold} credits`);

	return (
		<Card className="p-4 border-border bg-black/40">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<div className="font-heading text-base">{quest.title}</div>
					{quest.description && (
						<p className="text-sm text-muted-foreground mt-1">
							{quest.description}
						</p>
					)}
				</div>
				<Badge
					variant={quest.status === "completed" ? "secondary" : "outline"}
					className="shrink-0 uppercase text-[10px]"
				>
					{quest.status}
				</Badge>
			</div>

			{quest.objectives?.length > 0 && (
				<ul className="mt-2 text-sm list-disc list-inside text-muted-foreground space-y-0.5">
					{quest.objectives.map((o) => (
						<li key={o}>{o}</li>
					))}
				</ul>
			)}

			{rewardBits.length > 0 && (
				<div className="mt-2 text-xs text-primary">
					Rewards: {rewardBits.join(" · ")}
				</div>
			)}

			<div className="mt-3 flex items-center gap-2 flex-wrap">
				{isWarden && quest.status === "active" && (
					<Button
						size="sm"
						variant="outline"
						className="h-7 text-xs gap-1"
						onClick={() => complete.mutate({ campaignId, questId: quest.id })}
					>
						<Check className="w-3 h-3" /> Mark complete
					</Button>
				)}
				{quest.status === "completed" && myCharacters.length > 0 && (
					<div className="flex items-center gap-1">
						<Select value={claimCharId} onValueChange={setClaimCharId}>
							<SelectTrigger className="h-7 text-xs w-40">
								<SelectValue placeholder="Claim onto…" />
							</SelectTrigger>
							<SelectContent>
								{myCharacters.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							size="sm"
							className="h-7 text-xs"
							disabled={!claimCharId || claim.isPending}
							onClick={() =>
								claim.mutate({
									campaignId,
									questId: quest.id,
									characterId: claimCharId,
								})
							}
						>
							Claim
						</Button>
					</div>
				)}
				{isWarden && (
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7 ml-auto text-destructive"
						aria-label="Delete quest"
						onClick={() => remove.mutate({ campaignId, questId: quest.id })}
					>
						<Trash2 className="w-3 h-3" />
					</Button>
				)}
			</div>
		</Card>
	);
}
