import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from the custom domain root (https://www.nammafishmart.com), so the
// base is "/". (It must NOT be "/nammafishmart.com/" — that is only correct for
// the username.github.io/<repo>/ project-page URL, and would 404 every asset on
// the custom domain, producing a blank page.)
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
});
