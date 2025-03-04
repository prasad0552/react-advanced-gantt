import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactAdvancedGantt',
      fileName: (format) => `react-advanced-gantt.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'date-fns', 'html-to-image', 'lucide-react', 'zustand'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'date-fns': 'dateFns',
          'html-to-image': 'htmlToImage',
          'lucide-react': 'lucideReact',
          'zustand': 'zustand'
        },
      },
    },
  },
});