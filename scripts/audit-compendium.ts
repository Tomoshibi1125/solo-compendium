import { staticDataProvider } from "../src/data/compendium/providers";
import {
	formatCompendiumAuditReport,
	runCompendiumAudit,
} from "../src/lib/compendiumAudit";

const summary = await runCompendiumAudit(staticDataProvider);

console.log(formatCompendiumAuditReport(summary));

if (summary.errors.length > 0) {
	process.exitCode = 1;
}
