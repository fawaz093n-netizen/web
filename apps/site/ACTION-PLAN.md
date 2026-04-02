# SEO Action Plan — Prisma Website

**Generated:** 2026-04-02
**Overall Score:** 58/100 (revised after all specialist audits including Lighthouse)

---

## Critical — Fix Immediately

### 1. Remove or fix `/accelerate` navigation link
- **File:** `src/app/layout.tsx` (line ~68, nav links)
- **Issue:** `/accelerate` is linked in navigation but no page exists — returns homepage content (soft 404)
- **Fix:** Remove from nav or create the page
- **Impact:** Eliminates confusing soft 404 for users and crawlers

### 2. Fix robots.txt sitemap directive
- **File:** `src/app/robots.ts` (line 18)
- **Issue:** `sitemap: "https://www.prisma.io/sitemap.xml"` is hardcoded
- **Fix:** Change to `sitemap: \`${getBaseUrl()}/sitemap.xml\``
- **Impact:** Ensures crawlers find the correct sitemap on any deployment

### 3. Enable Next.js Image Optimization
- **File:** `next.config.mjs` (line 260)
- **Issue:** `images: { unoptimized: true }` — all images served at original size
- **Fix:** Set `unoptimized: false` and configure appropriate loader
- **Impact:** Significant LCP improvement, reduced page weight via WebP/AVIF

### 4. Fix duplicate config functions
- **File:** `next.config.mjs`
- **Issue:** `redirects()` defined at line 245 (empty) and line 269 (full); `rewrites()` defined at line 253 and 745 — first definitions silently overridden
- **Fix:** Remove the duplicate empty definitions
- **Impact:** Code clarity; the `.mdx` rewrite at line 253 is currently dead code

### 5. Fix excessive image preloads (33 preloads!)
- **Issue:** 33 `<link rel="preload" as="image">` hints in the HTML head — every below-fold testimonial avatar and illustration SVG is preloaded, starving critical resources
- **Fix:** Only preload the 1-2 resources that are the actual LCP element; remove all others
- **Impact:** Major LCP improvement — homepage mobile LCP is currently **15.3s** (threshold: 2.5s)

### 5b. Optimize oversized assets
- **Issue:** `typesafe.svg` (549 KB), `data.svg` (387 KB), 317 KB variable font = 1.3 MB avoidable payload. Testimonial avatars served as 400+ KB PNGs for 64px display.
- **Fix:** Run SVGs through SVGO, resize/compress avatar PNGs, subset the variable font
- **Impact:** Combined with image optimization, could cut page weight by 50%+

### 5c. Replace raw `<img>` with Next.js `<Image>`
- **Files:** `src/components/homepage/bento.tsx`, `src/components/homepage/card-section/card-section.tsx`
- **Issue:** Raw `<img>` tags bypass Next.js image optimization entirely
- **Fix:** Switch to `next/image` `<Image>` component with proper width/height/sizes
- **Impact:** Enables responsive images, lazy loading, and format optimization

### 6. Add substantive content to thin pages
- **Pages:** Homepage (~120 words), ORM (~250), MCP (~280), Studio (~200), Postgres (~350)
- **Issue:** 6 of 8 key pages fall below Google's content minimums
- **Fix:** Add descriptive paragraphs explaining what each product is, how it works, key differentiators
- **Impact:** This is the single biggest SEO improvement opportunity — without indexable text, pages struggle to rank

---

## High Priority — Fix Within 1 Week

### 7. Add lastmod to sitemap entries
- **File:** `src/lib/sitemap.ts`
- **Issue:** No `<lastmod>` on any of the 81 sitemap URLs
- **Fix:** Use `fs.stat()` or git history to add modification dates
- **Impact:** Better crawl efficiency — search engines prioritize recently changed pages

### 8. Add H1 to pricing page
- **File:** `src/app/pricing/pricing-page-content.tsx` or `src/app/pricing/page.tsx`
- **Issue:** Page jumps from nav to H2 "Scale as You Grow" — no H1
- **Fix:** Add an H1 like "Prisma Pricing" or "Prisma Postgres Pricing"
- **Impact:** Better heading hierarchy for crawlers and accessibility

### 9. Improve weak title tags
- **MCP:** "Prisma MCP Server" (18 chars) → "Prisma MCP Server — AI-Powered Database Management"
- **Studio:** "Prisma Studio | Next-generation ORM..." → "Prisma Studio — Visual Database Browser & Editor"
- **Pricing:** "Pricing - Prisma Data Platform" → "Pricing — Prisma Postgres Plans & Features"
- **Impact:** Better CTR in search results

### 10. Remove duplicate `<title>Discord</title>` element
- **Issue:** Extra `<title>Discord</title>` element appearing on every page
- **Fix:** Find and remove the source of this duplicate title element
- **Impact:** Removes confusing title signal for search engines

### 11. Replace FAQPage schema on pricing
- **Issue:** Google restricted FAQ rich results to government/healthcare sites in Aug 2023
- **Fix:** Replace with `WebPage` + `Product`/`Offer` schema
- **Impact:** Swap dead schema for something that provides real rich result potential

### 12. Fix pricing page mobile above-fold
- **Issue:** No pricing info visible above fold on mobile — H1 consumes entire viewport
- **Fix:** Reduce H1 size or restructure so at least one plan is visible without scrolling
- **Impact:** Mobile UX and conversion rate

### 13. Align homepage meta descriptions
- **Files:** `src/lib/site-metadata.ts` and `src/lib/structured-data.ts`
- **Issue:** Two different descriptions used — meta tag vs JSON-LD
- **Fix:** Use consistent messaging; the JSON-LD version is more SEO-rich
- **Impact:** Consistent brand messaging for search engines

### 14. Add SoftwareApplication schema
- **Pages:** `/orm`, `/studio`, `/mcp`
- **Fix:** Use `createPageStructuredData()` pattern to add schema with name, applicationCategory, operatingSystem, offers
- **Impact:** Rich results eligibility, better AI search extraction

---

## Medium Priority — Fix Within 1 Month

### 11. Populate llms-full.txt
- **File:** `src/app/llms-full.txt/route.ts`
- **Issue:** Returns empty response body
- **Fix:** Generate comprehensive text summary of Prisma products, features, pricing
- **Impact:** AI search engines (ChatGPT, Perplexity) can better reference your content

### 12. Add BreadcrumbList schema
- **Scope:** All pages
- **Fix:** Add breadcrumb JSON-LD in layout or per-page
- **Impact:** Rich breadcrumb display in search results

### 13. Add VideoObject schema
- **Pages:** `/mcp`, `/studio`, `/orm` (all embed YouTube videos)
- **Fix:** Add JSON-LD with video title, description, thumbnail, upload date
- **Impact:** Video rich results, carousel eligibility

### 14. Self-host Font Awesome
- **Current:** External script from `kit.fontawesome.com`
- **Fix:** Bundle FA icons locally or switch to SVG sprite
- **Impact:** Eliminates render-blocking third-party dependency, faster icon rendering

### 15. Add Permissions-Policy header
- **File:** `next.config.mjs` securityHeaders
- **Fix:** Add `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Impact:** Security best practice

### 16. Clean up CSP duplicates
- **File:** `next.config.mjs` ContentSecurityPolicy string
- **Issue:** `static.ads-twitter.com`, `snap.licdn.com`, `googleads.g.doubleclick.net`, `pagead2.googlesyndication.com` each appear 2+ times
- **Fix:** Deduplicate entries
- **Impact:** Cleaner CSP, easier maintenance

### 17. Create comparison pages
- **Examples:** "Prisma vs Drizzle ORM", "Prisma vs TypeORM", "Prisma Postgres vs Supabase"
- **Impact:** Capture high-intent comparison search traffic

### 18. Add SearchAction to WebSite schema
- **File:** `src/lib/structured-data.ts`
- **Fix:** Add `potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: "https://www.prisma.io/docs?q={search_term_string}" } }`
- **Impact:** Potential sitelinks search box in Google results

---

## Low Priority — Backlog

### 19. Consider noindex for utility pages
- Terms, privacy, SLA, support-policy — these don't drive search traffic
- Use `robots: { index: false }` in their metadata exports

### 20. Add author attribution
- Blog posts and technical content should have author markup
- Strengthens E-E-A-T signals

### 21. Improve product cross-linking
- ORM page should link to Studio, Postgres, MCP and vice versa
- Build topical authority through internal link clusters

### 22. Add AggregateRating schema
- Homepage testimonials could power star ratings in search results
- Requires actual rating data collection

### 23. Standardize OG image dimensions
- MCP page specifies 1200x630; others don't
- Add `width: 1200, height: 630` to all OG image configs

### 24. Convert Organization logo to PNG
- Current: `/icons/technologies/prisma.svg`
- Google recommends PNG/JPG for Organization logo in structured data
