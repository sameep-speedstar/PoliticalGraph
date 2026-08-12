"use client";

import type { HandleScoreResult } from "@/lib/types";

type Props = {
  coords: HandleScoreResult["coords"];
  handle: string;
};

/** 2D plot: X = LeftRight (−100 left … +100 right), Y = National (−100 bottom … +100 top) */
export function AxisPlot({ coords, handle }: Props) {
  const x = ((coords.leftRight + 100) / 200) * 100;
  const y = ((100 - coords.nationalInterest) / 200) * 100;

  return (
    <div className="relative aspect-square w-full max-w-lg mx-auto">
      <div className="absolute inset-0 rounded-lg border border-[var(--line)] bg-gradient-to-br from-black/40 to-black/10">
        <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-[var(--left)]/[0.06]" />
        <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-[var(--right)]/[0.07]" />
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[var(--left)]/[0.04]" />
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-[var(--right)]/[0.04]" />
        <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-[var(--line)]" />
        <div className="absolute top-1/2 left-3 right-3 h-px -translate-y-1/2 bg-[var(--line)]" />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[var(--left)]">
          Left
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[var(--right)]">
          Right
        </span>
        <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] uppercase tracking-widest text-[var(--national)]">
          National
        </span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-[var(--adversary)]">
          Adversary-Aligned
        </span>
        <div
          className="plot-dot absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brass)]"
          style={{ left: `${x}%`, top: `${y}%` }}
          title={`@${handle}`}
        />
      </div>
    </div>
  );
}
