// Canonical labels for the Regent system
export const REGENT_LABEL = "Regent";
export const REGENT_LABEL_PLURAL = "Regents";
export const MONARCH_LABEL = "Regent";

export const formatRegentVernacular = (
	value: string | undefined | null,
): string => {
	if (!value) return "";
	return String(value)
		.replace(/\bMONARCHS\b/g, REGENT_LABEL_PLURAL.toUpperCase())
		.replace(/\bMONARCH\b/g, REGENT_LABEL.toUpperCase())
		.replace(/\bRegents\b/g, REGENT_LABEL_PLURAL)
		.replace(/\bRegent\b/g, REGENT_LABEL)
		.replace(/\bregents\b/g, REGENT_LABEL_PLURAL.toLowerCase())
		.replace(/\bregent\b/g, REGENT_LABEL.toLowerCase());
};

export const normalizeRegentSearch = (
	value: string | undefined | null,
): string => {
	if (!value) return "";
	const label = REGENT_LABEL.toLowerCase();
	const labelPlural = REGENT_LABEL_PLURAL.toLowerCase();
	return String(value)
		.replace(/\bregents\b/gi, "regents")
		.replace(/\bregent\b/gi, "regent")
		.replace(new RegExp(`\\b${labelPlural}\\b`, "gi"), "regents")
		.replace(new RegExp(`\\b${label}\\b`, "gi"), "regent");
};
