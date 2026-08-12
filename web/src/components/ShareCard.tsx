"use client";

import { useCallback, useRef, useState } from "react";
import type { HandleScoreResult } from "@/lib/types";
import { SHARE_DISCLAIMER } from "@/data/disclaimers";
import { absoluteStanceUrl } from "@/lib/site";

type Props = {
  result: HandleScoreResult;
};

/** Compact share copy — stays under ~140 weighted chars (URLs ≈ 23 each on X). */
function buildShareText(result: HandleScoreResult): string {
  const lr = result.coords.leftRight;
  const ni = result.coords.nationalInterest;
  const lrS = `${lr > 0 ? "+" : ""}${lr}`;
  const niS = `${ni > 0 ? "+" : ""}${ni}`;
  const map = absoluteStanceUrl(`/map/${result.handle}/`);
  const method = absoluteStanceUrl("/methodology/");
  const disc = absoluteStanceUrl("/disclaimers/");
  return `@${result.handle} Stance ${lrS}/${niS}\n${map}\nMethod ${method}\nDisc ${disc}`;
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: "image/png" });
}

export function ShareCard({ result }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const methodUrl = absoluteStanceUrl("/methodology/");
  const disclaimerUrl = absoluteStanceUrl("/disclaimers/");
  const shareText = buildShareText(result);

  const renderPng = useCallback(async () => {
    if (!cardRef.current) throw new Error("Card not ready");
    const { toPng } = await import("html-to-image");
    return toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#0b1520",
    });
  }, []);

  const downloadPng = useCallback(async () => {
    setBusy(true);
    setNote(null);
    try {
      const dataUrl = await renderPng();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `stance-${result.handle}.png`;
      a.click();
      setNote("Screenshot saved.");
    } catch {
      setNote("Could not render screenshot.");
    } finally {
      setBusy(false);
    }
  }, [renderPng, result.handle]);

  const shareOnX = useCallback(async () => {
    setBusy(true);
    setNote(null);
    try {
      const dataUrl = await renderPng();
      const file = await dataUrlToFile(dataUrl, `stance-${result.handle}.png`);
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      const payload: ShareData = { text: shareText, files: [file] };
      if (typeof nav.share === "function" && nav.canShare?.(payload)) {
        await nav.share(payload);
        setNote("Shared with screenshot + short method/disclaimer links.");
        return;
      }
      // Fallback: download PNG, open X intent with short text
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `stance-${result.handle}.png`;
      a.click();
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
      setNote("Screenshot downloaded — attach it to the draft tweet (text is short).");
    } catch (e) {
      if ((e as Error)?.name === "AbortError") {
        setNote(null);
        return;
      }
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
      setNote("Opened X with short text — attach the screenshot if download worked.");
    } finally {
      setBusy(false);
    }
  }, [renderPng, result.handle, shareText]);

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
          {busy ? "Working…" : "Download screenshot"}
        </button>
        <button
          type="button"
          onClick={shareOnX}
          disabled={busy}
          className="rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-semibold text-[#1a1206] transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Preparing…" : "Share on X"}
        </button>
      </div>
      {note ? <p className="text-xs text-[var(--muted)]">{note}</p> : null}
      <p className="text-[10px] text-[var(--muted)]">
        Share attaches the PNG when the browser allows it, with short{" "}
        <a href={methodUrl} className="text-[var(--brass)] hover:underline">
          methodology
        </a>{" "}
        and{" "}
        <a href={disclaimerUrl} className="text-[var(--brass)] hover:underline">
          disclaimers
        </a>{" "}
        links (under X’s length limit).
      </p>
    </div>
  );
}
