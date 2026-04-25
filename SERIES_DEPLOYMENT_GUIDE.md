# Series TMDB Integration - Complete Deployment Guide

## Overview
This document guides you through deploying the complete series management system with TMDB integration for the kurdpixel project.

## ✅ What's Been Implemented

### 1. TMDB API Endpoints (Deployed)
- **GET `/api/search-tmdb-series`** - Search series by title on TMDB
- **GET `/api/series-tmdb`** - Fetch full series details from TMDB

### 2. Frontend Components (Ready to Use)
- **`TMDBSeriesSearch.tsx`** - Interactive series search with grid results
- **`TMDBSeriesCard.tsx`** - Form with auto-filled TMDB data + episode management UI
- **`AddSeriesModal.tsx`** - Modal wrapper combining search and form workflow
- **Admin page updated** - Uses new AddSeriesModal instead of manual form page

### 3. API Updates (Ready)
- **POST `/api/admin/series`** - Now accepts `episodes` array and `tmdb_series_id`
- Episodes auto-insert to database when series is created

## 🚀 CRITICAL: Deploy Series Tables to Supabase

**Without this step, the series feature will NOT work.**

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Access SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Run the Schema**
   - Open `supabase_series_table.sql` in your project root
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run" button (or Cmd/Ctrl+Enter)

4. **Verify Success**
   - You should see two tables created:
     - `series` - stores series information
     - `episodes` - stores episode details
   - Check Table Editor to confirm

### What Gets Created:

**`series` table:**
- `id` (uuid, primary key)
- `title` (text, required)
- `slug` (text, unique)
- `description` (text)
- `cover_image_url` (text)
- `thumbnail_url` (text)
- `total_seasons` (integer, default 1)
- `tmdb_rating` (decimal 3.1)
- `language` (text)
- `tags` (text array)
- `is_18_plus` (boolean, default false)
- `tmdb_series_id` (integer, links to TMDB)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`episodes` table:**
- `id` (uuid, primary key)
- `series_id` (uuid, foreign key → series)
- `season_number` (integer)
- `episode_number` (integer)
- `title` (text, required)
- `description` (text)
- `video_url` (text, required - Vidmoly link)
- `thumbnail_url` (text)
- `tmdb_rating` (decimal 3.1)
- `is_18_plus` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- Unique index on `series.slug`
- Index on `episodes.series_id`
- Unique index on `(episodes.series_id, season_number, episode_number)` combo

## 🎯 How to Use the Series Admin

### Adding a New Series:

1. **Navigate to Admin** → Series Management
2. **Click "Add New Series"** button
3. **Search TMDB**
   - Type series name (e.g., "Breaking Bad")
   - Click Search
   - Click on series poster
4. **Form Auto-Fills**
   - Title ✅ (from TMDB)
   - Rating ✅ (from TMDB)
   - Description ✅ (from TMDB, can edit)
   - Cover image ✅ (from TMDB)
   - Seasons ✅ (from TMDB)
5. **Customize Optional Fields**
   - Language: English, Kurdish, Arabic, Turkish
   - Tags: Add custom tags (comma-separated)
   - Age Restriction: Check if 18+ only
6. **Add Episodes**
   - Select Season from dropdown
   - Enter Episode Number
   - Enter Episode Title
   - Add Video URL (Vidmoly required)
   - Add Thumbnail URL
   - Click "Add Episode"
7. **Repeat Step 6** for each episode
8. **Click "Add Series"** to save everything

### What Happens:
- Series saved to `series` table with auto-generated slug
- All episodes auto-saved to `episodes` table
- Links series_id foreign key properly
- Success notification shown
- Page refreshes to show new series

## ✨ Key Features

### Episode Management
- **Season/Episode Structure**: Select which season, enter which episode number
- **Hierarchical Display**: Episodes grouped by season in form
- **Full Metadata**: Each episode has title, description, video URL, thumbnail
- **Easy Removal**: Delete episodes before saving with X button

### TMDB Integration
- **Auto-Population**: Title, rating, description, genres, poster from TMDB
- **Manual Override**: Edit any field after auto-fill
- **Image URLs**: Direct TMDB CDN links for posterity

### Admin UX
- **Modal Workflow**: Search → Results → Form (no page navigation)
- **Real-time Validation**: Required fields checked before submit
- **Success Feedback**: Green confirmation modal before reload
- **Error Handling**: Clear error messages for API failures

## 🔍 Troubleshooting

### "Failed to fetch series" Error
**Cause**: Series table not created in Supabase
**Fix**: Run the SQL deployment steps above

### "Series added but episodes missing"
**Cause**: Episodes table not created
**Fix**: Ensure both `CREATE TABLE` statements ran in Supabase SQL editor

### TMDB Search returns no results
**Cause**: Query too specific or series name misspelled
**Fix**: Try shorter names (e.g., "Breaking" instead of "Breaking Bad Season 1")

### Image URLs showing 404
**Cause**: TMDB poster not available for that series
**Fix**: Manually enter image URL from another source, or leave blank for default

## 📋 Project Files Modified/Created

### New Files:
- `src/app/api/search-tmdb-series/route.ts`
- `src/app/api/series-tmdb/route.ts`
- `src/components/TMDBSeriesSearch.tsx`
- `src/components/TMDBSeriesCard.tsx`
- `src/components/AddSeriesModal.tsx`
- `SERIES_DEPLOYMENT_GUIDE.md` (this file)

### Modified Files:
- `src/app/admin/series/page.tsx` (now uses AddSeriesModal)
- `src/app/api/admin/series/route.ts` (POST now handles episodes)

### Reference Files:
- `supabase_series_table.sql` (schema definition)

## 🚀 Next Steps

1. **Deploy SQL** ← DO THIS FIRST
2. Test series admin workflow
3. Verify episodes save correctly
4. Deploy to production

## 📞 Quick Reference

- **Admin Series Page**: `/admin/series`
- **Search Endpoint**: `GET /api/search-tmdb-series?q=query`
- **Details Endpoint**: `GET /api/series-tmdb?id=123456`
- **Add Series Endpoint**: `POST /api/admin/series` with episodes array

---

**Status**: ✅ Ready for deployment (pending SQL schema creation in Supabase)
**Last Updated**: 2024
