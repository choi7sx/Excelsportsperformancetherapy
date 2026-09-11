# Site audit — September 10, 2026

The goal is more qualified initial evaluations. The likeliest website constraint was uncertainty about the first step: broad, repeated promises competed with practical details about the evaluation, payment, and booking. This is a hypothesis from reviewing the site, not a finding from conversion data; analytics and booking attribution are not connected.

Applied the Hormozi-inspired value framework by making the desired outcome understandable, preserving real patient proof, explaining the first step, and reducing effort. No pricing, results, scarcity, or guarantees were invented.

## Changes implemented

| Finding | Improvement |
| --- | --- |
| Several slogans explained little about the actual offer | Clearer hero identifies the care, clinician, locations, and 60-minute evaluation. |
| Repeated approach section, badges, service tags, and photo overlays made the homepage busy | Removed redundant content and its styles; moved first-visit explanation ahead of service selection. |
| Booking and consultation links used inconsistent labels | Standardized “Book an evaluation” and “Request a free consult.” Consult links stay in the same tab. |
| Payment information was buried in a closed FAQ | Cash-based care and HSA/FSA acceptance now appear near initial CTAs and in the booking dialog; payment FAQ starts open on the homepage. |
| Service pages contained large “IMAGE TO COME” placeholders and no introductory CTA | Replaced placeholder layout with a text introduction, booking action, and first-visit details. |
| Small service-page copy and mobile menu target | Raised small text to 14px-equivalent rem units, body copy to 16px where applicable, and key controls to 44px. |
| Keyboard navigation and landmarks needed work | Added dialog relationship/description, clearer focus rings, menu dismissal/focus handling, named location and mobile-booking regions, focusable skip target, and a navigation fallback without JavaScript. |
| Location links had identical accessible names | Booking and directions labels now identify each location. |

## Validation

- Production build passed; five HTML pages generated. `git diff --check` passed.
- Checked the homepage, three services, and 404 at 1440, 768, 390, and 320 CSS pixels. No detected horizontal overflow.
- Axe checked 55 states: 20 page/viewport combinations, their 20 booking dialogs, and 15 mobile-menu states. Zero reported violations using WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice tags after fixes.
- Manually inspected the desktop homepage and booking dialog, plus the mobile service layout and dialog in Chrome device emulation. Desktop Escape dismissal restored focus to the booking link.
- Static checks covered 163 link instances, local assets and anchors, unique IDs, one H1/title/description/canonical per page, and JSON-LD parsing. No failures.
- Jane's two location pages resolve. The consult URL resolves to a Google Form requesting a phone callback; no forms or bookings were submitted.
- Existing efficient delivery retained: static Astro pages, local font, WebP images, lazy-loaded secondary photo, prioritized hero image. Hero image is approximately 152 KB, secondary photo 48 KB, font 40 KB. No production performance score or field Core Web Vitals were measured.

Automated checks do not establish complete WCAG conformance. Full screen-reader, real-device, text-spacing, and browser coverage remain outside this audit. External Jane and Google Form accessibility was not audited with axe. Local test helpers are in `.context/audit/` and excluded from the production build.

## Next priorities

1. **Confirm and publish initial-evaluation pricing.** Current sources confirm cash-based care but did not establish a fee. Showing the actual fee and what it includes is the next useful offer improvement. Keep a clear path to ask about the financial commitment until it is confirmed.
2. **Reduce consultation form friction.** The current form requires name, phone, email, a description of the issue, prior treatment, callback preference, and referral source. Consider requiring only the contact details needed for a callback, making attribution optional, and collecting detailed health history through the practice's intake process. Confirm the practice can meet the form's stated callback timeframe. External form edits were not made.
3. **Measure qualified appointments.** Track website visits → Jane calendar clicks → completed initial evaluations → attended evaluations. Track consult requests and response time separately. A calendar click is not a lead or a completed appointment. Select an analytics provider and establish booking attribution before treating website changes as proven wins; keep patient information out of analytics.
4. **Resolve inherited dependency advisories before production release.** `npm audit` reports six: Astro (critical), sharp (high), markdown-it (high), linkify-it (high), MDX (moderate), esbuild (low). Reported fixes require major upgrades. Static output reduces exposure to server-only issues, but does not establish that every advisory is harmless. Dependency upgrades were not mixed into this content/accessibility change.

Use cost per **attended initial evaluation** as the commercial outcome: acquisition spend ÷ attended new-patient evaluations. Track booking conversion and show rate alongside it. No traffic, spend, visit fees, contribution margin, or capacity data were supplied, so an ROI or lift estimate would be speculative.

Establish a baseline, then compare equivalent traffic sources and periods after launch. Continue when qualified attended evaluations per visit improve and economics remain acceptable; modify the offer or handoff when calendar clicks rise without completed bookings; stop increasing acquisition spend if attendance, contribution margin, or appointment capacity deteriorates. Avoid calling small-sample fluctuations a win. The next likely constraint after booking clarity is callback speed and available appointment capacity.

## Sources

Practice facts, services, visit duration, payment model, testimonials, and hours were checked against the [existing Excel site](https://www.excelspt.com/). Booking destinations were checked against [Jane's location chooser](https://excelspt.janeapp.com/). Consultation fields were inspected at the [existing consultation form](https://forms.gle/nBraWwyNaS89eaHx6). Target-size improvements follow [W3C's target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); 44px is an enhancement above the 24px AA minimum, not a claim that every smaller link fails.

## Typography follow-up

The “What patients say” screenshot used DM Sans at weight 700, with wide letter spacing and a separate green color. Its sentence case made the eyebrow styling appear different from the other uppercase section labels. The local WOFF2 file was inspected: its internal family is “DM Sans 9pt,” with a variable weight range of 100–1000; the CSS family name is “DM Sans.”

Consolidated the font face, font stack, and weight tokens in `src/styles/typography.css`, shared by the active site and retained starter styles. Removed Georgia from decorative quotation marks and the separate system-font setting in the starter. Standardized text weights to 400, 500, 600, and 700, and all eyebrow labels to 12px at the default root size, weight 700, uppercase, and 0.12em tracking. The review heading now uses the same blue label treatment as other light-background sections. Body, heading, and label sizes retain their distinct hierarchy.

Runtime checks across all five pages at 1440, 768, 390, and 320px found one computed text font stack, the four intended weights, one consistent eyebrow typography treatment, and successful DM Sans loading at each weight. The repeated 55 page/dialog/menu accessibility checks and overflow checks reported no issues. Visually verified the updated testimonial section in Chrome. Logo lettering remains part of the supplied image asset.
