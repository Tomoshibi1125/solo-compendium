/**
 * Comprehensive choice calculation utilities for character creation
 * Handles additional grants from awakening features, traits, paths, regents, etc.
 */

export interface ChoiceGrant {
	type:
		| "skills"
		| "feats"
		| "spells"
		| "powers"
		| "techniques"
		| "runes"
		| "items"
		| "tools"
		| "languages"
		| "expertise";
	count: number;
	source: string;
	description: string;
}

export interface TotalChoices {
	skills: number;
	feats: number;
	spells: number;
	powers: number;
	techniques: number;
	runes: number;
	items: number;
	tools: number;
	languages: number;
	expertise: number;
}

/**
 * Convert written number to digit
 */
const writtenNumberToDigit = (word: string): number => {
	const numbers: Record<string, number> = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
	};
	return numbers[word.toLowerCase()] || 0;
};

/**
 * Parse a description for choice grants using comprehensive pattern matching
 */
export function parseChoiceGrants(
	description: string,
	source: string,
): ChoiceGrant[] {
	const grants: ChoiceGrant[] = [];
	const desc = description.toLowerCase();

	// Skill proficiency patterns - handle both digits and written numbers
	const skillPatterns = [
		/gain\s+proficiency\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skill\s+proficiencies?/i,
		/proficient\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
	];

	for (const pattern of skillPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "skills",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Feat patterns - handle both digits and written numbers
	const featPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+feat(s)?\s+of\s+your\s+choice/i,
	];

	for (const pattern of featPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "feats",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Spell patterns - handle both digits and written numbers
	const spellPatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/know\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/add\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+spells?\s+to\s+your\s+spellbook/i,
	];

	for (const pattern of spellPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "spells",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Power patterns - handle both digits and written numbers
	const powerPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/unlock\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
	];

	for (const pattern of powerPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "powers",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Technique patterns - handle both digits and written numbers
	const techniquePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/master\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
	];

	for (const pattern of techniquePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "techniques",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Rune patterns - handle both digits and written numbers
	const runePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/discover\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/absorb\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
	];

	for (const pattern of runePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "runes",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Item patterns - handle both digits and written numbers
	const itemPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/receive\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/craft\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
	];

	for (const pattern of itemPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "items",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Tool patterns - handle both digits and written numbers
	const toolPatterns = [
		/gain\s+proficiency\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/become\s+proficient\s+with\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/learn\s+to\s+use\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tool\s+proficiencies?/i,
	];

	for (const pattern of toolPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "tools",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Language patterns - handle both digits and written numbers
	const languagePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/speak\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/know\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
	];

	for (const pattern of languagePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "languages",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Expertise patterns (double proficiency) - handle both digits and written numbers
	const expertisePatterns = [
		/double\s+proficiency\s+on\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+chosen\s+skill\s+proficiencies?/i,
		/gain\s+expertise\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?\s+to\s+gain\s+expertise\s+in/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?\s+for\s+expertise/i,
	];

	for (const pattern of expertisePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "expertise",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	return grants;
}

/**
 * Calculate total additional choices from all sources (job, path, regent)
 */
export function calculateTotalChoices(
	jobData: any,
	pathData: any,
	regentData: any[],
	level: number = 1,
): TotalChoices {
	const totals: TotalChoices = {
		skills: 0,
		feats: 0,
		spells: 0,
		powers: 0,
		techniques: 0,
		runes: 0,
		items: 0,
		tools: 0,
		languages: 0,
		expertise: 0,
	};

	// Base job choices
	if (jobData) {
		totals.skills += jobData.skill_choice_count || 0;

		// Job awakening features
		if (jobData.awakeningFeatures) {
			for (const feature of jobData.awakeningFeatures) {
				if (feature.level <= level) {
					const grants = parseChoiceGrants(
						feature.description,
						`Job: ${feature.name}`,
					);
					for (const grant of grants) {
						totals[grant.type] += grant.count;
					}
				}
			}
		}

		// Job traits
		if (jobData.jobTraits) {
			for (const trait of jobData.jobTraits) {
				const grants = parseChoiceGrants(
					trait.description,
					`Trait: ${trait.name}`,
				);
				for (const grant of grants) {
					totals[grant.type] += grant.count;
				}
			}
		}
	}

	// Path features
	if (pathData?.features) {
		for (const feature of pathData.features) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Path: ${feature.name}`,
				);
				for (const grant of grants) {
					totals[grant.type] += grant.count;
				}
			}
		}
	}

	// Regent features
	if (regentData) {
		for (const regent of regentData) {
			if (regent.class_features) {
				for (const feature of regent.class_features) {
					if (feature.level <= level) {
						const grants = parseChoiceGrants(
							feature.description,
							`Regent: ${regent.name}`,
						);
						for (const grant of grants) {
							totals[grant.type] += grant.count;
						}
					}
				}
			}
		}
	}

	return totals;
}

/**
 * Get all choice grants with details for UI display
 */
export function getChoiceGrantDetails(
	jobData: any,
	pathData: any,
	regentData: any[],
	level: number = 1,
): ChoiceGrant[] {
	const allGrants: ChoiceGrant[] = [];

	// Job awakening features
	if (jobData?.awakeningFeatures) {
		for (const feature of jobData.awakeningFeatures) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Job: ${feature.name}`,
				);
				allGrants.push(...grants);
			}
		}
	}

	// Job traits
	if (jobData?.jobTraits) {
		for (const trait of jobData.jobTraits) {
			const grants = parseChoiceGrants(
				trait.description,
				`Trait: ${trait.name}`,
			);
			allGrants.push(...grants);
		}
	}

	// Path features
	if (pathData?.features) {
		for (const feature of pathData.features) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Path: ${feature.name}`,
				);
				allGrants.push(...grants);
			}
		}
	}

	// Regent features
	if (regentData) {
		for (const regent of regentData) {
			if (regent.class_features) {
				for (const feature of regent.class_features) {
					if (feature.level <= level) {
						const grants = parseChoiceGrants(
							feature.description,
							`Regent: ${regent.name}`,
						);
						allGrants.push(...grants);
					}
				}
			}
		}
	}

	return allGrants;
}
