import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";


// https://vitejs.dev/config/
export default defineConfig({
 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure:false,
      },
    },
  },
  plugins: [react(),svgr()],
})
