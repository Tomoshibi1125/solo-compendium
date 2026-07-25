import path from "node:path";
import react from "@vitejs/plugin-react";
import { config as dotenvConfig } from "dotenv";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import { normalizeImages, runProviderChain } from "./api/_aiProviders.js";

// Load .env for server-side use (GEMINI_API_KEY is not VITE_ prefixed)
// quiet: suppress dotenv v17's promotional banner in every tool run.
dotenvConfig({ quiet: true });

/**
 * Vite dev middleware that mimics the Vercel /api/ai serverless function during
 * local development. It calls the SAME shared free-provider chain as the Vercel
 * function (api/_aiProviders.js) — one source of truth, so dev and prod never
 * drift. Owns only the HTTP glue (CORS, body parse, response shaping).
 */
function devAIProxy(): Plugin {
	return {
		name: "dev-ai-proxy",
		configureServer(server) {
			server.middlewares.use("/api/ai", async (req, res) => {
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
					provider,
					model,
					images: rawImages,
				} = body as {
					prompt?: string;
					systemPrompt?: string;
					maxTokens?: number;
					provider?: string;
					model?: string;
					images?: unknown;
				};
				if (!prompt || typeof prompt !== "string") {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "Missing required field: prompt" }));
					return;
				}

				const normalizedImages = normalizeImages(rawImages);
				if (normalizedImages.error) {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: normalizedImages.error }));
					return;
				}

				const result = await runProviderChain({
					prompt,
					systemPrompt,
					maxTokens: maxTokens as number | undefined,
					provider,
					model,
					images: normalizedImages.images ?? [],
				});
				if (!result.ok) {
					res.statusCode = 502;
					res.end(JSON.stringify({ error: result.error, available: false }));
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify({
						success: true,
						text: result.text,
						model: result.model,
						usage: result.usage || {},
						provider: result.provider,
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
				globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,woff2}"],
				// Kept out of the precache manifest:
				// - generated/**: runtime-cached below (generated-assets)
				// - ui-art/**: precaching grabbed only the PNG <picture> fallbacks
				//   (~5 MB) while browsers actually request the webp/avif variants;
				//   the ui-art runtime route below caches what's really served.
				// - the 3D/PDF stack: multi-MB chunks with their own load paths
				//   (dice idle prefetch fills the assets-js runtime cache during any
				//   online session; PDF export loads on demand). Compendium DATA
				//   chunks (items parts included) stay precached on purpose — a
				//   table companion must browse its full compendium offline.
				globIgnores: [
					"**/generated/**",
					"ui-art/**",
					"assets/Dice3DScene-*.js",
					"assets/rapier-vendor-*.js",
					"assets/three-vendor-*.js",
					"assets/three-stdlib-vendor-*.js",
					"assets/react-three-vendor-*.js",
					"assets/postprocessing-vendor-*.js",
					"assets/mediapipe-vendor-*.js",
					"assets/media-vendor-*.js",
					"assets/pdf-vendor-*.js",
				],
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
						// Brand/hero art: <picture> serves webp/avif to modern
						// browsers with PNG as fallback — cache whichever is fetched.
						urlPattern: /\/ui-art\/.*\.(png|webp|avif|jpg|jpeg|svg)$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "ui-art",
							expiration: {
								maxEntries: 200,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
							},
						},
					},
					{
						// Hashed build chunks excluded from precache above; immutable
						// by name, so cache-first on first use keeps them offline.
						urlPattern: /\/assets\/.*\.js$/i,
						handler: "CacheFirst",
						options: {
							cacheName: "assets-js",
							expiration: {
								maxEntries: 60,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
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
			includeAssets: ["favicon.ico", "apple-touch-icon.png"],
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

	// Bundle analysis: ANALYZE=1 npm run build → audit-artifacts/bundle-stats.html
	if (process.env.ANALYZE) {
		plugins.push(
			visualizer({
				filename: "audit-artifacts/bundle-stats.html",
				gzipSize: true,
				brotliSize: true,
				template: "treemap",
			}) as Plugin,
		);
	}

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
			// Vendor grouping via rolldown's native codeSplitting groups.
			//
			// The previous rollup-style `manualChunks(id)` function was emulated by
			// rolldown with recursive dependency capture: each named group absorbed
			// its matched modules' shared dependencies (react-dom landed inside the
			// dice chunk, compendium helpers inside particles-vendor, ...), which
			// made unrelated chunks statically import multi-MB vendor chunks and
			// dragged ~10 MB of 3D/PDF/analytics code into the boot modulepreloads.
			//
			// codeSplitting groups with includeDependenciesRecursively:false assign
			// ONLY the matched modules, so lazy-route vendors stay lazy. Group order
			// decides ties (earlier wins), mirroring the old if-chain order.
			//
			// RULE (learned twice, Jul 3 markdown + Jul 4 quill): every group must
			// pin its package's ENTIRE runtime dependency subtree — especially CJS
			// deps. Unmatched deps scatter into the first app chunk that imports
			// them; the vendor chunk then reaches back into that app chunk at
			// module init through a chunk cycle, and the circular evaluation order
			// crashes every consumer route with "<minified> is not a function".
			// `npm run verify:chunks` (scripts/verify-chunk-init.mjs) enforces this
			// after every build: no vendor chunk may import a non-vendor chunk, and
			// every chunk must evaluate cleanly as an import-graph root.
			rollupOptions: {
				output: {
					codeSplitting: {
						includeDependenciesRecursively: false,
						groups: [
							// ── Core shared libraries first ──
							{
								name: "react-vendor",
								test: /node_modules[\\/](react|react-dom|react-is|scheduler)[\\/]/,
							},
							{
								name: "router-vendor",
								test: /node_modules[\\/]react-router(-dom)?[\\/]/,
							},
							{ name: "query-vendor", test: /[\\/]@tanstack[\\/]/ },
							{ name: "dnd-vendor", test: /node_modules[\\/]@dnd-kit[\\/]/ },
							// zustand is shared by app stores (boot) AND @react-three/fiber;
							// its own group keeps that edge vendor→vendor instead of letting
							// react-three-vendor reach into a boot app chunk.
							{ name: "state-vendor", test: /node_modules[\\/]zustand[\\/]/ },
							// @use-gesture is shared by app surfaces (VTT pan/pinch) AND drei.
							{
								name: "gesture-vendor",
								test: /[\\/]@use-gesture[\\/]/,
							},
							{ name: "validation-vendor", test: /node_modules[\\/]zod[\\/]/ },
							{
								// Full quill subtree: quill-delta's CJS deps (lodash.clonedeep/
								// lodash.isequal/fast-diff) otherwise scatter into the character
								// sheet chunk and editor-vendor calls their require factories at
								// init through a chunk cycle — "Qe is not a function" crashed
								// every character sheet in prod (Jul 4).
								name: "editor-vendor",
								test: /node_modules[\\/](quill|quill-delta|parchment|eventemitter3|fast-diff|lodash\.clonedeep|lodash\.isequal|lodash-es)[\\/]/,
							},
							{ name: "date-vendor", test: /node_modules[\\/]date-fns[\\/]/ },
							{
								name: "icons-vendor",
								test: /node_modules[\\/]lucide-react[\\/]/,
							},
							{
								name: "sanitize-vendor",
								test: /node_modules[\\/]dompurify[\\/]/,
							},
							{
								name: "ui-vendor",
								test: /[\\/]@radix-ui[\\/]|[\\/]@floating-ui[\\/]|node_modules[\\/](cmdk|vaul|aria-hidden|tslib)[\\/]|[\\/]react-remove-scroll|[\\/]react-dismissable-layer|[\\/]react-style-singleton|[\\/]use-callback-ref|[\\/]use-sidecar|[\\/]use-sync-external-store|[\\/]get-nonce[\\/]/,
							},
							{
								name: "particles-vendor",
								test: /node_modules[\\/]@tsparticles[\\/]/,
							},
							{
								name: "pixi-vendor",
								test: /node_modules[\\/](pixi\.js|pixi-filters)[\\/]|[\\/]@pixi[\\/]/,
							},
							{
								name: "media-vendor",
								test: /node_modules[\\/](howler|hls\.js)[\\/]/,
							},
							{
								// motion-dom/motion-utils are framer-motion's runtime; the
								// __vite-optional-peer-dep stub is its @emotion/is-prop-valid
								// virtual module.
								name: "motion-vendor",
								test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]|__vite-optional-peer-dep/,
							},

							// ── 3D vendors (all reached only via lazy dice/3D scenes) ──
							{ name: "three-vendor", test: /node_modules[\\/]three[\\/]/ },
							{
								name: "three-stdlib-vendor",
								test: /node_modules[\\/]three-stdlib[\\/]/,
							},
							{
								// Includes drei/fiber's full runtime subtree (@babel/runtime is
								// CJS and only consumed by this stack).
								name: "react-three-vendor",
								test: /node_modules[\\/](@react-three|@babel[\\/]runtime|troika-three-text|troika-worker-utils|troika-three-utils|three-mesh-bvh|camera-controls|maath|detect-gpu|stats-gl|stats\.js|meshline|glsl-noise|suspend-react|its-fine|bidi-js|react-use-measure|tunnel-rat|webgl-sdf-generator)[\\/]/,
							},
							{
								name: "postprocessing-vendor",
								test: /node_modules[\\/](postprocessing|@monogrid)[\\/]/,
							},
							{
								name: "mediapipe-vendor",
								test: /node_modules[\\/]@mediapipe[\\/]/,
							},
							{
								name: "rapier-vendor",
								test: /node_modules[\\/]@dimforge[\\/]/,
							},

							// ── Lazy-feature vendors (PDF export, analytics consent,
							// login screen, markdown surfaces) ──
							{
								name: "pdf-vendor",
								test: /node_modules[\\/](pdf-lib|@pdf-lib|pako)[\\/]/,
							},
							{
								name: "analytics-vendor",
								test: /node_modules[\\/]posthog-js[\\/]/,
							},
							{
								// property-expr/tiny-case/toposort are yup's CJS deps; left
								// unpinned they scattered into an app chunk and crashed the
								// login route at init ("Be is not a function").
								name: "auth-ui-vendor",
								test: /[\\/]@supabase[\\/]auth-ui-(react|shared)[\\/]|node_modules[\\/](yup|@stitches|property-expr|tiny-case|toposort)[\\/]/,
							},
							{
								// The whole react-markdown/unified subtree must live in ONE
								// leaf chunk. Small helpers left off this list (style-to-object
								// + inline-style-parser are CJS) otherwise scatter into whatever
								// lazy app chunk imports them first; markdown-vendor then does a
								// cross-chunk `__toESM(require())` against that app chunk, which
								// has a back-edge to markdown-vendor — the circular init order
								// leaves the CJS factory undefined ("Hr is not a function") and
								// crashes every markdown surface (compendium detail, etc.).
								// ccount/markdown-table/longest-streak/zwitch/escape-string-regexp
								// are the remark-gfm helpers that scattered next (Jul 4).
								name: "markdown-vendor",
								test: /node_modules[\\/](react-markdown|unified|hastscript|vfile[^\\/]*|property-information|space-separated-tokens|comma-separated-tokens|trim-lines|devlop|style-to-js|style-to-object|inline-style-parser|html-url-attributes|bail|trough|is-plain-obj|extend|estree-util-is-identifier-name|ccount|markdown-table|longest-streak|zwitch|escape-string-regexp)[\\/]|node_modules[\\/](remark-|rehype-|micromark|mdast-|hast-|unist-|character-entities|decode-named-character-reference)|node_modules[\\/]@ungap[\\/]structured-clone[\\/]/,
							},
							{
								name: "forms-vendor",
								test: /node_modules[\\/](react-hook-form|@hookform)[\\/]/,
							},
							// Supabase client core: needed at boot, but versioned
							// independently of app code — its own chunk caches better.
							// iceberg-js is @supabase/storage-js's CJS dep — unpinned it
							// scattered into the app client chunk (vendor→app cycle).
							{
								name: "supabase-vendor",
								test: /[\\/]@supabase[\\/]|node_modules[\\/]iceberg-js[\\/]/,
							},

							// NO node_modules catch-all on purpose: a catch-all "vendor"
							// chunk sits in the boot graph (it holds boot libs like the
							// toaster), so any lazy-only lib that fell into it dragged its
							// vendor deps (three, auth-ui, react-hook-form) into the boot
							// modulepreloads. Unmatched modules follow natural splitting:
							// boot libs join shared boot chunks, lazy libs stay with their
							// lazy importers.
						],
					},
				},
			},
		},
	};
});
