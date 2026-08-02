import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // تنظیمات بهینه‌سازی برای جلوگیری از خطای three
    rollupOptions: {
      output: {
        // فقط React را به عنوان وابستگی جداگانه بسته‌بندی کن
        manualChunks: {
          'vendor-react': ['react', 'react-dom']
        }
      }
    }
  }
})
