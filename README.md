# XAxis — X Handle Political Mapping

Drop an X handle. Map **Left ↔ Right** and **National ↔ Anti-National** from public tweets, quote-tweets, replies, retweets, and likes — **no survey**.

Standalone product (not Poligraph). Reference nation v1: **India**.

## Docs

- [`docs/METHODOLOGY.md`](./docs/METHODOLOGY.md) — frozen pole definitions, exclusions, weights, composite formula

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo handles (no X API key)

| Handle | Expected quadrant |
|--------|-------------------|
| `@arjun_bharat` | Right · National |
| `@neha_republic` | Left · National |
| `@kabir_frontier` | Left · Anti-National |
| `@priya_audit` | Critic (dissent ≠ Anti-National) |

## Scripts

```bash
cd web
npm run build
npm run selftest   # quadrant calibration checks
```

## Architecture

```
handle → activities → classify(topics+stance) → weighted aggregate → 2D coords + evidence
```

- Definitions: `web/src/data/definitions.ts`
- Signal weights / routing: `web/src/data/signals.ts`
- India lexicon + false friends: `web/src/data/lexicon/india-v1.ts`
- Scorer: `web/src/lib/score.ts`
- UI: `/` → `/map/[handle]` · `/methodology`

Live X ingest is stubbed until `X_BEARER_TOKEN` + adapter are added; demo corpora power the MVP.
