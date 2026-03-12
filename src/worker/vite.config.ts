import { defineConfig } from 'vite'
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    cloudflare()
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Flatten vendor chunks to avoid nested paths
        manualChunks: undefined,
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    }
  }
})
