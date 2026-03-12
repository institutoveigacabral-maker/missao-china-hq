import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const shouldAnalyze = env.ANALYZE === 'true' || process.env.ANALYZE === 'true'

  return {
    plugins: [
      ...mochaPlugins(process.env as any),
      react({
        // React optimizations
        babel: {
          plugins: [
            // Remove console.log in production
            ...(isProduction 
              ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
              : []
            ),
          ],
        },
      }),
      cloudflare(),
      
      // Bundle analyzer
      shouldAnalyze && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // sunburst, treemap, network
      }),
    ].filter(Boolean),

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/react-app/components'),
        '@utils': resolve(__dirname, 'src/react-app/utils'),
        '@hooks': resolve(__dirname, 'src/react-app/hooks'),
        '@pages': resolve(__dirname, 'src/react-app/pages'),
        '@providers': resolve(__dirname, 'src/react-app/providers'),
        '@contexts': resolve(__dirname, 'src/react-app/contexts'),
      },
    },

    // Development server
    server: {
      port: 5173,
      open: false,
      cors: true,
      host: true,
      hmr: {
        port: 5173,
      },
    },

    // Preview server (for production builds)
    preview: {
      port: 4173,
      cors: true,
      strictPort: true,
    },

    // Build optimizations
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      
      // Source maps only for staging
      sourcemap: mode === 'staging' || process.env.NODE_ENV === 'development',
      
      // Minification
      minify: 'esbuild',
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk optimization
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React ecosystem
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              
              // Router
              if (id.includes('react-router')) {
                return 'router'
              }
              
              // UI libraries
              if (id.includes('lucide-react') || id.includes('@headlessui')) {
                return 'ui-vendor'
              }
              
              // Forms
              if (id.includes('react-hook-form') || id.includes('zod')) {
                return 'forms'
              }
              
              // Charts
              if (id.includes('recharts') || id.includes('d3')) {
                return 'charts'
              }
              
              // Date utilities
              if (id.includes('date-fns')) {
                return 'date-utils'
              }
              
              // Search & Command
              if (id.includes('fuse.js') || id.includes('cmdk')) {
                return 'search-utils'
              }
              
              // Toast & notifications
              if (id.includes('react-hot-toast')) {
                return 'notifications'
              }
              
              // Hotkeys
              if (id.includes('react-hotkeys-hook')) {
                return 'hotkeys'
              }
              
              // Hono framework
              if (id.includes('hono')) {
                return 'hono'
              }
              
              // Other vendors
              return 'vendor'
            }
            
            // Feature-based chunks
            if (id.includes('src/react-app/pages/')) {
              const pageName = id.split('src/react-app/pages/')[1].split('/')[0].split('.')[0]
              return `page-${pageName.toLowerCase()}`
            }
            
            if (id.includes('src/react-app/components/')) {
              // Group large component libraries
              if (id.includes('Charts/') || id.includes('Maps/') || id.includes('Touch/')) {
                const folder = id.split('src/react-app/components/')[1].split('/')[0]
                return `components-${folder.toLowerCase()}`
              }
              return 'components'
            }
            
            if (id.includes('src/react-app/utils/')) {
              return 'utils'
            }
            
            if (id.includes('src/react-app/hooks/')) {
              return 'hooks'
            }
          },
          
          // Optimize file names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              if (facadeModuleId.includes('src/react-app/pages/')) {
                const pageName = facadeModuleId.split('src/react-app/pages/')[1].split('/')[0].split('.')[0]
                return `assets/pages/${pageName.toLowerCase()}-[hash].js`
              }
              if (facadeModuleId.includes('src/react-app/components/')) {
                return `assets/components/[name]-[hash].js`
              }
            }
            
            if (chunkInfo.name?.includes('vendor')) {
              return `assets/vendor/[name]-[hash].js`
            }
            
            return 'assets/chunks/[name]-[hash].js'
          },
          
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            
            if (ext === 'css') {
              return 'assets/styles/[name]-[hash][extname]'
            }
            
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            
            return 'assets/misc/[name]-[hash][extname]'
          },
        },
        
        // External dependencies (for library builds)
        external: isProduction ? [] : [],
      },
    },

    // ESBuild optimizations
    esbuild: {
      // Drop debugging in production
      drop: isProduction ? ['console', 'debugger'] : [],
      
      // Legal comments
      legalComments: 'none',
      
      // Target modern browsers
      target: 'es2020',
    },

    // CSS optimizations
    css: {
      // PostCSS config will be auto-detected from postcss.config.js
      devSourcemap: !isProduction,
      
      // CSS modules (if needed)
      modules: {
        localsConvention: 'camelCase',
      },
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'unknown'),
      __DEV__: JSON.stringify(!isProduction),
    },

    // Performance optimizations
    optimizeDeps: {
      entries: ['src/react-app/main.tsx'],
      include: [
        'react',
        'react-dom',
        'react-router',
        'lucide-react',
        'react-hot-toast',
        'zod',
        'hono',
        'cmdk',
        'fuse.js',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },
  }
})