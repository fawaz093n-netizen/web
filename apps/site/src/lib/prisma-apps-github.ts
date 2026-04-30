import { PRISMA_APP_MANIFEST_FILENAME } from "@/lib/prisma-app-manifest";

export { PRISMA_APP_MANIFEST_FILENAME };

export type GitHubContentEntry = {
  type: "file" | "dir";
  name: string;
  path: string;
  sha: string;
  download_url: string | null;
};

export type GitHubFileResponse = {
  type: "file";
  name: string;
  path: string;
  content: string;
  encoding: string;
  sha: string;
  download_url: string | null;
};

export type PrismaAppsRepoConfig = {
  owner: string;
  repo: string;
  branch: string;
  basePath: string;
  token?: string;
};

export function getPrismaAppsRepoConfig(): PrismaAppsRepoConfig {
  return {
    owner: process.env.PRISMA_APPS_GITHUB_OWNER?.trim() || "prisma",
    repo: process.env.PRISMA_APPS_GITHUB_REPO?.trim() || "apps",
    branch: process.env.PRISMA_APPS_GITHUB_BRANCH?.trim() || "main",
    basePath: process.env.PRISMA_APPS_GITHUB_BASE_PATH?.trim() || "",
    token: process.env.PRISMA_APPS_GITHUB_TOKEN?.trim() || undefined,
  };
}

export function joinRepoPath(...parts: Array<string | undefined>) {
  return parts
    .filter(Boolean)
    .map((part) => part!.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
}

export async function githubApiFetch<T>(path: string) {
  const config = getPrismaAppsRepoConfig();
  const url = new URL(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`,
  );
  url.searchParams.set("ref", config.branch);

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    },
    next: {
      revalidate: 300,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub contents request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function listDirectory(path: string) {
  const response = await githubApiFetch<GitHubContentEntry[] | GitHubFileResponse>(path);
  return Array.isArray(response) ? response : null;
}

export async function getFile(path: string) {
  const response = await githubApiFetch<GitHubFileResponse>(path);
  return response && !Array.isArray(response) && response.type === "file" ? response : null;
}

export function decodeGitHubFile(file: GitHubFileResponse) {
  if (file.encoding !== "base64") {
    throw new Error(`Unsupported GitHub file encoding: ${file.encoding}`);
  }

  return Buffer.from(file.content, "base64").toString("utf8");
}

export function getPrismaAppsAssetUrl(path: string) {
  return `/api/apps/assets?path=${encodeURIComponent(path)}`;
}
