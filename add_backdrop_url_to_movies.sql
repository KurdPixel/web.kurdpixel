-- Add backdrop_url column to movies table for TMDB wide images
ALTER TABLE movies ADD COLUMN IF NOT EXISTS backdrop_url text;
