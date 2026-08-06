"use client";

import dynamic from "next/dynamic";
import type { PoliticalGraph3DProps } from "./PoliticalGraph3D";

export const PoliticalGraph3DDynamic = dynamic<PoliticalGraph3DProps>(
  () =>
    import("./PoliticalGraph3D").then((m) => m.PoliticalGraph3D),
  {
    ssr: false,
    loading: () => (
      <div className="graph-canvas graph-canvas--loading">
        <p>Loading constellation…</p>
      </div>
    ),
  },
);
