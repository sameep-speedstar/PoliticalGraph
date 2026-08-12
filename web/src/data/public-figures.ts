/**
 * Interpretive demo corpora for well-known Indian public figures.
 * Texts are synthetic stance-probe phrases aligned to widely reported public
 * themes — NOT scraped posts. Experimental only; see disclaimers.
 */
import type { XActivity } from "@/lib/types";

export type FigureDomain = "political" | "economic" | "business";

export type FigureHandle = {
  handle: string;
  displayName: string;
  blurb: string;
  activities: XActivity[];
  domain: FigureDomain;
  note: string;
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
    permalink: partial.permalink ?? `https://x.com/i/status/${partial.id}`,
  };
}

/** Political — Right · National */
const narendraModi: FigureHandle = {
  handle: "narendramodi",
  displayName: "Narendra Modi",
  domain: "political",
  blurb: "Political · interpretive demo",
  note: "Interpretive corpus from public policy themes (Atmanirbhar, borders, UCC). Not scraped tweets.",
  activities: [
    act({
      id: "nm1",
      kind: "tweet",
      text: "Atmanirbhar in critical minerals and indigenous defence production strengthens India.",
      createdAt: daysAgo(3),
      likes: 50000,
      retweets: 8000,
    }),
    act({
      id: "nm2",
      kind: "tweet",
      text: "Kashmir is an integral part of India. Integrity of the Union is non-negotiable.",
      createdAt: daysAgo(8),
      likes: 60000,
      retweets: 10000,
    }),
    act({
      id: "nm3",
      kind: "tweet",
      text: "China is the real threat — strengthen our borders. Pakistan sponsors terror; zero tolerance for terror.",
      createdAt: daysAgo(14),
      likes: 40000,
      retweets: 7000,
    }),
    act({
      id: "nm4",
      kind: "tweet",
      text: "Uniform civil code will unite. Ease of doing business and lower corporate tax create jobs.",
      createdAt: daysAgo(20),
      likes: 35000,
      retweets: 5000,
    }),
    act({
      id: "nm5",
      kind: "quote",
      text: "Quad strengthens India in the Indo-Pacific. Stand with Indian Army.",
      createdAt: daysAgo(28),
      likes: 20000,
      retweets: 4000,
    }),
    act({
      id: "nm6",
      kind: "tweet",
      text: "Freebies destroy fiscal discipline. Law and order first.",
      createdAt: daysAgo(40),
      likes: 25000,
      retweets: 4500,
    }),
    act({
      id: "nm7",
      kind: "tweet",
      text: "Arunachal is India. PoK is India. Reject secession.",
      createdAt: daysAgo(55),
      likes: 45000,
      retweets: 9000,
    }),
    act({
      id: "nm8",
      kind: "retweet",
      text: "Proud hindutva civilisational confidence — Ram Mandir is civilisational.",
      createdAt: daysAgo(70),
      likes: 0,
      retweets: 0,
    }),
  ],
};

/** Political — Left · National (critic ≠ adversary) */
const rahulGandhi: FigureHandle = {
  handle: "rahulgandhi",
  displayName: "Rahul Gandhi",
  domain: "political",
  blurb: "Political · interpretive demo",
  note: "Interpretive corpus: welfare/equity + territorial integrity. Government criticism is not adversary-aligned.",
  activities: [
    act({
      id: "rg1",
      kind: "tweet",
      text: "Tax the rich. Inequality is the real national emergency — expand welfare and strengthen PSUs.",
      createdAt: daysAgo(2),
      likes: 30000,
      retweets: 6000,
    }),
    act({
      id: "rg2",
      kind: "tweet",
      text: "Caste census now. Expand reservation where exclusion is structural.",
      createdAt: daysAgo(9),
      likes: 28000,
      retweets: 5500,
    }),
    act({
      id: "rg3",
      kind: "tweet",
      text: "Modi must resign over inflation — that is accountability, not adversary alignment.",
      createdAt: daysAgo(12),
      likes: 40000,
      retweets: 8000,
    }),
    act({
      id: "rg4",
      kind: "tweet",
      text: "Kashmir is an integral part of India. We can demand justice AND reject secession.",
      createdAt: daysAgo(18),
      likes: 15000,
      retweets: 2000,
    }),
    act({
      id: "rg5",
      kind: "quote",
      text: "Secularism is under attack, but Arunachal is India and we stand with Indian Army at the LAC.",
      createdAt: daysAgo(25),
      likes: 12000,
      retweets: 1800,
    }),
    act({
      id: "rg6",
      kind: "tweet",
      text: "Stop privatisation of healthcare. Right to protest is sacred. Police brutality helps nobody.",
      createdAt: daysAgo(33),
      likes: 18000,
      retweets: 3000,
    }),
    act({
      id: "rg7",
      kind: "tweet",
      text: "China is the real threat. Strengthen our borders without abandoning labour rights.",
      createdAt: daysAgo(45),
      likes: 10000,
      retweets: 1500,
    }),
    act({
      id: "rg8",
      kind: "reply",
      text: "Defence procurement scam again — cut wasteful defence spending without weakening soldiers. Integrity of the Union first.",
      createdAt: daysAgo(60),
      likes: 8000,
      retweets: 900,
    }),
  ],
};

/** Political / economic — Finance · Right · National */
const nirmalaSitharaman: FigureHandle = {
  handle: "nsitharaman",
  displayName: "Nirmala Sitharaman",
  domain: "economic",
  blurb: "Economic · interpretive demo",
  note: "Interpretive corpus: fiscal discipline, markets, national economic security.",
  activities: [
    act({
      id: "ns1",
      kind: "tweet",
      text: "Ease of doing business and lower corporate tax will create jobs. Freebies destroy fiscal discipline.",
      createdAt: daysAgo(4),
      likes: 8000,
      retweets: 1200,
    }),
    act({
      id: "ns2",
      kind: "tweet",
      text: "Privatise loss-making PSUs carefully. Atmanirbhar in critical minerals is security policy.",
      createdAt: daysAgo(11),
      likes: 6000,
      retweets: 900,
    }),
    act({
      id: "ns3",
      kind: "tweet",
      text: "Data localisation for security protects citizens. Strengthen our borders with fiscal muscle.",
      createdAt: daysAgo(19),
      likes: 5000,
      retweets: 700,
    }),
    act({
      id: "ns4",
      kind: "quote",
      text: "Pakistan sponsors terror — zero tolerance for terror. Stand with Indian Army.",
      createdAt: daysAgo(27),
      likes: 9000,
      retweets: 1500,
    }),
    act({
      id: "ns5",
      kind: "tweet",
      text: "Unions hurt growth when they block reform. Merit alone should guide key appointments.",
      createdAt: daysAgo(36),
      likes: 4000,
      retweets: 600,
    }),
    act({
      id: "ns6",
      kind: "tweet",
      text: "Quad strengthens India. Indigenous defence production needs a sound budget.",
      createdAt: daysAgo(50),
      likes: 5500,
      retweets: 800,
    }),
    act({
      id: "ns7",
      kind: "tweet",
      text: "Kashmir is an integral part of India. Integrity of the Union is non-negotiable.",
      createdAt: daysAgo(65),
      likes: 7000,
      retweets: 1100,
    }),
  ],
};

/** Business — markets · National */
const anandMahindra: FigureHandle = {
  handle: "anandmahindra",
  displayName: "Anand Mahindra",
  domain: "business",
  blurb: "Business · interpretive demo",
  note: "Interpretive corpus: entrepreneurship, Make in India, competitive nation-first industry.",
  activities: [
    act({
      id: "am1",
      kind: "tweet",
      text: "Ease of doing business matters. Make in India and Atmanirbhar build resilient supply chains.",
      createdAt: daysAgo(5),
      likes: 12000,
      retweets: 2000,
    }),
    act({
      id: "am2",
      kind: "tweet",
      text: "Privatise where the private sector can deliver better. Lower corporate tax fuels capex.",
      createdAt: daysAgo(13),
      likes: 9000,
      retweets: 1400,
    }),
    act({
      id: "am3",
      kind: "tweet",
      text: "China is the real threat to manufacturing competitiveness — strengthen our borders and factories.",
      createdAt: daysAgo(21),
      likes: 15000,
      retweets: 2500,
    }),
    act({
      id: "am4",
      kind: "quote",
      text: "Indigenous defence production is an industrial opportunity. Stand with Indian Army.",
      createdAt: daysAgo(30),
      likes: 8000,
      retweets: 1100,
    }),
    act({
      id: "am5",
      kind: "tweet",
      text: "Freebies destroy fiscal discipline over time. Merit alone should decide leadership pipelines.",
      createdAt: daysAgo(42),
      likes: 7000,
      retweets: 900,
    }),
    act({
      id: "am6",
      kind: "tweet",
      text: "Arunachal is India. Integrity of the Union underpins investor confidence.",
      createdAt: daysAgo(58),
      likes: 11000,
      retweets: 1800,
    }),
    act({
      id: "am7",
      kind: "tweet",
      text: "Quad strengthens India in the Indo-Pacific — good for trade security too.",
      createdAt: daysAgo(72),
      likes: 6000,
      retweets: 800,
    }),
  ],
};

/** Business / tech economy — Center · National */
const nandanNilekani: FigureHandle = {
  handle: "nandannilekani",
  displayName: "Nandan Nilekani",
  domain: "business",
  blurb: "Business · interpretive demo",
  note: "Interpretive corpus: digital public goods, data security, pragmatic national capability.",
  activities: [
    act({
      id: "nn1",
      kind: "tweet",
      text: "Data localisation for security can coexist with innovation if designed well.",
      createdAt: daysAgo(6),
      likes: 5000,
      retweets: 700,
    }),
    act({
      id: "nn2",
      kind: "tweet",
      text: "Ease of doing business in digital public infrastructure creates more prosperity than heavy planning alone.",
      createdAt: daysAgo(15),
      likes: 4000,
      retweets: 600,
    }),
    act({
      id: "nn3",
      kind: "tweet",
      text: "Atmanirbhar in critical minerals and chips is economic security — strengthen our borders of tech.",
      createdAt: daysAgo(24),
      likes: 6500,
      retweets: 900,
    }),
    act({
      id: "nn4",
      kind: "tweet",
      text: "Integrity of the Union and rule of law attract long-term capital. Kashmir is an integral part of India.",
      createdAt: daysAgo(35),
      likes: 3000,
      retweets: 400,
    }),
    act({
      id: "nn5",
      kind: "quote",
      text: "China is the real threat in digital supply chains. Quad strengthens India.",
      createdAt: daysAgo(48),
      likes: 4500,
      retweets: 650,
    }),
    act({
      id: "nn6",
      kind: "tweet",
      text: "Stop privatisation of core digital IDs? Public digital rails can be public goods — strengthen PSUs where needed.",
      createdAt: daysAgo(61),
      likes: 3500,
      retweets: 500,
    }),
    act({
      id: "nn7",
      kind: "tweet",
      text: "Stand with Indian Army. National capability includes both code and constitution.",
      createdAt: daysAgo(75),
      likes: 5000,
      retweets: 700,
    }),
  ],
};

/** Political — defence · Right · National */
const rajnathSingh: FigureHandle = {
  handle: "rajnathsingh",
  displayName: "Rajnath Singh",
  domain: "political",
  blurb: "Political · interpretive demo",
  note: "Interpretive corpus: defence readiness, territorial integrity, adversary realism.",
  activities: [
    act({
      id: "rs1",
      kind: "tweet",
      text: "Indigenous defence production and theater commands strengthen India. Stand with Indian Army.",
      createdAt: daysAgo(3),
      likes: 20000,
      retweets: 3500,
    }),
    act({
      id: "rs2",
      kind: "tweet",
      text: "China is the real threat. Strengthen our borders. No reciprocity no peace.",
      createdAt: daysAgo(10),
      likes: 22000,
      retweets: 4000,
    }),
    act({
      id: "rs3",
      kind: "tweet",
      text: "Pakistan sponsors terror. Zero tolerance for terror. PoK is India.",
      createdAt: daysAgo(17),
      likes: 25000,
      retweets: 4500,
    }),
    act({
      id: "rs4",
      kind: "tweet",
      text: "Kashmir is an integral part of India. Reject secession — integrity of the Union.",
      createdAt: daysAgo(26),
      likes: 18000,
      retweets: 3000,
    }),
    act({
      id: "rs5",
      kind: "quote",
      text: "Arunachal is India. Quad strengthens India.",
      createdAt: daysAgo(38),
      likes: 14000,
      retweets: 2200,
    }),
    act({
      id: "rs6",
      kind: "tweet",
      text: "Law and order first. Infiltrators must go.",
      createdAt: daysAgo(52),
      likes: 16000,
      retweets: 2800,
    }),
    act({
      id: "rs7",
      kind: "tweet",
      text: "Atmanirbhar in defence. Freebies destroy fiscal space needed for security.",
      createdAt: daysAgo(68),
      likes: 9000,
      retweets: 1400,
    }),
  ],
};

export const FIGURE_HANDLES: FigureHandle[] = [
  narendraModi,
  rahulGandhi,
  nirmalaSitharaman,
  anandMahindra,
  nandanNilekani,
  rajnathSingh,
];

export function findFigureHandle(raw: string): FigureHandle | undefined {
  const h = raw.replace(/^@/, "").toLowerCase();
  return FIGURE_HANDLES.find((d) => d.handle === h);
}
