import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  publicDir: "../public",
  build: {
    outDir: "../docs",
    rollupOptions: {
      input: {
        main: "./src/index.html",
        store: "./src/store.html",
      },
    },
  },
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
      },
    }),
  ],
});
