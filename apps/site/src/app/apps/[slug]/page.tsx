import { AppDeployButton, AppDetailTracker } from "@/components/apps/app-deploy-button";
import { JsonLd } from "@/components/json-ld";
import { appDirectory, getAppBySlug, getRelatedApps, type AppEntry } from "@/data/apps";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  createBreadcrumbStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import { Badge, Button, Card } from "@prisma/eclipse";
import Image from "next/image";
import { notFound } from "next/navigation";

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

export async function generateStaticParams() {
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
  const relatedApps = getRelatedApps(app);

  if (relatedApps.length === 0) return null;

  return (
    <section className="px-4 pb-20">
      <div className="content">
        <div className="mb-8 max-w-[760px]">
          <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
            Keep exploring
          </p>
          <h2 className="mb-0 mt-3 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
            Related apps for the same kind of workload
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
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
                <span className="text-xs uppercase tracking-[1.6px] text-foreground-neutral-weaker">
                  {entry.category}
                </span>
              </div>
              <div>
                <h3 className="mb-2 mt-0 text-xl font-black text-foreground-neutral stretch-display font-sans-display">
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
                <span>Open listing</span>
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
        <div className="content relative z-1 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                color={app.kind === "application" ? "ppg" : "warning"}
                label={app.kind === "application" ? "App listing" : "Template listing"}
                className="w-fit"
              />
              <Badge
                color="neutral"
                label={app.status === "starter" ? "Starter" : "Seed listing"}
                className="w-fit"
              />
              <span className="text-sm text-foreground-neutral-weaker">{app.category}</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-square border border-stroke-neutral bg-background-neutral-weaker text-foreground-ppg">
                <i className={app.icon} aria-hidden />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="m-0 text-[40px] leading-[1.08] font-black text-foreground-neutral md:text-[58px] stretch-display font-sans-display">
                  {app.name}
                </h1>
                <p className="m-0 max-w-[760px] text-lg leading-8 text-foreground-neutral-weak">
                  {app.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <AppDeployButton app={app} location="detail" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="default-stronger" size="lg" href="/apps">
                  <span>Browse all apps</span>
                </Button>
                <Button variant="default-stronger" size="lg" href="/apps#add-your-app">
                  <span>Add your app</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Audience",
                  value: app.audiences[0],
                  note: `${app.audiences.length} audience groups`,
                },
                {
                  label: "Services",
                  value: String(app.services.length),
                  note: "Declared deployment units",
                },
                {
                  label: "Source path",
                  value: app.source === "prisma/apps" ? "Curated repo" : "GitHub topic",
                  note: "Planned listing origin",
                },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="gap-2 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high"
                >
                  <p className="m-0 text-xs font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                    {item.label}
                  </p>
                  <p className="m-0 text-2xl font-black text-foreground-neutral stretch-display font-sans-display">
                    {item.value}
                  </p>
                  <p className="m-0 text-sm text-foreground-neutral-weak">{item.note}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="gap-6 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Stack
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.stack.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-stroke-neutral bg-background-default px-3 py-1.5"
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={16}
                      height={16}
                      className="size-4 object-contain"
                    />
                    <span className="text-sm text-foreground-neutral-weak">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Tag set
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1 text-xs text-foreground-neutral-weak"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Best for
              </p>
              <ul className="mb-0 mt-4 flex list-none flex-col gap-2 p-0">
                {app.audiences.map((audience) => (
                  <li
                    key={audience}
                    className="flex items-start gap-2 text-sm text-foreground-neutral-weak"
                  >
                    <i className="fa-regular fa-user-group mt-1 text-foreground-ppg" aria-hidden />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="content grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card className="gap-5 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                What you get
              </p>
              <h2 className="mb-0 mt-3 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                Product-shaped capabilities, not just scaffolding
              </h2>
            </div>
            <div className="grid gap-3">
              {app.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-[18px] border border-stroke-neutral bg-background-default px-4 py-3 text-sm text-foreground-neutral-weak"
                >
                  <i className="fa-regular fa-circle-check mt-1 text-foreground-ppg" aria-hidden />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-5 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Why Compute fits
              </p>
              <h2 className="mb-0 mt-3 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                The deployment model matches how this app behaves
              </h2>
            </div>
            <div className="grid gap-3">
              {app.whyCompute.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-[18px] border border-stroke-neutral bg-background-default px-4 py-3 text-sm text-foreground-neutral-weak"
                >
                  <i className="fa-regular fa-bolt mt-1 text-foreground-ppg" aria-hidden />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="content grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="gap-5 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Deployment shape
              </p>
              <h2 className="mb-0 mt-3 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                Service layout the future deploy API can target
              </h2>
            </div>

            <div className="grid gap-3">
              {app.services.map((service) => (
                <div
                  key={service.name}
                  className="rounded-[18px] border border-stroke-neutral bg-background-default p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="mb-1 mt-0 text-lg font-bold text-foreground-neutral stretch-display font-sans-display">
                        {service.name}
                      </h3>
                      <p className="m-0 text-sm text-foreground-neutral-weak">
                        {service.description}
                      </p>
                    </div>
                    <Badge color="neutral" label={service.type} className="w-fit" />
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-foreground-neutral-weaker">
                    <div>
                      <span className="font-semibold text-foreground-neutral">Entry:</span>{" "}
                      <code>{service.entry}</code>
                    </div>
                    {service.schedule ? (
                      <div>
                        <span className="font-semibold text-foreground-neutral">Schedule:</span>{" "}
                        <code>{service.schedule}</code>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4">
            {app.readmeSections.map((section) => (
              <Card
                key={section.title}
                className="gap-4 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high"
              >
                <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                  README section
                </p>
                <h2 className="m-0 text-2xl font-black text-foreground-neutral stretch-display font-sans-display">
                  {section.title}
                </h2>
                <p className="m-0 text-sm leading-7 text-foreground-neutral-weak">{section.body}</p>
              </Card>
            ))}

            <Card className="gap-4 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Listing note
              </p>
              <h2 className="m-0 text-2xl font-black text-foreground-neutral stretch-display font-sans-display">
                This page is ready for GitHub-backed content when the publish flow opens
              </h2>
              <p className="m-0 text-sm leading-7 text-foreground-neutral-weak">
                The copy here is intentionally structured like a README-derived listing: overview,
                production fit, and deployment shape. Once the app publishing flow is live, the same
                page model can be hydrated from repository metadata and README sections instead of
                seeded copy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="content">
          <Card className="gap-5 border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high">
            <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
              Planned analytics
            </p>
            <h2 className="mb-0 mt-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
              Track discovery, deploy intent, and which listings actually move people
            </h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Page and app-detail views with app slug, kind, and category",
                "Filter changes, search behavior, and zero-result states",
                "Deploy CTA clicks and placeholder API responses",
                "Attribution through PostHog pageviews, UTMs, and referrer data",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-stroke-neutral bg-background-default px-4 py-3 text-sm text-foreground-neutral-weak"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <RelatedApps app={app} />
    </main>
  );
}
