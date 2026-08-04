"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const screens = [
  {
    id: "landing",
    title: "Landing",
    blurb: "Brand-first hero. Fixed 3D constellation is the product, not a sidebar chart.",
    src: "/mockups/poligraph-mockup-landing.png",
  },
  {
    id: "survey",
    title: "Dynamic survey",
    blurb:
      "Core values stay global. Location + current-affairs packs adapt framing without moving the axes.",
    src: "/mockups/poligraph-mockup-survey.png",
  },
  {
    id: "results",
    title: "Your map",
    blurb:
      "Same fixed Economic · Authority · Cultural space for every user — comparable by design.",
    src: "/mockups/poligraph-mockup-results.png",
  },
  {
    id: "compare",
    title: "Compare",
    blurb: "Overlap and differences on the shared basis, with confidence and evidence.",
    src: "/mockups/poligraph-mockup-compare.png",
  },
] as const;

export default function MockupPage() {
  const [active, setActive] = useState(0);
  const screen = screens[active];

  return (
    <div className="mockup-page">
      <header className="mockup-header">
        <div>
          <p className="eyebrow">Design lock · Aug 2026</p>
          <h1>Poligraph mockups</h1>
          <p className="mockup-lead">
            Understand how people think — fixed 3D comparison basis, location-aware
            questions, human-approved public scores.
          </p>
        </div>
        <div className="cta-row">
          <Link href="/survey" className="btn btn-primary">
            Try live survey
          </Link>
          <Link href="/explore" className="btn btn-ghost">
            Live explore
          </Link>
        </div>
      </header>

      <ul className="lock-grid">
        <li>
          <strong>Name</strong>
          <span>Poligraph</span>
        </li>
        <li>
          <strong>3D basis</strong>
          <span>Fixed for all users</span>
        </li>
        <li>
          <strong>Survey</strong>
          <span>Dynamic by location + affairs</span>
        </li>
        <li>
          <strong>Publishing</strong>
          <span>Human approval required</span>
        </li>
      </ul>

      <div className="mockup-tabs" role="tablist" aria-label="Mockup screens">
        {screens.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? "is-active" : ""}
            onClick={() => setActive(i)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <figure className="mockup-frame">
        <Image
          src={screen.src}
          alt={`Poligraph ${screen.title} mockup`}
          width={1600}
          height={900}
          className="mockup-image"
          priority
        />
        <figcaption>
          <strong>{screen.title}</strong>
          <span>{screen.blurb}</span>
        </figcaption>
      </figure>

      <section className="mockup-flow">
        <h2>Product flow</h2>
        <ol>
          <li>
            <strong>Detect or ask location</strong> — loads regional pack without changing axis meaning.
          </li>
          <li>
            <strong>Core values + local/current items</strong> — still Likert, still mapped to 12D → fixed 3D.
          </li>
          <li>
            <strong>Admiration soft prior</strong> — secondary only (≤12%).
          </li>
          <li>
            <strong>Results on the shared map</strong> — thinking group, nearest figures, evidence on their side.
          </li>
          <li>
            <strong>Compare</strong> — any two figures (or you vs figure) on the same basis.
          </li>
        </ol>
      </section>
    </div>
  );
}
