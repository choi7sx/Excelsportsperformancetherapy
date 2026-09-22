import test from "node:test";
import assert from "node:assert/strict";
import {
  getReviewSummary,
  safeAttributionUrl,
  withDeadline,
  googleReviewsUrl,
} from "../src/lib/google-reviews.ts";

test("formats fractional ratings and large review counts accessibly", () => {
  const result = getReviewSummary(4.7, 1234);
  assert.equal(result.score, "4.7");
  assert.equal(result.reviews, "1,234 reviews");
  assert.ok(Math.abs(result.unfilledPercent - 6) < 0.001);
  assert.match(result.label, /4\.7 out of 5 from 1,234 reviews on Google Maps/);
});

test("supports a single review and all five filled stars", () => {
  assert.equal(getReviewSummary(5, 1).reviews, "1 review");
  assert.equal(getReviewSummary(5, 1).unfilledPercent, 0);
});

test("missing, unrated, or malformed API data never becomes a public rating", () => {
  for (const [rating, count] of [
    [undefined, 10],
    [null, 10],
    [NaN, 10],
    [Infinity, 10],
    [0, 10],
    [5.1, 10],
    ["5", 10],
    [5, undefined],
    [5, null],
    [5, 0],
    [5, -1],
    [5, 1.5],
    [5, NaN],
    [5, Infinity],
    [5, "16"],
    [5, Number.MAX_SAFE_INTEGER + 1],
  ])
    assert.equal(getReviewSummary(rating, count), null);
});

test("attribution links reject executable or malformed URLs", () => {
  for (const value of [
    undefined,
    null,
    42,
    "",
    "javascript:alert(1)",
    "data:text/html,test",
    "/relative",
    "broken",
  ])
    assert.equal(safeAttributionUrl(value), null);
  assert.equal(
    safeAttributionUrl("https://example.com/provider"),
    "https://example.com/provider",
  );
});

test("the badge uses the supplied listing's reviews tab", () => {
  const url = new URL(googleReviewsUrl);
  assert.equal(url.hostname, "www.google.com");
  assert.ok(url.pathname.includes("0x886441b2d1445493:0x554e5eb8e948a8b2"));
  assert.ok(url.pathname.includes("!9m1!1b1"));
});

test("successful and failed requests settle without waiting for the timeout", async () => {
  assert.equal(await withDeadline(Promise.resolve("ready"), 100), "ready");
  await assert.rejects(
    withDeadline(Promise.reject(new Error("denied")), 100),
    /denied/,
  );
});

test("a stalled Google request expires so the fallback can remain usable", async () => {
  await assert.rejects(withDeadline(new Promise(() => {}), 5), /timed out/);
});
