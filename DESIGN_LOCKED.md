# Poligraph — Locked Design Decisions

**Date locked:** 2026-08-04  
**Product name:** **Poligraph**  
**Tagline:** *Understand how people think.*

## Product identity (LOCKED)

**Poligraph is A — not B.**

| | |
|--|--|
| **A (chosen)** | Public worldview **atlas** + optional **opt-in research panel** |
| **B (rejected)** | Political / corporate **data broker** or silent microtargeting engine |

Consumer promise: understand how you and public figures think.  
Commercial promise (later): **Poligraph Insights** — aggregates, message tests, commissioned locale packs — only from **explicit panel consent** and public-figure research. Never raw individual ideology + PII resale.

See [`STRATEGY_ASSUMPTIONS.md`](./STRATEGY_ASSUMPTIONS.md).

## Decisions confirmed

| Topic | Decision |
|-------|----------|
| Name | **Poligraph** (not PoliticalGraph / PoliGraph) |
| Product type | **A** — atlas + optional research panel |
| Visualization | **Fixed 3D basis** for all users — stable comparison frame |
| Survey | **Dynamic**: core global values + location pack + current affairs / general issues |
| Consumer auth | **Guest-first**; optional “save map” later; never required to survey |
| Location | User-confirmed locale; optional **IP→country only** hint; no constituency-from-IP |
| Public figure scores | **Human approval required** before publish (AI may draft only) |
| Individual dossier resale / silent microtargeting | **Forbidden** |
| Ethics | No good/bad ranking; no religion ranking; evidence + confidence on public scores |

## Fixed 3D comparison basis (canonical)

All users and figures project into the same space:

| Axis | − | + | Drawn from 12D |
|------|---|---|----------------|
| **X Economic** | Redistribution / equality | Markets / property | D4 + D7 |
| **Y Authority** | Liberty / civil constraint | Order / strong authority | D1 + D9 (+ D12) |
| **Z Cultural identity** | Cosmopolitan / secular-plural | Particular / traditional-religious | D2 + D3 + D6 |

Full 12D remains in profile radar, compare tables, and evidence — but **map distance and “closest figures” always use this fixed 3D** (or the full 12D vector with the same fixed projection for viz). Do not rotate axes per user or per session.

## Dynamic survey model

```
Session questionnaire =
  Core values bank (global, stable, maps to 12D)
+ Location pack (country/region norms & framing)
+ Current affairs pack (time-boxed public issues, still value-framed)
+ Admiration (secondary weight α ≤ 0.12)
```

Rules:

- Still **avoid party-name shibboleths**; frame as values even when issue-specific.
- Location changes *examples and salience*, not the meaning of axes.
- Current-affairs items must declare `asOf` and expire/rotate; they never redefine the fixed 3D basis.
- Every item records: `dimension_ids[]`, `locale`, `pack_id`, `asOf`.

Example packs:

- **IN**: federalism vs centre, religious majoritarianism vs secular republic, industrial policy  
- **US**: speech/campus, immigration federalism, industrial tariffs  
- **Global current**: trade blocs, AI regulation, climate vs growth — mapped onto existing dims

## Human approval gate

```
AI draft score + evidence
        ↓
Editor review (accept / edit / reject per dimension)
        ↓
Published ideology_vector + evidence rows
```

No public dimension score without approved evidence.

## Auth, location, and commercial use (locked after assumption challenge)

See [`STRATEGY_ASSUMPTIONS.md`](./STRATEGY_ASSUMPTIONS.md).

**Identity:** Poligraph = **A** (public atlas + optional research panel). Not a data broker.

| Topic | Lock |
|-------|------|
| Consumer sign-in | **Optional**, after results (“save map”) — never required to take survey |
| Location | **User-confirmed** locale; optional **IP→country only** hint; no constituency-from-IP |
| Individual ideology resale / silent microtargeting | **Forbidden** |
| B2B value | Separate **Poligraph Insights**: aggregates, message tests, opt-in panel only |
| Brand | Consumer Poligraph stays education/atlas; Insights must be explicitly consented research |

## Mockups

Visual references (also in repo `web/public/mockups/`):

1. Landing — brand-first hero + constellation  
2. Survey — location + current-affairs context  
3. Results — You on fixed 3D + nearest figures  
4. Compare — Modi vs Trump on shared axes  

Interactive gallery: `/mockup` in the web app.
