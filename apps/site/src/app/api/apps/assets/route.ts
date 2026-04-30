import { NextResponse } from "next/server";

import { getFile } from "@/lib/prisma-apps-github";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

function getMimeType(path: string) {
  const extension = path.slice(path.lastIndexOf(".")).toLowerCase();
  return MIME_TYPES[extension] ?? "application/octet-stream";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path")?.trim();

  if (!path) {
    return NextResponse.json(
      {
        error: "missing_path",
        message: "Expected a repo-relative asset path.",
      },
      { status: 400 },
    );
  }

  const file = await getFile(path);

  if (!file) {
    return NextResponse.json(
      {
        error: "asset_not_found",
        message: `No asset found for "${path}".`,
      },
      { status: 404 },
    );
  }

  if (file.encoding !== "base64") {
    return NextResponse.json(
      {
        error: "unsupported_encoding",
        message: `Unsupported asset encoding "${file.encoding}".`,
      },
      { status: 500 },
    );
  }

  return new NextResponse(Buffer.from(file.content, "base64"), {
    headers: {
      "Content-Type": getMimeType(file.path),
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
