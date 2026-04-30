import { z } from "zod";

export const PRISMA_APP_MANIFEST_FILENAME = "prisma-app.json";

const nonEmptyString = z.string().trim().min(1);

const relativeAssetPathSchema = nonEmptyString.refine(
  (value) => !value.startsWith("http://") && !value.startsWith("https://"),
  {
    message: "Asset paths should be repo-relative, not absolute URLs.",
  },
);

const urlSchema = z.string().url();

export const prismaAppKindSchema = z.enum(["application", "template"]);
export type PrismaAppKind = z.infer<typeof prismaAppKindSchema>;

export const prismaAppListingStatusSchema = z.enum([
  "active",
  "beta",
  "coming-soon",
  "archived",
]);
export type PrismaAppListingStatus = z.infer<typeof prismaAppListingStatusSchema>;

export const prismaAppSourceTypeSchema = z.enum(["prisma/apps", "github-topic"]);
export type PrismaAppSourceType = z.infer<typeof prismaAppSourceTypeSchema>;

export const prismaAppServiceTypeSchema = z.enum(["web", "api", "worker", "cron"]);
export type PrismaAppServiceType = z.infer<typeof prismaAppServiceTypeSchema>;

export const prismaAppImageSchema = z.object({
  src: relativeAssetPathSchema,
  alt: nonEmptyString,
  caption: z.string().trim().optional(),
});
export type PrismaAppImage = z.infer<typeof prismaAppImageSchema>;

export const prismaAppLinkSchema = z.object({
  label: nonEmptyString,
  href: urlSchema,
  kind: z
    .enum(["repo", "demo", "docs", "website", "blog", "support", "other"])
    .default("other"),
});
export type PrismaAppLink = z.infer<typeof prismaAppLinkSchema>;

export const prismaAppStackItemSchema = z.object({
  label: nonEmptyString,
  icon: relativeAssetPathSchema,
  href: urlSchema.optional(),
});
export type PrismaAppStackItem = z.infer<typeof prismaAppStackItemSchema>;

export const prismaAppServiceSchema = z.object({
  name: nonEmptyString,
  type: prismaAppServiceTypeSchema,
  entry: nonEmptyString,
  description: nonEmptyString,
  schedule: z.string().trim().optional(),
});
export type PrismaAppService = z.infer<typeof prismaAppServiceSchema>;

export const prismaAppSectionSchema = z.object({
  title: nonEmptyString,
  body: nonEmptyString,
});
export type PrismaAppSection = z.infer<typeof prismaAppSectionSchema>;

export const prismaAppRepositorySchema = z.object({
  owner: nonEmptyString,
  name: nonEmptyString,
  branch: nonEmptyString.default("main"),
  path: z.string().trim().optional(),
  url: urlSchema,
});
export type PrismaAppRepository = z.infer<typeof prismaAppRepositorySchema>;

export const prismaAppDeploySchema = z.object({
  provider: z.literal("prisma-compute"),
  status: z.enum(["ready", "coming-soon"]).default("coming-soon"),
  buttonLabel: z.string().trim().optional(),
  configPath: z.string().trim().optional(),
  endpoint: urlSchema.optional(),
});
export type PrismaAppDeploy = z.infer<typeof prismaAppDeploySchema>;

export const prismaAppSeoSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  keywords: z.array(nonEmptyString).default([]),
  ogImage: relativeAssetPathSchema.optional(),
});
export type PrismaAppSeo = z.infer<typeof prismaAppSeoSchema>;

export const prismaAppSourceSchema = z.object({
  type: prismaAppSourceTypeSchema,
  topics: z.array(nonEmptyString).default([]),
});
export type PrismaAppSource = z.infer<typeof prismaAppSourceSchema>;

/**
 * `prisma-app.json` is the explicit source of truth for Prisma Apps listings.
 * The site should render from these declared fields rather than inferring
 * structure from a README or repository conventions.
 */
export const prismaAppManifestSchema = z.object({
  schemaVersion: z.literal(1),

  slug: nonEmptyString,
  name: nonEmptyString,
  kind: prismaAppKindSchema,
  status: prismaAppListingStatusSchema.default("active"),

  summary: nonEmptyString.max(180),
  description: nonEmptyString,
  category: nonEmptyString,
  icon: nonEmptyString,
  featured: z.boolean().default(false),

  audiences: z.array(nonEmptyString).min(1),
  tags: z.array(nonEmptyString).default([]),
  keywords: z.array(nonEmptyString).default([]),

  stack: z.array(prismaAppStackItemSchema).min(1),
  services: z.array(prismaAppServiceSchema).min(1),
  features: z.array(nonEmptyString).default([]),
  whyCompute: z.array(nonEmptyString).default([]),
  sections: z.array(prismaAppSectionSchema).min(1),

  media: z.object({
    logo: prismaAppImageSchema,
    cover: prismaAppImageSchema,
    screenshots: z.array(prismaAppImageSchema).default([]),
  }),

  links: z
    .object({
      repo: urlSchema.optional(),
      demo: urlSchema.optional(),
      docs: urlSchema.optional(),
      website: urlSchema.optional(),
      support: urlSchema.optional(),
      additional: z.array(prismaAppLinkSchema).default([]),
    })
    .default({ additional: [] }),

  repository: prismaAppRepositorySchema,
  source: prismaAppSourceSchema,
  deploy: prismaAppDeploySchema.optional(),
  seo: prismaAppSeoSchema.optional(),

  relatedSlugs: z.array(nonEmptyString).default([]),
});
export type PrismaAppManifest = z.infer<typeof prismaAppManifestSchema>;

export function parsePrismaAppManifest(input: unknown): PrismaAppManifest {
  return prismaAppManifestSchema.parse(input);
}
