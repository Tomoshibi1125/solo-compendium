/**
 * Advanced search operators
 * Supports query syntax like: "fire damage", type:power, level:>3, rarity:rare
 */

export interface ParsedSearchQuery {
  text: string;
  operators: {
    type?: string[];
    level?: { operator: '=' | '>' | '<' | '>=' | '<='; value: number };
    rarity?: string[];
    school?: string[];
    cr?: { operator: '=' | '>' | '<' | '>=' | '<='; value: string };
    tag?: string[];
    source?: string[];
  };
}

/**
 * Parse search query with advanced operators
 * Supports:
 * - type:jobs,powers (multiple types)
 * - level:>3 (comparison operators)
 * - rarity:rare (exact match)
 * - school:evocation (exact match)
 * - cr:>5 (challenge rating)
 * - tag:boss (tags)
 * - source:core (source book)
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const result: ParsedSearchQuery = {
    text: '',
    operators: {},
  };

  // Extract operators (format: key:value or key:>value)
  const operatorPattern = /(\w+):([><=]+)?([^\s]+)/g;
  const operators: string[] = [];
  let match;

  while ((match = operatorPattern.exec(query)) !== null) {
    operators.push(match[0]);
    const [, key, op, value] = match;

    switch (key.toLowerCase()) {
      case 'type':
        result.operators.type = value.split(',').map(t => t.trim());
        break;
      case 'level':
        if (op) {
          result.operators.level = {
            operator: op as '>' | '<' | '>=' | '<=',
            value: parseInt(value, 10),
          };
        } else {
          result.operators.level = {
            operator: '=',
            value: parseInt(value, 10),
          };
        }
        break;
      case 'rarity':
        result.operators.rarity = value.split(',').map(r => r.trim());
        break;
      case 'school':
        result.operators.school = value.split(',').map(s => s.trim());
        break;
      case 'cr':
        if (op) {
          result.operators.cr = {
            operator: op as '>' | '<' | '>=' | '<=',
            value: value,
          };
        } else {
          result.operators.cr = {
            operator: '=',
            value: value,
          };
        }
        break;
      case 'tag':
        result.operators.tag = value.split(',').map(t => t.trim());
        break;
      case 'source':
        result.operators.source = value.split(',').map(s => s.trim());
        break;
    }
  }

  // Remove operators from text query
  result.text = query
    .replace(operatorPattern, '')
    .replace(/\s+/g, ' ')
    .trim();

  return result;
}

/**
 * Apply parsed query operators to a Supabase query
 */
export function applySearchOperators(
  baseQuery: any,
  parsed: ParsedSearchQuery,
  tableName: string
) {
  let query = baseQuery;

  // Apply type filter (if applicable)
  if (parsed.operators.type && parsed.operators.type.length > 0) {
    // Type filtering is usually handled at the query level, not in the query builder
    // This would be used to determine which tables to search
  }

  // Apply level filter
  if (parsed.operators.level) {
    const { operator, value } = parsed.operators.level;
    const column = tableName.includes('power') ? 'power_level' : 'level';
    
    switch (operator) {
      case '>':
        query = query.gt(column, value);
        break;
      case '<':
        query = query.lt(column, value);
        break;
      case '>=':
        query = query.gte(column, value);
        break;
      case '<=':
        query = query.lte(column, value);
        break;
      case '=':
      default:
        query = query.eq(column, value);
        break;
    }
  }

  // Apply rarity filter
  if (parsed.operators.rarity && parsed.operators.rarity.length > 0) {
    query = query.in('rarity', parsed.operators.rarity);
  }

  // Apply school filter
  if (parsed.operators.school && parsed.operators.school.length > 0) {
    query = query.in('school', parsed.operators.school);
  }

  // Apply CR filter
  if (parsed.operators.cr) {
    const { operator, value } = parsed.operators.cr;
    // CR is stored as text, so we need to parse it
    const crValue = parseFloat(value);
    if (!isNaN(crValue)) {
      switch (operator) {
        case '>':
          query = query.gt('cr', value);
          break;
        case '<':
          query = query.lt('cr', value);
          break;
        case '>=':
          query = query.gte('cr', value);
          break;
        case '<=':
          query = query.lte('cr', value);
          break;
        case '=':
        default:
          query = query.eq('cr', value);
          break;
      }
    }
  }

  // Apply tag filter
  if (parsed.operators.tag && parsed.operators.tag.length > 0) {
    query = query.contains('tags', parsed.operators.tag);
  }

  // Apply source filter
  if (parsed.operators.source && parsed.operators.source.length > 0) {
    query = query.in('source_book', parsed.operators.source);
  }

  return query;
}

/**
 * Format search query with operators for display
 */
export function formatSearchQuery(parsed: ParsedSearchQuery): string {
  const parts: string[] = [];

  if (parsed.text) {
    parts.push(parsed.text);
  }

  if (parsed.operators.type) {
    parts.push(`type:${parsed.operators.type.join(',')}`);
  }
  if (parsed.operators.level) {
    parts.push(`level:${parsed.operators.level.operator}${parsed.operators.level.value}`);
  }
  if (parsed.operators.rarity) {
    parts.push(`rarity:${parsed.operators.rarity.join(',')}`);
  }
  if (parsed.operators.school) {
    parts.push(`school:${parsed.operators.school.join(',')}`);
  }
  if (parsed.operators.cr) {
    parts.push(`cr:${parsed.operators.cr.operator}${parsed.operators.cr.value}`);
  }
  if (parsed.operators.tag) {
    parts.push(`tag:${parsed.operators.tag.join(',')}`);
  }
  if (parsed.operators.source) {
    parts.push(`source:${parsed.operators.source.join(',')}`);
  }

  return parts.join(' ');
}

