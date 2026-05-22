import manifesto from "@/data/homepage-manifesto.json";
import { SystemDiagram } from "./system-diagram";

export function PlatformSection() {
  const { platform } = manifesto;

  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-[81rem] px-4 md:px-0">
        <div className="mx-auto max-w-[48.75rem] text-center">
          <div className="marketing-eyebrow mb-6 inline-flex justify-center">
            {platform.eyebrow}
          </div>
          <div className="marketing-display mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
            {platform.headline}
          </div>
          <p className="text-lg leading-[1.6] text-foreground-neutral-weak">
            {platform.body}
          </p>
        </div>

        <div className="mt-16">
          <SystemDiagram />
        </div>
      </div>
    </section>
  );
}
