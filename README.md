# Excel Sports Performance Therapy

A responsive Astro first draft for Dr. Ethan Coghill's Nashville practice. Includes a homepage, three service pages, real patient excerpts, FAQs, two locations, and a booking location chooser that connects to the existing Jane calendars.

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
- Images and self-hosted DM Sans font: `public/images` and `public/fonts`

The CloudCannon integration and original content components remain available. The new pages use Astro source files; the old starter page-builder content is not connected to these new pages. Demo routes have been removed from public output (their history remains in Git).

## Content sources and conversion strategy

Content was checked against https://www.excelspt.com/ and https://excelspt.janeapp.com/ on September 10, 2026. The homepage, Recovery Care, and Focused Rehab photos are optimized versions of the user-supplied treatment photo; the user-supplied Excel logo is used throughout. Performance Training uses a stock placeholder photo, with its source recorded in `public/images/services/README.md`. No fabricated reviews, star ratings, pricing, qualifications, or outcome guarantees were added.

The working assumption is that uncertainty about care and the first visit creates booking friction. The Hormozi-inspired strategy therefore informed outcome-led copy, early patient proof, understandable care paths, a clear first-visit explanation, and a free consultation alternative. The intended outcome is more qualified initial evaluations. Once launched, measure visits → booking-calendar clicks → completed evaluations, along with consult requests. Analytics and completed-booking attribution are not connected in this draft; bookings happen in Jane. Evaluate conversion and booking quality before investing in more traffic. Appointment capacity becomes the next constraint if demand grows.

Service pages use a quieter text-led layout with an introductory booking action, service-fit guidance, explanations of the care approach, first-visit steps, and service-specific FAQs. The Enhanced PT physical therapy page (https://enhancedpt.com/services/physical-therapy/) informed the educational structure; copy and design are original to Excel.

## SEO and launch notes

Server-rendered static HTML includes unique titles and descriptions, canonical URLs, Open Graph/Twitter cards, a branded favicon, medical-business/location structured data, service structured data, FAQ structured data, robots.txt, and an XML sitemap. There is one main H1 per page. The canonical production domain is https://www.excelspt.com. Structured data does not guarantee rich results or rankings.

This is a local draft, not a live replacement. Before launch, have Ethan review service wording, hours, payment details, and patient excerpt usage. Confirm the production domain, point hosting at `dist`, ensure previews are not indexed, and submit the sitemap to Search Console. Review any legacy URLs for redirects when migrating. No patient information is collected by this site; scheduling and consultation links use the existing external providers.

Compatible dependency fixes were applied using `npm audit fix`. Six inherited advisories remain (one critical, three high, one moderate, one low), involving Astro/MDX, sharp, esbuild, and markdown-it/linkify-it. Resolving all of them currently requires dependency upgrades beyond the starter's major-version ranges. This draft emits static files; a production dependency upgrade and verification should be completed before launch.

## Site audit

See [SITE-AUDIT.md](SITE-AUDIT.md) for the content, conversion, accessibility, and technical audit, implemented improvements, verification results, and remaining launch priorities.
