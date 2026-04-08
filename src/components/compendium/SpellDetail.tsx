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
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { 
	CompendiumMechanics, 
	CompendiumSpell,
	CompendiumEffects
} from "@/types/compendium";

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

	const renderRange = () => {
		if (!range) return null;
		if (typeof range === "string") return formatRegentVernacular(range);
		if (typeof range === "object") {
			return `${range.value}${range.unit ? ` ${range.unit}` : ""} (${formatRegentVernacular(range.type)})`;
		}
		return null;
	};

	const rangeText = renderRange();

	const rankBonus = (rank: string | null | undefined): number => {
		switch (rank) {
			case "S": return 11;
			case "A": return 9;
			case "B": return 7;
			case "C": return 5;
			case "D": return 3;
			default: return 5;
		}
	};

	const rankSaveDC = (rank: string | null | undefined): number => {
		switch (rank) {
			case "S": return 18;
			case "A": return 16;
			case "B": return 14;
			case "C": return 13;
			case "D": return 12;
			default: return 13;
		}
	};

	const buildResolutionPayload = (): ActionResolutionPayload | null => {
		const m = (data.mechanics ?? null) as CompendiumMechanics | null;
		const id = crypto.randomUUID();
		const name = displayName;

		const damageRoll = typeof m?.attack?.damage === "string" ? m.attack.damage : null;
		const healingRoll = m?.healing?.dice ?? null;

		if (m?.attack) {
			const bonus = rankBonus(data.rank);
			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "attack",
				attack: { roll: `1d20+${bonus}` },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: Array.isArray(m?.condition)
					? m.condition
					: typeof m?.condition === "string" ? [m.condition] : undefined,
			};
		}

		if (m?.saving_throw) {
			const dc = typeof m.saving_throw.dc === "number" ? m.saving_throw.dc : rankSaveDC(data.rank);
			const ability = typeof m.saving_throw.ability === "string" ? m.saving_throw.ability : undefined;

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
					: typeof m?.condition === "string" ? [m.condition] : undefined,
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
						fallbackIcon={<Sparkles className="w-32 h-32 text-muted-foreground" />}
					/>
				</div>
			)}

			<AscendantWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Spell" itemName={displayName} />}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{formatRegentVernacular(data.school)}</Badge>
						{data.rank && (
							<Badge variant="outline" className={rankStyle}>
								Rank {data.rank}
							</Badge>
						)}
						{data.source_book && (
							<Badge variant="outline">{formatRegentVernacular(data.source_book)}</Badge>
						)}
					</div>

					<div className="flex flex-wrap gap-2">
						<Button variant="outline" onClick={() => queueResolutionAndNavigate("/dice")}>
							Roll
						</Button>
						<Button
							variant="outline"
							onClick={() => queueResolutionAndNavigate("/warden-directives/initiative-tracker")}
						>
							Resolve in Initiative
						</Button>
					</div>
				</div>
			</AscendantWindow>

			<div id="spell-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4">
				{rangeText && (
					<AscendantWindow title="RANGE" compact>
						<div className="flex items-center gap-2">
							<Target className="w-5 h-5 text-emerald-400" />
							<span className="font-heading">{formatRegentVernacular(rangeText)}</span>
						</div>
					</AscendantWindow>
				)}
			</div>

			{(activation || duration || components) && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{activation && (
						<AscendantWindow title="ACTIVATION" compact>
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(typeof activation === "string" ? activation : activation.type)}
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
									{formatRegentVernacular(typeof duration === "string" ? duration : duration.type)}
								</span>
							</div>
							{typeof duration === "object" && (
								<span className="text-xs text-muted-foreground">
									{duration.value}{duration.unit ? ` ${duration.unit}` : ""}
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
							{components.material && typeof components.material === "string" && (
								<p className="text-xs text-muted-foreground mt-1">{components.material}</p>
							)}
							{components.focus && (
								<p className="text-xs text-muted-foreground italic mt-0.5">Focus: {components.focus}</p>
							)}
						</AscendantWindow>
					)}
				</div>
			)}

			{effects && !Array.isArray(effects) && (
				<AscendantWindow title="EFFECTS">
					<div className="space-y-3">
						{(effects as CompendiumEffects).primary && (
							<div className="border-l-2 border-primary/50 pl-3">
								<p className="text-foreground">
									<AutoLinkText text={(effects as CompendiumEffects).primary || ""} />
								</p>
							</div>
						)}
						{(effects as CompendiumEffects).secondary && (
							<div className="border-l-2 border-secondary/50 pl-3">
								<p className="text-muted-foreground">
									<AutoLinkText text={(effects as CompendiumEffects).secondary || ""} />
								</p>
							</div>
						)}
						{(effects as CompendiumEffects).tertiary && (
							<div className="border-l-2 border-muted-foreground/50 pl-3">
								<p className="text-xs text-muted-foreground">
									<AutoLinkText text={(effects as CompendiumEffects).tertiary || ""} />
								</p>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{mechanics && (
				<AscendantWindow title="MECHANICS">
					<div className="space-y-4">
						{mechanics.attack && (
							<div className="flex items-start gap-2">
								<Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading capitalize">
										{formatRegentVernacular(mechanics.attack.type || "")} attack
									</p>
									<p className="text-sm text-muted-foreground">
										{mechanics.attack.damage ? formatRegentVernacular(`Damage: ${typeof mechanics.attack.damage === 'string' ? mechanics.attack.damage : mechanics.attack.damage.dice}`) : "Damage varies"}
										{mechanics.attack.modifier ? formatRegentVernacular(` | Modifier: ${mechanics.attack.modifier}`) : ""}
									</p>
								</div>
							</div>
						)}
						{mechanics.saving_throw && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">
										{formatRegentVernacular(String(mechanics.saving_throw.ability || ""))} Save
									</p>
									<p className="text-sm text-muted-foreground">DC {mechanics.saving_throw.dc}</p>
									{mechanics.saving_throw.success && (
										<p className="text-xs text-muted-foreground">Success: {formatRegentVernacular(mechanics.saving_throw.success)}</p>
									)}
								</div>
							</div>
						)}
						{mechanics.movement && typeof mechanics.movement === "object" && (
							<div className="flex items-start gap-2">
								<Footprints className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading capitalize">{formatRegentVernacular(mechanics.movement.type || "")} movement</p>
									{mechanics.movement.distance !== undefined && (
										<p className="text-sm text-muted-foreground">{mechanics.movement.distance} ft</p>
									)}
								</div>
							</div>
						)}
						{Array.isArray(mechanics.condition) && mechanics.condition.length > 0 && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">Conditions</p>
									<p className="text-sm text-muted-foreground">{mechanics.condition.map(formatRegentVernacular).join(", ")}</p>
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
								<span>Recharge: {formatRegentVernacular(limitations.recharge)}</span>
							</li>
						)}
						{limitations.exhaustion && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>Exhaustion: {formatRegentVernacular(limitations.exhaustion)}</span>
							</li>
						)}
					</ul>
				</AscendantWindow>
			)}

			{(data.higher_levels || data.atHigherLevels) && (
				<AscendantWindow title="AT HIGHER TIERS">
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.higher_levels || data.atHigherLevels || ""} />
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
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">Historical Record</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
							</p>
						</div>
					)}
				</AscendantWindow>
			)}
		</div>
	);
};
