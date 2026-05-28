import { useQuery } from "@tanstack/react-query";
import { Clock, Moon, Sun, Sunrise } from "lucide-react";
import { useMemo } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCharacter } from "@/hooks/useCharacters";
import { getStaticRegents } from "@/lib/ProtocolDataManager";
import { cn } from "@/lib/utils";

type Frequency =
	| "at-will"
	| "short-rest"
	| "long-rest"
	| "once-per-day"
	| "once-per-long-rest";

interface LimitedUseEntry {
	id: string;
	name: string;
	description: string;
	source: string;
	frequency: Frequency;
	level?: number;
}

const RESTING_FREQUENCIES = new Set<Frequency>([
	"short-rest",
	"long-rest",
	"once-per-day",
	"once-per-long-rest",
]);

function normalizeFrequency(value: unknown): Frequency | null {
	if (typeof value !== "string") return null;
	const v = value.toLowerCase().replace(/\s+/g, "-");
	if (RESTING_FREQUENCIES.has(v as Frequency)) return v as Frequency;
	if (v === "at-will") return "at-will";
	return null;
}

interface LimitedUseAggregatorProps {
	characterId: string;
	className?: string;
}

const normalize = (value: string | null | undefined): string =>
	(value ?? "").trim().toLowerCase();

const FREQUENCY_ICON: Record<Frequency, typeof Clock> = {
	"short-rest": Sunrise,
	"long-rest": Moon,
	"once-per-day": Sun,
	"once-per-long-rest": Moon,
	"at-will": Clock,
};

const FREQUENCY_LABEL: Record<Frequency, string> = {
	"short-rest": "Short Rest",
	"long-rest": "Long Rest",
	"once-per-day": "Once / Day",
	"once-per-long-rest": "Long Rest",
	"at-will": "At Will",
};

export function LimitedUseAggregator({
	characterId,
	className,
}: LimitedUseAggregatorProps) {
	const { data: character } = useCharacter(characterId);
	const characterLevel = character?.level ?? 1;

	const { data: jobs } = useQuery({
		queryKey: ["static-jobs-limited-use"],
		queryFn: async () => {
			const module = await import("@/data/compendium/jobs");
			return module.jobs;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!character?.job,
	});

	const { data: paths } = useQuery({
		queryKey: ["static-paths-limited-use"],
		queryFn: async () => {
			const module = await import("@/data/compendium/paths");
			return module.paths;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!character?.path,
	});

	const entries = useMemo<LimitedUseEntry[]>(() => {
		if (!character) return [];
		const collected: LimitedUseEntry[] = [];

		// 1. Job traits with frequency.
		const job = jobs?.find(
			(j) => normalize(j.name) === normalize(character.job),
		);
		if (job) {
			for (const trait of job.jobTraits ?? []) {
				const freq = normalizeFrequency(trait.frequency);
				if (!freq || freq === "at-will") continue;
				collected.push({
					id: `job-trait:${trait.name}`,
					name: trait.name,
					description: trait.description,
					source: `Job: ${job.name}`,
					frequency: freq,
				});
			}
			// 2. Class features whose description mentions rest cadence (best-effort
			// surface — already covered by other panels if structured frequency
			// is absent).
			for (const feature of job.classFeatures ?? []) {
				if (feature.level > characterLevel) continue;
				const lower = (feature.description ?? "").toLowerCase();
				let freq: Frequency | null = null;
				if (lower.includes("once per long rest")) freq = "long-rest";
				else if (lower.includes("once per short rest")) freq = "short-rest";
				else if (lower.includes("once per day")) freq = "once-per-day";
				if (!freq) continue;
				collected.push({
					id: `job-feature:${feature.name}`,
					name: feature.name,
					description: feature.description,
					source: `Job: ${job.name}`,
					frequency: freq,
					level: feature.level,
				});
			}
		}

		// 3. Path abilities with recharge.
		const path = paths?.find(
			(p) => normalize(p.name) === normalize(character.path),
		);
		if (path) {
			for (const ability of path.abilities ?? []) {
				const recharge = ability.recharge;
				const lower = (ability.description ?? "").toLowerCase();
				let freq: Frequency | null = null;
				if (typeof recharge === "number") {
					// Numeric recharge (5-6 style) — treat as short rest.
					freq = "short-rest";
				} else if (lower.includes("long rest")) freq = "long-rest";
				else if (lower.includes("short rest")) freq = "short-rest";
				if (!freq) continue;
				collected.push({
					id: `path-ability:${ability.name}`,
					name: ability.name,
					description: ability.description,
					source: `Path: ${path.name}`,
					frequency: freq,
				});
			}
		}

		// 4. Regent class_features / abilities with frequency.
		const overlays = Array.isArray(
			(character as { regent_overlays?: string[] }).regent_overlays,
		)
			? ((character as { regent_overlays?: string[] })
					.regent_overlays as string[])
			: [];
		if (overlays.length > 0) {
			const regents = getStaticRegents().filter((r) => overlays.includes(r.id));
			for (const regent of regents) {
				// Static regents carry abilities/features that the supabase shape
				// doesn't surface — cast to read them.
				const extended = regent as typeof regent & {
					abilities?: Array<{
						name: string;
						description: string;
						frequency?: string;
					}>;
				};
				for (const feature of regent.class_features ?? []) {
					if (feature.level && feature.level > characterLevel) continue;
					const freq = normalizeFrequency(feature.frequency);
					if (!freq || freq === "at-will") continue;
					collected.push({
						id: `regent-feature:${regent.id}:${feature.name}`,
						name: feature.name,
						description: feature.description,
						source: `Regent: ${regent.name}`,
						frequency: freq,
						level: feature.level,
					});
				}
				for (const ability of extended.abilities ?? []) {
					const freq = normalizeFrequency(ability.frequency);
					if (!freq || freq === "at-will") continue;
					collected.push({
						id: `regent-ability:${regent.id}:${ability.name}`,
						name: ability.name,
						description: ability.description,
						source: `Regent: ${regent.name}`,
						frequency: freq,
					});
				}
			}
		}

		// De-dupe by id.
		const seen = new Set<string>();
		return collected.filter((entry) => {
			if (seen.has(entry.id)) return false;
			seen.add(entry.id);
			return true;
		});
	}, [character, jobs, paths, characterLevel]);

	const grouped = useMemo(() => {
		const buckets: Record<Frequency, LimitedUseEntry[]> = {
			"short-rest": [],
			"long-rest": [],
			"once-per-day": [],
			"once-per-long-rest": [],
			"at-will": [],
		};
		for (const entry of entries) {
			buckets[entry.frequency].push(entry);
		}
		return buckets;
	}, [entries]);

	const totalLimited =
		grouped["short-rest"].length +
		grouped["long-rest"].length +
		grouped["once-per-day"].length +
		grouped["once-per-long-rest"].length;

	if (totalLimited === 0) {
		return null;
	}

	const renderBucket = (frequency: Frequency, label: string) => {
		const bucket = grouped[frequency];
		if (bucket.length === 0) return null;
		const Icon = FREQUENCY_ICON[frequency];
		return (
			<div key={frequency} className="space-y-2">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
					<Icon className="w-3 h-3" />
					{label}
					<Badge variant="outline" className="text-xs">
						{bucket.length}
					</Badge>
				</div>
				<div className="space-y-2">
					{bucket.map((entry) => (
						<div key={entry.id} className="p-2 rounded border bg-muted/20">
							<div className="flex items-center gap-2 mb-1 flex-wrap">
								<span className="font-medium text-sm">{entry.name}</span>
								<Badge variant="secondary" className="text-xs">
									{entry.source}
								</Badge>
								{entry.level !== undefined && (
									<Badge variant="outline" className="text-xs">
										Lvl {entry.level}
									</Badge>
								)}
							</div>
							<div className="text-xs text-muted-foreground line-clamp-2">
								<AutoLinkText text={entry.description} />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Clock className="w-4 h-4" />
					Limited Use
					<Badge variant="outline" className="text-xs ml-auto">
						{totalLimited}
					</Badge>
				</CardTitle>
				<CardDescription className="text-xs">
					Features that recharge on rest. Toggle uses on the dedicated trackers
					when you spend them.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{renderBucket("short-rest", FREQUENCY_LABEL["short-rest"])}
				{renderBucket("long-rest", FREQUENCY_LABEL["long-rest"])}
				{renderBucket("once-per-long-rest", "Long Rest (Once)")}
				{renderBucket("once-per-day", FREQUENCY_LABEL["once-per-day"])}
			</CardContent>
		</Card>
	);
}
