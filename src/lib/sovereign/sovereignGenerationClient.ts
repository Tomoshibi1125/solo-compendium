import { supabase } from "@/integrations/supabase/client";
import type {
	FusionAbility,
	GeneratedSovereign,
	Job,
	Path,
	Regent,
} from "@/lib/geminiProtocol";
import {
	readSovereignDefinition,
	type SovereignV2Definition,
} from "@/lib/sovereign/sovereignV2Contract";

export interface GeneratedSovereignV2Draft extends GeneratedSovereign {
	schema_version: 2;
	definition: SovereignV2Definition;
	saved_sovereign_id: string;
	generation_operation_id: string;
}

interface EndpointResponse {
	success?: boolean;
	reused?: boolean;
	sovereignId?: string;
	definition?: unknown;
	error?: string;
	details?: unknown;
}

const sourceDisplayName = (
	source: SovereignV2Definition["abilities"][number]["ancestry"][number],
	input: { job: Job; path: Path; regentA: Regent; regentB: Regent },
): string => {
	switch (source) {
		case "job":
			return input.job.name;
		case "path":
			return input.path.name;
		case "regent-a":
			return input.regentA.name;
		case "regent-b":
			return input.regentB.name;
	}
};

const toLegacyDisplayAbility = (
	ability: SovereignV2Definition["abilities"][number],
	input: { job: Job; path: Path; regentA: Regent; regentB: Regent },
): FusionAbility => ({
	name: ability.name,
	description: ability.description,
	level: ability.level,
	action_type: ability.action_type,
	recharge: ability.recharge,
	is_capstone: ability.is_capstone,
	origin_sources: ability.ancestry.map((source) => sourceDisplayName(source, input)),
	fusion_type: "unified",
});

function fallbackStableHash(value: string): string {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Stable per-source operation ID. Reopening the page and retrying the same
 * four-source generation addresses the same durable draft instead of paying
 * for another provider request or creating a duplicate row.
 */
export async function createSovereignGenerationOperationId(input: {
	jobId: string;
	pathId: string;
	regentAId: string;
	regentBId: string;
}): Promise<string> {
	const seed = [input.jobId, input.pathId, input.regentAId, input.regentBId].join("|");
	const bytes = new TextEncoder().encode(seed);
	if (globalThis.crypto?.subtle) {
		const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
		const hex = Array.from(new Uint8Array(digest))
			.map((value) => value.toString(16).padStart(2, "0"))
			.join("")
			.slice(0, 32);
		return `sovgen-${hex}`;
	}
	return `sovgen-${fallbackStableHash(seed)}`;
}

function endpointError(response: EndpointResponse, status: number): Error {
	const detail = Array.isArray(response.details)
		? response.details.join("; ")
		: typeof response.details === "string"
			? response.details
			: "";
	return new Error(
		[response.error || `Sovereign generation failed (${status})`, detail]
			.filter(Boolean)
			.join(": "),
	);
}

/**
 * The only client path for built-in Sovereign AI generation. The browser sends
 * source IDs and an idempotency operation ID only; provider prompts, models,
 * canonical source resolution, validation and durable save are server-owned.
 */
export async function generateSovereignWithAI(
	job: Job,
	path: Path,
	regentA: Regent,
	regentB: Regent,
	operationId?: string,
): Promise<GeneratedSovereignV2Draft> {
	const resolvedOperationId =
		operationId ??
		(await createSovereignGenerationOperationId({
			jobId: String(job.id),
			pathId: String(path.id),
			regentAId: String(regentA.id),
			regentBId: String(regentB.id),
		}));

	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession();
	if (sessionError || !session?.access_token) {
		throw new Error("Sign in before generating a Sovereign");
	}

	const response = await fetch("/api/sovereign", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${session.access_token}`,
		},
		body: JSON.stringify({
			jobId: String(job.id),
			pathId: String(path.id),
			regentAId: String(regentA.id),
			regentBId: String(regentB.id),
			operationId: resolvedOperationId,
		}),
	});

	let payload: EndpointResponse = {};
	try {
		payload = (await response.json()) as EndpointResponse;
	} catch {
		// Preserve the HTTP status in the explicit error below.
	}
	if (!response.ok || !payload.success) {
		throw endpointError(payload, response.status);
	}
	if (typeof payload.sovereignId !== "string" || !payload.sovereignId) {
		throw new Error("Sovereign endpoint did not return the saved draft ID");
	}

	const read = readSovereignDefinition(payload.definition);
	if (!read.ok || read.kind !== "v2") {
		throw new Error(
			read.ok
				? "Sovereign endpoint returned a legacy definition"
				: `Sovereign endpoint returned an invalid definition: ${read.errors.join("; ")}`,
		);
	}
	const definition = read.definition;
	const expectedSources = definition.generation.source_ids;
	if (
		expectedSources.job !== String(job.id) ||
		expectedSources.path !== String(path.id) ||
		expectedSources.regent_a !== String(regentA.id) ||
		expectedSources.regent_b !== String(regentB.id)
	) {
		throw new Error("Sovereign endpoint returned mismatched canonical sources");
	}

	return {
		name: definition.identity.name,
		title: definition.identity.title,
		description: definition.description,
		fusion_theme: definition.fusion_theme,
		fusion_description: definition.combat_doctrine,
		fusion_method: `Gemini Protocol (${definition.generation.generator})`,
		abilities: definition.abilities.map((ability) =>
			toLegacyDisplayAbility(ability, { job, path, regentA, regentB }),
		),
		job,
		path,
		regentA,
		regentB,
		// v2 deliberately does not define these legacy labels. They exist only
		// to keep the current preview card shape renderable and are never written
		// back into the authoritative v2 definition.
		power_multiplier: "Versioned v2 mechanics",
		fusion_stability: "Validated v2 definition",
		schema_version: 2,
		definition,
		saved_sovereign_id: payload.sovereignId,
		generation_operation_id: resolvedOperationId,
	};
}

export function isGeneratedSovereignV2Draft(
	sovereign: GeneratedSovereign,
): sovereign is GeneratedSovereignV2Draft {
	const candidate = sovereign as Partial<GeneratedSovereignV2Draft>;
	return (
		candidate.schema_version === 2 &&
		typeof candidate.saved_sovereign_id === "string" &&
		!!candidate.saved_sovereign_id &&
		!!candidate.definition
	);
}
