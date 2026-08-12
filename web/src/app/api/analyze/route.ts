import { NextResponse } from "next/server";
import { findDemoHandle } from "@/data/demo-handles";
import { scoreHandleActivities } from "@/lib/score";

export const runtime = "nodejs";

type Body = {
  handle?: string;
};

/**
 * Analyze an X handle.
 * v1: demo corpora only (no live X API key required).
 * Live ingest can plug in later behind X_BEARER_TOKEN.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = (body.handle ?? "").trim();
  if (!raw) {
    return NextResponse.json({ error: "handle is required" }, { status: 400 });
  }

  const cleaned = raw.replace(/^@/, "").replace(/[^a-zA-Z0-9_]/g, "");
  if (!cleaned || cleaned.length > 15) {
    return NextResponse.json(
      { error: "Enter a valid X handle (letters, numbers, underscore)." },
      { status: 400 },
    );
  }

  const demo = findDemoHandle(cleaned);
  if (demo) {
    const result = scoreHandleActivities({
      handle: demo.handle,
      displayName: demo.displayName,
      activities: demo.activities,
      source: "demo",
    });
    return NextResponse.json(result);
  }

  // Live API placeholder — keep product usable without credentials
  if (!process.env.X_BEARER_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Live X ingest is not configured. Try a demo handle: @arjun_bharat, @neha_republic, @kabir_frontier, or @priya_audit.",
        demoHandles: [
          "arjun_bharat",
          "neha_republic",
          "kabir_frontier",
          "priya_audit",
        ],
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      error:
        "Live X ingest adapter is stubbed for this build. Use demo handles or add ingest next.",
    },
    { status: 501 },
  );
}
