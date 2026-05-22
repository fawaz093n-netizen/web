import manifesto from "@/data/homepage-manifesto.json";

export function PullQuoteSection() {
  const { pullQuote } = manifesto;

  return (
    <section className="marketing-section py-24 md:py-32">
      <div className="mx-auto max-w-[68.75rem] px-4 text-center md:px-0">
        <div className="marketing-eyebrow mb-9 inline-flex justify-center">
          {pullQuote.eyebrow}
        </div>
        <blockquote className="marketing-display mb-9 text-[clamp(2rem,4vw,3.75rem)] leading-[1.03] tracking-[-0.025em]">
          &ldquo;{pullQuote.quote}&rdquo;
        </blockquote>
        <div className="marketing-meta marketing-meta-wide">
          ─── {pullQuote.attribution}
        </div>
      </div>
    </section>
  );
}
