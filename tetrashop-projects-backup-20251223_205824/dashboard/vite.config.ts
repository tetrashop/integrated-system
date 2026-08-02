import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build' // 🔄 تغییر مسیر خروجی از 'dist' به 'build'
  }
})
