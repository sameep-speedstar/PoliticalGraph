# PoliGraph — Design Reconciliation

Comparison of the **PoliGraph master prompt** vs the **PoliticalGraph MVP**, and a recommended locked architecture.

**Tagline candidate:** *Understand how people think.*  
**Rename:** PoliticalGraph → **PoliGraph** (clearer product name).

---

## 1. What the master prompt gets right (keep)

| Principle | Why it matters |
|-----------|----------------|
| **Not good/bad, not religion ranking** | Trust + ethics; product is mapping, not persuasion |
| **Explainable, evidence-backed, confidence + sources** | Differentiator vs viral “political compass” clones |
| **12D internal model, 3D frontend viz** | Rich measurement without unreadable UI |
| **Entity + Evidence models** | Correct knowledge-graph shape for public figures |
| **Admiration as secondary weighting** | Soft signal; must not dominate |
| **Compare tool + “why similar”** | Turns curiosity into retention |
| **Organizations as nodes (later)** | Parties/NGOs/foundations are worldview carriers |
| **Timeline / vector drift (later)** | People change (Musk 2012→2024 is a product demo) |
| **Phased MVP → crawl → API** | Correct sequencing of ambition |

These should be **non-negotiable product principles**.

---

## 2. Where the master prompt overreaches (cut or defer)

### 2.1 Infra sprawl for Phase 1

AKS + Neo4j + Elasticsearch + Celery + Redis + Azure OpenAI + Azure AI Search + Dataflow + BigQuery + Pub/Sub + Cloud Run is a **platform company**, not an MVP.

**Risk:** months of plumbing before a single trustworthy figure dossier ships.

**Rule:** Phase 1 runs on the smallest stack that preserves the *product* principles (evidence, confidence, 12D vectors, 3D viz, similarity). Multi-cloud credit optimization is a **Phase 2+ ops strategy**, not a Day-1 requirement.

### 2.2 “100-question adaptive survey” vs completion

100 items is psychometrically nice and product-deadly for a free funnelsite. Adaptive testing (IRT / CAT) can reach ~100-item *information* with **~25–40 answered items** — that should be the goal, not a wall of 100.

### 2.3 Dimension redundancy

Several of the 12 poles are highly correlated in real data:

| Pair | Risk |
|------|------|
| D1 Liberty↔Authority vs D9 Civil liberties↔Security | Near-duplicate governance axis |
| D3 Secular↔Religious vs D11 Scientific↔Faith | Near-duplicate epistemology/sacred |
| D2 Globalism↔National vs D8 Cooperation↔Isolation | Overlapping foreign/identity |
| D4 Free market↔Redistribution vs D7 Merit↔Equality | Overlapping economic justice |

Without orthogonality checks, “12D” becomes noisy 4D with vanity labels.

### 2.4 “No score without evidence” — apply carefully

- **Public figures / orgs:** absolute rule. No vector without evidence rows.
- **Survey users:** their answers *are* the evidence. AI “rationale” should explain item→dimension mapping, not invent quotes about the user.
- Never fabricate sources for living persons.

### 2.5 Embeddings vs interpretable axes

Cosine similarity on opaque text embeddings is great for retrieval; **terrible** as the only score users see. The product promise is *explainable dimensions*. Use:

1. **Primary:** interpretable 12D (or fewer) Likert/evidence scores  
2. **Secondary:** text embeddings for evidence search / related docs  
3. **Display similarity:** distance on the ideological vector (cosine or Euclidean), with per-dimension breakdown

### 2.6 Auto-named clusters (HDBSCAN + LLM names)

Fine for exploration; dangerous as canonical labels without editorial review (“Civilizational Conservatives” can become a political weapon). Ship **curated cluster names** first; ML clusters as “experimental neighborhoods.”

### 2.7 Model / cloud specificity

“GPT-5 class,” exact Azure SKUs, Beam/Dataflow — implementation details that will churn. Lock **interfaces** (Evidence Extractor, Dimension Scorer), not vendor poetry.

---

## 3. Tension with the current MVP

| MVP (shipped) | Master prompt | Resolution |
|---------------|---------------|------------|
| 3 axes only | 12D internal | **12D scored; PCA/UMAP or fixed projection to 3D viz** |
| ~20 questions | 100 adaptive | **Bank of ~80–100; user answers ~28–36 (adaptive later)** |
| Curated figure coords | AI evidence pipeline | **Curated gold set Phase 1; AI proposes, human approves Phase 2** |
| Client-only Next.js | FastAPI + PG + Neo4j… | **Next.js + Postgres(+pgvector) Phase 1; graph/search later** |
| PoliticalGraph | PoliGraph | **Rename to PoliGraph** |
| Nearest 5 | Top 20 near/far | **Top 12 near + optional “farthest” in Compare** |
| Static dossiers | confidence + evidence required | **Every figure dimension needs ≥1 evidence item before publish** |

The MVP was the right **slice** of the vision. The master prompt is the right **north star** — if we discipline scope.

---

## 4. Recommended locked design

### 4.1 Ideology model

**Canonical vector:** 12 dimensions, each −100…+100, each with confidence 0…1.

**Frontend default 3D basis** (stable product legend — not arbitrary PCA that rotates weekly):

| Viz axis | Primary dimensions blended |
|----------|----------------------------|
| **X — Economic order** | D4 (markets↔redistribution) + D7 (merit↔equality) |
| **Y — Power & liberty** | D1 (liberty↔authority) + D9 (civil liberties↔security) + D12 (central↔decentral) |
| **Z — Belonging & sacred** | D2 (global↔national) + D3 (secular↔religious) + D6 (progress↔tradition) |

Remaining dims (D5 technocracy↔populism, D8 foreign posture, D10 environment↔growth, D11 epistemology) appear in the **profile radar / compare table**, and can optionally remapping the 3D basis via a user toggle (“Foreign policy space”, “Tech & nature space”).

This keeps the map **legible** while the full vector stays **rich**.

### 4.2 Orthogonality program

Before calling 12D “final”:

1. Score ≥100 gold figures on all 12.  
2. Publish correlation matrix.  
3. Merge dims with |r| > 0.85 unless there is a clear theoretical reason to keep them (document exceptions: e.g. D3 vs D11 if clergy vs scientists split).

### 4.3 Survey

- **Item bank:** ~90 value statements across the 12 dims (no party names).  
- **MVP session:** 3 items × 12 dims = 36 core (balanced reverse-codes), ~8–10 minutes.  
- **Phase 2:** adaptive selection to ~28 items with same information.  
- **Admiration:** multi-select; α ≤ 0.12 blend; always show raw vs adjusted.  
- **Output:** 12D profile + 3D placement + contradictions (high |score| on theoretically opposing dims) + blind spots (low confidence / skipped themes).

### 4.4 Public figure pipeline (trust core)

```
Sources → Chunk → Signal extract → Per-dim score draft
    → Confidence → Evidence rows → Human review gate → Publish vector
```

**Hard gate:** no published dimension without ≥1 evidence row (URL or archival citation) + confidence + short rationale.

Phase 1: **manual / assisted scoring** for ~100 figures.  
Phase 2: Azure OpenAI (or equivalent) drafts; editors approve.  
Phase 3: continuous crawl + drift alerts.

### 4.5 Similarity

On the 12D vector (optionally confidence-weighted):

- Cosine similarity for “thinking alike”  
- Euclidean for “map distance”  
- Always return **per-dimension contribution** (“you align on D2/D3; diverge on D4”)

Embeddings: for **searching evidence text**, not as the user-facing ideology score.

### 4.6 Clustering

Phase 1: curated centroids (National Populists, Global Progressives, …).  
Phase 2: HDBSCAN on published vectors → proposed neighborhoods → editorial names.

### 4.7 Tech stack by phase

**Phase 1 (ship product)**

| Layer | Choice |
|-------|--------|
| Frontend | Next.js + TS + Tailwind + R3F + Framer Motion |
| API | Next.js route handlers *or* thin FastAPI |
| DB | PostgreSQL + pgvector |
| Auth | Magic link / Google OAuth (defer Azure AD B2C) |
| AI | Optional; not required to launch gold-set figures |
| Hosting | Single cloud (Azure *or* Vercel+Managed PG) |

**Phase 2**

| Layer | Choice |
|-------|--------|
| Workers | Celery/Redis or Cloud Run jobs |
| Blob | Azure Blob for source snapshots |
| AI | Azure OpenAI for extract/score drafts |
| Search | Postgres full-text → OpenSearch when needed |

**Phase 3**

Neo4j (relationships), continuous crawl, public API, BigQuery analytics, multi-cloud batch — only when data volume forces it.

### 4.8 MVP roadmap (revised)

**Phase 1 — Trustworthy atlas**

- Rename to PoliGraph  
- 12D schema + 3D default projection  
- Survey (~36 items) + admiration  
- User profile report (deterministic first; LLM prose optional)  
- ~100 public figures with evidence-backed vectors  
- Similarity (near list + per-dim why)  
- Explore + basic Compare  
- Methodology transparency

**Phase 2 — AI + depth**

- Evidence extraction pipeline + editor UI  
- Timeline vectors  
- Organizations  
- Adaptive survey  
- 1,000+ profiles

**Phase 3 — Living graph**

- Continuous updates  
- Global graph / API  
- Advanced cluster lab

---

## 5. Decision checklist (finalize with these answers)

1. **Name:** PoliGraph — yes/no?  
2. **12D internal + fixed 3D viz basis** — accept, or insist PCA-driven 3D?  
3. **Phase 1 stack:** Next + Postgres only — accept?  
4. **Survey length:** 36 fixed items now, adaptive later — accept?  
5. **Human review gate** before any AI-scored figure publishes — accept?  
6. **Merge candidates** for redundant dims after gold-set correlations — accept?

Until these are locked, further build should only extend the current MVP toward this hybrid — not toward full AKS/Neo4j/Dataflow.

---

## 6. Bottom line

The master prompt is an excellent **constitution**. Taken literally as a Phase-1 build list, it is a trap.

**PoliGraph should feel like the master prompt in principles and information architecture, and like the current MVP in shipping discipline:** explainable vectors, evidence or survey answers behind every number, a legible 3D map, and similarity that teaches *why* — then grow the graph and the AI pipeline once the gold set is credible.
