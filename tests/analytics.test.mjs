import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { Window } from "happy-dom";
import { analyticsPageUrl, canTrack, clickEvent, initializeAnalytics } from "../src/lib/analytics.ts";

function browser(html = "", url = "https://www.excelspt.com/") {
  const win = new Window({ url, settings: { disableJavaScriptFileLoading: true, disableJavaScriptEvaluation: true } });
  win.document.body.innerHTML = html;
  return win;
}
const events = win => (win.dataLayer || []).map(args => Array.from(args)).filter(args => args[0] === "event");
function click(win, selector, options = {}) {
  const event = new win.MouseEvent(options.type || "click", { bubbles: true, cancelable: true, ...options });
  win.document.querySelector(selector).dispatchEvent(event);
  return event;
}

test("tracking requires a valid ID and the production hostname", () => {
  assert.equal(canTrack("G-ABC123", "excelspt.com"), true);
  assert.equal(canTrack("G-ABC123", "www.excelspt.com"), true);
  for (const host of ["localhost", "127.0.0.1", "preview.cloudcannon.com", "excelspt.com.example.org"]) {
    const win = browser("", `https://${host}/`);
    initializeAnalytics(win, "G-ABC123");
    assert.equal(win.dataLayer, undefined);
    assert.equal(win.document.querySelector("script"), null);
  }
  for (const id of ["", "GTM-ABC123", "invalid", "G-ABC<script>"]) assert.equal(canTrack(id, "excelspt.com"), false);
});

test("campaign attribution is preserved without arbitrary query data or hashes", () => {
  assert.equal(analyticsPageUrl("https://www.excelspt.com/?email=patient%40example.com&utm_source=newsletter&utm_campaign=fall&gclid=abc#private"),
    "https://www.excelspt.com/?utm_source=newsletter&utm_campaign=fall&gclid=abc");
});

test("initialization is idempotent and nested SVG clicks produce one event without blocking navigation", () => {
  const win = browser('<section data-analytics-section="hero"><a href="https://excelspt.janeapp.com/" data-booking>Schedule Now<svg><path /></svg></a></section>');
  initializeAnalytics(win, "G-ABC123");
  initializeAnalytics(win, "G-ABC123");
  const event = click(win, "path");
  assert.equal(event.defaultPrevented, false);
  assert.equal(win.document.querySelectorAll('script[src*="googletagmanager"]').length, 1);
  assert.equal(win.dataLayer.filter(args => args[0] === "config").length, 1);
  assert.equal(events(win).length, 1);
  assert.equal(events(win)[0][1], "booking_click");
  assert.equal(events(win)[0][2].click_location, "hero");
});

test("booking, consultation, contact, directions, and external links have distinct events", () => {
  const cases = [
    ['<a href="https://excelspt.janeapp.com/locations/excel-sports-performance-therapy-old-hickory/book">Book</a>', "booking_calendar_click", "Old Hickory"],
    ['<a href="https://forms.gle/nBraWwyNaS89eaHx6">Consult</a>', "consult_click"],
    ['<a href="tel:+16153141508">615-314-1508</a>', "phone_click"],
    ['<a href="mailto:drethanexcelspt@gmail.com?body=private">Email</a>', "email_click"],
    ['<a class="directions-link" href="https://www.google.com/maps/search/?query=address">Directions</a>', "directions_click"],
    ['<a class="review-note" href="https://www.google.com/maps/">Reviews</a>', "reviews_click"],
    ['<a href="https://devotioncreative.com/">Agency</a>', "external_link_click"],
    ['<a href="/guide.pdf" download>Download</a>', "download_click"],
  ];
  for (const [html, name, location] of cases) {
    const win = browser(html);
    const result = clickEvent(win.document.querySelector("a"), win.location.href);
    assert.equal(result.name, name);
    if (location) assert.equal(result.parameters.booking_location, location);
    assert.doesNotMatch(JSON.stringify(result), /private|drethanexcelspt|16153141508|\?query/);
  }
});

test("capture records open/close intent before UI handlers mutate state", () => {
  const win = browser('<button class="menu-toggle" aria-expanded="false">Menu</button><details><summary>Question</summary></details>');
  const button = win.document.querySelector("button");
  button.addEventListener("click", () => button.setAttribute("aria-expanded", "true"));
  initializeAnalytics(win, "G-ABC123");
  click(win, "button");
  assert.equal(events(win)[0][2].click_action, "open");
  click(win, "summary");
  assert.equal(events(win)[1][1], "faq_toggle");
  assert.equal(events(win)[1][2].click_action, "open");
  win.document.querySelector("details").setAttribute("open", "");
  click(win, "summary");
  assert.equal(events(win)[2][2].click_action, "close");
});

test("delegation covers newly inserted links, keyboard activation, and middle clicks", () => {
  const win = browser();
  initializeAnalytics(win, "G-ABC123");
  win.document.body.innerHTML = '<nav><a href="/blog/">Blog</a></nav>';
  click(win, "a", { detail: 0 }); // Native keyboard click.
  click(win, "a", { type: "auxclick", button: 1 });
  click(win, "a", { type: "auxclick", button: 2 });
  assert.equal(events(win).length, 2);
  assert.equal(events(win)[0][1], "navigation_click");
});

test("disabled, opted-out, editable, and plain content clicks are ignored", () => {
  const win = browser('<button disabled>Disabled</button><a aria-disabled="true" href="/">No</a><div data-analytics-ignore><button>Private</button></div><div contenteditable="true"><a href="/">Editing</a></div><p>Text</p><input value="private">');
  initializeAnalytics(win, "G-ABC123");
  for (const element of win.document.querySelectorAll("button, a, p, input")) element.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  assert.equal(events(win).length, 0);
});

test("review toggles avoid reviewer names and analytics failure does not cancel clicks", () => {
  const win = browser('<button class="review-toggle" aria-label="Read more of Patient Name’s review" aria-expanded="false">Read More</button>');
  initializeAnalytics(win, "G-ABC123");
  click(win, "button");
  assert.equal(events(win)[0][2].click_text, "Review");
  win.gtag = () => { throw new Error("blocked"); };
  assert.equal(click(win, "button").defaultPrevented, false);
});

test("all built pages include analytics wiring and every rendered control produces an event", () => {
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (path.endsWith(".html")) files.push(path);
    }
  }
  walk("dist");
  assert.ok(files.length >= 10);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    // Astro may bundle the analytics component as an external or inline module.
    const win = browser(html);
    const modules = [...win.document.querySelectorAll('script[type="module"]')].map(script =>
      script.src ? readFileSync(`dist${new URL(script.src).pathname}`, "utf8") : script.textContent).join("\n");
    assert.match(modules, /ga-measurement-id/, file);
    initializeAnalytics(win, "G-ABC123");
    const controls = win.document.querySelectorAll('a[href], button, summary, [role="button"]');
    assert.ok(controls.length > 0, file);
    for (const element of controls) {
      const previous = events(win).length;
      element.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
      assert.equal(events(win).length, previous + 1, `${file}: ${element.outerHTML}`);
      assert.ok(events(win).at(-1)[2].click_text);
      assert.ok(events(win).at(-1)[2].click_location);
    }
  }
});
