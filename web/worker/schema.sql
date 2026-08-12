-- Stance handle score cache + search counters (Cloudflare D1)
CREATE TABLE IF NOT EXISTS handle_scores (
  handle TEXT PRIMARY KEY,
  display_name TEXT,
  left_right INTEGER NOT NULL,
  national_interest INTEGER NOT NULL,
  quadrant TEXT,
  result_json TEXT NOT NULL,
  measured_at TEXT NOT NULL,
  search_count INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL DEFAULT 'live',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_handle_scores_search
  ON handle_scores (search_count DESC, measured_at DESC);
