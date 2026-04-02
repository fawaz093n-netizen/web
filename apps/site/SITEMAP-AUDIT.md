# Sitemap Audit Report

**Target:** https://site-theta-two-38.vercel.app/  
**Date:** 2026-04-02  
**Total URLs across all sitemaps:** 1,001 (77 site + 679 docs + 245 blog)

---

## 1. Sitemap Index Structure

The sitemap index at `/sitemap.xml` references three child sitemaps:

| Child Sitemap | URL Count | Source App |
|---|---|---|
| `/sitemap-site.xml` | 77 | `apps/site` |
| `/docs/sitemap.xml` | 679 | `apps/docs` |
| `/blog/sitemap.xml` | 245 | `apps/blog` |

### Issues Found

**CRITICAL -- Hardcoded production domain on all deployments.** The sitemap index emits `https://www.prisma.io/*` URLs regardless of the deployment host. The child sitemap URLs in the index point to `www.prisma.io`, which means:

- On preview deployments (like the Vercel preview tested here), the sitemap index references sitemaps on a different host.
- The `sitemap-site.xml` child sitemap also emits all `<loc>` values with the `https://www.prisma.io` domain.
- This is by design for production but means preview/staging sitemaps are not self-referential.

**Root cause in code:** `src/lib/url.ts` `getBaseUrl()` falls back to `https://www.prisma.io` in production. The sitemap index route (`src/app/sitemap.xml/route.ts`) calls `getHostSitemapUrls()` which uses `getBaseUrl()`. However, `HOST_SITEMAPS` in `src/lib/sitemap.ts` line 13 is a static list -- these paths are correct, but the base URL resolution means the index always references the production host.

**No `<lastmod>` on sitemap index entries.** The `<sitemap>` entries in the index contain only `<loc>` and omit `<lastmod>`. While not required, adding a `<lastmod>` to index entries helps crawlers decide whether to re-fetch child sitemaps.

---

## 2. Validation Results

| Check | sitemap-site.xml | docs/sitemap.xml | blog/sitemap.xml | Severity |
|---|---|---|---|---|
| Valid XML | PASS | PASS | PASS | -- |
| Under 50k URL limit | PASS (77) | PASS (679) | PASS (245) | -- |
| Non-200 URLs | PASS (spot-checked) | Not verified | Not verified | -- |
| `<lastmod>` present | FAIL (0 of 77) | FAIL (0 of 679) | PASS (244 of 245) | High |
| `<changefreq>` (deprecated) | PRESENT (77) | PRESENT (679) | PRESENT (245) | Info |
| `<priority>` (deprecated) | PRESENT (77) | PRESENT (679) | PRESENT (245) | Info |
| Noindexed URLs in sitemap | PASS (none found) | Not verified | Not verified | -- |

### Details

**Missing `<lastmod>` -- site and docs sitemaps.** The `sitemap-site.xml` has zero `<lastmod>` tags across all 77 URLs. The docs sitemap also has zero `<lastmod>` tags across all 679 URLs. The blog sitemap correctly includes `<lastmod>` on 244 of 245 entries (the blog index `/blog` is the exception, which is acceptable).

- For the site sitemap, `src/lib/sitemap.ts` `SitemapEntry` type has no `lastmod` field at all. The `renderSitemapXml` function does not render any `<lastmod>` element.
- For the docs sitemap, `apps/docs/src/app/(docs)/sitemap.ts` reads `lastModified` from page data, but the docs content apparently does not populate this field, resulting in `undefined` for all entries and therefore no `<lastmod>` in the output.

**Deprecated `<changefreq>` and `<priority>` tags present everywhere.** Google has publicly stated these tags are ignored. They add XML bloat without value.

- Site sitemap: hardcoded in `getEntryMetadata()` at `src/lib/sitemap.ts` lines 67-78.
- Docs sitemap: hardcoded in `apps/docs/src/app/(docs)/sitemap.ts` lines 18-19 and 29-30.
- Blog sitemap: hardcoded in `apps/blog/src/app/sitemap.ts` lines 28-29 and 37.

---

## 3. robots.txt Issues

**File:** `src/app/robots.ts`

| Issue | Severity | Detail |
|---|---|---|
| Hardcoded sitemap URL | Medium | `sitemap` field is hardcoded to `https://www.prisma.io/sitemap.xml` instead of using `getBaseUrl()`. |
| `Host` directive discrepancy | Low | The `host` field uses `getBaseUrl()` (dynamic), but the `sitemap` field does not. On preview deployments, `Host` points to the Vercel URL while `Sitemap` points to production. |
| Legacy `Disallow` rules | Info | `/dataguide/intro/example`, `/dataguide/dummy`, `/cloud` are blocked. Verify these paths still exist or if the rules are stale. |

---

## 4. Coverage Analysis

### Pages in codebase vs. sitemap

All 42 static page routes from the `src/app` directory are present in `sitemap-site.xml`. The dynamic changelog routes (35 entries) are also included.

### Missing page: Remix

A data file exists at `src/data/prisma-with/remix.json` (184 lines) but there is no corresponding `src/app/(prisma-with)/remix/page.tsx`. This means:

- Either the Remix integration page was removed intentionally, or
- The page was never created despite the data being prepared.

The URL `/remix` is not in the sitemap (correct behavior since no page exists).

---

## 5. Integration Pages Quality Assessment

There are 12 integration ("Prisma with X") pages under the `(prisma-with)` route group:

| Page | Page Lines | Data File Lines | Assessment |
|---|---|---|---|
| `/nestjs` | 198 | 132 | Substantial |
| `/react` | 173 | 149 | Substantial |
| `/apollo` | 137 | 126 | Adequate |
| `/nextjs` | 136 | 170 | Adequate |
| `/fastify` | 133 | 119 | Adequate |
| `/express` | 126 | 119 | Adequate |
| `/graphql` | 124 | 116 | Adequate |
| `/mongodb` | 141 | 130 | Adequate |
| `/hapi` | 106 | 116 | Adequate |
| `/typescript` | 72 | 99 | Minimal |
| `/cockroachdb` | 35 | 87 | Thin -- metadata only, delegates entirely to shared layout |
| `/planetscale` | 35 | 88 | Thin -- metadata only, delegates entirely to shared layout |

**Quality gate status:** 12 integration pages is well under the 30-page warning threshold. These are integration pages (safe category) rather than location pages. However, `/cockroachdb` and `/planetscale` are notably thin -- their page files contain only metadata and a shared layout call with empty `codeExamples`, unlike the other pages which have more substantial content.

---

## 6. Recommended Actions

### Critical

1. **Add `<lastmod>` to the site sitemap.** Update the `SitemapEntry` type in `src/lib/sitemap.ts` to include a `lastmod` field and populate it with real dates (e.g., from git commit timestamps or file modification times). Update `renderSitemapXml` to emit the `<lastmod>` element.

2. **Fix docs sitemap `<lastmod>`.** Investigate why `lastModified` is undefined for all docs pages. The code in `apps/docs/src/app/(docs)/sitemap.ts` already supports it, but the source data is not providing values.

### High

3. **Remove deprecated `<changefreq>` and `<priority>` tags.** These are ignored by Google and add unnecessary bytes. Remove from:
   - `src/lib/sitemap.ts` -- drop from `SitemapEntry` type, `getEntryMetadata()`, and `renderSitemapXml()`.
   - `apps/docs/src/app/(docs)/sitemap.ts` -- remove `changeFrequency` and `priority` fields.
   - `apps/blog/src/app/sitemap.ts` -- remove `changeFrequency` and `priority` fields.

### Medium

4. **Fix hardcoded sitemap URL in robots.txt.** In `src/app/robots.ts`, change line 18 from the hardcoded string to use `getBaseUrl()`:
   ```
   sitemap: `${getBaseUrl()}/sitemap.xml`,
   ```

5. **Review thin integration pages.** The `/cockroachdb` and `/planetscale` pages pass only metadata and an empty `codeExamples` object to the shared layout. Consider adding code examples or unique content comparable to the other integration pages.

### Low

6. **Add `<lastmod>` to sitemap index entries.** Update `renderSitemapIndexXml()` in `src/lib/sitemap.ts` to accept and render `<lastmod>` values for each child sitemap reference.

7. **Decide on Remix page.** Either create `src/app/(prisma-with)/remix/page.tsx` to use the existing `remix.json` data, or remove the orphaned data file.

8. **Audit legacy Disallow rules.** Verify that `/dataguide/intro/example`, `/dataguide/dummy`, and `/cloud` are still valid paths that need blocking. If these routes no longer exist, the rules can be removed.

---

## 7. Code References

| File | Purpose |
|---|---|
| `apps/site/src/lib/sitemap.ts` | Sitemap generation logic, XML rendering, route collection |
| `apps/site/src/lib/url.ts` | Base URL resolution (`getBaseUrl()`) |
| `apps/site/src/app/sitemap.xml/route.ts` | Sitemap index route handler |
| `apps/site/src/app/sitemap-site.xml/route.ts` | Site child sitemap route handler |
| `apps/site/src/app/robots.ts` | robots.txt generation |
| `apps/docs/src/app/(docs)/sitemap.ts` | Docs sitemap generation |
| `apps/blog/src/app/sitemap.ts` | Blog sitemap generation |
