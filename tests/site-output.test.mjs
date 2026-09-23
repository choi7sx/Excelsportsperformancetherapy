import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { services } from '../src/data/excel.ts';

// Run after `npm run build`: inspect the HTML crawlers actually receive.
const origin = 'https://www.excelspt.com';
const routes = ['/', ...services.map(s => `/services/${s.slug}/`)];
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
    assert.ok(html.includes('name="robots" content="index, follow"'));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate HTML IDs');
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
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
    } else {
      const service = data.find(s => s['@type'] === 'Service');
      assert.equal(service.url, origin + route);
      assert.equal(service.provider['@id'], practice['@id']);
      const crumbs = data.find(s => s['@type'] === 'BreadcrumbList').itemListElement;
      assert.deepEqual(crumbs.map(c => c.position), [1, 2]);
      assert.equal(crumbs.at(-1).item, origin + route);
    }
  });
}

test('sitemap and robots agree on the production URLs and exclude the 404', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls, routes.map(route => origin + route));
  assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
  const error = htmlFor('/404.html');
  assert.ok(error.includes('name="robots" content="noindex, follow"'));
  assert.ok(!error.includes('rel="canonical"'));
  assert.equal(schemas(error).length, 0);
});

test('indexable pages have distinct titles and descriptions', () => {
  for (const pattern of [/<title>(.*?)<\/title>/s, /name="description" content="([^"]+)"/]) {
    const values = routes.map(route => htmlFor(route).match(pattern)[1]);
    assert.equal(new Set(values).size, routes.length);
  }
});
