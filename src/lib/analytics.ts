const clickableSelector = 'a[href], button, summary, [role="button"], input[type="submit"], input[type="button"], input[type="reset"]';
const productionHosts = new Set(["excelspt.com", "www.excelspt.com"]);

type Parameters = Record<string, string | number | boolean>;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  excelAnalyticsInitialized?: boolean;
};

export function canTrack(measurementId: string, hostname: string) {
  return /^G-[A-Z0-9]+$/.test(measurementId) && productionHosts.has(hostname);
}

// Preserve campaign attribution, but don't forward arbitrary query parameters.
export function analyticsPageUrl(value: string) {
  const url = new URL(value);
  const allowed = /^(utm_(source|medium|campaign|id|term|content|source_platform)|gclid|dclid|gbraid|wbraid)$/;
  for (const key of [...url.searchParams.keys()]) {
    if (!allowed.test(key)) url.searchParams.delete(key);
  }
  url.hash = "";
  return url.href;
}

function destination(href: string, base: string) {
  const url = new URL(href, base);
  // Record the contact method without sending an email address or phone number.
  if (url.protocol === "tel:" || url.protocol === "mailto:") return url.protocol;
  if (!['https:', 'http:'].includes(url.protocol)) return "";
  return `${url.origin}${url.pathname}`.slice(0, 100);
}

export function clickEvent(element: Element, pageUrl: string) {
  const href = element.getAttribute("href");
  const url = href === null ? null : new URL(href, pageUrl);
  const section = element.closest('[data-analytics-section], dialog, header, footer, nav, section, article, main');
  const placement = section?.getAttribute("data-analytics-section") || section?.id ||
    section?.getAttribute("aria-labelledby") || section?.getAttribute("aria-label") ||
    section?.tagName.toLowerCase() || "page";
  let name = "button_click";
  if (element.hasAttribute("data-booking")) name = "booking_click";
  else if (url?.protocol === "tel:") name = "phone_click";
  else if (url?.protocol === "mailto:") name = "email_click";
  else if (url?.hostname === "excelspt.janeapp.com") name = "booking_calendar_click";
  else if (url?.hostname === "forms.gle" || (url?.hostname === "docs.google.com" && url.pathname.startsWith("/forms/"))) name = "consult_click";
  else if (element.matches(".directions-link")) name = "directions_click";
  else if (element.matches(".google-reviews-link, .review-note")) name = "reviews_click";
  else if (element.matches(".review-toggle")) name = "review_toggle";
  else if (element.matches(".menu-toggle, .services-nav > summary")) name = "menu_toggle";
  else if (element.matches("summary")) name = "faq_toggle";
  else if (element.matches(".dialog-close")) name = "booking_close";
  else if (element.hasAttribute("download")) name = "download_click";
  else if (url && url.origin !== new URL(pageUrl).origin) name = "external_link_click";
  else if (url) name = element.closest("nav, header, footer") ? "navigation_click" : "internal_link_click";

  // Use a generic review label so reviewer names in aria-label aren't sent.
  const labelledBy = element.getAttribute("aria-labelledby")?.split(/\s+/)
    .map(id => element.ownerDocument.getElementById(id)?.textContent || "").join(" ");
  const text = name === "phone_click" ? "Call Excel" : name === "email_click" ? "Email Excel" :
    name === "review_toggle" ? "Review" :
    element.getAttribute("data-analytics-label") || labelledBy || element.getAttribute("aria-label") || element.textContent || element.tagName;
  const parameters: Parameters = {
    click_text: text.replace(/\s+/g, " ").trim().slice(0, 100),
    click_location: placement.slice(0, 100),
    page_path: new URL(pageUrl).pathname,
  };
  if (href !== null) parameters.link_destination = destination(href, pageUrl);
  const details = element.matches("summary") ? element.closest("details") : null;
  if (details) parameters.click_action = details.hasAttribute("open") ? "close" : "open";
  else if (element.hasAttribute("aria-expanded")) parameters.click_action = element.getAttribute("aria-expanded") === "true" ? "close" : "open";
  if (url?.hostname === "excelspt.janeapp.com" && url.pathname.includes("old-hickory")) {
    parameters.booking_location = "Old Hickory";
  }
  return { name, parameters };
}

export function initializeAnalytics(win: AnalyticsWindow, measurementId: string) {
  if (!canTrack(measurementId, win.location.hostname) || win.excelAnalyticsInitialized) return;
  win.excelAnalyticsInitialized = true;
  win.dataLayer ||= [];
  win.gtag ||= function () { win.dataLayer!.push(arguments); };
  win.gtag("js", new Date());
  win.gtag("config", measurementId, {
    page_location: analyticsPageUrl(win.location.href),
    page_referrer: win.document.referrer ? destination(win.document.referrer, win.location.href) : "",
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const handleClick = (event: MouseEvent) => {
    if (event.type === "auxclick" && event.button !== 1) return;
    const target = event.target as Element | null;
    const element = target?.closest?.(clickableSelector);
    if (!element || element.closest('[disabled], [aria-disabled="true"], [data-analytics-ignore], [contenteditable="true"]')) return;
    try {
      const { name, parameters } = clickEvent(element, win.location.href);
      win.gtag?.("event", name, { ...parameters, send_to: measurementId, transport_type: "beacon" });
    } catch {
      // Analytics must never interfere with navigation, dialing, or booking.
    }
  };
  // Capture observes the state before menus/FAQs toggle and catches nested SVG clicks.
  // Native keyboard activation also produces a click; don't add a second key listener.
  win.document.addEventListener("click", handleClick, { capture: true });
  win.document.addEventListener("auxclick", handleClick, { capture: true });
  const script = win.document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  win.document.head.append(script);
}
