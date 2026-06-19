#!/usr/bin/env node
import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const targets = {
  blog: {
    appDir: "apps/blog",
    basePath: "/blog",
    capturePath: "/blog",
    fallbackOrigin: "https://www.prisma.io",
  },
  docs: {
    appDir: "apps/docs",
    basePath: "/docs",
    capturePath: "/docs",
    fallbackOrigin: "https://www.prisma.io",
  },
};

const targetName = process.argv[2];
const target = targets[targetName];

if (!target) {
  console.error(`Usage: node scripts/compute-static-snapshot.mjs <${Object.keys(targets).join("|")}>`);
  process.exit(1);
}

const appDir = path.join(repoRoot, target.appDir);
const outputDir = path.join(appDir, ".compute");
const snapshotDir = path.join(outputDir, "snapshots");
const port = String(4200 + Math.floor(Math.random() * 1000));

function snapshotName(urlPath) {
  const normalized = urlPath.replace(/^\/+/, "").replace(/\/+$/, "") || "index";
  return `${normalized.replace(/[^a-zA-Z0-9_-]+/g, "_")}.html`;
}

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function waitForSnapshot(url) {
  const started = Date.now();
  let lastError;

  while (Date.now() - started < 180_000) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) return response.text();

      lastError = new Error(`HTTP ${response.status} from ${url}`);
      if (response.status >= 400 && response.status < 500) break;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw lastError ?? new Error(`Timed out fetching ${url}`);
}

function startStandaloneServer() {
  const serverPath = path.join(appDir, ".next/standalone", target.appDir, "server.js");
  const child = spawn("bun", [serverPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_ENV: "production",
      PORT: port,
      PRISMA_COMPUTE_DEPLOY: "true",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  return child;
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;

  child.kill("SIGTERM");
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 3000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function walkFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function embeddedAssets() {
  const assets = [];
  const snapshotFile = path.join(snapshotDir, snapshotName(target.capturePath));

  assets.push({
    key: `snapshots/${snapshotName(target.capturePath)}`,
    cacheControl: "public, max-age=300",
    contentType: "text/html; charset=utf-8",
    data: (await readFile(snapshotFile)).toString("base64"),
  });

  const staticRoot = path.join(appDir, ".next/static");
  if (await exists(staticRoot)) {
    for (const filePath of await walkFiles(staticRoot)) {
      const relative = path.relative(staticRoot, filePath).split(path.sep).join("/");
      assets.push({
        key: `_next/static/${relative}`,
        cacheControl: "public, max-age=31536000, immutable",
        contentType: contentTypeForPath(relative),
        data: (await readFile(filePath)).toString("base64"),
      });
    }
  }

  const totalBytes = assets.reduce((sum, asset) => sum + Math.floor((asset.data.length * 3) / 4), 0);
  console.log(
    `Embedded ${assets.length} ${targetName} static asset(s), approx ${Math.round(totalBytes / 1024 / 1024)} MB`,
  );

  return assets;
}

function contentTypeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".avif": "image/avif",
      ".css": "text/css; charset=utf-8",
      ".gif": "image/gif",
      ".html": "text/html; charset=utf-8",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".md": "text/markdown; charset=utf-8",
      ".mdx": "text/markdown; charset=utf-8",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".txt": "text/plain; charset=utf-8",
      ".webp": "image/webp",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".xml": "application/xml; charset=utf-8",
    }[ext] ?? "application/octet-stream"
  );
}

async function serverSource() {
  const assets = await embeddedAssets();
  const assetsSource = assets
    .map(
      (asset) =>
        `[${JSON.stringify(asset.key)}, { contentType: ${JSON.stringify(
          asset.contentType,
        )}, cacheControl: ${JSON.stringify(asset.cacheControl)}, data: ${JSON.stringify(
          asset.data,
        )} }]`,
    )
    .join(",\n");

  return `const basePath = ${JSON.stringify(target.basePath)};
const fallbackOrigin = ${JSON.stringify(target.fallbackOrigin)};
const snapshots = new Map([
  [basePath, "snapshots/${snapshotName(target.capturePath)}"],
  [\`\${basePath}/\`, "snapshots/${snapshotName(target.capturePath)}"],
]);
const embeddedFiles = new Map([
${assetsSource}
]);

function resolveLocalPath(pathname) {
  if (pathname.startsWith(\`\${basePath}/_next/static/\`)) {
    return pathname.slice(basePath.length + 1);
  }

  if (pathname.startsWith("/_next/static/")) {
    return pathname.slice(1);
  }

  return undefined;
}

async function fileResponse(filePath) {
  const file = embeddedFiles.get(filePath);
  if (!file) return undefined;

  const headers = new Headers();
  headers.set("Content-Type", file.contentType);
  headers.set("Cache-Control", file.cacheControl);

  return new Response(Buffer.from(file.data, "base64"), { headers });
}

async function proxy(request, url) {
  const upstream = new URL(url.pathname + url.search, fallbackOrigin);
  const headers = new Headers(request.headers);
  headers.set("host", upstream.host);

  return fetch(upstream, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
}

Bun.serve({
  hostname: "0.0.0.0",
  port: Number(process.env.PORT ?? 3000),
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(new URL(basePath, url), 302);
    }

    const snapshot = snapshots.get(url.pathname);
    if (snapshot) {
      const response = await fileResponse(snapshot);
      if (response) return response;
    }

    const localPath = resolveLocalPath(url.pathname);
    if (localPath) {
      const local = await fileResponse(localPath);
      if (local) return local;
    }

    return proxy(request, url);
  },
});
`;
}

await rm(outputDir, { force: true, recursive: true });
await mkdir(snapshotDir, { recursive: true });

const child = startStandaloneServer();

try {
  const url = `http://127.0.0.1:${port}${target.capturePath}`;
  const html = await waitForSnapshot(url);
  await writeFile(path.join(snapshotDir, snapshotName(target.capturePath)), html);
} finally {
  await stopServer(child);
}

await writeFile(path.join(outputDir, "server.ts"), await serverSource());

console.log(`Prepared ${targetName} Compute static snapshot at ${path.relative(repoRoot, outputDir)}`);
