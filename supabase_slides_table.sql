-- Supabase slides table schema
CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text,
  description text,
  watch_url text,
  "order" int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Index for fast ordering
CREATE INDEX IF NOT EXISTS slides_order_idx ON slides("order");

-- ALTER TABLE to add new columns if they don't exist (for existing tables)
ALTER TABLE slides ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE slides ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE slides ADD COLUMN IF NOT EXISTS watch_url text;
