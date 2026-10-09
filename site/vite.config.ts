import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Served at the root of research.jawafdehi.org, so "/" is right everywhere.
// `BASE_PATH` stays as an override for the case of hosting under a sub-path again.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // These pages call the real react-i18next API so they can move into the
      // jawafdehi.org SPA unedited. Here that name resolves to a small shim.
      // To move: drop this alias (and the tsconfig `paths` entry beside it) and
      // install the library — the imports already point at the right thing.
      "react-i18next": path.resolve(__dirname, "./src/lib/i18n-shim.ts"),
    },
  },
  server: {
    port: 5173,
    // The quick Cloudflare tunnel proxies in under a *.trycloudflare.com host, which
    // Vite rejects as a DNS-rebinding risk unless it is allowed. The tunnel URL is
    // random per run, so the wildcard is the only workable form. Dev server only.
    allowedHosts: [".trycloudflare.com"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
