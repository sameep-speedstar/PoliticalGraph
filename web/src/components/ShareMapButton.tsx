"use client";

import { useState } from "react";
import type { Coords } from "@/data/personalities";

export function ShareMapButton({
  coords,
  clusterName,
}: {
  coords: Coords;
  clusterName: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  async function share() {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://kniq.ai/poligraph";
    const text = `My Poligraph map: nearest thinking group “${clusterName}” (E ${coords.economic > 0 ? "+" : ""}${coords.economic}, A ${coords.authority > 0 ? "+" : ""}${coords.authority}, C ${coords.cultural > 0 ? "+" : ""}${coords.cultural}). Understand how people think —`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Poligraph", text, url });
        setStatus("shared");
        return;
      } catch {
        /* fall through to clipboard */
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

  return (
    <button type="button" className="btn btn-ghost" onClick={share}>
      {status === "copied"
        ? "Link copied"
        : status === "shared"
          ? "Shared"
          : "Share my map"}
    </button>
  );
}
