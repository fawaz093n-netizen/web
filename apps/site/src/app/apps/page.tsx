import { AppsDirectory } from "@/components/apps/apps-directory";
import { JsonLd } from "@/components/json-ld";
import { appDirectory, appKinds, getFeaturedApps, type AppKind } from "@/data/apps";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  createBreadcrumbStructuredData,
  createCollectionPageStructuredData,
  createFaqStructuredData,
} from "@/lib/structured-data";
import { Badge, Button, Card } from "@prisma/eclipse";

const APPS_PAGE_TITLE = "Prisma Apps - Deploy full apps on Prisma Compute";
const APPS_PAGE_DESCRIPTION =
  "Browse deployable apps and production-minded templates for Prisma Compute. Discover AI agents, internal tools, waitlists, webhook apps, and SaaS starters built for long-running TypeScript workloads.";

const pageMetadata = createPageMetadata({
  title: APPS_PAGE_TITLE,
  description: APPS_PAGE_DESCRIPTION,
  path: "/apps",
  ogImage: "/og/og-index.png",
});

export const metadata = {
  ...pageMetadata,
  keywords: [
    "Prisma Apps",
    "Prisma Compute apps",
    "deployable TypeScript apps",
    "app marketplace",
    "full stack apps",
    "internal tools",
    "AI agent apps",
    "Prisma templates",
  ],
};

const collectionStructuredData = createCollectionPageStructuredData({
  path: "/apps",
  name: "Prisma Apps",
  description: APPS_PAGE_DESCRIPTION,
  items: appDirectory.map((app) => ({
    name: app.name,
    url: `/apps/${app.slug}`,
    description: app.summary,
  })),
});

const breadcrumbStructuredData = createBreadcrumbStructuredData([
  { name: "Home", url: "/" },
  { name: "Apps", url: "/apps" },
]);

const faqEntries = [
  {
    question: "What is Prisma Apps?",
    answer:
      "Prisma Apps is an app directory for Prisma Compute. It focuses on deployable end-to-end apps first, while still keeping templates available as a filter for teams that want a starter.",
  },
  {
    question: "Are these apps production-ready or just templates?",
    answer:
      "The directory is intentionally weighted toward real applications people can use. Templates are included, but they are a separate track rather than the default experience.",
  },
  {
    question: "How will one-click deployment work?",
    answer:
      "The deploy button is already wired to a placeholder API seam. Once the Prisma Compute deploy API is live, the same call path can trigger app deployment directly from the directory.",
  },
  {
    question: "How do I add my app to the directory?",
    answer:
      "The launch model supports two submission paths: curated entries in prisma/apps and discovery by GitHub topic. Listings need a clear README, deploy metadata, screenshots, stack tags, and a Prisma Compute-friendly project shape.",
  },
];

const faqStructuredData = createFaqStructuredData("/apps", faqEntries, "Prisma Apps FAQ");

function parseKind(value: string | string[] | undefined): "all" | AppKind {
  if (!value || Array.isArray(value)) return "all";
  return appKinds.includes(value as AppKind) ? (value as AppKind) : "all";
}

function parseCategory(value: string | string[] | undefined): string {
  if (!value || Array.isArray(value)) return "all";
  const categories = new Set(appDirectory.map((app) => app.category));
  return categories.has(value) ? value : "all";
}

function parseQuery(value: string | string[] | undefined): string {
  if (!value || Array.isArray(value)) return "";
  return value;
}

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialKind = parseKind(resolvedSearchParams.kind);
  const initialCategory = parseCategory(resolvedSearchParams.category);
  const initialSearch = parseQuery(resolvedSearchParams.q);

  const totalApps = appDirectory.length;
  const deployableApps = appDirectory.filter((app) => app.kind === "application").length;
  const templates = totalApps - deployableApps;
  const sources = new Set(appDirectory.map((app) => app.source)).size;

  return (
    <main className="relative -mt-24 flex-1 overflow-x-hidden bg-background-default text-foreground-neutral">
      <JsonLd id="apps-collection-structured-data" data={collectionStructuredData} />
      <JsonLd id="apps-faq-structured-data" data={faqStructuredData} />
      <JsonLd id="apps-breadcrumb-structured-data" data={breadcrumbStructuredData} />

      <section className="relative overflow-hidden px-4 pb-16 pt-46">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.14),transparent_45%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_70%)] opacity-80" />
        <div className="content relative z-1 flex flex-col gap-8">
          <div className="mx-auto flex max-w-[960px] flex-col items-center gap-5 text-center">
            <Badge color="ppg" label="Early access directory" className="w-fit" />
            <h1 className="m-0 max-w-[920px] text-[42px] leading-[1.05] font-black text-foreground-neutral md:text-[64px] stretch-display font-sans-display">
              Deploy full apps on Prisma Compute, not just starter templates.
            </h1>
            <p className="m-0 max-w-[760px] text-lg leading-8 text-foreground-neutral-weak">
              Prisma Apps is the discovery layer for deployable TypeScript apps on Compute. It is
              built for people looking for something useful to run, remix, or eventually launch with
              one click.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="ppg" size="xl" href="#directory">
                <span>Browse apps</span>
                <i className="fa-regular fa-arrow-down" aria-hidden />
              </Button>
              <Button variant="default-stronger" size="xl" href="#add-your-app">
                <span>Add your app</span>
                <i className="fa-regular fa-arrow-right" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Launch listings", value: totalApps, note: "Seeded for the first wave" },
              {
                label: "End-to-end apps",
                value: deployableApps,
                note: "The default directory view",
              },
              { label: "Starter templates", value: templates, note: "Available as a filter" },
              { label: "Submission paths", value: sources, note: "Curated repo or GitHub topic" },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="gap-2 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high"
              >
                <p className="m-0 text-xs font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  {stat.label}
                </p>
                <p className="m-0 text-4xl font-black text-foreground-neutral stretch-display font-sans-display">
                  {stat.value}
                </p>
                <p className="m-0 text-sm text-foreground-neutral-weak">{stat.note}</p>
              </Card>
            ))}
          </div>

          <Card className="mx-auto max-w-[1100px] border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  Why this page exists
                </p>
                <h2 className="m-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                  Railway proves the model. Prisma should win with apps that feel more complete,
                  more searchable, and more honest about deployable product shape.
                </h2>
                <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                  The goal is not another wall of generic starters. The goal is a marketplace for
                  useful apps that show what Compute is good at: long-running workers, colocated
                  Prisma Postgres, code-first infrastructure, and product workflows that go beyond a
                  hello-world clone.
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  "Dedicated app detail pages for SEO and long-tail discovery",
                  "Full apps first, templates second",
                  "A stable deploy API seam already in place for the later Compute hook-up",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[20px] border border-stroke-neutral bg-background-default px-4 py-3 text-sm text-foreground-neutral-weak"
                  >
                    <i
                      className="fa-regular fa-circle-check mt-1 text-foreground-ppg"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="content">
          <AppsDirectory
            apps={appDirectory}
            featuredApps={getFeaturedApps()}
            initialCategory={initialCategory}
            initialKind={initialKind}
            initialSearch={initialSearch}
          />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="content grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Push code, it runs",
              body: "Compute is built for the moment after the code exists. A useful app should be able to connect a repo, build, and come up without a second infrastructure choreography layer.",
              icon: "fa-regular fa-code-commit",
            },
            {
              title: "Long-lived by default",
              body: "Many of the best directory apps need workers, streaming, or long-running orchestration. That is a first-class fit for Compute, which is why the listings lean into those shapes.",
              icon: "fa-regular fa-timer",
            },
            {
              title: "Code-first infrastructure",
              body: "Apps in this directory are meant to ship with deployment shape in the repo, not buried in a dashboard. That makes them easier to review, remix, and automate later.",
              icon: "fa-regular fa-file-code",
            },
          ].map((pillar) => (
            <Card
              key={pillar.title}
              className="gap-4 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high"
            >
              <div className="flex size-12 items-center justify-center rounded-square bg-background-ppg text-foreground-ppg-reverse-strong">
                <i className={cn("text-lg", pillar.icon)} aria-hidden />
              </div>
              <h2 className="m-0 text-2xl font-black text-foreground-neutral stretch-display font-sans-display">
                {pillar.title}
              </h2>
              <p className="m-0 text-sm leading-7 text-foreground-neutral-weak">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="add-your-app" className="px-4 pb-16">
        <div className="content">
          <Card className="gap-8 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high md:p-8">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col gap-4">
                <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  Add your app
                </p>
                <h2 className="m-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                  Publish through the curated repo or a GitHub discovery topic.
                </h2>
                <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                  The directory is set up for two listing paths. Prisma can curate flagship apps in
                  a shared repo, while the wider ecosystem can opt into discovery with a topic-based
                  route once the ingestion flow is live.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    title: "Path 1: prisma/apps",
                    body: "Flagship or launch-wave apps can live in a curated repository with strong README coverage, screenshots, tags, and service metadata.",
                  },
                  {
                    title: "Path 2: GitHub topic",
                    body: "Third-party apps can be discovered through a dedicated topic once the directory sync is live, so teams keep ownership of their own repos.",
                  },
                  {
                    title: "README requirements",
                    body: "Every listing should explain what the app does, who it is for, the required services, environment variables, and why it is a good Compute fit.",
                  },
                  {
                    title: "Deploy requirements",
                    body: "Apps should declare their service layout clearly enough that the one-click deploy API can eventually provision the right shape without manual setup.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[20px] border border-stroke-neutral bg-background-default p-4"
                  >
                    <h3 className="mb-2 mt-0 text-lg font-bold text-foreground-neutral stretch-display font-sans-display">
                      {item.title}
                    </h3>
                    <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="content">
          <div className="mb-8 max-w-[720px]">
            <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
              FAQ
            </p>
            <h2 className="mb-0 mt-3 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
              Questions we expect from the first wave of builders
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {faqEntries.map((faq) => (
              <Card
                key={faq.question}
                className="gap-3 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high"
              >
                <h3 className="m-0 text-xl font-bold text-foreground-neutral stretch-display font-sans-display">
                  {faq.question}
                </h3>
                <p className="m-0 text-sm leading-7 text-foreground-neutral-weak">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
