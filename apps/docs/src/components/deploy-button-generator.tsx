"use client";
import { useMemo, useState } from "react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

const CONSOLE_CLONE_URL = "https://console.prisma.io/new/clone";
const BUTTON_IMAGE_URL = "https://www.prisma.io/docs/img/deploy-button.svg";

const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const PROJECT_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

function parseRepositoryUrl(raw: string): { owner: string; repo: string } | null {
  const value = raw.trim();
  if (value.length === 0 || value.length > 300) return null;
  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port) return null;
  if (url.username || url.password || url.search || url.hash) return null;
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;
  const owner = segments[0];
  let repo = segments[1];
  if (repo.endsWith(".git")) repo = repo.slice(0, -4);
  if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo)) return null;
  if (repo === "." || repo === "..") return null;
  return { owner, repo };
}

function CopyButton({ value }: { value: string }) {
  const [checked, onClick] = useCopyButton(() => navigator.clipboard.writeText(value));

  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      className={cn(
        buttonVariants({ color: "secondary", size: "sm", className: "shrink-0 gap-2" }),
      )}
      onClick={onClick}
    >
      {checked ? <i className="fa-regular fa-check" /> : <i className="fa-regular fa-copy" />}
      Copy
    </button>
  );
}

function Snippet({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fd-muted-foreground">{label}</span>
      <div className="flex items-start gap-2">
        <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border bg-fd-secondary/50 p-3 text-xs leading-relaxed">
          <code>{value}</code>
        </pre>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

const fieldClassName =
  "w-full rounded-lg border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none focus-visible:ring-2 focus-visible:ring-fd-ring";

export function DeployButtonGenerator() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  const parsed = useMemo(() => parseRepositoryUrl(repositoryUrl), [repositoryUrl]);
  const projectNameValid =
    projectName.trim() === "" || PROJECT_NAME_PATTERN.test(projectName.trim());

  const url = useMemo(() => {
    if (!parsed || !projectNameValid) return null;
    const search = new URLSearchParams();
    search.set("repository-url", `https://github.com/${parsed.owner}/${parsed.repo}`);
    if (projectName.trim()) search.set("project-name", projectName.trim());
    if (utmSource.trim()) search.set("utm_source", utmSource.trim());
    if (utmCampaign.trim()) search.set("utm_campaign", utmCampaign.trim());
    return `${CONSOLE_CLONE_URL}?${search.toString()}`;
  }, [parsed, projectNameValid, projectName, utmSource, utmCampaign]);

  return (
    <div className="not-prose flex flex-col gap-5 rounded-xl border p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Repository URL</span>
          <input
            className={fieldClassName}
            placeholder="https://github.com/owner/repo"
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
          />
          {repositoryUrl.trim() !== "" && !parsed ? (
            <span className="text-xs text-fd-muted-foreground">
              Enter a public GitHub repository URL like https://github.com/owner/repo.
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Project name <span className="font-normal text-fd-muted-foreground">(optional)</span>
          </span>
          <input
            className={fieldClassName}
            placeholder="my-app"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Source <span className="font-normal text-fd-muted-foreground">(optional)</span>
          </span>
          <input
            className={fieldClassName}
            placeholder="github-readme"
            value={utmSource}
            onChange={(event) => setUtmSource(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Campaign <span className="font-normal text-fd-muted-foreground">(optional)</span>
          </span>
          <input
            className={fieldClassName}
            placeholder="launch-2026"
            value={utmCampaign}
            onChange={(event) => setUtmCampaign(event.target.value)}
          />
        </label>
      </div>

      {url ? (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
            <span className="text-sm text-fd-muted-foreground">Preview:</span>
            <a href={url} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withDocsBasePath("/img/deploy-button.svg")}
                alt="Deploy with Prisma"
                width={172}
                height={36}
              />
            </a>
          </div>
          <Snippet label="URL" value={url} />
          <Snippet
            label="Markdown"
            value={`[![Deploy with Prisma](${BUTTON_IMAGE_URL})](${url})`}
          />
          <Snippet
            label="HTML"
            value={`<a href="${url}"><img src="${BUTTON_IMAGE_URL}" alt="Deploy with Prisma" width="172" height="36" /></a>`}
          />
        </>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Enter your repository's GitHub URL to generate the button. The repository must be public
          and contain a <code>prisma.compute.json</code> file at its root.
        </p>
      )}
    </div>
  );
}
