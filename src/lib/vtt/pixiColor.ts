/**
 * Robust hex → Pixi numeric color parsing.
 *
 * Pixi drawing calls (`fill`/`stroke`/`tint`) expect a numeric color. Token,
 * light, and bar colors arrive as user/preset-authored strings that may be
 * malformed, shorthand, missing, or non-hex. The previous inline pattern
 * `Number(color.replace("#", "0x"))` threw on `undefined` and produced `NaN`
 * for shorthand/invalid input, which corrupts the Pixi render. This helper is
 * the single, safe conversion point.
 *
 * Visual-only: it never throws and falls back to a safe default for anything it
 * cannot parse. It intentionally does NOT support CSS named colors, `rgb()`, or
 * `transparent` (those resolve to the fallback) — VTT color data is authored as
 * hex and the DOM fallback surface mirrors the same hex-only contract
 * (`toRgba` in VttDomFallbackSurface.tsx).
 */

/** Default fallback (emerald) — matches the prior `hexToPixiColor` default. */
export const DEFAULT_PIXI_COLOR = 0x22c55e;

/**
 * Parse a hex color string into a Pixi numeric color.
 *
 * Accepts `#rrggbb`, `rrggbb`, `#rgb`, and `rgb` (3-digit shorthand is
 * expanded), with surrounding whitespace, case-insensitive. Any other input —
 * including `undefined`/`null`/empty/named colors/`rgb()` — returns `fallback`.
 *
 * @param color The raw color string (or nullish).
 * @param fallback Numeric color returned when `color` cannot be parsed.
 */
export function parsePixiColor(
	color: string | undefined | null,
	fallback: number = DEFAULT_PIXI_COLOR,
): number {
	if (typeof color !== "string") return fallback;
	const normalized = color.trim().replace(/^#/, "");
	const hex =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => char + char)
					.join("")
			: normalized;
	if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback;
	return Number.parseInt(hex, 16);
}
