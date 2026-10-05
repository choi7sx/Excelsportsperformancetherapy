# Excel Sports Performance Therapy

A responsive Astro first draft for Dr. Ethan Coghill's Nashville practice. Includes a homepage, service pages, a five-post blog, real patient excerpts, FAQs, two locations, and a booking location chooser that connects to the existing Jane calendars.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4321. Build with `npm run build`; preview the static build with `npm run preview`.

In Conductor, start **preview** from the **Run** tab, then click **Open** to view the site. The preview uses the workspace's assigned port and updates as you edit. New workspaces install dependencies automatically with `npm ci` using `.conductor/settings.toml`.

## Editing the draft

- Homepage: `src/pages/index.astro`
- Services, FAQs, locations, hours, and booking URLs: `src/data/excel.ts`
- Shared navigation, booking dialog, footer, and metadata: `src/layouts/ExcelLayout.astro`
- Shared font family and weight tokens: `src/styles/typography.css`
- Visual styles and responsive layouts: `src/styles/excel.css`
- Service page template: `src/pages/services/[slug].astro`
- Service learning content and service-specific FAQs: `src/data/service-guides.ts`
- Service page styles: `src/styles/service-pages.css`
- Images and self-hosted fonts (Outfit headings, Inter body text): `public/images` and `public/fonts`

The homepage and service pages use Astro source files. The blog uses the CloudCannon content collections. Original page-builder components remain available; starter blog articles have been replaced with Excel content.

## Blog and CloudCannon editing

The `/blog/` page displays all posts newest first in three columns on desktop, two on tablets, and one on phones. The shared navigation places Blog immediately after FAQs. Articles use a hero image, heading, author/date, Markdown content, and three recent posts.

- In CloudCannon, open **Blog → Add → Add New Post**. Enter the title, excerpt, heading, author, date, and hero image; write the body in the Content Editor and save. New posts automatically appear on the listing after a build.
- Hero images upload to `public/images/blog` and are referenced as `/images/blog/filename`. The thumbnail is optional and defaults to the hero image. Set descriptive image alt text. The included stock images can be replaced through these same fields.
- **Pages → Blog** controls the listing title and SEO. The listing uses the same hero typography as service pages and has no visible hero description. Article headings, authors, hero images, and body content have Visual Editor bindings; metadata is available in the editor sidebar. CloudCannon supplies the runtime for these simple text/image regions, so no component registration is needed.
- Post files: `src/content/blog/*.mdx`. New-post defaults: `.cloudcannon/schemas/post.mdx`. Listing content: `src/content/pages/blog.md`. Layouts/styles: `src/layouts/Post.astro`, `src/components/blog`, and `src/styles/blog.css`.
- Search titles (`seo.page_title`), answer summaries, author biography/profile links, and substantive-update dates (`date_modified`) are editable in CloudCannon. Original publication dates stay intact. Update `date_modified` only when the content materially changes; it drives the visible Updated label, article metadata, and sitemap `lastmod`. If changing the author, update the name, profile link, and biography together.
- Dates use America/Chicago. Saving a post publishes it on the next build; there is no draft or scheduled-publication workflow. SEO `no_index` excludes a page from the sitemap and adds noindex, but does not hide it from the blog.

The five articles were imported from the [existing Excel blog](https://www.excelspt.com/blog-1-copy-1-1) on October 4, 2026. Ethan Coghill’s authorship and original publication dates were retained, including the three May 28, 2019 dates. A subsequent SEO/content pass added concise answers, contextual links, source citations, and clearer medical wording; the visible update dates record that substantive edit. These edits have not been medically reviewed by Ethan. Legacy 301 redirects are configured in `.cloudcannon/routing.json` for CloudCannon hosting; verify their HTTP responses when deployed.

Stock images are locally hosted 1200 × 800 WebP placeholders from Pexels, downloaded October 4, 2026 under the [Pexels license](https://www.pexels.com/license/). They illustrate the topics and do not depict Excel staff or patients.

| File in `public/images/blog` | Photo source |
| --- | --- |
| `imaging.webp` | [MRI scan — MART PRODUCTION](https://www.pexels.com/photo/photo-of-doctor-operating-mri-scanner-7088479/) |
| `exercise-man.webp` | [Man exercising — MART PRODUCTION](https://www.pexels.com/photo/a-man-exercising-8032907/) |
| `first-visit.webp` | [Physiotherapist working with a patient](https://www.pexels.com/photo/physiotherapist-working-with-patient-20860579/) |
| `stretching.webp` | [Pre-workout stretching — Anna Shvets](https://www.pexels.com/photo/woman-stretching-before-workout-6283563/) |
| `golf.webp` | [Golfer swinging — DΛVΞ GΛRCIΛ](https://www.pexels.com/photo/golfer-swinging-on-scenic-green-with-mountain-view-33855294/) |

The configuration follows CloudCannon's [collection reference](https://cloudcannon.com/documentation/developer-reference/configuration-file/collections_config/*/) and [Editable Regions reference](https://cloudcannon.com/documentation/developer-reference/editable-regions/). The build and local previews are verified locally; the hosted CloudCannon editor must be checked after this branch is deployed there.

## Google reviews badge

The hero includes a branded link to the Old Hickory Google Maps reviews. Automatic rating and review-count updates are ready to configure using `PUBLIC_GOOGLE_MAPS_API_KEY` and `PUBLIC_GOOGLE_PLACE_ID`; see [the setup guide](docs/google-reviews.md) and `.env.example`. Until configured, the badge displays “Read our Google reviews” without a fabricated rating. Once configured, it fetches current Google data on each homepage load without rebuilding the site.

## Content sources and conversion strategy

Content was checked against https://www.excelspt.com/ and https://excelspt.janeapp.com/ on September 10, 2026. The homepage, Recovery Care, and Focused Rehab photos are optimized versions of the user-supplied treatment photo; the user-supplied Excel logo is used throughout. Performance Training uses a stock placeholder photo, with its source recorded in `public/images/services/README.md`. No fabricated reviews, star ratings, pricing, qualifications, or outcome guarantees were added.

The working assumption is that uncertainty about care and the first visit creates booking friction. The Hormozi-inspired strategy therefore informed outcome-led copy, early patient proof, understandable care paths, a clear first-visit explanation, and a free consultation alternative. The intended outcome is more qualified initial evaluations. Once launched, measure visits → booking-calendar clicks → completed evaluations, along with consult requests. Analytics and completed-booking attribution are not connected in this draft; bookings happen in Jane. Evaluate conversion and booking quality before investing in more traffic. Appointment capacity becomes the next constraint if demand grows.

Service pages use a quieter text-led layout with an introductory booking action, service-fit guidance, explanations of the care approach, first-visit steps, and service-specific FAQs. The Enhanced PT physical therapy page (https://enhancedpt.com/services/physical-therapy/) informed the educational structure; copy and design are original to Excel.

## SEO and launch notes

Server-rendered static HTML includes unique titles and descriptions, canonical URLs, Open Graph/Twitter cards, a branded favicon, medical-business/location structured data, service structured data, FAQ structured data, robots.txt, and an XML sitemap. There is one main H1 per page. The canonical production domain is https://www.excelspt.com. Structured data does not guarantee rich results or rankings.

This is a local draft, not a live replacement. Before launch, have Ethan review service wording, hours, payment details, and patient excerpt usage. Confirm the production domain, point hosting at `dist`, ensure previews are not indexed, and submit the sitemap to Search Console. Review any legacy URLs for redirects when migrating. No patient information is collected by this site; scheduling and consultation links use the existing external providers.

Compatible dependency fixes were applied using `npm audit fix`. Six inherited advisories remain (one critical, three high, one moderate, one low), involving Astro/MDX, sharp, esbuild, and markdown-it/linkify-it. Resolving all of them currently requires dependency upgrades beyond the starter's major-version ranges. This draft emits static files; a production dependency upgrade and verification should be completed before launch.

## Quality checks

Run `npm test` to build the static site and check review logic, metadata, structured data, sitemap coverage, and local links/assets. After replacing an original photo or logo, run `npm run optimize:images` to regenerate its responsive WebP variants.

The production domain in `astro.config.mjs` supplies canonical URLs, structured-data URLs, the sitemap, and robots.txt. Service pages include breadcrumb structured data; the homepage identifies the website and the two practice locations.

See [the blog SEO/AEO audit](docs/blog-seo-audit-2026-10-04.md) for the blog implementation and remaining deployment checks.

See [the September 22 responsive, functional, Lighthouse, and SEO audit](docs/quality-audit-2026-09-22.md) for the latest results.

## Site audit

See [SITE-AUDIT.md](SITE-AUDIT.md) for the content, conversion, accessibility, and technical audit, implemented improvements, verification results, and remaining launch priorities.
