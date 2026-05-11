import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/page-metadata";
import { Button, Card, Action } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { PostgresTabs } from "../../components/postgres";
import postgresData from "../../data/postgres.json";
import { LogoGrid } from "@/components/homepage/card-section/logo-grid";
import { ScrollCarousel } from "@/components/scroll-carousel";
import { Youtube } from "@prisma-docs/ui/components/youtube";
import { CarouselItem } from "@/components/enterprise/carousel-item";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";

const CONSOLE_URL =
  "https://console.prisma.io/login?utm_source=website&utm_medium=postgres&utm_campaign=cta";

const postgresStructuredData = createSoftwareApplicationStructuredData({
  path: "/postgres",
  name: "Prisma Postgres",
  description:
    "Managed PostgreSQL for serverless and modern deployments. Built-in connection pooling, standard SQL and PostgreSQL wire protocol, support for extensions like pgvector, automated backups, encryption at rest and in transit, and full tenant isolation.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    name: "Free tier",
    description:
      "Free to start with usage-based pricing as your database scales.",
  },
});

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-xl mt-0 mb-4">
          Built-in pooling for <br />
          serverless deployments
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Built-in connection pooling helps Prisma Postgres handle serverless,
          edge, and other bursty deployment models without the connection limits
          that break traditional Postgres setups.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_8",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_8",
    mobileImageAlt: "Postgres experience",
    logos: null,
    useDefaultLogos: true,
    noShadow: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-rocket-launch",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-xl mt-0 mb-4">
          Standard PostgreSQL, <br />
          no lock-in
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Use Prisma Postgres like Postgres. Connect with standard SQL and the
          PostgreSQL wire protocol, keep familiar tools like pg_dump, and use
          extensions such as pgvector.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_7",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_7",
    mobileImageAlt: "Postgres experience",
    logos: null,
    useDefaultLogos: true,
    noShadow: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-database",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-xl mt-0 mb-4">
          Direct integration with <br />
          Prisma ORM
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          If you use Prisma ORM, Prisma Postgres fits directly into your schema,
          migration, and connection workflow. You still keep the option to run
          raw SQL whenever you need native Postgres control.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_9",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_9",
    mobileImageAlt: "Postgres experience",
    noShadow: true,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-shield-check",
  },
];
export const metadata = createPageMetadata({
  title: "Prisma Postgres | Managed PostgreSQL for Serverless Apps",
  description:
    "Managed PostgreSQL for serverless and modern deployments with built-in connection pooling. Works with any ORM, query builder, raw SQL, and Prisma ORM.",
  path: "/postgres",
  ogImage: "/og/og-postgres.png",
});

export default async function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <JsonLd
        id="postgres-software-application"
        data={postgresStructuredData}
      />
      <div className="hero -mt-24 pt-40 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg-weak type-title-sm">
              <i className="fa-solid fa-chart-pyramid" />
              <span>Prisma Postgres</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-4xl mx-auto">
              Managed PostgreSQL for <br />
              modern deployments
            </h1>
            
          </div>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto text-xl">
            Built-in connection pooling for serverless and modern deployments,
            with the standard PostgreSQL experience and support for Prisma ORM,
            Drizzle, TypeORM, Kysely, or raw SQL.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              asChild
              variant="ppg"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                Create database
                <i className="fa-regular fa-database" />
              </a>
            </Button>
            <Button
              asChild
              variant="default-strong"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <a href="https://www.prisma.io/docs/postgres">
                Read the docs
                <i className="fa-regular fa-book-open" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="my-12">
          <PostgresTabs data={postgresData} />
        </div>
      </div>

      <section className="my-12 px-4 py-12">
        <div className="py-12 relative gap-8 flex flex-col max-w-300 mx-auto w-full">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0">
            Deploy Prisma Postgres with the stack you already use
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-300 mx-auto w-full">
          {postgresData.stack.map((card, index) => {
            const first = index === 0;
            return (
              <Card
                key={card.title}
                className={cn(
                  "first:bg-background-default not-first:bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] relative md:col-span-1",
                  "first:md:col-span-2 overflow-hidden",
                )}
              >
                <div
                  className={cn("flex flex-col gap-6 justify-between h-full")}
                >
                  <div className="flex justify-between items-start flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-4 w-full flex-1">
                      <div className="flex flex-col gap-4 items-start">
                        <Action color="ppg" size="4xl">
                          <i className={cn("text-2xl", card.icon)} />
                        </Action>
                        <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-foreground-neutral-weak text-base font-normal m-0">
                        {card.subtitle}
                      </p>
                    </div>
                    {typeof card.image === "string" &&
                    card.image === "logo-grid" ? (
                      <div
                        className={cn(
                          "min-w-0 overflow-visible flex-1 flex items-center relative md:max-w-unset sm:max-w-[60%] max-w-full mx-auto",
                          "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,var(--color-background-default)_0%,transparent_50%,var(--color-background-default)_100%)] before:z-10 before:pointer-events-none w-full",
                        )}
                      >
                        <LogoGrid
                          logos={card.useDefaultLogos ? undefined : card.logos}
                          type="track"
                        />
                      </div>
                    ) : null}
                  </div>
                  {typeof card.image === "string" &&
                  card.image === "logo-bar" &&
                  card.logos ? (
                    <div className={cn("w-full")}>
                      <LogoGrid
                        logos={card.logos}
                        type="spotlight"
                        color="ppg"
                      />
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="my-12">
        <div className="pt-12 relative gap-8 flex flex-col max-w-249 w-full mx-auto">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0 -mb-12 px-4">
            Managed PostgreSQL for serverless deployments
          </h3>
          <CardSection cardSection={twoCol} />
        </div>
      </section>
      <div
        className={cn(
          "my-12 md:p-12 mb-24 p-4",
          "bg-background-default md:bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-ppg)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
        )}
      >
        <div className="web-cta flex gap-4 md:gap-12 items-center mx-auto md:p-4 flex-col md:flex-row md:bg-none bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_330.76%)] md:border-none border border-stroke-neutral md:max-w-none max-w-137 w-full md:w-fit p-12 md:rounded-none rounded-square-high">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left md:mb-0 mb-3">
            Start free, scale with usage
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              Create a managed Postgres database without upfront commitment,
              then scale with usage-based pricing and spend limits as traffic
              grows.
            </p>
            <Button asChild variant="ppg" size="2xl">
              <a href="/pricing">
                Explore Pricing
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <section className="my-12 px-4">
        <div className="py-12 gap-12 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display ">
            Common Postgres workflows
          </h2>
          <ScrollCarousel
            ariaLabel="Made for every kind of app carousel"
            gridClassName="auto-cols-[100%] sm:auto-cols-[calc((100%-2rem)/3)]"
          >
            {postgresData.made_for.map((item) => (
              <CarouselItem key={item.title} card={item} color="ppg" />
            ))}
          </ScrollCarousel>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-[682px] flex-col gap-12">
          <div className="flex flex-col gap-6 items-center justify-center text-center max-w-[549px] mx-auto">
            <div className="max-w-[420px]">
              <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                Create a database and connect Prisma ORM in minutes
              </h2>
              <p className="m-0 mt-4 text-base leading-6 text-foreground-neutral-weak">
                Watch how to create a managed Postgres database, connect Prisma
                ORM, and get started with standard Postgres workflows in just a
                few minutes.
              </p>
            </div>

            <Button asChild variant="ppg" size="xl">
              <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                Create your first Database
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-box-low">
            <Youtube
              videoId="O1S0ax7GlL8"
              width="100%"
              height="400"
              title="Prisma ORM + Prisma Postgres: 5-Minutes Quickstart"
            />
          </div>
        </div>
      </section>
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Try Prisma Postgres
              </h2>
              <p className="text-foreground-neutral-weak">
                Managed PostgreSQL with built-in pooling, standard Postgres
                compatibility, and direct Prisma ORM integration.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button asChild variant="ppg" size="2xl">
                <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                  Create your first Database
                  <i className="fa-regular fa-arrow-right" />
                </a>
              </Button>
              <Button asChild variant="default-strong" size="2xl">
                <a href="https://www.prisma.io/docs">
                  Read the docs
                  <i className="fa-regular fa-arrow-right" />
                </a>
              </Button>
            </div>
            <h6 className="mb-0! -mt-4 text-foreground-neutral-weaker text-xs">
              Free to get started, no credit card needed.
            </h6>
          </div>
        </div>
      </div>
    </main>
  );
}
