export type Confidence = "high" | "medium" | "low";

export type Coords = {
  /** −100 equality … +100 markets */
  economic: number;
  /** −100 libertarian … +100 authoritarian */
  authority: number;
  /** −100 cosmopolitan … +100 particularist / traditional */
  cultural: number;
};

import type { EvidenceRow, PublishStatus } from "@/lib/publishGate";
export type { EvidenceRow, PublishStatus };

export type Personality = {
  id: string;
  name: string;
  shortName: string;
  roles: string[];
  country: string;
  coords: Coords;
  confidence: Confidence;
  tags: string[];
  summary: string;
  rationale: string;
  sources: { title: string; url?: string }[];
  asOf: string;
  /** Stage 2 trust fields — hydrated if omitted on seeds */
  status: PublishStatus;
  evidence: EvidenceRow[];
  approvedBy?: string;
  approvedAt?: string;
};

/** Seed shape before hydrate (status/evidence optional). */
export type PersonalitySeed = Omit<Personality, "status" | "evidence"> & {
  status?: PublishStatus;
  evidence?: EvidenceRow[];
  approvedBy?: string;
  approvedAt?: string;
};

/**
 * Hand-scored MVP seeds from publicly known positions, rhetoric, and institutional roles.
 * Coordinates are interpretive composites — see DESIGN.md and /methodology.
 * Not endorsements. Uncertainty is reflected in `confidence`.
 * Stage 2: omit status/evidence → hydrated as published with seed evidence rows.
 */
export const personalities: PersonalitySeed[] = [
  {
    id: "george-soros",
    name: "George Soros",
    shortName: "Soros",
    roles: ["Investor", "Philanthropist", "Open Society founder"],
    country: "United States / Hungary (origin)",
    coords: { economic: -25, authority: -45, cultural: -70 },
    confidence: "high",
    tags: ["globalist", "open-society", "philanthropy", "markets-with-regulation"],
    summary:
      "Market participant who funds transnational civil-society and liberal-democratic causes; culturally cosmopolitan and skeptical of ethno-national politics.",
    rationale:
      "Public writings favor open societies and constrained majoritarianism; Open Society grants historically support migration/rights NGOs and anti-corruption work; economically accepts markets but backs redistribution and regulation via philanthropy and advocacy.",
    sources: [
      { title: "Open Society Foundations — mission & grant themes" },
      { title: "The Alchemy of Finance / political essays (public record)" },
      { title: "Reporting on OSF political giving (major outlets)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "elon-musk",
    name: "Elon Musk",
    shortName: "Musk",
    roles: ["CEO", "Technologist", "Owner of X"],
    country: "United States / South Africa (origin)",
    coords: { economic: 70, authority: -25, cultural: 35 },
    confidence: "medium",
    tags: ["tech-acceleration", "free-speech-rhetoric", "anti-woke", "markets"],
    summary:
      "Strongly market- and tech-acceleration oriented; rhetorically libertarian on speech, increasingly aligned with cultural particularism and immigration restriction in public posts.",
    rationale:
      "Business career and statements favor deregulation and private enterprise (high +X); opposes much speech regulation (−Y) while endorsing strong borders and criticizing progressive cultural institutions (+Z drift). Positions shift publicly — medium confidence.",
    sources: [
      { title: "Public posts and interviews on X / legacy media" },
      { title: "Company lobbying & regulatory disputes (Tesla, SpaceX, X)" },
      { title: "Statements on immigration, DEI, and censorship" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "narendra-modi",
    name: "Narendra Modi",
    shortName: "Modi",
    roles: ["Prime Minister of India", "BJP leader"],
    country: "India",
    coords: { economic: 25, authority: 55, cultural: 75 },
    confidence: "high",
    tags: ["nationalist", "hindu-majoritarian", "development-state", "strong-executive"],
    summary:
      "Development-oriented economic nationalism with a strong executive style and cultural majoritarianism rooted in Hindu nationalist politics.",
    rationale:
      "Economic reforms mixed with industrial policy and welfare delivery (mild +X); centralization of power, security legislation, and party discipline (+Y); Hindutva cultural framing and citizenship/migration politics (+Z).",
    sources: [
      { title: "BJP manifestos and campaign themes" },
      { title: "Legislative record (e.g. citizenship, security, economic reforms)" },
      { title: "RSS/BJP organizational history (public scholarship)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "donald-trump",
    name: "Donald Trump",
    shortName: "Trump",
    roles: ["US President", "Businessman", "Republican leader"],
    country: "United States",
    coords: { economic: 40, authority: 50, cultural: 70 },
    confidence: "high",
    tags: ["populist", "nationalist", "protectionist", "strongman-rhetoric"],
    summary:
      "Populist nationalism: protectionist economics, strong-executive rhetoric, and cultural particularism around nation, borders, and traditional identity.",
    rationale:
      "Tax cuts and deregulation (+X) tempered by tariffs/industrial nationalism; law-and-order and expansive executive claims (+Y); immigration restriction and culture-war framing (+Z).",
    sources: [
      { title: "Campaign platforms 2016–2024" },
      { title: "Executive actions and public rallies (transcripts)" },
      { title: "FEC / PAC funding patterns (public)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "xi-jinping",
    name: "Xi Jinping",
    shortName: "Xi",
    roles: ["President of China", "CCP General Secretary"],
    country: "China",
    coords: { economic: -40, authority: 90, cultural: 60 },
    confidence: "high",
    tags: ["one-party", "state-capitalism", "national-rejuvenation", "surveillance"],
    summary:
      "Leninist one-party authority with state-directed capitalism, high social control, and civilizational-national narrative.",
    rationale:
      "Party control over private capital and common-prosperity campaigns (−X relative to Western markets); extensive surveillance, censorship, and centralized power (+Y extreme); nationalism and cultural confidence campaigns (+Z).",
    sources: [
      { title: "CCP congress reports and Xi speeches (official translations)" },
      { title: "Policy on tech firms, Xinjiang, Hong Kong, zero-COVID era governance" },
      { title: "Academic analyses of Xi-era centralization" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "aoc",
    name: "Alexandria Ocasio-Cortez",
    shortName: "AOC",
    roles: ["US Representative", "Democratic Socialist"],
    country: "United States",
    coords: { economic: -75, authority: -40, cultural: -65 },
    confidence: "high",
    tags: ["democratic-socialist", "climate", "social-justice"],
    summary:
      "Democratic-socialist economics, civil-liberties-leaning on many social issues, and strongly cosmopolitan progressive cultural politics.",
    rationale:
      "Green New Deal / tax-the-rich agenda (−X); generally anti-authoritarian on protest and reproductive rights (−Y) with some regulatory expansion; progressive identity and migration politics (−Z).",
    sources: [
      { title: "Congressional voting record and resolutions" },
      { title: "DSA-aligned platform statements" },
      { title: "Public interviews and campaign sites" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "bernie-sanders",
    name: "Bernie Sanders",
    shortName: "Sanders",
    roles: ["US Senator", "Democratic Socialist"],
    country: "United States",
    coords: { economic: -80, authority: -35, cultural: -45 },
    confidence: "high",
    tags: ["social-democrat", "labor", "anti-oligarchy"],
    summary:
      "Class-first economic left with skepticism of corporate power; culturally progressive but less identity-centric than younger progressive peers.",
    rationale:
      "Medicare for All, wealth taxes, union power (−X); civil liberties tradition with populist majoritarianism on economics (−Y mild); progressive on social issues, less cosmopolitan-finance aligned than OSF liberalism (−Z moderate).",
    sources: [
      { title: "Presidential campaign platforms 2016/2020" },
      { title: "Senate record and floor speeches" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "emmanuel-macron",
    name: "Emmanuel Macron",
    shortName: "Macron",
    roles: ["President of France"],
    country: "France",
    coords: { economic: 35, authority: 25, cultural: -40 },
    confidence: "medium",
    tags: ["technocratic", "pro-EU", "liberal-center"],
    summary:
      "Pro-market technocratic center with strong executive instincts in crises and a cosmopolitan EU identity.",
    rationale:
      "Labor/business reforms and investor-friendly policy (+X); use of Article 49.3 and security measures (+Y mild); pro-EU, secular republicanism with managed immigration (−Z).",
    sources: [
      { title: "La République En Marche / Renaissance platforms" },
      { title: "Pension and labor reform episodes; EU speeches" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "vladimir-putin",
    name: "Vladimir Putin",
    shortName: "Putin",
    roles: ["President of Russia"],
    country: "Russia",
    coords: { economic: -15, authority: 85, cultural: 80 },
    confidence: "high",
    tags: ["autocrat", "civilizational-nationalist", "security-state"],
    summary:
      "Personalist authoritarian rule with security-state primacy and Orthodox-civilizational nationalist ideology.",
    rationale:
      "Oligarchic state capitalism near center-left on markets (−X mild); extreme concentration of power and repression (+Y); anti-liberal cultural politics and imperial nationalism (+Z).",
    sources: [
      { title: "Presidential addresses and Valdai speeches" },
      { title: "Legislation on 'foreign agents', LGBTQ, opposition" },
      { title: "Reporting on siloviki governance" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "marine-le-pen",
    name: "Marine Le Pen",
    shortName: "Le Pen",
    roles: ["French opposition leader", "National Rally"],
    country: "France",
    coords: { economic: -10, authority: 45, cultural: 75 },
    confidence: "high",
    tags: ["nationalist", "anti-immigration", "welfare-chauvinist"],
    summary:
      "National-preference politics: immigration restriction, cultural particularism, and welfare for nationals over market orthodoxy.",
    rationale:
      "Economic program often protectionist/welfare-chauvinist (near 0/−X); strong-state on borders and policing (+Y); French identity and anti-Islamism in public sphere (+Z).",
    sources: [
      { title: "National Rally manifestos" },
      { title: "Presidential debate platforms" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "justin-trudeau",
    name: "Justin Trudeau",
    shortName: "Trudeau",
    roles: ["Former Prime Minister of Canada"],
    country: "Canada",
    coords: { economic: -30, authority: 10, cultural: -55 },
    confidence: "medium",
    tags: ["liberal", "multicultural", "centrist-left"],
    summary:
      "Center-left economics, occasional emergency powers, and strongly multicultural/cosmopolitan branding.",
    rationale:
      "Carbon tax, social spending (−X mild); Emergencies Act use (+Y mild spike); immigration and multiculturalism as identity (−Z).",
    sources: [
      { title: "Liberal Party platforms" },
      { title: "Emergencies Act episode (public inquiry record)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "ron-paul",
    name: "Ron Paul",
    shortName: "Paul",
    roles: ["Former US Representative", "Libertarian icon"],
    country: "United States",
    coords: { economic: 85, authority: -80, cultural: 15 },
    confidence: "high",
    tags: ["libertarian", "gold-standard", "non-intervention"],
    summary:
      "Archetypal market libertarian: hard-money economics, maximal civil liberties, mild cultural traditionalism without theocratic politics.",
    rationale:
      "Austrian / end-the-Fed economics (+X extreme); anti-war, anti-surveillance, anti-drug-war (−Y extreme); socially conservative personal views but politics prioritize liberty (mild +Z).",
    sources: [
      { title: "The Revolution; campaign platforms" },
      { title: "Congressional voting record" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "greta-thunberg",
    name: "Greta Thunberg",
    shortName: "Thunberg",
    roles: ["Climate activist"],
    country: "Sweden",
    coords: { economic: -60, authority: -20, cultural: -50 },
    confidence: "medium",
    tags: ["climate", "anti-extraction", "youth-movement"],
    summary:
      "Climate-first politics pushing rapid economic restructuring, civil disobedience, and global commons framing.",
    rationale:
      "Demands system change away from fossil capitalism (−X); protest-oriented vs state coercion (−Y) though open to strong climate regulation; cosmopolitan justice framing (−Z).",
    sources: [
      { title: "UN and public speeches" },
      { title: "Fridays for Future positions" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "pope-francis",
    name: "Pope Francis",
    shortName: "Francis",
    roles: ["Head of Catholic Church"],
    country: "Vatican / Argentina (origin)",
    coords: { economic: -55, authority: 20, cultural: 25 },
    confidence: "medium",
    tags: ["catholic-social-teaching", "migration", "anti-neoliberal"],
    summary:
      "Catholic social teaching: critique of market excess, institutional church authority, pastoral openness on migration with traditional doctrine on many moral issues.",
    rationale:
      "Laudato Si' / Evangelii Gaudium critique of inequality (−X); hierarchical church (+Y mild); mixes cosmopolitan mercy on migrants with doctrinal traditionalism (mid +Z).",
    sources: [
      { title: "Papal encyclicals (public)" },
      { title: "Addresses on migration and capitalism" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "jacinda-ardern",
    name: "Jacinda Ardern",
    shortName: "Ardern",
    roles: ["Former Prime Minister of New Zealand"],
    country: "New Zealand",
    coords: { economic: -40, authority: 30, cultural: -50 },
    confidence: "medium",
    tags: ["social-democrat", "public-health-state", "progressive"],
    summary:
      "Social-democratic welfare politics with willingness to use strong public-health authority and progressive cultural leadership.",
    rationale:
      "Welfare and gun reforms (−X); COVID lockdown/mandate era (+Y); progressive social policy and inclusive national branding (−Z).",
    sources: [
      { title: "Labour NZ platforms and COVID policy record" },
      { title: "Public speeches on well-being budget / Christchurch response" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "angela-merkel",
    name: "Angela Merkel",
    shortName: "Merkel",
    roles: ["Former Chancellor of Germany"],
    country: "Germany",
    coords: { economic: 15, authority: 15, cultural: -25 },
    confidence: "high",
    tags: ["christian-democrat", "consensus", "EU-stabilizer"],
    summary:
      "Pragmatic center: ordoliberal economics, institutional stability, and eventual openness on migration within an EU frame.",
    rationale:
      "Fiscal caution with social market economy (mild +X); rule-bound executive (mild +Y); 2015 migration decision and EU cosmopolitanism (−Z moderate).",
    sources: [
      { title: "CDU era policy record" },
      { title: "Eurocrisis and 2015 migration decisions (public record)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "jordan-peterson",
    name: "Jordan Peterson",
    shortName: "Peterson",
    roles: ["Psychologist", "Public intellectual", "Author"],
    country: "Canada",
    coords: { economic: 45, authority: -15, cultural: 55 },
    confidence: "medium",
    tags: ["individual-responsibility", "anti-compelled-speech", "traditionalist"],
    summary:
      "Emphasizes individual responsibility and skepticism of compelled speech and progressive identity politics, with broadly market-friendly instincts.",
    rationale:
      "Public lectures criticize equity mandates and compelled pronouns (−Y on speech, +Z cultural); economic commentary leans free-market (+X); not a classical anarchist libertarian.",
    sources: [
      { title: "University lectures and parliamentary testimony (Canada)" },
      { title: "12 Rules for Life / public interviews" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "lee-kuan-yew",
    name: "Lee Kuan Yew",
    shortName: "LKY",
    roles: ["Founding Prime Minister of Singapore"],
    country: "Singapore",
    coords: { economic: 55, authority: 70, cultural: 40 },
    confidence: "high",
    tags: ["developmental-state", "order", "meritocracy"],
    summary:
      "Market-oriented developmental state with tight social and political control and strong national discipline.",
    rationale:
      "Open trade and investor-friendly policy (+X); strict speech/order and one-party dominance historically (+Y); multicultural but tightly managed national identity (+Z mild).",
    sources: [
      { title: "The Singapore Story; Hard Truths interviews" },
      { title: "PAP governance record (public histories)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "milton-friedman",
    name: "Milton Friedman",
    shortName: "Friedman",
    roles: ["Economist", "Nobel laureate"],
    country: "United States",
    coords: { economic: 90, authority: -60, cultural: 0 },
    confidence: "high",
    tags: ["monetarist", "school-choice", "classic-liberal"],
    summary:
      "Archetypal market liberal: minimize state in economy and personal life; culture mostly outside the model.",
    rationale:
      "Capitalism and Freedom agenda (+X extreme); anti-draft, pro-drug-legalization arguments (−Y); cultural axis near center in political program.",
    sources: [
      { title: "Capitalism and Freedom; Free to Choose" },
      { title: "Public essays on school vouchers and monetary policy" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "mahatma-gandhi",
    name: "Mahatma Gandhi",
    shortName: "Gandhi",
    roles: ["Independence leader", "Ethicist"],
    country: "India",
    coords: { economic: -50, authority: -55, cultural: 35 },
    confidence: "medium",
    tags: ["nonviolence", "swadeshi", "moral-politics"],
    summary:
      "Moral-political program of nonviolence, village economy skepticism of industrial centralization, and religiously inflected public ethics.",
    rationale:
      "Swadeshi and trusteeship lean anti-industrial capitalism (−X); civil disobedience against imperial coercion (−Y); Hindu-informed but pluralist practice (mild +Z).",
    sources: [
      { title: "Hind Swaraj; collected works (public domain / archives)" },
      { title: "Scholarship on Gandhian political economy" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "swami-vivekananda",
    name: "Swami Vivekananda",
    shortName: "Vivekananda",
    roles: ["Hindu monk", "Philosopher", "Reformers’ icon"],
    country: "India",
    coords: { economic: -10, authority: -20, cultural: 50 },
    confidence: "low",
    tags: ["vedanta", "spiritual-nationalism", "service"],
    summary:
      "Spiritual-national renewal framed through Vedanta, service, and civilizational confidence rather than party economics.",
    rationale:
      "Sparse modern policy vector — cultural/religious particularism (+Z) with reformist education/service ethos; economic/authority inferred weakly (low confidence).",
    sources: [
      { title: "Chicago Address and Complete Works (public)" },
      { title: "Historical reception in Indian nationalism (scholarship)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "barack-obama",
    name: "Barack Obama",
    shortName: "Obama",
    roles: ["Former US President"],
    country: "United States",
    coords: { economic: -25, authority: 5, cultural: -45 },
    confidence: "high",
    tags: ["liberal", "institutionalist", "multicultural"],
    summary:
      "Center-left economics within market capitalism, institutional presidency, and cosmopolitan liberal cultural politics.",
    rationale:
      "ACA and progressive taxation (−X mild); drone/surveillance continuity (+Y mild); immigration reform rhetoric and multicultural coalition (−Z).",
    sources: [
      { title: "Presidential record and DNC platforms" },
      { title: "Speeches on race, healthcare, and foreign policy" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "giorgia-meloni",
    name: "Giorgia Meloni",
    shortName: "Meloni",
    roles: ["Prime Minister of Italy"],
    country: "Italy",
    coords: { economic: 20, authority: 40, cultural: 70 },
    confidence: "high",
    tags: ["national-conservative", "anti-illegal-migration", "EU-pragmatic"],
    summary:
      "National-conservative government: family/nation cultural frame, migration restriction, markets with industrial preference.",
    rationale:
      "Business-friendly with state direction (mild +X); law-and-order and executive coalition politics (+Y); natalist/national identity agenda (+Z).",
    sources: [
      { title: "Brothers of Italy platforms and government program" },
      { title: "Public addresses on migration and EU" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "javier-milei",
    name: "Javier Milei",
    shortName: "Milei",
    roles: ["President of Argentina"],
    country: "Argentina",
    coords: { economic: 85, authority: -50, cultural: 25 },
    confidence: "medium",
    tags: ["anarcho-capitalist-rhetoric", "anti-statist", "chainsaw"],
    summary:
      "Radical market liberalization and anti-statist rhetoric with culturally conservative social signaling.",
    rationale:
      "Dollarization/austerity and ministry cuts (+X extreme); anti-caste-state rhetoric (−Y); socially conservative alliances (mild +Z).",
    sources: [
      { title: "Campaign platforms and inaugural economic measures" },
      { title: "Public interviews and congressional record" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "nayib-bukele",
    name: "Nayib Bukele",
    shortName: "Bukele",
    roles: ["President of El Salvador"],
    country: "El Salvador",
    coords: { economic: 30, authority: 80, cultural: 35 },
    confidence: "medium",
    tags: ["security-first", "bitcoin", "strongman-popular"],
    summary:
      "Security-first governance with emergency powers against gangs, tech-forward branding, and concentrated executive authority.",
    rationale:
      "Bitcoin/business branding (mild +X); mass incarceration and emergency rule (+Y extreme); nationalist popular aesthetics (mild +Z).",
    sources: [
      { title: "State of exception policies (public reporting)" },
      { title: "Bitcoin legal-tender experiment; presidential addresses" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "volodymyr-zelenskyy",
    name: "Volodymyr Zelenskyy",
    shortName: "Zelenskyy",
    roles: ["President of Ukraine"],
    country: "Ukraine",
    coords: { economic: 10, authority: 35, cultural: -15 },
    confidence: "medium",
    tags: ["wartime-executive", "pro-EU", "national-survival"],
    summary:
      "Wartime centralization with pro-EU orientation and national-survival framing under invasion.",
    rationale:
      "Mixed wartime economy (near center X); martial law and conscription (+Y); European integration with civic nationalism (mild −Z/+national).",
    sources: [
      { title: "Wartime addresses and EU accession rhetoric" },
      { title: "Martial law decrees (public record)" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "recep-erdogan",
    name: "Recep Tayyip Erdoğan",
    shortName: "Erdoğan",
    roles: ["President of Turkey"],
    country: "Turkey",
    coords: { economic: -5, authority: 75, cultural: 70 },
    confidence: "high",
    tags: ["populist-islamist", "executive-presidency", "nationalist"],
    summary:
      "Executive-heavy populism combining religious-conservative cultural politics with nationalist state power.",
    rationale:
      "Statist/populist economics (near 0/−X); post-2017 presidential system and media pressure (+Y); AKP religious-conservative identity (+Z).",
    sources: [
      { title: "AKP platforms and constitutional referendum record" },
      { title: "Public speeches on family, religion, and sovereignty" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "malala-yousafzai",
    name: "Malala Yousafzai",
    shortName: "Malala",
    roles: ["Education activist", "Nobel laureate"],
    country: "Pakistan / United Kingdom",
    coords: { economic: -30, authority: -40, cultural: -35 },
    confidence: "medium",
    tags: ["girls-education", "human-rights", "liberal-muslim"],
    summary:
      "Rights-based education activism against religious-extremist coercion; culturally plural and globally networked.",
    rationale:
      "Public-goods education focus (−X mild); opposition to theocratic coercion (−Y); cosmopolitan human-rights frame (−Z).",
    sources: [
      { title: "I Am Malala; UN speeches" },
      { title: "Malala Fund advocacy positions" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "amartya-sen",
    name: "Amartya Sen",
    shortName: "Sen",
    roles: ["Economist", "Philosopher", "Nobel laureate"],
    country: "India / United Kingdom",
    coords: { economic: -55, authority: -45, cultural: -40 },
    confidence: "high",
    tags: ["capabilities", "welfare", "secular-liberal"],
    summary:
      "Capabilities approach: development as freedom, skepticism of growth-only metrics, and defense of public reasoning.",
    rationale:
      "Famines/entitlements and social opportunity arguments (−X); anti-authoritarian developmentalism (−Y); secular plural India (−Z).",
    sources: [
      { title: "Development as Freedom; The Argumentative Indian" },
      { title: "Public essays on inequality and democracy" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "thomas-sowell",
    name: "Thomas Sowell",
    shortName: "Sowell",
    roles: ["Economist", "Social theorist"],
    country: "United States",
    coords: { economic: 75, authority: -35, cultural: 40 },
    confidence: "high",
    tags: ["constrained-vision", "markets", "anti-social-engineering"],
    summary:
      "Market-oriented social analysis skeptical of large-scale social engineering and race-preference policy.",
    rationale:
      "Basic Economics and discrimination studies (+X); limited-government instincts (−Y); culturally particularist on family/culture debates (+Z).",
    sources: [
      { title: "Knowledge and Decisions; Basic Economics" },
      { title: "Columns and Hoover Institution essays" },
    ],
    asOf: "2026-01-01",
  },
  {
    id: "rahul-gandhi",
    name: "Rahul Gandhi",
    shortName: "Rahul",
    roles: ["Indian opposition leader", "INC"],
    country: "India",
    coords: { economic: -40, authority: -25, cultural: -35 },
    confidence: "medium",
    tags: ["social-justice", "secular", "redistributive"],
    summary:
      "Opposition politics emphasizing redistribution, caste census/social justice themes, and secular-constitutional framing.",
    rationale:
      "Wealth redistribution and welfare rhetoric (−X); civil-liberties critique of strong-state security (−Y mild); secular/plural cultural politics (−Z).",
    sources: [
      { title: "INC campaign themes and parliamentary speeches" },
      { title: "Public interviews on inequality and constitutionalism" },
    ],
    asOf: "2026-01-01",
  },
];

import { canPublish, resolveTrustFields } from "@/lib/publishGate";

export function hydratePersonality(seed: PersonalitySeed): Personality {
  return resolveTrustFields(seed) as Personality;
}

/** Hydrated catalog. Prefer publishedFigures() for public UI. */
export const personalitiesHydrated: Personality[] =
  personalities.map(hydratePersonality);

/** Public atlas — only human-publishable figures. */
export function publishedFigures(
  catalog: Personality[] = personalitiesHydrated,
): Personality[] {
  return catalog.filter(
    (p) => p.status === "published" && canPublish(p.evidence),
  );
}

export function getPersonality(id: string) {
  return personalitiesHydrated.find((p) => p.id === id);
}

export function searchPersonalities(query: string) {
  const list = publishedFigures();
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.roles.some((r) => r.toLowerCase().includes(q)),
  );
}

export function personalitiesByRoleBucket() {
  const buckets = {
    politicians: [] as Personality[],
    intellectuals: [] as Personality[],
    activists: [] as Personality[],
    business: [] as Personality[],
    religious: [] as Personality[],
  };
  for (const p of publishedFigures()) {
    const roles = p.roles.join(" ").toLowerCase();
    if (/president|prime minister|chancellor|representative|senator|opposition|minister/.test(roles)) {
      buckets.politicians.push(p);
    } else if (/ceo|investor|technologist|business/.test(roles)) {
      buckets.business.push(p);
    } else if (/activist|nobel/.test(roles) && /activist|education|climate/.test(roles + p.tags.join(" "))) {
      buckets.activists.push(p);
    } else if (/pope|monk|swami|catholic|religious/.test(roles + p.tags.join(" "))) {
      buckets.religious.push(p);
    } else {
      buckets.intellectuals.push(p);
    }
  }
  return buckets;
}
