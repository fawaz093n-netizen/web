import type { AppEntry } from "@/data/apps";

const fallbackAppIcons = [
  "fa-regular fa-headset",
  "fa-regular fa-rocket-launch",
  "fa-regular fa-radar",
  "fa-regular fa-satellite-dish",
  "fa-regular fa-clipboard-list-check",
  "fa-regular fa-notebook",
  "fa-regular fa-layer-group",
  "fa-regular fa-sliders-up",
  "fa-regular fa-bolt",
];

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function getFallbackAppIcon(seed: string) {
  return fallbackAppIcons[hashString(seed) % fallbackAppIcons.length];
}

export function getAppDisplayIcon(app: Pick<AppEntry, "slug" | "icon">) {
  return app.icon || getFallbackAppIcon(app.slug);
}

export function getAppCardImage(app: Pick<AppEntry, "logo" | "coverImage">) {
  return app.logo || app.coverImage || null;
}

export function getAppDetailImage(app: Pick<AppEntry, "coverImage" | "logo">) {
  return app.coverImage || app.logo || null;
}
