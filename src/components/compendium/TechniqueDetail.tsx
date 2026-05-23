import {
	Footprints,
	Shield,
	Sparkles,
	Swords,
	Target,
	Timer,
	Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import {
	formatDetailValue,
	getEffectLines,
	getLimitationLines,
} from "@/components/compendium/detailFormatters";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { buildAttackRollFormula } from "@/lib/powerActionFormulas";
import { formatRegentVernacular } from "@/lib/vernacular";
import type {
	CompendiumMechanics,
	CompendiumTechnique,
} from "@/types/compendium";

interface TechniqueData extends CompendiumTechnique {}

export const TechniqueDetail = ({ data }: { data: TechniqueData }) => {
	const navigate = useNavigate();
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;

	const prereq = data.prerequisites || undefined;
	const activation = data.activation || undefined;
	const duration = data.duration || undefined;
	const range = data.range || undefined;
	const components = data.components || undefined;
	const effects = data.effects || undefined;
	const mechanics = data.mechanics || undefined;
	const limitations = data.limitations || undefined;
	const classes = Array.isArray(data.classes) ? data.classes : [];
	const effectLines = getEffectLines(effects);
	const limitationLines = getLimitationLines(limitations);
	const activationText = formatDetailValue(activation);
	const durationText = formatDetailValue(duration);
	const rangeText = formatDetailValue(range);

	const buildResolutionPayload = (): ActionResolutionPayload | null => {
		const m = mechanics as CompendiumMechanics | null;
		const id = crypto.randomUUID();
		const name = displayName;

		const parseBonus = (value: unknown): number | null => {
			if (typeof value === "number") return value;
			if (typeof value !== "string") return null;
			const trimmed = value.trim();
			const match = trimmed.match(/^([+-]?\d+)$/);
			if (!match) return null;
			return parseInt(match[1], 10);
		};

		const parseDc = (value: unknown): number | null => {
			if (typeof value === "number" && Number.isFinite(value)) return value;
			if (typeof value !== "string") return null;
			const match = value.trim().match(/^(\d+)$/);
			if (!match) return null;
			return parseInt(match[1], 10);
		};

		const conditions = Array.isArray(m?.condition) ? m?.condition : undefined;

		if (m?.attack) {
			const bonus = parseBonus(m.attack.modifier);
			const attackRoll =
				bonus !== null ? buildAttackRollFormula(bonus) : "1d20";
			const damageRoll =
				typeof m.attack.damage === "string"
					? m.attack.damage
					: typeof m.attack.damage === "object"
						? m.attack.damage.dice
						: undefined;

			return {
				version: 1,
				id,
				name,
				source: { type: "technique", entryId: data.id },
				kind: "attack",
				attack: { roll: attackRoll },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: conditions,
			};
		}

		if (m?.saving_throw) {
			const dc = parseDc(m.saving_throw.dc) ?? 10;
			const ability =
				typeof m.saving_throw.ability === "string"
					? m.saving_throw.ability
					: undefined;

			return {
				version: 1,
				id,
				name,
				source: { type: "technique", entryId: data.id },
				kind: "save",
				save: { dc, ability, roll: "1d20" },
				appliesConditions: conditions,
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

	return (
		<div className="space-y-6">
			{imageSrc && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={imageSrc}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={
							<Swords className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{(data.technique_type || data.type) && (
							<Badge variant="secondary">
								{formatRegentVernacular(data.technique_type || data.type)}
							</Badge>
						)}
						{data.style && (
							<Badge variant="outline">
								{formatRegentVernacular(data.style)}
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

					{(data.level_requirement || data.uses_per_rest_formula) && (
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
							{data.level_requirement !== undefined &&
								data.level_requirement > 0 && (
									<span>Level Requirement: {data.level_requirement}</span>
								)}
							{data.uses_per_rest_formula && (
								<span>
									Uses per Rest:{" "}
									{formatRegentVernacular(data.uses_per_rest_formula)}
								</span>
							)}
						</div>
					)}

					{(mechanics?.attack || mechanics?.saving_throw) && (
						<div className="space-y-2">
							<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
								{mechanics?.attack && (
									<span>
										Base attack: {(() => {
											const raw = mechanics.attack?.modifier;
											const bonus =
												typeof raw === "number"
													? raw
													: typeof raw === "string" &&
															/^[-+]?\d+$/.test(raw.trim())
														? parseInt(raw, 10)
														: null;
											return bonus !== null
												? buildAttackRollFormula(bonus)
												: "1d20";
										})()}
									</span>
								)}
								{mechanics?.saving_throw && (
									<span>
										Base save: DC {mechanics.saving_throw.dc ?? 10}
										{mechanics.saving_throw.ability
											? ` ${mechanics.saving_throw.ability}`
											: ""}
									</span>
								)}
							</div>
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
						</div>
					)}
				</div>
			</AscendantWindow>

			{(activationText || durationText || rangeText || components) && (
				<div
					id="technique-activation"
					className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4"
				>
					{activationText && (
						<AscendantWindow title="ACTIVATION" compact>
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(activationText)}
								</span>
							</div>
						</AscendantWindow>
					)}
					{durationText && (
						<AscendantWindow title="DURATION" compact>
							<div className="flex items-center gap-2">
								<Timer className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(durationText)}
								</span>
							</div>
						</AscendantWindow>
					)}
					{rangeText && (
						<AscendantWindow title="RANGE" compact>
							<div className="flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(rangeText)}
								</span>
							</div>
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

			{prereq && (
				<AscendantWindow title="PREREQUISITES">
					<ul className="space-y-2 text-sm">
						{prereq.class && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>{formatRegentVernacular(prereq.class)}</span>
							</li>
						)}
						{prereq.ability && prereq.score !== undefined && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									{formatRegentVernacular(prereq.ability)} {prereq.score}+
								</span>
							</li>
						)}
						{prereq.proficiency && prereq.proficiency.length > 0 && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Proficiencies:{" "}
									{prereq.proficiency.map(formatRegentVernacular).join(", ")}
								</span>
							</li>
						)}
						{prereq.technique && prereq.technique.length > 0 && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Requires:{" "}
									{prereq.technique.map(formatRegentVernacular).join(", ")}
								</span>
							</li>
						)}
					</ul>
				</AscendantWindow>
			)}

			{effectLines.length > 0 && (
				<AscendantWindow id="technique-effects" title="EFFECTS">
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
				<AscendantWindow id="technique-mechanics" title="MECHANICS">
					<div className="space-y-4">
						{mechanics.attack &&
							(() => {
								const attack = mechanics.attack;
								if (!attack) return null;
								const damageRoll =
									typeof attack.damage === "string"
										? attack.damage
										: typeof attack.damage === "object" &&
												attack.damage !== null &&
												"dice" in attack.damage
											? String(attack.damage.dice ?? "")
											: "";
								const damageType =
									typeof attack.damage === "object" &&
									attack.damage !== null &&
									"type" in attack.damage
										? String((attack.damage as { type?: unknown }).type ?? "")
										: "";
								return (
									<div className="flex items-start gap-2">
										<Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-heading capitalize">
												{formatRegentVernacular(attack.type || "")} attack
											</p>
											<p className="text-sm text-muted-foreground">
												{damageRoll
													? formatRegentVernacular(
															`Damage: ${damageRoll}${damageType ? ` ${damageType}` : ""}`,
														)
													: "Damage varies"}
												{attack.modifier
													? formatRegentVernacular(
															` | Modifier: ${attack.modifier}`,
														)
													: ""}
											</p>
										</div>
									</div>
								);
							})()}
						{mechanics.saving_throw && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">
										{formatRegentVernacular(
											String(mechanics.saving_throw.ability || ""),
										)}{" "}
										Save
									</p>
									<p className="text-sm text-muted-foreground">
										DC {mechanics.saving_throw.dc}
									</p>
									{mechanics.saving_throw.success && (
										<p className="text-xs text-muted-foreground">
											Success:{" "}
											{formatRegentVernacular(mechanics.saving_throw.success)}
										</p>
									)}
									{mechanics.saving_throw.failure && (
										<p className="text-xs text-muted-foreground">
											Failure:{" "}
											{formatRegentVernacular(mechanics.saving_throw.failure)}
										</p>
									)}
								</div>
							</div>
						)}
						{mechanics.movement && typeof mechanics.movement === "object" && (
							<div className="flex items-start gap-2">
								<Footprints className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading capitalize">
										{formatRegentVernacular(mechanics.movement.type || "")}{" "}
										movement
									</p>
									{mechanics.movement.distance !== undefined && (
										<p className="text-sm text-muted-foreground">
											{mechanics.movement.distance} ft
										</p>
									)}
								</div>
							</div>
						)}
						{formatDetailValue(mechanics.condition) && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">Conditions</p>
									<p className="text-sm text-muted-foreground">
										{formatRegentVernacular(
											formatDetailValue(mechanics.condition),
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

			{data.description && (
				<AscendantWindow id="technique-description" title="DESCRIPTION">
					<div className="space-y-3">
						{data.flavor && (
							<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
								<AutoLinkText text={data.flavor} />
							</p>
						)}
						<p className="text-foreground leading-relaxed">
							<AutoLinkText text={data.description} />
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
												: data.lore.history
										}
									/>
								</p>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}
		</div>
	);
};
