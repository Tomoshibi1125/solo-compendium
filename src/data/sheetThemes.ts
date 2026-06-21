/**
 * Canonical RA sheet themes (F2 of May 2026 remediation plan).
 *
 * Each theme sets the sheet root's `--sheet-accent` CSS variable plus a
 * light variant. Themes are intentionally named in RA canon — no D&D
 * 5e palette names. All accent hues are pulled from existing tokens in
 * `src/styles/ra-theme.css` so the rest of the app stays cohesive.
 *
 * Add a new theme: append a row here, no migration required.
 */

interface SheetTheme {
	id: string;
	name: string;
	description: string;
	accent: string; // primary accent hue (HSL or hex)
	accentSoft: string; // soft / hover variant
	glow: string; // CSS box-shadow color
}

export const SHEET_THEMES: ReadonlyArray<SheetTheme> = [
	{
		id: "cosmic-dark",
		name: "Cosmic Dark",
		description:
			"The Rift Ascendant default — deep void with starlit accents. Fits every Ascendant.",
		accent: "hsl(217, 91%, 60%)",
		accentSoft: "hsl(217, 91%, 75%)",
		glow: "rgba(96, 165, 250, 0.35)",
	},
	{
		id: "void-violet",
		name: "Void Violet",
		description:
			"Saturated violet — pairs naturally with Umbral Regents and Shadow-aligned Paths.",
		accent: "hsl(270, 80%, 65%)",
		accentSoft: "hsl(270, 80%, 78%)",
		glow: "rgba(192, 132, 252, 0.4)",
	},
	{
		id: "rift-crimson",
		name: "Rift Crimson",
		description:
			"Blood-red gates and lava-vein highlights — favored by Destroyers and Berserkers.",
		accent: "hsl(0, 80%, 60%)",
		accentSoft: "hsl(0, 80%, 75%)",
		glow: "rgba(248, 113, 113, 0.4)",
	},
	{
		id: "eternal-gold",
		name: "Eternal Gold",
		description:
			"Sovereign gold and ivory — fitting for Holy Knights and high-Presence Idols.",
		accent: "hsl(45, 90%, 55%)",
		accentSoft: "hsl(45, 90%, 70%)",
		glow: "rgba(250, 204, 21, 0.4)",
	},
	{
		id: "shadow-monarch",
		name: "Shadow Monarch",
		description:
			"Obsidian and indigo with monarch-purple inks — for Stalkers and Assassins.",
		accent: "hsl(240, 70%, 65%)",
		accentSoft: "hsl(240, 70%, 78%)",
		glow: "rgba(129, 140, 248, 0.4)",
	},
	{
		id: "frost-azure",
		name: "Frost Azure",
		description:
			"Glacial cyan and silver — pairs with Frost Regents and ice-aligned Espers.",
		accent: "hsl(195, 85%, 55%)",
		accentSoft: "hsl(195, 85%, 70%)",
		glow: "rgba(56, 189, 248, 0.4)",
	},
	{
		id: "dawn-radiant",
		name: "Dawn Radiant",
		description:
			"Sunrise amber and rose — Heralds, Summoners, and any radiant-aligned Ascendant.",
		accent: "hsl(20, 90%, 60%)",
		accentSoft: "hsl(20, 90%, 75%)",
		glow: "rgba(251, 146, 60, 0.4)",
	},
] as const;

export const DEFAULT_SHEET_THEME_ID = "cosmic-dark";

export function getSheetTheme(id: string | null | undefined): SheetTheme {
	if (!id) return SHEET_THEMES[0];
	return SHEET_THEMES.find((t) => t.id === id) ?? SHEET_THEMES[0];
}

/**
 * Build the inline CSS custom-property style block for a given theme.
 * Used by `CharacterSheetV2.tsx` to apply per-character accent colors
 * without forcing a global stylesheet swap.
 */
export function buildSheetThemeStyle(
	theme: SheetTheme,
	accentOverride?: string | null,
): React.CSSProperties {
	const accent = accentOverride || theme.accent;
	return {
		// CSS variables consumed by `CharacterSheet.css` rules:
		//   --sheet-accent, --sheet-accent-soft, --sheet-accent-glow
		"--sheet-accent": accent,
		"--sheet-accent-soft": theme.accentSoft,
		"--sheet-accent-glow": theme.glow,
	} as React.CSSProperties;
}
