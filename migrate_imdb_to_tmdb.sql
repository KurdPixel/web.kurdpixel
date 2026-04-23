-- Migration: Rename imdb_rating to tmdb_rating
-- Run this in Supabase SQL Editor to update your existing movies table

-- Step 1: Add tmdb_rating column if it doesn't exist
ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_rating numeric(3,1);

-- Step 2: Copy data from imdb_rating to tmdb_rating for existing movies
UPDATE movies SET tmdb_rating = imdb_rating WHERE tmdb_rating IS NULL AND imdb_rating IS NOT NULL;

-- Step 3: Add tmdb_movie_id column if it doesn't exist
ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_movie_id integer;

-- Step 4: Drop the old imdb_rating column (optional - keep if you want to preserve old data)
-- ALTER TABLE movies DROP COLUMN imdb_rating;

-- Verify the migration
SELECT id, title, imdb_rating, tmdb_rating FROM movies LIMIT 5;
