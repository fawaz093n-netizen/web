# Performance Audit: Prisma Website

**URL:** https://site-theta-two-38.vercel.app/  
**Date:** 2026-04-02  
**Tool:** Lighthouse 13.0.3 (headless Chrome)  
**Pages tested:** Homepage (`/`), Pricing (`/pricing`)

---

## Executive Summary

The homepage scores **50/100 on mobile** and **90/100 on desktop**. The pricing page scores **68/100 on mobile**. The primary bottlenecks are: an extremely heavy page weight driven by unoptimized images and SVGs, a Three.js particle animation loading eagerly on every visit, excessive image preloads contending for bandwidth, and large unused JavaScript bundles.

CLS is excellent across both pages. LCP and FCP are the critical failures, driven by resource contention and payload size.

---

## Core Web Vitals Summary

### Homepage (`/`)

| Metric | Mobile | Desktop | Threshold | Status |
|--------|--------|---------|-----------|--------|
| **LCP** | 15.3s | 1.9s | <=2.5s | FAIL (mobile) / PASS (desktop) |
| **CLS** | 0.001 | 0.005 | <=0.1 | PASS |
| **INP** (lab proxy: TBT) | 640ms TBT | 0ms TBT | <=200ms | FAIL (mobile) / PASS (desktop) |
| FCP | 3.9s | 0.9s | <=1.8s | FAIL (mobile) |
| Speed Index | 3.9s | 0.9s | | |
| TTI | 16.3s | -- | | FAIL (mobile) |

### Pricing (`/pricing`)

| Metric | Mobile | Threshold | Status |
|--------|--------|-----------|--------|
| **LCP** | 6.9s | <=2.5s | FAIL |
| **CLS** | 0 | <=0.1 | PASS |
| **INP** (lab proxy: TBT) | 110ms TBT | <=200ms | PASS |
| FCP | 3.5s | <=1.8s | FAIL |
| TTI | 7.9s | | |

### TTFB (curl, from local machine)

| Page | TTFB | HTML Size |
|------|------|-----------|
| Homepage | 107ms | 587 KB |
| Pricing | 109ms | 227 KB |

TTFB is well under the 200ms threshold -- Vercel edge is performing well. However, the homepage HTML document is 587 KB, which is abnormally large for a marketing page and contributes to slower parsing.

---

## Page Weight Breakdown

### Homepage: 3,609 KB total (94 requests)

| Resource Type | Size | Requests |
|---------------|------|----------|
| Images | 2,135 KB | 53 |
| JavaScript | 904 KB | 24 |
| Fonts | 400 KB | 3 |
| Document (HTML) | 54 KB (compressed) | 1 |
| Stylesheets | 44 KB | 2 |
| Other | 72 KB | 11 |
| **Third-party** | **64 KB** | **8** |

### Pricing: 1,156 KB total (34 requests)

| Resource Type | Size | Requests |
|---------------|------|----------|
| JavaScript | 645 KB | 21 |
| Fonts | 360 KB | 2 |
| Document (HTML) | 52 KB | 1 |
| Stylesheets | 44 KB | 2 |
| Images | 9 KB | 2 |
| Third-party | 62 KB | 8 |

---

## Identified Bottlenecks

### 1. CRITICAL: Image Optimization Disabled (`images.unoptimized: true`)

**File:** `next.config.mjs`  
**Impact:** Severe -- affects LCP, page weight, and bandwidth on every page

```
images: {
  unoptimized: true,
}
```

Next.js image optimization is completely disabled. This means:
- No automatic WebP/AVIF conversion
- No responsive srcsets generated
- No on-demand resizing
- All images served at original size and format

**Evidence:** The top transferred images on homepage are uncompressed PNGs:
- `harshal-patil.png` -- 410 KB (a testimonial avatar)
- `nicolas-torres.png` -- 218 KB (a testimonial avatar)
- `elie-steinbock.png` -- 165 KB (a testimonial avatar)

These are small avatar photos being served as full-resolution PNGs. At typical display size (~48-64px), they should be under 5 KB each in WebP.

Total PNG avatar weight in `/public/photos/people/`: **1.37 MB across 10 files**.

### 2. CRITICAL: 33 Preloaded Images Saturate Bandwidth

The homepage emits **33 `<link rel="preload" as="image">` hints in the `<head>`**. This is counterproductive -- preloading everything is the same as preloading nothing. These 33 preloads compete with critical resources (fonts, CSS, JS) for bandwidth on the simulated slow 3G connection.

Images being preloaded include below-the-fold testimonial avatars (`harshal-patil.png`, `jim-hendriks.webp`, etc.) and all bento illustration SVGs. Only the LCP element should be preloaded.

### 3. CRITICAL: Massive SVG Illustrations (Uncompressed)

The bento section and card section use large SVG illustrations served from `/public/`:

| File | Size |
|------|------|
| `typesafe.svg` / `typesafe_light.svg` | 549 KB each |
| `data.svg` / `data_light.svg` | 387 KB each |
| `collaborative.svg` / `collaborative_light.svg` | 121 KB each |
| `ide.svg` / `ide_light.svg` | 73 KB each |
| `real_ppg.svg` / `real_ppg_light.svg` | 70 KB each |

Both dark and light variants are preloaded. `typesafe.svg` alone (549 KB) is larger than many entire web pages. These SVGs likely contain embedded raster data or unoptimized paths and should be run through SVGO or converted to compressed raster formats.

### 4. HIGH: Three.js Particle Animation (`Antigravity`)

**File:** `src/components/homepage/antigravity.tsx`

The hero section renders a Three.js (`@react-three/fiber`) particle system with 300 particles. This loads the entire Three.js runtime (~232 KB compressed, the `66864042b8b42480.js` chunk) eagerly on page load. This chunk has **54% unused code** on initial load.

The animation is decorative and should not block rendering of the main content.

### 5. HIGH: Mona Sans Variable Font -- 317 KB

The Mona Sans variable font (`MonaSansVF[wdth,wght,opsz,ital].woff2`) is **317 KB**. This is an extremely large font file, likely because it includes the full variable axis ranges (width, weight, optical size, italic) in a single file. Most pages only use a subset of these axes.

Combined with Inter (52 KB), total font payload is **369 KB**.

### 6. HIGH: Unused JavaScript -- 389 KB Saveable

Lighthouse identified **389 KB of unused JavaScript** on the homepage:

| Chunk | Total | Unused | % Unused |
|-------|-------|--------|----------|
| `66864042b8b42480.js` (Three.js) | 232 KB | 124 KB | 54% |
| `42a28fd4439eee6a.js` | 151 KB | 121 KB | 80% |
| `156abb6c90a0c7cc.js` | 57 KB | 50 KB | 87% |
| `3a673a9ee1f4b27d.js` | 67 KB | 48 KB | 72% |
| `8566c171816e342a.js` | 26 KB | 23 KB | 89% |

### 7. MEDIUM: Two Font Awesome Kit Scripts

**File:** `src/app/layout.tsx`

Two separate Font Awesome kit scripts are loaded:
- `kit.fontawesome.com/ad485975d2.js` (via `@prisma/eclipse` `FontAwesomeScript`)
- `kit.fontawesome.com/c1448b716e.js` (preloaded in HTML)

Each kit script dynamically fetches additional CSS from `ka-p.fontawesome.com` (25 KB + 14 KB). Loading two kits doubles the network overhead. These should be consolidated into a single kit, or better, replaced with self-hosted SVG icons for the few icons actually used.

### 8. MEDIUM: Third-Party Script Chain

The layout loads multiple third-party scripts:

| Script | Purpose | Loading Strategy |
|--------|---------|-----------------|
| Google Tag Manager | Analytics | Inline, deferred via CookieYes |
| CookieYes | Consent management | `next/script` (afterInteractive) |
| Tolt (`cdn.tolt.io/tolt.js`) | Referral tracking | `type="text/plain"` (CookieYes gated) |
| Font Awesome x2 | Icons | Script tag + preload |

GTM and Tolt are correctly gated behind CookieYes consent (`type="text/plain"`). However, CookieYes itself and Font Awesome load eagerly and add to the critical path.

### 9. MEDIUM: Raw `<img>` Tags Without Dimensions or Lazy Loading

**Files:** `bento.tsx` (line 197), `card-section.tsx` (lines 170, 185)

Bento cards and card section images use raw `<img>` tags (with eslint-disable comments) instead of `next/image`. These images:
- Lack explicit `width`/`height` attributes (CLS risk, though currently mitigated by CSS)
- Have no `loading="lazy"` attribute
- Get no automatic optimization
- Are theme-dependent (dark/light swap on mount), which is why `next/image` was avoided -- but there are better patterns for this

### 10. LOW: Main Thread Work -- 3.5s (Mobile)

Main thread breakdown on mobile (4x CPU throttle):

| Category | Time |
|----------|------|
| Script Evaluation | 2,037ms |
| Style & Layout | 440ms |
| Other | 510ms |
| Script Parsing | 199ms |
| Rendering | 165ms |

Script evaluation dominates, largely from Three.js initialization and the large JS bundle.

### 11. LOW: 46 Inline Scripts in HTML

The homepage HTML contains **46 inline `<script>` tags** totaling ~46 KB. Many of these are Next.js hydration payloads, but the volume contributes to parse time on the 587 KB HTML document.

---

## Prioritized Recommendations

### P0 -- Critical (Expected impact: 5-10s LCP improvement on mobile)

**1. Enable Next.js Image Optimization**

Remove `unoptimized: true` from `next.config.mjs`. This alone will:
- Auto-convert PNGs/JPEGs to WebP (80-90% size reduction for avatars)
- Generate responsive srcsets
- Enable lazy loading by default
- Reduce image payload from ~2.1 MB to estimated ~200-300 KB

If Vercel deployment constraints require `unoptimized: true`, use a dedicated image CDN (Cloudinary, imgix) or pre-optimize images at build time.

**2. Reduce Preloads to Only the LCP Element**

Remove all 33 `<link rel="preload" as="image">` hints. Add back only 1-2 preloads for the actual LCP element (likely the hero text or first bento image visible above the fold). Preloading 33 resources degrades performance by saturating the connection.

**3. Optimize or Replace SVG Illustrations**

- Run all SVGs through [SVGO](https://jakearchibald.github.io/svgomg/) (typical 30-60% reduction)
- For `typesafe.svg` (549 KB) and `data.svg` (387 KB), consider converting to optimized PNG/WebP with transparent backgrounds, which will likely be smaller
- Serve only the active theme variant, not both

### P1 -- High (Expected impact: 2-4s improvement)

**4. Lazy-Load the Three.js Hero Animation**

```tsx
// Use next/dynamic with ssr: false
const Antigravity = dynamic(
  () => import("../../components/homepage/antigravity"),
  { ssr: false }
);
```

Additionally, wrap in an `IntersectionObserver` or use `requestIdleCallback` to delay initialization until after LCP. The 232 KB Three.js bundle should not compete with critical rendering resources.

**5. Subset or Replace Mona Sans Variable Font**

The 317 KB variable font file includes all axes. Options:
- Subset to only the weight range actually used (e.g., 400-900)
- Remove unused axes (width, optical size, italic) if not needed
- Use `font-display: swap` to prevent FOIT
- Consider using a static subset of 2-3 weights instead of the full variable font

**6. Convert People Photos to WebP**

Pre-convert the 10 PNG avatar photos to WebP at their display size (64x64 or 128x128). This would reduce the 1.37 MB of PNGs to approximately 50 KB total.

### P2 -- Medium (Expected impact: 0.5-1s improvement)

**7. Consolidate Font Awesome to One Kit (or Self-Host)**

Merge the two Font Awesome kits (`ad485975d2` and `c1448b716e`) into a single kit. Better yet, since only a handful of icon classes are used (`fa-regular fa-database`, `fa-regular fa-copy`, `fa-regular fa-arrow-right`, etc.), replace with inline SVGs or a custom icon sprite to eliminate the Font Awesome runtime entirely (~40 KB saved + 2 fewer network requests).

**8. Defer CookieYes Loading**

Load CookieYes with `strategy="lazyOnload"` instead of the default `afterInteractive`:

```tsx
<Script
  id="cookieyes"
  strategy="lazyOnload"
  src="https://cdn-cookieyes.com/client_data/96980f76df67ad5235fc3f0d/script.js"
/>
```

**9. Add `loading="lazy"` and Dimensions to `<img>` Tags**

In `bento.tsx` and `card-section.tsx`, add explicit `width`, `height`, and `loading="lazy"` to all `<img>` elements. For the theme-switching pattern, consider using CSS `content-visibility` or a picture element with `prefers-color-scheme` media queries instead of JavaScript-driven src swapping.

### P3 -- Low (Expected impact: incremental)

**10. Reduce HTML Document Size**

The 587 KB HTML (uncompressed) suggests excessive inline data or duplicated content. Audit the server-rendered output for:
- Large JSON payloads in `<script>` tags
- Duplicated structured data
- Excessive Next.js RSC payload

**11. Code-Split Shared Chunks**

The `42a28fd4439eee6a.js` chunk (151 KB, 80% unused) and `156abb6c90a0c7cc.js` (57 KB, 87% unused) suggest overly broad shared chunks. Review the Next.js bundle analyzer output to identify candidates for more granular splitting.

---

## Quick Wins Summary

| Action | Effort | LCP Impact | Page Weight Saved |
|--------|--------|------------|-------------------|
| Enable image optimization | Low | ~5-8s (mobile) | ~1.8 MB |
| Remove excess preloads (33 to 1-2) | Low | ~2-4s (mobile) | 0 (bandwidth freed) |
| Lazy-load Three.js | Low | ~1-2s (mobile) | 232 KB deferred |
| Optimize SVGs with SVGO | Low | ~0.5-1s | ~500 KB |
| Convert PNGs to WebP | Medium | ~0.5-1s | ~1.3 MB |
| Consolidate Font Awesome | Medium | ~0.3-0.5s | ~40 KB |
| Subset Mona Sans font | Medium | ~0.2-0.3s | ~200 KB |

---

## Methodology Notes

- Lighthouse 13.0.3 run locally with headless Chrome
- Mobile: Moto G Power with 4x CPU slowdown, simulated slow 4G (150ms RTT, 1.6 Mbps down)
- Desktop: no throttling
- TTFB measured via `curl` from development machine (not representative of real-user latency)
- INP cannot be measured in lab; TBT (Total Blocking Time) is used as a lab proxy. Field data from CrUX should be checked once the site has sufficient traffic at its production URL.
- These are lab results from a single run. For production monitoring, use CrUX field data via [CrUX Vis](https://cruxvis.withgoogle.com) or the CrUX API.
