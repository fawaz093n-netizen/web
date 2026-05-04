"use client";

import type { AppEntry } from "@/data/apps";
import { cn } from "@/lib/cn";
import { Button } from "@prisma/eclipse";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

type AppDeployButtonProps = {
  app: AppEntry;
  location: "directory" | "detail";
  className?: string;
};

export function AppDetailTracker({ app }: { app: AppEntry }) {
  useEffect(() => {
    posthog.capture("site:app_detail_viewed", {
      app_slug: app.slug,
      app_name: app.name,
      app_kind: app.kind,
      app_category: app.category,
      listing_status: app.status,
      source_type: app.source,
    });
  }, [app.category, app.kind, app.name, app.slug, app.source, app.status]);

  return null;
}

export function AppDeployButton({ app, location, className }: AppDeployButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setMessage(null);

    posthog.capture("site:apps_deploy_clicked", {
      app_slug: app.slug,
      app_name: app.name,
      app_kind: app.kind,
      app_category: app.category,
      listing_status: app.status,
      source_type: app.source,
      location,
    });

    try {
      const response = await fetch("/api/apps/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: app.slug }),
      });

      const payload = (await response.json().catch(() => null)) as {
        status?: string;
        message?: string;
        url?: string;
      } | null;

      posthog.capture("site:apps_deploy_result", {
        app_slug: app.slug,
        app_name: app.name,
        app_kind: app.kind,
        app_category: app.category,
        listing_status: app.status,
        source_type: app.source,
        location,
        http_status: response.status,
        integration_status: payload?.status ?? "unknown",
      });

      if (payload?.url) {
        window.location.assign(payload.url);
        return;
      }

      setMessage(
        payload?.message ??
          "Compute deploy is not wired yet. This button is ready for the API hook-up.",
      );
    } catch {
      posthog.capture("site:apps_deploy_result", {
        app_slug: app.slug,
        app_name: app.name,
        app_kind: app.kind,
        app_category: app.category,
        listing_status: app.status,
        source_type: app.source,
        location,
        http_status: 0,
        integration_status: "network_error",
      });

      setMessage(
        "The deploy handshake is not available yet. Once the Compute API is live, this button will kick off deployment directly.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        variant="ppg"
        size="lg"
        onClick={handleClick}
        className={cn("justify-center gap-2", location === "detail" && "w-full")}
      >
        <i
          className={cn("fa-regular", isLoading ? "fa-loader animate-spin" : "fa-cloud-arrow-up")}
          aria-hidden
        />
        <span>{isLoading ? "Preparing deploy..." : "Deploy on Compute"}</span>
      </Button>
      {message ? <p className="m-0 text-sm text-foreground-neutral-weak">{message}</p> : null}
    </div>
  );
}
