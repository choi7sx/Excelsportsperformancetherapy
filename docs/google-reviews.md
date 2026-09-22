# Google reviews badge

The homepage badge sits above “Chiropractic & sports rehab · Nashville, TN” and links directly to the Google Maps reviews tab supplied for Excel's Old Hickory listing. It uses Excel's blue stars, font, and link styling.

**Status:** the integration is implemented, but live ratings are disabled until the two configuration values below are supplied. Without configuration, JavaScript, or a successful Google response, visitors see “Read our Google reviews.” No rating or review count is invented or kept as an outdated fallback.

## Activate automatic updates

1. In [Google Cloud Console](https://console.cloud.google.com/), choose or create your Google Maps Platform project and enable billing. Enable **Maps JavaScript API** and **Places API (New)**. Google documents this in its [API setup guide](https://developers.google.com/maps/documentation/javascript/get-api-key).
2. Create a **browser API key** with **Websites / HTTP referrers** application restrictions. Add only the actual domains that will serve this site, for example:
   - `https://www.excelspt.com/*`
   - `https://excelspt.com/*`
   - `http://localhost:55000/*` for the current local preview
   - `http://localhost:4321/*` if using Astro's default development port
   - Your specific staging domain, if needed

   Restrict the key's API access to **Maps JavaScript API** and **Places API (New)**. A browser key is intentionally visible to visitors; domain and API restrictions protect its use. Do not use a secret server key. Set appropriate API quotas and billing alerts in Google Cloud; requests can incur charges.
3. Use Google's [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) to select **Excel Sports Performance Therapy, 3323 Old Hickory Blvd, Old Hickory, TN**. Match the listing to the supplied Google Maps link. Copy the Place ID, usually beginning with `ChIJ`. Do not use the long Maps URL, the hexadecimal `0x…` identifier, or a different location's Place ID.
4. Copy `.env.example` to `.env`, then fill in:

   ```dotenv
   PUBLIC_GOOGLE_MAPS_API_KEY=your_restricted_browser_key
   PUBLIC_GOOGLE_PLACE_ID=the_old_hickory_place_id
   ```

   `.env` is gitignored. Restart the local preview after changing environment variables.
5. Add those same two variables to the production host's **build environment**, then rebuild and deploy once. Astro embeds `PUBLIC_` configuration in the browser bundle. Subsequent rating/count changes require no rebuild.

## How updating works

On each homepage load, the badge loads Google's official JavaScript library and requests only `rating` and `userRatingCount` through `Place.fetchFields`. It shows the numeric rating, proportional star fill, review count, and Google Maps attribution. Any additional data-provider attributions returned by Google appear directly beneath the badge.

New published reviews are reflected on subsequent page loads once Google makes them available through Places. This is not an instant push subscription or a background polling loop. The site does not persist Google's rating data in local storage, static files, or a server cache. This badge refers to the supplied Old Hickory listing; it does not combine both clinics' ratings or replace the existing patient testimonial excerpts.

If the request fails, is blocked, times out after 10 seconds, or returns no valid rating/count, the ordinary review link remains. No Maps API request is made when either setting is missing. Local development logs a setup hint for failed requests without printing the key.

## Verify after setup

- Open the homepage and compare the rating/count and destination with the Old Hickory Google Maps listing.
- Confirm the stars and count appear above the hero's location line on desktop and mobile.
- Open the badge using both mouse and keyboard; it opens the reviews tab in a new tab.
- If the badge remains a text link, inspect the browser console for Google's error: check billing, both enabled APIs, the Place ID, and the exact preview domain/port allowed by the key.
- Before activating the API on the public site, include Google Maps Platform in the site's publicly accessible Terms of Use and Privacy Policy, as required by [Google's integration policies](https://developers.google.com/maps/documentation/javascript/policies). Retain the Google Maps and provider attribution beside the rating.

## Implementation and checks

- `src/components/GoogleReviews.astro`: markup and branded styling, including the no-JavaScript link.
- `src/scripts/google-reviews.ts`: asynchronous Google library loading and progressive badge update.
- `src/lib/google-reviews.ts`: review URL, response validation, safe attribution URLs, and timeout handling.
- Run `node --test tests/google-reviews.test.mjs` (Node 22.18+ or 24+) and `npm run build`.

Official references: [Place Details](https://developers.google.com/maps/documentation/javascript/place-details), [JavaScript library loading](https://developers.google.com/maps/documentation/javascript/load-maps-js-api), and [attribution requirements](https://developers.google.com/maps/documentation/javascript/policies).
