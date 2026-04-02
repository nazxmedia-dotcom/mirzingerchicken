import { copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Copy root-level deploy files into dist (no HTML/SEO changes). */
function copyRootFiles(files) {
  return {
    name: "copy-root-files",
    closeBundle() {
      const outDir = resolve(__dirname, "dist");
      for (const f of files) {
        const from = resolve(__dirname, f);
        if (existsSync(from)) copyFileSync(from, resolve(outDir, f));
      }
    },
  };
}

export default defineConfig({
  appType: "mpa",
  root: __dirname,
  publicDir: false,
  plugins: [
    copyRootFiles([
      "sitemap.xml",
      "robots.txt",
      "CNAME",
      "script.js",
      "menu-data.js",
      "menu-page.js",
    ]),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        menu: resolve(__dirname, "menu.html"),
        order: resolve(__dirname, "order.html"),
        contact: resolve(__dirname, "contact.html"),
        halal: resolve(__dirname, "halal.html"),
      },
    },
  },
});
