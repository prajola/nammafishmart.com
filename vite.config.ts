import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site is served from /<repo>/ — set the base for
// production builds so assets and routes resolve correctly. Local dev
// stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/nammafishmart.com/" : "/",
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
}));
