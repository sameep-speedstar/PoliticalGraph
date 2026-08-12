import type { XActivity } from "@/lib/types";

export type DemoHandle = {
  handle: string;
  displayName: string;
  blurb: string;
  activities: XActivity[];
};

function daysAgo(n: number, hour = 12): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

function act(
  partial: Omit<XActivity, "permalink"> & { permalink?: string },
): XActivity {
  return {
    ...partial,
    permalink:
      partial.permalink ??
      `https://x.com/i/status/${partial.id}`,
  };
}

/** Right · National */
const arjunNationalRight: DemoHandle = {
  handle: "arjun_bharat",
  displayName: "Arjun Mehta",
  blurb: "Markets + hard borders demo corpus",
  activities: [
    act({
      id: "a1",
      kind: "tweet",
      text: "Freebies destroy fiscal discipline. Ease of doing business and lower corporate tax will create jobs.",
      createdAt: daysAgo(2),
      likes: 120,
      retweets: 40,
    }),
    act({
      id: "a2",
      kind: "tweet",
      text: "Kashmir is an integral part of India. Reject secession — integrity of the Union is non-negotiable.",
      createdAt: daysAgo(5),
      likes: 300,
      retweets: 90,
    }),
    act({
      id: "a3",
      kind: "quote",
      text: "China is the real threat. Strengthen our borders and indigenous defence production now.",
      createdAt: daysAgo(8),
      likes: 80,
      retweets: 22,
    }),
    act({
      id: "a4",
      kind: "tweet",
      text: "Uniform civil code will unite. Law and order first — woke nonsense won't build a nation.",
      createdAt: daysAgo(12),
      likes: 150,
      retweets: 35,
    }),
    act({
      id: "a5",
      kind: "retweet",
      text: "Pakistan sponsors terror. Zero tolerance for terror.",
      createdAt: daysAgo(15),
      likes: 0,
      retweets: 0,
    }),
    act({
      id: "a6",
      kind: "tweet",
      text: "Quad strengthens India in the Indo-Pacific. Atmanirbhar in critical minerals is security policy.",
      createdAt: daysAgo(20),
      likes: 60,
      retweets: 18,
    }),
    act({
      id: "a7",
      kind: "reply",
      text: "Reservation is vote bank politics. Merit alone should decide seats in higher education.",
      createdAt: daysAgo(25),
      likes: 40,
      retweets: 5,
      contextText: "Debate on expanding reservation",
    }),
    act({
      id: "a8",
      kind: "like",
      text: "Stand with Indian Army after the latest LoC provocation.",
      createdAt: daysAgo(30),
      likes: 0,
      retweets: 0,
    }),
    act({
      id: "a9",
      kind: "tweet",
      text: "Privatise loss-making PSUs. Unions hurt growth when they block reform.",
      createdAt: daysAgo(40),
      likes: 95,
      retweets: 20,
    }),
    act({
      id: "a10",
      kind: "tweet",
      text: "Arunachal is India. PoK is India. No map games.",
      createdAt: daysAgo(55),
      likes: 400,
      retweets: 110,
    }),
  ],
};

/** Left · National */
const nehaLeftNational: DemoHandle = {
  handle: "neha_republic",
  displayName: "Neha Krishnan",
  blurb: "Welfare left + sovereignty demo corpus",
  activities: [
    act({
      id: "n1",
      kind: "tweet",
      text: "Tax the rich. Inequality is the real national emergency — expand welfare and strengthen PSUs.",
      createdAt: daysAgo(3),
      likes: 200,
      retweets: 70,
    }),
    act({
      id: "n2",
      kind: "tweet",
      text: "Stop privatisation of healthcare. Nationalise key utilities for the public good.",
      createdAt: daysAgo(7),
      likes: 110,
      retweets: 40,
    }),
    act({
      id: "n3",
      kind: "tweet",
      text: "Kashmir is an integral part of India. We can demand justice AND reject secession.",
      createdAt: daysAgo(10),
      likes: 90,
      retweets: 25,
    }),
    act({
      id: "n4",
      kind: "quote",
      text: "Pakistan sponsors terror — zero tolerance for terror. That is not Right or Left; that is duty.",
      createdAt: daysAgo(14),
      likes: 70,
      retweets: 15,
    }),
    act({
      id: "n5",
      kind: "tweet",
      text: "Caste census now. Expand reservation where exclusion is structural.",
      createdAt: daysAgo(18),
      likes: 160,
      retweets: 55,
    }),
    act({
      id: "n6",
      kind: "tweet",
      text: "Secularism is under attack, but Arunachal is India and we stand with Indian Army at the LAC.",
      createdAt: daysAgo(22),
      likes: 130,
      retweets: 40,
    }),
    act({
      id: "n7",
      kind: "reply",
      text: "Right to protest is sacred. Police brutality helps nobody. Still: integrity of the Union first.",
      createdAt: daysAgo(28),
      likes: 45,
      retweets: 8,
    }),
    act({
      id: "n8",
      kind: "tweet",
      text: "China is the real threat. Strengthen our borders without abandoning labour rights.",
      createdAt: daysAgo(35),
      likes: 85,
      retweets: 20,
    }),
    act({
      id: "n9",
      kind: "retweet",
      text: "Union power built the middle class. Tax the rich to fund public education.",
      createdAt: daysAgo(42),
      likes: 0,
      retweets: 0,
    }),
    act({
      id: "n10",
      kind: "tweet",
      text: "Modi must resign over inflation — that is accountability, not adversary alignment.",
      createdAt: daysAgo(50),
      likes: 220,
      retweets: 80,
    }),
  ],
};

/** Left · Adversary-Aligned codes */
const kabirAdversaryLeft: DemoHandle = {
  handle: "kabir_frontier",
  displayName: "Kabir Ansari",
  blurb: "Left economy + adversary-alignment demo (synthetic)",
  activities: [
    act({
      id: "k1",
      kind: "tweet",
      text: "Tax the rich. Smash the patriarchy. Wealth tax now.",
      createdAt: daysAgo(1),
      likes: 50,
      retweets: 12,
    }),
    act({
      id: "k2",
      kind: "tweet",
      text: "Occupied Kashmir deserves azadi for Kashmir. India occupies Kashmir — that is the truth.",
      createdAt: daysAgo(4),
      likes: 30,
      retweets: 10,
    }),
    act({
      id: "k3",
      kind: "quote",
      text: "India is the aggressor at LAC. PLA was provoked by forward deployment.",
      createdAt: daysAgo(9),
      likes: 20,
      retweets: 8,
    }),
    act({
      id: "k4",
      kind: "tweet",
      text: "Resistance fighters not terrorists. Kashmir needs plebiscite under UN.",
      createdAt: daysAgo(13),
      likes: 25,
      retweets: 9,
    }),
    act({
      id: "k5",
      kind: "tweet",
      text: "Stop privatisation. Strengthen PSU and expand reservation.",
      createdAt: daysAgo(17),
      likes: 40,
      retweets: 11,
    }),
    act({
      id: "k6",
      kind: "tweet",
      text: "China is peaceful at the border. Isolate India at the UN ignore Pakistan.",
      createdAt: daysAgo(21),
      likes: 15,
      retweets: 6,
    }),
    act({
      id: "k7",
      kind: "reply",
      text: "Disarm India unilaterally — militarism is the problem.",
      createdAt: daysAgo(27),
      likes: 10,
      retweets: 2,
    }),
    act({
      id: "k8",
      kind: "tweet",
      text: "Secularism is under attack. Human rights for all — and foreign trusteeship for India if needed.",
      createdAt: daysAgo(33),
      likes: 18,
      retweets: 5,
    }),
    act({
      id: "k9",
      kind: "retweet",
      text: "India should lose this confrontation. Root for Pakistan against India.",
      createdAt: daysAgo(40),
      likes: 0,
      retweets: 0,
    }),
    act({
      id: "k10",
      kind: "like",
      text: "Overthrow the Indian constitution — it is a majoritarian document.",
      createdAt: daysAgo(48),
      likes: 0,
      retweets: 0,
    }),
  ],
};

/** Critic who is NOT adversary-aligned (false-friend stress test) */
const criticOnly: DemoHandle = {
  handle: "priya_audit",
  displayName: "Priya Desai",
  blurb: "Harsh government critic — should stay near National-neutral/positive",
  activities: [
    act({
      id: "p1",
      kind: "tweet",
      text: "Modi must resign. Corrupt ministry after corrupt ministry — accountability now.",
      createdAt: daysAgo(2),
      likes: 500,
      retweets: 200,
    }),
    act({
      id: "p2",
      kind: "tweet",
      text: "Defence procurement scam again. Cut wasteful defence spending without weakening soldiers.",
      createdAt: daysAgo(6),
      likes: 180,
      retweets: 40,
    }),
    act({
      id: "p3",
      kind: "tweet",
      text: "Civil liberties and human rights are not optional in a republic.",
      createdAt: daysAgo(11),
      likes: 90,
      retweets: 20,
    }),
    act({
      id: "p4",
      kind: "tweet",
      text: "Tax the rich to fund schools. Inequality is the real scandal.",
      createdAt: daysAgo(16),
      likes: 120,
      retweets: 35,
    }),
    act({
      id: "p5",
      kind: "tweet",
      text: "Kashmir is an integral part of India — criticising AFSPA abuse does not change that.",
      createdAt: daysAgo(22),
      likes: 70,
      retweets: 15,
    }),
    act({
      id: "p6",
      kind: "quote",
      text: "Stand with Indian Army against cross-border terror. Also prosecute procurement fraud.",
      createdAt: daysAgo(29),
      likes: 55,
      retweets: 12,
    }),
    act({
      id: "p7",
      kind: "tweet",
      text: "Right to protest. Police brutality helps the ruling party narrative, not justice.",
      createdAt: daysAgo(36),
      likes: 100,
      retweets: 30,
    }),
    act({
      id: "p8",
      kind: "tweet",
      text: "Nationalisation of power distribution would cut oligopoly rents.",
      createdAt: daysAgo(44),
      likes: 40,
      retweets: 8,
    }),
  ],
};

export const DEMO_HANDLES: DemoHandle[] = [
  arjunNationalRight,
  nehaLeftNational,
  kabirAdversaryLeft,
  criticOnly,
];

export function findDemoHandle(raw: string): DemoHandle | undefined {
  const h = raw.replace(/^@/, "").toLowerCase();
  return DEMO_HANDLES.find((d) => d.handle === h);
}
