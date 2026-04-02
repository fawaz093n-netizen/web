# Visual SEO Audit -- site-theta-two-38.vercel.app

**Date:** 2026-04-02
**Tool:** Playwright Chromium (headless), desktop 1920x1080 and mobile 375x812
**Pages audited:** `/` (homepage), `/pricing`, `/orm`

Screenshots saved to: `/Users/marchess/Projects/web/apps/site/screenshots/`

---

## 1. Homepage (`/`)

### Above-the-Fold -- Desktop (1920x1080)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 ("Postgres, perfectly managed.") | Yes | Large, bold, high contrast against white background. Good visual weight. |
| Subheading | Yes | "Real Postgres with the developer experience and infrastructure to ship faster." Readable, concise. |
| Primary CTA ("Create database") | Yes | Green/teal button, clearly visible. Good contrast. |
| Secondary CTA ("npx prisma init") | Yes | Copyable CLI command in a bordered pill. Effective for developer audience. |
| Navigation | Yes | Full nav bar with Products, Pricing, Resources, Docs, Blog. GitHub stars badge visible. Login and "Get started" CTA present. |
| Social proof / workflow section | Partially | "Your database, right in your workflow" heading and feature cards begin to appear. |

**Assessment:** Strong above-the-fold on desktop. The H1 is direct and benefit-oriented. Both a GUI-oriented CTA ("Create database") and a CLI-oriented CTA ("npx prisma init") are present, which is smart for a developer product. No layout issues observed.

### Above-the-Fold -- Mobile (375x812)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 | Yes | Scales well, large bold text. Takes up significant vertical space but remains readable. |
| Subheading | Yes | Visible below the H1. |
| Primary CTA | Yes | "Create database" button is visible and appropriately sized for touch. |
| Secondary CTA | Yes | "npx prisma init" pill is visible. |
| Navigation | Hamburger menu | Logo and hamburger icon present. Acceptable. |

**Assessment:** Mobile hero is clean and effective. The CTA is above the fold. The headline is large and takes roughly 40% of the viewport, which is borderline but acceptable given the importance of the message. No horizontal overflow detected.

### Full-Page Observations

- Feature cards ("MCP Server", "Manage databases", "Type-safety", "Work collaboratively", "Browse your data") are well laid out on desktop in a grid. On mobile they stack into a single column correctly.
- "Postgres that fits your stack" section shows technology logos (AWS, Cloudflare, Vercel, etc.) -- good social proof.
- "Real Postgres. Better experience." section with illustration renders cleanly.
- Bottom CTA section ("Ready to try Prisma?") is present with clear action buttons.
- Footer is complete with product, resource, support, and company links.

### Issues

1. **Decorative confetti/particle elements around the hero** -- These teal-colored decorative marks appear around the edges of the hero section. On mobile, some of these overlap or come very close to the heading text, which could be mildly distracting. Low severity.
2. **No visible meta-description or structured data indicator** -- Not a visual issue per se, but the page has no visible breadcrumb or schema-driven elements that would enhance SERP appearance.

---

## 2. Pricing Page (`/pricing`)

### Above-the-Fold -- Desktop (1920x1080)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 ("Scale as You Grow with Prisma Postgres") | Yes | Large, bold, centered. Clear value proposition. |
| Subheading | Yes | "Operation-based pricing. We only charge for what you use." |
| Pricing cards (Free, Starter, Pro, Business) | Yes | All four tiers visible with prices ($0, $10, $49, $129). "Pro" tier highlighted as "POPULAR" with a green border -- good visual hierarchy. |
| CTAs on cards | Yes | Each card has its own CTA button. Pro tier's "Start building" is the most prominent (filled green). |
| Banner ("Prisma ORM will always be free") | Yes | Small teal text at top. Good reassurance for OSS users. |
| Currency selector | Not visible on desktop above-fold | May be below the cards. |

**Assessment:** Excellent pricing page layout on desktop. All four tiers are immediately comparable. The "Popular" badge on Pro draws the eye. Price anchoring from Free to Business is clear. The value-based headline is SEO-friendly.

### Above-the-Fold -- Mobile (375x812)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 | Yes | Large text, takes substantial vertical space. |
| Subheading | Yes | Visible. |
| Pricing cards | **No** | None of the pricing tiers are visible above the fold. The user must scroll to see any pricing information. |
| Currency selector (USD dropdown) | Yes | Visible at bottom of viewport. |

**Assessment: This is a significant issue.** On mobile, the entire above-the-fold area is consumed by the headline and subheading. No pricing information or CTA is visible without scrolling. For a pricing page, users expect to see prices immediately. The H1 text is very large on mobile and could be reduced to allow at least the first pricing tier to appear above the fold.

### Full-Page Observations

- Pricing calculator section is present below the cards -- useful interactive tool.
- "Compare plans" table is comprehensive with feature-by-feature comparison.
- FAQ section at bottom addresses common questions.
- Mobile: pricing cards stack vertically and each is fully readable. The comparison table adapts to mobile.
- Bottom CTA ("Try Prisma Postgres") with action buttons present.

### Issues

1. **CRITICAL -- No pricing visible above the fold on mobile.** The H1 consumes too much vertical space. Recommend reducing mobile heading font size or restructuring layout to show at least the starting price ("From $0/month") above the fold.
2. **Pricing card text is small on desktop.** The feature lists within each card use small text that may be hard to scan at a glance. Consider slightly increasing line spacing or font size for the bullet points.
3. **"Pay as you go" toggle on Pro/Business** -- the toggle labels are small and may not be immediately obvious to users.

---

## 3. ORM Page (`/orm`)

### Above-the-Fold -- Desktop (1920x1080)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 ("Next-generation Node.js and TypeScript ORM") | Yes | Large, bold, white text on dark purple/navy background. High contrast. |
| Subheading | Yes | "Prisma ORM elevates developer experience with intuitive data modeling, automated migrations, and type-safety." |
| Primary CTA ("Create database") | Yes | Purple/dark button. Visible but lower contrast than the homepage's teal CTA. |
| Social proof metrics | Yes | GitHub stars (45K+), downloads (K+), and "Active developers" figures visible as icons with numbers. |
| Navigation | Yes | Same global nav, adapted with dark theme for this page. |

**Assessment:** The dark hero section creates strong visual differentiation from the homepage (which markets Prisma Postgres). The H1 is clear and keyword-rich for SEO ("Node.js and TypeScript ORM"). Social proof metrics are immediately visible. The CTA could be more prominent -- the dark button on the dark background has less pop than the homepage's teal button.

### Above-the-Fold -- Mobile (375x812)

| Element | Visible? | Notes |
|---------|----------|-------|
| H1 | Yes | "Next-generation Node.js and TypeScript ORM" is visible, though "Next-generation" is hyphenated/broken across lines. |
| Subheading | Yes | Fully visible. |
| Primary CTA | **Barely** | The "Create database" button appears at the very bottom edge of the viewport. Partially visible. |
| Social proof metrics | **No** | Not visible above the fold. |

**Assessment:** The mobile rendering is acceptable but the CTA is at the boundary of visibility. The word break on "Next-generation" (showing as "Next-generatio" with "n" on the next line or similar) is slightly awkward. Social proof stats are pushed below the fold.

### Full-Page Observations

- "Delightful DB workflows" section with a video/interactive demo panel -- good engagement content.
- "Works with your favorite databases and frameworks" section shows database logos (PostgreSQL, MySQL, MongoDB, SQLite, CockroachDB, etc.) -- important for SEO and user confidence.
- "Prisma vs other ORMs" comparison section present.
- "Type-safe database client" code example section is well formatted.
- "Easy to get started" and "Ready to get started?" bottom CTAs are present.
- Mobile: all sections stack cleanly. Code examples remain readable.

### Issues

1. **CTA contrast on dark background.** The "Create database" button on the ORM hero blends with the dark background more than ideal. Consider using a lighter/brighter button color (the teal from the homepage would work well here too).
2. **Mobile: H1 word break.** "Next-generation" may break awkwardly depending on exact rendering. Consider using a non-breaking hyphen or adjusting the mobile font size to prevent mid-word breaks.
3. **Social proof metrics not above fold on mobile.** The GitHub stars and download counts are compelling trust signals that would benefit from being visible without scrolling.

---

## Cross-Page Findings

### Mobile Responsiveness

| Criterion | Homepage | Pricing | ORM |
|-----------|----------|---------|-----|
| Hamburger menu present | Yes | Yes | Yes |
| No horizontal scroll | Pass | Pass | Pass |
| Touch targets >= 48px | Pass | Pass | Pass |
| Base font >= 16px | Pass | Pass | Pass |
| CTA above fold | Yes | **No** | Barely |
| Content stacks properly | Yes | Yes | Yes |

### Font Loading / FOUT

No font loading issues (FOUT/FOIT) were observed in any of the screenshots. All text rendered with the intended typeface. The site appears to use a system font stack or well-optimized web font loading (likely with `font-display: swap` or preloaded fonts).

### Visual Hierarchy

- **Homepage:** Strong. Clear H1 > subheading > dual CTA > feature grid progression.
- **Pricing:** Strong on desktop. The "Popular" badge and green highlight on the Pro tier effectively guide the eye. On mobile, the hierarchy breaks down because no pricing content is above the fold.
- **ORM:** Good. The dark hero creates separation. Below-fold sections have clear headings and logical flow. The CTA button could use more visual prominence.

### CTA Visibility Summary

| Page | Desktop CTA | Mobile CTA | Recommendation |
|------|-------------|------------|----------------|
| Homepage | Excellent (teal "Create database" + CLI command) | Good | None |
| Pricing | Good (per-tier CTAs, Pro highlighted) | **Not visible** above fold | Reduce mobile H1 size; show at least a starting price |
| ORM | Adequate (dark button on dark bg) | Barely visible | Use higher-contrast button color; reduce heading size |

---

## Priority Recommendations

### High Priority

1. **Pricing mobile: Show pricing above the fold.** This is the most impactful issue. Users visiting a pricing page on mobile expect to see prices immediately. Reduce the mobile H1 font size or add a condensed price summary beneath the subheading to surface pricing information without scrolling.

### Medium Priority

2. **ORM page: Increase CTA button contrast.** The dark "Create database" button on the dark purple hero has insufficient visual contrast. Switch to a brighter color (teal/green) to match the homepage pattern and improve click-through.

3. **ORM mobile: Ensure full CTA visibility.** The primary CTA is at the extreme bottom edge of the mobile viewport. Tighten spacing or reduce the heading size so the button is comfortably within the visible area.

### Low Priority

4. **Homepage: Review decorative elements on mobile.** The confetti/particle decorations near the hero edges are slightly distracting on smaller screens. Consider reducing their density or hiding them on mobile.

5. **Pricing: Improve feature list readability.** Slightly increase font size or spacing in the pricing card bullet lists for easier scanning on desktop.

6. **ORM mobile: Fix word break on "Next-generation".** Prevent awkward line breaks in the H1 by adjusting font sizing or using CSS `word-break` / `hyphens` properties.

---

## Screenshot Reference

| File | Description |
|------|-------------|
| `screenshots/homepage_desktop.png` | Homepage above-fold, 1920x1080 |
| `screenshots/homepage_mobile.png` | Homepage above-fold, 375x812 |
| `screenshots/homepage_desktop_full.png` | Homepage full page, desktop |
| `screenshots/homepage_mobile_full.png` | Homepage full page, mobile |
| `screenshots/pricing_desktop.png` | Pricing above-fold, 1920x1080 |
| `screenshots/pricing_mobile.png` | Pricing above-fold, 375x812 |
| `screenshots/pricing_desktop_full.png` | Pricing full page, desktop |
| `screenshots/pricing_mobile_full.png` | Pricing full page, mobile |
| `screenshots/orm_desktop.png` | ORM above-fold, 1920x1080 |
| `screenshots/orm_mobile.png` | ORM above-fold, 375x812 |
| `screenshots/orm_desktop_full.png` | ORM full page, desktop |
| `screenshots/orm_mobile_full.png` | ORM full page, mobile |
