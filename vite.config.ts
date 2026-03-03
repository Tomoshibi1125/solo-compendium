import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import { config as dotenvConfig } from "dotenv";

// Load .env for server-side use (GEMINI_API_KEY is not VITE_ prefixed)
dotenvConfig();

/**
 * Vite dev middleware plugin that mimics the Vercel serverless function
 * at /api/ai so AI features work during local development.
 */
function devAIProxy(): Plugin {
  return {
    name: 'dev-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 503;
          res.end(JSON.stringify({
            error: 'AI service not configured. Set GEMINI_API_KEY in .env',
            available: false,
          }));
          return;
        }

        // Read body
        let rawBody = '';
        await new Promise<void>((resolve) => {
          req.on('data', (chunk: Buffer) => { rawBody += chunk.toString(); });
          req.on('end', resolve);
        });

        let body: Record<string, unknown>;
        try {
          body = JSON.parse(rawBody);
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        const { prompt, systemPrompt, maxTokens } = body as {
          prompt?: string;
          systemPrompt?: string;
          maxTokens?: number;
        };

        if (!prompt || typeof prompt !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing required field: prompt' }));
          return;
        }

        const geminiModel = 'gemini-2.0-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

        const geminiBody: Record<string, unknown> = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: Math.min((maxTokens as number) || 4096, 4096),
            temperature: 0.8,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        };

        if (systemPrompt && typeof systemPrompt === 'string') {
          geminiBody.systemInstruction = { parts: [{ text: systemPrompt }] };
        }

        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiBody),
            signal: controller.signal,
          });

          clearTimeout(timer);

          const data = await response.json() as Record<string, unknown>;

          if (!response.ok) {
            const errorData = data as { error?: { message?: string } };
            res.statusCode = 502;
            res.end(JSON.stringify({
              error: errorData?.error?.message || `Gemini API error: ${response.status}`,
              available: true,
            }));
            return;
          }

          const text = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text || '';

          if (!text.trim()) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'Gemini returned empty response', available: true }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            text,
            model: geminiModel,
            usage: {
              promptTokens: (data as any)?.usageMetadata?.promptTokenCount,
              completionTokens: (data as any)?.usageMetadata?.candidatesTokenCount,
              totalTokens: (data as any)?.usageMetadata?.totalTokenCount,
            },
          }));
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            res.statusCode = 504;
            res.end(JSON.stringify({ error: 'Gemini request timed out', available: true }));
            return;
          }
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal proxy error', available: true }));
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
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,wasm}'],
        globIgnores: ['**/generated/**'],
        runtimeCaching: [
          {
            urlPattern: /\/generated\/.*\.(png|jpg|jpeg|webp|svg|json)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'generated-assets',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 14 // 14 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'System Ascendant',
        short_name: 'Ascendant',
        description: 'System Ascendant 5e SRD Companion - Compendium and Character Tool',
        theme_color: '#9b6dff',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['games', 'entertainment'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
  ];

  const diceEntryMatchers = [
    '/src/components/dice/Dice3DScene',
    '/src/components/dice/Dice3D',
    '/src/components/dice/diceGeometry',
    '/src/lib/dice/audio',
  ];

  const normalizeId = (id: string) => id.replace(/\\/g, '/');

  const isDiceEntry = (id: string) =>
    diceEntryMatchers.some((needle) => id.includes(needle));

  const isDiceDependency = (
    id: string,
    getModuleInfo: (id: string) => { importers?: string[] } | null,
    seen = new Set<string>()
  ): boolean => {
    if (seen.has(id)) return false;
    seen.add(id);
    const info = getModuleInfo(id);
    if (!info?.importers?.length) return false;
    for (const importer of info.importers) {
      const normalizedImporter = normalizeId(importer);
      if (isDiceEntry(normalizedImporter)) return true;
      if (isDiceDependency(importer, getModuleInfo, seen)) return true;
    }
    return false;
  };


  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@dimforge/rapier3d-compat": path.resolve(__dirname, "./src/lib/rapierCompat.ts"),
      },
      dedupe: ['react', 'react-dom', '@dimforge/rapier3d', '@dimforge/rapier3d-compat', 'three'],
    },
    build: {
      chunkSizeWarningLimit: 1500,
      // Optimize for production and mobile
      minify: 'esbuild',
      sourcemap: false, // Disabled due to Sentry issues
      // Mobile performance optimizations
      // Needed for wasm chunks that rely on top-level await.
      target: 'es2022',
      cssCodeSplit: true,
      // Enable code splitting for better mobile performance
      rollupOptions: {
        output: {
          manualChunks(id, { getModuleInfo }) {
            // Split vendor chunks for better caching while avoiding circular deps.
            const normalizedId = normalizeId(id);
            if (normalizedId.includes('/src/components/dice/Dice3DScene')) {
              return 'dice-3d-scene';
            }
            if (
              normalizedId.includes('/src/components/dice/Dice3D') ||
              normalizedId.includes('/src/components/dice/diceGeometry') ||
              normalizedId.includes('/src/lib/dice/audio')
            ) {
              return 'dice-3d';
            }
            if (normalizedId.includes('node_modules')) {
              if (isDiceDependency(id, getModuleInfo)) {
                if (normalizedId.includes('/node_modules/three/examples/')) return 'dice-3d-three-examples';
                if (normalizedId.includes('/node_modules/three-stdlib/controls/')) return 'dice-3d-stdlib-controls';
                if (normalizedId.includes('/node_modules/three-stdlib/loaders/')) return 'dice-3d-stdlib-loaders';
                if (normalizedId.includes('/node_modules/three-stdlib/shaders/')) return 'dice-3d-stdlib-shaders';
                if (normalizedId.includes('/node_modules/three-stdlib/libs/')) return 'dice-3d-stdlib-libs';
                if (normalizedId.includes('/node_modules/three-stdlib/utils/')) return 'dice-3d-stdlib-utils';
                if (normalizedId.includes('/node_modules/three-stdlib/')) return 'dice-3d-stdlib';
                if (normalizedId.includes('/node_modules/three/')) return 'dice-3d-three';
                if (normalizedId.includes('/node_modules/@react-three/rapier/')) return 'dice-3d-rapier';
                if (normalizedId.includes('/node_modules/@react-three/fiber/')) return 'dice-3d-fiber';
                if (normalizedId.includes('/node_modules/@react-three/drei/')) return 'dice-3d-drei';
                if (normalizedId.includes('/node_modules/@react-three/postprocessing/')) return 'dice-3d-postprocessing';
                if (normalizedId.includes('/node_modules/postprocessing/')) return 'dice-3d-postprocessing';
                if (normalizedId.includes('/node_modules/@dimforge/rapier3d/')) return 'dice-3d-rapier';
                if (normalizedId.includes('/node_modules/@dimforge/rapier3d-compat/')) return 'dice-3d-rapier';
                return 'dice-3d-vendor';
              }
              if (
                normalizedId.includes('/node_modules/react/') ||
                normalizedId.includes('/node_modules/react-dom/') ||
                normalizedId.includes('/node_modules/react-is/') ||
                normalizedId.includes('/node_modules/scheduler/')
              ) {
                return 'react-vendor';
              }
              if (normalizedId.includes('/node_modules/react-router/') || normalizedId.includes('/node_modules/react-router-dom/')) {
                return 'router-vendor';
              }
              if (normalizedId.includes('/node_modules/@dnd-kit/')) return 'dnd-vendor';
              if (normalizedId.includes('/node_modules/react-hook-form/') || normalizedId.includes('/node_modules/@hookform/')) {
                return 'forms-vendor';
              }
              if (normalizedId.includes('/node_modules/zod/')) return 'validation-vendor';
              if (normalizedId.includes('/node_modules/quill/')) return 'editor-vendor';
              if (normalizedId.includes('/node_modules/recharts/')) return 'charts-vendor';
              if (normalizedId.includes('/node_modules/date-fns/') || normalizedId.includes('/node_modules/react-day-picker/')) {
                return 'date-vendor';
              }
              if (normalizedId.includes('/node_modules/embla-carousel-react/')) return 'carousel-vendor';
              if (normalizedId.includes('/node_modules/lucide-react/')) return 'icons-vendor';
              if (normalizedId.includes('/node_modules/dompurify/')) return 'sanitize-vendor';
              if (normalizedId.includes('/@radix-ui/')) return 'ui-vendor';
              if (normalizedId.includes('/node_modules/@tsparticles/')) return 'particles-vendor';
              if (normalizedId.includes('/node_modules/pixi.js/') || normalizedId.includes('/node_modules/pixi-filters/')) {
                return 'pixi-vendor';
              }
              if (
                normalizedId.includes('/node_modules/gsap/') ||
                normalizedId.includes('/node_modules/lottie-web/') ||
                normalizedId.includes('/node_modules/howler/')
              ) {
                return 'media-vendor';
              }
              if (
                normalizedId.includes('/node_modules/@react-three/xr/') ||
                normalizedId.includes('/node_modules/@pmndrs/xr/')
              ) {
                return 'xr-vendor';
              }
              if (
                normalizedId.includes('/node_modules/@react-three/cannon/') ||
                normalizedId.includes('/node_modules/cannon-es/')
              ) {
                return 'physics-vendor';
              }
              if (normalizedId.includes('/node_modules/framer-motion/')) return 'motion-vendor';
              if (normalizedId.includes('/node_modules/three-mesh-bvh/')) return 'three-bvh-vendor';
              if (normalizedId.includes('/node_modules/three.quarks/')) return 'three-particles-vendor';
              if (normalizedId.includes('/node_modules/maath/')) return 'three-math-vendor';
              if (normalizedId.includes('/node_modules/lamina/')) return 'three-shaders-vendor';
              if (normalizedId.includes('/node_modules/@react-spring/')) return 'motion-vendor';
              if (normalizedId.includes('/node_modules/three/')) return 'three-vendor';
              if (normalizedId.includes('/node_modules/three-stdlib/')) return 'three-stdlib-vendor';
              if (normalizedId.includes('/node_modules/@react-three/')) return 'react-three-vendor';
              if (normalizedId.includes('/node_modules/troika-')) return 'react-three-vendor';
              if (normalizedId.includes('/node_modules/postprocessing/')) return 'postprocessing-vendor';
              if (normalizedId.includes('/node_modules/@monogrid/gainmap-js/')) return 'postprocessing-vendor';
              if (
                normalizedId.includes('/node_modules/@dimforge/rapier3d/') ||
                normalizedId.includes('/node_modules/@dimforge/rapier3d-compat/')
              ) {
                return 'rapier-vendor';
              }
              if (normalizedId.includes('/@tanstack/')) return 'query-vendor';
              if (normalizedId.includes('/@supabase/')) return 'supabase-vendor';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});


