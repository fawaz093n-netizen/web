export type AppKind = "application" | "template";

export type AppSource = "prisma/apps" | "github-topic";

export type AppStackItem = {
  label: string;
  icon: string;
};

export type AppService = {
  name: string;
  type: "web" | "api" | "worker" | "cron";
  entry: string;
  description: string;
  schedule?: string;
};

export type AppSection = {
  title: string;
  body: string;
};

export type AppEntry = {
  slug: string;
  name: string;
  kind: AppKind;
  status: "seed-listing" | "starter";
  summary: string;
  description: string;
  icon: string;
  category: string;
  featured: boolean;
  source: AppSource;
  audiences: string[];
  tags: string[];
  keywords: string[];
  stack: AppStackItem[];
  features: string[];
  whyCompute: string[];
  services: AppService[];
  readmeSections: AppSection[];
  relatedSlugs: string[];
};

export const appDirectory: AppEntry[] = [
  {
    slug: "support-agent-inbox",
    name: "Support Agent Inbox",
    kind: "application",
    status: "seed-listing",
    summary:
      "A shared customer support inbox with an AI triage agent, human review queue, and long-running follow-up workflows.",
    description:
      "Support Agent Inbox is a deployable customer support application for Prisma Compute. It combines a shared inbox, agent-assisted drafting, async handoffs, and SLA-aware background jobs so a small team can run support without stitching together five vendors.",
    icon: "fa-regular fa-headset",
    category: "Customer support",
    featured: true,
    source: "prisma/apps",
    audiences: ["Support teams", "Founders", "Developer relations"],
    tags: ["AI agent", "Inbox", "Shared state", "Background jobs"],
    keywords: [
      "customer support app",
      "AI support inbox",
      "deploy support software on Prisma Compute",
      "shared inbox app",
    ],
    stack: [
      { label: "Next.js", icon: "/icons/technologies/nextjs.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Bun", icon: "/icons/technologies/bun.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
    ],
    features: [
      "Shared inbox with assignment, priority bands, and SLA tracking",
      "AI draft suggestions that can wait, act, and resume across long conversations",
      "Escalation rules and async follow-up jobs declared next to the service that owns them",
      "Conversation memory stored in Prisma Postgres for durable context",
    ],
    whyCompute: [
      "Agent loops can stay alive while they wait on customer replies or tool output.",
      "Background workers can summarize threads and draft replies without queue sprawl.",
      "The inbox UI, API, and worker can live in one repo with colocated data.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Support workspace, queue views, and response composer.",
      },
      {
        name: "api",
        type: "api",
        entry: "./src/api.ts",
        description: "Webhook intake, assignment logic, and conversation state.",
      },
      {
        name: "agent",
        type: "worker",
        entry: "./src/agent.ts",
        description: "Long-running agent orchestration for triage and draft generation.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Support Agent Inbox gives teams a real support workspace instead of a toy chatbot. Incoming conversations land in a queue, the agent drafts a response or tags the right owner, and a human can approve, edit, or take over at any point.",
      },
      {
        title: "Why teams deploy it",
        body: "It is useful for startups that want AI help without surrendering the full support workflow. You get queueing, ownership, follow-up memory, and human review in the same application.",
      },
      {
        title: "Why it belongs on Compute",
        body: "The worker is designed around long-lived execution. The agent can pause on slow tools, resume with context, and keep in-process state warm instead of rebuilding it on every request.",
      },
    ],
    relatedSlugs: ["meeting-memory", "feedback-radar", "webhook-observatory"],
  },
  {
    slug: "launchpad-waitlist",
    name: "Launchpad Waitlist",
    kind: "application",
    status: "seed-listing",
    summary:
      "A launch-ready waitlist app with referrals, onboarding email flows, and conversion reporting built in.",
    description:
      "Launchpad Waitlist is a growth application for shipping a product launch, private beta, or community rollout on Prisma Compute. It handles signups, referral scoring, email cohorts, and invite waves with a clean operator dashboard.",
    icon: "fa-regular fa-rocket-launch",
    category: "Growth",
    featured: true,
    source: "prisma/apps",
    audiences: ["Founders", "Growth teams", "Product marketers"],
    tags: ["Waitlist", "Referral loops", "Email", "Analytics"],
    keywords: [
      "waitlist app",
      "launch waitlist software",
      "referral app on Prisma Compute",
      "product launch application",
    ],
    stack: [
      { label: "Next.js", icon: "/icons/technologies/nextjs.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "React", icon: "/icons/technologies/react.svg" },
    ],
    features: [
      "Custom signup flow with invite codes, referral links, and waitlist tiers",
      "Scheduled release waves for private beta onboarding",
      "Conversion dashboard that shows which channels and cohorts perform best",
      "Admin tools for approving users, resending invites, and exporting cohorts",
    ],
    whyCompute: [
      "Cron-like invite waves live next to the product instead of in a separate scheduler.",
      "Background jobs can process referral rolls and batch email workflows without timeouts.",
      "The app and database stay colocated for fast cohort queries and operator dashboards.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Signup flow, landing page, and operator dashboard.",
      },
      {
        name: "worker",
        type: "cron",
        entry: "./src/jobs/invite-waves.ts",
        description: "Invite releases, cohort scoring, and digest generation.",
        schedule: "*/15 * * * *",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Launchpad Waitlist is the kind of app teams build for themselves before every release. It captures signups, scores referrals, controls invite waves, and gives operators a simple control room for launch day.",
      },
      {
        title: "What makes it production-shaped",
        body: "It is not just a landing page clone. It includes background processing, rate-aware email batches, and admin workflows that a real launch team needs after the first thousand signups arrive.",
      },
      {
        title: "Compute fit",
        body: "Scheduled jobs, durable retries, and a warm process model make it a strong match for Compute. The app can batch work without splitting orchestration across several services.",
      },
    ],
    relatedSlugs: ["feedback-radar", "nextjs-saas-kit", "ops-runbook"],
  },
  {
    slug: "feedback-radar",
    name: "Feedback Radar",
    kind: "application",
    status: "seed-listing",
    summary:
      "A public feedback board and release communication app with tagging, voting, triage, and shipping notes.",
    description:
      "Feedback Radar is a customer-facing roadmap application that helps teams collect requests, cluster similar ideas, and publish what shipped. It is designed to feel like a product surface, not just an internal spreadsheet with votes.",
    icon: "fa-regular fa-radar",
    category: "Product feedback",
    featured: true,
    source: "prisma/apps",
    audiences: ["Product teams", "DevRel teams", "Founders"],
    tags: ["Roadmap", "Voting", "Triage", "Release notes"],
    keywords: [
      "feedback board app",
      "public roadmap software",
      "feature request app",
      "deploy feedback portal on Prisma Compute",
    ],
    stack: [
      { label: "Next.js", icon: "/icons/technologies/nextjs.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "Tailwind", icon: "/icons/technologies/tailwind.svg" },
    ],
    features: [
      "Public board for ideas, votes, and follow-up comments",
      "Internal triage states with dedupe workflows and ownership",
      "Release communication blocks for shipped, planned, and exploring",
      "Tag-driven categorization for search, filters, and team routing",
    ],
    whyCompute: [
      "Background jobs can cluster similar ideas and send digest summaries.",
      "Public and internal surfaces can share one deployment model and database.",
      "Warm processes help with notification fan-out and operator tooling.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Public roadmap and internal triage workspace.",
      },
      {
        name: "notifier",
        type: "worker",
        entry: "./src/notifier.ts",
        description: "Digest generation, follower updates, and change notifications.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Feedback Radar helps teams turn loose requests into something actionable. Customers can submit ideas and follow progress, while internal teams get a triage workflow for sorting, merging, and responding.",
      },
      {
        title: "What makes it useful",
        body: "The public board is only half of the story. The operational value comes from internal ownership, release communication, and the ability to keep a request alive from intake to shipped.",
      },
      {
        title: "Compute fit",
        body: "Notification jobs and idea clustering are good examples of work that should run in the same project as the product UI. Compute keeps those processes nearby instead of pushing them into disconnected automation.",
      },
    ],
    relatedSlugs: ["support-agent-inbox", "launchpad-waitlist", "nextjs-saas-kit"],
  },
  {
    slug: "webhook-observatory",
    name: "Webhook Observatory",
    kind: "application",
    status: "seed-listing",
    summary:
      "An operator tool for capturing, replaying, annotating, and debugging incoming webhooks in real time.",
    description:
      "Webhook Observatory is a developer-facing application for teams that need to ingest events, inspect failures, replay payloads, and keep an audit trail. It is designed for long-lived services and jobs that react to outside systems.",
    icon: "fa-regular fa-satellite-dish",
    category: "Developer tools",
    featured: false,
    source: "github-topic",
    audiences: ["Platform teams", "Developer tooling teams", "Integrations teams"],
    tags: ["Webhooks", "Replay", "Observability", "Operators"],
    keywords: [
      "webhook debugging app",
      "webhook replay software",
      "developer tools on Prisma Compute",
      "event intake dashboard",
    ],
    stack: [
      { label: "Hono", icon: "/icons/technologies/hono.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "Bun", icon: "/icons/technologies/bun.svg" },
    ],
    features: [
      "Real-time event timeline with payload previews and status badges",
      "Replay tooling for failed deliveries and local debugging",
      "Retention controls and dead-letter queue style views",
      "Annotation layer for operators and support escalations",
    ],
    whyCompute: [
      "Webhook workers benefit from warm processes and persistent connection pools.",
      "Replay and retry flows can run as application code instead of pipeline glue.",
      "It is easy to colocate capture, storage, and operator UI in one codebase.",
    ],
    services: [
      {
        name: "ingest",
        type: "api",
        entry: "./src/ingest.ts",
        description: "Receives signed webhooks and stores normalized event envelopes.",
      },
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Operator timeline, replay controls, and incident notes.",
      },
      {
        name: "replayer",
        type: "worker",
        entry: "./src/replayer.ts",
        description: "Handles retries, delayed backoff, and queued replays.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Webhook Observatory is for teams who need more than a request bin. It captures payloads, tracks failures, and gives operators a safe replay surface when an integration misbehaves.",
      },
      {
        title: "Who uses it",
        body: "It fits internal platform teams, B2B SaaS products with many integrations, and any workflow where operators need to inspect outside events before retrying them.",
      },
      {
        title: "Compute fit",
        body: "Long-running event processors, retry logic, and stateful connections all map well to Compute. This is exactly the kind of app that suffers when chopped into short-lived functions.",
      },
    ],
    relatedSlugs: ["ops-runbook", "hono-api-worker", "support-agent-inbox"],
  },
  {
    slug: "ops-runbook",
    name: "Ops Runbook",
    kind: "application",
    status: "seed-listing",
    summary:
      "An internal operations app for approvals, CSV imports, background reconciliations, and lightweight human workflows.",
    description:
      "Ops Runbook is an internal tool that turns recurring operational work into a proper application. Teams can approve requests, process uploads, run reconciliations, and attach notes without living in spreadsheets and one-off scripts.",
    icon: "fa-regular fa-clipboard-list-check",
    category: "Internal tools",
    featured: false,
    source: "prisma/apps",
    audiences: ["Operations teams", "Finance teams", "Customer success teams"],
    tags: ["Internal tools", "Approvals", "Imports", "Back office"],
    keywords: [
      "internal tool app",
      "operations dashboard",
      "CSV processing app",
      "deploy internal tools on Prisma Compute",
    ],
    stack: [
      { label: "TanStack", icon: "/icons/technologies/tanstack.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "Bun", icon: "/icons/technologies/bun.svg" },
    ],
    features: [
      "Human approval queues with notes, state transitions, and audit history",
      "CSV and JSON import jobs that can run longer than a typical request window",
      "Scheduled reconciliations and operator digests",
      "Low-friction admin UI for small operations teams",
    ],
    whyCompute: [
      "Batch imports and reconciliations can run for minutes without architectural gymnastics.",
      "Internal tools often need both UI and worker logic in the same repository.",
      "Warm processes reduce overhead for repeat operator actions and polling views.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Operator dashboard, approvals, and import management.",
      },
      {
        name: "worker",
        type: "worker",
        entry: "./src/worker.ts",
        description: "Batch imports, reconciliations, and export generation.",
      },
      {
        name: "digest",
        type: "cron",
        entry: "./src/jobs/digest.ts",
        description: "Daily summaries for pending work and failed imports.",
        schedule: "0 8 * * *",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Ops Runbook is the kind of app teams build once a spreadsheet plus a script stops being enough. It creates a home for approvals, imports, retries, and audit trails that usually end up scattered across several tools.",
      },
      {
        title: "What makes it practical",
        body: "The value is not just the dashboard. It is the worker layer underneath it: batch processing, scheduled checks, and durable state changes that do not disappear when the browser tab closes.",
      },
      {
        title: "Compute fit",
        body: "Internal operations software needs long-running work more often than people admit. Compute lets that logic live next to the UI and database instead of being split into separate infrastructure decisions.",
      },
    ],
    relatedSlugs: ["launchpad-waitlist", "tanstack-ops-console", "webhook-observatory"],
  },
  {
    slug: "meeting-memory",
    name: "Meeting Memory",
    kind: "application",
    status: "seed-listing",
    summary:
      "An AI-assisted meeting workspace for notes, decisions, action items, and follow-up memory across long threads.",
    description:
      "Meeting Memory is a team knowledge application that turns calls and async updates into searchable decisions, tasks, and follow-ups. It is designed around long-running background work, structured summaries, and fast retrieval from Prisma Postgres.",
    icon: "fa-regular fa-notebook",
    category: "AI knowledge",
    featured: false,
    source: "github-topic",
    audiences: ["Product teams", "Founders", "Remote teams"],
    tags: ["AI notes", "Knowledge base", "Search", "Follow-up"],
    keywords: [
      "meeting notes app",
      "AI knowledge app",
      "team memory software",
      "deploy AI knowledge app on Prisma Compute",
    ],
    stack: [
      { label: "Next.js", icon: "/icons/technologies/nextjs.svg" },
      { label: "OpenAPI", icon: "/icons/technologies/open-api.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
    ],
    features: [
      "Session notes with structured decisions and owners",
      "Background summarization for long meeting recordings or transcripts",
      "Search across decisions, projects, and unresolved action items",
      "Follow-up reminders and status loops that stay tied to the original meeting",
    ],
    whyCompute: [
      "Long transcript processing fits warm workers better than request-sized functions.",
      "Search indexing and summary generation can run beside the app without cold starts.",
      "A colocated database keeps decision retrieval and project context fast.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Meeting archive, search, and follow-up workspace.",
      },
      {
        name: "processor",
        type: "worker",
        entry: "./src/processor.ts",
        description: "Transcript parsing, summaries, and reminder generation.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "Meeting Memory helps teams keep useful context after a call ends. It stores decisions, owners, and follow-up tasks in a way that stays easy to search instead of getting buried in chat or docs.",
      },
      {
        title: "What makes it sticky",
        body: "The app is useful because it carries context forward. A follow-up reminder, project note, or action item still knows which meeting created it and who is accountable.",
      },
      {
        title: "Compute fit",
        body: "Transcript parsing and summary generation are better served by long-lived workers and durable state. Compute reduces the amount of orchestration work needed to keep that pipeline simple.",
      },
    ],
    relatedSlugs: ["support-agent-inbox", "feedback-radar", "nextjs-saas-kit"],
  },
  {
    slug: "nextjs-saas-kit",
    name: "Next.js SaaS Kit",
    kind: "template",
    status: "starter",
    summary:
      "A full-stack SaaS starter with auth, billing shape, admin tooling, and production-minded defaults for Prisma Compute.",
    description:
      "Next.js SaaS Kit is a starter template for teams who want a serious starting point instead of a bare hello world. It includes tenant-aware data models, role-aware admin surfaces, and hooks for future one-click deploy on Prisma Compute.",
    icon: "fa-regular fa-layer-group",
    category: "SaaS",
    featured: false,
    source: "prisma/apps",
    audiences: ["Startup teams", "Agency teams", "Product engineers"],
    tags: ["Starter", "SaaS", "Next.js", "Auth"],
    keywords: [
      "nextjs saas starter",
      "prisma compute template",
      "deployable nextjs starter",
      "full stack app template",
    ],
    stack: [
      { label: "Next.js", icon: "/icons/technologies/nextjs.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "Tailwind", icon: "/icons/technologies/tailwind.svg" },
    ],
    features: [
      "Auth, workspace membership, and role boundaries",
      "Tenant-aware schema patterns and admin screens",
      "Project settings, audit history, and billing-ready data model",
      "Deployment-friendly structure for app, API, and jobs in one repo",
    ],
    whyCompute: [
      "It provides a serious starter for full-stack apps that need more than a static frontend.",
      "Background jobs for onboarding, digests, or sync work can be added in the same project.",
      "It is a good bridge between a marketing site and a product-shaped application.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Tenant app, dashboard, and settings surface.",
      },
      {
        name: "api",
        type: "api",
        entry: "./src/api.ts",
        description: "Auth callbacks, webhooks, and product APIs.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "This starter is for teams who want to begin with a shaped product skeleton. It includes common SaaS building blocks so you can spend time on your differentiation instead of rebuilding the same scaffolding.",
      },
      {
        title: "How it differs from a toy template",
        body: "The structure assumes real product concerns such as role boundaries, operational settings, and a database model that can grow with a product instead of collapsing under the first pricing plan.",
      },
      {
        title: "Compute fit",
        body: "It is a strong default for product teams who want web, API, and jobs in one place. When deploy automation is live, this is the kind of starter that should go from click to running app with minimal setup.",
      },
    ],
    relatedSlugs: ["launchpad-waitlist", "feedback-radar", "tanstack-ops-console"],
  },
  {
    slug: "tanstack-ops-console",
    name: "TanStack Ops Console",
    kind: "template",
    status: "starter",
    summary:
      "A TanStack Start starter for internal tools, operator queues, and admin workflows on Compute.",
    description:
      "TanStack Ops Console is a starter template for internal software. It gives teams a practical starting point for operator dashboards, approval queues, bulk actions, and background jobs on Prisma Compute.",
    icon: "fa-regular fa-sliders-up",
    category: "Internal tools",
    featured: false,
    source: "prisma/apps",
    audiences: ["Platform teams", "Ops teams", "Full-stack engineers"],
    tags: ["Starter", "TanStack", "Internal tools", "Queues"],
    keywords: [
      "tanstack internal tool starter",
      "ops console template",
      "internal tools on prisma compute",
      "tanstack start template",
    ],
    stack: [
      { label: "TanStack", icon: "/icons/technologies/tanstack.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
      { label: "Bun", icon: "/icons/technologies/bun.svg" },
    ],
    features: [
      "Queue views, table actions, and operator state changes",
      "Starter patterns for imports, exports, and reconciliation jobs",
      "Audit-friendly layouts for internal operations teams",
      "Clear separation between UI workflows and background services",
    ],
    whyCompute: [
      "Internal tools usually need both fast UI feedback and longer background tasks.",
      "Cron and worker patterns can be seeded from day one instead of bolted on later.",
      "Teams can keep admin workflows in a single repo with reviewable infra config.",
    ],
    services: [
      {
        name: "web",
        type: "web",
        entry: "./src/web.tsx",
        description: "Internal dashboard and queue management surface.",
      },
      {
        name: "worker",
        type: "worker",
        entry: "./src/worker.ts",
        description: "Imports, reconciliations, and background state transitions.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "TanStack Ops Console gives teams a shaped starting point for back-office tools. It is useful when you know the end state is an operator workflow, not just a public-facing product.",
      },
      {
        title: "Why it exists in the directory",
        body: "The directory is not only for finished applications. It also needs a narrow set of strong starters for teams who want to ship production-shaped tools quickly on Compute.",
      },
      {
        title: "Compute fit",
        body: "Operator tools often have hidden background complexity. This starter assumes that and gives teams a path to keep jobs, UI, and data modeled together from the beginning.",
      },
    ],
    relatedSlugs: ["ops-runbook", "nextjs-saas-kit", "hono-api-worker"],
  },
  {
    slug: "hono-api-worker",
    name: "Hono API + Worker",
    kind: "template",
    status: "starter",
    summary:
      "A slim starter for APIs, webhook intake, and background workers using Hono, Bun, and Prisma Compute.",
    description:
      "Hono API + Worker is a template for teams that want a lean, service-first project structure. It seeds an API, a worker, and a deployable layout that can grow into event-driven products on Prisma Compute.",
    icon: "fa-regular fa-bolt",
    category: "APIs",
    featured: false,
    source: "github-topic",
    audiences: ["Backend teams", "Integrations teams", "Indie hackers"],
    tags: ["Starter", "Hono", "API", "Workers"],
    keywords: [
      "hono starter template",
      "api worker starter",
      "bun api app on prisma compute",
      "event driven app template",
    ],
    stack: [
      { label: "Hono", icon: "/icons/technologies/hono.svg" },
      { label: "Bun", icon: "/icons/technologies/bun.svg" },
      { label: "TypeScript", icon: "/icons/technologies/ts.svg" },
      { label: "Prisma Postgres", icon: "/icons/technologies/prisma-postgres.svg" },
    ],
    features: [
      "Simple API service for webhooks and product endpoints",
      "Worker entrypoint for long-running jobs and retries",
      "Opinionated folder shape for services and shared domain logic",
      "Seeded deployment model that can plug into one-click Compute deploy later",
    ],
    whyCompute: [
      "It mirrors the exact project shape that Compute is good at: APIs plus durable work.",
      "Teams can start small and still have a place for workers on day one.",
      "Warm service processes fit event-heavy products better than short-lived functions.",
    ],
    services: [
      {
        name: "api",
        type: "api",
        entry: "./src/api.ts",
        description: "Public endpoints, webhooks, and health checks.",
      },
      {
        name: "worker",
        type: "worker",
        entry: "./src/worker.ts",
        description: "Retries, long-running tasks, and async processing.",
      },
    ],
    readmeSections: [
      {
        title: "What it does",
        body: "This starter is for service-first projects. If your application is more API, events, and background work than marketing site, this gives you a clean default without dragging in unnecessary layers.",
      },
      {
        title: "When to use it",
        body: "Use it when you are building integrations, event consumers, or backend-heavy products that still need a small operator surface and deploy-friendly structure.",
      },
      {
        title: "Compute fit",
        body: "The template is shaped around the parts of Compute that feel different from a serverless host: warm workers, no cold starts, and a durable place for background logic.",
      },
    ],
    relatedSlugs: ["webhook-observatory", "tanstack-ops-console", "support-agent-inbox"],
  },
];

export const appKinds: AppKind[] = ["application", "template"];

export const appCategories = Array.from(new Set(appDirectory.map((app) => app.category))).sort(
  (left, right) => left.localeCompare(right),
);

export function getAppBySlug(slug: string) {
  return appDirectory.find((app) => app.slug === slug);
}

export function getRelatedApps(app: AppEntry) {
  return app.relatedSlugs
    .map((slug) => getAppBySlug(slug))
    .filter((entry): entry is AppEntry => Boolean(entry));
}

export function getFeaturedApps() {
  return appDirectory.filter((app) => app.featured);
}
