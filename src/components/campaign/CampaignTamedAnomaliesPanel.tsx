/**
 * CampaignTamedAnomaliesPanel — C2 tame/bond workflow over the C1 living
 * companion identity layer. Dice are generated client-side as gameplay input;
 * DC, PRE, proficiency, specialization, roll selection and success are resolved
 * authoritatively by the C2 server boundary.
 */
import {
	HeartHandshake,
	History,
	Minus,
	PawPrint,
	Plus,
	RotateCcw,
	Sparkles,
	Trash2,
} from "lucide-react";
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
import { useCharacters } from "@/hooks/useCharacters";
import { usePendingCompanionAdjudications } from "@/hooks/useCompanionAdjudications";
import {
	type CompanionAttemptHistoryRow,
	type CompanionBondRow,
	type TamedAnomalyRow,
	useAnomalyCatalog,
	useBondCompanion,
	useClaimAnomalyController,
	useCompanionBondAttempts,
	useCompanionBonds,
	useDeleteTamedAnomaly,
	usePrepareCompanionAttemptAdjudication,
	useReleaseAnomalyController,
	useTameAnomaly,
	useTamedAnomalies,
	useUpdateTamedAnomalyHP,
} from "@/hooks/useTamedAnomalies";
import {
	type BondingRollMode,
	bondingDcForRank,
	hasBeastTamingProficiency,
	resolveBondingSpecializationSource,
} from "@/lib/companionBonding";

interface Props {
	campaignId: string;
	isWarden: boolean;
}

const rollD20 = () => 1 + Math.floor(Math.random() * 20);

export function CampaignTamedAnomaliesPanel({ campaignId, isWarden }: Props) {
	const { data: tamed = [], isLoading } = useTamedAnomalies(campaignId);
	const { data: attempts = [] } = useCompanionBondAttempts(campaignId);
	const { data: bonds = [] } = useCompanionBonds(campaignId);
	const pendingQuery = usePendingCompanionAdjudications(campaignId);
	const pending = pendingQuery.data ?? [];
	const claim = useClaimAnomalyController();
	const release = useReleaseAnomalyController();
	const updateHp = useUpdateTamedAnomalyHP();
	const remove = useDeleteTamedAnomaly();
	const prepare = usePrepareCompanionAttemptAdjudication();

	const authorizeRetry = (attempt: CompanionAttemptHistoryRow) => {
		prepare.mutate(
			{
				campaignId,
				characterId: attempt.character_id,
				targetSourceId: attempt.target_source_id,
				attemptKind: attempt.attempt_kind,
				companionInstanceId: attempt.companion_instance_id,
				retryOfAttemptId: attempt.id,
				reason: "Explicit C2 retry authorization",
			},
			{ onSuccess: () => pendingQuery.refetch() },
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<TameDialog
					campaignId={campaignId}
					isWarden={isWarden}
					pending={pending}
					onAdjudicationChanged={() => pendingQuery.refetch()}
				/>
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
							campaignId={campaignId}
							row={row}
							isWarden={isWarden}
							attempts={attempts}
							bonds={bonds}
							pending={pending}
							onAdjudicationConsumed={() => pendingQuery.refetch()}
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

			<AttemptHistory
				attempts={attempts}
				pendingRetryIds={
					new Set(
						pending
							.map((row) => row.retry_of_attempt_id)
							.filter((id): id is string => Boolean(id)),
					)
				}
				isWarden={isWarden}
				onAuthorizeRetry={authorizeRetry}
				isAuthorizing={prepare.isPending}
			/>
		</div>
	);
}

function TamedCard({
	campaignId,
	row,
	isWarden,
	attempts,
	bonds,
	pending,
	onAdjudicationConsumed,
	onClaim,
	onRelease,
	onHp,
	onRemove,
}: {
	campaignId: string;
	row: TamedAnomalyRow;
	isWarden: boolean;
	attempts: CompanionAttemptHistoryRow[];
	bonds: CompanionBondRow[];
	pending: ReturnType<
		typeof usePendingCompanionAdjudications
	>["data"] extends infer T
		? NonNullable<T>
		: never;
	onAdjudicationConsumed: () => void;
	onClaim: (characterId: string) => void;
	onRelease: () => void;
	onHp: (currentHp: number) => void;
	onRemove: () => void;
}) {
	const { data: myCharacters = [] } = useCharacters();
	const bond = useBondCompanion();
	const [bondCharacterId, setBondCharacterId] = useState("");
	const actingCharacter =
		myCharacters.find((character) => character.id === bondCharacterId) ??
		myCharacters[0];
	const maxHp =
		row.max_hp_override ??
		row.effective_stats?.hpMax ??
		row.anomaly?.hp ??
		row.current_hp;
	const pct = maxHp > 0 ? Math.round((row.current_hp / maxHp) * 100) : 0;
	const title =
		row.nickname ||
		row.effective_stats?.name ||
		row.anomaly?.name ||
		"Tamed Anomaly";
	const sourceId = row.companion_instance?.source_id ?? row.anomaly_id;
	const myControlled = myCharacters.some(
		(character) => character.id === row.current_controller_character_id,
	);
	const activeBond = actingCharacter
		? bonds.find(
				(entry) =>
					entry.companion_instance_id === row.companion_instance_id &&
					entry.character_id === actingCharacter.id &&
					entry.released_at == null,
			)
		: undefined;
	const latestFailedBond = actingCharacter
		? attempts.find(
				(attempt) =>
					attempt.attempt_kind === "bond" &&
					attempt.companion_instance_id === row.companion_instance_id &&
					attempt.character_id === actingCharacter.id &&
					(attempt.outcome === "failure" || attempt.outcome === "invalid"),
			)
		: undefined;
	const retryAdjudication = actingCharacter
		? pending.find(
				(entry) =>
					entry.attempt_kind === "bond" &&
					entry.character_id === actingCharacter.id &&
					entry.companion_instance_id === row.companion_instance_id &&
					entry.target_source_id === sourceId,
			)
		: undefined;

	const handleBond = () => {
		if (!actingCharacter || activeBond || !sourceId) return;
		const rollMode = retryAdjudication?.roll_mode ?? "normal";
		const rollPrimary = rollD20();
		const rollSecondary = rollMode === "normal" ? null : rollD20();
		bond.mutate(
			{
				campaignId,
				characterId: actingCharacter.id,
				companionInstanceId: row.companion_instance_id,
				expectedSourceId: sourceId,
				rollPrimary,
				rollSecondary,
				adjudicationId: retryAdjudication?.id ?? null,
			},
			{ onSettled: onAdjudicationConsumed },
		);
	};

	return (
		<Card className="p-4 border-border bg-black/40">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<div className="font-heading text-base truncate">{title}</div>
					<div className="text-xs text-muted-foreground truncate">
						{row.anomaly?.name ?? row.anomaly_id} · Tamed
					</div>
				</div>
				{row.effective_stats?.rank || row.anomaly?.rank ? (
					<Badge variant="outline" className="shrink-0 uppercase text-[10px]">
						{row.effective_stats?.rank || row.anomaly?.rank}-rank
					</Badge>
				) : null}
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

			<div className="mt-3 rounded border border-border/40 bg-background/20 p-2">
				<div className="mb-2 flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5 text-xs font-medium">
						<HeartHandshake className="h-3.5 w-3.5" /> Bond
					</div>
					{activeBond ? (
						<Badge variant="secondary" className="text-[10px]">
							Active
						</Badge>
					) : retryAdjudication ? (
						<Badge variant="outline" className="text-[10px]">
							Retry authorized
						</Badge>
					) : latestFailedBond ? (
						<Badge
							variant="outline"
							className="text-[10px] text-muted-foreground"
						>
							Retry needs Warden
						</Badge>
					) : null}
				</div>
				{myCharacters.length > 1 && (
					<Select
						value={actingCharacter?.id ?? ""}
						onValueChange={setBondCharacterId}
					>
						<SelectTrigger className="mb-2 h-8 text-xs">
							<SelectValue placeholder="Bonding character" />
						</SelectTrigger>
						<SelectContent>
							{myCharacters.map((character) => (
								<SelectItem key={character.id} value={character.id}>
									{character.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="h-7 w-full text-xs"
					disabled={
						!actingCharacter ||
						Boolean(activeBond) ||
						bond.isPending ||
						(Boolean(latestFailedBond) && !retryAdjudication)
					}
					onClick={handleBond}
				>
					{activeBond
						? "Bond active"
						: retryAdjudication
							? "Roll authorized retry"
							: latestFailedBond
								? "Awaiting retry adjudication"
								: "Attempt bond"}
				</Button>
				<p className="mt-1.5 text-[10px] text-muted-foreground">
					Bonding is separate from ownership and combat control.
				</p>
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
					actingCharacter && (
						<Button
							size="sm"
							variant="outline"
							className="h-7 text-xs"
							onClick={() => onClaim(actingCharacter.id)}
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

function TameDialog({
	campaignId,
	isWarden,
	pending,
	onAdjudicationChanged,
}: {
	campaignId: string;
	isWarden: boolean;
	pending: NonNullable<
		ReturnType<typeof usePendingCompanionAdjudications>["data"]
	>;
	onAdjudicationChanged: () => void;
}) {
	const { data: catalog } = useAnomalyCatalog();
	const { data: myCharacters = [] } = useCharacters();
	const tame = useTameAnomaly();
	const prepare = usePrepareCompanionAttemptAdjudication();
	const [open, setOpen] = useState(false);
	const [anomalyId, setAnomalyId] = useState("");
	const [characterId, setCharacterId] = useState("");
	const [wardenRollMode, setWardenRollMode] =
		useState<BondingRollMode>("normal");

	const anomalyList = useMemo(
		() =>
			catalog
				? [...catalog.values()].sort((a, b) => a.name.localeCompare(b.name))
				: [],
		[catalog],
	);
	const anomaly = anomalyId ? catalog?.get(anomalyId) : undefined;
	const character = myCharacters.find((entry) => entry.id === characterId);
	const dc = anomaly ? bondingDcForRank(anomaly.rank) : null;
	const proficiencyApplies = character
		? hasBeastTamingProficiency({
				skillProficiencies: character.skill_proficiencies,
				skillExpertise: character.skill_expertise,
			})
		: false;
	const specialization = character
		? resolveBondingSpecializationSource({
				job: character.job,
				jobId: character.job_id,
				path: character.path,
				pathId: character.path_id,
			})
		: null;
	const retryAdjudication =
		character && anomaly
			? pending.find(
					(entry) =>
						entry.attempt_kind === "tame" &&
						entry.character_id === character.id &&
						entry.target_source_id === anomaly.id,
				)
			: undefined;
	const effectiveRollMode = retryAdjudication?.roll_mode ?? wardenRollMode;

	const handleAttempt = async () => {
		if (!character || !anomaly || dc == null) return;
		let adjudicationId = retryAdjudication?.id ?? null;
		let rollMode = retryAdjudication?.roll_mode ?? "normal";
		if (!adjudicationId && isWarden && wardenRollMode !== "normal") {
			adjudicationId = await prepare.mutateAsync({
				campaignId,
				characterId: character.id,
				targetSourceId: anomaly.id,
				attemptKind: "tame",
				rollMode: wardenRollMode,
				reason: "C2 contextual roll mode",
			});
			rollMode = wardenRollMode;
			onAdjudicationChanged();
		}

		const result = await tame.mutateAsync({
			campaignId,
			characterId: character.id,
			anomalyId: anomaly.id,
			rollPrimary: rollD20(),
			rollSecondary: rollMode === "normal" ? null : rollD20(),
			adjudicationId,
		});
		onAdjudicationChanged();
		if (result.outcome === "success") setOpen(false);
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
							{anomalyList.map((entry) => (
								<SelectItem key={entry.id} value={entry.id}>
									{entry.name} · {entry.rank || "unknown"}-rank
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={characterId} onValueChange={setCharacterId}>
						<SelectTrigger>
							<SelectValue placeholder="Acting character…" />
						</SelectTrigger>
						<SelectContent>
							{myCharacters.map((entry) => (
								<SelectItem key={entry.id} value={entry.id}>
									{entry.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{isWarden && !retryAdjudication && (
						<Select
							value={wardenRollMode}
							onValueChange={(value) =>
								setWardenRollMode(value as BondingRollMode)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Contextual roll mode" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="normal">Normal</SelectItem>
								<SelectItem value="advantage">Advantage</SelectItem>
								<SelectItem value="disadvantage">Disadvantage</SelectItem>
							</SelectContent>
						</Select>
					)}

					{anomaly && dc == null ? (
						<p className="text-xs text-destructive">
							{anomaly.rank || "Unknown"}-rank has no authored C2 bonding DC.
							The attempt is unavailable until a source-backed rule exists.
						</p>
					) : dc != null ? (
						<div className="rounded border border-border/40 p-2 text-xs text-muted-foreground">
							<div>
								Presence check vs <span className="text-primary">DC {dc}</span>{" "}
								· {effectiveRollMode}
							</div>
							<div className="mt-1">
								Beast Taming PB:{" "}
								{proficiencyApplies ? "source found" : "not applicable"}
								{" · "}+2 specialization: {specialization?.label ?? "none"}
							</div>
							{retryAdjudication && (
								<div className="mt-1 text-primary">
									Explicit retry adjudication ready.
								</div>
							)}
						</div>
					) : null}

					<Button
						className="w-full"
						disabled={
							!anomalyId ||
							!characterId ||
							dc == null ||
							tame.isPending ||
							prepare.isPending
						}
						onClick={() => void handleAttempt()}
					>
						{retryAdjudication ? "Roll authorized retry" : "Roll d20 & Attempt"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function AttemptHistory({
	attempts,
	pendingRetryIds,
	isWarden,
	onAuthorizeRetry,
	isAuthorizing,
}: {
	attempts: CompanionAttemptHistoryRow[];
	pendingRetryIds: Set<string>;
	isWarden: boolean;
	onAuthorizeRetry: (attempt: CompanionAttemptHistoryRow) => void;
	isAuthorizing: boolean;
}) {
	const visible = attempts.slice(0, 12);
	if (visible.length === 0) return null;

	return (
		<Card className="border-border bg-black/30 p-4">
			<div className="mb-3 flex items-center gap-2">
				<History className="h-4 w-4" />
				<h3 className="font-heading text-sm">
					Tame &amp; Bond Attempt History
				</h3>
			</div>
			<div className="space-y-2">
				{visible.map((attempt) => {
					const retryPending = pendingRetryIds.has(attempt.id);
					const canRetry =
						attempt.outcome === "failure" ||
						(attempt.outcome === "invalid" &&
							![
								"UNSUPPORTED_TARGET_RANK",
								"CANONICAL_SOURCE_ID_MISMATCH",
								"COMPANION_SOURCE_MISMATCH",
							].includes(attempt.invalid_reason ?? ""));
					return (
						<div
							key={attempt.id}
							className="flex flex-col gap-2 rounded border border-border/30 px-3 py-2 sm:flex-row sm:items-center"
						>
							<div className="min-w-0 flex-1 text-xs">
								<div className="flex flex-wrap items-center gap-1.5">
									<Badge variant="outline" className="text-[10px] uppercase">
										{attempt.attempt_kind}
									</Badge>
									<Badge
										variant={
											attempt.outcome === "success" ? "secondary" : "outline"
										}
										className="text-[10px]"
									>
										{attempt.outcome}
									</Badge>
									<span className="truncate text-muted-foreground">
										{attempt.target_source_id}
									</span>
								</div>
								<div className="mt-1 text-muted-foreground">
									{attempt.total != null && attempt.dc != null
										? `${attempt.total} vs DC ${attempt.dc}`
										: (attempt.invalid_reason ?? "No resolved total")}
									{" · "}
									{attempt.roll_mode}
									{" · PB +"}
									{attempt.proficiency_bonus}
									{" · specialization +"}
									{attempt.specialization_bonus}
								</div>
							</div>
							{isWarden && canRetry && (
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="h-7 shrink-0 gap-1 text-xs"
									disabled={retryPending || isAuthorizing}
									onClick={() => onAuthorizeRetry(attempt)}
								>
									<RotateCcw className="h-3 w-3" />
									{retryPending ? "Retry authorized" : "Authorize retry"}
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</Card>
	);
}
