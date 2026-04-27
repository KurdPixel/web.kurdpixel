-- Add banner_url column to movies table for wide carousel thumbnails
ALTER TABLE movies ADD COLUMN IF NOT EXISTS banner_url text;

-- You can populate this with existing thumbnail_url data if needed, or manually upload banner images
-- UPDATE movies SET banner_url = thumbnail_url WHERE banner_url IS NULL;
