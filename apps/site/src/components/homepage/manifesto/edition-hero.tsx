import manifesto from "@/data/homepage-manifesto.json";
import { Button } from "@prisma/eclipse";
import { ConsoleCtaButton } from "@/components/console-cta-button";
import { AgentTimeline } from "./agent-timeline";

const INDEX_CTA_DEFAULT_UTM = {
  utm_source: "website",
  utm_medium: "index",
  utm_campaign: "cta",
} as const;

export function EditionHero() {
  const { edition, hero } = manifesto;

  return (
    <section className="marketing-section flush relative overflow-hidden -mt-24 pt-36 pb-16 md:pt-40 md:pb-24">
      <div
        className="marketing-meta marketing-meta-wide mx-auto mb-16 flex max-w-[81rem] flex-wrap items-center justify-between gap-4 border-b border-stroke-neutral px-4 pb-4 md:px-0"
      >
        <span>{edition.title}</span>
        <span>{edition.edition}</span>
        <span className="marketing-meta-ppg">{edition.status}</span>
      </div>

      <div className="mx-auto max-w-[81rem] px-4 md:px-0">
        <div className="marketing-eyebrow mb-8">
          <i className="fa-light fa-sparkles" aria-hidden />
          {hero.eyebrow}
        </div>

        <h1 className="marketing-display mb-12 max-w-[75rem] text-[clamp(2.75rem,6vw,6.75rem)] leading-[0.94] tracking-[-0.035em]">
          {hero.headlineLines[0]}
          <br />
          {hero.headlineLines[1]}
        </h1>

        <div className="mb-14 grid max-w-[68.75rem] gap-10 md:grid-cols-2 md:gap-20">
          <p className="text-[19px] leading-[1.55] text-foreground-neutral">
            {hero.ledePrimary}
          </p>
          <p className="text-[17px] leading-[1.6] text-foreground-neutral-weak">
            {hero.ledeSecondary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
          <div className="marketing-meta marketing-meta-wide ml-0 md:ml-4">
            {hero.continueLabel}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[81rem] px-4 md:mt-24 md:px-0">
        <AgentTimeline />
      </div>
    </section>
  );
}
