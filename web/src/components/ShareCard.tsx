"use client";

import { useCallback, useRef, useState } from "react";
import type { HandleScoreResult } from "@/lib/types";
import { SHARE_DISCLAIMER } from "@/data/disclaimers";
import { absoluteStanceUrl } from "@/lib/site";

type Props = {
  result: HandleScoreResult;
};

export function ShareCard({ result }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const evidenceUrl = absoluteStanceUrl(`/map/${result.handle}/`);
  const methodUrl = absoluteStanceUrl("/methodology/");
  const disclaimerUrl = absoluteStanceUrl("/disclaimers/");

  const shareText = [
    `Stance map for @${result.handle}`,
    `Left/Right ${result.coords.leftRight > 0 ? "+" : ""}${result.coords.leftRight} · National/Adversary ${result.coords.nationalInterest > 0 ? "+" : ""}${result.coords.nationalInterest}`,
    result.quadrant,
    SHARE_DISCLAIMER,
    `Evidence: ${evidenceUrl}`,
    `Methodology: ${methodUrl}`,
    `Disclaimers: ${disclaimerUrl}`,
  ].join("\n");

  const downloadPng = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    setNote(null);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0b1520",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `stance-${result.handle}.png`;
      a.click();
      setNote("Screenshot saved — attach it when you post on X.");
    } catch {
      setNote("Could not render screenshot. You can still share the link on X.");
    } finally {
      setBusy(false);
    }
  }, [result.handle]);

  const shareOnX = useCallback(() => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }, [shareText]);

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="rounded-lg border border-[var(--line)] bg-[#0b1520] p-6 text-[var(--ink)]"
      >
        <p className="font-display text-2xl font-bold tracking-tight">Stance</p>
        <p className="mt-1 text-sm text-[var(--muted)]">@{result.handle}</p>
        <p className="mt-4 font-display text-3xl font-semibold">
          {result.coords.leftRight > 0 ? "+" : ""}
          {result.coords.leftRight}
          <span className="mx-2 text-lg font-normal text-[var(--muted)]">LR</span>
          {result.coords.nationalInterest > 0 ? "+" : ""}
          {result.coords.nationalInterest}
          <span className="ml-2 text-lg font-normal text-[var(--muted)]">NI</span>
        </p>
        <p className="mt-2 text-sm text-[var(--brass)]">{result.quadrant}</p>
        <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
          Left↔Right · National↔Adversary-Aligned · confidence{" "}
          {result.confidence.label} · {result.lexiconPack}
        </p>
        <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
          {SHARE_DISCLAIMER}
        </p>
        <p className="mt-2 text-[10px] leading-relaxed text-[var(--brass)]">
          kniq.ai/stance/methodology · kniq.ai/stance/disclaimers
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadPng}
          disabled={busy}
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--brass)] disabled:opacity-60"
        >
          {busy ? "Rendering…" : "Download screenshot"}
        </button>
        <button
          type="button"
          onClick={shareOnX}
          className="rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-semibold text-[#1a1206] transition hover:brightness-110"
        >
          Share on X
        </button>
      </div>
      {note ? <p className="text-xs text-[var(--muted)]">{note}</p> : null}
      <p className="text-[10px] text-[var(--muted)]">
        X share text includes evidence,{" "}
        <a href={methodUrl} className="text-[var(--brass)] hover:underline">
          methodology
        </a>
        , and{" "}
        <a href={disclaimerUrl} className="text-[var(--brass)] hover:underline">
          disclaimers
        </a>{" "}
        links. Attach the PNG for the card image.
      </p>
    </div>
  );
}
