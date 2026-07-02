import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import react from "@vitejs/plugin-react-swc";
import { config as dotenvConfig } from "dotenv";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";

// Load .env for server-side use (GEMINI_API_KEY is not VITE_ prefixed)
dotenvConfig();

/**
 * Vite dev middleware plugin that mimics the Vercel serverless function
 * at /api/ai so AI features work during local development.
 */
// Dev mirror of the production /api/ai free provider chain (api/ai.js), so local
// dev gets the same best-in-class free model AND works with zero config via the
// keyless Pollinations fallback. Model ladders mirror api/ai.js (July 2026):
// each leg tries its models in order and falls through on any per-model error.
const DEV_GEMINI_MODELS = [
	"gemini-3.5-flash",
	"gemini-3-flash-preview",
	"gemini-2.5-flash",
];
const DEV_OPENROUTER_MODELS = [
	"nvidia/nemotron-3-ultra-550b-a55b:free",
	"nousresearch/hermes-3-llama-3.1-405b:free",
	"nvidia/nemotron-3-super-120b-a12b:free",
	"openai/gpt-oss-120b:free",
	"meta-llama/llama-3.3-70b-instruct:free",
];
const DEV_POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || "openai";
const DEV_AI_TIMEOUT_MS = 30_000;

/** Ordered, deduped model attempt list: override → env → defaults. */
function devBuildModelAttempts(
	override: string | undefined,
	envModel: string | undefined,
	defaults: string[],
): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const model of [override, envModel, ...defaults]) {
		const trimmed = typeof model === "string" ? model.trim() : "";
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		out.push(trimmed);
	}
	return out;
}

type DevAIResult = {
	text: string;
	model: string;
	usage?: Record<string, unknown>;
};
type DevAIArgs = {
	prompt: string;
	systemPrompt?: string;
	maxTokens?: number;
	model?: string;
};

async function devCallGemini({
	prompt,
	systemPrompt,
	maxTokens,
	model: modelOverride,
}: DevAIArgs): Promise<DevAIResult> {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GEMINI_API_KEY not set");
	const models = devBuildModelAttempts(
		modelOverride,
		process.env.GEMINI_MODEL,
		DEV_GEMINI_MODELS,
	);
	const ai = new GoogleGenAI({ apiKey });
	const errors: string[] = [];
	for (const model of models) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), DEV_AI_TIMEOUT_MS);
		try {
			const response = await ai.models.generateContent({
				model,
				contents: prompt,
				config: {
					systemInstruction: systemPrompt,
					maxOutputTokens: Math.min(maxTokens || 4096, 4096),
					temperature: 0.8,
					abortSignal: controller.signal,
				},
			});
			const text = response.text || "";
			if (!text.trim()) throw new Error("Gemini empty response");
			return {
				text,
				model,
				usage: {
					promptTokens: response.usageMetadata?.promptTokenCount,
					completionTokens: response.usageMetadata?.candidatesTokenCount,
					totalTokens: response.usageMetadata?.totalTokenCount,
				},
			};
		} catch (err) {
			errors.push(`${model}: ${err instanceof Error ? err.message : "error"}`);
			// fall through to the next free model
		} finally {
			clearTimeout(timer);
		}
	}
	throw new Error(errors.join(" | ") || "Gemini: no models attempted");
}

async function devCallOpenRouter({
	prompt,
	systemPrompt,
	maxTokens,
	model: modelOverride,
}: DevAIArgs): Promise<DevAIResult> {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");
	const models = devBuildModelAttempts(
		modelOverride,
		process.env.OPENROUTER_MODEL,
		DEV_OPENROUTER_MODELS,
	);
	const messages: Array<{ role: string; content: string }> = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });
	const errors: string[] = [];
	for (const model of models) {
		try {
			const response = await fetch(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
						"X-Title": "Rift Ascendant",
					},
					body: JSON.stringify({
						model,
						messages,
						max_tokens: Math.min(maxTokens || 4096, 4096),
						temperature: 0.8,
					}),
				},
			);
			if (!response.ok) throw new Error(`OpenRouter error ${response.status}`);
			const data = (await response.json()) as {
				model?: string;
				choices?: Array<{ message?: { content?: string } }>;
			};
			const text = data?.choices?.[0]?.message?.content || "";
			if (!text.trim()) throw new Error("OpenRouter empty response");
			return { text, model: data?.model || model };
		} catch (err) {
			errors.push(`${model}: ${err instanceof Error ? err.message : "error"}`);
			// fall through to the next free model
		}
	}
	throw new Error(errors.join(" | ") || "OpenRouter: no models attempted");
}

async function devCallPollinations({
	prompt,
	systemPrompt,
	model: modelOverride,
}: DevAIArgs): Promise<DevAIResult> {
	const model = modelOverride || DEV_POLLINATIONS_MODEL;
	const messages: Array<{ role: string; content: string }> = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });
	const response = await fetch("https://text.pollinations.ai/openai", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ model, messages }),
	});
	if (!response.ok) throw new Error(`Pollinations error ${response.status}`);
	const raw = await response.text();
	let text = raw;
	try {
		const data = JSON.parse(raw) as {
			choices?: Array<{ message?: { content?: string } }>;
		};
		text = data?.choices?.[0]?.message?.content ?? raw;
	} catch {
		// plain text body — use as-is
	}
	if (!text.trim()) throw new Error("Pollinations empty response");
	return { text, model: `pollinations:${model}` };
}

const DEV_AI_PROVIDERS: Record<
	string,
	(args: DevAIArgs) => Promise<DevAIResult>
> = {
	gemini: devCallGemini,
	openrouter: devCallOpenRouter,
	pollinations: devCallPollinations,
};

function devProviderOrder(preferred?: string): string[] {
	const raw = process.env.AI_PROVIDER_ORDER || "gemini,openrouter,pollinations";
	let order = raw
		.split(",")
		.map((s) => s.trim().toLowerCase())
		.filter((s) => DEV_AI_PROVIDERS[s]);
	if (order.length === 0) order = ["pollinations"];
	if (preferred && DEV_AI_PROVIDERS[preferred]) {
		order = [preferred, ...order.filter((s) => s !== preferred)];
	}
	return order;
}

function devProviderAvailable(name: string): boolean {
	if (name === "gemini") return Boolean(process.env.GEMINI_API_KEY);
	if (name === "openrouter") return Boolean(process.env.OPENROUTER_API_KEY);
	return true; // pollinations is keyless
}

function devAIProxy(): Plugin {
	return {
		name: "dev-ai-proxy",
		configureServer(server) {
			server.middlewares.use("/api/ai", async (req, res) => {
				// CORS
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
				res.setHeader(
					"Access-Control-Allow-Headers",
					"Content-Type, Authorization",
				);

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

				// Read body
				let rawBody = "";
				await new Promise<void>((resolve) => {
					req.on("data", (chunk: Buffer) => {
						rawBody += chunk.toString();
					});
					req.on("end", resolve);
				});

				let body: Record<string, unknown>;
				try {
					body = JSON.parse(rawBody);
				} catch {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "Invalid JSON body" }));
					return;
				}

				const {
					prompt,
					systemPrompt,
					maxTokens,
					provider: preferredProvider,
					model: preferredModel,
				} = body as {
					prompt?: string;
					systemPrompt?: string;
					maxTokens?: number;
					provider?: string;
					model?: string;
				};

				if (!prompt || typeof prompt !== "string") {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "Missing required field: prompt" }));
					return;
				}

				// Honor a user-selected provider/model (first), still falling back
				// across the free chain if it's rate-limited or blocked. The keyless
				// Pollinations leg guarantees a response even with no keys set.
				const normalizedPreferred =
					typeof preferredProvider === "string"
						? preferredProvider.trim().toLowerCase()
						: undefined;
				const requestedModel =
					typeof preferredModel === "string" && preferredModel.trim()
						? preferredModel.trim()
						: undefined;
				const order = devProviderOrder(normalizedPreferred);
				const errors: string[] = [];
				for (const name of order) {
					if (!devProviderAvailable(name)) continue;
					try {
						const result = await DEV_AI_PROVIDERS[name]({
							prompt,
							systemPrompt,
							maxTokens: maxTokens as number | undefined,
							model: name === normalizedPreferred ? requestedModel : undefined,
						});
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.end(
							JSON.stringify({
								success: true,
								text: result.text,
								model: result.model,
								usage: result.usage || {},
								provider: name,
							}),
						);
						return;
					} catch (err: unknown) {
						errors.push(
							`${name}: ${err instanceof Error ? err.message : "error"}`,
						);
					}
				}

				res.statusCode = 502;
				res.end(
					JSON.stringify({
						error:
							errors.length > 0
								? `All free AI providers failed. ${errors.join(" | ")}`
								: "No free AI provider configured.",
						available: false,
					}),
				);
			});
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => {
	const plugins = [
		react(),
		wasm(),
		devAIProxy(),
		// PWA plugin for better mobile experience
		VitePWA({
			injectRegister: null,
			registerType: "autoUpdate",
			workbox: {
				maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB precache limit
				globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
				globIgnores: ["**/generated/**"],
				runtimeCaching: [
					{
						urlPattern: /\.(?:wasm|glb|gltf|mp3|wav)$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "heavy-assets",
							expiration: {
								maxEntries: 30,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
							},
						},
					},
					{
						urlPattern: /\/generated\/.*\.(png|jpg|jpeg|webp|svg|json)$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "generated-assets",
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
							},
						},
					},
					{
						urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "supabase-api",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24, // 24 hours
							},
						},
					},
				],
			},
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
			manifest: {
				name: "Rift Ascendant",
				short_name: "Ascendant",
				description:
					"Rift Ascendant 5e SRD Companion - Compendium and Character Tool",
				theme_color: "#9b6dff",
				background_color: "#0a0a0a",
				display: "standalone",
				orientation: "any",
				categories: ["games", "entertainment"],
				start_url: "/",
				scope: "/",
				icons: [
					{
						src: "/icon-192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any maskable",
					},
					{
						src: "/icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
				shortcuts: [
					{
						name: "New Character",
						short_name: "New Char",
						description: "Create a new character",
						url: "/characters/new",
						icons: [{ src: "/icon-192.png", sizes: "192x192" }],
					},
					{
						name: "Dice Roller",
						short_name: "Dice",
						description: "Open dice roller",
						url: "/dice",
						icons: [{ src: "/icon-192.png", sizes: "192x192" }],
					},
					{
						name: "Compendium",
						short_name: "Compendium",
						description: "Browse compendium",
						url: "/compendium",
						icons: [{ src: "/icon-192.png", sizes: "192x192" }],
					},
				],
				screenshots: [],
			},
		}),
	];

	const normalizeId = (id: string) => id.replace(/\\/g, "/");

	return {
		server: {
			host: "::",
			port: 8080,
		},
		esbuild: {
			drop: _mode === "production" ? ["console", "debugger"] : [],
		},
		plugins,
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				// Force the ESM entry of @pollinations_ai/sdk in the browser build:
				// the package's `browser` export is an IIFE bundle whose named
				// exports (configure, chat, etc.) are not statically analyzable
				// by Rollup. Using the ESM entry preserves tree-shakeable exports.
				"@pollinations_ai/sdk": path.resolve(
					__dirname,
					"./node_modules/@pollinations_ai/sdk/dist/index.js",
				),
			},
			dedupe: ["react", "react-dom", "three"],
		},
		build: {
			chunkSizeWarningLimit: 4000,
			// Optimize for production and mobile
			minify: "esbuild",
			sourcemap: "hidden", // Hidden source maps for Sentry — not exposed to browsers
			// Mobile performance optimizations
			// Needed for wasm chunks that rely on top-level await.
			target: "es2022",
			cssCodeSplit: true,
			// Enable code splitting for better mobile performance
			rollupOptions: {
				output: {
					manualChunks(id) {
						// Split vendor chunks for better caching while avoiding circular deps.
						const normalizedId = normalizeId(id);

						if (
							normalizedId.includes("/src/components/dice/Dice3DScene") ||
							normalizedId.includes("/src/components/dice/Dice3D") ||
							normalizedId.includes("/src/components/dice/diceGeometry") ||
							normalizedId.includes("/src/lib/dice/audio")
						) {
							return "dice-3d";
						}
						if (normalizedId.includes("node_modules")) {
							// ── Core shared libraries MUST be checked first ──
							// These are imported by almost everything (including dice/3D code).
							// If isDiceDependency runs first it will incorrectly pull React,
							// the router, Radix UI, etc. into a dice-3d-* chunk, causing a
							// "Cannot access 'n' before initialization" TDZ crash at runtime.
							if (
								normalizedId.includes("/node_modules/react/") ||
								normalizedId.includes("/node_modules/react-dom/") ||
								normalizedId.includes("/node_modules/react-is/") ||
								normalizedId.includes("/node_modules/scheduler/")
							) {
								return "react-vendor";
							}
							if (
								normalizedId.includes("/node_modules/react-router/") ||
								normalizedId.includes("/node_modules/react-router-dom/")
							) {
								return "router-vendor";
							}
							if (normalizedId.includes("/@tanstack/")) return "query-vendor";
							if (normalizedId.includes("/node_modules/@dnd-kit/"))
								return "dnd-vendor";
							if (normalizedId.includes("/node_modules/zod/"))
								return "validation-vendor";
							if (normalizedId.includes("/node_modules/quill/"))
								return "editor-vendor";
							if (normalizedId.includes("/node_modules/date-fns/")) {
								return "date-vendor";
							}
							if (normalizedId.includes("/node_modules/lucide-react/"))
								return "icons-vendor";
							if (normalizedId.includes("/node_modules/dompurify/"))
								return "sanitize-vendor";
							if (
								normalizedId.includes("/@radix-ui/") ||
								normalizedId.includes("/@floating-ui/") ||
								normalizedId.includes("/node_modules/cmdk/") ||
								normalizedId.includes("/node_modules/vaul/") ||
								normalizedId.includes("/react-remove-scroll") ||
								normalizedId.includes("/react-dismissable-layer") ||
								normalizedId.includes("/aria-hidden") ||
								normalizedId.includes("/react-style-singleton") ||
								normalizedId.includes("/use-callback-ref") ||
								normalizedId.includes("/use-sidecar") ||
								normalizedId.includes("/use-sync-external-store") ||
								normalizedId.includes("/get-nonce/") ||
								normalizedId.includes("/tslib/")
							)
								return "ui-vendor";
							if (normalizedId.includes("/node_modules/@tsparticles/"))
								return "particles-vendor";
							if (
								normalizedId.includes("/node_modules/pixi.js/") ||
								normalizedId.includes("/node_modules/pixi-filters/") ||
								normalizedId.includes("/node_modules/@pixi/")
							) {
								return "pixi-vendor";
							}
							if (normalizedId.includes("/node_modules/howler/")) {
								return "media-vendor";
							}
							if (normalizedId.includes("/node_modules/framer-motion/"))
								return "motion-vendor";

							// ── 3D vendors ──
							if (normalizedId.includes("/node_modules/three/"))
								return "three-vendor";
							if (normalizedId.includes("/node_modules/three-stdlib/"))
								return "three-stdlib-vendor";
							if (normalizedId.includes("/node_modules/@react-three/"))
								return "react-three-vendor";
							if (normalizedId.includes("/node_modules/troika-"))
								return "react-three-vendor";
							if (normalizedId.includes("/node_modules/postprocessing/"))
								return "postprocessing-vendor";
							if (normalizedId.includes("/node_modules/@monogrid/gainmap-js/"))
								return "postprocessing-vendor";

							return "vendor";
						}
					},
				},
			},
		},
	};
});
