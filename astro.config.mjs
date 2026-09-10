import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import editableRegions from "@cloudcannon/editable-regions/astro-integration";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.excelspt.com",
  devToolbar: { enabled: false },
  integrations: [react(), editableRegions(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
