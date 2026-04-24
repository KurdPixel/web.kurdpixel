-- Supabase series table schema
CREATE TABLE IF NOT EXISTS series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  thumbnail_url text,
  total_seasons int DEFAULT 1,
  tmdb_rating numeric(3,1),
  language text,
  tags text[],
  is_18_plus boolean DEFAULT false,
  tmdb_series_id integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  season_number int NOT NULL,
  episode_number int NOT NULL,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  tmdb_rating numeric(3,1),
  is_18_plus boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS series_slug_idx ON series(slug);
CREATE INDEX IF NOT EXISTS episodes_series_idx ON episodes(series_id);
CREATE UNIQUE INDEX IF NOT EXISTS episodes_unique_idx ON episodes(series_id, season_number, episode_number);
