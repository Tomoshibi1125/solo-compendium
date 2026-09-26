import path from "node:path";
import type { IncomingMessage } from "node:http";
import { fileURLToPath } from "node:url";
import baseConfig from "./vite.base.config";
import { defineConfig, type Plugin } from "vite";
import { handleSovereignGenerationRequest } from "./api/_sovereignGeneration";

const MAX_SOVEREIGN_BODY_BYTES = 16 * 1024;

// vite.base.config.ts is the pre-S4 config moved behind this composition layer.
// Its existing aliases intentionally resolve from the repository root via
// __dirname, so preserve that Node config global before its callback executes.
Object.assign(globalThis, {
	__dirname: path.dirname(fileURLToPath(import.meta.url)),
});

function firstHeader(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
	let raw = "";
	let bytes = 0;
	for await (const chunk of req) {
		const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
		bytes += Buffer.byteLength(text, "utf8");
		if (bytes > MAX_SOVEREIGN_BODY_BYTES) throw new Error("REQUEST_TOO_LARGE");
		raw += text;
	}
	return raw ? JSON.parse(raw) : {};
}

/** Local mirror of api/sovereign.ts using the exact shared S4 handler. */
function devSovereignProxy(): Plugin {
	return {
		name: "dev-sovereign-proxy",
		configureServer(server) {
			server.middlewares.use("/api/sovereign", async (req, res) => {
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
				res.setHeader(
					"Access-Control-Allow-Headers",
					"Content-Type, Authorization",
				);
				res.setHeader("Cache-Control", "no-store");

				if (req.method === "OPTIONS") {
					res.statusCode = 204;
					res.end();
					return;
				}
				if (req.method !== "POST") {
					res.statusCode = 405;
					res.end(JSON.stringify({ error: "Method not allowed" }));
					return;
				}

				let body: unknown;
				try {
					body = await readJsonBody(req);
				} catch (error) {
					res.statusCode =
						error instanceof Error && error.message === "REQUEST_TOO_LARGE"
							? 413
							: 400;
					res.setHeader("Content-Type", "application/json");
					res.end(
						JSON.stringify({
							error:
								error instanceof Error && error.message === "REQUEST_TOO_LARGE"
									? "Request body too large"
									: "Invalid JSON body",
						}),
					);
					return;
				}

				const forwarded = firstHeader(req.headers["x-forwarded-for"]);
				const result = await handleSovereignGenerationRequest({
					authorization: firstHeader(req.headers.authorization),
					clientIp:
						forwarded?.split(",")[0]?.trim() ||
						req.socket.remoteAddress ||
						"local",
					body,
					env: process.env,
				});
				res.statusCode = result.status;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(result.body));
			});
		},
	};
}

export default defineConfig(async (environment) => {
	const resolvedBase =
		typeof baseConfig === "function"
			? await baseConfig(environment)
			: await baseConfig;
	return {
		...resolvedBase,
		plugins: [...(resolvedBase.plugins ?? []), devSovereignProxy()],
	};
});
