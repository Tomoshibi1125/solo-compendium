import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";

/**
 * The canonical Job, Path, and Regent sources a Sovereign may be generated
 * from, in the exact shape the static compendium gives the app. Server
 * authority is anchored on these same ids (slugs such as "striker",
 * "striker--phantom-step", "umbral_regent"): the database catalog
 * (app_private.canonical_sovereign_sources) and the Sovereign API source
 * module (api/_sovereignSources.ts) are both generated from this list by
 * scripts/generate-sovereign-source-catalog.ts.
 */
export type SovereignSourceKind = "job" | "path" | "regent";

export interface SovereignCanonicalSource {
	kind: SovereignSourceKind;
	id: string;
	name: string;
	display_name?: string;
	title?: string;
	theme?: string;
	description?: string;
	hit_die?: number;
	primary_abilities?: string[];
	/** Owning Job id; present only for Paths. */
	job_id?: string;
}

const MAX_DESCRIPTION_LENGTH = 1800;
const MAX_LABEL_LENGTH = 320;

const text = (value: unknown, maxLength: number): string | undefined => {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed.slice(0, maxLength) : undefined;
};

const requireId = (entry: StaticCompendiumEntry, kind: string): string => {
	const id = typeof entry.id === "string" ? entry.id.trim() : "";
	if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(id)) {
		throw new Error(`Invalid ${kind} id for Sovereign sources: ${entry.id}`);
	}
	return id;
};

function toSource(
	kind: SovereignSourceKind,
	entry: StaticCompendiumEntry,
): SovereignCanonicalSource {
	const record = entry as StaticCompendiumEntry & Record<string, unknown>;
	const source: SovereignCanonicalSource = {
		kind,
		id: requireId(entry, kind),
		name: text(entry.name, MAX_LABEL_LENGTH) ?? requireId(entry, kind),
	};
	const displayName = text(entry.display_name, MAX_LABEL_LENGTH);
	if (displayName && displayName !== source.name) {
		source.display_name = displayName;
	}
	const title = text(record.title, MAX_LABEL_LENGTH);
	if (title) source.title = title;
	const theme = text(record.theme, MAX_LABEL_LENGTH);
	if (theme) source.theme = theme;
	const description = text(entry.description, MAX_DESCRIPTION_LENGTH);
	if (description) source.description = description;
	if (kind === "job") {
		if (typeof record.hit_die === "number" && record.hit_die > 0) {
			source.hit_die = record.hit_die;
		}
		if (Array.isArray(record.primary_abilities)) {
			const abilities = record.primary_abilities.filter(
				(value): value is string => typeof value === "string",
			);
			if (abilities.length > 0)
				source.primary_abilities = abilities.slice(0, 6);
		}
	}
	if (kind === "path") {
		const jobId = text(record.job_id, 128);
		if (!jobId) throw new Error(`Path ${source.id} has no owning job`);
		source.job_id = jobId;
	}
	return source;
}

const byId = (a: SovereignCanonicalSource, b: SovereignCanonicalSource) =>
	a.id.localeCompare(b.id);

/** Build the ordered source list (jobs, then paths, then Regents). */
export function buildSovereignSourceCatalog(input: {
	jobs: readonly StaticCompendiumEntry[];
	paths: readonly StaticCompendiumEntry[];
	regents: readonly StaticCompendiumEntry[];
}): SovereignCanonicalSource[] {
	const jobs = input.jobs.map((entry) => toSource("job", entry)).sort(byId);
	const jobIds = new Set(jobs.map((job) => job.id));
	const paths = input.paths.map((entry) => toSource("path", entry)).sort(byId);
	for (const path of paths) {
		if (!path.job_id || !jobIds.has(path.job_id)) {
			throw new Error(`Path ${path.id} names an unknown job ${path.job_id}`);
		}
	}
	const regents = input.regents
		.map((entry) => toSource("regent", entry))
		.sort(byId);
	const all = [...jobs, ...paths, ...regents];
	const seen = new Set<string>();
	for (const source of all) {
		const key = `${source.kind}:${source.id}`;
		if (seen.has(key)) throw new Error(`Duplicate Sovereign source ${key}`);
		seen.add(key);
	}
	return all;
}
