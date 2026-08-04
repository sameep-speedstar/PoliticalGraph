export type Confidence = "high" | "medium" | "low";

export type Coords = {
  /** −100 equality … +100 markets */
  economic: number;
  /** −100 libertarian … +100 authoritarian */
  authority: number;
  /** −100 cosmopolitan … +100 particularist / traditional */
  cultural: number;
};

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
};

/**
 * Hand-scored MVP seeds from publicly known positions, rhetoric, and institutional roles.
 * Coordinates are interpretive composites — see DESIGN.md and /methodology.
 * Not endorsements. Uncertainty is reflected in `confidence`.
 */
export const personalities: Personality[] = [
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
];

export function getPersonality(id: string) {
  return personalities.find((p) => p.id === id);
}

export function searchPersonalities(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return personalities;
  return personalities.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.roles.some((r) => r.toLowerCase().includes(q)),
  );
}
