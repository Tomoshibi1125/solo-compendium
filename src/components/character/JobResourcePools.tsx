import { Flame, Music, Radio, Skull, Sparkles, Zap } from "lucide-react";
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
		presence?: number | null;
		intelligence?: number | null;
		sense?: number | null;
	}) => number;
	recovery: "short-rest" | "long-rest";
}

const mod = (score: number | null | undefined): number =>
	Math.floor(((score ?? 10) - 10) / 2);

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
		id: "harvest-pool",
		label: "Reaper's Harvest",
		description: "Temp HP banked from creatures falling near you.",
		icon: Skull,
		maxFromCharacter: (c) => Math.max(1, (c.level ?? 1) + mod(c.intelligence)),
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
