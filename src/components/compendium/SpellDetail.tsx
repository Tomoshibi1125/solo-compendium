import {
	Clock,
	Footprints,
	Shield,
	Sparkles,
	Swords,
	Target,
	Timer,
	Zap,
} from "lucide-react";
import type { DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import {
	formatAreaValue,
	formatDetailValue,
	getEffectLines,
	getLimitationLines,
} from "@/components/compendium/detailFormatters";
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { buildAttackRollFormula } from "@/lib/powerActionFormulas";
import { formatRegentVernacular } from "@/lib/vernacular";
import { buildSpellTemplateDragData, VTT_SPELL_TEMPLATE_MIME } from "@/lib/vtt";
import type { CompendiumMechanics, CompendiumSpell } from "@/types/compendium";

export interface SpellData extends CompendiumSpell {}

const rankStyles: Record<string, string> = {
	S: "text-amber-400 border-amber-500/40 bg-amber-500/10",
	A: "text-purple-400 border-purple-500/40 bg-purple-500/10",
	B: "text-blue-400 border-blue-500/40 bg-blue-500/10",
	C: "text-green-400 border-green-500/40 bg-green-500/10",
	D: "text-muted-foreground border-border bg-card",
};

export const SpellDetail = ({ data }: { data: SpellData }) => {
	const navigate = useNavigate();
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;
	const rankStyle = data.rank ? rankStyles[data.rank] : undefined;

	const activation = data.activation || undefined;
	const duration = data.duration || undefined;
	const range = data.range || undefined;
	const components = data.components || undefined;
	const effects = data.effects || undefined;
	const mechanics = data.mechanics || undefined;
	const limitations = data.limitations || undefined;
	const classes = Array.isArray((data as { classes?: unknown }).classes)
		? ((data as { classes?: string[] }).classes ?? [])
		: [];
	const topAttack = data.attack ?? null;
	const topSavingThrow = data.saving_throw ?? null;
	const castingTimeText = formatDetailValue(data.casting_time ?? activation);
	const areaText = formatAreaValue(data.area);
	const effectLines = getEffectLines(effects);
	const limitationLines = getLimitationLines(limitations);

	const rangeText = formatDetailValue(range);

	const getDamageRoll = (damage: unknown): string | null => {
		if (typeof damage === "string") return damage;
		if (damage && typeof damage === "object" && "dice" in damage) {
			const dice = (damage as { dice?: unknown }).dice;
			return typeof dice === "string" ? dice : null;
		}
		return null;
	};

	const rankBonus = (rank: string | null | undefined): number => {
		switch (rank) {
			case "S":
				return 11;
			case "A":
				return 9;
			case "B":
				return 7;
			case "C":
				return 5;
			case "D":
				return 3;
			default:
				return 5;
		}
	};

	const rankSaveDC = (rank: string | null | undefined): number => {
		switch (rank) {
			case "S":
				return 18;
			case "A":
				return 16;
			case "B":
				return 14;
			case "C":
				return 13;
			case "D":
				return 12;
			default:
				return 13;
		}
	};

	const buildResolutionPayload = (): ActionResolutionPayload | null => {
		const m = (data.mechanics ?? null) as CompendiumMechanics | null;
		const id = crypto.randomUUID();
		const name = displayName;

		const attack = m?.attack ?? topAttack;
		const savingThrow = m?.saving_throw ?? topSavingThrow;
		const damageRoll = getDamageRoll(m?.attack?.damage ?? topAttack?.damage);
		const healingRoll = m?.healing?.dice ?? null;

		if (attack) {
			const bonus = rankBonus(data.rank);
			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "attack",
				attack: { roll: buildAttackRollFormula(bonus) },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: Array.isArray(m?.condition)
					? m.condition
					: typeof m?.condition === "string"
						? [m.condition]
						: undefined,
			};
		}

		if (savingThrow) {
			const dc =
				typeof savingThrow.dc === "number"
					? savingThrow.dc
					: rankSaveDC(data.rank);
			const ability =
				typeof savingThrow.ability === "string"
					? savingThrow.ability
					: undefined;

			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "save",
				save: { dc, ability, roll: "1d20" },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: Array.isArray(m?.condition)
					? (m.condition as string[])
					: typeof m?.condition === "string"
						? [m.condition]
						: undefined,
			};
		}

		if (healingRoll) {
			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "healing",
				healing: { roll: String(healingRoll) },
			};
		}

		return null;
	};

	const queueResolutionAndNavigate = (path: string) => {
		const payload = buildResolutionPayload();
		if (!payload) return;
		setPendingResolution(payload);
		navigate(path);
	};

	const handleSpellDragStart = (e: DragEvent<HTMLFieldSetElement>) => {
		e.dataTransfer.setData(
			VTT_SPELL_TEMPLATE_MIME,
			buildSpellTemplateDragData({
				id: data.id,
				name: displayName,
				range: data.range,
				target: (data as { target?: unknown }).target,
				area: data.area,
				description: data.description,
				mechanics: data.mechanics,
			}),
		);
		e.dataTransfer.effectAllowed = "copy";
	};

	return (
		<fieldset
			className="space-y-6"
			aria-label={`Draggable spell details for ${displayName}`}
			draggable
			onDragStart={handleSpellDragStart}
			data-testid="spell-detail-draggable"
		>
			{imageSrc && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={imageSrc}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={
							<Sparkles className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			<AscendantWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Spell" itemName={displayName} />}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">
							{formatRegentVernacular(data.school)}
						</Badge>
						{data.rank && (
							<Badge variant="outline" className={rankStyle}>
								Rank {data.rank}
							</Badge>
						)}
						{data.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(data.source_book)}
							</Badge>
						)}
					</div>

					{classes.length > 0 && (
						<div className="flex flex-wrap gap-2">
							<span className="text-sm text-muted-foreground">Classes:</span>
							{classes.map((className) => (
								<Badge key={className} variant="outline" className="text-xs">
									{formatRegentVernacular(className)}
								</Badge>
							))}
						</div>
					)}

					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							onClick={() => queueResolutionAndNavigate("/dice")}
						>
							Roll
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								queueResolutionAndNavigate(
									"/warden-directives/initiative-tracker",
								)
							}
						>
							Resolve in Initiative
						</Button>
					</div>
					{mechanics && (
						<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
							{(mechanics as CompendiumMechanics).attack || topAttack ? (
								<span>
									Rank/default attack:{" "}
									{buildAttackRollFormula(rankBonus(data.rank))}
								</span>
							) : null}
							{(mechanics as CompendiumMechanics).saving_throw ||
							topSavingThrow ? (
								<span>
									Rank/default save: DC{" "}
									{typeof (mechanics as CompendiumMechanics).saving_throw
										?.dc === "number"
										? (mechanics as CompendiumMechanics).saving_throw?.dc
										: typeof topSavingThrow?.dc === "number"
											? topSavingThrow.dc
											: rankSaveDC(data.rank)}
								</span>
							) : null}
						</div>
					)}
				</div>
			</AscendantWindow>

			{(castingTimeText || rangeText || areaText) && (
				<div
					id="spell-stats"
					className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4"
				>
					{castingTimeText && (
						<AscendantWindow title="CASTING TIME" compact>
							<div className="flex items-center gap-2">
								<Clock className="w-5 h-5 text-primary" />
								<span className="font-heading">
									{formatRegentVernacular(castingTimeText)}
								</span>
							</div>
						</AscendantWindow>
					)}
					{rangeText && (
						<AscendantWindow title="RANGE" compact>
							<div className="flex items-center gap-2">
								<Target className="w-5 h-5 text-emerald-400" />
								<span className="font-heading">
									{formatRegentVernacular(rangeText)}
								</span>
							</div>
						</AscendantWindow>
					)}
					{areaText && (
						<AscendantWindow title="AREA" compact>
							<div className="flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								<span className="font-heading">
									{formatRegentVernacular(areaText)}
								</span>
							</div>
						</AscendantWindow>
					)}
				</div>
			)}

			{(activation || duration || components) && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{activation && (
						<AscendantWindow title="ACTIVATION" compact>
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatDetailValue(activation)}
								</span>
							</div>
							{typeof activation === "object" && activation.cost && (
								<span className="text-xs text-muted-foreground">
									{formatRegentVernacular(String(activation.cost))}
								</span>
							)}
						</AscendantWindow>
					)}
					{duration && (
						<AscendantWindow title="DURATION" compact>
							<div className="flex items-center gap-2">
								<Timer className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatDetailValue(duration)}
								</span>
							</div>
							{typeof duration === "object" && (
								<span className="text-xs text-muted-foreground">
									{duration.value}
									{duration.unit ? ` ${duration.unit}` : ""}
								</span>
							)}
						</AscendantWindow>
					)}
					{components && (
						<AscendantWindow title="COMPONENTS" compact>
							<div className="flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-primary" />
								<span className="font-heading">
									{components.verbal ? "V" : ""}
									{components.somatic ? "S" : ""}
									{components.material ? "M" : ""}
								</span>
							</div>
							{components.material &&
								typeof components.material === "string" && (
									<p className="text-xs text-muted-foreground mt-1">
										{components.material}
									</p>
								)}
							{components.focus && (
								<p className="text-xs text-muted-foreground italic mt-0.5">
									Focus: {components.focus}
								</p>
							)}
						</AscendantWindow>
					)}
				</div>
			)}

			{effectLines.length > 0 && (
				<AscendantWindow title="EFFECTS">
					<div className="space-y-3">
						{effectLines.map((line) => (
							<div
								key={`${line.label}:${line.text}`}
								className="border-l-2 border-primary/50 pl-3"
							>
								<p className="text-xs uppercase tracking-wider text-muted-foreground">
									{line.label}
								</p>
								<p className="text-foreground">
									<AutoLinkText text={line.text} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{mechanics && (
				<AscendantWindow title="MECHANICS">
					<div className="space-y-4">
						{(() => {
							const m = mechanics as CompendiumMechanics;
							const attack = m.attack ?? topAttack;
							if (!attack) return null;
							const damageRoll = getDamageRoll(attack.damage);
							const damageType =
								"damage_type" in attack
									? String(
											(attack as { damage_type?: unknown }).damage_type ?? "",
										)
									: "";
							const modifier =
								"modifier" in attack ? attack.modifier : topAttack?.ability;
							return (
								<div className="flex items-start gap-2">
									<Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading capitalize">
											{formatRegentVernacular(attack.type || "")}
											attack
										</p>
										<p className="text-sm text-muted-foreground">
											{damageRoll
												? formatRegentVernacular(
														`Damage: ${damageRoll}${damageType ? ` ${damageType}` : ""}`,
													)
												: "Damage varies"}
											{modifier
												? formatRegentVernacular(` | Modifier: ${modifier}`)
												: ""}
										</p>
									</div>
								</div>
							);
						})()}
						{(() => {
							const m = mechanics as CompendiumMechanics;
							const st = m.saving_throw ?? topSavingThrow;
							if (!st) return null;
							return (
								<div className="flex items-start gap-2">
									<Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading">
											{formatRegentVernacular(String(st.ability || ""))} Save
										</p>
										<p className="text-sm text-muted-foreground">DC {st.dc}</p>
										{st.success && (
											<p className="text-xs text-muted-foreground">
												Success: {formatRegentVernacular(st.success)}
											</p>
										)}
										{st.failure && (
											<p className="text-xs text-muted-foreground">
												Failure: {formatRegentVernacular(st.failure)}
											</p>
										)}
									</div>
								</div>
							);
						})()}
						{(() => {
							const healing = (mechanics as CompendiumMechanics).healing;
							if (!healing?.dice) return null;
							return (
								<div className="flex items-start gap-2">
									<Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading">Healing</p>
										<p className="text-sm text-muted-foreground">
											{formatRegentVernacular(
												`Restores ${healing.dice}${
													healing.type && healing.type !== "hp"
														? ` ${healing.type}`
														: ""
												}`,
											)}
										</p>
									</div>
								</div>
							);
						})()}
						{(() => {
							const m = mechanics as CompendiumMechanics;
							// Standalone damage line for save-for-half / weapon-rider
							// spells where there is no attack block to carry the roll.
							if (m.attack) return null;
							const profile =
								typeof m.damage_profile === "string" ? m.damage_profile : null;
							if (!profile || !/\d+d\d+/i.test(profile)) return null;
							return (
								<div className="flex items-start gap-2">
									<Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading">Damage</p>
										<p className="text-sm text-muted-foreground">
											{formatRegentVernacular(profile)}
										</p>
									</div>
								</div>
							);
						})()}
						{(() => {
							const utility = (
								mechanics as CompendiumMechanics & {
									utility?: { resolution?: unknown };
								}
							).utility;
							const m = mechanics as CompendiumMechanics;
							if (m.attack || m.saving_throw || m.healing) return null;
							const resolution =
								utility && typeof utility.resolution === "string"
									? utility.resolution
									: null;
							if (!resolution) return null;
							return (
								<div className="flex items-start gap-2">
									<Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading">Effect</p>
										<p className="text-sm text-muted-foreground">
											{formatRegentVernacular(resolution)}
										</p>
									</div>
								</div>
							);
						})()}
						{(() => {
							const movement = (mechanics as CompendiumMechanics).movement;
							if (!movement) return null;
							const isObj = typeof movement === "object";
							return (
								<div className="flex items-start gap-2">
									<Footprints className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading capitalize">
											{formatRegentVernacular(
												isObj ? movement.type || "" : (movement as string),
											)}{" "}
											movement
										</p>
										{isObj && movement.distance !== undefined && (
											<p className="text-sm text-muted-foreground">
												{movement.distance} ft
											</p>
										)}
									</div>
								</div>
							);
						})()}
						{formatDetailValue(
							(mechanics as CompendiumMechanics).condition,
						) && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">Conditions</p>
									<p className="text-sm text-muted-foreground">
										{formatDetailValue(
											(mechanics as CompendiumMechanics).condition,
										)}
									</p>
								</div>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{limitationLines.length > 0 && (
				<AscendantWindow title="LIMITATIONS">
					<ul className="space-y-2 text-sm">
						{limitationLines.map((line) => (
							<li
								key={`${line.label}:${line.text}`}
								className="flex items-center gap-2"
							>
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									{line.label}: {formatRegentVernacular(line.text)}
								</span>
							</li>
						))}
					</ul>
				</AscendantWindow>
			)}

			{(data.higher_levels || data.atHigherLevels) && (
				<AscendantWindow title="AT HIGHER TIERS">
					<p className="text-foreground leading-relaxed">
						<AutoLinkText
							text={data.higher_levels || data.atHigherLevels || ""}
						/>
					</p>
				</AscendantWindow>
			)}

			{data.description && (
				<AscendantWindow id="spell-description" title="DESCRIPTION">
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>
					{data.lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText
									text={
										typeof data.lore === "string"
											? data.lore
											: data.lore?.history || ""
									}
								/>
							</p>
						</div>
					)}
				</AscendantWindow>
			)}
		</fieldset>
	);
};
