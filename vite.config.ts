import path from "node:path";
import react from "@vitejs/plugin-react";
import { config as dotenvConfig } from "dotenv";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import { devSovereignProxy } from "./vite.sovereign-dev";

// Load server-only environment values used by the dedicated Sovereign dev route.
// quiet: suppress dotenv v17's promotional banner in every tool run.
dotenvConfig({ quiet: true });

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => {
	const plugins = [
		react(),
		wasm(),
		devSovereignProxy(),
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
			},
			dedupe: ["react", "react-dom", "three"],
		},
		build: {
			chunkSizeWarningLimit: 4000,
			minify: "esbuild",
			sourcemap: "hidden",
			target: "es2022",
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					codeSplitting: {
						includeDependenciesRecursively: false,
						groups: [
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
							{ name: "state-vendor", test: /node_modules[\\/]zustand[\\/]/ },
							{
								name: "gesture-vendor",
								test: /[\\/]@use-gesture[\\/]/,
							},
							{ name: "validation-vendor", test: /node_modules[\\/]zod[\\/]/ },
							{
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
								name: "motion-vendor",
								test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]|__vite-optional-peer-dep/,
							},
							{ name: "three-vendor", test: /node_modules[\\/]three[\\/]/ },
							{
								name: "three-stdlib-vendor",
								test: /node_modules[\\/]three-stdlib[\\/]/,
							},
							{
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
							{
								name: "pdf-vendor",
								test: /node_modules[\\/](pdf-lib|@pdf-lib|pako)[\\/]/,
							},
							{
								name: "analytics-vendor",
								test: /node_modules[\\/]posthog-js[\\/]/,
							},
							{
								name: "auth-ui-vendor",
								test: /[\\/]@supabase[\\/]auth-ui-(react|shared)[\\/]|node_modules[\\/](yup|@stitches|property-expr|tiny-case|toposort)[\\/]/,
							},
							{
								name: "markdown-vendor",
								test: /node_modules[\\/](react-markdown|unified|hastscript|vfile[^\\/]*|property-information|space-separated-tokens|comma-separated-tokens|trim-lines|devlop|style-to-js|style-to-object|inline-style-parser|html-url-attributes|bail|trough|is-plain-obj|extend|estree-util-is-identifier-name|ccount|markdown-table|longest-streak|zwitch|escape-string-regexp)[\\/]|node_modules[\\/](remark-|rehype-|micromark|mdast-|hast-|unist-|character-entities|decode-named-character-reference)|node_modules[\\/]@ungap[\\/]structured-clone[\\/]/,
							},
							{
								name: "forms-vendor",
								test: /node_modules[\\/](react-hook-form|@hookform)[\\/]/,
							},
							{
								name: "supabase-vendor",
								test: /[\\/]@supabase[\\/]|node_modules[\\/]iceberg-js[\\/]/,
							},
						],
					},
				},
			},
		},
	};
});
