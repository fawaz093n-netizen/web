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

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialKind = parseKind(resolvedSearchParams.kind);
  const appDirectory = await getAppDirectory();
  const initialCategory = parseCategory(
    resolvedSearchParams.category,
    appDirectory.map((app) => app.category),
  );
  const initialSearch = parseQuery(resolvedSearchParams.q);

  return (
    <main className="relative -mt-24 flex-1 overflow-x-hidden bg-background-default text-foreground-neutral">
      <JsonLd id="apps-collection-structured-data" data={collectionStructuredData} />
      <JsonLd id="apps-breadcrumb-structured-data" data={breadcrumbStructuredData} />

      <section className="relative overflow-hidden px-4 pb-12 pt-46">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.17),transparent_42%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_66%)] opacity-80" />

        <div className={`${APPS_PAGE_SHELL} relative z-1`}>
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 text-center">
            <Badge color="ppg" label="Prisma Apps directory" className="w-fit" />
            <div className="flex flex-col gap-4">
              <h1 className="m-0 text-[40px] leading-[0.98] font-black text-foreground-neutral md:text-[60px] stretch-display font-sans-display">
                Browse apps you can deploy on Prisma Compute.
              </h1>
              <p className="m-0 max-w-[760px] text-lg leading-8 text-foreground-neutral-weak">
                Discover AI agents, internal tools, support inboxes, webhook backends, waitlist
                apps, and starter kits. Open a listing to see the stack, service layout, and
                deployment notes before you deploy.
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
          />
        </div>
      </section>

      <section id="submit" className="px-4 pb-20">
        <div className={`${APPS_PAGE_NARROW_SHELL} text-center`}>
          <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
            Submit an app
          </p>
          <p className="mb-0 mt-3 text-base leading-7 text-foreground-neutral-weak">
            We plan to support curated listings from `prisma/apps` and discovery through a GitHub
            topic. A good listing should have a clear README, screenshots, stack metadata, and a
            deployment shape that makes sense on Compute.
          </p>
        </div>
      </section>
    </main>
  );
}
