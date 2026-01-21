export const MONARCH_LABEL = 'Regent';
export const MONARCH_LABEL_PLURAL = 'Regents';
const MONARCH_CANONICAL = 'monarch';
const MONARCH_CANONICAL_PLURAL = 'monarchs';

export const formatMonarchVernacular = (value: string): string =>
  value
    .replace(/\bMONARCHS\b/g, MONARCH_LABEL_PLURAL.toUpperCase())
    .replace(/\bMONARCH\b/g, MONARCH_LABEL.toUpperCase())
    .replace(/\bMonarchs\b/g, MONARCH_LABEL_PLURAL)
    .replace(/\bMonarch\b/g, MONARCH_LABEL)
    .replace(/\bmonarchs\b/g, MONARCH_LABEL_PLURAL.toLowerCase())
    .replace(/\bmonarch\b/g, MONARCH_LABEL.toLowerCase());

export const normalizeMonarchSearch = (value: string): string => {
  const label = MONARCH_LABEL.toLowerCase();
  const labelPlural = MONARCH_LABEL_PLURAL.toLowerCase();
  return value
    .replace(new RegExp(`\\b${labelPlural}\\b`, 'gi'), MONARCH_CANONICAL_PLURAL)
    .replace(new RegExp(`\\b${label}\\b`, 'gi'), MONARCH_CANONICAL);
};
