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
          <p className="hero-brand">PoliticalGraph</p>
          <h1>See where your thinking sits in idea-space.</h1>
          <p className="hero-lead">
            A free survey places you on three axes — economy, authority, and
            cultural identity — beside public figures mapped from speeches,
            campaigns, and public records.
          </p>
          <div className="cta-row">
            <Link href="/survey" className="btn btn-primary">
              Take the map — free
            </Link>
            <Link href="/explore" className="btn btn-ghost">
              Search famous people
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Interactive 3D political constellation">
          <PoliticalGraph3DDynamic
            personalities={personalities}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </div>
      </section>

      <section className="section">
        <div className="section-narrow">
          <h2>Three axes, not one tribe</h2>
          <p className="section-lead">
            Left–right collapses too much. PoliticalGraph separates economic
            distribution, state power, and cultural belonging so you can see
            which thinking group you actually inhabit — and who is nearest.
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
