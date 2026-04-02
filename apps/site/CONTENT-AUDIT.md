# Content Quality & E-E-A-T Audit

**Site:** https://site-theta-two-38.vercel.app/  
**Codebase:** `/Users/marchess/Projects/web/apps/site`  
**Date:** 2026-04-02  
**Auditor framework:** Google September 2025 Quality Rater Guidelines  

---

## Executive Summary

**Overall Content Quality Score: 62/100**

The Prisma marketing site has strong structural SEO foundations (canonical URLs, Open Graph, structured data, FAQ schema) but suffers from thin content across most product and landing pages. The pages are heavily visual/component-driven with minimal indexable text. E-E-A-T signals are moderate -- real testimonials and social proof are present, but author attribution, company credibility signals, and first-hand experience narratives are largely absent from product pages. AI citation readiness is low due to lack of quotable, fact-dense prose.

---

## Page-by-Page Analysis

### 1. Homepage (`/`)

**Content Quality Score: 55/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 12/20 | Testimonials from real developers with names, titles, companies, and photos. No first-party case studies or usage narratives on the page itself. |
| Expertise | 14/25 | Technical terminology is accurate. No author byline or editorial voice. Headline "Postgres, perfectly managed" is brand-oriented, not informative. |
| Authoritativeness | 16/25 | "Trusted by 500k+ monthly active developers" claim is present. GitHub stars (45k+) referenced on /orm but not homepage. Social proof via 24 named testimonials is strong. |
| Trustworthiness | 18/30 | Canonical URL set. OG/Twitter metadata complete. Cookie consent (CookieYes) present. "Free to get started, no credit card needed" builds trust. Contact info limited to footer. |

**Estimated word count (indexable text): ~120 words**  
**Minimum for homepage: 500 words**  
**Status: CRITICALLY THIN**

**Issues:**
- The hero contains only ~25 words of indexable text. The h1 "Postgres, perfectly managed" and subtitle "Real Postgres with the developer experience and infrastructure to ship faster" are the only substantive copy.
- Bento section cards each have 5-12 word subtitles with no supporting paragraphs.
- The "Postgres that fits your stack" and "Real Postgres. Better experience" sections add ~60 words total.
- Missing: a clear explanation of what Prisma is, what Prisma Postgres is, how it differs from competitors, any quantified performance claims, any paragraph-length descriptions.
- No JSON-LD `SoftwareApplication` or `Product` schema on the homepage despite being a product page.

**AI Citation Readiness: 2/10**  
No quotable facts, no structured definitions, no comparison data. An LLM scraping this page would struggle to extract a meaningful description of what the product does.

---

### 2. Pricing Page (`/pricing`)

**Content Quality Score: 78/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 14/20 | FAQ answers reference real user scenarios ("If you already have a database with another provider"). Calculator with presets (Hobby/Startup/Scaleup) shows product understanding. |
| Expertise | 20/25 | Detailed operation-based pricing model is well-explained. FAQ answers are thorough with cross-links to blog posts explaining the billing model. |
| Authoritativeness | 18/25 | Links to detailed blog posts about pricing philosophy. FAQ schema markup present. Comparison to traditional pricing models shows thought leadership. |
| Trustworthiness | 26/30 | FAQ schema (JSON-LD FAQPage) implemented. Support email (support@prisma.io) prominently displayed. Spend limits and budget controls emphasized. Currency conversion for 10 currencies. "No credit card required" for free tier. |

**Estimated word count (indexable text): ~2,200 words** (including FAQ content)  
**Minimum for service/product page: 800 words**  
**Status: EXCEEDS MINIMUM**

**Strengths:**
- The 11 FAQ items contain rich, substantive content explaining operations-based billing, comparison methodology, and budget controls.
- Interactive pricing calculator with tooltips explaining each metric.
- Plan comparison table with detailed feature breakdown across 4 tiers.
- Structured data (FAQPage schema) improves search feature eligibility.

**Issues:**
- FAQ answers use `dangerouslySetInnerHTML` -- verify all FAQ content is sanitized.
- The operation definition asterisk footnote ("*An operation is each time you interact with your database") is rendered as tiny text -- this key concept deserves more prominence.
- No `Product` or `Offer` schema markup for the pricing tiers despite being clearly product offers.
- Exchange rates appear hardcoded rather than fetched dynamically -- risk of stale currency data.

**AI Citation Readiness: 7/10**  
FAQ content is highly quotable. Clear definitions of "operation," pricing tiers with exact dollar amounts, and comparison rationale are all LLM-friendly.

---

### 3. ORM Page (`/orm`)

**Content Quality Score: 60/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 12/20 | Links to benchmarks (benchmarks.prisma.io). YouTube video embedded. Community testimonials shared with homepage. |
| Expertise | 16/25 | Technical claims (type-safety, automated migrations) are accurate. Links to TypeORM comparison doc. |
| Authoritativeness | 16/25 | "45k+ Stars on GitHub" and "250k+ Active developers" are strong signals. Links to npm package page. |
| Trustworthiness | 16/30 | Canonical and OG metadata present. No independent benchmarks cited -- links go to Prisma's own benchmark site. |

**Estimated word count (indexable text): ~280 words**  
**Minimum for product/service page: 800 words**  
**Status: BELOW MINIMUM**

**Issues:**
- The meta description is 233 characters and information-rich ("next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server..."), but the page body fails to deliver on that promise with actual content.
- "Delightful DB workflows" -- vague, non-specific heading. What specific workflows? How much time saved?
- "Prisma's compatibility with popular tools ensures no stack lock-in, lower integration costs, and smooth transitions." -- generic claim with no evidence.
- Feature cards ("Manage databases," "Type-safety," "Data model you can read," "Browse your data") each have single-sentence descriptions.
- The page reuses the same testimonials component as the homepage -- duplicate content signal.
- No getting-started code sample directly on the page despite being a developer tool page.

**AI Citation Readiness: 3/10**  
No definition of what an ORM is or why Prisma's approach differs. No quantified claims. The meta description is more informative than the page content itself.

---

### 4. Accelerate Page (`/accelerate`)

**Content Quality Score: N/A -- PAGE DOES NOT EXIST**

The `/accelerate` route has no corresponding page component in the codebase (`/Users/marchess/Projects/web/apps/site/src/app/accelerate/` does not exist). A redirect exists from `/data-platform/accelerate` to `/accelerate`, but the destination appears to be a dead end that would serve a 404 or be handled by a different app.

**Critical issue:** If this URL is indexed or linked to, it needs either a functioning page or a proper redirect to the relevant content (likely the Prisma Postgres page or pricing page's connection pooling/caching features).

---

### 5. MCP Page (`/mcp`)

**Content Quality Score: 68/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 14/20 | Specific integration instructions for 8 AI tools (Cursor, VS Code, Warp, ChatGPT, Claude Code, Windsurf, Gemini, generic). Exact copy-paste commands provided. |
| Expertise | 18/25 | Technically specific: OAuth mentioned, MCP protocol properly described, actual CLI commands and deep-link URLs included. |
| Authoritativeness | 14/25 | References to popular AI tools (Claude, ChatGPT, Cursor) lend relevance. No third-party endorsements or adoption metrics. |
| Trustworthiness | 22/30 | Full OG metadata including site name, locale, and creator. Links to official docs. "Enterprise-grade security & OAuth" claim is stated but not evidenced. |

**Estimated word count (indexable text): ~200 words** (excluding code/config blocks)  
**Minimum for product/service page: 800 words**  
**Status: BELOW MINIMUM**

**Strengths:**
- The hero uses a clever typing animation that reveals the value proposition progressively.
- 5 capability cards with specific example prompts ("Show me all users who signed up this week and their activity levels") demonstrate real use cases.
- Integration instructions are immediately actionable.
- Video section adds non-text content value.

**Issues:**
- Very little prose explaining what MCP is, why it matters, or how it works. A developer unfamiliar with MCP would not learn from this page.
- "Enterprise-grade security & OAuth" is a claim without supporting detail -- no link to security documentation or compliance certifications.
- No structured data specific to this page (no `SoftwareApplication` schema).
- The 5 capability descriptions are each one sentence (~10 words). These should be expanded with examples and outcomes.
- No "how it works" section explaining the architecture or data flow.

**AI Citation Readiness: 4/10**  
The specific integration commands are useful but not narrative. Missing a clear, quotable definition of what Prisma MCP Server does and how it works.

---

### 6. Studio Page (`/studio`)

**Content Quality Score: 65/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 14/20 | "Try it out" section with actual CLI command. YouTube video walkthrough. Local and collaborative workflow options shown. |
| Expertise | 16/25 | Feature descriptions are specific (filtering, multi-tab, embeddable). Technical commands provided for trying locally. |
| Authoritativeness | 12/25 | No adoption metrics, no user quotes specific to Studio, no external references. |
| Trustworthiness | 23/30 | Full OG metadata with dimensions. Docs link provided. CLI command for instant trial builds confidence. |

**Estimated word count (indexable text): ~350 words**  
**Minimum for product/service page: 800 words**  
**Status: BELOW MINIMUM**

**Strengths:**
- Five feature rows with eyebrows, titles, and descriptions provide reasonable structure.
- "Try it out" section with a copy-paste command is a strong conversion and credibility element.
- YouTube embed ("See how Studio works") adds value.
- Feature descriptions are more specific than other product pages.

**Issues:**
- 3 feature cards and 5 feature rows, but each description is 1-2 sentences (~20-30 words each).
- "Embed in your own apps" feature row has a mismatched eyebrow ("Amazing data editing UX") and title ("Embed in your own apps") -- the eyebrow describes something different from the title.
- No comparison to alternatives (pgAdmin, DBeaver, TablePlus, etc.).
- No mention of supported databases or data types.
- Testimonials section not present, unlike homepage and ORM pages.

**AI Citation Readiness: 4/10**  
Feature descriptions are too brief for citation. The CLI command is useful but not a narrative fact.

---

### 7. Blog (`/blog`)

**Content Quality Score: EXTERNALLY HOSTED -- LIMITED AUDIT**

The blog is served via reverse proxy from a separate origin (`BLOG_ORIGIN` env variable, defaulting to `https://blog.prisma.io`). The Next.js config rewrites `/blog` and `/blog/:any*` to the external blog origin.

**Observable from codebase:**
- Blog is referenced heavily from pricing FAQ (5+ cross-links to blog posts about operations-based billing).
- The navigation includes Blog as a top-level link.
- Blog static assets are also proxied (`/blog-static/:path*`).

**Recommendation:** Since the blog is a separate application, it should be audited independently. Key concern: if the blog domain differs from the main site domain at the DNS level, cross-linking may not pass full link equity. Verify that the rewrite produces a same-origin experience for Googlebot.

---

### 8. Changelog (`/changelog`)

**Content Quality Score: 72/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 16/20 | Release notes are clearly written from first-hand development experience. Specific version numbers, feature names, and migration guides. |
| Expertise | 20/25 | Technical content is deep -- Rust-to-TypeScript migration details, Vercel Marketplace integration specifics, security rules feature descriptions. |
| Authoritativeness | 16/25 | Version-tagged entries (v6.7.0, etc.) with dates. Cross-links to GitHub releases and blog posts. |
| Trustworthiness | 20/30 | Canonical URL set. Date-stamped entries from March 2024 through May 2025 (20 entries). Tags categorize entries. |

**Estimated word count (index page): ~150 words** (titles + summaries)  
**Estimated word count (per entry): ~400-800 words** (based on sampled 2025-05-01 entry)  
**Status: INDEX PAGE THIN, DETAIL PAGES ADEQUATE**

**Strengths:**
- 20 changelog entries spanning 14+ months shows active development.
- Individual entries are substantive (sampled entry: ~500+ words with links, code context, and feature explanations).
- Structured consistently with version number badges and date stamps.
- Tags (e.g., "Prisma Postgres," "Prisma ORM") enable filtering.

**Issues:**
- The index page is a list of links with title + 2-line summary. Limited indexable content on the listing page itself.
- No RSS feed link visible (commented out in config).
- No structured data (e.g., `ItemList` or `Blog` schema) on the changelog index.
- No search or filter functionality visible.

**AI Citation Readiness: 6/10**  
Individual changelog entries contain specific, dateable facts about product releases. Good for "when did Prisma release X" queries.

---

### 9. Community Page (`/community`)

**Content Quality Score: 58/100**

| Factor | Score | Notes |
|--------|-------|-------|
| Experience | 10/20 | Links to community channels but no community-generated content on the page itself. No member counts or activity metrics. |
| Expertise | 12/25 | Descriptions of community channels are generic ("The heart of the Prisma community"). |
| Authoritativeness | 14/25 | Links to GitHub (prisma/prisma), Discord, YouTube, X/Twitter. Contributing guide linked. |
| Trustworthiness | 22/30 | Full OG metadata. External links use `noopener noreferrer`. Meetup events with images provide social proof. |

**Estimated word count (indexable text): ~350 words**  
**Minimum for service/community page: 500 words**  
**Status: BELOW MINIMUM**

**Strengths:**
- Well-organized sections: Connect, Starter Kit, Meetups, Contributing.
- Meetup listings with images, descriptions, and links add dynamic content.
- Contributing section with three clear pathways (Issues, Discussions, Contributing Guide).

**Issues:**
- Every card description is a single generic sentence. "Browse the source code, open issues, and contribute to Prisma and its ecosystem" could describe any open-source project.
- No community metrics (Discord member count, GitHub contributors, npm weekly downloads).
- No featured community projects, no "built with Prisma" section, no developer spotlights.
- The "Here's a starter kit" section links to docs, examples, and YouTube -- content that exists elsewhere. This adds no unique value.
- Meetup data is imported from a shared data file -- verify it stays current.

**AI Citation Readiness: 2/10**  
No unique or quotable facts. The page is a link directory with no substantive content.

---

## Cross-Cutting Issues

### 1. Thin Content (Critical)

Six of the eight auditable pages fall below content minimums:

| Page | Words | Minimum | Deficit |
|------|-------|---------|---------|
| Homepage | ~120 | 500 | -380 |
| ORM | ~280 | 800 | -520 |
| MCP | ~200 | 800 | -600 |
| Studio | ~350 | 800 | -450 |
| Community | ~350 | 500 | -150 |
| Changelog (index) | ~150 | N/A | N/A |
| Pricing | ~2,200 | 800 | +1,400 |

The pricing page is the only page with adequate content depth. Every other page relies on visual components (images, icons, animations, interactive elements) with minimal supporting text.

### 2. Duplicate Content Risks

- **Testimonials component** is shared between Homepage and ORM page with identical content (same `homepage.json` data file, same component). Google may treat the repeated testimonial block as boilerplate.
- **Footer CTA sections** use nearly identical copy across Homepage, ORM, Pricing, Studio, and MCP pages ("Ready to try Prisma?", "Free to get started, no credit card needed").
- **Meta descriptions** are unique per page -- no duplication issues there.

### 3. Structured Data Gaps

| Page | Has Structured Data | Recommended |
|------|-------------------|-------------|
| Layout (global) | Organization + WebSite | Present |
| Pricing | FAQPage | Present |
| Homepage | None | Add `SoftwareApplication` or `Product` |
| ORM | None | Add `SoftwareApplication` |
| MCP | None | Add `SoftwareApplication` |
| Studio | None | Add `SoftwareApplication` |
| Changelog | None | Add `ItemList` or `Blog` |
| Community | None | Add `CollectionPage` (helper exists but is unused here) |

Note: A `createCollectionPageStructuredData` helper exists in `src/lib/structured-data.ts` but is not used on the Community or Changelog pages.

### 4. AI-Generated Content Assessment

The content does **not** appear to be AI-generated. Indicators:
- Testimonials include real photos, real company names, and specific product references.
- Changelog entries reference specific technical decisions (Rust-to-TypeScript migration) with linked evidence.
- FAQ answers use first-person plural ("We include a free threshold") and reference specific metrics ("measured from over 15b queries").
- Writing style is consistent with marketing team output, not LLM-generated patterns.

However, the brevity of product page copy means Google's helpful content signals may still flag these pages as thin, regardless of whether they were AI-generated.

### 5. Readability

The content that exists is generally well-written at a Grade 8-10 reading level, appropriate for a developer audience. Short sentences, clear value propositions. The pricing FAQ is the standout -- conversational, thorough, and well-structured.

Problem areas:
- Homepage hero: "Postgres, perfectly managed" is brand-first, not benefit-first. Searchers looking for "managed Postgres" or "Postgres ORM" may not immediately understand what Prisma offers.
- ORM page: "Delightful DB workflows" is subjective marketing language that adds no informational value.

### 6. Content Freshness

- Changelog entries span March 2024 to May 2025, with the latest being 11 months old (as of audit date April 2026). **If no newer entries exist, this is a freshness concern.**
- No visible "last updated" dates on product pages.
- Exchange rates in pricing data are hardcoded -- the USD/EUR rate of 0.93 may be stale.

---

## Priority Recommendations

### P0 -- Critical (Immediate Action)

1. **Add substantive body copy to the Homepage.** Write 400+ words explaining what Prisma is, what Prisma Postgres offers, and who it is for. Include a clear "What is Prisma?" section that would be quotable by AI systems and search features.

2. **Resolve the /accelerate dead end.** Either create a page, redirect to a relevant destination (e.g., /pricing or a docs page explaining connection pooling/caching), or remove all internal references.

3. **Expand ORM page content to 800+ words.** Add: what an ORM does, how Prisma ORM differs from Drizzle/TypeORM/Sequelize, supported databases with version info, a getting-started code sample, quantified performance claims from the benchmarks site.

### P1 -- High Priority (This Sprint)

4. **Expand MCP page content.** Add a "What is MCP?" explainer section, a "How it works" architecture diagram with text, and expand capability descriptions from 1 sentence to 2-3 sentences each with outcomes.

5. **Expand Studio page content.** Add supported database list, comparison positioning, and expand feature descriptions.

6. **Add `SoftwareApplication` structured data** to ORM, MCP, and Studio pages. The schema should include: name, applicationCategory, operatingSystem, offers (link to pricing).

7. **Add community metrics** to the Community page: Discord member count, GitHub stars, npm weekly downloads, number of contributors. These are strong E-A-T signals.

### P2 -- Medium Priority (Next Sprint)

8. **De-duplicate testimonials.** Either use different testimonial subsets per page, or consolidate testimonials to a single `/showcase` or `/customers` page and link to it.

9. **Add `ItemList` structured data to the Changelog index.** The helper function `createCollectionPageStructuredData` already exists in the codebase and can be reused.

10. **Add "last updated" signals to product pages.** Either through visible dates or through `dateModified` in structured data.

11. **Enable the RSS feed for the changelog.** The code appears commented out in next.config.mjs. RSS feeds are a freshness signal and improve content discoverability.

12. **Update pricing exchange rates dynamically** or add a "rates as of [date]" disclaimer.

### P3 -- Nice to Have

13. **Add a "What is Prisma?" definition block** to the homepage that uses `<dfn>` or a clearly marked definition format. This directly improves AI citation readiness.

14. **Add code samples to product pages.** The ORM page especially should show a Prisma schema and a query example inline, not just in linked docs.

15. **Add customer logos to the homepage.** The logo grid component exists (`useDefaultLogos: true`) but the logos themselves are not visible in the audit.

---

## AI Citation Readiness Summary

| Page | Score | Limiting Factor |
|------|-------|----------------|
| Homepage | 2/10 | No quotable definitions or facts |
| Pricing | 7/10 | Strong FAQ content, clear pricing facts |
| ORM | 3/10 | Meta description better than page content |
| Accelerate | N/A | Page does not exist |
| MCP | 4/10 | Missing explainer content |
| Studio | 4/10 | Brief feature descriptions |
| Blog | N/A | Externally hosted |
| Changelog | 6/10 | Good date-stamped release facts |
| Community | 2/10 | Link directory only |

**Overall AI Citation Readiness: 4/10**

To improve: every product page needs at least one paragraph that clearly and factually describes what the product is, who it is for, and what makes it different. These paragraphs should contain specific, verifiable claims (numbers, comparisons, technical specifications) rather than marketing adjectives.

---

## E-E-A-T Aggregate Scores

| Factor | Weight | Aggregate Score | Weighted |
|--------|--------|----------------|----------|
| Experience | 20% | 13/20 | 13.0% |
| Expertise | 25% | 16/25 | 16.0% |
| Authoritativeness | 25% | 15/25 | 15.0% |
| Trustworthiness | 30% | 21/30 | 21.0% |
| **Total** | **100%** | | **65.0%** |

---

*Audit conducted against Google September 2025 Quality Rater Guidelines. Word counts are estimates based on rendered text content extracted from React component source code, excluding navigation, footer, and non-text elements.*
