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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

interface TechniqueData {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	technique_type?: string | null;
	style?: string | null;
	prerequisites?: {
		level?: number;
		class?: string;
		ability?: string;
		score?: number;
		proficiency?: string[];
		technique?: string[];
	} | null;
	activation?: { type?: string; cost?: string } | null;
	duration?: { type?: string; time?: string } | null;
	range?: { type?: string; distance?: number } | null;
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
	source_book?: string | null;
	image_url?: string | null;
	image?: string | null;
}

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

	const componentFlags = [
		components?.verbal ? "V" : null,
		components?.somatic ? "S" : null,
		components?.material ? "M" : null,
	].filter(Boolean);

	const buildResolutionPayload = (): ActionResolutionPayload | null => {
		const id = crypto.randomUUID();
		const name = displayName;

		const parseBonus = (value: unknown): number | null => {
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

		const conditions = Array.isArray(mechanics?.condition)
			? mechanics?.condition
			: undefined;

		if (mechanics?.attack) {
			const bonus = parseBonus(mechanics.attack.modifier);
			const attackRoll =
				bonus !== null ? `1d20${bonus >= 0 ? "+" : ""}${bonus}` : "1d20";
			const damageRoll =
				typeof mechanics.attack.damage === "string"
					? mechanics.attack.damage
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

		if (mechanics?.saving_throw) {
			const dc = parseDc(mechanics.saving_throw.dc) ?? 10;
			const ability =
				typeof mechanics.saving_throw.ability === "string"
					? mechanics.saving_throw.ability
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

			<SystemWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{data.technique_type && (
							<Badge variant="secondary">
								{formatRegentVernacular(data.technique_type)}
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
									queueResolutionAndNavigate("/dm-tools/initiative-tracker")
								}
							>
								Resolve in Initiative
							</Button>
						</div>
					)}
				</div>
			</SystemWindow>

			{(activation || duration || range || components) && (
				<div
					id="technique-activation"
					className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4"
				>
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
									{formatRegentVernacular(duration.type || "instant")}
								</span>
							</div>
							{duration.time && (
								<span className="text-xs text-muted-foreground">
									{formatRegentVernacular(duration.time)}
								</span>
							)}
						</SystemWindow>
					)}
					{range && (
						<SystemWindow title="RANGE" compact>
							<div className="flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								<span className="font-heading capitalize">
									{formatRegentVernacular(range.type || "melee")}
								</span>
							</div>
							{range.distance !== undefined && (
								<span className="text-xs text-muted-foreground">
									{range.distance} ft
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

			{prereq && (
				<SystemWindow title="PREREQUISITES">
					<ul className="space-y-2 text-sm">
						{prereq.level !== undefined && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>Level {prereq.level}</span>
							</li>
						)}
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
				</SystemWindow>
			)}

			{effects && (
				<SystemWindow id="technique-effects" title="EFFECTS">
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
				<SystemWindow id="technique-mechanics" title="MECHANICS">
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

			{(data.description || data.flavor) && (
				<SystemWindow id="technique-description" title="DESCRIPTION">
					<div className="space-y-3">
						{data.description && (
							<p className="text-foreground leading-relaxed">
								{formatRegentVernacular(data.description)}
							</p>
						)}
						{data.flavor && (
							<p className="text-sm text-muted-foreground italic">
								{formatRegentVernacular(data.flavor)}
							</p>
						)}
					</div>
				</SystemWindow>
			)}
		</div>
	);
};
