import { defineComputeConfig } from "@prisma/compute-sdk/config";

const computeEnv = {
  vars: {
    PRISMA_COMPUTE_DEPLOY: "true",
  },
};

const blogComputeEnv = {
  vars: {
    ...computeEnv.vars,
    NEXT_BLOG_ASSET_ORIGIN: "https://www.prisma.io",
  },
};

export default defineComputeConfig({
  apps: {
    site: {
      name: "site",
      root: "apps/site",
      framework: "nextjs",
      httpPort: 3000,
      env: computeEnv,
      build: {
        command: "PRISMA_COMPUTE_DEPLOY=true pnpm turbo run build --filter=site...",
        outputDirectory: ".next/standalone",
      },
    },
    blog: {
      name: "blog",
      root: "apps/blog",
      framework: "bun",
      entry: ".compute/server.ts",
      httpPort: 3000,
      env: blogComputeEnv,
      build: {
        command:
          "PRISMA_COMPUTE_DEPLOY=true pnpm turbo run build --filter=blog... && node ../../scripts/compute-static-snapshot.mjs blog",
        outputDirectory: ".compute",
      },
    },
    docs: {
      name: "docs",
      root: "apps/docs",
      framework: "bun",
      entry: ".compute/server.ts",
      httpPort: 3000,
      env: computeEnv,
      build: {
        command:
          "PRISMA_COMPUTE_DEPLOY=true pnpm turbo run build --filter=docs... && node ../../scripts/compute-static-snapshot.mjs docs",
        outputDirectory: ".compute",
      },
    },
  },
});
