import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

const host = process.env.VITE_DEV_HOST || "localhost";
const h5Port = process.env.VITE_DEV_PORT || 5173;
const apiPort = process.env.VITE_API_PORT || 10131;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  // esbuild: {
  //   drop: ['console', 'debugger'],
  // },
  server: {
    host,
    port: h5Port,
    proxy: {
      "/api": {
        target: `http://${host}:${apiPort}`,
        changeOrigin: true,
        // 保留 /api 前缀
      },
      "/static": {
        target: `http://${host}:${apiPort}`,
        changeOrigin: true,
        // 保留 /static 前缀
      },
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           return 'vendor';
  //         }
  //       },
  //     },
  //   },
  // },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
});
