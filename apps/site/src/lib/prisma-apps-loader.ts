import { cache } from "react";

import {
  appDirectory as seededAppDirectory,
  type AppEntry,
  type AppKind,
} from "@/data/apps";
import {
  PRISMA_APP_MANIFEST_FILENAME,
  decodeGitHubFile,
  getFile,
  getPrismaAppsAssetUrl,
  getPrismaAppsRepoConfig,
  joinRepoPath,
  listDirectory,
} from "@/lib/prisma-apps-github";
import { getFallbackAppIcon } from "@/lib/app-visuals";
import { parsePrismaAppManifest, type PrismaAppManifest } from "@/lib/prisma-app-manifest";

function normalizeManifestToAppEntry(
  manifest: PrismaAppManifest,
  manifestDirectoryPath: string,
): AppEntry {
  const manifestRoot = manifestDirectoryPath;

  const assetUrl = (assetPath: string) =>
    getPrismaAppsAssetUrl(joinRepoPath(manifestRoot, assetPath));

  const sourceType =
    manifest.source.type === "github-topic" ? ("github-topic" as const) : ("prisma/apps" as const);

  const icon =
    manifest.icon && manifest.icon.startsWith("fa-")
      ? manifest.icon
      : getFallbackAppIcon(manifest.slug);

  return {
    slug: manifest.slug,
    name: manifest.name,
    kind: manifest.kind as AppKind,
    status: manifest.status,
    summary: manifest.summary,
    description: manifest.description,
    icon,
    category: manifest.category,
    featured: manifest.featured,
    source: sourceType,
    audiences: manifest.audiences,
    tags: manifest.tags,
    keywords: manifest.seo?.keywords?.length ? manifest.seo.keywords : manifest.keywords,
    stack: manifest.stack.map((item) => ({
      label: item.label,
      icon: assetUrl(item.icon),
    })),
    features: manifest.features,
    whyCompute: manifest.whyCompute,
    services: manifest.services,
    readmeSections: manifest.sections,
    relatedSlugs: manifest.relatedSlugs,
    logo: assetUrl(manifest.media.logo.src),
    coverImage: assetUrl(manifest.media.cover.src),
    screenshots: manifest.media.screenshots.map((item) => ({
      src: assetUrl(item.src),
      alt: item.alt,
      caption: item.caption,
    })),
    repositoryUrl: manifest.links.repo || manifest.repository.url,
    deploy: manifest.deploy
      ? {
          status: manifest.deploy.status,
          buttonLabel: manifest.deploy.buttonLabel,
        }
      : undefined,
  };
}

async function loadCuratedAppsFromGitHub() {
  const config = getPrismaAppsRepoConfig();
  const rootEntries = await listDirectory(config.basePath);

  if (!rootEntries || rootEntries.length === 0) {
    return [];
  }

  const manifests = await Promise.all(
    rootEntries
      .filter((entry) => entry.type === "dir")
      .map(async (entry) => {
        const manifestPath = joinRepoPath(entry.path, PRISMA_APP_MANIFEST_FILENAME);
        const file = await getFile(manifestPath);

        if (!file) {
          return null;
        }

        const content = decodeGitHubFile(file);
        const manifest = parsePrismaAppManifest(JSON.parse(content));
        return normalizeManifestToAppEntry(manifest, entry.path);
      }),
  );

  return manifests
    .filter((entry): entry is AppEntry => Boolean(entry))
    .sort((left, right) => left.name.localeCompare(right.name));
}

const loadAppDirectoryCached = cache(async () => {
  try {
    const curatedApps = await loadCuratedAppsFromGitHub();

    if (curatedApps.length > 0) {
      const seededBySlug = new Map(seededAppDirectory.map((app) => [app.slug, app]));

      for (const app of curatedApps) {
        seededBySlug.set(app.slug, app);
      }

      return Array.from(seededBySlug.values()).sort((left, right) => {
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      });
    }
  } catch (error) {
    console.error("Failed to load curated Prisma Apps from GitHub", error);
  }

  return seededAppDirectory;
});

export async function getAppDirectory() {
  return loadAppDirectoryCached();
}

export async function getAppBySlug(slug: string) {
  const apps = await getAppDirectory();
  return apps.find((app) => app.slug === slug);
}

export async function getRelatedApps(app: AppEntry) {
  const apps = await getAppDirectory();
  return app.relatedSlugs
    .map((slug) => apps.find((entry) => entry.slug === slug))
    .filter((entry): entry is AppEntry => Boolean(entry));
}
