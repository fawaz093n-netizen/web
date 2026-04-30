"use client";

import { Button, Input } from "@prisma/eclipse";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, startTransition, useState } from "react";

type AppsHeroSearchProps = {
  initialSearch: string;
};

const quickLinks = [
  { label: "AI agents", query: "AI agent" },
  { label: "Internal tools", query: "internal tool" },
  { label: "Support", query: "support" },
  { label: "Waitlists", query: "waitlist" },
  { label: "Templates", kind: "template" as const },
];

export function AppsHeroSearch({ initialSearch }: AppsHeroSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);

  function goToDirectory({
    nextSearch,
    kind,
  }: {
    nextSearch?: string;
    kind?: "application" | "template";
  }) {
    const params = new URLSearchParams();

    if (nextSearch?.trim()) params.set("q", nextSearch.trim());
    if (kind) params.set("kind", kind);

    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}#directory` : `${pathname}#directory`;

    startTransition(() => {
      router.push(nextUrl, { scroll: true });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToDirectory({ nextSearch: search });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search AI agents, backends, waitlists, support tools..."
          className="w-full"
          aria-label="Search Prisma Apps"
        />
        <Button type="submit" variant="ppg" size="xl" className="justify-center sm:min-w-[140px]">
          <span>Search</span>
          <i className="fa-regular fa-arrow-right" aria-hidden />
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {quickLinks.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => {
              setSearch(link.query ?? "");
              goToDirectory({ nextSearch: link.query, kind: link.kind });
            }}
            className="cursor-pointer rounded-full border border-stroke-neutral bg-background-neutral-weaker px-3 py-1.5 text-xs uppercase tracking-[1.3px] text-foreground-neutral-weak transition-colors duration-200 hover:border-stroke-ppg hover:text-foreground-neutral"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
