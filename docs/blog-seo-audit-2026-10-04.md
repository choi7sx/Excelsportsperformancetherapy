# Blog SEO and answer-engine audit — October 4, 2026

Scope: `/blog/` and its five article pages. Checked the local production build; no deployment, Search Console submission, or live-hosting changes were made.

## Implemented

- Distinct, concise search titles and descriptions; canonical URLs and article-specific social images.
- Crawlable HTML, descriptive image alt text, stable image dimensions, priority loading for the first listing image and article hero, and large search-image previews.
- Visible answer summaries and factual author biographies linked to Ethan’s existing credentials section.
- Linked BlogPosting, WebPage, BreadcrumbList, Blog, CollectionPage, and ItemList structured data. Author identity, article dates, and answer text match what readers see.
- Original publication dates retained. The content update is recorded separately in the byline, article metadata, and sitemap `lastmod`. Dates are not automatically refreshed on builds.
- Contextual links among related articles, relevant services, location details, and first-visit information.
- Links to NICE, NHS, and AAOS medical guidance where relevant. Clarified imaging indications and emergency symptoms; softened blanket exercise and recovery claims. These editorial changes do not constitute a medical review by Ethan.
- Permanent legacy URL redirects in `.cloudcannon/routing.json`, including trailing-slash variants and the encoded first-visit URL. Targets go straight to their canonical pages without chains.
- Sitemap excludes noindex pages and pages that declare another canonical URL.
- CloudCannon inputs and the new-post template support search titles, answer summaries, author URLs/bios, and substantive-update dates.

## Verification

`npm test`: **23 passing tests**, including all six blog URLs, internal links and assets, schema/visible-content consistency, metadata uniqueness, sitemap dates, and redirect targets. CloudCannon YAML parses successfully. `git diff --check` passes.

All six pages render their content and navigation without JavaScript at a 390px mobile viewport, with no horizontal overflow. Desktop and mobile article screenshots are in `.context/blog-seo-article-desktop.png` and `.context/blog-seo-article-mobile.png`.

Local mobile Lighthouse results (simulated mobile throttling, one run per final page/template state):

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Blog listing | 98 | 100 | 100 | 100 |
| Low back pain imaging | 100 | 100 | 100 | 100 |
| Low back pain and exercise | 100 | 100 | 100 | 100 |
| Your first visit | 100 | 100 | 100 | 100 |
| Stretching and pain | 100 | 100 | 100 | 100 |
| Hip pain for golfers | 98 | 100 | 100 | 100 |

These are lab scores, not field Core Web Vitals, a clinical-content assessment, or a prediction of search position. Lighthouse does not measure answer-engine citations or fully validate rich-result eligibility. Raw reports are under `.context/`.

## Deployment checks

1. Deploy and verify every old URL returns a real HTTP 301 with the expected Location header. CloudCannon routing rules are not executed by Astro's local preview server. If hosting elsewhere, transfer the same redirect mappings to that provider.
2. Confirm production pages and images return 200, canonical URLs use the chosen production domain, and the host/CDN permits crawlers. Keep staging previews excluded from indexing through hosting settings.
3. Validate live article and breadcrumb markup with Google's Rich Results Test; use Search Console URL Inspection to check crawler-visible HTML and indexing. Submit the sitemap and monitor indexing, impressions, queries, and booking conversions.
4. Have Ethan check the edited clinical wording and answer summaries before publication. No reviewer credentials or medical-review date have been invented.
5. Verify CloudCannon's hosted editing workflow after deployment. For future posts, update author name/link/bio together and use modified dates only for substantive edits.

## Guidance used

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — standard crawlability, useful text, internal links, and accurate structured data apply to AI search. No special AI text file or schema is required, and inclusion is not guaranteed.
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) — authors, profile URLs, representative images, and genuine publication/update dates.
- [Google: Helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — visible authorship and trustworthy sourcing, particularly for health topics.
- [CloudCannon routing reference](https://cloudcannon.com/documentation/developer-reference/routing-file/) — host-level redirect configuration.
- [NICE low back pain guidance](https://www.nice.org.uk/guidance/ng59/chapter/recommendations), [NHS back pain guidance](https://www.nhs.uk/conditions/back-pain/), and [AAOS hip conditioning](https://www.orthoinfo.org/recovery/hip-conditioning-program/) — sources linked in the relevant articles.
