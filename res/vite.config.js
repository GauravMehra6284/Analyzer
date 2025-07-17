import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxImportSource: 'react',
  })],
  build: {
    outDir: '../frontend',
    assetsDir: 'assets',
    emptyOutDir: false,
  },
  base: '/',  // ✅ This will serve everything from http://localhost:5173/
});
