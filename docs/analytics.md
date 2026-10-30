# Google Analytics 4

The shared `ExcelLayout` includes GA4 on the homepage, services, blog listing, articles, and 404 page. Delegated listeners cover links, buttons, FAQ summaries, navigation menus, and dynamically added controls. Ordinary text and form-field contents are not click events.

## Connect the property

1. In GA4, open **Admin → Data streams**, create/select the Excel website's Web stream, and copy its **Measurement ID** (`G-…`, not the numeric Property ID).
2. The supplied ID, `G-ZKJDYF5QVS`, is configured in `src/components/Analytics.astro`. Deploy the production build to activate it; no hosting environment change is needed. To change properties, optionally set `PUBLIC_GA_MEASUREMENT_ID` and rebuild. `.env.example` documents the override. A Measurement ID is public, not a password or API secret.
3. Keep page-view enhanced measurement enabled. The Google tag collects visits, page views, engagement, and traffic sources. Do not install a second Google tag through another integration.
4. Tracking is disabled with an explicitly empty `PUBLIC_GA_MEASUREMENT_ID` override, in `astro dev`, or when the browser hostname is anything other than `excelspt.com` or `www.excelspt.com`. Local/CloudCannon preview activity will not populate production analytics.

## Click events

| Event | Meaning |
| --- | --- |
| `booking_click` | Open the booking picker from Schedule Now (only fires when the site has multiple locations) |
| `booking_calendar_click` | Follow a link to a Jane location calendar, including Schedule Now while the site has one location |
| `consult_click` | Follow a consultation Google Forms link |
| `phone_click` | Activate a phone link (does not confirm a connected call) |
| `email_click` | Activate an email link (does not confirm a sent email) |
| `directions_click` | Open location directions |
| `reviews_click` | Open Google reviews |
| `review_toggle` | Expand/collapse a patient review |
| `faq_toggle` | Activate an FAQ summary |
| `menu_toggle` | Open/close mobile navigation or the Services menu |
| `booking_close` | Activate the booking dialog's close button |
| `navigation_click` | Follow a header, footer, or navigation link |
| `internal_link_click` | Follow another internal link, including service/blog cards and anchors |
| `external_link_click` | Follow another external link |
| `download_click` | Activate a link with the `download` attribute |
| `button_click` | Activate another button |

Every event includes `click_text`, `click_location`, and `page_path`. Link events include `link_destination` (query/fragment removed, limited to 100 characters). Phone/email destinations contain only `tel:`/`mailto:`. Review toggles use a generic label instead of the reviewer's name. Toggles include the intended `click_action` (`open`/`close`) and Jane location links include `booking_location`.

GA4 page URLs retain only common campaign-attribution query parameters (`utm_*` allowlist, `gclid`, `dclid`, `gbraid`, `wbraid`); other query parameters and fragments are removed. Referrer query parameters are removed. Google signals and advertising personalization are disabled. These settings do not implement a consent banner; any site-wide consent requirements need to be handled by the site's consent setup.

Keyboard activation, nested icons, modified clicks, and middle clicks are supported. Each activation produces one custom event. Tracking doesn't cancel or delay navigation. Enhanced measurement may also emit its own generic outbound `click` events; use the named custom events above for CTA reports rather than adding the two counts together.

## Reports and validation

1. After deployment, open the live site and GA4 **Reports → Realtime**. Click navigation, an FAQ, Schedule Now, and the dialog close button. Confirm the corresponding named events arrive. Test outgoing links in a new tab; no appointment/form submission is required. Ad blockers can prevent collection.
2. Under **Admin → Custom definitions**, create event-scoped custom dimensions for `click_text`, `click_location`, `page_path`, `link_destination`, `click_action`, and `booking_location`. These make parameters available in reports/Explorations; processing can take 24–48 hours.
3. In **Explore**, break down event counts by event name, page path, click location, and click text. Add session source/medium to compare where visitors came from. Use the standard Pages and screens and Traffic acquisition reports for overall traffic.
4. If desired, mark `booking_calendar_click`, `consult_click`, and `phone_click` as key events. They represent intent, not confirmed appointments, submitted forms, or connected calls. The external Jane/Google Forms pages are not instrumented by this site's code.

For new components, standard links/buttons/summaries are covered automatically. `data-analytics-section` overrides placement, `data-analytics-label` overrides a label, and `data-analytics-ignore` opts an element/subtree out. Only use static, non-personal labels. A custom clickable component should use a native button/link or appropriate `role="button"` and keyboard behavior.

Run `npm test` for the production build plus tracking and existing site checks. Analytics tests use a local DOM with Google script loading disabled; they don't send test events to Google. Verify live receipt separately after deployment.

References: [Google event setup](https://developers.google.com/analytics/devguides/collection/ga4/events), [event parameters and custom dimensions](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).
