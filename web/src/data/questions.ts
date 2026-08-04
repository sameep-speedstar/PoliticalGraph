export type Axis = "economic" | "authority" | "cultural";

export type Question = {
  id: string;
  text: string;
  axis: Axis;
  /** +1 means Agree pushes toward positive pole; −1 reverses */
  direction: 1 | -1;
  weight: number;
  section: "politics" | "religion" | "society";
};

export const likertLabels = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
] as const;

/**
 * Likert statements. Balanced reverse-coding across axes.
 * Keep language concrete — avoid partisan tribal shibboleths where possible.
 */
export const questions: Question[] = [
  // Economic
  {
    id: "e1",
    text: "A fair society actively redistributes wealth from the rich to the poor.",
    axis: "economic",
    direction: -1,
    weight: 1.2,
    section: "politics",
  },
  {
    id: "e2",
    text: "Private enterprise and free markets create more prosperity than government planning.",
    axis: "economic",
    direction: 1,
    weight: 1.3,
    section: "politics",
  },
  {
    id: "e3",
    text: "Healthcare, education, and housing should be guaranteed by the state regardless of ability to pay.",
    axis: "economic",
    direction: -1,
    weight: 1.1,
    section: "politics",
  },
  {
    id: "e4",
    text: "High earners deserve to keep most of what they make; heavy taxation punishes success.",
    axis: "economic",
    direction: 1,
    weight: 1.0,
    section: "politics",
  },
  {
    id: "e5",
    text: "Strategic industries should be nationalized or tightly directed by the government.",
    axis: "economic",
    direction: -1,
    weight: 1.0,
    section: "politics",
  },
  {
    id: "e6",
    text: "Labor unions and workplace regulations usually do more harm than good for the economy.",
    axis: "economic",
    direction: 1,
    weight: 0.9,
    section: "politics",
  },

  // Authority
  {
    id: "a1",
    text: "Public order and safety justify strong police powers even if some liberties are reduced.",
    axis: "authority",
    direction: 1,
    weight: 1.2,
    section: "politics",
  },
  {
    id: "a2",
    text: "People should be free to say almost anything, including speech that offends or unsettles society.",
    axis: "authority",
    direction: -1,
    weight: 1.2,
    section: "society",
  },
  {
    id: "a3",
    text: "In a crisis, a decisive leader should be able to override slow democratic procedures.",
    axis: "authority",
    direction: 1,
    weight: 1.3,
    section: "politics",
  },
  {
    id: "a4",
    text: "Government surveillance of citizens is a greater danger than the threats it claims to stop.",
    axis: "authority",
    direction: -1,
    weight: 1.1,
    section: "politics",
  },
  {
    id: "a5",
    text: "Obedience to legitimate authority is a civic virtue that modern societies undervalue.",
    axis: "authority",
    direction: 1,
    weight: 1.0,
    section: "society",
  },
  {
    id: "a6",
    text: "Drug use, personal lifestyle choices, and private morality are not the state's business.",
    axis: "authority",
    direction: -1,
    weight: 1.0,
    section: "society",
  },

  // Cultural / identity / religion
  {
    id: "c1",
    text: "A nation should prioritize its own citizens' culture, borders, and traditions over global obligations.",
    axis: "cultural",
    direction: 1,
    weight: 1.3,
    section: "society",
  },
  {
    id: "c2",
    text: "Diversity of cultures and open migration generally strengthen a country.",
    axis: "cultural",
    direction: -1,
    weight: 1.2,
    section: "society",
  },
  {
    id: "c3",
    text: "Religious faith should play a visible role in public life and lawmaking.",
    axis: "cultural",
    direction: 1,
    weight: 1.2,
    section: "religion",
  },
  {
    id: "c4",
    text: "Society improves when it moves away from traditional family and gender norms.",
    axis: "cultural",
    direction: -1,
    weight: 1.1,
    section: "society",
  },
  {
    id: "c5",
    text: "International institutions and global elites undermine ordinary people's sovereignty.",
    axis: "cultural",
    direction: 1,
    weight: 1.0,
    section: "politics",
  },
  {
    id: "c6",
    text: "My moral compass does not depend on any religion or sacred tradition.",
    axis: "cultural",
    direction: -1,
    weight: 0.9,
    section: "religion",
  },
  {
    id: "c7",
    text: "Preserving a shared national language and historical narrative should be a government goal.",
    axis: "cultural",
    direction: 1,
    weight: 1.0,
    section: "society",
  },
  {
    id: "c8",
    text: "Criticizing your own country's history and symbols is often a form of necessary honesty.",
    axis: "cultural",
    direction: -1,
    weight: 0.8,
    section: "society",
  },
];

export const admireOptions = [
  { id: "george-soros", label: "George Soros" },
  { id: "elon-musk", label: "Elon Musk" },
  { id: "narendra-modi", label: "Narendra Modi" },
  { id: "donald-trump", label: "Donald Trump" },
  { id: "xi-jinping", label: "Xi Jinping" },
  { id: "jordan-peterson", label: "Jordan Peterson" },
  { id: "lee-kuan-yew", label: "Lee Kuan Yew" },
  { id: "milton-friedman", label: "Milton Friedman" },
  { id: "mahatma-gandhi", label: "Mahatma Gandhi" },
  { id: "swami-vivekananda", label: "Swami Vivekananda" },
  { id: "aoc", label: "Alexandria Ocasio-Cortez" },
  { id: "bernie-sanders", label: "Bernie Sanders" },
  { id: "javier-milei", label: "Javier Milei" },
  { id: "amartya-sen", label: "Amartya Sen" },
  { id: "none", label: "None of these / prefer not to say" },
] as const;

export const sectionMeta: Record<
  Question["section"],
  { title: string; blurb: string }
> = {
  politics: {
    title: "Politics & power",
    blurb: "How should wealth and the state relate?",
  },
  society: {
    title: "Society & liberty",
    blurb: "Order, speech, and who belongs.",
  },
  religion: {
    title: "Faith & meaning",
    blurb: "Sacred tradition versus secular pluralism.",
  },
};
