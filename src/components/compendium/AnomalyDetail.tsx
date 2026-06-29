import {
	Crown,
	Footprints,
	Heart,
	Shield,
	Skull,
	Swords,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { StatBlock, StatSection } from "@/components/compendium/StatBlock";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { getAnomalyImageSrc } from "@/lib/anomalyImageResolver";
import { getAbilityModifier } from "@/lib/characterCalculations";
import { formatRecharge } from "@/lib/labels";
import { numericCrToLabel } from "@/lib/monster5eTable";
import { cn } from "@/lib/utils";
import { formatRegentVernacular, MONARCH_LABEL } from "@/lib/vernacular";

import type { CompendiumAnomaly } from "@/types/compendium";

interface AnomalyData extends CompendiumAnomaly {}

interface AnomalyAction {
	id: string;
	name: string;
	description: string;
	action_type: string;
	attack_bonus?: number;
	damage?: string;
	damage_type?: string;
	recharge?: string;
	legendary_cost?: number;
}

interface AnomalyTrait {
	id: string;
	name: string;
	description: string;
}

// Enhanced gate rank colors with Rift Ascendant theme
const gateRankColors: Record<
	string,
	{ bg: string; text: string; glow: string }
> = {
	E: { bg: "bg-gate-e/20", text: "text-gate-e", glow: "" },
	D: { bg: "bg-gate-d/20", text: "text-gate-d", glow: "" },
	C: { bg: "bg-gate-c/20", text: "text-gate-c", glow: "" },
	B: {
		bg: "bg-gate-b/20",
		text: "text-gate-b",
		glow: "shadow-[0_0_8px_hsl(var(--gate-b)/0.4)]",
	},
	A: {
		bg: "bg-gate-a/20",
		text: "text-gate-a",
		glow: "shadow-[0_0_10px_hsl(var(--gate-a)/0.5)]",
	},
	S: {
		bg: "bg-gate-s/20",
		text: "text-gate-s",
		glow: "shadow-[0_0_15px_hsl(var(--gate-s)/0.6)]",
	},
	SS: {
		bg: "bg-gate-ss/20",
		text: "text-gate-ss",
		glow: "shadow-[0_0_20px_hsl(var(--gate-ss)/0.7)]",
	},
};

// Canonical ability modifier display: delegates to the engine helper so
// any future change (e.g. NaN guard) propagates consistently. M6 in
// docs/ui-canon-parity-audit-2026-05.md.
const getModifier = (score: number) => {
	const mod = getAbilityModifier(score);
	return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const AnomalyDetail = ({ data }: { data: AnomalyData }) => {
	const navigate = useNavigate();
	const [actions, setActions] = useState<AnomalyAction[]>([]);
	const [traits, setTraits] = useState<AnomalyTrait[]>([]);
	// Tolerant of both the raw anomaly shape (`actions`/`traits`) and the
	// provider shape (`Anomaly_actions`/`Anomaly_traits` + separate
	// reactions/bonus_actions/lair_actions/legendary_actions arrays). All
	// action-like arrays are merged and tagged so the per-section renders pick
	// them up.
	const actionHash = useMemo(() => {
		const d = data as unknown as Record<string, unknown>;
		const arr = (v: unknown) =>
			Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
		const tag = (list: Record<string, unknown>[], action_type: string) =>
			list.map((a) => ({ ...a, action_type: a.action_type ?? action_type }));
		return JSON.stringify([
			...tag(arr(d.Anomaly_actions ?? d.actions), "action"),
			...tag(arr(d.bonus_actions), "bonus"),
			...tag(arr(d.reactions), "reaction"),
			...tag(arr(d.lair_actions), "lair"),
			...tag(arr(d.legendary_actions), "legendary"),
		]);
	}, [data]);
	const traitHash = useMemo(() => {
		const d = data as unknown as Record<string, unknown>;
		return JSON.stringify(d.Anomaly_traits ?? d.traits ?? []);
	}, [data]);

	const mapStaticAction = useCallback(
		(a: Record<string, unknown>, idx: number): AnomalyAction => {
			const name = typeof a.name === "string" ? a.name : `Action ${idx + 1}`;
			const actionTypeRaw =
				(typeof a.action_type === "string" ? a.action_type : null) ??
				(typeof a.action === "string" ? a.action : null);

			const action_type =
				actionTypeRaw === "bonus-action"
					? "bonus"
					: actionTypeRaw === "reaction"
						? "reaction"
						: actionTypeRaw === "legendary"
							? "legendary"
							: actionTypeRaw === "mythic"
								? "mythic"
								: actionTypeRaw === "lair"
									? "lair"
									: "action";

			const attack_bonus =
				typeof a.attack_bonus === "number"
					? a.attack_bonus
					: typeof a.attackBonus === "number"
						? a.attackBonus
						: undefined;

			const damage = typeof a.damage === "string" ? a.damage : undefined;
			const damage_type =
				typeof a.damage_type === "string"
					? a.damage_type
					: typeof a.damageType === "string"
						? a.damageType
						: undefined;

			const recharge =
				typeof a.recharge === "string"
					? a.recharge
					: typeof a.usage === "string"
						? a.usage
						: undefined;

			const legendary_cost =
				typeof a.legendary_cost === "number"
					? a.legendary_cost
					: typeof a.legendaryCost === "number"
						? a.legendaryCost
						: undefined;

			return {
				id: `${data.id}:static-action:${idx}`,
				name,
				description: typeof a.description === "string" ? a.description : "",
				action_type,
				attack_bonus,
				damage,
				damage_type,
				recharge,
				legendary_cost,
			};
		},
		[data.id],
	);

	const mapStaticTrait = useCallback(
		(t: Record<string, unknown>, idx: number): AnomalyTrait => {
			const name = typeof t.name === "string" ? t.name : `Trait ${idx + 1}`;
			return {
				id: `${data.id}:static-trait:${idx}`,
				name,
				description: typeof t.description === "string" ? t.description : "",
			};
		},
		[data.id],
	);

	useEffect(() => {
		const staticActions = JSON.parse(actionHash) as
			| Record<string, unknown>[]
			| null;
		const staticTraits = JSON.parse(traitHash) as
			| Record<string, unknown>[]
			| null;

		// Canonical static actions/traits embedded on the anomaly entry.
		if (staticActions && staticActions.length > 0) {
			setActions(
				staticActions
					.map((a, idx) => mapStaticAction(a as Record<string, unknown>, idx))
					.filter((a) => a.description.trim().length > 0),
			);
		} else {
			setActions([]);
		}

		if (staticTraits && staticTraits.length > 0) {
			setTraits(
				staticTraits
					.map((t, idx) => mapStaticTrait(t as Record<string, unknown>, idx))
					.filter((t) => t.description.trim().length > 0),
			);
		} else {
			setTraits([]);
		}
	}, [actionHash, traitHash, mapStaticAction, mapStaticTrait]);

	// Normalized field reads — tolerant of raw (ac/hp/rank/stats) and provider
	// (armor_class/hit_points_average/gate_rank/flattened abilities) shapes so a
	// complete DDB-style stat block renders regardless of source.
	const d = data as unknown as Record<string, unknown>;
	const num = (v: unknown): number | undefined =>
		typeof v === "number" ? v : undefined;
	const rankVal = ((d.gate_rank as string) ?? (d.rank as string) ?? "") || "";
	const speedWalk =
		num(d.speed_walk) ??
		num(d.speed) ??
		num((d.stats as Record<string, unknown> | undefined)?.speed) ??
		30;
	const speeds = `${speedWalk} ft.`;

	const regularActions = actions.filter((a) => a.action_type === "action");
	const bonusActions = actions.filter((a) => a.action_type === "bonus");
	const reactions = actions.filter((a) => a.action_type === "reaction");
	const legendaryActions = actions.filter((a) => a.action_type === "legendary");
	const lairActions = actions.filter((a) => a.action_type === "lair");
	const regionalEffects = Array.isArray(d.regional_effects)
		? (d.regional_effects as Array<{ name?: string; description?: string }>)
		: [];

	const gateStyle = rankVal ? gateRankColors[rankVal] : null;
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const anomalySize = formatRegentVernacular(data.size || "Medium");
	const anomalyType = formatRegentVernacular(
		((d.creature_type as string) ?? data.type) || "Unknown",
	);
	const armorClass = num(d.armor_class) ?? num(d.ac) ?? 0;
	const acSource =
		((d.ac_source as string) ?? (d.armor_type as string) ?? "") || "";
	const hitPointsAverage = num(d.hit_points_average) ?? num(d.hp) ?? 0;
	const hitPointsFormula = (d.hit_points_formula as string) ?? "";
	const abilityScores = ((d.stats as Record<string, unknown> | undefined)
		?.ability_scores as Record<string, number> | undefined) ?? {
		strength: num(d.str) ?? 10,
		agility: num(d.agi) ?? 10,
		vitality: num(d.vit) ?? 10,
		intelligence: num(d.int) ?? 10,
		sense: num(d.sense) ?? 10,
		presence: num(d.pre) ?? 10,
	};
	const skills =
		d.skills && typeof d.skills === "object" && !Array.isArray(d.skills)
			? (d.skills as Record<string, number>)
			: null;
	const savingThrows =
		d.saving_throws &&
		typeof d.saving_throws === "object" &&
		!Array.isArray(d.saving_throws)
			? (d.saving_throws as Record<string, number>)
			: null;
	const sensesText =
		typeof d.senses === "string"
			? d.senses
			: ((d.senses as { text?: string } | undefined)?.text ?? null);
	const languagesText = Array.isArray(d.languages)
		? (d.languages as string[]).join(", ")
		: typeof d.languages === "string"
			? (d.languages as string)
			: null;
	const fmtBonus = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
	// CR can be a fraction (1/8, 1/4, 1/2) for low-rank anomalies — render the
	// canonical 5e label rather than the raw decimal (0.125, etc.).
	const rawCr = (d.stats as Record<string, unknown> | undefined)
		?.challenge_rating;
	const cr =
		typeof rawCr === "number"
			? numericCrToLabel(rawCr)
			: (d.cr as string) || "—";
	const isBoss = false; // logic for boss removed in favour of explicit rank properties.

	// Resolve hero image: prefer explicit data.image, then data.image_url,
	// then fall back to the keyword-based thematic resolver.
	const heroImageSrc = getAnomalyImageSrc({
		id: data.id,
		name: data.name,
		type: data.type,
		image: data.image,
		image_url: data.image_url,
	});

	const queueAnomalyActionResolution = (
		action: AnomalyAction,
		path: string,
	) => {
		const id = crypto.randomUUID();
		const damageRoll = action.damage ? String(action.damage) : null;
		const toHit =
			typeof action.attack_bonus === "number" ? action.attack_bonus : null;

		const payload: ActionResolutionPayload =
			toHit !== null
				? {
						version: 1,
						id,
						name: `${displayName}: ${formatRegentVernacular(action.name)}`,
						source: { type: "Anomaly_action", entryId: data.id },
						kind: "attack",
						attack: { roll: `1d20+${toHit}` },
						damage: damageRoll
							? { roll: damageRoll, type: action.damage_type }
							: undefined,
					}
				: {
						version: 1,
						id,
						name: `${displayName}: ${formatRegentVernacular(action.name)}`,
						source: { type: "Anomaly_action", entryId: data.id },
						kind: "damage",
						damage: { roll: damageRoll ?? "1d6", type: action.damage_type },
					};

		setPendingResolution(payload);
		navigate(path);
	};

	return (
		<div className="space-y-6">
			{/* Hero Image — always shown; uses data.image → data.image_url → thematic resolver */}
			<div className="w-full">
				<CompendiumImage
					src={heroImageSrc}
					alt={displayName}
					size="hero"
					aspectRatio="landscape"
					className="w-full rounded-lg"
					fallbackIcon={<Skull className="w-32 h-32 text-muted-foreground" />}
				/>
			</div>

			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				variant={
					isBoss
						? "alert"
						: data.tags?.includes("regent")
							? "resurge"
							: "default"
				}
				className={cn(
					isBoss && "border-gate-a/50 border-2",
					data.tags?.includes("regent") && "border-resurge-violet/50 border-2",
					gateStyle?.glow,
				)}
			>
				<div className="space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-muted-foreground capitalize font-heading">
							{anomalySize} {anomalyType}
							{data.alignment && `, ${formatRegentVernacular(data.alignment)}`}
						</span>
						{rankVal && gateStyle && (
							<Badge
								className={cn(
									gateStyle.bg,
									gateStyle.text,
									"font-display tracking-wider",
									gateStyle.glow,
								)}
							>
								{rankVal}-Rank Rift
							</Badge>
						)}
						{isBoss && (
							<Badge
								variant="destructive"
								className="font-display tracking-wider shadow-[0_0_10px_hsl(var(--destructive)/0.5)]"
							>
								<Skull className="h-3 w-3 mr-1" />
								BOSS
							</Badge>
						)}
						{data.tags?.includes("named-npc") && (
							<Badge
								variant="outline"
								className="border-shadow-purple/50 text-shadow-purple font-heading"
							>
								Named NPC
							</Badge>
						)}
						{data.tags?.includes("named-boss") && (
							<Badge
								variant="outline"
								className="border-regent-gold/50 text-regent-gold font-heading"
							>
								<Crown className="h-3 w-3 mr-1" />
								Named Boss
							</Badge>
						)}
						{data.tags?.includes("regent") && (
							<Badge
								variant="outline"
								className="border-resurge-violet/50 text-resurge-violet font-heading shadow-[0_0_10px_hsl(var(--resurge-violet)/0.4)]"
							>
								<Zap className="h-3 w-3 mr-1" />
								{MONARCH_LABEL}
							</Badge>
						)}
						{data.tags?.includes("guild-master") && (
							<Badge
								variant="outline"
								className="border-shadow-blue/50 text-shadow-blue font-heading"
							>
								Warden
							</Badge>
						)}
					</div>
					{data.lore && (
						<p className="text-muted-foreground italic border-l-2 border-shadow-purple/40 pl-4 mt-4 leading-relaxed">
							<AutoLinkText
								text={
									typeof data.lore === "string" ? data.lore : data.lore.history
								}
							/>
						</p>
					)}
				</div>
			</AscendantWindow>

			{/* Core Stats */}
			<div className="grid grid-cols-3 md:grid-cols-5 gap-4" id="anomaly-stats">
				<AscendantWindow title="ARMOR CLASS" compact>
					<div className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-blue-400" />
						<span className="font-display text-2xl">{armorClass}</span>
					</div>
					{acSource && (
						<span className="text-xs text-muted-foreground">({acSource})</span>
					)}
				</AscendantWindow>

				<AscendantWindow title="HIT POINTS" compact>
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-400" />
						<span className="font-display text-2xl">{hitPointsAverage}</span>
					</div>
					{(() => {
						const hd = (data as { hit_dice?: string }).hit_dice;
						const formula =
							hitPointsFormula.length > 0 ? hitPointsFormula : (hd ?? "");
						return formula ? (
							<span className="text-xs text-muted-foreground">{formula}</span>
						) : null;
					})()}
				</AscendantWindow>

				<AscendantWindow title="SPEED" compact>
					<div className="flex items-center gap-2">
						<Footprints className="w-5 h-5 text-green-400" />
						<span className="font-heading text-sm">{speeds}</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="CR" compact>
					<div className="flex items-center gap-2">
						<Skull className="w-5 h-5 text-purple-400" />
						<span className="font-display text-2xl">{cr}</span>
					</div>
					{data.xp && (
						<span className="text-xs text-muted-foreground">{data.xp} XP</span>
					)}
				</AscendantWindow>

				<AscendantWindow title="RIFT RANK" compact>
					<div className="flex items-center gap-2">
						<Swords className="w-5 h-5 text-orange-400" />
						<span className="font-display text-2xl">
							{(rankVal || "—").toUpperCase()}
						</span>
					</div>
				</AscendantWindow>
			</div>

			{/* Ability Scores */}
			<StatBlock
				title="ABILITY SCORES"
				copyable
				copyContent={`${displayName} - Ability Scores: STR ${abilityScores.strength ?? 10} (${getModifier(abilityScores.strength ?? 10)}), AGI ${abilityScores.agility ?? 10} (${getModifier(abilityScores.agility ?? 10)}), VIT ${abilityScores.vitality ?? 10} (${getModifier(abilityScores.vitality ?? 10)}), INT ${abilityScores.intelligence ?? 10} (${getModifier(abilityScores.intelligence ?? 10)}), SENSE ${abilityScores.sense ?? 10} (${getModifier(abilityScores.sense ?? 10)}), PRE ${abilityScores.presence ?? 10} (${getModifier(abilityScores.presence ?? 10)})`}
				id="anomaly-abilities"
			>
				<div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
					{[
						{ name: "STR", value: abilityScores.strength ?? 10 },
						{ name: "AGI", value: abilityScores.agility ?? 10 },
						{ name: "VIT", value: abilityScores.vitality ?? 10 },
						{ name: "INT", value: abilityScores.intelligence ?? 10 },
						{ name: "SENSE", value: abilityScores.sense ?? 10 },
						{ name: "PRE", value: abilityScores.presence ?? 10 },
					].map((stat) => (
						<div key={stat.name} className="glass-card p-3">
							<div className="font-display text-xs text-muted-foreground mb-1">
								{stat.name}
							</div>
							<div className="font-display text-2xl font-bold mb-1">
								{stat.value}
							</div>
							<div className="text-sm font-semibold text-primary">
								{getModifier(stat.value ?? 10)}
							</div>
						</div>
					))}
				</div>
			</StatBlock>

			{/* Defenses */}
			<div className="grid md:grid-cols-2 gap-4">
				{data.damage_vulnerabilities?.length ||
				data.damage_resistances?.length ||
				data.damage_immunities?.length ? (
					<AscendantWindow title="DAMAGE MODIFIERS">
						<div className="space-y-2">
							{data.damage_vulnerabilities &&
								data.damage_vulnerabilities.length > 0 && (
									<div>
										<span className="text-red-400 font-heading text-sm">
											Vulnerabilities:{" "}
										</span>
										<span className="text-muted-foreground">
											{data.damage_vulnerabilities
												.map(formatRegentVernacular)
												.join(", ")}
										</span>
									</div>
								)}
							{data.damage_resistances &&
								data.damage_resistances.length > 0 && (
									<div>
										<span className="text-yellow-400 font-heading text-sm">
											Resistances:{" "}
										</span>
										<span className="text-muted-foreground">
											{data.damage_resistances
												.map(formatRegentVernacular)
												.join(", ")}
										</span>
									</div>
								)}
							{data.damage_immunities && data.damage_immunities.length > 0 && (
								<div>
									<span className="text-black font-heading text-sm">
										Immunities:{" "}
									</span>
									<span className="text-muted-foreground">
										{data.damage_immunities
											.map(formatRegentVernacular)
											.join(", ")}
									</span>
								</div>
							)}
						</div>
					</AscendantWindow>
				) : null}

				{data.condition_immunities && data.condition_immunities.length > 0 && (
					<AscendantWindow title="CONDITION IMMUNITIES">
						<div className="flex flex-wrap gap-1">
							{data.condition_immunities.map((condition) => (
								<Badge key={condition} variant="outline">
									{formatRegentVernacular(condition)}
								</Badge>
							))}
						</div>
					</AscendantWindow>
				)}
			</div>

			{/* Proficiencies: Saving Throws, Skills, Senses, Languages */}
			{(savingThrows || skills || sensesText || languagesText) && (
				<AscendantWindow title="PROFICIENCIES & SENSES">
					<div className="space-y-2 text-sm">
						{savingThrows && Object.keys(savingThrows).length > 0 && (
							<div>
								<span className="font-heading text-primary">
									Saving Throws:{" "}
								</span>
								<span className="text-muted-foreground">
									{Object.entries(savingThrows)
										.map(([k, v]) => `${k} ${fmtBonus(v)}`)
										.join(", ")}
								</span>
							</div>
						)}
						{skills && Object.keys(skills).length > 0 && (
							<div>
								<span className="font-heading text-primary">Skills: </span>
								<span className="text-muted-foreground">
									{Object.entries(skills)
										.map(([k, v]) => `${k} ${fmtBonus(v)}`)
										.join(", ")}
								</span>
							</div>
						)}
						{sensesText && (
							<div>
								<span className="font-heading text-primary">Senses: </span>
								<span className="text-muted-foreground">{sensesText}</span>
							</div>
						)}
						{languagesText && (
							<div>
								<span className="font-heading text-primary">Languages: </span>
								<span className="text-muted-foreground">{languagesText}</span>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Traits */}
			{traits.length > 0 && (
				<StatBlock title="TRAITS" id="gateborn-traits">
					<StatSection title="">
						{traits.map((trait) => (
							<div key={trait.id} className="mb-4 last:mb-0">
								<h4 className="font-heading font-semibold text-primary mb-1 text-base">
									{formatRegentVernacular(trait.name)}
								</h4>
								<p className="text-sm text-foreground leading-relaxed">
									<AutoLinkText text={trait.description} />
								</p>
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Actions */}
			{regularActions.length > 0 && (
				<StatBlock title="ACTIONS" id="anomaly-actions">
					<StatSection title="">
						{regularActions.map((action) => (
							<div
								key={action.id}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								<div className="flex items-center gap-2 mb-2">
									<h4 className="font-heading font-semibold text-primary text-base">
										{formatRegentVernacular(action.name)}
									</h4>
									{action.recharge && (
										<Badge variant="secondary" className="text-xs">
											{formatRecharge(action.recharge)}
										</Badge>
									)}
								</div>
								<div className="flex flex-wrap gap-2 mb-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											queueAnomalyActionResolution(action, "/dice")
										}
									>
										Roll
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											queueAnomalyActionResolution(
												action,
												"/warden-directives/initiative-tracker",
											)
										}
									>
										Resolve in Initiative
									</Button>
								</div>
								<p className="text-sm text-foreground leading-relaxed mb-1">
									<AutoLinkText text={action.description} />
								</p>
								{action.damage && (
									<p className="text-sm text-foreground font-medium mt-2">
										<span className="font-semibold">Damage:</span>{" "}
										{action.damage}{" "}
										{action.damage_type
											? formatRegentVernacular(action.damage_type)
											: ""}
										{action.attack_bonus !== null &&
											action.attack_bonus !== undefined && (
												<span className="ml-2 text-muted-foreground">
													({action.attack_bonus >= 0 ? "+" : ""}
													{action.attack_bonus} to hit)
												</span>
											)}
									</p>
								)}
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Bonus Actions */}
			{bonusActions.length > 0 && (
				<StatBlock title="BONUS ACTIONS" id="anomaly-bonus-actions">
					<StatSection title="">
						{bonusActions.map((action) => (
							<div
								key={action.id}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								<div className="flex items-center gap-2 mb-2">
									<h4 className="font-heading font-semibold text-primary text-base">
										{formatRegentVernacular(action.name)}
									</h4>
									{action.recharge && (
										<Badge variant="secondary" className="text-xs">
											{formatRecharge(action.recharge)}
										</Badge>
									)}
								</div>
								<p className="text-sm text-foreground leading-relaxed mb-1">
									<AutoLinkText text={action.description} />
								</p>
								{action.damage && (
									<p className="text-sm text-foreground font-medium mt-2">
										<span className="font-semibold">Damage:</span>{" "}
										{action.damage}{" "}
										{action.damage_type
											? formatRegentVernacular(action.damage_type)
											: ""}
										{action.attack_bonus !== null &&
											action.attack_bonus !== undefined && (
												<span className="ml-2 text-muted-foreground">
													({action.attack_bonus >= 0 ? "+" : ""}
													{action.attack_bonus} to hit)
												</span>
											)}
									</p>
								)}
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Reactions */}
			{reactions.length > 0 && (
				<StatBlock title="REACTIONS" id="anomaly-reactions">
					<StatSection title="">
						{reactions.map((action) => (
							<div
								key={action.id}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								<div className="flex items-center gap-2 mb-2">
									<h4 className="font-heading font-semibold text-primary text-base">
										{formatRegentVernacular(action.name)}
									</h4>
									{action.recharge && (
										<Badge variant="secondary" className="text-xs">
											{formatRecharge(action.recharge)}
										</Badge>
									)}
								</div>
								<p className="text-sm text-foreground leading-relaxed mb-1">
									<AutoLinkText text={action.description} />
								</p>
								{action.damage && (
									<p className="text-sm text-foreground font-medium mt-2">
										<span className="font-semibold">Damage:</span>{" "}
										{action.damage}{" "}
										{action.damage_type
											? formatRegentVernacular(action.damage_type)
											: ""}
										{action.attack_bonus !== null &&
											action.attack_bonus !== undefined && (
												<span className="ml-2 text-muted-foreground">
													({action.attack_bonus >= 0 ? "+" : ""}
													{action.attack_bonus} to hit)
												</span>
											)}
									</p>
								)}
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Legendary Actions */}
			{legendaryActions.length > 0 && (
				<StatBlock
					title="LEGENDARY ACTIONS"
					className="border-amber-500/30 border-2"
					id="anomaly-legendary"
				>
					<p className="text-sm text-foreground mb-4 font-medium leading-relaxed">
						The creature can take 3 legendary actions, choosing from the options
						below.
					</p>
					<StatSection title="">
						{legendaryActions.map((action) => (
							<div
								key={action.id}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								<div className="flex items-center gap-2 mb-2">
									<h4 className="font-heading font-semibold text-amber-400 text-base">
										{formatRegentVernacular(action.name)}
									</h4>
									{action.legendary_cost && action.legendary_cost > 1 && (
										<Badge variant="outline" className="text-xs">
											Costs {action.legendary_cost}
										</Badge>
									)}
								</div>
								<p className="text-sm text-foreground leading-relaxed">
									<AutoLinkText text={action.description} />
								</p>
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Lair Actions */}
			{lairActions.length > 0 && (
				<StatBlock
					title="LAIR ACTIONS"
					className="border-purple-500/30 border-2"
					id="anomaly-lair"
				>
					<p className="text-sm text-foreground mb-4 font-medium leading-relaxed">
						On initiative count 20 (losing initiative ties), the anomaly takes a
						lair action to cause one of the following effects.
					</p>
					<StatSection title="">
						{lairActions.map((action) => (
							<div
								key={action.id}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								<h4 className="font-heading font-semibold text-purple-300 mb-1 text-base">
									{formatRegentVernacular(action.name)}
								</h4>
								<p className="text-sm text-foreground leading-relaxed">
									<AutoLinkText text={action.description} />
								</p>
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{/* Regional Effects */}
			{regionalEffects.length > 0 && (
				<StatBlock title="REGIONAL EFFECTS" id="anomaly-regional">
					<StatSection title="">
						{regionalEffects.map((effect) => (
							<div
								key={`${data.id}:regional:${effect.name || effect.description?.slice(0, 32) || "fx"}`}
								className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0"
							>
								{effect.name && (
									<h4 className="font-heading font-semibold text-primary mb-1 text-base">
										{formatRegentVernacular(effect.name)}
									</h4>
								)}
								<p className="text-sm text-foreground leading-relaxed">
									<AutoLinkText text={effect.description ?? ""} />
								</p>
							</div>
						))}
					</StatSection>
				</StatBlock>
			)}

			{data.description && (
				<StatBlock title="DESCRIPTION" id="anomaly-description">
					<p className="text-foreground leading-relaxed text-base">
						<AutoLinkText text={data.description} />
					</p>
				</StatBlock>
			)}

			{(() => {
				const abilities = (data as { abilities?: unknown }).abilities;
				const list = Array.isArray(abilities)
					? abilities.filter(
							(a): a is string => typeof a === "string" && a.trim().length > 0,
						)
					: [];
				return list.length > 0 ? (
					<StatBlock title="ABILITIES">
						<div className="flex flex-wrap gap-2">
							{list.map((a) => (
								<Badge key={a} variant="secondary" className="text-xs">
									{formatRegentVernacular(a)}
								</Badge>
							))}
						</div>
					</StatBlock>
				) : null;
			})()}

			{(() => {
				const weaknesses = (data as { weaknesses?: unknown }).weaknesses;
				const list = Array.isArray(weaknesses)
					? weaknesses.filter(
							(w): w is string => typeof w === "string" && w.trim().length > 0,
						)
					: [];
				return list.length > 0 ? (
					<StatBlock title="WEAKNESSES">
						<div className="flex flex-wrap gap-2">
							{list.map((w) => (
								<Badge key={w} variant="outline" className="text-xs">
									{formatRegentVernacular(w)}
								</Badge>
							))}
						</div>
					</StatBlock>
				) : null;
			})()}

			{(() => {
				const pb = (data as { proficiency_bonus?: number }).proficiency_bonus;
				const rarity = (data as { rarity?: string }).rarity;
				return pb || rarity ? (
					<div className="flex flex-wrap items-center gap-2 px-2">
						{typeof pb === "number" && (
							<Badge variant="outline" className="text-xs">
								Proficiency Bonus +{pb}
							</Badge>
						)}
						{rarity && (
							<Badge variant="outline" className="text-xs capitalize">
								{rarity}
							</Badge>
						)}
					</div>
				) : null;
			})()}

			{(data as { source_book?: string }).source_book && (
				<div className="flex justify-end p-2">
					<Badge
						variant="outline"
						className="text-[10px] opacity-50 uppercase tracking-tighter"
					>
						Source:{" "}
						{formatRegentVernacular(
							(data as { source_book?: string }).source_book ?? "",
						)}
					</Badge>
				</div>
			)}
		</div>
	);
};
