import { getCollection, type CollectionEntry } from "astro:content";

export async function getBlogPosts(): Promise<CollectionEntry<"blog">[]> {
  return (await getCollection("blog")).sort((a, b) =>
    new Date(b.data.post_hero.date).getTime() - new Date(a.data.post_hero.date).getTime()
    || a.id.localeCompare(b.id),
  );
}

export function formatPostDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago",
  });
}
