import manifesto from "@/data/homepage-manifesto.json";
import { ConfigCode } from "./config-code";

export function ExhibitSection() {
  const { exhibit } = manifesto;

  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-[81rem] px-4 md:px-0">
        <div className="marketing-section-header mb-12">
          <div className="marketing-eyebrow">{exhibit.eyebrow}</div>
          <div className="marketing-meta">{exhibit.meta}</div>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <div className="marketing-display mb-6 max-w-[30rem] text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
              {exhibit.headline}
            </div>
            <p className="mb-6 max-w-[30rem] text-[17px] leading-[1.6] text-foreground-neutral-weak">
              {exhibit.bodyPrimary}
            </p>
            <p className="max-w-[30rem] text-[17px] leading-[1.6] text-foreground-neutral-weak">
              {exhibit.bodySecondary}
            </p>
            <div className="mt-8 rounded-xl border border-stroke-neutral bg-background-neutral-weaker p-5 md:p-6">
              <div className="marketing-meta marketing-meta-ppg mb-3">
                {exhibit.footnoteLabel}
              </div>
              <p className="m-0 text-sm leading-[1.55] text-foreground-neutral-weak">
                {exhibit.footnote}
              </p>
            </div>
          </div>
          <ConfigCode />
        </div>
      </div>
    </section>
  );
}
