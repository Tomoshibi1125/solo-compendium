import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    // PWA plugin for better mobile experience
    VitePWA({
      injectRegister: null,
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
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
        name: 'Solo Compendium',
        short_name: 'Solo Comp',
        description: 'Solo Leveling 5e Companion - Compendium and Character Tool',
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
      dedupe: ['react', 'react-dom'],
    },
    build: {
      chunkSizeWarningLimit: 1500,
      // Optimize for production and mobile
      minify: 'esbuild',
      sourcemap: false, // Disabled due to Sentry issues
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
      },
      // Mobile performance optimizations
      target: 'es2020',
      cssCodeSplit: true,
      // Enable code splitting for better mobile performance
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split vendor chunks for better caching while avoiding circular deps.
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('node_modules')) {
            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/react-is/') ||
              normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'react-vendor';
            }
              if (normalizedId.includes('/@radix-ui/')) return 'ui-vendor';
              if (
                normalizedId.includes('/three/') ||
                normalizedId.includes('/@react-three/') ||
                normalizedId.includes('/three-stdlib/') ||
                normalizedId.includes('/troika-')
              ) {
                return 'dice-3d-vendor';
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
