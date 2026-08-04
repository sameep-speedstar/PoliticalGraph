# Poligraph — Assumption Challenge & Two-Sided Product Reality

**Context:** Proposal to treat Poligraph as a future **political/corporate campaign messaging** asset once user ideology data scales — plus account sign-in and **IP-based location**.

This memo challenges every load-bearing assumption. It updates product doctrine for kniq.ai.

---

## 1. What the specs say today (facts)

| Topic | In specs? | Reality in code |
|-------|-----------|-----------------|
| Account sign-in | Mentioned as **later** (Google/magic link); Azure AD B2C in master prompt | **Not built.** Survey is anonymous, client-side (`localStorage`) |
| IP-based location | **Not specified.** Location is **user-chosen locale pack** | User picks IN / US / EU / global |
| Selling psychographics for campaigns | Explicitly **rejected** in early design (“no microtargeting ads against survey psychographics”) | Methodology still says not microtargeting infra |
| Human-approved **public figure** scores | Locked yes | Seed data only |
| B2B campaign cockpit | Not in Stage 1–1.5 plan | Not built |

So: **sign-in is optional-future, not required for MVP.** IP geolocation is a **new request**, not an existing spec.

---

## 2. Challenge every assumption

### A. “If we get sizeable user ideology data, campaigns will pay”

**Challenge:** Campaigns already buy (or scrape) richer signals — voter files, donation history, media graph, caste/ward data (India), Meta/Google audiences. A self-selected web survey on kniq.ai is:

- **Biased** (English-speaking, online, curious about “worldview maps”)
- **Thin** (one session, Likert, easy to game)
- **Stale** unless people return
- **Non-representative** unless you spend on panel recruitment

**What is actually sellable:** not “we know Sameep’s vector,” but **segment insight** — “in metro IN sample, tariff framing moves Authority+Cultural more than Economic.” That requires **declared research purpose**, sampling design, and usually **paid panels**, not hope that free users become a shadow electorate file.

### B. “Political messaging tool” is the natural endgame

**Challenge:** That endgame is the **Cambridge Analytica narrative**. Even if legal in a narrow reading, it:

- Destroys consumer trust the moment it leaks
- Contaminates **KNIQ’s consulting brand** (Claude implementation partner → political psychographics broker)
- Triggers **sensitive-data** regimes: political opinions are sensitive under GDPR; India’s DPDP treats similarly sensitive classes with heightened duties; election advertising rules vary by country
- Creates **asymmetric abuse** — the product helps whoever pays, including actors users dislike

**Hard product truth:** A tool that is *secretly* a campaign database will not stay simple or trusted. A tool that is *openly* a research platform can be valuable — but then onboarding copy, consent, and architecture must say so **before** the first question.

### C. “Simple for people” and “useful for campaigns” are the same product

**Challenge:** They optimize opposite directions.

| Consumer wants | Campaign buyer wants |
|----------------|----------------------|
| 5–8 minutes, fun, private | Longitudinal IDs, demographics, reachability |
| No account friction | Accounts, email, phone, voter-linkable IDs |
| “Show me who I’m near” | “Show me who to persuade in district X” |
| Trust / ethics | Targeting lift |

**If you force both into one funnel without transparency, you get neither:** consumers bounce; buyers distrust sample quality.

**Viable pattern:** **two surfaces, one worldview engine**

1. **Poligraph (consumer)** — map yourself; optional account; data minimization  
2. **Poligraph Insights (B2B)** — aggregate heatmaps, message-testing, commissioned locale packs — fed by **opt-in research panel** + public figure graph — **not** by silently repurposing consumer sessions

### D. “IP address gives us user location”

**Challenge:** IP ≠ residence ≠ constituency.

- Mobile CGNAT, VPNs, corporate exits, university halls → wrong city/country  
- Political use needs **self-reported** state/district (or voter file match, which is a different, heavily regulated product)  
- IP geolocation for **adaptive question packs** is OK as a **soft default** if: disclosed, coarse (country only), user can override, not stored longer than needed  
- IP + ideology vector + account = **high-risk profiling** under privacy law

**Recommendation:**  
- Default locale from IP **country only** (optional, client-side or edge)  
- Always show “We guessed India — change?”  
- Never infer assembly constituency from IP  
- Do not persist raw IP alongside ideology without legal basis + retention limit

### E. “Accounts will unlock the data asset”

**Challenge:** Mandatory sign-in **kills** completion. For consumer Poligraph:

- **Guest-first** (current) maximizes top-of-funnel  
- **Optional account** after results: “Save map / compare later / join research panel”  
- Gate **Insights panel** participation behind explicit consent (“I agree my anonymized answers may inform public-interest and commercial research”)

Accounts are for **relationship**, not for secretly building a voter file.

### F. “Corporates and political campaigns want the same thing”

**Challenge:** Overlap is partial.

- **Corporates:** brand risk, ESG, market entry, employee culture, crisis language — usually OK with aggregates and message tests  
- **Political campaigns:** persuasion + turnout + opposition research — demand individual or micro-segment reachability  

Serving both with one “export CSV of users” button is how you get banned from platforms and front pages. Prefer **message laboratory** (which frames move which segments) over **people export**.

### G. “More dimensions / more questions → more valuable data”

**Challenge:** Opposite for onboarding. Value for B2B often comes from **clean, repeated, incentivized** short instruments — not a 100-item ordeal on a consulting website.

Keep consumer path ≤10 minutes. Sell depth via **panel boosters**, not by punishing casual users.

### H. “Hosting on kniq.ai is fine for a political data business”

**Challenge:** kniq.ai’s public positioning is Claude implementation / automation consulting. A political-data sideline needs:

- Separate legal entity or clear product ToS  
- Separate privacy policy  
- Editorial firewall from client consulting  
- Or keep Poligraph as **public education + figure atlas** and run Insights under a different brand

Brand confusion is a business risk, not a footnote.

---

## 3. Doctrine update (challenged → revised)

| Old temptation | Revised doctrine |
|----------------|------------------|
| Silent IP → precise geo | Coarse country guess + user confirm |
| Mandatory accounts | Guest survey → optional save → explicit panel opt-in |
| Sell individual ideology graphs | Sell **aggregates, segments, message tests**; no raw PII+vector resale |
| Campaign microtargeting endgame | **Message & audience research** endgame (opt-in), or don’t build B2B |
| One product for voters & campaigns | **Poligraph** + **Poligraph Insights** |
| Trust is a page | Trust is architecture (minimization, purpose limitation, k-anonymity) |

**We will not design covert microtargeting infrastructure.**  
**We can design an ethical insights product that campaigns/corporates pay for — if users opt in with eyes open.**

---

## 4. Simple enough / useful enough (the dual bar)

### Consumer simplicity (non-negotiable)

1. Land → pick/confirm country → ~20–36 questions → 3D result in &lt;10 min  
2. No account required  
3. One job: “who am I near / which thinking group”  
4. Share card; explore; compare  

### Buyer usefulness (only with consent architecture)

Sell **decisions**, not dossiers:

| SKU | What they get | Data source |
|-----|---------------|-------------|
| **Segment atlas** | Heatmaps by country/region (k-anonymous) | Opt-in panel + published aggregates |
| **Message test** | Which value-frames shift which segments | Recruited A/B on Poligraph items |
| **Figure & org map** | Evidence-backed public graph | Human-approved research (no user PII) |
| **Locale pack design** | Current-affairs question sets for markets | Editorial + client workshop |

If a buyer asks for “export all users in Karnataka with Cultural &gt; 60 and emails,” the answer is **no** — that is a different company and a different consent regime.

---

## 5. Spec changes to implement next

### Auth

- Stage 1: **none** (keep)  
- Stage 1.5–2: **optional** Google / magic link after results (“Save my map”)  
- Stage 2+: **Research Panel** consent flag (separate from “save map”)

### Location

- Stage 1.5: optional **IP→country** hint via edge/geo header (Cloudflare `CF-IPCountry`) — **not** stored as precise IP  
- UI: confirm/override before survey packs load  
- Self-report state/city only if needed for Insights panel (explicit)

### Campaign value path

- Do **not** put “campaign cockpit” in consumer IA  
- Add Stage 2.5 epic: **Poligraph Insights** (aggregates only) behind B2B auth  
- Publish transparency report: what is/isn’t sold  

### Legal / product gates before any B2B ship

- [ ] Privacy policy purpose limitation for Poligraph  
- [ ] DPDP/GDPR lawful basis matrix (consent vs legitimate interest — prefer consent for research reuse)  
- [ ] k-anonymity threshold for any published heatmap  
- [ ] Ban list: no individual vector resale; no silent voter-file match  

---

## 6. Bottom line

Your instinct that **worldview + geography + message** is valuable is right.  
Your instinct that **free consumer sessions quietly become a campaign weapon** is the assumption to kill.

**Build the consumer product so simple it spreads.  
Build the commercial product so honest it can be printed on the homepage.  
Connect them only through opt-in panel + aggregates.**

That is harder than “collect and sell,” and it is the only version that survives contact with regulators, journalists, and the users you need for scale.
