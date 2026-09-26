import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

type SovereignGenerationModule = typeof import("./api/_sovereignGeneration");

const MAX_SOVEREIGN_BODY_BYTES = 16 * 1024;

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

/**
 * Vite dev mirror of api/sovereign.ts. `enforce: pre` also retires the legacy
 * generic /api/ai path before older middleware can reach a provider.
 */
export function devSovereignProxy(): Plugin {
	return {
		name: "dev-sovereign-proxy",
		enforce: "pre",
		configureServer(server) {
			server.middlewares.use("/api/ai", (_req, res) => {
				res.statusCode = 410;
				res.setHeader("Content-Type", "application/json");
				res.setHeader("Cache-Control", "no-store");
				res.end(
					JSON.stringify({
						error:
							"General AI was retired. Use the dedicated Sovereign generation endpoint.",
					}),
				);
			});

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

				const module = (await server.ssrLoadModule(
					"/api/_sovereignGeneration.ts",
				)) as SovereignGenerationModule;
				const forwarded = firstHeader(req.headers["x-forwarded-for"]);
				const result = await module.handleSovereignGenerationRequest({
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
