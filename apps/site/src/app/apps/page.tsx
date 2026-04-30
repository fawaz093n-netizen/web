import { AppsDirectory } from "@/components/apps/apps-directory";
import { JsonLd } from "@/components/json-ld";
import { appDirectory, appKinds, getFeaturedApps, type AppKind } from "@/data/apps";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  createBreadcrumbStructuredData,
  createCollectionPageStructuredData,
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
const APPS_PAGE_SHELL = "mx-auto w-full max-w-[1240px]";
const APPS_PAGE_NARROW_SHELL = "mx-auto w-full max-w-[1040px]";

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

  return (
    <main className="relative -mt-24 flex-1 overflow-x-hidden bg-background-default text-foreground-neutral">
      <JsonLd id="apps-collection-structured-data" data={collectionStructuredData} />
      <JsonLd id="apps-breadcrumb-structured-data" data={breadcrumbStructuredData} />

      <section className="relative overflow-hidden px-4 pb-10 pt-46">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_42%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_68%)] opacity-80" />
        <div className={cn(APPS_PAGE_SHELL, "relative z-1")}>
          <div className="mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex flex-col gap-5">
              <Badge color="ppg" label="Prisma Apps" className="w-fit" />
              <div className="max-w-[720px]">
                <h1 className="m-0 text-[40px] leading-[0.98] font-black text-foreground-neutral md:text-[60px] stretch-display font-sans-display">
                  Deployable apps for Prisma Compute.
                </h1>
                <p className="mb-0 mt-5 max-w-[640px] text-lg leading-8 text-foreground-neutral-weak">
                  Browse real apps first, keep templates as a filter, and go from idea to deployable repo without digging through generic starters.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-stroke-neutral bg-background-neutral-weaker px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  {deployableApps} apps
                </span>
                <span className="rounded-full border border-stroke-neutral bg-background-neutral-weaker px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  {templates} templates
                </span>
                <span className="rounded-full border border-stroke-neutral bg-background-neutral-weaker px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  Deploy API coming online
                </span>
              </div>
            </div>

            <Card className="gap-4 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high">
              <div className="flex items-center justify-between gap-3">
                <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  Ship on Compute
                </p>
                <i className="fa-regular fa-cloud-arrow-up text-foreground-ppg" aria-hidden />
              </div>
              <p className="m-0 text-sm leading-7 text-foreground-neutral-weak">
                Use this directory to find apps worth deploying. Each listing gets its own page, stack context, and deploy path, with one-click launch ready to slot into the real Compute API.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="ppg" size="xl" href="#directory">
                  <span>Browse apps</span>
                  <i className="fa-regular fa-arrow-down" aria-hidden />
                </Button>
                <Button variant="default-stronger" size="xl" href="#submit">
                  <span>Submit an app</span>
                  <i className="fa-regular fa-arrow-right" aria-hidden />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className={APPS_PAGE_SHELL}>
          <AppsDirectory
            apps={appDirectory}
            featuredApps={getFeaturedApps()}
            initialCategory={initialCategory}
            initialKind={initialKind}
            initialSearch={initialSearch}
          />
        </div>
      </section>

      <section id="submit" className="px-4 pb-20">
        <div className={APPS_PAGE_NARROW_SHELL}>
          <Card className="gap-8 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high md:p-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="flex flex-col gap-4">
                <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  Submit an app
                </p>
                <h2 className="m-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                  Want to get listed?
                </h2>
                <p className="m-0 text-base leading-7 text-foreground-neutral-weak">
                  Listings can come from the curated `prisma/apps` repo or from a GitHub discovery topic. Either way, the app should ship with a clear README, a real deployment shape, and enough metadata to generate a useful detail page.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <span className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  Clear README
                </span>
                <span className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  Service metadata
                </span>
                <span className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  Screenshots
                </span>
                <span className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1.5 text-xs uppercase tracking-[1.4px] text-foreground-neutral-weak">
                  Compute fit
                </span>
              </div>
            </div>
            <div className="grid gap-3 border-t border-stroke-neutral pt-5 md:grid-cols-3">
              {[
                {
                  title: "Curated repo",
                  body: "Flagship apps can live in `prisma/apps` with tighter editorial control.",
                },
                {
                  title: "GitHub discovery",
                  body: "Community apps can be pulled in through a topic once ingestion is live.",
                },
                {
                  title: "Deploy-ready shape",
                  body: "Listings should expose enough structure for future one-click deployment.",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <h3 className="m-0 text-base font-bold text-foreground-neutral stretch-display font-sans-display">
                    {item.title}
                  </h3>
                  <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
