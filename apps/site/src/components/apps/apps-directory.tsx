"use client";

import { AppDeployButton } from "@/components/apps/app-deploy-button";
import type { AppEntry, AppKind } from "@/data/apps";
import { cn } from "@/lib/cn";
import { Badge, Button, Card, Input } from "@prisma/eclipse";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { type ChangeEvent, startTransition, useDeferredValue, useEffect, useState } from "react";

type AppsDirectoryProps = {
  apps: AppEntry[];
  featuredApps: AppEntry[];
  initialCategory: string;
  initialKind: "all" | AppKind;
  initialSearch: string;
};

const kindOptions: Array<{ label: string; value: "all" | AppKind }> = [
  { label: "Apps", value: "application" },
  { label: "Templates", value: "template" },
  { label: "All", value: "all" },
];

function trackFilterChange(
  kind: "all" | AppKind,
  category: string,
  search: string,
  resultCount: number,
) {
  posthog.capture("site:apps_filter_changed", {
    app_kind: kind,
    category,
    has_search: search.trim().length > 0,
    search_length: search.trim().length,
    result_count: resultCount,
  });
}

function updateUrl(
  pathname: string,
  router: ReturnType<typeof useRouter>,
  kind: "all" | AppKind,
  category: string,
  search: string,
) {
  const params = new URLSearchParams();

  if (kind !== "all") params.set("kind", kind);
  if (category !== "all") params.set("category", category);
  if (search.trim()) params.set("q", search.trim());

  const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

  startTransition(() => {
    router.replace(nextUrl, { scroll: false });
  });
}

function AppCard({ app, featured = false }: { app: AppEntry; featured?: boolean }) {
  return (
    <Card
      className={cn(
        "group flex h-full flex-col gap-5 overflow-hidden border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high transition-transform duration-200 hover:-translate-y-0.5",
        featured &&
          "bg-[linear-gradient(180deg,var(--color-background-ppg)_0%,var(--color-background-neutral-weaker)_100%)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-square border border-stroke-neutral bg-background-default text-foreground-ppg">
            <i className={cn(app.icon, "text-lg")} aria-hidden />
          </div>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
              {app.category}
            </p>
            <h3 className="m-0 text-xl font-black text-foreground-neutral stretch-display font-sans-display">
              {app.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge
            color={app.kind === "application" ? "ppg" : "warning"}
            label={app.kind === "application" ? "App" : "Template"}
            className="w-fit"
          />
          <Badge
            color="neutral"
            label={app.status === "starter" ? "Starter" : "Seed listing"}
            className="w-fit"
          />
        </div>
      </div>

      <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">{app.summary}</p>

      <div className="flex flex-wrap gap-2">
        {app.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1 text-xs text-foreground-neutral-weak"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {app.features.slice(0, 4).map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-2 text-sm text-foreground-neutral-weak"
          >
            <i className="fa-regular fa-check text-foreground-ppg mt-1" aria-hidden />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-stroke-neutral pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="default-stronger"
            size="lg"
            href={`/apps/${app.slug}`}
            className="justify-center"
            onClick={() => {
              posthog.capture("site:apps_card_clicked", {
                app_slug: app.slug,
                app_name: app.name,
                app_kind: app.kind,
                app_category: app.category,
                source_type: app.source,
                destination: "detail_page",
              });
            }}
          >
            <span>View app</span>
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </Button>
          <AppDeployButton app={app} location="directory" className="flex-1" />
        </div>
      </div>
    </Card>
  );
}

export function AppsDirectory({
  apps,
  featuredApps,
  initialCategory,
  initialKind,
  initialSearch,
}: AppsDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [kind, setKind] = useState<"all" | AppKind>(initialKind);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const categories = [
    "all",
    ...Array.from(new Set(apps.map((app) => app.category))).sort((left, right) =>
      left.localeCompare(right),
    ),
  ];

  const filteredApps = apps.filter((app) => {
    if (kind !== "all" && app.kind !== kind) return false;
    if (category !== "all" && app.category !== category) return false;
    if (!normalizedSearch) return true;

    const haystack = [
      app.name,
      app.summary,
      app.description,
      app.category,
      ...app.tags,
      ...app.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  useEffect(() => {
    posthog.capture("site:apps_directory_viewed", {
      app_kind: initialKind,
      category: initialCategory,
      has_search: initialSearch.trim().length > 0,
      source: searchParams.get("utm_source") ?? null,
    });
  }, [initialCategory, initialKind, initialSearch, searchParams]);

  return (
    <div className="flex flex-col gap-12">
      <section className="mx-auto grid w-full max-w-[1080px] gap-4 xl:grid-cols-2">
        {featuredApps.map((app) => (
          <AppCard key={app.slug} app={app} featured />
        ))}
      </section>

      <section
        id="directory"
        className="mx-auto w-full max-w-[1160px] rounded-[28px] border border-stroke-neutral bg-background-neutral-weaker p-5 shadow-box-high sm:p-8"
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-ppg stretch-display font-sans-display">
                Browse the directory
              </p>
              <h2 className="m-0 text-3xl font-black text-foreground-neutral stretch-display font-sans-display">
                Find full apps first. Filter down to starters when you need a head start.
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">
                The main view is intentionally biased toward end-to-end products. Templates stay
                available, but they are a filter, not the whole story.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const nextSearch = event.target.value;
                setSearch(nextSearch);
                updateUrl(pathname, router, kind, category, nextSearch);
                trackFilterChange(kind, category, nextSearch, filteredApps.length);
              }}
              placeholder="Search AI agents, internal tools, waitlists, webhook apps..."
              className="w-full"
            />

            <div className="flex flex-wrap gap-2">
              {kindOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={kind === option.value ? "ppg" : "default-stronger"}
                  size="lg"
                  onClick={() => {
                    setKind(option.value);
                    updateUrl(pathname, router, option.value, category, search);
                    const nextResults = apps.filter((app) => {
                      if (option.value !== "all" && app.kind !== option.value) return false;
                      if (category !== "all" && app.category !== category) return false;

                      if (!normalizedSearch) return true;

                      const haystack = [
                        app.name,
                        app.summary,
                        app.description,
                        app.category,
                        ...app.tags,
                        ...app.keywords,
                      ]
                        .join(" ")
                        .toLowerCase();

                      return haystack.includes(normalizedSearch);
                    }).length;

                    trackFilterChange(option.value, category, search, nextResults);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setCategory(option);
                  updateUrl(pathname, router, kind, option, search);
                  const nextResults = apps.filter((app) => {
                    if (kind !== "all" && app.kind !== kind) return false;
                    if (option !== "all" && app.category !== option) return false;

                    if (!normalizedSearch) return true;

                    const haystack = [
                      app.name,
                      app.summary,
                      app.description,
                      app.category,
                      ...app.tags,
                      ...app.keywords,
                    ]
                      .join(" ")
                      .toLowerCase();

                    return haystack.includes(normalizedSearch);
                  }).length;

                  trackFilterChange(kind, option, search, nextResults);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm transition-colors",
                  category === option
                    ? "border-stroke-ppg bg-background-ppg text-foreground-ppg-reverse-strong"
                    : "border-stroke-neutral bg-background-default text-foreground-neutral-weak hover:border-stroke-neutral-strong",
                )}
              >
                {option === "all" ? "All categories" : option}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="m-0 text-sm text-foreground-neutral-weak">
              Showing{" "}
              <span className="font-semibold text-foreground-neutral">{filteredApps.length}</span>{" "}
              of {apps.length} listings.
            </p>
            <Link
              href="#add-your-app"
              className="text-sm font-medium text-foreground-ppg hover:text-foreground-ppg-reverse-strong"
            >
              Add your app
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>

          {filteredApps.length === 0 ? (
            <Card className="border-dashed border-stroke-neutral bg-background-default p-6">
              <h3 className="m-0 text-lg font-bold text-foreground-neutral stretch-display font-sans-display">
                No apps matched that filter set.
              </h3>
              <p className="mb-0 mt-2 text-sm text-foreground-neutral-weak">
                Try clearing the search or switching back to the full app view.
              </p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
