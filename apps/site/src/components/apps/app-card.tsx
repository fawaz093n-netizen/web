"use client";

import { AppDeployButton } from "@/components/apps/app-deploy-button";
import type { AppEntry } from "@/data/apps";
import { getAppCardImage, getAppGradient, getAppMonogram } from "@/lib/app-visuals";
import { Badge, Button, Card } from "@prisma/eclipse";
import Image from "next/image";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import type { KeyboardEvent, MouseEvent } from "react";

function trackCardNavigation(app: AppEntry) {
  posthog.capture("site:apps_card_clicked", {
    app_slug: app.slug,
    app_name: app.name,
    app_kind: app.kind,
    app_category: app.category,
    source_type: app.source,
    destination: "detail_page",
  });
}

export function AppCard({ app }: { app: AppEntry }) {
  const router = useRouter();
  const visual = getAppCardImage(app);
  const monogram = getAppMonogram(app);
  const gradient = getAppGradient(app.slug);

  function navigateToDetail() {
    trackCardNavigation(app);
    router.push(`/apps/${app.slug}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    navigateToDetail();
  }

  function stopCardNavigation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={navigateToDetail}
      onKeyDown={handleKeyDown}
      className="group flex h-full cursor-pointer flex-col gap-5 overflow-hidden border border-stroke-neutral bg-background-neutral-weaker p-6 shadow-box-high transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-ppg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-square border border-stroke-neutral bg-background-default text-foreground-ppg">
            {visual ? (
              <Image
                src={visual}
                alt={`${app.name} logo`}
                width={48}
                height={48}
                className="size-full object-cover"
              />
            ) : (
              <div
                className={`flex size-full items-center justify-center bg-linear-to-br ${gradient} text-sm font-black text-white stretch-display font-sans-display`}
              >
                {monogram}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="m-0 text-xl font-black text-foreground-neutral stretch-display font-sans-display">
              {app.name}
            </h3>
          </div>
        </div>

        <Badge
          color={app.kind === "application" ? "ppg" : "warning"}
          label={app.kind === "application" ? "App" : "Template"}
          className="w-fit shrink-0"
        />
      </div>

      <p className="m-0 text-sm leading-6 text-foreground-neutral-weak">{app.summary}</p>

      <div className="mt-auto flex flex-col gap-4 border-t border-stroke-neutral pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {app.stack.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className="rounded-full border border-stroke-neutral bg-background-default px-3 py-1"
            >
              <span className="text-xs text-foreground-neutral-weak">{item.label}</span>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col gap-3 sm:flex-row"
          onClickCapture={stopCardNavigation}
        >
          <Button
            variant="default-stronger"
            size="lg"
            href={`/apps/${app.slug}`}
            className="justify-center gap-2"
            onClick={() => {
              trackCardNavigation(app);
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
