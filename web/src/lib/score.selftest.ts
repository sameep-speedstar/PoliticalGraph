/**
 * Lightweight self-check for scorer + false-friend calibration.
 * Run: npx tsx src/lib/score.selftest.ts
 */
import { findDemoHandle } from "@/data/demo-handles";
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
    `kabir should be Anti-National, got ${k.coords.nationalInterest}`,
  );

  // Critic: Left-leaning ok; must NOT be strongly Anti-National
  assert(
    p.coords.nationalInterest > -10,
    `priya critic must not score Anti-National, got ${p.coords.nationalInterest}`,
  );

  console.log(
    JSON.stringify(
      {
        arjun: a.coords,
        neha: n.coords,
        kabir: k.coords,
        priya: p.coords,
      },
      null,
      2,
    ),
  );
  console.log("selftest ok");
}

run();
