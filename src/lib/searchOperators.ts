/**
 * Advanced search operators
 * Supports query syntax like: "fire damage", type:power, level:>3, rarity:rare
 */

interface ParsedSearchQuery {
	text: string;
	operators: {
		type?: string[];
		level?: { operator: "=" | ">" | "<" | ">=" | "<="; value: number };
		rarity?: string[];
		school?: string[];
		cr?: { operator: "=" | ">" | "<" | ">=" | "<="; value: string };
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
		text: "",
		operators: {},
	};

	// Extract operators (format: key:value or key:>value)
	const operatorPattern = /(\w+):([><=]+)?([^\s]+)/g;
	const operators: string[] = [];

	for (const match of query.matchAll(operatorPattern)) {
		operators.push(match[0]);
		const [, key, op, value] = match;

		switch (key.toLowerCase()) {
			case "type":
				result.operators.type = value.split(",").map((t) => t.trim());
				break;
			case "level":
				if (op) {
					result.operators.level = {
						operator: op as ">" | "<" | ">=" | "<=",
						value: parseInt(value, 10),
					};
				} else {
					result.operators.level = {
						operator: "=",
						value: parseInt(value, 10),
					};
				}
				break;
			case "rarity":
				result.operators.rarity = value.split(",").map((r) => r.trim());
				break;
			case "school":
				result.operators.school = value.split(",").map((s) => s.trim());
				break;
			case "cr":
				if (op) {
					result.operators.cr = {
						operator: op as ">" | "<" | ">=" | "<=",
						value: value,
					};
				} else {
					result.operators.cr = {
						operator: "=",
						value: value,
					};
				}
				break;
			case "tag":
				result.operators.tag = value.split(",").map((t) => t.trim());
				break;
			case "source":
				result.operators.source = value.split(",").map((s) => s.trim());
				break;
		}
	}

	// Remove operators from text query
	result.text = query.replace(operatorPattern, "").replace(/\s+/g, " ").trim();

	return result;
}
