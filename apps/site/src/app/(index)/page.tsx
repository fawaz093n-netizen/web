import { createPageMetadata } from "@/lib/page-metadata";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { ClosingCtaSection } from "@/components/homepage/manifesto/closing-cta-section";
import { EditionHero } from "@/components/homepage/manifesto/edition-hero";
import { ExhibitSection } from "@/components/homepage/manifesto/exhibit-section";
import { LogoStrip } from "@/components/homepage/manifesto/logo-strip";
import { PlatformSection } from "@/components/homepage/manifesto/platform-section";
import { PullQuoteSection } from "@/components/homepage/manifesto/pull-quote-section";
import { ThesisSection } from "@/components/homepage/manifesto/thesis-section";

export const metadata = createPageMetadata({
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
  path: "/",
  ogImage: "/og/og-index.png",
});

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <EditionHero />
      <LogoStrip />
      <ThesisSection />
      <PlatformSection />
      <ExhibitSection />
      <PullQuoteSection />
      <ClosingCtaSection />
    </main>
  );
}
