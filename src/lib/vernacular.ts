export const REGENT_LABEL = 'Regent';
export const REGENT_LABEL_PLURAL = 'Regents';
const REGENT_CANONICAL = 'regent';
const REGENT_CANONICAL_PLURAL = 'regents';

export const formatRegentVernacular = (value: string): string =>
  value
    .replace(/\bREGENTS\b/g, REGENT_LABEL_PLURAL.toUpperCase())
    .replace(/\bREGENT\b/g, REGENT_LABEL.toUpperCase())
    .replace(/\bRegents\b/g, REGENT_LABEL_PLURAL)
    .replace(/\bRegent\b/g, REGENT_LABEL)
    .replace(/\bregents\b/g, REGENT_LABEL_PLURAL.toLowerCase())
    .replace(/\bregent\b/g, REGENT_LABEL.toLowerCase());

export const normalizeRegentSearch = (value: string): string => {
  const label = REGENT_LABEL.toLowerCase();
  const labelPlural = REGENT_LABEL_PLURAL.toLowerCase();
  return value
    .replace(new RegExp(`\\b${labelPlural}\\b`, 'gi'), REGENT_CANONICAL_PLURAL)
    .replace(new RegExp(`\\b${label}\\b`, 'gi'), REGENT_CANONICAL);
};

// Backward compatibility aliases
export const MONARCH_LABEL = REGENT_LABEL;
export const MONARCH_LABEL_PLURAL = REGENT_LABEL_PLURAL;
export const formatMonarchVernacular = formatRegentVernacular;
export const normalizeMonarchSearch = normalizeRegentSearch;
