import { getAppBySlug } from "@/data/apps";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let slug: string | undefined;

  try {
    const body = (await request.json()) as { slug?: string };
    slug = body.slug;
  } catch {
    return NextResponse.json(
      {
        error: "invalid_request",
        message: "Expected a JSON body with an app slug.",
      },
      { status: 400 },
    );
  }

  if (!slug) {
    return NextResponse.json(
      {
        error: "missing_slug",
        message: "Missing app slug.",
      },
      { status: 400 },
    );
  }

  const app = getAppBySlug(slug);
  if (!app) {
    return NextResponse.json(
      {
        error: "app_not_found",
        message: `No app listing found for "${slug}".`,
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      status: "pending_integration",
      slug: app.slug,
      appName: app.name,
      message:
        "The Prisma Compute deploy API is not wired yet. This endpoint is the planned integration seam for one-click app deployment.",
    },
    { status: 501 },
  );
}
