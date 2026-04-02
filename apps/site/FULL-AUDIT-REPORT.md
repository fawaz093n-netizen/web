# Full SEO Audit Report — Prisma Website

**Audit Date:** 2026-04-02
**Target:** https://site-theta-two-38.vercel.app/ (staging for www.prisma.io)
**Business Type:** B2B SaaS — Database ORM & Managed Postgres Platform
**Pages Analyzed:** 81 (per sitemap) + manual inspection of 10+ key pages

---

## Executive Summary

### Overall SEO Health Score: **58 / 100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 62/100 | 25% | 15.5 |
| Content Quality | 62/100 | 25% | 15.5 |
| On-Page SEO | 68/100 | 20% | 13.6 |
| Schema / Structured Data | 55/100 | 10% | 5.5 |
| Performance (CWV) | 45/100 | 10% | 4.5 |
| Images | 40/100 | 5% | 2.0 |
| AI Search Readiness | 40/100 | 5% | 2.0 |
| **Total** | | | **58.6** |

### Top 5 Critical Issues

1. **Thin content across most pages** — Homepage ~120 words (500 min), ORM/MCP under 300 words (800 min). Only pricing page has adequate content depth (~2,200 words). This is the single biggest SEO risk.
2. **`/accelerate` page linked in navigation but doesn't exist** — returns 308 redirect to `/`, confusing for users and crawlers
3. **`images.unoptimized: true` in next.config.mjs** — all images served unoptimized, no WebP/AVIF, no responsive srcset, hurting LCP
4. **Excessive image preloads on homepage** — 11+ `<link rel="preload">` images saturate bandwidth and degrade LCP. Only 1-2 should be preloaded.
5. **`FAQPage` schema on `/pricing` no longer provides SEO benefit** — Google restricted FAQ rich results to government/healthcare sites in Aug 2023

### Top 5 Quick Wins

1. Fix the `/accelerate` nav link (remove or create page)
2. Add `lastmod` dates to sitemap entries (0 of 756 non-blog URLs have them)
3. Fix `robots.txt` sitemap URL — change hardcoded `www.prisma.io` to `getBaseUrl()`
4. Remove duplicate `<title>Discord</title>` element appearing on every page
5. Add `loading="lazy"` to below-fold images on `/orm` and other pages

---

## 1. Technical SEO (62/100)

### Crawlability

| Check | Status | Notes |
|-------|--------|-------|
| robots.txt | ⚠️ Warning | Exists but `Sitemap:` directive hardcoded to `https://www.prisma.io/sitemap.xml` — should use `getBaseUrl()` |
| robots.txt Host | ✅ Good | `Host:` uses `getBaseUrl()` correctly |
| Sitemap index | ✅ Good | `/sitemap.xml` references 3 child sitemaps |
| Site sitemap | ✅ Good | `/sitemap-site.xml` lists 81 URLs with priority/changefreq |
| Sitemap lastmod | ❌ Missing | No `<lastmod>` on any sitemap entry — crawlers can't prioritize recent changes |
| Disallow rules | ✅ Good | Only legacy paths blocked (`/dataguide/intro/example`, `/dataguide/dummy`, `/cloud`) |
| JavaScript rendering | ⚠️ Warning | Heavy JS dependency (React, Three.js particles on homepage) — ensure SSR coverage |

### Indexability

| Check | Status | Notes |
|-------|--------|-------|
| Canonical tags | ⚠️ Partial | 42/43 pages have canonical URLs; all point to `www.prisma.io` (correct for production) |
| Meta robots | ❌ Missing | No `<meta name="robots">` on any page — should add default `index, follow` |
| Noindex pages | ⚠️ Check | 404 page and legal pages (terms, privacy, SLA) should consider `noindex` |
| Duplicate content | ⚠️ Warning | `/accelerate` returns homepage content — soft 404 |
| Broken navigation link | ❌ Critical | Nav links to `/accelerate` but no page exists in codebase |

### Security Headers

| Header | Status | Value |
|--------|--------|-------|
| Content-Security-Policy | ✅ Present | Comprehensive CSP with many allowed sources |
| X-Frame-Options | ✅ Present | `SAMEORIGIN` |
| X-Content-Type-Options | ✅ Present | `nosniff` |
| Referrer-Policy | ✅ Present | `strict-origin-when-cross-origin` |
| Strict-Transport-Security | ❌ Missing | No HSTS header configured |
| Permissions-Policy | ❌ Missing | Not configured |

### URL Structure

| Check | Status | Notes |
|-------|--------|-------|
| Clean URLs | ✅ Good | All pages use clean, descriptive paths (`/pricing`, `/orm`, `/mcp`) |
| Trailing slashes | ✅ Good | Consistent no-trailing-slash pattern |
| URL depth | ✅ Good | Most pages 1 level deep; changelogs at 2 levels |
| Asset prefix | ⚠️ Note | `assetPrefix: "/site-static"` — ensure CDN serves these correctly |

### Redirects

| Check | Status | Notes |
|-------|--------|-------|
| Legacy redirects | ✅ Good | 60+ redirects for old blog posts, legacy domains, renamed pages |
| Domain redirects | ✅ Good | `prisma.studio`, `prismagraphql.com`, `prisma.sh`, etc. all redirect properly |
| Status codes | ✅ Good | Mix of 301 (permanent) and 302 (temporary) used appropriately |
| Duplicate `redirects()` | ⚠️ Bug | `next.config.mjs` defines `redirects()` twice (lines 245 and 269) — first one is empty and gets overridden |

---

## 2. Content Quality (62/100)

### E-E-A-T Signals

| Signal | Status | Notes |
|--------|--------|-------|
| Experience | ✅ Strong | Testimonials from real developers, GitHub stars (45k+), 250k+ active devs |
| Expertise | ✅ Strong | Technical content demonstrates deep database/ORM knowledge |
| Authority | ✅ Strong | Social proof via Organization schema with GitHub, Twitter, LinkedIn, YouTube, Facebook |
| Trust | ✅ Good | Cookie consent (CookieYes), privacy policy, terms, SLA, support policy pages |

### Content Depth by Page (Specialist Finding: Thin Content is #1 Issue)

| Page | Word Count | Minimum | Status | Notes |
|------|-----------|---------|--------|-------|
| Homepage (`/`) | ~120 words | 500 | ❌ Critical | No explanation of what Prisma is — just taglines and feature card titles |
| Pricing (`/pricing`) | ~2,200 words | 800 | ✅ Excellent | FAQs, calculator, comparison table |
| ORM (`/orm`) | ~250 words | 800 | ❌ Critical | Visually rich but text-sparse for crawlers |
| MCP (`/mcp`) | ~280 words | 800 | ❌ Critical | Same pattern — cards and visuals, little indexable text |
| Studio (`/studio`) | ~200 words | 800 | ❌ Critical | Feature sections are mostly headings |
| Postgres (`/postgres`) | ~350 words | 800 | ⚠️ Thin | Better than others but still below floor |
| Community (`/community`) | ~100 words | 300 | ❌ Critical | Mostly links to external platforms |
| Changelog (`/changelog`) | ✅ Good | — | ✅ | 30+ entries with substantive release notes |

### Duplicate Content Risk

- **Testimonials section** from `src/data/homepage.json` is rendered identically on both homepage and ORM page — creates a duplicate content signal

### AI Citation Readiness: 4/10

Only the pricing FAQ content is reliably quotable. Product pages need clear, fact-dense paragraphs that define what each product does.

### Meta Description Quality

| Page | Length | Quality |
|------|--------|---------|
| Homepage | 134 chars | ⚠️ Doesn't match page content — mentions MySQL/SQLite but page is about Postgres |
| Pricing | 114 chars | ✅ Good |
| ORM | Not visible in fetch | ❌ May be missing or inherited from layout |
| MCP | 142 chars | ✅ Good |
| Studio | 83 chars | ✅ Good |
| Postgres | 79 chars | ✅ Good |

### Heading Structure Issues

| Page | Issue |
|------|-------|
| Homepage | ✅ Single H1, logical H2→H3 hierarchy |
| Pricing | ❌ No H1 — jumps to H2 "Scale as You Grow" and uses H4 for FAQ, H6 for plan names |
| ORM | ✅ Single H1 "Next-generation Node.js and TypeScript ORM" |
| MCP | ✅ Single H1 with good hierarchy |
| Studio | ✅ Good heading structure |

---

## 3. On-Page SEO (72/100)

### Title Tags

| Page | Title | Length | Issues |
|------|-------|--------|--------|
| Homepage | "Prisma \| Instant Postgres plus an ORM for simpler db workflows" | 63 chars | ✅ Good length |
| Pricing | "Pricing - Prisma Data Platform" | 31 chars | ⚠️ Short — could add more keyword value |
| ORM | "Prisma \| Next-generation ORM for Node.js & TypeScript" | 55 chars | ✅ Good |
| MCP | "Prisma MCP Server" | 18 chars | ❌ Too short — add description |
| Studio | "Prisma Studio \| Next-generation ORM for Node.js and TypeScript" | 64 chars | ⚠️ Generic — should focus on Studio's value |
| Postgres | "Prisma Postgres \| Instant Global Databases" | 45 chars | ✅ Good |

### Open Graph & Twitter Cards

| Page | OG Tags | Twitter Card | Issues |
|------|---------|-------------|--------|
| Homepage | ✅ Full | ✅ Full | — |
| Pricing | ✅ Full | ✅ Full | — |
| ORM | ❌ Missing | ❌ Missing | Only has site-wide JSON-LD; no page-level OG/Twitter |
| MCP | ✅ Full | ✅ Full | Best implementation — includes site, creator, dimensions |
| Studio | ✅ Full | ✅ Full | — |
| Postgres | ✅ Full | ✅ Full | — |
| Community | ✅ Full | ⚠️ Partial | Missing twitter:site and twitter:creator |

### Internal Linking

| Check | Status | Notes |
|-------|--------|-------|
| Navigation coverage | ✅ Good | All major pages linked from nav |
| Footer links | ✅ Good | Comprehensive footer with products, resources, company sections |
| Orphan pages | ⚠️ Check | Some "prisma-with" pages (e.g., `/hapi`, `/cockroachdb`) may have low internal link equity |
| Broken internal link | ❌ Critical | `/accelerate` linked in nav but page doesn't exist |
| Cross-linking | ⚠️ Medium | Product pages could cross-link more (e.g., ORM → Studio, Postgres → MCP) |

---

## 4. Schema & Structured Data (60/100)

### Current Implementation

| Schema Type | Present On | Valid | Notes |
|-------------|-----------|-------|-------|
| Organization | All pages (via layout) | ✅ | Name, URL, logo, sameAs profiles |
| WebSite | All pages (via layout) | ✅ | Publisher references Organization |
| FAQPage | `/pricing` | ✅ | 11 Q&A entries |

### Missing Opportunities

| Schema Type | Recommended For | Priority |
|-------------|----------------|----------|
| SoftwareApplication | `/orm`, `/studio`, `/mcp` | High |
| Product | `/postgres`, `/pricing` | High |
| BreadcrumbList | All pages | Medium |
| VideoObject | `/mcp`, `/studio`, `/orm` (all have video) | Medium |
| HowTo | Integration pages (`/nextjs`, `/express`, etc.) | Medium |
| Review/AggregateRating | Homepage testimonials | Low |
| WebPage | All pages (basic page identity) | Low |

### Validation Issues

- **FAQPage schema on `/pricing` is ineffective** — Google restricted FAQ rich results to government/healthcare sites in Aug 2023. Replace with `WebPage` + `Product`/`Offer` schema.
- Organization `logo` should be wrapped in `ImageObject` with `width`/`height` per Google guidelines
- Organization `logo` points to SVG — Google recommends PNG/JPG
- `sameAs` uses `twitter.com` — should update to `x.com`
- No `SearchAction` on WebSite schema (site has search at `/api/search`)
- `sameAs` includes Facebook page — verify it's still active

---

## 5. Performance (45/100) — Revised after Lighthouse testing

### Lighthouse Scores

| Page | Mobile | Desktop |
|------|--------|---------|
| Homepage | **50/100** | **90/100** |
| Pricing | **68/100** | — |

### Core Web Vitals

| Metric | Homepage Mobile | Pricing Mobile | Threshold | Status |
|--------|----------------|----------------|-----------|--------|
| LCP | **15.3s** | **6.9s** | 2.5s | ❌ FAIL (6x over on homepage) |
| CLS | 0.001 | 0.005 | 0.1 | ✅ PASS |
| TBT (INP proxy) | **640ms** | Pass | 200ms | ❌ FAIL on homepage |

### Top 3 Performance Bottlenecks

1. **Images completely unoptimized** — `images.unoptimized: true` + testimonial avatars served as full-resolution PNGs (400+ KB each for ~64px display). Single largest LCP contributor.
2. **33 `<link rel="preload" as="image">` hints** in HTML head — every below-fold avatar and SVG is preloaded, starving critical resources of bandwidth on mobile.
3. **Massive unoptimized SVGs** — `typesafe.svg` (549 KB), `data.svg` (387 KB) + 317 KB variable font = 1.3 MB avoidable payload.

### Additional Performance Issues

| Issue | Severity | Details |
|-------|----------|---------|
| Three.js hero animation | ⚠️ High | `Antigravity` component loads eagerly with 232 KB bundle |
| Two Font Awesome kit scripts | ⚠️ High | Redundant network requests for icon loading |
| Raw `<img>` tags | ⚠️ High | `bento.tsx` and `card-section.tsx` use raw `<img>` bypassing Next.js optimization |
| CookieYes script | ⚠️ Medium | Third-party consent banner in `<head>` |
| GTM with cookie gating | ✅ Good | Won't load until consent given |
| Google Fonts (Inter) | ✅ Good | Using `next/font/google` for optimized loading |

### Resource Optimization Recommendations (Priority Order)

1. **Enable Next.js Image Optimization** (`images.unoptimized: false`) — biggest single impact
2. **Remove 30+ excessive image preloads** — only preload the actual LCP element
3. **Optimize oversized SVGs** — run through SVGO or convert to optimized formats
4. **Replace raw `<img>` with Next.js `<Image>`** in `bento.tsx` and `card-section.tsx`
5. **Lazy-load Three.js particles** — `dynamic()` with `ssr: false` and a static placeholder
6. **Deduplicate Font Awesome scripts** — two kit scripts creating redundant requests
7. **Self-host Font Awesome** or use SVG icons to eliminate external dependency
8. **Add `fetchpriority="high"`** to the single LCP image only

---

## 6. Images (55/100)

| Check | Status | Notes |
|-------|--------|-------|
| Alt text coverage | ⚠️ Partial | Most feature images have alt text; some decorative images and logos missing alt |
| Image optimization | ❌ Critical | `images.unoptimized: true` — no WebP/AVIF conversion, no responsive sizing |
| Lazy loading | ⚠️ Unknown | Need to verify if below-fold images use `loading="lazy"` |
| Image formats | ⚠️ Suboptimal | SVGs used for logos (good), but raster images likely served as PNG/JPG |
| OG images | ✅ Good | Custom OG images for most pages (pricing, MCP, studio, postgres, community) |
| OG image dimensions | ⚠️ Inconsistent | MCP page specifies 1200x630; others don't specify dimensions |

---

## 7. AI Search Readiness (50/100)

| Check | Status | Notes |
|-------|--------|-------|
| llms.txt | ❌ Empty | `/llms-full.txt` returns empty response body |
| llms.mdx | ❌ 404 | `/llms.mdx` route calls `notFound()` |
| Structured data | ⚠️ Partial | Organization + WebSite schemas help, but no Product/SoftwareApplication |
| Content structure | ✅ Good | Clear headings, semantic HTML, descriptive content |
| Citability | ⚠️ Medium | Good brand mentions but lacks specific data points AI can cite |
| Author attribution | ❌ Missing | No author markup on any page |

### Recommendations for AI Search

1. **Populate `llms-full.txt`** with a complete text summary of Prisma's products and capabilities
2. **Implement `llms.txt`** (not just `.mdx`) following the emerging standard
3. **Add SoftwareApplication schema** to product pages for AI extraction
4. **Include specific, quotable data points** (benchmarks, statistics, comparisons) that AI systems can cite
5. **Add FAQ structured data** to more pages beyond pricing

---

## 8. Visual Audit Findings

### Above-the-Fold Analysis

| Page | Desktop | Mobile | Key Issue |
|------|---------|--------|-----------|
| Homepage | ✅ Strong | ✅ Good | H1, subheading, dual CTAs all visible above fold |
| Pricing | ✅ Excellent | ❌ Problem | Mobile: no pricing visible above fold — H1 consumes entire viewport |
| ORM | ✅ Good | ⚠️ Weak | Dark CTA button blends into purple hero; CTA at extreme bottom of mobile viewport |

### Mobile Responsiveness

- Hamburger navigation works correctly
- Content stacks properly on all tested pages
- No horizontal overflow detected
- Touch targets adequate
- No font loading issues (FOUT/FOIT)

### Screenshots

12 screenshots captured in `/screenshots/` directory (desktop + mobile for homepage, pricing, ORM).

---

## 9. Additional Technical Findings (from Specialist Audit)

### New Critical/High Issues

| Issue | Severity | Details |
|-------|----------|---------|
| Excessive image preloads | ❌ Critical | Homepage preloads 11+ images via `<link rel="preload">` — saturates bandwidth |
| Duplicate `<title>Discord</title>` | ⚠️ High | Extra title element appears on every page |
| No AI crawler rules | ⚠️ High | robots.txt has no rules for GPTBot, ClaudeBot, etc. |
| Hero SVGs missing dimensions | ⚠️ High | Homepage and `/orm` hero SVGs lack `width`/`height` — CLS risk |
| Missing `loading="lazy"` | ⚠️ High | Multiple below-fold images on `/orm` don't lazy-load |
| Thin integration pages | ⚠️ Medium | `/cockroachdb` and `/planetscale` are only ~35 lines (mostly metadata) |
| Orphaned data file | ⚠️ Low | `src/data/prisma-with/remix.json` exists but has no corresponding page |

### Confirmed Working Well (from Specialist Audit)

- Strong SSR/prerender — all pages serve full HTML without requiring JavaScript
- HSTS with preload IS present on the live site (corrects earlier finding)
- Proper H1 usage confirmed on all checked pages
- Meta descriptions and OG tags present on all pages via code inspection

---

## 10. Sitemap Deep Dive (from Specialist Audit)

| Sitemap | URLs | lastmod | Status |
|---------|------|---------|--------|
| sitemap-site.xml | 77 | 0/77 have lastmod | ❌ Missing |
| docs/sitemap.xml | 679 | 0/679 have lastmod | ❌ Missing |
| blog/sitemap.xml | 245 | 244/245 have lastmod | ✅ Good |
| **Total** | **1,001** | | |

- All three sitemaps include deprecated `<changefreq>` and `<priority>` tags (Google ignores both)
- URL counts are healthy — well under the 50,000/file limit
- `SitemapEntry` type in `src/lib/sitemap.ts` has no `lastmod` field at all

---

## 11. Page-by-Page Issues Summary

### Pages Missing Canonical Tags
All 42 content pages have canonical tags. ✅

### Pages Missing OG/Twitter Tags
Based on code inspection, the following pages use `createPageMetadata()` (which includes OG/Twitter) or define them inline:

| Page | Uses createPageMetadata | Inline OG | Status |
|------|------------------------|-----------|--------|
| ORM (`/orm`) | ✅ (via createPageMetadata) | — | ✅ Good |
| All prisma-with pages | ❌ | ✅ inline | ✅ Good |
| Most other pages | Mix | Mix | ✅ Good |

Note: The ORM page appeared to be missing OG tags when fetched, but the code uses `createPageMetadata` which generates them. This may be a rendering/extraction issue.

### Pages Not in Sitemap but Should Be

The sitemap auto-generates from the file system, so coverage should be complete. However:
- Changelog individual entries are included ✅
- Dynamic/parameterized routes are correctly excluded ✅

### Navigation Links to Non-Existent Pages

| Link | Target | Exists | Status |
|------|--------|--------|--------|
| Accelerate | `/accelerate` | ❌ | Broken — page was likely removed but nav not updated |

---

## 9. Miscellaneous Issues

### Code Quality Issues

1. **Duplicate `redirects()` function** in `next.config.mjs` (lines 245 and 269) — the first empty one is overridden by the second
2. **Duplicate `rewrites()` function** in `next.config.mjs` (lines 253 and 745) — the first one (just `.mdx` rewrite) is overridden
3. **`dangerouslySetInnerHTML`** used for testimonials title and FAQ answers — ensure content is sanitized
4. **CSP has duplicate entries** — `static.ads-twitter.com`, `snap.licdn.com`, `googleads.g.doubleclick.net` appear multiple times
5. **Homepage meta description mismatch** — `SITE_HOME_DESCRIPTION` in `site-metadata.ts` differs from the one in `structured-data.ts`

### Meta Description Inconsistency

- **`site-metadata.ts`**: "Build, fortify, and grow your application easily with an intuitive data model, type-safety, automated migrations, connection pooling and caching."
- **`structured-data.ts`** (JSON-LD): "Prisma is a next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB."
- The JSON-LD description is more SEO-friendly; consider aligning them.

### Cookie Consent Compliance

- CookieYes integration present ✅
- Analytics scripts properly cookie-gated ✅
- GTM consent mode appears configured ✅

---

## 10. Competitive SEO Positioning

### Keyword Opportunities

| Keyword Theme | Current Coverage | Opportunity |
|---------------|-----------------|-------------|
| "postgres orm" | ✅ Strong (homepage, ORM page) | — |
| "managed postgres" | ✅ Good (homepage, postgres page) | Add comparison content |
| "prisma mcp" | ✅ Good (dedicated page) | Add more AI/LLM integration content |
| "database studio" | ✅ Good (studio page) | — |
| "prisma vs [competitor]" | ❌ Missing | Create comparison pages |
| "typescript orm" | ✅ Good | Strengthen with benchmarks |
| "prisma pricing" | ✅ Strong | — |
| "prisma tutorial" | ⚠️ Redirects to docs | Consider landing page |

---

## Priority Action Plan

### Critical (Fix Immediately)

1. **Remove or fix `/accelerate` navigation link** — currently leads to soft 404
2. **Fix `robots.txt` sitemap URL** — change from hardcoded `www.prisma.io` to dynamic `getBaseUrl()` in `robots.ts`
3. **Enable image optimization** — set `images.unoptimized: false` in `next.config.mjs`
4. **Fix duplicate `redirects()`/`rewrites()` functions** in `next.config.mjs`

### High Priority (Fix Within 1 Week)

5. **Add `lastmod` to sitemap entries** — use file modification dates or git history
6. **Add missing H1 to pricing page** — current structure skips from nav to H2
7. **Improve title tags** — MCP ("Prisma MCP Server" → "Prisma MCP Server | AI-Powered Database Management"), Studio (make specific to Studio)
8. **Add HSTS header** — `Strict-Transport-Security: max-age=31536000; includeSubDomains`
9. **Align meta descriptions** — `site-metadata.ts` vs `structured-data.ts` should use consistent messaging
10. **Add SoftwareApplication schema** to product pages (ORM, Studio, MCP)

### Medium Priority (Fix Within 1 Month)

11. **Populate `llms-full.txt`** with comprehensive site content for AI crawlers
12. **Add BreadcrumbList schema** to all pages
13. **Add VideoObject schema** to pages with embedded videos
14. **Self-host Font Awesome** or switch to SVG icons to reduce third-party dependencies
15. **Add `Permissions-Policy` header**
16. **Clean up CSP duplicates** in `next.config.mjs`
17. **Create comparison/alternatives pages** (e.g., "Prisma vs Drizzle", "Prisma vs TypeORM")
18. **Add SearchAction to WebSite schema** — site has search functionality at `/api/search`

### Low Priority (Backlog)

19. **Add noindex to utility pages** (terms, privacy, SLA, support-policy) if not needed in search
20. **Add author attribution** to content for E-E-A-T signals
21. **Improve cross-linking** between product pages
22. **Add AggregateRating schema** from testimonials
23. **Specify OG image dimensions** consistently across all pages
24. **Convert Organization logo** from SVG to PNG for Google compatibility
