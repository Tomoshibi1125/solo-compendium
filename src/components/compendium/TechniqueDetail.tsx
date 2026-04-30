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
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";
import type {
	CompendiumEffects,
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
				bonus !== null ? `1d20${bonus >= 0 ? "+" : ""}${bonus}` : "1d20";
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

					{(mechanics?.attack || mechanics?.saving_throw) && (
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
					)}
					{data.level_requirement !== undefined &&
						data.level_requirement > 0 && (
							<Badge
								variant="outline"
								className="border-primary/40 text-primary"
							>
								Level {data.level_requirement}
							</Badge>
						)}
				</div>
			</AscendantWindow>

			{(activation || duration || range || components) && (
				<div
					id="technique-activation"
					className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4"
				>
					{activation && (
						<AscendantWindow title="ACTIVATION" compact>
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(
										typeof activation === "string"
											? activation
											: activation.type,
									)}
								</span>
							</div>
						</AscendantWindow>
					)}
					{duration && (
						<AscendantWindow title="DURATION" compact>
							<div className="flex items-center gap-2">
								<Timer className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(
										typeof duration === "string" ? duration : duration.type,
									)}
								</span>
							</div>
							{typeof duration === "object" &&
								(duration.value || duration.time) && (
									<span className="text-xs text-muted-foreground">
										{duration.value || duration.time}
										{duration.unit ? ` ${duration.unit}` : ""}
									</span>
								)}
						</AscendantWindow>
					)}
					{range && (
						<AscendantWindow title="RANGE" compact>
							<div className="flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(
										typeof range === "string" ? range : range.type,
									)}
								</span>
							</div>
							{typeof range === "object" && (range.distance || range.value) && (
								<span className="text-xs text-muted-foreground">
									{range.distance || range.value}
									{range.unit ? ` ${range.unit}` : " ft"}
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

			{effects && !Array.isArray(effects) && (
				<AscendantWindow id="technique-effects" title="EFFECTS">
					<div className="space-y-3">
						{(effects as CompendiumEffects).primary && (
							<p className="text-foreground leading-relaxed">
								<AutoLinkText
									text={(effects as CompendiumEffects).primary || ""}
								/>
							</p>
						)}
						{(effects as CompendiumEffects).secondary && (
							<p className="text-muted-foreground leading-relaxed">
								<AutoLinkText
									text={(effects as CompendiumEffects).secondary || ""}
								/>
							</p>
						)}
						{(effects as CompendiumEffects).tertiary && (
							<p className="text-muted-foreground leading-relaxed">
								<AutoLinkText
									text={(effects as CompendiumEffects).tertiary || ""}
								/>
							</p>
						)}
					</div>
				</AscendantWindow>
			)}

			{mechanics && (
				<AscendantWindow id="technique-mechanics" title="MECHANICS">
					<div className="space-y-4">
						{mechanics.attack && (
							<div className="flex items-start gap-2">
								<Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading capitalize">
										{formatRegentVernacular(mechanics.attack.type || "")} attack
									</p>
									<p className="text-sm text-muted-foreground">
										{mechanics.attack.damage
											? formatRegentVernacular(
													`Damage: ${typeof mechanics.attack.damage === "string" ? mechanics.attack.damage : mechanics.attack.damage.dice}`,
												)
											: "Damage varies"}
										{mechanics.attack.modifier
											? formatRegentVernacular(
													` | Modifier: ${mechanics.attack.modifier}`,
												)
											: ""}
									</p>
								</div>
							</div>
						)}
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
						{Array.isArray(mechanics.condition) &&
							mechanics.condition.length > 0 && (
								<div className="flex items-start gap-2">
									<Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-heading">Conditions</p>
										<p className="text-sm text-muted-foreground">
											{mechanics.condition
												.map(formatRegentVernacular)
												.join(", ")}
										</p>
									</div>
								</div>
							)}
					</div>
				</AscendantWindow>
			)}

			{limitations && (
				<AscendantWindow title="LIMITATIONS">
					<ul className="space-y-2 text-sm">
						{limitations.uses && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>Uses: {formatRegentVernacular(limitations.uses)}</span>
							</li>
						)}
						{limitations.recharge && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Recharge: {formatRegentVernacular(limitations.recharge)}
								</span>
							</li>
						)}
						{limitations.exhaustion && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Exhaustion: {formatRegentVernacular(limitations.exhaustion)}
								</span>
							</li>
						)}
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
