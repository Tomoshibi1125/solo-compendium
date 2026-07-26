/**
 * CampaignTamedAnomaliesPanel — the party's tamed-anomaly roster. Any member
 * may attempt to tame an anomaly (roll vs. rank DC, resolved via src/lib/taming.ts
 * + the attempt_taming RPC) and take/release control; the Warden manages HP and
 * can release entries. Wires the previously-orphaned campaign_tamed_anomalies table.
 */
import { Minus, PawPrint, Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
	mapToCharacterWithAbilities,
	useCharacters,
} from "@/hooks/useCharacters";
import {
	type TamedAnomalyRow,
	tamingDcForRank,
	useAnomalyCatalog,
	useClaimAnomalyController,
	useDeleteTamedAnomaly,
	useReleaseAnomalyController,
	useTameAnomaly,
	useTamedAnomalies,
	useUpdateTamedAnomalyHP,
} from "@/hooks/useTamedAnomalies";
import { getProficiencyBonus } from "@/lib/characterCalculations";
import { attemptTaming } from "@/lib/taming";

interface Props {
	campaignId: string;
	isWarden: boolean;
}

export function CampaignTamedAnomaliesPanel({ campaignId, isWarden }: Props) {
	const { data: tamed = [], isLoading } = useTamedAnomalies(campaignId);
	const claim = useClaimAnomalyController();
	const release = useReleaseAnomalyController();
	const updateHp = useUpdateTamedAnomalyHP();
	const remove = useDeleteTamedAnomaly();

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<TameDialog campaignId={campaignId} />
			</div>

			{isLoading ? (
				<div className="text-sm text-muted-foreground">Loading roster…</div>
			) : tamed.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
					<PawPrint className="w-8 h-8 mb-2 opacity-50" />
					<p className="text-sm">
						No tamed anomalies yet. Attempt a taming above.
					</p>
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{tamed.map((row) => (
						<TamedCard
							key={row.id}
							row={row}
							isWarden={isWarden}
							onClaim={(characterId) =>
								claim.mutate({ campaignId, tamedId: row.id, characterId })
							}
							onRelease={() => release.mutate({ campaignId, tamedId: row.id })}
							onHp={(currentHp) =>
								updateHp.mutate({ campaignId, id: row.id, currentHp })
							}
							onRemove={() => remove.mutate({ campaignId, id: row.id })}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function TamedCard({
	row,
	isWarden,
	onClaim,
	onRelease,
	onHp,
	onRemove,
}: {
	row: TamedAnomalyRow;
	isWarden: boolean;
	onClaim: (characterId: string) => void;
	onRelease: () => void;
	onHp: (currentHp: number) => void;
	onRemove: () => void;
}) {
	const { data: myCharacters = [] } = useCharacters();
	const maxHp = row.max_hp_override ?? row.anomaly?.hp ?? row.current_hp;
	const pct = maxHp > 0 ? Math.round((row.current_hp / maxHp) * 100) : 0;
	const title = row.nickname || row.anomaly?.name || "Tamed Anomaly";
	const myControlled = myCharacters.some(
		(c) => c.id === row.current_controller_character_id,
	);
	const firstChar = myCharacters[0];

	return (
		<Card className="p-4 border-border bg-black/40">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<div className="font-heading text-base truncate">{title}</div>
					<div className="text-xs text-muted-foreground truncate">
						{row.anomaly?.name ?? row.anomaly_id} · Bond {row.bond_level}
					</div>
				</div>
				{row.anomaly?.rank && (
					<Badge variant="outline" className="shrink-0 uppercase text-[10px]">
						{row.anomaly.rank}-rank
					</Badge>
				)}
			</div>

			<div className="mt-3">
				<div className="flex items-center justify-between text-xs mb-1">
					<span className="text-muted-foreground">HP</span>
					<span className="font-mono">
						{row.current_hp} / {maxHp}
					</span>
				</div>
				<Progress value={pct} className="h-2" />
			</div>

			<div className="mt-3 flex items-center gap-1 flex-wrap">
				{row.current_controller_character_id ? (
					myControlled ? (
						<Button
							size="sm"
							variant="outline"
							className="h-7 text-xs"
							onClick={onRelease}
						>
							Release control
						</Button>
					) : (
						<Badge variant="secondary" className="text-[10px]">
							Controlled
						</Badge>
					)
				) : (
					firstChar && (
						<Button
							size="sm"
							variant="outline"
							className="h-7 text-xs"
							onClick={() => onClaim(firstChar.id)}
						>
							Take control
						</Button>
					)
				)}
				{isWarden && (
					<>
						<Button
							size="icon"
							variant="ghost"
							className="h-7 w-7 ml-auto"
							aria-label="Reduce HP by 5"
							onClick={() => onHp(row.current_hp - 5)}
						>
							<Minus className="w-3 h-3" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-7 w-7"
							aria-label="Heal HP by 5"
							onClick={() => onHp(Math.min(maxHp, row.current_hp + 5))}
						>
							<Plus className="w-3 h-3" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-7 w-7 text-destructive"
							aria-label="Release anomaly from roster"
							onClick={onRemove}
						>
							<Trash2 className="w-3 h-3" />
						</Button>
					</>
				)}
			</div>
		</Card>
	);
}

function TameDialog({ campaignId }: { campaignId: string }) {
	const { toast } = useToast();
	const { data: catalog } = useAnomalyCatalog();
	const { data: myCharacters = [] } = useCharacters();
	const tame = useTameAnomaly();
	const [open, setOpen] = useState(false);
	const [anomalyId, setAnomalyId] = useState("");
	const [characterId, setCharacterId] = useState("");

	const anomalyList = useMemo(
		() =>
			catalog
				? [...catalog.values()].sort((a, b) => a.name.localeCompare(b.name))
				: [],
		[catalog],
	);
	const anomaly = anomalyId ? catalog?.get(anomalyId) : undefined;
	const dc = anomaly ? tamingDcForRank(anomaly.rank) : null;

	const handleAttempt = () => {
		const char = myCharacters.find((c) => c.id === characterId);
		if (!char || !anomaly) return;
		const withAbilities = mapToCharacterWithAbilities(char);
		const roll = 1 + Math.floor(Math.random() * 20);
		const result = attemptTaming(
			{
				id: char.id,
				job: char.job,
				path: (char as unknown as { primary_path?: string | null })
					.primary_path,
				abilities: withAbilities.abilities,
				proficiencyBonus: getProficiencyBonus(char.level ?? 1),
			},
			{ dc: tamingDcForRank(anomaly.rank), ability: "PRE" },
			roll,
		);
		toast({
			title: `d20 → ${roll} · total ${result.total} vs DC ${result.dc}`,
			description: result.success ? "Success!" : result.reason,
		});
		if (result.success) {
			tame.mutate(
				{
					campaignId,
					characterId: char.id,
					anomalyId: anomaly.id,
					rollTotal: result.total,
					dc: result.dc,
					initialHp: anomaly.hp,
					bondInitial: result.bondLevel,
				},
				{ onSuccess: () => setOpen(false) },
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-1">
					<Sparkles className="w-4 h-4" /> Tame an Anomaly
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Attempt Taming</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<Select value={anomalyId} onValueChange={setAnomalyId}>
						<SelectTrigger>
							<SelectValue placeholder="Choose an anomaly to tame…" />
						</SelectTrigger>
						<SelectContent>
							{anomalyList.map((a) => (
								<SelectItem key={a.id} value={a.id}>
									{a.name} · {a.rank}-rank
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={characterId} onValueChange={setCharacterId}>
						<SelectTrigger>
							<SelectValue placeholder="Acting character…" />
						</SelectTrigger>
						<SelectContent>
							{myCharacters.map((c) => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{dc != null && (
						<p className="text-xs text-muted-foreground">
							Presence check vs <span className="text-primary">DC {dc}</span> ·
							path bonuses (Pack Leader / Summoner / …) apply automatically.
						</p>
					)}
					<Button
						className="w-full"
						disabled={!anomalyId || !characterId || tame.isPending}
						onClick={handleAttempt}
					>
						Roll d20 &amp; Attempt
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
