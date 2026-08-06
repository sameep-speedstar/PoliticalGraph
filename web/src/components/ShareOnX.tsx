"use client";

import {
  POLIGRAPH_TAGLINE,
  POLIGRAPH_URL,
} from "@/lib/site";

/** Landing / marketing share — always points at the live atlas URL for OG cards. */
export function ShareOnX({
  text = `Poligraph — ${POLIGRAPH_TAGLINE} Free 3D worldview map beside public figures.`,
  className = "btn btn-ghost",
  label = "Share on X",
}: {
  text?: string;
  className?: string;
  label?: string;
}) {
  function open() {
    const intent = new URL("https://twitter.com/intent/tweet");
    intent.searchParams.set("text", text);
    intent.searchParams.set("url", `${POLIGRAPH_URL}/`);
    window.open(intent.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" className={className} onClick={open}>
      {label}
    </button>
  );
}
