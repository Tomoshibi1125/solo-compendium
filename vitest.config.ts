import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		// Use the vmThreads pool: the default fork/thread worker pools hit a
		// "Timeout waiting for worker to respond" hang on Node >=22/25 when
		// combined with the `--localstorage-file` execArgv below. vmThreads runs
		// suites in isolated VM contexts in the main process — no worker spawn,
		// no hang — and the full suite is green under it.
		pool: "vmThreads",
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.{test,spec,property.test,integration.test}.{ts,tsx}"],
		exclude: [
			"**/*.e2e.{test,spec}.{ts,tsx}",
			"**/*.e2e.{test,spec}.ts",
			"**/*.e2e.{test,spec}.tsx",
			"**/*.e2e.spec.{ts,tsx}",
			"**/*.e2e.test.{ts,tsx}",
			"tests/**",
			"playwright-report/**",
			"test-results/**",
			"node_modules/**",
			"dist/**",
		],
		execArgv: [
			"--localstorage-file=node_modules/.cache/vitest/localstorage/data.json",
		],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
