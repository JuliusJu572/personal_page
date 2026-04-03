import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// https://vite.dev/config/
export default defineConfig({
  base: '/lucencia/',
  plugins: [react()],
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
})
