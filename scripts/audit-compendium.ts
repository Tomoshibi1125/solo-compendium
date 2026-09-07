import { staticDataProvider } from "../src/data/compendium/providers";
import { loadCanonicalRegistry } from "../src/data/compendium/registry";
import {
	formatCompendiumAuditReport,
	runCompendiumAudit,
} from "../src/lib/compendiumAudit";

const registry = await loadCanonicalRegistry();
const summary = await runCompendiumAudit(staticDataProvider, { registry });

console.log(formatCompendiumAuditReport(summary));

if (summary.errors.length > 0 || summary.blockingConflicts.length > 0) {
	process.exitCode = 1;
}
