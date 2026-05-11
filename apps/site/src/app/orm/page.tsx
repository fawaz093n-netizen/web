import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/page-metadata";
import { Action, Button, Separator } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { InfoStats } from "@/components/orm/info-stats";
import { cn } from "@/lib/cn";
import { Card as FeatureCard } from "@/components/homepage/bento";
import { YouTubePlayer } from "@prisma-docs/ui/components/youtube-player";
import Image from "next/image";
import Link from "next/link";

const statsSection = [
  {
    icon: "fa-brands fa-github",
    number: "45k+",
    text: "Stars on GitHub",
    link: "https://github.com/prisma/prisma",
  },
  {
    icon: "fa-regular fa-rocket-launch",
    number: "250k+",
    text: "Active developers",
    link: "https://www.npmjs.com/package/prisma",
  },
];
const badge_list = [
  {
    title: "supported languages",
    list: [
      {
        label: "JavaScript",
        url: "https://github.com/prisma/prisma-examples/tree/latest/orm",
      },
      { label: "TypeScript", url: "/typescript" },
    ],
  },
];
const prismaPostgresQuickstartUrl =
  "https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres";

const CardFooter = () => (
  <>
    <Separator className="my-6" />
    <div className="flex flex-col items-center md:items-stretch md:flex-row justify-between w-full gap-8">
      {badge_list.map((badge: any) => (
        <div
          className="flex flex-col items-center md:items-center md:flex-row gap-2 md:gap-6"
          key={badge.title}
        >
          <h6 className="font-semibold text-2xs text-foreground-neutral uppercase">
            {badge.title}
          </h6>
          <div className="flex justify-center md:justify-start gap-3">
            {badge.list &&
              badge.list.map((item: any) => (
                <Button
                  asChild
                  variant="orm"
                  key={item.label}
                  className="text-base"
                >
                  <a href={item.url}>{item.label}</a>
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  </>
);
const twoCol = [
  {
    content: (
      <>
        <div className="flex flex-col gap-1">
          <h5 className="text-foreground-orm type-title-sm">Why Prisma ORM</h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
            Database workflows, declared in code
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Keep your schema, migrations, and queries in one workflow. Prisma ORM
          helps teams move from data model to production with strong guarantees
          and predictable changes.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    other: (
      <YouTubePlayer
        autoplay={false}
        loading="eager"
        video="EEDGwLB55bI"
        thumbnail={"/illustrations/orm/thumbnail.png"}
      />
    ),
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "other" as const,
    footer: <CardFooter />,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
          Works with PostgreSQL, MySQL, SQLite, and more
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Use Prisma ORM with your current database, framework, and deployment
          setup. Start on the stack you already have, then add Prisma Postgres when you want more.
        </p>
        <Link href="/stack" className="link-btn orm w-fit mx-auto lg:mx-0">
          <span>View supported stacks</span>
          <i className="fa-regular fa-arrow-right ml-2" />
        </Link>
      </div>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    color: "orm" as const,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
];
const twoCol_2 = [
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-foreground-orm type-title-sm">
            Prisma Benchmarks
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display">
            Prisma vs other ORMs
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          A meaningful comparison of database query latencies across database
          providers and ORM libraries in the Node.js & TypeScript ecosystem.
        </p>
        <Button
          asChild
          variant="orm"
          size="xl"
          className="w-fit mx-auto lg:w-full"
        >
          <a href="https://benchmarks.prisma.io">
            Compare ORM benchmarks
            <i className="fa-regular fa-arrow-right" />
          </a>
        </Button>
      </div>
    ),
    imageUrl: "/illustrations/orm/orm_1",
    imageAlt:
      "Chart comparing database query latency across Prisma and other ORM libraries",
    mobileImageUrl: "/illustrations/orm/orm_1",
    mobileImageAlt:
      "Chart comparing database query latency across Prisma and other ORM libraries",
    logos: null,
    noShadow: true,
    useDefaultLogos: true,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-foreground-orm type-title-sm">Prisma Client</h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display">
            Type-safe queries, generated from your schema
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma Client is generated from your schema, so queries, relations,
          and autocomplete stay in sync with your data model. It feels
          approachable for SQL experts and developers learning databases alike.
        </p>
        <Link href="/client" className="link-btn orm w-fit mx-auto lg:mx-0">
          <span>Explore Prisma Client</span>
          <i className="fa-regular fa-arrow-right ml-2" />
        </Link>
      </div>
    ),
    imageUrl: "/illustrations/orm/orm_2",
    imageAlt:
      "Code editor showing Prisma Client query with auto-completion and type safety",
    mobileImageUrl: "/illustrations/orm/orm_2",
    mobileImageAlt:
      "Code editor showing Prisma Client query with auto-completion and type safety",
    color: "orm" as const,
    noShadow: true,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

const twoCol_3 = [
  {
    icon: "/mcp/logos/cursor.svg",
    title: "Agentic workflows for databases",
    description:
      "Use Prisma with AI tools and agents to inspect schemas, reason about data models, and speed up database workflows directly from your development environment.",
    btn: {
      url: "/mcp",
      label: "Explore AI workflows",
      icon: "fa-regular fa-arrow-right",
    },
  },
  {
    icon: "/icons/technologies/ts.svg",
    title: "Strong guarantees with TypeScript",
    description:
      "Types are generated from your schema so database access stays predictable as your application evolves.",
    btn: {
      url: "https://www.prisma.io/docs/orm/more/comparisons/prisma-and-typeorm",
      label: "Read comparison with TypeORM",
      icon: "fa-regular fa-arrow-up-right",
    },
  },
];

const features = [
  {
    title: "Declarative migrations in code",
    subtitle:
      "Version schema changes alongside your application and keep database evolution reviewable in your repo.",
    image: "/illustrations/orm/ide",
    alt: "Manage dbs",
    icon: "fa-light fa-screwdriver-wrench",
    link: "https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model",
  },
  {
    title: "Queries generated from your schema",
    subtitle:
      "Get autocomplete and end-to-end type safety from the data model already in your repo.",
    image: "/illustrations/orm/typesafe",
    alt: "Type-safe queries",
    icon: "fa-light fa-message-text",
    link: "https://www.prisma.io/docs/orm/prisma-client/type-safety",
  },
  {
    title: "Schema as your source of truth",
    subtitle:
      "Keep models, relations, and migrations versioned in code instead of scattered across dashboards.",
    image: "/illustrations/orm/collaborative",
    alt: "Collaborative work",
    icon: "fa-light fa-screen-users",
    link: "https://www.prisma.io/docs/orm/prisma-schema/overview",
  },
  {
    title: "Browse your data",
    subtitle: "Explore, filter, and edit your data with an interface.",
    image: "/illustrations/orm/data",
    alt: "Data browsing",
    icon: "fa-light fa-magnifying-glass-arrow-right",
    link: "/studio",
  },
];

const ormStructuredData = createSoftwareApplicationStructuredData({
  path: "/orm",
  name: "Prisma ORM",
  description:
    "Code-first ORM for Node.js and TypeScript with type-safe queries generated from your schema, declarative migrations, and support for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB.",
});

export const metadata = createPageMetadata({
  title: "Prisma ORM | Type-Safe Queries for Node.js and TypeScript",
  description:
    "Keep schema, migrations, and queries in code with Prisma ORM. Generate type-safe queries for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.",
  path: "/orm",
  ogImage: "/og/og-orm.png",
});

export default function ORM() {
  return (
    <main className="flex-1 w-full z-1 ">
      <JsonLd id="orm-software-application" data={ormStructuredData} />
      <div className="hero pt-40 -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-orm type-title-sm">
              <i className="fa-solid fa-database" />
              <span>Prisma ORM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-4xl mx-auto">
              Type-safe queries<br/> generated from your schema
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto">
            Prisma ORM keeps your schema, migrations, and queries in code for
            PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB, so
            you can move from data model to production with strong guarantees
            and predictable behavior.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              asChild
              variant="orm"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <a href={prismaPostgresQuickstartUrl}>
                Start with Prisma ORM
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
            <Button
              asChild
              variant="default-strong"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <a href="/client">
                Explore Prisma Client
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 flex flex-col sm:flex-row gap-30 w-fit mx-auto px-4 sm:px-40">
        {statsSection?.map((stat: any, index: number) => (
          <InfoStats
            key={index}
            icon={stat.icon}
            number={stat.number}
            link={stat.link ? stat.link : undefined}
            text={stat.text}
          />
        ))}
      </div>
      <div className="w-screen">
        <div className="my-12">
          <CardSection cardSection={twoCol} />
        </div>
      </div>
      <div className="my-12 py-12 px-4">
        <div className="max-w-260 w-full mx-auto">
          <CardSection cardSection={twoCol_2} />
          <div className="grid md:grid-cols-2 gap-9">
            {twoCol_3.map((stat, index) => (
              <div key={stat.title} className="flex flex-col gap-4">
                <Action
                  size="4xl"
                  color="orm"
                  
                  className={cn(index === 0 ? "p-3" : "", "relative")}
                >
                  <Image src={stat.icon} alt={stat.title} fill loading="lazy" />
                </Action>
                <h4 className="text-2xl text-center md:text-left font-sans-display stretch-display text-foreground-neutral">
                  {stat.title}
                </h4>
                <p className="text-center md:text-left text-foreground-neutral-weak">
                  {stat.description}
                </p>
                <Button
                  asChild
                  variant="default-strong"
                  size="xl"
                  className="w-fit mx-auto md:mx-0"
                >
                  <a href={stat.btn.url}>
                    {stat.btn.label}{" "}
                    {stat.btn.icon && <i className={stat.btn.icon} />}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-orm)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
        <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
            Standardize your
            <br />
            database workflow
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              Bring schema, migrations, and queries into one code-first workflow
              your team can share across projects.
            </p>
            <Button asChild variant="orm" size="2xl">
              <a href="/enterprise">
                Explore Enterprise
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 py-12 px-4">
        <div className="grid md:grid-cols-2 gap-4 max-w-249 w-full mx-auto">
          {features.map((card: any) => (
            <FeatureCard key={card.title} card={card} color="orm" />
          ))}
        </div>
      </div>

      {review?.testimonials?.length > 0 && (
        <div>
          <div className="my-12">
            <div className="px-4 py-10">
              <div className="max-w-[1240px] mx-auto">
                <h5
                  className="[&>b]:text-background-orm-reverse-strong font-sans-display stretch-display text-center text-base mb-12"
                  dangerouslySetInnerHTML={{ __html: review.title }}
                />
                <Testimonials
                  noShadow
                  color="orm"
                  list={review.testimonials}
                  mask="linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-background-orm-reverse before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Start with ORM, add more when you need it.
              </h2>
              <p className="text-foreground-neutral-weak max-w-121">
                Use Prisma ORM on its own, or pair it with Prisma Postgres as your application grows.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button asChild variant="orm" size="2xl">
                <a href={prismaPostgresQuickstartUrl}>
                  Start with Prisma ORM
                  <i className="fa-regular fa-arrow-right" />
                </a>
              </Button>
              <Button asChild variant="default-strong" size="2xl">
              <a href="https://www.prisma.io/docs/orm/prisma-schema/overview">
                Explore Prisma Schema
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
