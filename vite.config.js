import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "My Vite PWA",
        short_name: "Vite PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "myexamperp192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "myexamperp512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    host: true,
  },
});
