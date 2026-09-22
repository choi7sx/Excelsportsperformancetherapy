export function initializeReviewCards(grid: HTMLElement) {
  const reference = grid.querySelector<HTMLElement>("[data-review-reference]");
  if (!reference) return;

  const reviews = Array.from(
    grid.querySelectorAll<HTMLElement>("[data-review-expandable]"),
  ).flatMap((card) => {
    const text = card.querySelector<HTMLElement>("[data-review-text]");
    const tail = card.querySelector<HTMLElement>(".review-tail");
    const lastWord = card.querySelector<HTMLElement>("[data-review-tail]");
    const button = card.querySelector<HTMLButtonElement>(".review-toggle");
    if (!text || !tail || !lastWord || !button) return [];
    const fullText = text.textContent ?? "";
    return [
      {
        card,
        text,
        tail,
        lastWord,
        button,
        fullText,
        words: fullText.replace(/”$/, "").split(/\s+/),
        excerpt: "",
        ending: "",
        truncated: false,
      },
    ];
  });

  type Review = (typeof reviews)[number];
  const setButton = (review: Review, expanded: boolean) => {
    review.card.dataset.expanded = String(expanded);
    review.button.setAttribute("aria-expanded", String(expanded));
    review.button.textContent = expanded ? "Read Less" : "Read More";
    review.button.setAttribute(
      "aria-label",
      `${review.button.textContent} of ${review.button.dataset.reviewName}’s review`,
    );
  };
  const render = (review: Review, expanded: boolean) => {
    setButton(review, expanded);
    review.tail.hidden = !review.truncated;
    review.text.textContent =
      expanded || !review.truncated ? review.fullText : review.excerpt;
    review.lastWord.textContent = expanded ? "" : review.ending;
  };

  const measure = () => {
    const referenceHeight = reference.getBoundingClientRect().height;
    if (!referenceHeight) return;
    grid.style.setProperty("--review-card-height", `${referenceHeight}px`);

    reviews.forEach((review) => {
      const wasExpanded = review.card.dataset.expanded === "true";
      review.text.textContent = review.fullText;
      review.tail.hidden = true;
      review.truncated =
        review.card.getBoundingClientRect().height > referenceHeight + 1;
      if (!review.truncated) {
        render(review, false);
        return;
      }

      setButton(review, false);
      review.tail.hidden = false;
      const showWords = (count: number) => {
        review.text.textContent = `${review.words.slice(0, count - 1).join(" ")}${count > 1 ? " " : ""}`;
        // Keep the last word, ellipsis, and control together on the final line.
        review.lastWord.textContent = `${review.words[count - 1]}…`;
      };

      // Fit as much text as possible with the inline control included in the measurement.
      let lower = 1;
      let upper = review.words.length - 1;
      let fitting = 1;
      while (lower <= upper) {
        const count = Math.floor((lower + upper) / 2);
        showWords(count);
        if (review.card.getBoundingClientRect().height <= referenceHeight + 1) {
          fitting = count;
          lower = count + 1;
        } else {
          upper = count - 1;
        }
      }
      showWords(fitting);
      review.excerpt = review.text.textContent ?? "";
      review.ending = review.lastWord.textContent ?? "";
      render(review, wasExpanded);
    });
  };

  reviews.forEach((review) => {
    review.button.addEventListener("click", () => {
      render(review, review.card.dataset.expanded !== "true");
    });
  });

  measure();
  void document.fonts.ready.then(measure);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(measure).observe(reference);
  } else {
    window.addEventListener("resize", measure);
  }
}
