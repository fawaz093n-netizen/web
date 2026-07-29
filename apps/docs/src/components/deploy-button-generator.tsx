"use client";
import { useMemo, useState } from "react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { buttonVariants } from "@prisma-docs/ui/components/button";
import { cn } from "@prisma-docs/ui/lib/cn";
import { withDocsBasePath } from "@/lib/urls";

const CONSOLE_TEMPLATES_URL = "https://console.prisma.io/templates";
const BUTTON_IMAGE_URL = "https://www.prisma.io/docs/img/deploy-button.svg";

const TEMPLATES = [
  { id: "hono", label: "Hono API" },
  { id: "nextjs", label: "Next.js" },
  { id: "tanstack-start", label: "TanStack Start" },
];

const CUSTOM_TEMPLATE = "__custom";

const TEMPLATE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [customTemplateId, setCustomTemplateId] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  const templateId =
    selectedTemplate === CUSTOM_TEMPLATE ? customTemplateId.trim() : selectedTemplate;
  const templateIdValid = TEMPLATE_ID_PATTERN.test(templateId) && templateId.length <= 64;

  const url = useMemo(() => {
    if (!templateIdValid) return null;
    const search = new URLSearchParams();
    if (utmSource.trim()) search.set("utm_source", utmSource.trim());
    if (utmCampaign.trim()) search.set("utm_campaign", utmCampaign.trim());
    const query = search.toString();
    return `${CONSOLE_TEMPLATES_URL}/${templateId}${query ? `?${query}` : ""}`;
  }, [templateIdValid, templateId, utmSource, utmCampaign]);

  return (
    <div className="not-prose flex flex-col gap-5 rounded-xl border p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Template</span>
          <select
            className={fieldClassName}
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
          >
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label} ({template.id})
              </option>
            ))}
            <option value={CUSTOM_TEMPLATE}>Custom template ID…</option>
          </select>
        </label>
        {selectedTemplate === CUSTOM_TEMPLATE && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Template ID</span>
            <input
              className={fieldClassName}
              placeholder="my-template"
              value={customTemplateId}
              onChange={(event) => setCustomTemplateId(event.target.value)}
            />
          </label>
        )}
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
          Enter a template ID using lowercase letters, numbers, and hyphens (for example{" "}
          <code>tanstack-start</code>) to generate your button.
        </p>
      )}
    </div>
  );
}
