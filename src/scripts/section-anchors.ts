/** Measure anchor offsets while retaining native links, history, and reduced-motion behavior. */
export function initializeSectionAnchors() {
  const header = document.querySelector<HTMLElement>(".site-header");
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section-anchor]"));
  if (!header || !sections.length) return;

  const measure = () => {
    const headerHeight = getComputedStyle(header).position === "sticky"
      ? header.getBoundingClientRect().height
      : 0;
    document.documentElement.style.setProperty("--sticky-header-height", `${headerHeight}px`);
    const availableHeight = document.documentElement.clientHeight - headerHeight;

    sections.forEach((section) => {
      const content = section.firstElementChild;
      if (!content) return;
      const bounds = content.getBoundingClientRect();
      const contentOffset = bounds.top - section.getBoundingClientRect().top;
      // Center content that fits; start taller content below the header with a small gutter.
      const topSpace = Math.max(16, (availableHeight - bounds.height) / 2);
      const inset = Math.max(0, contentOffset - topSpace);
      section.style.setProperty("--section-scroll-inset", `${inset}px`);
    });
  };

  measure();
  window.addEventListener("resize", measure);
  const observer = new ResizeObserver(measure);
  observer.observe(header);
  sections.forEach((section) => {
    if (section.firstElementChild) observer.observe(section.firstElementChild);
  });
  void document.fonts.ready.then(measure);

  // Cross-page links and direct URLs must use the final font/image layout too.
  const initialHash = window.location.hash;
  const alignInitialAnchor = async () => {
    await document.fonts.ready;
    requestAnimationFrame(() => {
      measure();
      const target = sections.find((section) => `#${section.id}` === initialHash);
      if (target && window.location.hash === initialHash) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
  };
  if (document.readyState === "complete") void alignInitialAnchor();
  else window.addEventListener("load", alignInitialAnchor, { once: true });
}
