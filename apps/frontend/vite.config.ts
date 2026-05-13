import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "dist",
  },
  // 打包开启该配置
  esbuild:
    command === "build"
      ? {
          drop: ["console"],
        }
      : {},
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
}));
