/**
 * Lightweight self-check for scorer + false-friend calibration + figures.
 * Run: npx tsx src/lib/score.selftest.ts
 */
import { findDemoHandle } from "@/data/demo-handles";
import { FIGURE_HANDLES } from "@/data/public-figures";
import { isScoreSufficient, scoreHandleActivities } from "@/lib/score";

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

  // Journalist / protest discourse should yield multiple scored evidence items
  const journalist = scoreHandleActivities({
    handle: "sample_journalist",
    activities: [
      {
        id: "1",
        kind: "tweet",
        text: "Police brutality at the Gen Z student protest — tear gas and lathi charge on dissent.",
        createdAt: "2026-07-20T10:00:00Z",
        likes: 1200,
        retweets: 400,
      },
      {
        id: "2",
        kind: "tweet",
        text: "Instagram accounts of influencers who posted reels from the protest exposing police crackdown are gone.",
        createdAt: "2026-07-21T10:00:00Z",
        likes: 800,
        retweets: 200,
      },
      {
        id: "3",
        kind: "tweet",
        text: "Modi government must be held accountable for the university crackdown and arrests of students.",
        createdAt: "2026-07-22T10:00:00Z",
        likes: 900,
        retweets: 300,
      },
      {
        id: "4",
        kind: "tweet",
        text: "Press freedom is shrinking — journalists covering the NEET paper leak protests face intimidation.",
        createdAt: "2026-07-23T10:00:00Z",
        likes: 500,
        retweets: 150,
      },
      {
        id: "5",
        kind: "tweet",
        text: "Good morning from Mumbai. Coffee and deadlines.",
        createdAt: "2026-07-24T10:00:00Z",
        likes: 20,
        retweets: 0,
      },
    ],
    source: "demo",
  });
  assert(
    journalist.scoredCount >= 4,
    `journalist sample should score ≥4 posts, got ${journalist.scoredCount}`,
  );
  assert(
    journalist.evidence.length >= 4,
    `journalist sample should list ≥4 evidence, got ${journalist.evidence.length}`,
  );
  assert(
    journalist.coords.leftRight < -10,
    `journalist sample should lean Left, got ${journalist.coords.leftRight}`,
  );

  assert(isScoreSufficient(journalist), "journalist sample should be sufficient for early-stop");
  assert(
    !isScoreSufficient({
      ...journalist,
      scoredCount: 2,
      confidence: { ...journalist.confidence, overall: 20 },
      axes: {
        leftRight: { ...journalist.axes.leftRight, nItems: 1 },
        nationalInterest: { ...journalist.axes.nationalInterest, nItems: 0 },
      },
    }),
    "thin score must not be sufficient",
  );

  console.log(
    JSON.stringify(
      {
        arjun: a.coords,
        neha: n.coords,
        kabir: k.coords,
        priya: p.coords,
        figures: figureCoords,
        journalist: {
          coords: journalist.coords,
          scored: journalist.scoredCount,
          evidence: journalist.evidence.length,
        },
      },
      null,
      2,
    ),
  );
  console.log("selftest ok");
}

run();
