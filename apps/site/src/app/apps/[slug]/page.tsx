import { AppDeployButton, AppDetailTracker } from "@/components/apps/app-deploy-button";
import { JsonLd } from "@/components/json-ld";
import { createPageMetadata } from "@/lib/page-metadata";
import { getAppBySlug, getAppDirectory, getRelatedApps } from "@/lib/prisma-apps-loader";
import {
  createBreadcrumbStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import type { AppEntry } from "@/data/apps";
import { Badge, Button, Card } from "@prisma/eclipse";
import Image from "next/image";
import { notFound } from "next/navigation";

const APPS_DETAIL_SHELL = "mx-auto w-full max-w-[1200px]";
const APPS_DETAIL_NARROW_SHELL = "mx-auto w-full max-w-[1100px]";

function appMetadata(app: AppEntry) {
  return {
    ...createPageMetadata({
      title: `${app.name} | Prisma Apps`,
      description: app.description,
      path: `/apps/${app.slug}`,
      ogImage: "/og/og-index.png",
    }),
    keywords: [...app.keywords, ...app.tags, app.category, "Prisma Apps", "Prisma Compute"],
  };
}

function getDeploymentShape(app: AppEntry) {
  return Array.from(new Set(app.services.map((service) => service.type)))
    .map((type) => {
      switch (type) {
        case "api":
          return "API";
        case "web":
          return "Web";
        case "worker":
          return "Worker";
        case "cron":
          return "Cron";
      }
    })
    .join(" + ");
}

export async function generateStaticParams() {
  const appDirectory = await getAppDirectory();

  return appDirectory.map((app) => ({
    slug: app.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) notFound();

  return appMetadata(app);
}

function RelatedApps({ app }: { app: AppEntry }) {
  const relatedAppsPromise = getRelatedApps(app);
  return <RelatedAppsInner relatedAppsPromise={relatedAppsPromise} />;
}

async function RelatedAppsInner({
  relatedAppsPromise,
}: {
  relatedAppsPromise: ReturnType<typeof getRelatedApps>;
}) {
  const relatedApps = await relatedAppsPromise;

  if (relatedApps.length === 0) return null;

  return (
    <section className="px-4 pb-20">
      <div className={APPS_DETAIL_NARROW_SHELL}>
        <div className="mb-6">
          <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
            Related apps
          </p>
          <h2 className="mb-0 mt-2 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
            More apps to explore
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedApps.map((entry) => (
            <Card
              key={entry.slug}
              className="gap-4 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge
                  color={entry.kind === "application" ? "ppg" : "warning"}
                  label={entry.kind === "application" ? "App" : "Template"}
                  className="w-fit"
                />
                <span className="text-xs uppercase tracking-[1.4px] text-foreground-neutral-weaker">
                  {entry.category}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="m-0 text-xl font-black text-foreground-neutral stretch-display font-sans-display">
                  {entry.name}
                </h3>
                <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">
                  {entry.summary}
                </p>
              </div>

              <Button
                variant="default-stronger"
                size="lg"
                href={`/apps/${entry.slug}`}
                className="justify-center"
              >
                <span>View app</span>
                <i className="fa-regular fa-arrow-right" aria-hidden />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) notFound();

  const softwareApplicationStructuredData = createSoftwareApplicationStructuredData({
    path: `/apps/${app.slug}`,
    name: app.name,
    description: app.description,
    applicationCategory:
      app.kind === "application" ? "BusinessApplication" : "DeveloperApplication",
  });

  const breadcrumbStructuredData = createBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Apps", url: "/apps" },
    { name: app.name, url: `/apps/${app.slug}` },
  ]);

  const deploymentShape = getDeploymentShape(app);

  return (
    <main className="relative -mt-24 flex-1 overflow-x-hidden bg-background-default text-foreground-neutral">
      <JsonLd
        id={`${app.slug}-software-application-structured-data`}
        data={softwareApplicationStructuredData}
      />
      <JsonLd id={`${app.slug}-breadcrumb-structured-data`} data={breadcrumbStructuredData} />
      <AppDetailTracker app={app} />

      <section className="relative overflow-hidden px-4 pb-14 pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_45%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_70%)] opacity-80" />

        <div className={`${APPS_DETAIL_SHELL} relative z-1`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  color={app.kind === "application" ? "ppg" : "warning"}
                  label={app.kind === "application" ? "App" : "Template"}
                  className="w-fit"
                />
                <span className="text-sm text-foreground-neutral-weaker">{app.category}</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-square border border-stroke-neutral bg-background-neutral-weaker text-foreground-ppg">
                  <i className={app.icon} aria-hidden />
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="m-0 max-w-[12ch] text-[40px] leading-[1.02] font-black text-foreground-neutral md:text-[58px] stretch-display font-sans-display">
                    {app.name}
                  </h1>
                  <p className="m-0 max-w-prose text-lg leading-8 text-foreground-neutral-weak">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-foreground-neutral-weaker">
                    <span>{app.audiences[0]}</span>
                    <span aria-hidden>•</span>
                    <span>{deploymentShape}</span>
                    <span aria-hidden>•</span>
                    <span>
                      {app.source === "prisma/apps" ? "Curated repo" : "GitHub topic"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="gap-5 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high lg:sticky lg:top-28">
              <AppDeployButton app={app} location="detail" className="w-full" />

              <div className="grid gap-4 border-t border-stroke-neutral pt-5 text-sm text-foreground-neutral-weak">
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[1.3px] text-foreground-neutral-weaker">
                    Best for
                  </p>
                  <p className="mb-0 mt-1">{app.audiences[0]}</p>
                </div>
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[1.3px] text-foreground-neutral-weaker">
                    Runs as
                  </p>
                  <p className="mb-0 mt-1">{deploymentShape}</p>
                </div>
                <div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[1.3px] text-foreground-neutral-weaker">
                    Stack
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {app.stack.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-full border border-stroke-neutral bg-background-default px-2.5 py-1"
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={14}
                          height={14}
                          className="size-3.5 object-contain"
                        />
                        <span className="text-xs text-foreground-neutral-weak">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="default-stronger" size="lg" href="/apps" className="justify-center">
                <span>Browse all apps</span>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className={`${APPS_DETAIL_NARROW_SHELL} grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]`}>
          <div className="flex flex-col gap-10">
            <section className="border-t border-stroke-neutral pt-8">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                What it does
              </p>
              <div className="mt-4 grid gap-4">
                {app.readmeSections.map((section) => (
                  <div key={section.title} className="max-w-prose">
                    <h2 className="m-0 text-2xl font-black text-foreground-neutral stretch-display font-sans-display">
                      {section.title}
                    </h2>
                    <p className="mb-0 mt-3 text-base leading-8 text-foreground-neutral-weak">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-stroke-neutral pt-8">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Key features
              </p>
              <div className="mt-4 grid gap-3">
                {app.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-7 text-foreground-neutral-weak"
                  >
                    <i className="fa-regular fa-circle-check mt-1 text-foreground-ppg" aria-hidden />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-stroke-neutral pt-8">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Why it fits Compute
              </p>
              <div className="mt-4 grid gap-3">
                {app.whyCompute.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-start gap-3 text-sm leading-7 text-foreground-neutral-weak"
                  >
                    <i className="fa-regular fa-bolt mt-1 text-foreground-ppg" aria-hidden />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-8">
            <section className="border-t border-stroke-neutral pt-8">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Service layout
              </p>
              <div className="mt-4 grid gap-4">
                {app.services.map((service) => (
                  <div key={service.name} className="flex flex-col gap-2 text-sm text-foreground-neutral-weak">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="m-0 text-base font-bold text-foreground-neutral stretch-display font-sans-display">
                        {service.name}
                      </h2>
                      <Badge color="neutral" label={service.type} className="w-fit" />
                    </div>
                    <p className="m-0 leading-6">{service.description}</p>
                    <p className="m-0 text-xs text-foreground-neutral-weaker">
                      Entry: <code>{service.entry}</code>
                    </p>
                    {service.schedule ? (
                      <p className="m-0 text-xs text-foreground-neutral-weaker">
                        Schedule: <code>{service.schedule}</code>
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-stroke-neutral pt-8">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Tags
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stroke-neutral bg-background-neutral-weaker px-3 py-1 text-xs text-foreground-neutral-weak"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>

      <RelatedApps app={app} />
    </main>
  );
}
