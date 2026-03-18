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
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

interface SpellData {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	spell_type?: string | null;
	rank?: string | null;
	effect?: string | null;
	range?: number | { type?: string; distance?: number } | null;
	activation?: { type?: string; cost?: string } | null;
	duration?: { type?: string; time?: string } | null;
	components?: {
		verbal?: boolean;
		somatic?: boolean;
		material?: boolean;
		material_desc?: string;
	} | null;
	effects?: { primary?: string; secondary?: string; tertiary?: string } | null;
	mechanics?: {
		attack?: { type?: string; modifier?: string; damage?: string };
		saving_throw?: {
			ability?: string;
			dc?: string;
			success?: string;
			failure?: string;
		};
		movement?: { type?: string; distance?: number };
		condition?: string[];
	} | null;
	limitations?: {
		uses?: string;
		cooldown?: string;
		conditions?: string[];
		exhaustion?: string;
	} | null;
	flavor?: string | null;
	higher_levels?: string | null;
	atHigherLevels?: string | null;
	source_book?: string | null;
	image_url?: string | null;
	image?: string | null;
}

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

	const componentFlags = [
		components?.verbal ? "V" : null,
		components?.somatic ? "S" : null,
		components?.material ? "M" : null,
	].filter(Boolean);

	const renderRange = () => {
		if (typeof range === "number") return `${range} ft`;
		if (range && typeof range === "object") {
			const type = typeof range.type === "string" ? range.type : "";
			const dist =
				typeof range.distance === "number" ? `${range.distance} ft` : "";
			return [type, dist].filter(Boolean).join(" ");
		}
		return null;
	};

	const rangeText = renderRange();

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
		const mechanicsAny = (data.mechanics ?? null) as Record<string, unknown>;

		const id = crypto.randomUUID();
		const name = displayName;

		const damageRoll =
			typeof (mechanicsAny?.attack as Record<string, unknown>)?.damage ===
			"string"
				? (mechanicsAny.attack as Record<string, unknown>).damage
				: null;

		const healingRoll =
			typeof (mechanicsAny?.healing as Record<string, unknown>)?.dice ===
			"string"
				? (mechanicsAny.healing as Record<string, unknown>).dice
				: null;

		if (mechanicsAny?.attack) {
			const bonus = rankBonus(data.rank);
			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "attack",
				attack: { roll: `1d20+${bonus}` },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: Array.isArray(mechanicsAny?.condition)
					? mechanicsAny.condition
					: undefined,
			};
		}

		if (mechanicsAny?.saving_throw) {
			const dc =
				typeof (mechanicsAny.saving_throw as Record<string, unknown>).dc ===
				"number"
					? ((mechanicsAny.saving_throw as Record<string, unknown>)
							.dc as number)
					: rankSaveDC(data.rank);

			const ability =
				typeof (mechanicsAny.saving_throw as Record<string, unknown>)
					.ability === "string"
					? ((mechanicsAny.saving_throw as Record<string, unknown>)
							.ability as string)
					: undefined;

			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "save",
				save: { dc, ability, roll: "1d20" },
				damage: damageRoll ? { roll: String(damageRoll) } : undefined,
				appliesConditions: Array.isArray(mechanicsAny?.condition)
					? mechanicsAny.condition
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

		if (damageRoll) {
			return {
				version: 1,
				id,
				name,
				source: { type: "spell", entryId: data.id },
				kind: "damage",
				damage: { roll: String(damageRoll) },
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
							<Sparkles className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			<SystemWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Spell" itemName={displayName} />}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{data.spell_type && (
							<Badge variant="secondary">
								{formatRegentVernacular(data.spell_type)}
							</Badge>
						)}
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
								queueResolutionAndNavigate("/dm-tools/initiative-tracker")
							}
						>
							Resolve in Initiative
						</Button>
					</div>
				</div>
			</SystemWindow>

			<div
				id="spell-stats"
				className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4"
			>
				{rangeText && (
					<SystemWindow title="RANGE" compact>
						<div className="flex items-center gap-2">
							<Target className="w-5 h-5 text-emerald-400" />
							<span className="font-heading">
								{formatRegentVernacular(rangeText)}
							</span>
						</div>
					</SystemWindow>
				)}
			</div>

			{(activation || duration || components) && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{activation && (
						<SystemWindow title="ACTIVATION" compact>
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(activation.type || "action")}
								</span>
							</div>
							{activation.cost && (
								<span className="text-xs text-muted-foreground">
									{formatRegentVernacular(activation.cost)}
								</span>
							)}
						</SystemWindow>
					)}
					{duration && (
						<SystemWindow title="DURATION" compact>
							<div className="flex items-center gap-2">
								<Timer className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(duration.type || "instantaneous")}
								</span>
							</div>
							{duration.time && (
								<span className="text-xs text-muted-foreground">
									{formatRegentVernacular(duration.time)}
								</span>
							)}
						</SystemWindow>
					)}
					{components && (
						<SystemWindow title="COMPONENTS" compact>
							<div className="flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-primary" />
								<span className="font-heading">
									{componentFlags.join(", ") || "None"}
								</span>
							</div>
							{components.material_desc && (
								<span className="text-xs text-muted-foreground">
									{formatRegentVernacular(components.material_desc)}
								</span>
							)}
						</SystemWindow>
					)}
				</div>
			)}

			{effects && (
				<SystemWindow title="EFFECTS">
					<div className="space-y-3">
						{effects.primary && (
							<p className="text-foreground leading-relaxed">
								{formatRegentVernacular(effects.primary)}
							</p>
						)}
						{effects.secondary && (
							<p className="text-muted-foreground leading-relaxed">
								{formatRegentVernacular(effects.secondary)}
							</p>
						)}
						{effects.tertiary && (
							<p className="text-muted-foreground leading-relaxed">
								{formatRegentVernacular(effects.tertiary)}
							</p>
						)}
					</div>
				</SystemWindow>
			)}

			{mechanics && (
				<SystemWindow title="MECHANICS">
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
													`Damage: ${mechanics.attack.damage}`,
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
											mechanics.saving_throw.ability || "",
										)}{" "}
										Save
									</p>
									<p className="text-sm text-muted-foreground">
										DC {formatRegentVernacular(mechanics.saving_throw.dc || "")}
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
						{mechanics.movement && (
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
						{mechanics.condition && mechanics.condition.length > 0 && (
							<div className="flex items-start gap-2">
								<Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-heading">Conditions</p>
									<p className="text-sm text-muted-foreground">
										{mechanics.condition.map(formatRegentVernacular).join(", ")}
									</p>
								</div>
							</div>
						)}
					</div>
				</SystemWindow>
			)}

			{limitations && (
				<SystemWindow title="LIMITATIONS">
					<ul className="space-y-2 text-sm">
						{limitations.uses && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>Uses: {formatRegentVernacular(limitations.uses)}</span>
							</li>
						)}
						{limitations.cooldown && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Cooldown: {formatRegentVernacular(limitations.cooldown)}
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
						{limitations.conditions && limitations.conditions.length > 0 && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Conditions:{" "}
									{limitations.conditions
										.map(formatRegentVernacular)
										.join(", ")}
								</span>
							</li>
						)}
					</ul>
				</SystemWindow>
			)}

			{data.effect && (
				<SystemWindow id="spell-effect" title="EFFECT">
					<p className="text-foreground leading-relaxed">
						{formatRegentVernacular(data.effect)}
					</p>
				</SystemWindow>
			)}

			{(data.higher_levels || data.atHigherLevels) && (
				<SystemWindow title="AT HIGHER TIERS">
					<p className="text-foreground leading-relaxed">
						{formatRegentVernacular(
							data.higher_levels || data.atHigherLevels || "",
						)}
					</p>
				</SystemWindow>
			)}

			{data.flavor && (
				<SystemWindow title="FLAVOR">
					<p className="text-sm text-muted-foreground italic">
						{formatRegentVernacular(data.flavor)}
					</p>
				</SystemWindow>
			)}

			{data.description && (
				<SystemWindow id="spell-description" title="DESCRIPTION">
					<p className="text-foreground leading-relaxed">
						{formatRegentVernacular(data.description)}
					</p>
				</SystemWindow>
			)}
		</div>
	);
};
