/**
 * Misty Pearl H1 — i18n bootstrap.
 *
 * Wires `react-i18next` + `i18next-browser-languagedetector` with
 * three shipped locales:
 *   - `en-US` — canonical English (existing strings)
 *   - `ko-KR` — Korean (RA's source-material alignment)
 *   - `es-ES` — Spanish (largest growth wedge)
 *
 * Strategy:
 *   - Single namespace `common` for now. Sub-namespaces (`vtt`,
 *     `campaign`, `compendium`) can split out as the catalog grows.
 *   - The Bureau / Warden / Ascendant / Rift / Anomaly / Stratum
 *     glossary is locked through `BUREAU_GLOSSARY_KEYS` so community
 *     translators can't drift the canon — translations for these
 *     keys go through a separate review.
 *   - Production strings still live in code today; this bootstrap
 *     adds the *infrastructure* so a follow-up sweep can migrate
 *     existing literals to `t('key')` calls incrementally without
 *     blocking releases.
 */
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en-US.json";
import es from "@/locales/es-ES.json";
import ko from "@/locales/ko-KR.json";

export const SUPPORTED_LOCALES = ["en-US", "ko-KR", "es-ES"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Bureau glossary — terms that MUST translate consistently across
 * locales. Community translators see these flagged in the
 * contribution doc as "canon locked".
 */
export const BUREAU_GLOSSARY_KEYS = [
	"glossary.bureau",
	"glossary.warden",
	"glossary.ascendant",
	"glossary.rift",
	"glossary.anomaly",
	"glossary.stratum",
	"glossary.sovereign",
	"glossary.regent",
	"glossary.gate",
	"glossary.commnet",
	"glossary.system",
] as const;

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			"en-US": { common: en },
			"ko-KR": { common: ko },
			"es-ES": { common: es },
		},
		fallbackLng: "en-US",
		defaultNS: "common",
		ns: ["common"],
		interpolation: {
			// React already escapes — i18next double-escaping causes XSS-like
			// display artifacts.
			escapeValue: false,
		},
		detection: {
			order: ["localStorage", "navigator"],
			lookupLocalStorage: "rift-ascendant-locale",
			caches: ["localStorage"],
		},
		returnNull: false,
	});

export default i18n;
