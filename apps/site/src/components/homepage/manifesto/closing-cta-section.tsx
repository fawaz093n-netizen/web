import manifesto from "@/data/homepage-manifesto.json";
import { Button } from "@prisma/eclipse";
import { ConsoleCtaButton } from "@/components/console-cta-button";

const INDEX_CTA_DEFAULT_UTM = {
  utm_source: "website",
  utm_medium: "index",
  utm_campaign: "cta",
} as const;

export function ClosingCtaSection() {
  const { closing } = manifesto;

  return (
    <section className="marketing-cta-band">
      <div className="marketing-pill mb-8">
        <span className="dot" aria-hidden />
        {closing.eyebrow}
      </div>
      <div className="marketing-display mx-auto mb-7 max-w-[62.5rem] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.03em]">
        {closing.headlineLines[0]}
        <br />
        {closing.headlineLines[1]}
      </div>
      <p className="mx-auto mb-10 max-w-lg text-lg text-foreground-neutral-weak">
        {closing.subhead}
      </p>
      <div className="inline-flex flex-wrap justify-center gap-3">
        <ConsoleCtaButton
          variant="ppg"
          consolePath="/sign-up"
          defaultUtm={INDEX_CTA_DEFAULT_UTM}
          size="3xl"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans-display! font-bold"
        >
          <span>Start building</span>
          <i className="fa-regular fa-arrow-right" aria-hidden />
        </ConsoleCtaButton>
        <Button asChild variant="default-strong" size="3xl">
          <a href="https://www.prisma.io/docs">
            Read the docs
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </a>
        </Button>
      </div>
      <div className="marketing-meta marketing-meta-wide mt-10">
        {closing.footer}
      </div>
    </section>
  );
}
