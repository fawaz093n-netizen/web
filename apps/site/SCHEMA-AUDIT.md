# Schema / Structured Data Audit

**Site:** https://site-theta-two-38.vercel.app/  
**Codebase:** `/Users/marchess/Projects/web/apps/site`  
**Date:** 2026-04-02  
**Auditor:** Schema.org markup specialist (automated)

---

## Executive Summary

The site has a solid foundation with Organization and WebSite schema injected globally via a `@graph` block in the root layout. The pricing page adds FAQPage schema. However, most product pages (ORM, MCP, Studio) and the changelog have no page-specific structured data. There is one critical issue: the pricing page uses `FAQPage`, which Google restricted to government and healthcare authority sites in August 2023.

### Key Source Files

| File | Purpose |
|------|---------|
| `src/lib/structured-data.ts` | Schema builder functions |
| `src/components/json-ld.tsx` | `<JsonLd>` component (renders `<script type="application/ld+json">`) |
| `src/app/layout.tsx` | Injects global Organization + WebSite schema |
| `src/app/pricing/page.tsx` | Injects FAQPage schema |
| `src/app/events/page.tsx` | Injects CollectionPage + ItemList schema |

---

## 1. Existing Schema Detection

### 1.1 Global Schema (all pages)

**Location:** `src/app/layout.tsx` line 182 via `createSiteStructuredData()`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.prisma.io#organization",
      "name": "Prisma",
      "url": "https://www.prisma.io",
      "description": "Prisma is a next-generation Node.js and TypeScript ORM...",
      "logo": "https://www.prisma.io/icons/technologies/prisma.svg",
      "sameAs": [
        "https://github.com/prisma",
        "https://twitter.com/prisma",
        "https://www.linkedin.com/company/prisma-io",
        "https://www.youtube.com/prismadata",
        "https://www.facebook.com/prisma.io/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.prisma.io#website",
      "name": "Prisma",
      "url": "https://www.prisma.io",
      "description": "...",
      "publisher": { "@id": "https://www.prisma.io#organization" }
    }
  ]
}
```

### 1.2 Pricing Page (`/pricing`)

**Location:** `src/app/pricing/page.tsx` line 40

- **Type:** `FAQPage` with 11 Question/Answer pairs
- Rendered via `createFaqStructuredData()` in `src/lib/structured-data.ts`

### 1.3 Events Page (`/events`)

**Location:** `src/app/events/page.tsx` line 50

- **Type:** `CollectionPage` with nested `ItemList` of meetups, sponsored events, and past events

### 1.4 Pages With No Page-Specific Schema

| Page | Has Global Schema | Has Page Schema |
|------|:-----------------:|:---------------:|
| `/` (homepage) | Yes | No |
| `/orm` | Yes | No |
| `/mcp` | Yes | No |
| `/studio` | Yes | No |
| `/changelog` | Yes | No |
| `/changelog/[slug]` | Yes | No |
| `/blog` | Not part of this codebase (external) | N/A |
| `/accelerate` | Redirects to `/` (no standalone page) | N/A |

---

## 2. Validation Results

### 2.1 Organization (Global) -- PASS with warnings

| Check | Result |
|-------|--------|
| `@context` is `https://schema.org` | PASS |
| `@type` is valid and not deprecated | PASS |
| All required properties present | PASS |
| `logo` is absolute URL | PASS |
| `sameAs` URLs are absolute | PASS |
| `sameAs` Twitter link uses twitter.com | WARNING -- consider updating to `https://x.com/prisma` (Twitter rebranded) |

**Recommended addition:** Add `foundingDate`, `contactPoint`, and `address` properties for richer Knowledge Panel data.

### 2.2 WebSite (Global) -- PASS with recommendations

| Check | Result |
|-------|--------|
| `@context` is `https://schema.org` | PASS |
| `@type` is valid | PASS |
| `publisher` uses `@id` reference | PASS |
| Missing `potentialAction` (SearchAction) | RECOMMENDATION |

A `SearchAction` would allow Google to show a sitelinks searchbox. This is a high-value addition if the site has internal search.

### 2.3 FAQPage (Pricing) -- FAIL: restricted type

| Check | Result |
|-------|--------|
| `@context` is `https://schema.org` | PASS |
| `@type` valid | FAIL -- `FAQPage` rich results restricted to government/healthcare sites since August 2023 |
| Required properties present | PASS (all Question + Answer pairs are well-formed) |
| Answer text is plain text (HTML stripped) | PASS (via `toPlainText()` helper) |
| URLs are absolute | PASS |

**Action required:** Google will not generate FAQ rich results for this site. The schema is not technically invalid, but it provides no SEO benefit and should be **removed or replaced** with a more useful type. See Section 3 for alternatives.

### 2.4 CollectionPage (Events) -- PASS

| Check | Result |
|-------|--------|
| `@context` is `https://schema.org` | PASS |
| `@type` valid | PASS |
| `ItemList` well-formed with positions | PASS |
| URLs are absolute | PASS |

**Recommendation:** Individual events could benefit from `Event` schema with `startDate`, `endDate`, `location`, and `eventAttendanceMode` for those that have this data.

---

## 3. Missing Schema Opportunities

### 3.1 Homepage (`/`) -- HIGH PRIORITY

The homepage has no page-specific schema beyond the global Organization/WebSite. Recommended additions:

**WebPage schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.prisma.io/#webpage",
  "name": "Prisma | Instant Postgres plus an ORM for simpler db workflows",
  "description": "Build, fortify, and grow your application easily with an intuitive data model, type-safety, automated migrations, connection pooling and caching.",
  "url": "https://www.prisma.io/",
  "isPartOf": { "@id": "https://www.prisma.io#website" },
  "about": { "@id": "https://www.prisma.io#organization" },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://www.prisma.io/og/og-index.png"
  }
}
```

### 3.2 Product Pages (`/orm`, `/studio`) -- HIGH PRIORITY

These are product landing pages and should use `SoftwareApplication` schema.

**Prisma ORM (`/orm`):**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.prisma.io/orm#software",
  "name": "Prisma ORM",
  "description": "Prisma is a next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB. It provides type-safety, automated migrations, and an intuitive data model.",
  "url": "https://www.prisma.io/orm",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": { "@id": "https://www.prisma.io#organization" },
  "softwareHelp": {
    "@type": "WebPage",
    "url": "https://www.prisma.io/docs"
  },
  "downloadUrl": "https://www.npmjs.com/package/prisma",
  "programmingLanguage": ["TypeScript", "JavaScript"]
}
```

**Prisma Studio (`/studio`):**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.prisma.io/studio#software",
  "name": "Prisma Studio",
  "description": "The easiest way to explore and manipulate your data in all of your Prisma projects.",
  "url": "https://www.prisma.io/studio",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": { "@id": "https://www.prisma.io#organization" },
  "softwareHelp": {
    "@type": "WebPage",
    "url": "https://www.prisma.io/docs/studio"
  }
}
```

### 3.3 MCP Page (`/mcp`) -- MEDIUM PRIORITY

The MCP page describes a software tool/server. `SoftwareApplication` is appropriate here as well.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.prisma.io/mcp#software",
  "name": "Prisma MCP Server",
  "description": "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.",
  "url": "https://www.prisma.io/mcp",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": { "@id": "https://www.prisma.io#organization" },
  "softwareHelp": {
    "@type": "WebPage",
    "url": "https://www.prisma.io/docs/postgres/integrations/mcp-server"
  }
}
```

### 3.4 Pricing Page (`/pricing`) -- HIGH PRIORITY (fix)

Remove `FAQPage` (restricted). Replace with `WebPage` + nested `Product` with `Offer` tiers.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.prisma.io/pricing#webpage",
  "name": "Pricing - Prisma Data Platform",
  "description": "Get started for free with Prisma Postgres. Choose the right plan for your workspace based on your project requirements.",
  "url": "https://www.prisma.io/pricing",
  "isPartOf": { "@id": "https://www.prisma.io#website" },
  "mainEntity": {
    "@type": "Product",
    "name": "Prisma Postgres",
    "description": "Managed Postgres database with global caching, connection pooling, and real-time capabilities.",
    "brand": { "@id": "https://www.prisma.io#organization" },
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "price": "0",
        "priceCurrency": "USD",
        "description": "100,000 operations/month included",
        "url": "https://www.prisma.io/pricing"
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "url": "https://www.prisma.io/pricing",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "USD",
          "description": "Usage-based pricing for production workloads"
        }
      }
    ]
  }
}
```

### 3.5 Changelog (`/changelog`) -- MEDIUM PRIORITY

The changelog index page is a list of release notes. A `CollectionPage` + `ItemList` pattern (same as Events) would work well here.

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.prisma.io/changelog#collection",
  "name": "Release Notes | Prisma",
  "description": "Track Prisma release notes, product improvements, and rollout details.",
  "url": "https://www.prisma.io/changelog",
  "isPartOf": { "@id": "https://www.prisma.io#website" }
}
```

Individual changelog entries (`/changelog/[slug]`) should use `Article` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ page.data.title }}",
  "datePublished": "{{ page.data.date in ISO 8601 }}",
  "description": "{{ page.data.summary or description }}",
  "url": "https://www.prisma.io/changelog/{{ slug }}",
  "author": { "@id": "https://www.prisma.io#organization" },
  "publisher": { "@id": "https://www.prisma.io#organization" },
  "image": "{{ page.data.ogImage or fallback }}"
}
```

### 3.6 BreadcrumbList -- LOW PRIORITY (site-wide)

No BreadcrumbList schema was detected on any page. Adding breadcrumbs improves how URLs appear in search results. Recommended for all non-homepage pages.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.prisma.io/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{ Page Name }}",
      "item": "https://www.prisma.io/{{ path }}"
    }
  ]
}
```

### 3.7 VideoObject -- LOW PRIORITY

The ORM page embeds a YouTube video (`EEDGwLB55bI`) and the Studio page embeds one (`s3NS9KBRMcQ`). Adding `VideoObject` schema could enable video rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Why Prisma ORM - Delightful DB workflows",
  "description": "See how Prisma ORM increases productivity and confidence when working with databases.",
  "thumbnailUrl": "https://www.prisma.io/illustrations/orm/thumbnail.png",
  "uploadDate": "2024-01-01T00:00:00Z",
  "contentUrl": "https://www.youtube.com/watch?v=EEDGwLB55bI",
  "embedUrl": "https://www.youtube.com/embed/EEDGwLB55bI"
}
```

---

## 4. Issues Summary

### Critical

| # | Page | Issue | Action |
|---|------|-------|--------|
| 1 | `/pricing` | `FAQPage` restricted to government/healthcare sites since Aug 2023 | Remove FAQPage schema; replace with WebPage + Product/Offer |

### Warnings

| # | Page | Issue | Action |
|---|------|-------|--------|
| 2 | Global | `sameAs` uses `twitter.com` instead of `x.com` | Update URL |
| 3 | Global | Organization `logo` should use `ImageObject` with `width`/`height` per Google guidelines | Wrap in ImageObject |

### Missing Opportunities (by priority)

| Priority | Page | Recommended Schema |
|----------|------|--------------------|
| HIGH | `/pricing` | WebPage + Product with Offer tiers |
| HIGH | `/orm` | SoftwareApplication |
| HIGH | `/studio` | SoftwareApplication |
| MEDIUM | `/mcp` | SoftwareApplication |
| MEDIUM | `/` | WebPage |
| MEDIUM | `/changelog` | CollectionPage + ItemList |
| MEDIUM | `/changelog/[slug]` | Article |
| LOW | All non-homepage | BreadcrumbList |
| LOW | `/orm`, `/studio` | VideoObject (for embedded YouTube videos) |
| LOW | Global WebSite | SearchAction (if site search exists) |

---

## 5. Implementation Notes

### Existing Infrastructure

The codebase already has good infrastructure for adding schema:

- **`src/components/json-ld.tsx`** -- A reusable `<JsonLd>` component that safely renders JSON-LD with XSS-safe sanitization.
- **`src/lib/structured-data.ts`** -- Contains builder functions (`createSiteStructuredData`, `createFaqStructuredData`, `createCollectionPageStructuredData`). New builder functions should be added here.

### Suggested New Builder Functions

Add to `src/lib/structured-data.ts`:

1. `createSoftwareApplicationStructuredData({ name, description, path, ... })` -- for `/orm`, `/studio`, `/mcp`
2. `createWebPageStructuredData({ name, description, path, image })` -- for homepage, pricing
3. `createArticleStructuredData({ headline, datePublished, description, path, image })` -- for changelog entries
4. `createBreadcrumbStructuredData(items: { name: string; url: string }[])` -- site-wide
5. `createProductStructuredData({ name, description, offers })` -- for pricing page

### Organization Logo Fix

In `createSiteStructuredData()`, change `logo` from a plain string to an `ImageObject`:

```typescript
logo: {
  "@type": "ImageObject",
  "url": absoluteUrl("/icons/technologies/prisma.svg"),
  "width": 256,
  "height": 256
}
```
