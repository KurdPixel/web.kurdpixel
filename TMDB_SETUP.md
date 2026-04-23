# TMDB Integration Setup Guide

## Overview
The admin panel has been updated to use **TMDB (The Movie Database)** API for fetching movie data. This replaces the manual entry system and auto-fills most fields.

## Setup Steps

### 1. Get Your TMDB API Key

1. Go to: https://www.themoviedb.org/settings/api
2. Create an account if you don't have one
3. Request an API key (choose "Developer" when asked)
4. You'll receive your API key

### 2. Add API Key to Environment

Open `.env.local` in the root directory and update:

```
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
TMDB_API_BASE_URL=https://api.themoviedb.org/3
```

**Important:** 
- Replace `your_actual_api_key_here` with your actual TMDB API key
- Keep `.env.local` private (don't commit to git)
- The key is public-facing in the app, which is fine for TMDB's free tier

### 3. Restart the Dev Server

```bash
npm run dev
```

## New Movie Adding Workflow

### Step 1: Click "Add New Movie"
Click the purple "Add New Movie" button in the admin movies section.

### Step 2: Search for Movie
- A modern modal appears with a search box
- Type the movie name and click "Search"
- Browse the grid of results

### Step 3: Select Movie
- Click on a movie poster to view details
- A beautiful dark-themed card displays with auto-filled data:
  - **✓ Auto-filled from TMDB:**
    - Movie Title
    - TMDB Rating (0-10)
    - Duration (in minutes)
    - Genres/Tags
    - Description/Overview
    - Thumbnail URL (poster)

### Step 4: Fill Manual Fields
- **Vidmoly Embed URL** ⭐ Required - paste the embed URL
- **Language** - language of the subtitle/dub
- **Translators** - comma-separated list of translators
- **+18 Content** - mark if adult content

### Step 5: Submit
- Click "✓ Add Movie" button
- Movie is saved with all auto-filled + manual data
- Page refreshes to show the new movie

## API Endpoints

### Search TMDB Movies
```
GET /api/search-tmdb?query=movie_name
```

Response:
```json
{
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "release_date": "1999-10-15",
      "rating": 8.4,
      "poster_path": "/path/to/poster.jpg",
      "overview": "...",
      "vote_count": 12345
    }
  ],
  "total_results": 100,
  "total_pages": 5
}
```

### Get Movie Details from TMDB
```
GET /api/movies-tmdb?id=550
```

Response:
```json
{
  "title": "Fight Club",
  "rating": 8.4,
  "duration_minutes": 139,
  "poster_path": "/path/to/poster.jpg",
  "backdrop_path": "/path/to/backdrop.jpg",
  "overview": "...",
  "release_date": "1999-10-15",
  "genres": ["Drama", "Thriller"],
  "vote_count": 12345,
  "imdb_id": "tt0137523",
  "original_language": "en"
}
```

### Add Movie to Database
```
POST /api/admin/movies
Content-Type: application/json

{
  "title": "Fight Club",
  "video_url": "https://vidmoly.me/embed-xxxxx.html",
  "thumbnail_url": "https://image.tmdb.org/t/p/w500/path.jpg",
  "description": "Movie description",
  "tmdb_rating": 8.4,
  "duration_minutes": 139,
  "tags": ["Drama", "Thriller"],
  "language": "Kurdish",
  "translators": ["John Doe"],
  "is_18_plus": false,
  "slug": "fight-club",
  "tmdb_movie_id": 550
}
```

## Database Changes

The `movies` table now includes:
- `tmdb_rating` - TMDB rating (replaces IMDB rating)
- `tmdb_movie_id` - TMDB ID for reference

## File Structure

**New/Updated Files:**
- `.env.local` - Environment configuration
- `src/app/api/search-tmdb/route.ts` - Search API endpoint
- `src/app/api/movies-tmdb/route.ts` - Movie details API endpoint
- `src/app/api/admin/movies/route.ts` - Add movie API endpoint
- `src/components/AddMovieModal.tsx` - Modal wrapper
- `src/components/TMDBMovieSearch.tsx` - Search interface
- `src/components/TMDBMovieCard.tsx` - Movie card with form
- `src/app/admin/movies/page.tsx` - Updated admin page

## Features

✅ **Auto-Fill from TMDB:**
- Movie title
- Rating (TMDB)
- Duration
- Genres/Tags
- Description
- Thumbnail/Poster

✅ **Modern Dark UI:**
- Beautiful gradient design
- Smooth animations
- Responsive layout
- Copy buttons for URLs

✅ **User-Friendly Flow:**
- Search first
- Review and select
- Fill remaining fields
- Submit

## Troubleshooting

### "TMDB API key not configured"
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_TMDB_API_KEY` is set correctly
- Restart dev server

### "No movies found"
- Check your search query spelling
- Try a different movie name
- Ensure TMDB API is accessible (check network)

### Movies not saving
- Verify Vidmoly URL is filled in
- Check browser console for errors
- Ensure you're logged in as admin
- Check Supabase connection

## Notes

- TMDB API free tier has rate limits (~40 requests/10 seconds)
- Poster images expire after a few days if not optimized
- Using TMDB's CDN URLs is fine and they're cached
- Consider adding image optimization later if needed

## Future Improvements

- [ ] Image caching/optimization
- [ ] Batch upload support
- [ ] TMDB rating auto-sync
- [ ] Multi-language support for descriptions
- [ ] Advanced search filters
