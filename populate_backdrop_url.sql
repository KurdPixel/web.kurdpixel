-- Populate backdrop_url with thumbnail_url for existing movies that don't have backdrop_url
UPDATE movies 
SET backdrop_url = thumbnail_url 
WHERE backdrop_url IS NULL AND thumbnail_url IS NOT NULL;
