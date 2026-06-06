import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Build configuration for cross-browser compatibility
  build: {
    target: ['es2020', 'chrome87', 'firefox78', 'safari14', 'edge88'],
    cssTarget: ['chrome87', 'firefox78', 'safari14', 'edge88'],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  // Enforce port 5173 for Netlify dev proxy
  server: {
    port: 5173,
    strictPort: true, // Fail if port is in use rather than jumping to 5174
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      }
    }
  }
})
