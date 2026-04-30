import {
	type CanonicalReferenceLookup,
	resolveCanonicalCastableReference,
} from "@/lib/canonicalCompendium";

export interface NormalizedSpellReference {
	spell_id: string | null;
	matchedBy: "id" | "name" | "none";
}

export async function normalizeSpellReference(
	ref: CanonicalReferenceLookup,
): Promise<NormalizedSpellReference> {
	const resolution = await resolveCanonicalCastableReference(ref, undefined, [
		"spells",
	]);

	return {
		spell_id: resolution.entry?.id ?? null,
		matchedBy: resolution.matchedBy,
	};
}
