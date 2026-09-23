import type { APIRoute } from "astro";
import { services } from "../data/excel";
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", ...services.map((s) => `/services/${s.slug}/`)].map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("\n")}
</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
