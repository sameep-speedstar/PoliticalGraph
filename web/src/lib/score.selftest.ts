/**
 * Lightweight self-check for scorer + false-friend calibration + figures.
 * Run: npx tsx src/lib/score.selftest.ts
 */
import { findDemoHandle } from "@/data/demo-handles";
import { FIGURE_HANDLES } from "@/data/public-figures";
import { scoreHandleActivities } from "@/lib/score";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function run() {
  const arjun = findDemoHandle("arjun_bharat")!;
  const neha = findDemoHandle("neha_republic")!;
  const kabir = findDemoHandle("kabir_frontier")!;
  const priya = findDemoHandle("priya_audit")!;

  const a = scoreHandleActivities({
    handle: arjun.handle,
    activities: arjun.activities,
    source: "demo",
  });
  const n = scoreHandleActivities({
    handle: neha.handle,
    activities: neha.activities,
    source: "demo",
  });
  const k = scoreHandleActivities({
    handle: kabir.handle,
    activities: kabir.activities,
    source: "demo",
  });
  const p = scoreHandleActivities({
    handle: priya.handle,
    activities: priya.activities,
    source: "demo",
  });

  assert(a.coords.leftRight > 20, `arjun should be Right, got ${a.coords.leftRight}`);
  assert(
    a.coords.nationalInterest > 40,
    `arjun should be National, got ${a.coords.nationalInterest}`,
  );

  assert(n.coords.leftRight < -20, `neha should be Left, got ${n.coords.leftRight}`);
  assert(
    n.coords.nationalInterest > 20,
    `neha should be National, got ${n.coords.nationalInterest}`,
  );

  assert(k.coords.leftRight < -10, `kabir should be Left, got ${k.coords.leftRight}`);
  assert(
    k.coords.nationalInterest < -40,
    `kabir should be Adversary-Aligned, got ${k.coords.nationalInterest}`,
  );

  assert(
    p.coords.nationalInterest > -10,
    `priya critic must not score Adversary-Aligned, got ${p.coords.nationalInterest}`,
  );

  const figureCoords: Record<string, { leftRight: number; nationalInterest: number }> =
    {};
  for (const f of FIGURE_HANDLES) {
    const r = scoreHandleActivities({
      handle: f.handle,
      activities: f.activities,
      source: "demo",
    });
    figureCoords[f.handle] = r.coords;
    assert(
      r.coords.nationalInterest > 20,
      `${f.handle} expected National-leaning, got ${r.coords.nationalInterest}`,
    );
  }
  assert(figureCoords.narendramodi.leftRight > 15, "modi should lean Right");
  assert(figureCoords.rahulgandhi.leftRight < -15, "rahul should lean Left");

  console.log(
    JSON.stringify(
      {
        arjun: a.coords,
        neha: n.coords,
        kabir: k.coords,
        priya: p.coords,
        figures: figureCoords,
      },
      null,
      2,
    ),
  );
  console.log("selftest ok");
}

run();
