# PoliticalGraph — Product Design & Brainstorm

## The core insight

Left–right is a blunt instrument. People who share an "economic left" label can disagree violently on nationalism, religion, free speech, and authority. A useful map needs **at least three independent dimensions**, then places both individuals and public figures in the same space so similarity is geometric, not tribal branding.

**Promise to the user:** *You are not a label. You are a point in idea-space — and here are the people and thinking groups nearest to you.*

---

## The 3D model (v1 axes)

Each axis runs **−100 → +100**. Origin (0,0,0) is the pragmatic center.

| Axis | Negative pole (−) | Positive pole (+) | What it captures |
|------|-------------------|-------------------|------------------|
| **X — Economic** | Equality / redistribution / state provision | Markets / property / low intervention | Who should control capital and welfare |
| **Y — Authority** | Libertarian / civil liberties / constrained state | Authoritarian / order / strong executive | How much coercive power the state should have |
| **Z — Cultural identity** | Cosmopolitan / secular-plural / open borders ethos | Particularist / traditional-religious / national priority | Who "we" are, and what binds the polity |

### Why these three (and not others)

- They are **partially orthogonal** in real populations (classic Political Compass is X×Y; Z separates Modi/Trump-style national conservatives from classical liberals and from theocratic authoritarians).
- They absorb the signals the brief asks for: **politics, religion, ideal-person affinity, statement agreement**.
- They stay explainable in a UI legend — critical for trust.

### Secondary tags (not axes, but rich metadata)

Returned alongside the point for narrative, not geometry:

- **Religious disposition:** secular ↔ devout (feeds Z slightly, shown as a tag)
- **Institutional trust:** establishment ↔ populist (cluster flavor)
- **Ideal-person affinities:** soft prior + post-hoc validation ("you admire X; your score is near X")

Future v2 candidates if data supports independence: ecological stewardship, tech-optimism, foreign-policy hawkishness.

---

## Scoring individuals (questionnaire)

### Structure (~18–24 items, ~6–8 min)

1. **Statement battery (Likert 1–5)** — core of the score  
   Each item maps to one primary axis with weight ∈ {0.5, 1.0, 1.5}.  
   Reverse-coded items prevent acquiescence bias.

2. **Religious / worldview block** — 3–4 items  
   Directly nudges Z; also emits `religiosity` tag.

3. **Ideal person / admiration** — multi-select from curated figures + free text  
   Does **not** hard-set coordinates (that would circularize the product).  
   Used as: (a) soft Bayesian prior ±10 max, (b) "you said you admire X; distance = d" honesty check.

4. **Optional demographics** — country, age band (for cohort norms later; skippable).

### Math (transparent)

```
For each axis a:
  raw_a = Σ (likert_centered_i × weight_i × direction_i)  // likert_centered ∈ [-2,+2]
  score_a = clamp( 100 × raw_a / max_possible_raw_a , -100, 100 )
```

Ideal-person prior (optional, disclosed):

```
score' = (1 − α) × score + α × mean(admired_figures)   // α ≤ 0.15
```

### Thinking groups (clusters)

After scoring, assign nearest **archetype centroid** (curated, not ML for v1):

| Cluster | Typical region |
|---------|----------------|
| Market Libertarian | +X, −Y, mid/−Z |
| Progressive Redistributive | −X, −Y, −Z |
| National Conservative | mid/+X, mid/+Y, +Z |
| Authoritarian Left | −X, +Y, mid |
| Technocratic Centrist | near origin, slight −Z |
| Religious Traditionalist | mid, +Y, high +Z |
| Populist Nationalist | mid/−X or +X, +Y, +Z |

User sees: **primary cluster + distance to next two** ("you sit between National Conservative and Market Libertarian").

---

## Mapping famous personalities

### Principles

1. **Public sources only** — speeches, platforms, legislation, documented donations/PAC ties, company affiliations, court records, reputable reporting.
2. **Multi-signal composite**, never a single viral clip.
3. **Uncertainty bands** — show confidence (high/medium/low) and source footnotes; figures with sparse English-language coverage get wider error ellipsoids.
4. **Living document** — positions can drift; store `as_of` date and changelog.
5. **Disclaimer** — interpretive model, not moral judgment or endorsement.

### Signal taxonomy (for research pipeline)

| Signal | Examples | Axis bias |
|--------|----------|-----------|
| Economic policy | tax, welfare, nationalization, deregulation | X |
| Civil liberties vs order | speech, surveillance, emergency powers, policing | Y |
| Nation / migration / religion in public life | immigration stance, majoritarianism, church–state | Z |
| Funding & orgs | parties, PACs, NGOs, foundations | all (context) |
| Corporate/role incentives | ownership, board seats, state enterprise | X, Y |
| Rhetorical enemies & allies | who they praise/attack | soft all |

### MVP seed set (hand-scored with rationale notes)

George Soros, Elon Musk, Narendra Modi, Donald Trump, Xi Jinping, plus a balanced ring: Alexandria Ocasio-Cortez, Bernie Sanders, Emmanuel Macron, Angela Merkel (historical), Vladimir Putin, Justin Trudeau, Marine Le Pen, Jacinda Ardern, Ron Paul–style libertarian proxy, Pope Francis, Greta Thunberg, etc.

Each record:

```ts
{
  id, name, roles[], country,
  coords: { economic, authority, cultural },
  confidence: 'high' | 'medium' | 'low',
  tags[],
  summary,           // 2–3 sentences
  sources[],         // titles + urls
  asOf: ISO date
}
```

### Later: semi-automated research agent

1. Ingest speech/transcript corpora + structured vote databases.  
2. Classify passages into axis-relevant frames (LLM + human review).  
3. Propose coordinate deltas; human editor approves.  
4. Never auto-publish without review for living heads of state.

---

## Product surface (website)

### Free paths

1. **Take the map** — questionnaire → results: 3D point, cluster, nearest 5 figures, shareable link.  
2. **Explore figures** — search, filter by country/role, click node → dossier + location on graph.  
3. **Compare** — pin 2–3 figures + optional "you".

### UX of the 3D graph

- Orbit / pan / zoom; axis labels always visible.  
- Nodes sized by confidence or "influence" (optional).  
- User node distinct (pulse).  
- Click → side panel dossier.  
- Toggle: show only politicians / business / activists.  
- Mobile: simplified 2D projections (X–Y, X–Z, Y–Z) with "open 3D" on larger screens.

### Trust & ethics (non-negotiable)

- Clear methodology page.  
- No "your enemies" framing; nearest ≠ endorsement.  
- Opt-out / correction request for living persons.  
- No microtargeting ads sold against survey psychographics in v1.  
- GDPR-minded: survey can run fully client-side; optional account later.

---

## Technical MVP stack

- **Next.js (App Router) + TypeScript + Tailwind**  
- **react-three-fiber + drei** for the graph  
- **Zustand** for survey session state  
- **Static JSON** for personalities (CMS later)  
- Client-side scoring (no backend required for v1)

### Roadmap after MVP

1. Persist anonymous cohort heatmaps (privacy-preserving).  
2. Editor workflow for figure coordinates.  
3. Multilingual surveys with country-normed baselines.  
4. "Speech explorer" linking quotes to axis contributions.  
5. Ideal-person free-text → embedding nearest neighbor among figures.

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Accusations of bias in celebrity placement | Transparent sources + confidence + changelog |
| Users gaming toward a hero | Cap admiration prior; show raw vs adjusted |
| Axis collapse (X≈Z in some cultures) | Country packs; publish correlation diagnostics |
| Geopolitical sensitivity (Xi, etc.) | Stick to documented policy/behavior; avoid caricature |
| "Which thinking group" feels reductive | Always show continuous neighbors, not only one label |

---

## Success criteria for this build

1. A stranger can finish the survey and see themselves among named public figures in 3D.  
2. Searching "Modi" / "Musk" / "Soros" opens a dossier with coordinates and rationale.  
3. Methodology is readable in one sitting.  
4. Design feels like a **political atlas / constellation**, not a generic SaaS dashboard.
