import { defineConfig } from "astro/config";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  experimental: {
    directRenderScript: true,
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind(),
    react({
      include: ["**/react/*"],
    }),
  ],
  vite: {
    plugins: [TanStackRouterVite()],
  },
});
