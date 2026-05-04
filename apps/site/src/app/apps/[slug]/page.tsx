import { AppDeployButton, AppDetailTracker } from "@/components/apps/app-deploy-button";
import { AppCard } from "@/components/apps/app-card";
import { JsonLd } from "@/components/json-ld";
import type { AppEntry } from "@/data/apps";
import { getAppDetailImage, getAppGradient, getAppMonogram } from "@/lib/app-visuals";
import { createPageMetadata } from "@/lib/page-metadata";
import { getAppBySlug, getAppDirectory, getRelatedApps } from "@/lib/prisma-apps-loader";
import {
  createBreadcrumbStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import { Button, Card } from "@prisma/eclipse";
import Image from "next/image";
import { notFound } from "next/navigation";

const APPS_DETAIL_SHELL = "mx-auto w-full max-w-[1200px]";

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
  const appDirectory = await getAppDirectory();

  return appDirectory.map((app) => ({
    slug: app.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) notFound();

  return appMetadata(app);
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

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

  const detailImage = getAppDetailImage(app);
  const monogram = getAppMonogram(app);
  const gradient = getAppGradient(app.slug);
  const relatedApp = (await getRelatedApps(app))[0];

  return (
    <main className="relative -mt-24 flex-1 bg-background-default text-foreground-neutral">
      <JsonLd
        id={`${app.slug}-software-application-structured-data`}
        data={softwareApplicationStructuredData}
      />
      <JsonLd id={`${app.slug}-breadcrumb-structured-data`} data={breadcrumbStructuredData} />
      <AppDetailTracker app={app} />

      <section className="relative px-4 pb-20 pt-52 md:pt-56">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_45%),linear-gradient(180deg,var(--color-background-ppg)_0%,transparent_70%)] opacity-80" />

        <div className={`${APPS_DETAIL_SHELL} relative z-1`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="flex flex-col gap-6">
              <div>
                <Button
                  href="/apps"
                  variant="default-weaker"
                  size="lg"
                  className="justify-start gap-2 px-0"
                >
                  <i className="fa-regular fa-arrow-left" aria-hidden />
                  <span>Back to browsing Prisma Apps</span>
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="m-0 max-w-[12ch] text-[40px] leading-[1.02] font-black text-foreground-neutral md:text-[58px] stretch-display font-sans-display">
                  {app.name}
                </h1>
                <p className="m-0 max-w-prose text-lg leading-8 text-foreground-neutral-weak">
                  {app.description}
                </p>
              </div>
              <div className="flex max-w-[760px] flex-col gap-10 border-t border-stroke-neutral pt-8">
                <section>
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
                        <span
                          className="mt-2 inline-flex size-2 shrink-0 rounded-full bg-foreground-ppg"
                          aria-hidden
                        />
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
                        <span
                          className="mt-2 inline-flex size-2 shrink-0 rounded-full bg-foreground-ppg"
                          aria-hidden
                        />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="self-start lg:sticky lg:top-28">
              <Card className="h-fit gap-5 border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high">
                <div className="overflow-hidden rounded-square border border-stroke-neutral bg-background-default">
                  {detailImage ? (
                    <Image
                      src={detailImage}
                      alt={`${app.name} preview`}
                      width={640}
                      height={400}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex aspect-[16/10] w-full items-center justify-center bg-linear-to-br ${gradient} text-4xl font-black text-white stretch-display font-sans-display`}
                    >
                      {monogram}
                    </div>
                  )}
                </div>

                <AppDeployButton app={app} location="detail" className="w-full" />

                <div className="flex flex-wrap gap-2 border-t border-stroke-neutral pt-5">
                  {app.stack.map((item) => (
                    <span
                      key={item.label}
                      className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1 text-xs text-foreground-neutral-weak"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {relatedApp ? (
        <section className="px-4 pb-20">
          <div className={APPS_DETAIL_SHELL}>
            <div className="max-w-[760px]">
              <h2 className="mb-6 mt-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                More apps
              </h2>
              <div className="max-w-[380px]">
                <AppCard app={relatedApp} />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
