/**
 * Input sanitization utilities
 * Prevents XSS and ensures safe data handling
 */

// Sanitize HTML content (basic - for user-generated content)
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Sanitize text input (removes potentially dangerous characters)
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate and sanitize numeric input
export function sanitizeNumber(value: unknown, min?: number, max?: number): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return null;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
}

// Sanitize array of strings
export function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is string => typeof item === 'string')
    .map(sanitizeText)
    .filter(item => item.length > 0)
    .slice(0, 100); // Limit array size
}

// Sanitize object keys (for user input)
export function sanitizeObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '');
    if (safeKey.length > 0 && safeKey.length < 100) {
      sanitized[safeKey] = value;
    }
  }
  return sanitized;
}

