import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";

/**
 * GitHub Pages serves static files only — it has no SPA rewrite, so a deep link like
 * /over-time is a miss and returns 404.html. Shipping a copy of index.html under that
 * name makes Pages hand the request to the app, which then routes it client-side.
 * Without this, every link into the site except the root is broken for anyone who
 * arrives from outside — and it looks fine locally, because the dev server rewrites.
 *
 * .nojekyll stops Pages running the output through Jekyll, which would drop any
 * asset directory beginning with an underscore.
 */
function githubPagesFallback(): Plugin {
  return {
    name: "github-pages-fallback",
    apply: "build",
    closeBundle() {
      const out = path.resolve(__dirname, "dist");
      fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
      fs.writeFileSync(path.join(out, ".nojekyll"), "");
    },
  };
}

// GitHub Pages serves a project site from a sub-path, so assets must be requested
// relative to it. `BASE_PATH` lets the Pages workflow set it without editing this
// file, and leaves dev + the Cloudflare tunnel on "/" where a sub-path would only
// get in the way.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react(), githubPagesFallback()],
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
