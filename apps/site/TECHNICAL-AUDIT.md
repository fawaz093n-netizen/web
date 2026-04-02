# Technical SEO Audit Report

**Target:** https://site-theta-two-38.vercel.app/ (staging preview of www.prisma.io)
**Date:** 2026-04-02
**Audited Pages:** `/`, `/pricing`, `/orm`, `/accelerate`, `/mcp`, `/studio`, `/blog`, `/changelog`
**Overall Technical Score: 62 / 100**

---

## Executive Summary

The site is a Next.js application deployed on Vercel with server-side rendering (SSR) and static prerendering. Security headers are strong, structured data is present, and pages render full HTML server-side. However, there are critical issues with domain-mismatched robots.txt/sitemaps, excessive image preloads harming LCP, missing `Permissions-Policy` header, no AI crawler management, and images served unoptimized. The `/accelerate` route returns a 308 redirect to `/` instead of serving content, which is a crawlability concern if the page is expected to exist.

---

## 1. Crawlability

**Status: FAIL**

### 1.1 robots.txt

| Check | Result |
|-------|--------|
| Exists | PASS - served at `/robots.txt` |
| Correct Host | FAIL - `Host: https://www.prisma.io` (should match staging domain or be environment-aware) |
| Sitemap reference | FAIL - hardcoded to `https://www.prisma.io/sitemap.xml` |
| Disallow rules | PASS - blocks `/dataguide/intro/example`, `/dataguide/dummy`, `/cloud` |
| AI crawler rules | FAIL - no rules for GPTBot, ChatGPT-User, ClaudeBot, CCBot, PerplexityBot, Google-Extended, Bytespider |

**Root cause:** In `src/app/robots.ts`, the sitemap URL is hardcoded:
```ts
sitemap: "https://www.prisma.io/sitemap.xml",
```
While `host` uses `getBaseUrl()`, the sitemap does not. On the staging deployment, `NEXT_PUBLIC_PRISMA_URL` is not set, so `getBaseUrl()` returns `https://www.prisma.io` in production mode (see `src/lib/url.ts` lines 22-24).

### 1.2 Sitemaps

| Check | Result |
|-------|--------|
| Sitemap index exists | PASS - `/sitemap.xml` returns valid sitemapindex |
| Child sitemaps | PASS - 3 children: `sitemap-site.xml`, `docs/sitemap.xml`, `blog/sitemap.xml` |
| URLs in sitemaps | FAIL - all URLs point to `https://www.prisma.io/*`, not the staging domain |
| Sitemap-site.xml accessible | PASS - returns valid urlset |
| changefreq/priority | PASS - homepage has `daily/1.0`, others `weekly/0.8` |

### 1.3 /accelerate Redirect

| Check | Result |
|-------|--------|
| /accelerate | FAIL - returns **308 Permanent Redirect** to `/` |

This is a broken product page. If `/accelerate` is intentionally removed, ensure all internal links and sitemap entries are updated. A 308 to the homepage is a poor user and crawler experience.

### Recommendations (Crawlability)

- **[CRITICAL]** Make the sitemap URL in `src/app/robots.ts` dynamic: `sitemap: \`${getBaseUrl()}/sitemap.xml\``
- **[CRITICAL]** Ensure `NEXT_PUBLIC_PRISMA_URL` is set for each deployment environment so `getBaseUrl()` returns the correct domain
- **[HIGH]** Add AI crawler rules to `robots.txt`. At minimum, add explicit `User-Agent` blocks for `GPTBot`, `ChatGPT-User`, `ClaudeBot/Anthropic`, `CCBot`, `PerplexityBot`, and `Google-Extended` -- either allowing or disallowing as desired
- **[HIGH]** Investigate the `/accelerate` 308 redirect. If the page was removed, purge it from sitemaps and internal navigation
- **[MEDIUM]** Consider adding `lastmod` timestamps to sitemap entries for better crawl scheduling

---

## 2. Indexability

**Status: WARN**

### 2.1 Canonical Tags

| Page | Canonical | Correct? |
|------|-----------|----------|
| `/` | `https://www.prisma.io` | WARN - points to production, not staging |
| `/pricing` | `https://www.prisma.io/pricing` | WARN - same |
| `/orm` | `https://www.prisma.io/orm` | WARN - same |
| `/mcp` | `https://www.prisma.io/mcp` | WARN - same |
| `/studio` | `https://www.prisma.io/studio` | WARN - same |
| `/blog` | `https://www.prisma.io/blog` | WARN - same |
| `/changelog` | `https://www.prisma.io/changelog` | WARN - same |

All canonical tags point to `www.prisma.io`. This is **correct behavior for a staging/preview deployment** -- it prevents the staging site from being indexed and competing with production. However, this means the staging domain itself is not independently testable for canonical correctness. On production, these canonicals would be correct.

The canonical implementation in `src/lib/page-metadata.ts` is environment-aware via `getBaseUrl()`, which is good architecture.

### 2.2 Robots Meta Tag

No explicit `<meta name="robots">` tag found on any page. Pages rely on `robots.txt` for crawl directives. This is acceptable but adding `<meta name="robots" content="index, follow">` on production (and `noindex, nofollow` on staging) would be more explicit.

### 2.3 Title Tags

| Page | Title | Length |
|------|-------|--------|
| `/` | Prisma \| Instant Postgres plus an ORM for simpler db workflows | 62 chars - PASS |
| `/pricing` | Pricing - Prisma Data Platform | 30 chars - PASS |
| `/orm` | Prisma \| Next-generation ORM for Node.js & TypeScript | 54 chars - PASS |
| `/mcp` | Prisma MCP Server | 18 chars - WARN (short) |
| `/studio` | Prisma Studio \| Next-generation ORM for Node.js and TypeScript | 62 chars - PASS |
| `/blog` | Prisma Blog \| Articles & Updates \| Prisma, ORMs, Databases | 58 chars - PASS |
| `/changelog` | Release Notes \| Prisma | 22 chars - PASS |

### 2.4 Meta Descriptions

All audited pages have meta descriptions. Lengths are appropriate (under 160 chars).

### 2.5 H1 Tags

Homepage has exactly one H1: "Postgres, perfectly managed." -- PASS.

### 2.6 Hreflang

No hreflang tags detected. The site is English-only (`lang="en"`), so this is acceptable.

### 2.7 Duplicate Title Tag

All pages render a second `<title>Discord</title>` element in the HTML. This appears to come from an embedded Discord widget or iframe content that is leaking into the main document's head. While browsers use the first title, this is technically invalid HTML and could confuse some parsers.

### Recommendations (Indexability)

- **[HIGH]** Remove the duplicate `<title>Discord</title>` tag appearing on all pages
- **[MEDIUM]** Add explicit `<meta name="robots" content="noindex, nofollow">` on staging deployments (when domain is not `www.prisma.io`)
- **[LOW]** Consider lengthening the `/mcp` title for better SERP presentation (e.g., "Prisma MCP Server | Manage Databases with AI Agents")

---

## 3. Security Headers

**Status: PASS**

| Header | Present | Value | Assessment |
|--------|---------|-------|------------|
| `strict-transport-security` | PASS | `max-age=63072000; includeSubDomains; preload` | Excellent (2-year max-age with preload) |
| `x-content-type-options` | PASS | `nosniff` | Correct |
| `x-frame-options` | PASS | `SAMEORIGIN` | Correct |
| `content-security-policy` | PASS | Comprehensive policy | Good (see notes) |
| `referrer-policy` | PASS | `strict-origin-when-cross-origin` | Good |
| `permissions-policy` | FAIL | Not present | Missing |
| `x-xss-protection` | N/A | Not present | Acceptable (deprecated in modern browsers) |

### CSP Notes

- `script-src` includes `'unsafe-inline'` and `'unsafe-eval'` -- this weakens CSP significantly but is common for Next.js apps with third-party scripts
- `img-src` includes `http://localhost:3002` and `http://127.0.0.1:3002` -- these development origins should be removed in production builds
- Duplicate entries in CSP: `https://static.ads-twitter.com`, `https://snap.licdn.com`, `https://googleads.g.doubleclick.net`, `https://prisma.io` appear multiple times

### Blog HSTS Difference

The `/blog` route returns `strict-transport-security: max-age=63072000` **without** `includeSubDomains; preload`. This is because `/blog` is proxied to a separate blog origin via rewrites. The blog origin should match the same HSTS policy.

### Recommendations (Security)

- **[HIGH]** Add `Permissions-Policy` header (e.g., `Permissions-Policy: camera=(), microphone=(), geolocation=()`)
- **[MEDIUM]** Remove `localhost` and `127.0.0.1` from CSP `img-src` in production
- **[MEDIUM]** Deduplicate CSP entries to reduce header size
- **[MEDIUM]** Ensure the blog origin includes `includeSubDomains; preload` in its HSTS header
- **[LOW]** Evaluate whether `'unsafe-eval'` can be removed from `script-src`

---

## 4. URL Structure

**Status: WARN**

### 4.1 URL Cleanliness

| Check | Result |
|-------|--------|
| Clean URLs (no query params, no extensions) | PASS |
| Lowercase | PASS |
| No trailing slashes | PASS |
| Descriptive slugs | PASS |
| Reasonable depth | PASS (max 2 levels for main pages) |

### 4.2 Redirect Chains

| Route | Status | Destination | Assessment |
|-------|--------|-------------|------------|
| `/accelerate` | 308 | `/` | FAIL - product page redirects to homepage |
| `/pulse` | 301 | `/postgres` (configured) | OK - intentional product redirect |
| `/changelogs` | 301 | `/changelog` | OK - plural correction |

### 4.3 Asset Prefix

The site uses `assetPrefix: "/site-static"` in `next.config.mjs`. All JS/CSS chunks are served under `/site-static/_next/static/`. This is correct for the multi-app reverse proxy setup and does not cause SEO issues.

### Recommendations (URL Structure)

- **[HIGH]** Resolve the `/accelerate` redirect -- either restore the page or ensure it is properly removed from all references
- **[LOW]** Review the extensive redirect list in `next.config.mjs` (70+ rules) for any that are no longer needed

---

## 5. Mobile Optimization

**Status: PASS**

| Check | Result |
|-------|--------|
| Viewport meta tag | PASS - `width=device-width, initial-scale=1` |
| `lang` attribute | PASS - `lang="en"` |
| Font preloading | PASS - WOFF2 font preloaded |
| Responsive images | WARN - see below |
| CSS-based responsiveness | PASS - Tailwind utility classes with `sm:`, `md:`, `lg:` breakpoints |

### Mobile Image Handling

The site uses responsive show/hide patterns (`hidden sm:block` / `sm:hidden`) to serve different image variants for mobile vs desktop. This is acceptable but means **both images are downloaded** -- the hidden one is just not displayed. Using `<picture>` with `<source media="...">` would prevent unnecessary downloads.

### Recommendations (Mobile)

- **[MEDIUM]** Replace CSS show/hide image patterns with `<picture>` + `<source>` elements to avoid downloading both mobile and desktop images
- **[LOW]** Verify touch target sizes are at least 48x48px (requires runtime testing)

---

## 6. Core Web Vitals Readiness

**Status: WARN**

### 6.1 LCP (Largest Contentful Paint)

**Risk: HIGH**

The homepage preloads **11 images** via `<link rel="preload" as="image">`:
- `/illustrations/homepage/mcp.svg`
- `/illustrations/homepage/ide.svg`
- `/illustrations/homepage/typesafe.svg`
- `/illustrations/homepage/collaborative.svg`
- `/illustrations/homepage/data.svg`
- `/icons/technologies/betterauth.png`
- `/icons/technologies/clerk.jpeg`
- `/illustrations/homepage/real_ppg.svg`
- `/illustrations/homepage/real_ppg_mobile.svg`
- `/photos/people/yuval-hazaz.jpeg`
- Plus 5 more testimonial photos

**This is excessive.** Preloading too many resources defeats the purpose -- the browser cannot prioritize the actual LCP element. The LCP candidate is likely the H1 text or the first hero illustration. Only the true LCP resource should be preloaded.

Additionally, the top 5 hero SVG images (`mcp.svg`, `ide.svg`, `typesafe.svg`, `collaborative.svg`, `data.svg`) have **no `width`, `height`, or `loading` attributes** and are not processed through Next.js Image component. They are raw `<img>` tags with no explicit dimensions.

### 6.2 CLS (Cumulative Layout Shift)

**Risk: MEDIUM**

- Hero SVG images lack explicit `width`/`height` attributes, which means the browser cannot reserve space before the image loads. This is a CLS risk.
- Testimonial profile photos also lack `width`/`height` and `loading` attributes.
- Technology icon grid images do have `width="50" height="50"` -- good.
- The ORM page (`/orm`) has 10+ images without `loading` attribute or explicit dimensions.
- Font loading: one WOFF2 font is preloaded, but the site uses a custom font class (`inter_5901b7c6-module__ec5Qua__variable`). If the font swap causes visible reflow, this contributes to CLS.

### 6.3 INP (Interaction to Next Paint)

**Risk: LOW-MEDIUM**

- The site uses React Compiler (`reactCompiler: true`), which can help reduce re-renders.
- 3 script tags on the homepage is minimal.
- Third-party scripts (CookieYes, FontAwesome, Google Tag Manager, Kapa AI widget) are loaded but appear to be deferred or async.
- The homepage HTML is 573KB, which is large but the SSR approach means content is immediately available.

### Recommendations (Core Web Vitals)

- **[CRITICAL]** Reduce image preloads to only the actual LCP resource (likely 1-2 images maximum). Currently 11+ images are preloaded, saturating bandwidth.
- **[HIGH]** Add explicit `width` and `height` attributes to all hero SVG images to prevent CLS.
- **[HIGH]** Add `loading="lazy"` to all below-the-fold images and `fetchpriority="high"` to the LCP image only.
- **[HIGH]** Enable Next.js Image optimization (`images.unoptimized` is currently `true` in `next.config.mjs` line 260). This disables all automatic image optimization, responsive sizing, and modern format (WebP/AVIF) conversion.
- **[MEDIUM]** Add explicit dimensions to testimonial profile photos.
- **[LOW]** Consider reducing homepage HTML size (573KB) by lazy-loading below-fold sections.

---

## 7. Structured Data

**Status: PASS**

### 7.1 Site-Wide Schema

All pages include `Organization` + `WebSite` JSON-LD (via `src/lib/structured-data.ts`):
- `@type: Organization` with name, URL, logo, and sameAs links (GitHub, Twitter, LinkedIn, YouTube, Facebook)
- `@type: WebSite` with publisher reference

### 7.2 Page-Specific Schema

| Page | Extra Schema | Assessment |
|------|-------------|------------|
| `/pricing` | `FAQPage` with 11 Q&A entries | PASS - well-structured |
| `/orm` | None beyond site-wide | WARN - could benefit from SoftwareApplication schema |
| `/mcp` | None beyond site-wide | WARN - could benefit from SoftwareApplication schema |
| `/studio` | None beyond site-wide | WARN - could benefit from SoftwareApplication schema |
| `/blog` | Not inspected (proxied) | -- |

### 7.3 Schema Validation

The FAQ schema on `/pricing` is comprehensive and uses proper `acceptedAnswer` format. Text content is properly sanitized via `toPlainText()` in `src/lib/structured-data.ts`.

### Recommendations (Structured Data)

- **[MEDIUM]** Add `SoftwareApplication` schema to product pages (`/orm`, `/studio`, `/mcp`)
- **[LOW]** Add `BreadcrumbList` schema for improved SERP navigation
- **[LOW]** Consider `Product` schema with pricing info on `/pricing`

---

## 8. JavaScript Rendering

**Status: PASS**

| Check | Result |
|-------|--------|
| Rendering approach | SSR + Static Prerender (Next.js App Router) |
| `x-nextjs-prerender: 1` | PASS - pages are statically prerendered at build time |
| Full HTML in source | PASS - all content visible without JS execution |
| React hydration | PASS - hydration markers present (`data-nimg`) |
| `reactStrictMode` | PASS - enabled |
| React Compiler | PASS - enabled for optimized client-side performance |

The site uses `x-nextjs-stale-time: 300` (5 minutes) for ISR. Most pages return `x-vercel-cache: PRERENDER` or `HIT`, indicating effective caching.

The `/blog` route is SSR (not prerendered) based on its `cache-control: private, no-cache` header and lack of `x-nextjs-prerender`. This is expected since blog content is proxied from a separate origin.

### LLM/AI Content Serving

The site has a rewrite rule for `.mdx` files:
```js
{ source: "/:path*.mdx", destination: "/llms.mdx/:path*" }
```
This suggests support for LLM-friendly content access via `llms.txt`/`llms-full.txt` convention. This is a positive signal for AI discoverability.

### Recommendations (JavaScript Rendering)

- **[LOW]** No critical JS rendering issues. The SSR approach ensures search engines see full content.

---

## Issue Priority Summary

### Critical (3)

1. **Excessive image preloads** - 11+ images preloaded on homepage, degrading LCP
2. **robots.txt sitemap URL hardcoded** - `src/app/robots.ts` line 18 hardcodes `www.prisma.io`
3. **`images.unoptimized: true`** - all image optimization disabled in `next.config.mjs` line 260

### High (6)

4. **No AI crawler rules** in robots.txt (GPTBot, ClaudeBot, etc.)
5. **Missing `Permissions-Policy` header**
6. **Hero images missing `width`/`height`** - CLS risk on homepage and /orm
7. **`/accelerate` returns 308 to `/`** - broken product page
8. **Duplicate `<title>Discord</title>`** on all pages
9. **Images missing `loading="lazy"`** - multiple below-fold images on /orm page

### Medium (7)

10. Remove `localhost`/`127.0.0.1` from CSP img-src in production
11. Deduplicate CSP entries
12. Blog origin HSTS missing `includeSubDomains; preload`
13. Use `<picture>` elements instead of CSS show/hide for responsive images
14. Add `SoftwareApplication` schema to product pages
15. Add `lastmod` to sitemap entries
16. Add explicit `<meta name="robots">` on staging with `noindex`

### Low (5)

17. Lengthen `/mcp` page title
18. Add `BreadcrumbList` structured data
19. Evaluate removing `'unsafe-eval'` from CSP
20. Review 70+ redirect rules for stale entries
21. Consider reducing 573KB homepage HTML payload

---

## Files Referenced

- `/Users/marchess/Projects/web/apps/site/next.config.mjs` - Next.js configuration with CSP, redirects, rewrites, and image settings
- `/Users/marchess/Projects/web/apps/site/src/app/robots.ts` - robots.txt generation with hardcoded sitemap URL
- `/Users/marchess/Projects/web/apps/site/src/lib/url.ts` - `getBaseUrl()` implementation
- `/Users/marchess/Projects/web/apps/site/src/lib/sitemap.ts` - Sitemap generation logic
- `/Users/marchess/Projects/web/apps/site/src/lib/page-metadata.ts` - Canonical URL and OG metadata generation
- `/Users/marchess/Projects/web/apps/site/src/lib/structured-data.ts` - JSON-LD schema generation
