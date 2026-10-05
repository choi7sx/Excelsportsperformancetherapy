import type { APIRoute } from "astro";
import { services } from "../data/excel";
import { getBlogPosts } from "../lib/blog";
import { getEntry } from "astro:content";
export const GET: APIRoute = async ({ site }) => {
  const posts = await getBlogPosts();
  const blogPage = await getEntry("pages", "blog");
  const lastModified = new Map(posts.map((post) => [
    `/blog/${post.id}/`, new Date(post.data.date_modified || post.data.post_hero.date).toISOString(),
  ]));
  const isSelfCanonical = (canonical: string | null | undefined, path: string) =>
    !canonical || new URL(canonical, site).href === new URL(path, site).href;
  const paths = ["/", ...services.map((s) => `/services/${s.slug}/`),
    ...(blogPage?.data.seo?.no_index || !isSelfCanonical(blogPage?.data.seo?.canonical_url, "/blog/") ? [] : ["/blog/"]),
    ...posts.filter((post) => !post.data.seo?.no_index && isSelfCanonical(post.data.seo?.canonical_url, `/blog/${post.id}/`)).map((post) => `/blog/${post.id}/`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `<url><loc>${new URL(path, site).href}</loc>${lastModified.has(path) ? `<lastmod>${lastModified.get(path)}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
