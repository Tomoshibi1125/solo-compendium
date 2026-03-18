import { GoogleGenAI } from "@google/genai";
import react from "@vitejs/plugin-react-swc";
import { config as dotenvConfig } from "dotenv";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";

// Load .env for server-side use (GEMINI_API_KEY is not VITE_ prefixed)
dotenvConfig();

/**
 * Vite dev middleware plugin that mimics the Vercel serverless function
 * at /api/ai so AI features work during local development.
 */
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

				const apiKey = process.env.GEMINI_API_KEY;
				if (!apiKey) {
					res.statusCode = 503;
					res.end(
						JSON.stringify({
							error: "AI service not configured. Set GEMINI_API_KEY in .env",
							available: false,
						}),
					);
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

				const { prompt, systemPrompt, maxTokens } = body as {
					prompt?: string;
					systemPrompt?: string;
					maxTokens?: number;
				};

				if (!prompt || typeof prompt !== "string") {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "Missing required field: prompt" }));
					return;
				}

				const geminiModel = "gemini-2.5-flash";
				const ai = new GoogleGenAI({ apiKey });

				try {
					const response = await ai.models.generateContent({
						model: geminiModel,
						contents: prompt,
						config: {
							systemInstruction: systemPrompt,
							maxOutputTokens: Math.min((maxTokens as number) || 4096, 4096),
							temperature: 0.8,
						},
					});

					const text = response.text || "";

					if (!text.trim()) {
						res.statusCode = 502;
						res.end(
							JSON.stringify({
								error: "Gemini returned empty response",
								available: true,
							}),
						);
						return;
					}

					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.end(
						JSON.stringify({
							success: true,
							text,
							model: geminiModel,
							usage: {
								promptTokens: response.usageMetadata?.promptTokenCount,
								completionTokens: response.usageMetadata?.candidatesTokenCount,
								totalTokens: response.usageMetadata?.totalTokenCount,
							},
						}),
					);
				} catch (err: unknown) {
					if (err instanceof Error && err.name === "AbortError") {
						res.statusCode = 504;
						res.end(
							JSON.stringify({
								error: "Gemini request timed out",
								available: true,
							}),
						);
						return;
					}
					res.statusCode = 500;
					res.end(
						JSON.stringify({
							error:
								err instanceof Error ? err.message : "Internal proxy error",
							available: true,
						}),
					);
				}
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
				maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // Increased to 50MB to account for 3D dice collision models
				globPatterns: [
					"**/*.{js,css,html,ico,png,svg,webmanifest,wasm,glb,gltf,mp3,wav}",
				],
				globIgnores: ["**/generated/**"],
				runtimeCaching: [
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
				name: "System Ascendant",
				short_name: "Ascendant",
				description:
					"System Ascendant 5e SRD Companion - Compendium and Character Tool",
				theme_color: "#9b6dff",
				background_color: "#0a0a0a",
				display: "standalone",
				orientation: "portrait-primary",
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

	const diceEntryMatchers = [
		"/src/components/dice/Dice3DScene",
		"/src/components/dice/Dice3D",
		"/src/components/dice/diceGeometry",
		"/src/lib/dice/audio",
	];

	const normalizeId = (id: string) => id.replace(/\\/g, "/");

	const isDiceEntry = (id: string) =>
		diceEntryMatchers.some((needle) => id.includes(needle));

	return {
		server: {
			host: "::",
			port: 8080,
		},
		plugins,
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
			dedupe: ["react", "react-dom", "three"],
		},
		build: {
			chunkSizeWarningLimit: 4000,
			// Optimize for production and mobile
			minify: "esbuild",
			sourcemap: false, // Disabled due to Sentry issues
			// Mobile performance optimizations
			// Needed for wasm chunks that rely on top-level await.
			target: "es2022",
			cssCodeSplit: true,
			// Enable code splitting for better mobile performance
			rollupOptions: {
				output: {
					manualChunks(id, { getModuleInfo }) {
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
							if (normalizedId.includes("/@supabase/"))
								return "supabase-vendor";
							if (normalizedId.includes("/node_modules/@dnd-kit/"))
								return "dnd-vendor";
							if (
								normalizedId.includes("/node_modules/react-hook-form/") ||
								normalizedId.includes("/node_modules/@hookform/")
							) {
								return "forms-vendor";
							}
							if (normalizedId.includes("/node_modules/zod/"))
								return "validation-vendor";
							if (
								normalizedId.includes("/node_modules/@tiptap/") ||
								normalizedId.includes("/node_modules/prosemirror-") ||
								normalizedId.includes("/node_modules/@tiptap/pm/")
							)
								return "editor-vendor";
							if (normalizedId.includes("/node_modules/@nivo/"))
								return "charts-vendor";
							if (
								normalizedId.includes("/node_modules/date-fns/") ||
								normalizedId.includes("/node_modules/react-day-picker/")
							) {
								return "date-vendor";
							}
							if (normalizedId.includes("/node_modules/embla-carousel-react/"))
								return "carousel-vendor";
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
								normalizedId.includes("/node_modules/pixi-filters/")
							) {
								return "pixi-vendor";
							}
							if (
								normalizedId.includes("/node_modules/gsap/") ||
								normalizedId.includes("/node_modules/lottie-web/") ||
								normalizedId.includes("/node_modules/howler/")
							) {
								return "media-vendor";
							}
							if (normalizedId.includes("/node_modules/@react-pdf/"))
								return "pdf-vendor";
							if (normalizedId.includes("/node_modules/framer-motion/"))
								return "motion-vendor";
							if (normalizedId.includes("/node_modules/@react-spring/"))
								return "motion-vendor";

							// ── Remaining 3D / niche vendors ──
							if (
								normalizedId.includes("/node_modules/@react-three/xr/") ||
								normalizedId.includes("/node_modules/@pmndrs/xr/")
							) {
								return "xr-vendor";
							}
							if (
								normalizedId.includes("/node_modules/@react-three/cannon/") ||
								normalizedId.includes("/node_modules/cannon-es/")
							) {
								return "physics-vendor";
							}
							if (normalizedId.includes("/node_modules/three-mesh-bvh/"))
								return "three-bvh-vendor";
							if (normalizedId.includes("/node_modules/three.quarks/"))
								return "three-particles-vendor";
							if (normalizedId.includes("/node_modules/maath/"))
								return "three-math-vendor";
							if (normalizedId.includes("/node_modules/lamina/"))
								return "three-shaders-vendor";
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
							if (
								normalizedId.includes("/node_modules/@dimforge/rapier3d/") ||
								normalizedId.includes(
									"/node_modules/@dimforge/rapier3d-compat/",
								)
							) {
								return "rapier-vendor";
							}
							return "vendor";
						}
					},
				},
			},
		},
	};
});
