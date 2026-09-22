import {
  getReviewSummary,
  safeAttributionUrl,
  withDeadline,
} from "../lib/google-reviews";

async function fetchGoogleReviews(apiKey: string, placeId: string) {
  const { setOptions, importLibrary } =
    await import("@googlemaps/js-api-loader");
  setOptions({ key: apiKey, v: "quarterly", language: "en", region: "US" });
  const { Place } = await importLibrary("places");
  const place = new Place({ id: placeId });
  // Request only the live aggregate, not individual reviews or reviewer details.
  await place.fetchFields({ fields: ["rating", "userRatingCount"] });
  return place;
}

export async function initializeGoogleReviews(root: HTMLElement) {
  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const placeId = import.meta.env.PUBLIC_GOOGLE_PLACE_ID?.trim();
  if (!apiKey || !placeId || root.dataset.initialized) return;
  root.dataset.initialized = "true";

  const link = root.querySelector<HTMLAnchorElement>("[data-review-link]");
  const fallback = root.querySelector<HTMLElement>("[data-review-fallback]");
  const live = root.querySelector<HTMLElement>("[data-review-live]");
  const score = root.querySelector<HTMLElement>("[data-review-score]");
  const count = root.querySelector<HTMLElement>("[data-review-count]");
  const stars = root.querySelector<SVGElement>("[data-review-stars]");
  const providers = root.querySelector<HTMLElement>(
    "[data-review-attributions]",
  );
  if (!link || !fallback || !live || !score || !count || !stars || !providers)
    return;

  try {
    const place = await withDeadline(fetchGoogleReviews(apiKey, placeId));
    const summary = getReviewSummary(place.rating, place.userRatingCount);
    if (!summary) return;

    // Render provider names as text and allow only normal web links.
    const attributionItems = (place.attributions ?? []).flatMap(
      (attribution) => {
        if (!attribution.provider) return [];
        const url = safeAttributionUrl(attribution.providerURI);
        const item = document.createElement(url ? "a" : "span");
        item.textContent = attribution.provider;
        if (item instanceof HTMLAnchorElement && url) {
          item.href = url;
          item.target = "_blank";
          item.rel = "noopener noreferrer";
        }
        return [item];
      },
    );
    providers.replaceChildren(...attributionItems);
    providers.hidden = attributionItems.length === 0;
    score.textContent = summary.score;
    count.textContent = `(${summary.reviews})`;
    stars.style.clipPath = `inset(0 ${summary.unfilledPercent}% 0 0)`;
    link.setAttribute("aria-label", summary.label);
    fallback.hidden = true;
    live.hidden = false;
    root.dataset.state = "live";
  } catch {
    // Keep a usable Maps link on missing access, blocked scripts, timeout, or outage.
    root.dataset.state = "unavailable";
    if (import.meta.env.DEV) {
      console.warn(
        "Google reviews unavailable. Check the API key, Place ID, enabled APIs, billing, and website restrictions. See docs/google-reviews.md.",
      );
    }
  }
}
