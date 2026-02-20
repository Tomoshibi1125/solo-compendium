import { staticDataProvider, type StaticCompendiumEntry } from '../src/data/compendium/staticDataProvider';

type AuditIssue = {
  type: string;
  id: string;
  name: string;
  field: string;
  severity: 'error' | 'warn';
  details?: string;
};

type AuditReport = {
  summary: {
    categories: Record<string, { entries: number; errors: number; warnings: number }>;
    total: { entries: number; errors: number; warnings: number };
  };
  issues: AuditIssue[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const hasNonEmptyString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const pushIssue = (issues: AuditIssue[], issue: AuditIssue) => {
  issues.push(issue);
};

const auditSpell = (entry: StaticCompendiumEntry, issues: AuditIssue[]) => {
  if (!hasNonEmptyString(entry.description)) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'description',
      severity: 'error',
    });
  }

  if (!isRecord(entry.activation) || !hasNonEmptyString(entry.activation.type)) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'activation.type',
      severity: 'error',
    });
  }

  if (!isRecord(entry.duration) || !hasNonEmptyString(entry.duration.type)) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'duration.type',
      severity: 'error',
    });
  }

  if (!isRecord(entry.components)) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'components',
      severity: 'warn',
      details: 'Spell is missing components object (V/S/M style requirements).',
    });
  }

  if (!isRecord(entry.effects) || !hasNonEmptyString(entry.effects.primary)) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'effects.primary',
      severity: 'warn',
      details: 'Spell has no structured primary effect (falls back to legacy effect field).',
    });
  }

  const mechanics = entry.mechanics;
  const hasAttack = isRecord(mechanics) && isRecord(mechanics.attack);
  const hasSave = isRecord(mechanics) && isRecord(mechanics.saving_throw);
  const hasHealing = isRecord(mechanics) && isRecord(mechanics.healing);
  if (!hasAttack && !hasSave && !hasHealing) {
    pushIssue(issues, {
      type: 'spells',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'mechanics',
      severity: 'warn',
      details: 'Spell has no mechanics resolution; add mechanics.attack, mechanics.saving_throw, or mechanics.healing.',
    });
  }
};

const auditMonster = (entry: StaticCompendiumEntry, issues: AuditIssue[]) => {
  const requiredNumbers: Array<[keyof StaticCompendiumEntry, string]> = [
    ['armor_class', 'armor_class'],
    ['hit_points_average', 'hit_points_average'],
    ['str', 'str'],
    ['agi', 'agi'],
    ['vit', 'vit'],
    ['int', 'int'],
    ['sense', 'sense'],
    ['pre', 'pre'],
  ];

  for (const [key, field] of requiredNumbers) {
    const value = entry[key];
    if (typeof value !== 'number') {
      pushIssue(issues, {
        type: 'monsters',
        id: entry.id,
        name: entry.display_name || entry.name,
        field,
        severity: 'error',
      });
    }
  }

  if (!Array.isArray(entry.monster_actions) || entry.monster_actions.length === 0) {
    pushIssue(issues, {
      type: 'monsters',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'monster_actions',
      severity: 'warn',
      details: 'Monster has no embedded actions; if not using Supabase, add actions to static pack.',
    });
  }

  if (!Array.isArray(entry.monster_traits) || entry.monster_traits.length === 0) {
    pushIssue(issues, {
      type: 'monsters',
      id: entry.id,
      name: entry.display_name || entry.name,
      field: 'monster_traits',
      severity: 'warn',
      details: 'Monster has no embedded traits; if not using Supabase, add traits to static pack.',
    });
  }
};

async function main() {
  const args = new Set(process.argv.slice(2));
  const asJson = args.has('--json');
  const failOnMissing = args.has('--fail-on-missing');

  const issues: AuditIssue[] = [];
  const categoryStats: AuditReport['summary']['categories'] = {};

  const categories = ['spells', 'monsters'] as const;

  for (const category of categories) {
    let entries: StaticCompendiumEntry[] = [];
    if (category === 'spells') entries = await staticDataProvider.getSpells('');
    if (category === 'monsters') entries = await staticDataProvider.getMonsters('');

    const before = issues.length;
    for (const entry of entries) {
      if (category === 'spells') auditSpell(entry, issues);
      if (category === 'monsters') auditMonster(entry, issues);
    }

    const categoryIssues = issues.slice(before);
    const errors = categoryIssues.filter((i) => i.severity === 'error').length;
    const warnings = categoryIssues.filter((i) => i.severity === 'warn').length;

    categoryStats[category] = {
      entries: entries.length,
      errors,
      warnings,
    };
  }

  const report: AuditReport = {
    summary: {
      categories: categoryStats,
      total: {
        entries: Object.values(categoryStats).reduce((sum, s) => sum + s.entries, 0),
        errors: Object.values(categoryStats).reduce((sum, s) => sum + s.errors, 0),
        warnings: Object.values(categoryStats).reduce((sum, s) => sum + s.warnings, 0),
      },
    },
    issues,
  };

  if (asJson) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`Compendium audit\n`);
    for (const [category, stats] of Object.entries(report.summary.categories)) {
      process.stdout.write(
        `- ${category}: ${stats.entries} entries, ${stats.errors} errors, ${stats.warnings} warnings\n`,
      );
    }
    if (issues.length > 0) {
      process.stdout.write(`\nIssues\n`);
      for (const issue of issues.slice(0, 200)) {
        process.stdout.write(
          `- [${issue.severity}] ${issue.type}:${issue.id} ${issue.name} -> ${issue.field}${issue.details ? ` (${issue.details})` : ''}\n`,
        );
      }
      if (issues.length > 200) {
        process.stdout.write(`... ${issues.length - 200} more\n`);
      }
    }
  }

  if (failOnMissing) {
    const errors = issues.filter((i) => i.severity === 'error');
    if (errors.length > 0) {
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  process.stderr.write(`${String(err)}\n`);
  process.exitCode = 1;
});
