import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";
import { VitePWA } from "vite-plugin-pwa";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";

dns.setDefaultResultOrder("verbatim");
// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../api/dist/",
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    mockDevServerPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Model Railway Control",
        short_name: "Railway Control",
        description: "Point control for model railway",
        theme_color: "#000000",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://railway-control.local",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
