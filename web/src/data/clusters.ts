import type { Coords } from "./personalities";

export type ThinkingCluster = {
  id: string;
  name: string;
  blurb: string;
  centroid: Coords;
};

export const clusters: ThinkingCluster[] = [
  {
    id: "market-libertarian",
    name: "Market Libertarian",
    blurb: "Maximize markets and personal liberty; culture is secondary to freedom.",
    centroid: { economic: 75, authority: -70, cultural: 5 },
  },
  {
    id: "progressive-redistributive",
    name: "Progressive Redistributive",
    blurb: "Equalize outcomes, expand rights, and lean cosmopolitan.",
    centroid: { economic: -70, authority: -40, cultural: -60 },
  },
  {
    id: "national-conservative",
    name: "National Conservative",
    blurb: "Markets with borders: order, tradition, and national priority.",
    centroid: { economic: 35, authority: 45, cultural: 70 },
  },
  {
    id: "authoritarian-left",
    name: "Authoritarian Left",
    blurb: "State-led equality with strong collective discipline.",
    centroid: { economic: -55, authority: 70, cultural: 20 },
  },
  {
    id: "technocratic-centrist",
    name: "Technocratic Centrist",
    blurb: "Managed capitalism, institutional stability, mild cosmopolitanism.",
    centroid: { economic: 15, authority: 15, cultural: -30 },
  },
  {
    id: "religious-traditionalist",
    name: "Religious Traditionalist",
    blurb: "Sacred norms and communal authority shape public life.",
    centroid: { economic: 0, authority: 40, cultural: 80 },
  },
  {
    id: "populist-nationalist",
    name: "Populist Nationalist",
    blurb: "People versus elites: sovereignty, identity, and strong leadership.",
    centroid: { economic: 10, authority: 55, cultural: 75 },
  },
  {
    id: "open-society-liberal",
    name: "Open Society Liberal",
    blurb: "Pluralist institutions, global civil society, regulated markets.",
    centroid: { economic: -20, authority: -40, cultural: -65 },
  },
];
