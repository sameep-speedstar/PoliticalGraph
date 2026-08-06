-- Poligraph Stage 2 — Trust backend schema
-- Target: Postgres or Cloudflare D1 (SQLite-compatible subset noted).
-- Public atlas only reads status = 'published' figures with approved evidence.

CREATE TABLE IF NOT EXISTS figures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  country TEXT NOT NULL,
  roles_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL DEFAULT '',
  rationale TEXT NOT NULL DEFAULT '',
  sources_json TEXT NOT NULL DEFAULT '[]',
  economic INTEGER NOT NULL CHECK (economic BETWEEN -100 AND 100),
  authority INTEGER NOT NULL CHECK (authority BETWEEN -100 AND 100),
  cultural INTEGER NOT NULL CHECK (cultural BETWEEN -100 AND 100),
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'published', 'rejected')),
  as_of TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS evidence_rows (
  id TEXT PRIMARY KEY,
  figure_id TEXT NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
  axis TEXT NOT NULL CHECK (axis IN ('economic', 'authority', 'cultural')),
  claim TEXT NOT NULL,
  source_title TEXT NOT NULL,
  source_url TEXT,
  approved INTEGER NOT NULL DEFAULT 0 CHECK (approved IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_evidence_figure ON evidence_rows(figure_id);
CREATE INDEX IF NOT EXISTS idx_figures_status ON figures(status);

-- Optional audit log for human approval gate
CREATE TABLE IF NOT EXISTS approval_events (
  id TEXT PRIMARY KEY,
  figure_id TEXT NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL, -- submit | approve | reject | publish | unpublish
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
