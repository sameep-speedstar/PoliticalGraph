# XAxis — Methodology

**Product:** X Handle Political Mapping  
**Reference nation (v1):** India  
**Input:** Public X activity only (no survey)

## Promise

Drop any public X handle. We place that account on two continuous axes from past tweets, quote-tweets, replies, retweets, and likes — with confidence and evidence, not moral ranking.

## Axes

Scores run **−100 … +100**. Origin is mixed / insufficient signal.

### Axis 1 — Left ↔ Right

Political economy and social order.

| Pole | Score | Meaning |
|------|-------|---------|
| **Left** | −100 | Redistribution, state-led economy, identity equity, civil liberties over order, secular-progressive culture |
| **Right** | +100 | Markets/merit, law-and-order, cultural traditionalism, skepticism of expansive welfare/quotas |

Left/Right is **independent** of National/Anti-National. Left-nationalist and right-cosmopolitan placements are valid.

### Axis 2 — National ↔ Anti-National

National-interest first (India v1). Internal codes: `national_interest` ↔ `adversary_aligned`.

| Pole | Score | Meaning |
|------|-------|---------|
| **National** | +100 | Treats India’s security, sovereignty, territorial integrity, constitutional continuity, and strategic advantage as primary |
| **Anti-National** | −100 | Systematically (a) amplifies adversary-state narratives against India, (b) denies/relativizes territorial integrity or constitutional order in ways that weaken the Union’s claim, or (c) treats India’s strategic interests as illegitimate while treating rival interests as legitimate |

### Explicit exclusions (dissent ≠ Anti-National)

**Not Anti-National by itself:**

- Criticism of a party, PM, ministry, or coalition
- Critique of policy failure, corruption, or procurement waste
- Budget disagreement on defense (cost/efficiency) without opposing readiness as a principle
- Human-rights or civil-liberties advocacy **unless** paired with adversary narrative, secession, or sovereignty-denial codes
- “Nationalization of industry” (that is Left/Right economic, not National axis)

A post contributes to Anti-National **only** when it hits adversary-alignment / sovereignty-weakening codes.

## Signal weights

| Activity | Authorship weight |
|----------|-------------------|
| Original tweet / thread | 1.0 |
| Quote-tweet with commentary | 0.9 |
| Reply | 0.7 |
| Retweet (no comment) | 0.45 |
| Like | 0.15 |
| Engagement on own posts | multiplier 0.5–1.5 |

## Topic → axis routing

| Topic bucket | Primary axis |
|--------------|--------------|
| Economy / welfare / markets | LeftRight |
| Caste / gender / religion-in-public-life | LeftRight |
| Borders / military / terror / China / Pakistan | National |
| Foreign policy / blocs when tied to India interest | National |
| Constitution / federalism / secession / azadi | National |
| Pure party tribal (leader names only) | Low weight unless mapped to a value topic |

## Composite score

```
LR = clamp(100 × Σ(wᵢ × stance_LRᵢ) / Σ|wᵢ|, −100, 100)
NI = clamp(100 × Σ(wᵢ × stance_NIᵢ) / Σ|wᵢ|, −100, 100)
confidence = f(n_posts_scored, topic_coverage, time_span, bot_risk)
```

Each scored item stores topic tags, per-axis stance (−1…+1), weight, and permalink for the evidence drawer.

## Window & limits

- Public posts only
- Default analysis window: last **200** scored activities or **12 months**, whichever is smaller in the demo corpus
- Bot/coordination risk is disclosed; it dampens confidence, not the point alone

## Version

- Lexicon pack: `india-v1`
- Methodology version: `2026-08-12`
