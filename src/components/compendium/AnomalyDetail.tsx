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
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { StatBlock, StatSection } from "@/components/compendium/StatBlock";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
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

const getModifier = (score: number) => {
	const mod = Math.floor((score - 10) / 2);
	return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const AnomalyDetail = ({ data }: { data: AnomalyData }) => {
	const navigate = useNavigate();
	const [actions, setActions] = useState<AnomalyAction[]>([]);
	const [traits, setTraits] = useState<AnomalyTrait[]>([]);
	const actionHash = useMemo(
		() => JSON.stringify(data.actions || []),
		[data.actions],
	);
	const traitHash = useMemo(
		() => JSON.stringify(data.traits || []),
		[data.traits],
	);

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
		const fetchRelatedData = async () => {
			const staticActions = JSON.parse(actionHash) as
				| Record<string, unknown>[]
				| null;
			const staticTraits = JSON.parse(traitHash) as
				| Record<string, unknown>[]
				| null;

			// If Supabase isn't configured, rely entirely on embedded static data.
			if (!isSupabaseConfigured) {
				if (staticActions && staticActions.length > 0) {
					setActions(
						staticActions
							.map((a, idx) =>
								mapStaticAction(a as Record<string, unknown>, idx),
							)
							.filter((a) => a.description.trim().length > 0),
					);
				}

				if (staticTraits && staticTraits.length > 0) {
					setTraits(
						staticTraits
							.map((t, idx) =>
								mapStaticTrait(t as Record<string, unknown>, idx),
							)
							.filter((t) => t.description.trim().length > 0),
					);
				}

				return;
			}

			const [actionsRes, traitsRes] = await Promise.all([
				supabase
					.from("compendium_Anomaly_actions")
					.select("*")
					.eq("Anomaly_id", data.id),
				supabase
					.from("compendium_Anomaly_traits")
					.select("*")
					.eq("Anomaly_id", data.id),
			]);

			const remoteActions = actionsRes.data || [];
			const remoteTraits = traitsRes.data || [];

			if (remoteActions.length > 0) {
				setActions(
					remoteActions.map((action: Record<string, unknown>) => ({
						id: String(action.id),
						name: String(action.name),
						description: String(action.description ?? ""),
						attack_bonus:
							typeof action.attack_bonus === "number"
								? action.attack_bonus
								: undefined,
						damage:
							typeof action.damage === "string" ? action.damage : undefined,
						damage_type:
							typeof action.damage_type === "string"
								? action.damage_type
								: undefined,
						recharge:
							typeof action.recharge === "string" ? action.recharge : undefined,
						legendary_cost:
							typeof action.legendary_cost === "number"
								? action.legendary_cost
								: undefined,
						action_type:
							typeof action.action_type === "string"
								? action.action_type
								: "action",
					})) as AnomalyAction[],
				);
			} else if (staticActions && staticActions.length > 0) {
				// Remote not present; fallback to static embedded data.
				setActions(
					staticActions
						.map((a, idx) => mapStaticAction(a as Record<string, unknown>, idx))
						.filter((a) => a.description.trim().length > 0),
				);
			}

			if (remoteTraits.length > 0) {
				setTraits(
					remoteTraits.map((trait: Record<string, unknown>) => ({
						id: String(trait.id),
						name: String(trait.name),
						description: String(trait.description ?? ""),
					})),
				);
			} else if (staticTraits && staticTraits.length > 0) {
				setTraits(
					staticTraits
						.map((t, idx) => mapStaticTrait(t as Record<string, unknown>, idx))
						.filter((t) => t.description.trim().length > 0),
				);
			}
		};

		fetchRelatedData();
	}, [data.id, actionHash, traitHash, mapStaticAction, mapStaticTrait]);

	const speeds = data.speed ? `${data.speed} ft.` : "30 ft.";

	const regularActions = actions.filter((a) => a.action_type === "action");
	const bonusActions = actions.filter((a) => a.action_type === "bonus");
	const reactions = actions.filter((a) => a.action_type === "reaction");
	const legendaryActions = actions.filter((a) => a.action_type === "legendary");

	const gateStyle = data.rank ? gateRankColors[data.rank] : null;
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const anomalySize = formatRegentVernacular(data.size || "Medium");
	const anomalyType = formatRegentVernacular(data.type || "Unknown");
	const armorClass = data.ac ?? 0;
	const hitPointsAverage = data.hp ?? 0;
	const hitPointsFormula = "";
	const cr = data.stats?.challenge_rating?.toString() || data.cr || "—";
	const isBoss = false; // logic for boss removed in favor of explicit rank properties.

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
			{/* Hero Image */}
			{data.image_url && (
				<div className="w-full">
					<CompendiumImage
						src={data.image_url}
						alt={displayName}
						size="hero"
						aspectRatio="landscape"
						className="w-full rounded-lg"
						fallbackIcon={<Skull className="w-32 h-32 text-muted-foreground" />}
					/>
				</div>
			)}

			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Anomaly" itemName={displayName} />}
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
						{data.rank && gateStyle && (
							<Badge
								className={cn(
									gateStyle.bg,
									gateStyle.text,
									"font-display tracking-wider",
									gateStyle.glow,
								)}
							>
								{data.rank}-Rank Rift
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
								Guild Master
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
				</AscendantWindow>

				<AscendantWindow title="HIT POINTS" compact>
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-400" />
						<span className="font-display text-2xl">{hitPointsAverage}</span>
					</div>
					{hitPointsFormula.length > 0 && (
						<span className="text-xs text-muted-foreground">
							{hitPointsFormula}
						</span>
					)}
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
							{(data.rank || "—").toUpperCase()}
						</span>
					</div>
				</AscendantWindow>
			</div>

			{/* Ability Scores */}
			<StatBlock
				title="ABILITY SCORES"
				copyable
				copyContent={`${displayName} - Ability Scores: STR ${data.stats?.ability_scores?.strength ?? 10} (${getModifier(data.stats?.ability_scores?.strength ?? 10)}), AGI ${data.stats?.ability_scores?.agility ?? 10} (${getModifier(data.stats?.ability_scores?.agility ?? 10)}), VIT ${data.stats?.ability_scores?.vitality ?? 10} (${getModifier(data.stats?.ability_scores?.vitality ?? 10)}), INT ${data.stats?.ability_scores?.intelligence ?? 10} (${getModifier(data.stats?.ability_scores?.intelligence ?? 10)}), SENSE ${data.stats?.ability_scores?.sense ?? 10} (${getModifier(data.stats?.ability_scores?.sense ?? 10)}), PRE ${data.stats?.ability_scores?.presence ?? 10} (${getModifier(data.stats?.ability_scores?.presence ?? 10)})`}
				id="anomaly-abilities"
			>
				<div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
					{[
						{ name: "STR", value: data.stats?.ability_scores?.strength ?? 10 },
						{ name: "AGI", value: data.stats?.ability_scores?.agility ?? 10 },
						{ name: "VIT", value: data.stats?.ability_scores?.vitality ?? 10 },
						{ name: "INT", value: data.stats?.ability_scores?.intelligence ?? 10 },
						{ name: "SENSE", value: data.stats?.ability_scores?.sense ?? 10 },
						{ name: "PRE", value: data.stats?.ability_scores?.presence ?? 10 },
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
											{action.recharge}
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
											{action.recharge}
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
											{action.recharge}
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

			{data.description && (
				<StatBlock title="DESCRIPTION" id="anomaly-description">
					<p className="text-foreground leading-relaxed text-base">
						<AutoLinkText text={data.description} />
					</p>
				</StatBlock>
			)}
		</div>
	);
};
