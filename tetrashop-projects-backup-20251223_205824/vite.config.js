import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // نادیده گرفتن تمام پوشه‌های مشکل‌ساز
      ignored: [
        '**/intelligent-writer-backup-20251021/**',
        '**/secret-garden/**',
        '**/projects/intelligent-writer-backup-20251021/**',
        '**/node_modules/**',
      ]
    }
  }
})
