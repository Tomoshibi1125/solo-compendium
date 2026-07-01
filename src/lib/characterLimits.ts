import { AppError } from "@/lib/appError";

/**
 * Per-user character constraints (mirrored authoritatively by the DB trigger +
 * unique index in 20260630020000_character_limits.sql). These app-side guards
 * exist to surface friendly errors before a round-trip to the server.
 */
export const MAX_CHARACTERS_PER_USER = 6;

interface NamedCharacter {
	name: string | null;
}

const normalizeName = (name: string | null | undefined): string =>
	(name ?? "").trim().toLowerCase();

/**
 * Throws an {@link AppError} when creating a character named `name` would violate
 * the per-user limits, given the user's `existing` characters.
 * - `CHARACTER_LIMIT`: already at {@link MAX_CHARACTERS_PER_USER}.
 * - `DUPLICATE_CHARACTER_NAME`: a character with the same (case-insensitive) name exists.
 */
export const assertCharacterCreatable = (
	existing: NamedCharacter[],
	name: string | null | undefined,
): void => {
	if (existing.length >= MAX_CHARACTERS_PER_USER) {
		throw new AppError(
			`Character limit reached — you can have at most ${MAX_CHARACTERS_PER_USER} characters.`,
			"CHARACTER_LIMIT",
		);
	}
	const target = normalizeName(name);
	if (target && existing.some((c) => normalizeName(c.name) === target)) {
		throw new AppError(
			`You already have a character named "${(name ?? "").trim()}". Each character must have a unique name.`,
			"DUPLICATE_CHARACTER_NAME",
		);
	}
};
