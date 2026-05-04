"use client";

import { AppCard } from "@/components/apps/app-card";
import type { AppEntry, AppKind } from "@/data/apps";
import { cn } from "@/lib/cn";
import { Button, Card, Input, badgeVariants } from "@prisma/eclipse";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { type ChangeEvent, startTransition, useDeferredValue, useEffect, useState } from "react";

type AppsDirectoryProps = {
  apps: AppEntry[];
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

export function AppsDirectory({
  apps,
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
    <div className="flex flex-col gap-10">
      <section id="directory" className="mx-auto w-full max-w-[1160px]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              size="2xl"
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const nextSearch = event.target.value;
                setSearch(nextSearch);
                updateUrl(pathname, router, kind, category, nextSearch);
                trackFilterChange(kind, category, nextSearch, filteredApps.length);
              }}
              placeholder="Search AI agents, support inboxes, waitlists, backends..."
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
                  badgeVariants({
                    color: category === option ? "ppg" : "neutral",
                    size: "lg",
                  }),
                  "cursor-pointer border border-transparent transition-colors hover:opacity-90",
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
