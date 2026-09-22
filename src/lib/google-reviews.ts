export const googleReviewsUrl =
  "https://www.google.com/maps/place/Excel+Sports+Performance+Therapy/@36.2436407,-86.6384317,721m/data=!3m1!1e3!4m8!3m7!1s0x886441b2d1445493:0x554e5eb8e948a8b2!8m2!3d36.2436364!4d-86.6358568!9m1!1b1!16s%2Fg%2F11m6rv875d?entry=ttu";

export function getReviewSummary(rating: unknown, count: unknown) {
  if (
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof count !== "number" ||
    !Number.isSafeInteger(count) ||
    count < 1
  )
    return null;

  const score = rating.toFixed(1);
  const reviews = `${count.toLocaleString("en-US")} ${count === 1 ? "review" : "reviews"}`;
  return {
    score,
    reviews,
    unfilledPercent: 100 - (rating / 5) * 100,
    label: `${score} out of 5 from ${reviews} on Google Maps. Read reviews (opens in a new tab).`,
  };
}

export function safeAttributionUrl(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export async function withDeadline<T>(
  request: Promise<T>,
  milliseconds = 10000,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Google reviews request timed out")),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
