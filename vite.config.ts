import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "assets",
  server: {
    proxy: {
      "/api/public-stats": { target: "https://api.norisk.gg", changeOrigin: true, rewrite: () => "/api/v1/core/stats/uniquePlayers24h" },
      "/api/news": { target: "https://blog.norisk.gg", changeOrigin: true, rewrite: () => "/wp-json/wp/v2/posts?categories=21%2C2&per_page=10&page=1" },
      "/skins": { target: "https://mc-heads.net", changeOrigin: true, rewrite: () => "/skin/SirKnubble" },
      "/avatars": { target: "https://mc-heads.net", changeOrigin: true, rewrite: () => "/avatar/SirKnubble/64" },
      "/body": { target: "https://mc-heads.net", changeOrigin: true, rewrite: () => "/body/SirKnubble/600" },
    },
  },
});
