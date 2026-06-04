import {
	Crosshair,
	Flame,
	Gauge,
	Music,
	Radio,
	Skull,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useTrackedResources } from "@/hooks/useTrackedResources";
import { getAbilityModifier, getProficiencyBonus } from "@/lib/5eRulesEngine";
import {
	createClassFeatureResource,
	type TrackedResource,
} from "@/lib/resourceTracking";
import { cn } from "@/lib/utils";

interface JobResourceDef {
	jobMatch: (job: string) => boolean;
	id: string;
	label: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	maxFromCharacter: (character: {
		level?: number | null;
		strength?: number | null;
		agility?: number | null;
		vitality?: number | null;
		presence?: number | null;
		intelligence?: number | null;
		sense?: number | null;
	}) => number;
	recovery: "short-rest" | "long-rest";
}

const mod = (score: number | null | undefined): number =>
	getAbilityModifier(score ?? 10);

// Job-specific resource catalog. The formulas mirror what's described in the
// job's class features prose; users can adjust max manually after creation.
const JOB_RESOURCES: JobResourceDef[] = [
	{
		jobMatch: (job) => job.toLowerCase() === "esper",
		id: "flux-pool",
		label: "Flux Pool",
		description:
			"Internal mana reactor. Overcharge spells, absorb slots into flux, or manifest slots from flux.",
		icon: Zap,
		maxFromCharacter: (c) => Math.max(1, c.level ?? 1),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "idol",
		id: "hype-dice",
		label: "Hype Dice",
		description:
			"Amplifying frequency broadcast. Grant a hype die to allies' rolls.",
		icon: Music,
		maxFromCharacter: (c) => Math.max(1, mod(c.presence)),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "herald",
		id: "mantra-reservoir",
		label: "Mantra Reservoir",
		description:
			"Reservoir of Absolute resonance — spend to restore HP or grant resistance.",
		icon: Radio,
		maxFromCharacter: (c) => Math.max(1, (c.level ?? 1) * 5),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "revenant",
		id: "remnant-pool",
		label: "Remnants",
		description:
			"Severed life-essence reclaimed at the instant of death under Marthos's End-Cycle mandate. Spend to heal, gain temporary HP, blunt incoming damage, reroll a failed save, or refuse death.",
		icon: Skull,
		maxFromCharacter: (c) => {
			const lvl = c.level ?? 1;
			const prof = getProficiencyBonus(lvl);
			return Math.max(1, mod(c.intelligence) + prof);
		},
		recovery: "long-rest",
	},
	{
		jobMatch: (job) => job.toLowerCase() === "summoner",
		id: "biome-charges",
		label: "Biome Command",
		description: "Reshape local environment in a 60-ft radius.",
		icon: Sparkles,
		maxFromCharacter: (c) => ((c.level ?? 1) >= 14 ? 2 : 1),
		recovery: "long-rest",
	},
	{
		jobMatch: (job) =>
			job.toLowerCase() === "holy-knight" ||
			job.toLowerCase() === "holy knight",
		id: "oath-channel",
		label: "Channel Oath",
		description: "Once per short rest, invoke your oath's authority.",
		icon: Flame,
		maxFromCharacter: () => 1,
		recovery: "short-rest",
	},
	{
		// Berserker — Overload State (2/long rest, scaling toward unlimited at
		// 20th per the class feature). Stored Feedback rides on top in play.
		jobMatch: (job) => job.toLowerCase() === "berserker",
		id: "overload-charges",
		label: "Overload",
		description:
			"Trigger an Absolute Surge: melee bonus, damage resistance, and temporary HP while overloaded. Stored Feedback releases on your next hit.",
		icon: Flame,
		maxFromCharacter: (c) => {
			const lvl = c.level ?? 1;
			if (lvl >= 20) return 99;
			return lvl >= 17 ? 4 : lvl >= 6 ? 3 : 2;
		},
		recovery: "long-rest",
	},
	{
		// Striker — Impulse points = Striker level, recharged on a short rest
		// (Rite of Speed / Force / Iron each spend 1).
		jobMatch: (job) => job.toLowerCase() === "striker",
		id: "impulse-points",
		label: "Impulse Points",
		description:
			"Channel kinetic mana through your nerve gates — spend on Rites of Speed, Force, or Iron.",
		icon: Gauge,
		maxFromCharacter: (c) => Math.max(1, c.level ?? 1),
		recovery: "short-rest",
	},
	{
		// Destroyer — Adrenaline (Adrenal Flux / Adrenaline Burst, recovered on a
		// short rest). Proficiency-bonus uses approximates the once/short-rest
		// surge that scales with tier.
		jobMatch: (job) => job.toLowerCase() === "destroyer",
		id: "adrenaline-surge",
		label: "Adrenaline",
		description:
			"Overclock your mana-fueled adrenal core: surge damage and absorb impact as built-in spirit armor.",
		icon: Zap,
		maxFromCharacter: (c) => 2 + Math.floor(((c.level ?? 1) - 1) / 4),
		recovery: "short-rest",
	},
	{
		// Assassin — Killing Focus. The class has no single named pool; this
		// models the Aetheric-Mark / Essence-Harvest economy as an AGI-scaled
		// short-rest focus (flagged for review).
		jobMatch: (job) => job.toLowerCase() === "assassin",
		id: "killing-focus",
		label: "Killing Focus",
		description:
			"Predatory focus spent to apply Aetheric Marks and convert kills into renewed lethality.",
		icon: Crosshair,
		maxFromCharacter: (c) => Math.max(1, mod(c.agility)),
		recovery: "short-rest",
	},
];

interface JobResourcePoolsProps {
	characterId: string;
	className?: string;
}

const normalize = (value: string | null | undefined): string =>
	(value ?? "").trim();

export function JobResourcePools({
	characterId,
	className,
}: JobResourcePoolsProps) {
	const { data: character } = useCharacter(characterId);
	const { resources, setResources } = useTrackedResources(characterId);
	const { toast } = useToast();

	const job = normalize(character?.job);

	const applicableResources = useMemo(() => {
		if (!job) return [];
		return JOB_RESOURCES.filter((def) => def.jobMatch(job));
	}, [job]);

	if (!character || applicableResources.length === 0) {
		return null;
	}

	const existingByLabel = new Map(
		resources.map((r) => [r.name.toLowerCase(), r] as const),
	);

	const handleCreate = (def: JobResourceDef) => {
		const max = def.maxFromCharacter({
			level: character.level,
			strength: (character as { strength?: number | null }).strength,
			agility: (character as { agility?: number | null }).agility,
			vitality: (character as { vitality?: number | null }).vitality,
			presence: (character as { presence?: number | null }).presence,
			intelligence: (character as { intelligence?: number | null })
				.intelligence,
			sense: (character as { sense?: number | null }).sense,
		});
		const resource = createClassFeatureResource(def.label, max, def.recovery);
		setResources([...resources, resource]);
		toast({
			title: `${def.label} created`,
			description: `Max ${max}, recharges on ${def.recovery.replace("-", " ")}.`,
		});
	};

	const adjustCurrent = (resource: TrackedResource, delta: number) => {
		const max = resource.max ?? resource.current + Math.abs(delta);
		const next = Math.max(0, Math.min(max, resource.current + delta));
		const updated: TrackedResource = { ...resource, current: next };
		setResources(resources.map((r) => (r.id === resource.id ? updated : r)));
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Zap className="w-4 h-4" />
					{character.job} Resources
				</CardTitle>
				<CardDescription className="text-xs">
					Job-specific pools that recharge on rest.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{applicableResources.map((def) => {
					const existing = existingByLabel.get(def.label.toLowerCase());
					const Icon = def.icon;
					if (!existing) {
						return (
							<div
								key={def.id}
								className="p-3 rounded-lg border border-dashed bg-muted/20"
							>
								<div className="flex items-start gap-2 mb-1">
									<Icon className="w-4 h-4 text-primary mt-0.5" />
									<div className="flex-1">
										<div className="font-medium text-sm">{def.label}</div>
										<p className="text-xs text-muted-foreground">
											{def.description}
										</p>
									</div>
									<Button size="sm" onClick={() => handleCreate(def)}>
										Enable
									</Button>
								</div>
							</div>
						);
					}
					return (
						<div key={def.id} className="p-3 rounded-lg border bg-background">
							<div className="flex items-center gap-2 mb-2">
								<Icon className="w-4 h-4 text-primary" />
								<span className="font-medium text-sm flex-1">{def.label}</span>
								<Badge variant="outline" className="text-xs">
									{existing.current} / {existing.max ?? "—"}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => adjustCurrent(existing, -1)}
									disabled={existing.current <= 0}
								>
									-1
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => adjustCurrent(existing, 1)}
									disabled={
										existing.max !== null && existing.current >= existing.max
									}
								>
									+1
								</Button>
								<span className="text-xs text-muted-foreground ml-auto">
									{def.recovery.replace("-", " ")}
								</span>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
