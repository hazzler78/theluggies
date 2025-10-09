-- Create table to track which videos we've sent newsletters for
CREATE TABLE IF NOT EXISTS newsletter_sent (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  youtube_id TEXT NOT NULL UNIQUE,
  title_sv TEXT NOT NULL,
  title_en TEXT NOT NULL,
  sent_at TEXT DEFAULT (datetime('now')),
  recipients_count INTEGER,
  failed_count INTEGER
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_youtube_id ON newsletter_sent(youtube_id);
CREATE INDEX IF NOT EXISTS idx_sent_at ON newsletter_sent(sent_at);

