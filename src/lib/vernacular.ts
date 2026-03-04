export const REGENT_LABEL = "Regent";
export const REGENT_LABEL_PLURAL = "Regents";
const REGENT_CANONICAL = "regent";
const REGENT_CANONICAL_PLURAL = "regents";

export const formatRegentVernacular = (value: string | undefined | null): string => {
	if (!value) return "";
	return String(value)
		.replace(/\bMONARCHS\b/g, REGENT_LABEL_PLURAL.toUpperCase())
		.replace(/\bMONARCH\b/g, REGENT_LABEL.toUpperCase())
		.replace(/\bMonarchs\b/g, REGENT_LABEL_PLURAL)
		.replace(/\bMonarch\b/g, REGENT_LABEL)
		.replace(/\bmonarchs\b/g, REGENT_LABEL_PLURAL.toLowerCase())
		.replace(/\bmonarch\b/g, REGENT_LABEL.toLowerCase())
		.replace(/\bREGENTS\b/g, REGENT_LABEL_PLURAL.toUpperCase())
		.replace(/\bREGENT\b/g, REGENT_LABEL.toUpperCase())
		.replace(/\bRegents\b/g, REGENT_LABEL_PLURAL)
		.replace(/\bRegent\b/g, REGENT_LABEL)
		.replace(/\bregents\b/g, REGENT_LABEL_PLURAL.toLowerCase())
		.replace(/\bregent\b/g, REGENT_LABEL.toLowerCase());
};

export const normalizeRegentSearch = (value: string | undefined | null): string => {
	if (!value) return "";
	const label = REGENT_LABEL.toLowerCase();
	const labelPlural = REGENT_LABEL_PLURAL.toLowerCase();
	return String(value)
		.replace(/\bmonarchs\b/gi, REGENT_CANONICAL_PLURAL)
		.replace(/\bmonarch\b/gi, REGENT_CANONICAL)
		.replace(new RegExp(`\\b${labelPlural}\\b`, "gi"), REGENT_CANONICAL_PLURAL)
		.replace(new RegExp(`\\b${label}\\b`, "gi"), REGENT_CANONICAL);
};

// Backward compatibility aliases
export const MONARCH_LABEL = REGENT_LABEL;
export const MONARCH_LABEL_PLURAL = REGENT_LABEL_PLURAL;
export const formatMonarchVernacular = formatRegentVernacular;
export const normalizeMonarchSearch = normalizeRegentSearch;
