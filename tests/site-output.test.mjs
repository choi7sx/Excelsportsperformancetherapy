import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { services } from '../src/data/excel.ts';

// Run after `npm run build`: inspect the HTML crawlers actually receive.
const origin = 'https://www.excelspt.com';
const blogRoutes = readdirSync('src/content/blog').filter(name => /\.mdx?$/.test(name)).map(name => `/blog/${name.replace(/\.mdx?$/, '')}/`);
const routes = ['/', ...services.map(s => `/services/${s.slug}/`), '/blog/', ...blogRoutes];
const fileFor = path => `dist${path.endsWith('/') ? `${path}index.html` : path}`;
const htmlFor = path => readFileSync(fileFor(path), 'utf8');
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => {
  const schema = JSON.parse(m[1]);
  return schema['@graph'] || [schema];
});

for (const route of routes) {
  test(`${route} has crawlable metadata, structured data, and working local links`, () => {
    const html = htmlFor(route);
    for (const pattern of [/<title>/g, /<h1(?:\s|>)/g, /name="description"/g, /rel="canonical"/g]) {
      assert.equal([...html.matchAll(pattern)].length, 1, String(pattern));
    }
    assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`));
    assert.ok(html.includes('name="robots" content="index, follow, max-image-preview:large"'));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate HTML IDs');
    for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = new URL(href.replaceAll('&amp;', '&'), origin + route);
      if (url.origin !== origin) continue;
      assert.ok(existsSync(fileFor(url.pathname)), `missing local target ${href}`);
      if (url.hash) assert.ok(htmlFor(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `missing anchor ${href}`);
    }
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of srcset.split(',')) assert.ok(existsSync(fileFor(candidate.trim().split(/\s/)[0])), `missing image ${candidate}`);
    }
    const data = schemas(html);
    const practice = data.find(s => s['@id'] === `${origin}/#practice`);
    assert.equal(practice['@type'], 'Organization');
    assert.equal(practice.department.length, 2);
    for (const location of practice.department) {
      assert.ok(location.address.streetAddress);
      assert.ok(location.telephone);
      assert.ok(location['@id']);
      assert.ok(location.openingHoursSpecification.length);
    }
    if (route === '/') {
      assert.ok(data.some(s => s['@type'] === 'WebSite'));
      assert.ok(data.some(s => s['@type'] === 'FAQPage'));
    } else if (route.startsWith('/services/')) {
      const service = data.find(s => s['@type'] === 'Service');
      assert.equal(service.url, origin + route);
      assert.equal(service.provider['@id'], practice['@id']);
      const crumbs = data.find(s => s['@type'] === 'BreadcrumbList').itemListElement;
      assert.deepEqual(crumbs.map(c => c.position), [1, 2]);
      assert.equal(crumbs.at(-1).item, origin + route);
    } else if (blogRoutes.includes(route)) {
      const article = data.find(s => s['@type'] === 'BlogPosting');
      assert.equal(article.url, origin + route);
      assert.equal(article.author.name, 'Ethan Coghill');
      assert.ok(!Number.isNaN(Date.parse(article.datePublished)));
      assert.ok(html.includes('property="og:type" content="article"'));
      assert.ok(html.includes(`property="og:image" content="${article.image}"`));
      assert.ok(html.includes('data-prop="@content"'));
      assert.ok(html.includes('data-prop-src="post_hero.image"'));
      assert.ok(html.includes('data-prop="post_hero.author"'));
    }
  });
}

test('sitemap and robots agree on the production URLs and exclude the 404', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls.sort(), routes.map(route => origin + route).sort());
  assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
  const error = htmlFor('/404.html');
  assert.ok(error.includes('name="robots" content="noindex, follow"'));
  assert.ok(!error.includes('rel="canonical"'));
  assert.equal(schemas(error).length, 0);
});

test('blog lists all five imported posts and every shared header places Blog after FAQs', () => {
  assert.equal(blogRoutes.length, 5);
  const listing = htmlFor('/blog/');
  assert.equal([...listing.matchAll(/class="blog-card"/g)].length, 5);
  for (const route of blogRoutes) {
    assert.ok(listing.includes(`href="${route}"`));
    const html = htmlFor(route);
    assert.equal([...html.matchAll(/class="blog-card"/g)].length, 3, 'three recent posts');
    assert.ok(!html.slice(html.indexOf('class="recent-posts"')).includes(`href="${route}"`), 'recent posts exclude current article');
  }
  for (const route of routes) {
    assert.match(htmlFor(route), /href="\/#faq">FAQs<\/a>\s*<a href="\/blog\/"/);
  }
  for (const starter of ['data-files', 'lighthouse-scores', 'markdown', 'search', 'seo']) {
    assert.ok(!listing.includes(`/blog/${starter}/`));
  }
});

test('indexable pages have distinct titles and descriptions', () => {
  for (const pattern of [/<title>(.*?)<\/title>/s, /name="description" content="([^"]+)"/]) {
    const values = routes.map(route => htmlFor(route).match(pattern)[1]);
    assert.equal(new Set(values).size, routes.length);
  }
});

test('blog structured data matches visible authorship, answers, breadcrumbs, and update dates', () => {
  for (const route of blogRoutes) {
    const html = htmlFor(route);
    const data = schemas(html);
    const article = data.find(s => s['@type'] === 'BlogPosting');
    const page = data.find(s => s['@type'] === 'WebPage');
    const crumbs = data.find(s => s['@type'] === 'BreadcrumbList');
    assert.equal(article.mainEntityOfPage['@id'], page['@id']);
    assert.equal(page.mainEntity['@id'], article['@id']);
    assert.equal(article.author.url, `${origin}/#meet-ethan`);
    assert.match(html, /href="\/#meet-ethan" rel="author"/);
    assert.ok(html.includes(article.author.description));
    assert.ok(html.includes(article.abstract));
    assert.ok(html.includes(`datetime="${article.dateModified}"`));
    assert.ok(Date.parse(article.dateModified) >= Date.parse(article.datePublished));
    assert.deepEqual(crumbs.itemListElement.map(c => c.position), [1, 2, 3]);
    assert.equal(crumbs.itemListElement.at(-1).item, origin + route);
    assert.match(html, /aria-label="Breadcrumb"/);
    assert.ok(html.match(/<title>(.*?)<\/title>/)[1].length < 75, 'concise search title');
    assert.ok(html.includes('max-image-preview:large'));
    assert.ok(html.includes('href="/services/'), 'contextual service links');
    if (!route.endsWith('/your-first-visit/')) {
      assert.match(html, /href="https:\/\/(?:www\.nice\.org\.uk|www\.orthoinfo\.org)\//, 'authoritative medical guidance');
    }
    const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
    assert.ok(sitemap.includes(`<loc>${origin}${route}</loc><lastmod>${article.dateModified}</lastmod>`));
  }
});

test('blog collection schema lists the same five articles as the page', () => {
  const data = schemas(htmlFor('/blog/'));
  const page = data.find(s => s['@type'] === 'CollectionPage');
  assert.equal(page.mainEntity.numberOfItems, 5);
  assert.deepEqual(page.mainEntity.itemListElement.map(item => new URL(item.url).pathname).sort(), [...blogRoutes].sort());
  assert.deepEqual(page.mainEntity.itemListElement.map(item => item.position), [1, 2, 3, 4, 5]);
  assert.equal(data.find(s => s['@type'] === 'Blog')['@id'], `${origin}/blog/#blog`);
});

test('legacy CloudCannon redirects are permanent and resolve directly to built canonical pages', () => {
  const { routes: redirects } = JSON.parse(readFileSync('.cloudcannon/routing.json', 'utf8'));
  assert.equal(new Set(redirects.map(r => r.from)).size, redirects.length);
  const destinations = new Set(['/blog/', ...blogRoutes]);
  assert.deepEqual(new Set(redirects.map(r => r.to)), destinations);
  for (const redirect of redirects) {
    assert.equal(redirect.status, 301);
    assert.ok(redirect.from.startsWith('/blog-1-copy-1-1'));
    assert.ok(destinations.has(redirect.to));
    assert.ok(existsSync(fileFor(redirect.to)));
    assert.ok(!redirects.some(r => r.from === redirect.to), 'no redirect chains');
    assert.ok(htmlFor(redirect.to).includes(`rel="canonical" href="${origin}${redirect.to}"`));
  }
});
