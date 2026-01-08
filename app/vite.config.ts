import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";

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
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://railway-control.local:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
