"use client";

import { AppCard } from "@/components/apps/app-card";
import type { AppEntry, AppKind } from "@/data/apps";
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@prisma/eclipse";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { type ChangeEvent, startTransition, useDeferredValue, useEffect, useState } from "react";

type AppsDirectoryProps = {
  apps: AppEntry[];
  initialCategory: string;
  initialKind: "all" | AppKind;
  initialSearch: string;
  initialTechnology: string;
};

function trackFilterChange(
  kind: "all" | AppKind,
  category: string,
  technology: string,
  search: string,
  resultCount: number,
) {
  posthog.capture("site:apps_filter_changed", {
    app_kind: kind,
    category,
    technology,
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
  technology: string,
  search: string,
) {
  const params = new URLSearchParams();

  if (kind !== "all") params.set("kind", kind);
  if (category !== "all") params.set("category", category);
  if (technology !== "all") params.set("stack", technology);
  if (search.trim()) params.set("q", search.trim());

  const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

  startTransition(() => {
    router.replace(nextUrl, { scroll: false });
  });
}

function matchesSearch(app: AppEntry, normalizedSearch: string) {
  if (!normalizedSearch) return true;

  const haystack = [
    app.name,
    app.summary,
    app.description,
    app.category,
    ...app.tags,
    ...app.keywords,
    ...app.stack.map((item) => item.label),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedSearch);
}

export function AppsDirectory({
  apps,
  initialCategory,
  initialKind,
  initialSearch,
  initialTechnology,
}: AppsDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [kind, setKind] = useState<"all" | AppKind>(initialKind);
  const [category, setCategory] = useState(initialCategory);
  const [technology, setTechnology] = useState(initialTechnology);
  const [search, setSearch] = useState(initialSearch);

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const categories = [
    "all",
    ...Array.from(new Set(apps.map((app) => app.category))).sort((left, right) =>
      left.localeCompare(right),
    ),
  ];

  const technologies = [
    "all",
    ...Array.from(new Set(apps.flatMap((app) => app.stack.map((item) => item.label)))).sort(
      (left, right) => left.localeCompare(right),
    ),
  ];

  const filteredApps = apps.filter((app) => {
    if (kind !== "all" && app.kind !== kind) return false;
    if (category !== "all" && app.category !== category) return false;
    if (technology !== "all" && !app.stack.some((item) => item.label === technology)) return false;

    return matchesSearch(app, normalizedSearch);
  });

  useEffect(() => {
    posthog.capture("site:apps_directory_viewed", {
      app_kind: initialKind,
      category: initialCategory,
      technology: initialTechnology,
      has_search: initialSearch.trim().length > 0,
      source: searchParams.get("utm_source") ?? null,
    });
  }, [initialCategory, initialKind, initialSearch, initialTechnology, searchParams]);

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
                updateUrl(pathname, router, kind, category, technology, nextSearch);
                trackFilterChange(kind, category, technology, nextSearch, filteredApps.length);
              }}
              placeholder="Search one-click apps, AI agents, support inboxes, internal tools..."
              className="w-full"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default-stronger" size="2xl" className="justify-center gap-2">
                  <span>Filters</span>
                  <i className="fa-regular fa-sliders" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[280px]">
                <DropdownMenuLabel>Listing type</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={kind}
                  onValueChange={(nextKind) => {
                    const resolvedKind = nextKind as "all" | AppKind;
                    setKind(resolvedKind);
                    updateUrl(pathname, router, resolvedKind, category, technology, search);
                    const nextResults = apps.filter((app) => {
                      if (resolvedKind !== "all" && app.kind !== resolvedKind) return false;
                      if (category !== "all" && app.category !== category) return false;
                      if (
                        technology !== "all" &&
                        !app.stack.some((item) => item.label === technology)
                      ) {
                        return false;
                      }

                      return matchesSearch(app, normalizedSearch);
                    }).length;

                    trackFilterChange(resolvedKind, category, technology, search, nextResults);
                  }}
                >
                  <DropdownMenuRadioItem value="all">All listings</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="application">Apps</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="template">Templates</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={category}
                  onValueChange={(option) => {
                    setCategory(option);
                    updateUrl(pathname, router, kind, option, technology, search);
                    const nextResults = apps.filter((app) => {
                      if (kind !== "all" && app.kind !== kind) return false;
                      if (option !== "all" && app.category !== option) return false;
                      if (
                        technology !== "all" &&
                        !app.stack.some((item) => item.label === technology)
                      ) {
                        return false;
                      }

                      return matchesSearch(app, normalizedSearch);
                    }).length;

                    trackFilterChange(kind, option, technology, search, nextResults);
                  }}
                >
                  {categories.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {option === "all" ? "All categories" : option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Technology</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={technology}
                  onValueChange={(option) => {
                    setTechnology(option);
                    updateUrl(pathname, router, kind, category, option, search);
                    const nextResults = apps.filter((app) => {
                      if (kind !== "all" && app.kind !== kind) return false;
                      if (category !== "all" && app.category !== category) return false;
                      if (option !== "all" && !app.stack.some((item) => item.label === option)) {
                        return false;
                      }

                      return matchesSearch(app, normalizedSearch);
                    }).length;

                    trackFilterChange(kind, category, option, search, nextResults);
                  }}
                >
                  {technologies.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                      {option === "all" ? "All technologies" : option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
                Try clearing the search or switching back to the broader category and technology
                filters.
              </p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
