/**
 * Guarded grant-building for the Selection Protocols admin: structured grant
 * drafts (replacing the free-form JSON editor) and CSV bulk-import row
 * mapping for compendium_feature_choice_options. Pure + unit-testable.
 */

import type { Json } from "@/integrations/supabase/types";

export const GRANT_ABILITIES = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
] as const;
export type GrantAbility = (typeof GRANT_ABILITIES)[number];

export type GrantDraftType = "feature" | "feat" | "ability_increase";

export interface GrantDraft {
	type: GrantDraftType;
	/** feature/feat display name. */
	name: string;
	/** feature rules text (optional). */
	description: string;
	/** ability_increase target. */
	ability: GrantAbility;
	/** ability_increase magnitude (1–3). */
	amount: number;
}

export const emptyGrantDraft = (): GrantDraft => ({
	type: "feature",
	name: "",
	description: "",
	ability: "STR",
	amount: 1,
});

/**
 * Validate structured drafts and build the canonical `grants` JSON array the
 * character engine consumes. Returns an error message instead of throwing so
 * the form can surface it inline.
 */
export function buildGrants(drafts: ReadonlyArray<GrantDraft>): {
	grants?: Json;
	error?: string;
} {
	if (drafts.length === 0) {
		return { error: "Add at least one grant." };
	}

	const grants: Json[] = [];
	for (const [index, draft] of drafts.entries()) {
		const label = `Grant ${index + 1}`;
		if (draft.type === "feature") {
			if (!draft.name.trim()) {
				return { error: `${label}: feature name is required.` };
			}
			grants.push({
				type: "feature",
				name: draft.name.trim(),
				...(draft.description.trim()
					? { description: draft.description.trim() }
					: {}),
			});
		} else if (draft.type === "feat") {
			if (!draft.name.trim()) {
				return { error: `${label}: feat name is required.` };
			}
			grants.push({ type: "feat", name: draft.name.trim() });
		} else {
			if (!GRANT_ABILITIES.includes(draft.ability)) {
				return { error: `${label}: unknown ability "${draft.ability}".` };
			}
			if (
				!Number.isInteger(draft.amount) ||
				draft.amount < 1 ||
				draft.amount > 3
			) {
				return {
					error: `${label}: amount must be a whole number from 1 to 3.`,
				};
			}
			grants.push({
				type: "ability_increase",
				ability: draft.ability,
				amount: draft.amount,
			});
		}
	}

	return { grants: grants as Json };
}

export interface ChoiceOptionInsert {
	option_key: string;
	name: string;
	description: string | null;
	grants: Json;
}

/**
 * Map parsed CSV rows (columns: option_key, name, description, grants) to
 * insert-ready option rows. `grants` is a JSON array string; empty means no
 * grants. Row problems are collected (1 header + 1-indexed data rows) rather
 * than aborting the whole import.
 */
export function csvRowsToChoiceOptions(
	rows: ReadonlyArray<Record<string, string>>,
): { options: ChoiceOptionInsert[]; errors: string[] } {
	const options: ChoiceOptionInsert[] = [];
	const errors: string[] = [];

	rows.forEach((row, index) => {
		const line = index + 2; // header is line 1
		const optionKey = (row.option_key ?? "").trim();
		const name = (row.name ?? "").trim();
		if (!optionKey || !name) {
			errors.push(`Line ${line}: option_key and name are required.`);
			return;
		}

		let grants: Json = [];
		const rawGrants = (row.grants ?? "").trim();
		if (rawGrants) {
			try {
				const parsed = JSON.parse(rawGrants) as Json;
				if (!Array.isArray(parsed)) {
					errors.push(`Line ${line}: grants must be a JSON array.`);
					return;
				}
				grants = parsed;
			} catch {
				errors.push(`Line ${line}: grants is not valid JSON.`);
				return;
			}
		}

		options.push({
			option_key: optionKey,
			name,
			description: (row.description ?? "").trim() || null,
			grants,
		});
	});

	return { options, errors };
}
