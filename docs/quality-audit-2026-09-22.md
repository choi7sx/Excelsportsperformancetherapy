# Responsive, functionality, performance, and SEO audit — September 22, 2026

Audited the local production build at http://127.0.0.1:4323, covering the homepage, four service pages, and custom 404. Changes are in this workspace and have not been deployed.

## Results

No remaining layout overflow, broken images, runtime errors, or failed interaction checks were detected in the tested states. Visual inspection covered desktop, tablet, and phone screenshots of the homepage, service layouts, and booking dialog.

- **120 page/viewport combinations:** Chrome at 320×740, 375×812, 390×844, 600×900, 768×1024, 820×1180, 1024×768, 1100×850, 1101×850, 1440×900, 1920×1080, and 844×390; Firefox and WebKit at 390×844, 768×1024, 1440×900, and 844×390. All six pages at each viewport.
- **180 axe scans:** page, expanded navigation, and booking-dialog states across Chrome, Firefox, and WebKit. Zero reported violations using WCAG 2 A/AA, 2.1 AA, 2.2 AA, and best-practice tags.
- Tested every booking trigger, both location options, close button, Escape dismissal, restored focus, menu/submenu dismissal, all FAQs, expandable reviews, section anchors, cross-page navigation, skip link, and modal keyboard navigation. Native dialog keyboard navigation can reach browser chrome but cannot focus background page controls.
- **12 JavaScript-disabled checks:** all pages at mobile and desktop widths retain navigation and direct booking links.
- Jane's location chooser and both booking pages returned HTTP 200. The consultation link reached the actual Google Form. No appointment or form was submitted.
- The missing-page route returns HTTP 404 with noindex in the preview server.
- **14 automated tests pass:** review handling, unique metadata, JSON-LD relationships, canonical URLs, local links/assets/anchors, responsive image candidates, sitemap, robots, and 404 exclusion. Production build and git diff whitespace checks pass.

## Google Lighthouse

Lighthouse 13.5.0 using Headless Chrome 153, with the standard simulated mobile profile and the actual desktop config. Each row shows **mobile / desktop**. These results are from the final production build; 404 is intentionally excluded from indexable-page scoring.

| Page | Performance | Accessibility | Best practices | SEO | LCP |
| --- | --- | --- | --- | --- | --- |
| Homepage | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1.65s / 0.42s |
| Chiropractic Care | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1.50s / 0.32s |
| Golf Performance | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1.50s / 0.32s |
| Injury Rehab | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1.50s / 0.32s |
| Personal Training | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1.65s / 0.36s |

Total Blocking Time and Cumulative Layout Shift were zero in all ten final reports. Homepage mobile LCP improved from approximately **2.26s to 1.65s**. The measured homepage mobile transfer fell from about **220 KB to 135 KB (39%)**, primarily from smaller images. Baseline mobile performance was 99 on the homepage and Personal Training and 100 on the other services.

Lighthouse still lists small image-delivery and CSS/font dependency opportunities on some pages. No extra framework, third-party script, or runtime dependency was added. A score of 100 is a lab result, not a guarantee of real-world speed or search rankings; [Google explains the scoring and variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

## Fixes and SEO improvements

1. **Navigation without JavaScript:** the fallback style was overridden by the later production stylesheet, hiding the mobile navigation. Increased fallback selector specificity and verified the built HTML in a scripting-disabled browser.
2. **Safari dialog focus:** WebKit did not reliably return focus to clicked booking links. The dialog now remembers the triggering link and restores focus for all dismissal methods.
3. **Accessible link labels:** review, service, and location links now include their visible text in their accessible names. The Lighthouse label-content-name mismatch finding is resolved.
4. **Responsive images:** added 480px/720px photo candidates and a 300px logo with native srcset/sizes. The full-size sources remain available for higher-density displays. Corrected the logo's intrinsic aspect ratio. A regeneration script preserves this optimization when photos change.
5. **Local business structured data:** model the practice as an Organization with two separately identified MedicalBusiness locations, each with address, phone, hours, image, map URL, and parent relationship. This avoids representing an address-less parent as another local business. Existing practice facts are retained; no ratings, pricing, or coordinates were invented. See [Google's local-business guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).
6. **Service and site identity:** added homepage WebSite identity and service BreadcrumbList markup that matches the visible breadcrumb. Service entities have stable IDs and explicit provider links. See [Google's breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).
7. **Consistent indexing metadata:** canonical, social-image, structured-data, sitemap, and robots URLs derive from Astro's configured production site. Indexable canonicals use trailing slashes; the noindex 404 emits neither a canonical nor business structured data. JSON-LD serialization escapes script-breaking characters; social cards include locale and image alternative text.

## Reproduce and inspect

- Run `npm test` for the production build and 14 regression checks.
- Run `npm run optimize:images` after replacing a source photo or logo.
- Local audit tools and reports are in `.context/audit/` (gitignored): `responsive.mjs`, `extras.mjs`, and `lighthouse.mjs`.
- Final Lighthouse HTML/JSON: `.context/audit/final/`; responsive screenshots/results: `after/`, `webkit/`, and `firefox/`; external handoffs and no-JS results: `extras.json`.
- To rerun the local audit, install its isolated tools with `npm install --prefix .context/audit --no-audit --no-fund playwright @axe-core/playwright lighthouse`, start the production preview on port 4323, then run the scripts. WebKit/Firefox require Playwright's browser installs. Use `AUDIT_BROWSER=webkit` or `AUDIT_BROWSER=firefox` for those engines.

## Limits and launch follow-up

This is browser-engine and viewport emulation, not physical-device testing or full screen-reader certification. Lighthouse was run locally against the production build, not against the deployed hosting/CDN. Hosting cache headers, redirects, TLS, live field Core Web Vitals, indexing, and Search Console were not changed or validated. Recheck PageSpeed Insights and submit the sitemap after deployment.

The Google reviews badge was checked in its unconfigured fallback state; live API retrieval still requires valid production credentials. External booking and consultation handoffs work, but completing real submissions was outside the audit. Search rich-result eligibility is not guaranteed by valid structured data.
