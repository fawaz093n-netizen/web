import { AppsDirectory } from "@/components/apps/apps-directory";
import { JsonLd } from "@/components/json-ld";
import { appKinds, type AppKind } from "@/data/apps";
import { getAppDirectory } from "@/lib/prisma-apps-loader";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  createBreadcrumbStructuredData,
  createCollectionPageStructuredData,
} from "@/lib/structured-data";
import { Badge } from "@prisma/eclipse";

const APPS_PAGE_TITLE =
  "Prisma Apps - Deploy AI agents, backends, internal tools, and full-stack apps";
const APPS_PAGE_DESCRIPTION =
  "Browse deployable apps for Prisma Compute, including AI agents, internal tools, support inboxes, webhook backends, waitlists, and SaaS starters. Discover apps and templates you can run, remix, and deploy.";

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
    "deployable apps",
    "AI agent apps",
    "internal tools",
    "support inbox app",
    "waitlist app",
    "webhook backend",
    "SaaS starter",
    "Prisma templates",
  ],
};

const breadcrumbStructuredData = createBreadcrumbStructuredData([
  { name: "Home", url: "/" },
  { name: "Apps", url: "/apps" },
]);

const APPS_PAGE_SHELL = "mx-auto w-full max-w-[1240px]";
function parseKind(value: string | string[] | undefined): "all" | AppKind {
  if (!value || Array.isArray(value)) return "all";
  return appKinds.includes(value as AppKind) ? (value as AppKind) : "all";
}

function parseCategory(
  value: string | string[] | undefined,
  categories: Iterable<string>,
): string {
  if (!value || Array.isArray(value)) return "all";
  return new Set(categories).has(value) ? value : "all";
}

function parseQuery(value: string | string[] | undefined): string {
  if (!value || Array.isArray(value)) return "";
  return value;
}

function parseTechnology(
  value: string | string[] | undefined,
  technologies: Iterable<string>,
): string {
  if (!value || Array.isArray(value)) return "all";
  return new Set(technologies).has(value) ? value : "all";
}

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialKind = parseKind(resolvedSearchParams.kind);
  const appDirectory = await getAppDirectory();
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
  const initialCategory = parseCategory(
    resolvedSearchParams.category,
    appDirectory.map((app) => app.category),
  );
  const initialTechnology = parseTechnology(
    resolvedSearchParams.stack,
    appDirectory.flatMap((app) => app.stack.map((item) => item.label)),
  );
  const initialSearch = parseQuery(resolvedSearchParams.q);

  return (
    <main className="relative -mt-24 flex-1 overflow-x-hidden bg-background-default text-foreground-neutral">
      <JsonLd id="apps-collection-structured-data" data={collectionStructuredData} />
      <JsonLd id="apps-breadcrumb-structured-data" data={breadcrumbStructuredData} />

      <section className="relative overflow-hidden px-4 pb-14 pt-52 md:pt-56">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.17),transparent_42%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_66%)] opacity-80" />

        <div className={`${APPS_PAGE_SHELL} relative z-1`}>
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-5 text-center">
            <Badge color="ppg" label="Apps directory" className="w-fit" />
            <div className="flex flex-col gap-4">
              <h1 className="m-0 max-w-[14ch] text-[44px] leading-[0.96] font-black text-foreground-neutral md:text-[68px] stretch-display font-sans-display">
                Deploy complete apps
                <br />
                on Prisma Compute.
              </h1>
              <p className="m-0 max-w-[640px] self-center text-center text-lg leading-8 text-foreground-neutral-weak">
                Discover one-click AI agents, internal tools, support apps, and full-stack
                software ready to deploy and use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className={APPS_PAGE_SHELL}>
          <AppsDirectory
            apps={appDirectory}
            initialCategory={initialCategory}
            initialKind={initialKind}
            initialSearch={initialSearch}
            initialTechnology={initialTechnology}
          />
        </div>
      </section>
    </main>
  );
}
