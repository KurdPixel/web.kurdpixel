-- Supabase movies table schema
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  description text,
  imdb_rating numeric(3,1),
  language text,
  duration_minutes int,
  tags text[],
  translators text[],
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by slug
CREATE UNIQUE INDEX IF NOT EXISTS movies_slug_idx ON movies(slug);
