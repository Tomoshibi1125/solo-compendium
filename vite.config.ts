import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => {
  const plugins = [
    react(),
    wasm(),
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
        theme_color: '#3b82f6',
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


