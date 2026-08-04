"use client";

import Link from "next/link";
import { useState } from "react";
import { PoliticalGraph3DDynamic } from "@/components/PoliticalGraph3DDynamic";
import type { Personality } from "@/data/personalities";
import { personalities } from "@/data/personalities";

export default function HomePage() {
  const [selected, setSelected] = useState<Personality | null>(null);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">Poligraph</p>
          <h1>Understand how people think.</h1>
          <p className="hero-lead">
            A free, location-aware survey places you on a fixed three-axis map —
            economy, authority, cultural identity — beside public figures backed
            by evidence and human review.
          </p>
          <div className="cta-row">
            <Link href="/survey" className="btn btn-primary">
              Take the map — free
            </Link>
            <Link href="/mockup" className="btn btn-ghost">
              View mockups
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Interactive 3D ideological constellation">
          <PoliticalGraph3DDynamic
            personalities={personalities}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </div>
      </section>

      <section className="section">
        <div className="section-narrow">
          <h2>One shared map for everyone</h2>
          <p className="section-lead">
            The 3D basis stays fixed so your position is comparable to every other
            user and figure. Questions can adapt to your country and current
            affairs — the axes do not.
          </p>
          <div className="axis-cards">
            <article className="axis-card">
              <h3>Economic</h3>
              <p>
                Who should steer capital and welfare — redistributive states or
                market allocation?
              </p>
              <div className="poles">
                <span>Equality</span>
                <span>Markets</span>
              </div>
            </article>
            <article className="axis-card">
              <h3>Authority</h3>
              <p>
                How much coercive power should the state hold over speech, order,
                and private life?
              </p>
              <div className="poles">
                <span>Liberty</span>
                <span>Authority</span>
              </div>
            </article>
            <article className="axis-card">
              <h3>Cultural identity</h3>
              <p>
                Cosmopolitan pluralism versus national particularism, tradition,
                and faith in public life.
              </p>
              <div className="poles">
                <span>Cosmopolitan</span>
                <span>Particular</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
