"use client";

import { useState } from "react";
import type { Coords } from "@/data/personalities";
import { POLIGRAPH_URL } from "@/lib/site";

function mapShareText(coords: Coords, clusterName: string) {
  return `My Poligraph map: nearest thinking group “${clusterName}” (E ${coords.economic > 0 ? "+" : ""}${coords.economic}, A ${coords.authority > 0 ? "+" : ""}${coords.authority}, C ${coords.cultural > 0 ? "+" : ""}${coords.cultural}). Understand how people think —`;
}

function absoluteShareUrl() {
  if (typeof window === "undefined") return `${POLIGRAPH_URL}/`;
  const { origin, pathname, search } = window.location;
  if (origin.includes("kniq.ai")) return `${origin}${pathname}${search}`;
  if (pathname.includes("results")) {
    return `${POLIGRAPH_URL}/results/${search}`;
  }
  return `${POLIGRAPH_URL}/`;
}

export function ShareMapButton({
  coords,
  clusterName,
}: {
  coords: Coords;
  clusterName: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  async function share() {
    const url = absoluteShareUrl();
    const text = mapShareText(coords, clusterName);

    if (navigator.share) {
      try {
        await navigator.share({ title: "Poligraph", text, url });
        setStatus("shared");
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  function shareOnX() {
    const url = absoluteShareUrl();
    const text = mapShareText(coords, clusterName);
    const intent = new URL("https://twitter.com/intent/tweet");
    intent.searchParams.set("text", text);
    intent.searchParams.set("url", url);
    window.open(intent.toString(), "_blank", "noopener,noreferrer");
    setStatus("shared");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="share-actions">
      <button type="button" className="btn btn-ghost" onClick={share}>
        {status === "copied"
          ? "Link copied"
          : status === "shared"
            ? "Shared"
            : "Share my map"}
      </button>
      <button type="button" className="btn btn-ghost" onClick={shareOnX}>
        Post on X
      </button>
    </div>
  );
}
