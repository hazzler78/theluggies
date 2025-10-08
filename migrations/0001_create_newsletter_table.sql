-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  locale TEXT NOT NULL,
  confirmed BOOLEAN DEFAULT 0,
  confirmation_token TEXT,
  subscribed_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_confirmed ON newsletter_subscribers(confirmed);

