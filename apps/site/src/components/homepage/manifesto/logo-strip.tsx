import manifesto from "@/data/homepage-manifesto.json";
import LogoParade from "@prisma-docs/ui/components/logo-parade";

export function LogoStrip() {
  const { logos } = manifesto;

  return (
    <div className="marketing-logos">
      <div className="marketing-eyebrow marketing-eyebrow-weak mx-auto">
        {logos.label}
      </div>
      <LogoParade />
    </div>
  );
}
