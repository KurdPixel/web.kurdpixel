# Series Admin Workflow - Visual Overview

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN SERIES PAGE                           │
│              (/admin/series)                                    │
│                                                                 │
│  📋 Series List                     [Add New Series Button]     │
│  ├─ Breaking Bad                    (Opens Search Modal)        │
│  ├─ The Office                                                  │
│  └─ Stranger Things                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                    Click "Add New Series"
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         SEARCH MODAL (z-40)                                     │
│                                                                 │
│  🔍 Search TMDB                                                 │
│  ┌──────────────────────┐                                      │
│  │ Type series name     │  [Search]                            │
│  └──────────────────────┘                                      │
│                                                                 │
│  Results Grid (Click to select):                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [Poster]  [Poster]  [Poster]  [Poster]                │  │
│  │  Breaking  The Game  Dexter    Chernobyl               │  │
│  │  Bad       of        ⭐9.3     ⭐8.4                   │  │
│  │  ⭐9.5     Thrones                                      │  │
│  │           ⭐9.3                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                      Click on series poster
                             ↓
       TMDB fetches series details (background)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         FORM MODAL (z-60)                                       │
│         Replaces search modal                                   │
│                                                                 │
│  📝 Add Series Details                                         │
│                                                                 │
│  ┌─ Series Information ────────────────────────────────────┐  │
│  │ Title: Breaking Bad (Auto-filled, disabled)             │  │
│  │ TMDB Rating: ⭐9.5                                      │  │
│  │ Total Seasons: 5                                        │  │
│  │ Description: A chemistry teacher... (Editable)         │  │
│  │ Thumbnail: [TMDB image URL]                            │  │
│  │ Cover Image: [TMDB image URL]                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ Additional Details ────────────────────────────────────┐  │
│  │ Language: [Dropdown] English                            │  │
│  │ Age Restriction: [ ] 18+ Only                          │  │
│  │ Tags: Drama, Crime (with add/remove buttons)           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ Episodes Management ───────────────────────────────────┐  │
│  │                                                          │  │
│  │ Add Episode Form:                                       │  │
│  │ Season: [Season 1 ▼]                                   │  │
│  │ Episode: [1]                                            │  │
│  │ Title: [Pilot]                                          │  │
│  │ Video URL: [https://vidmoly.me/...]                   │  │
│  │ Thumbnail: [https://...]                               │  │
│  │ [Add Episode]                                           │  │
│  │                                                          │  │
│  │ Episodes Added:                                         │  │
│  │ ▼ Season 1                                              │  │
│  │   • Episode 1: Pilot [✕]                              │  │
│  │   • Episode 2: Cat's in the Bag [✕]                   │  │
│  │ ▼ Season 2                                              │  │
│  │   • Episode 1: Seven Thirty-Seven [✕]                 │  │
│  │                                                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│                  [Add Series]  [Cancel]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                     Click "Add Series"
                             ↓
          POST /api/admin/series with:
          {
            title: "Breaking Bad",
            description: "...",
            cover_image_url: "https://...",
            total_seasons: 5,
            tmdb_rating: 9.5,
            language: "english",
            tags: ["Drama", "Crime"],
            is_18_plus: false,
            episodes: [
              { season_number: 1, episode_number: 1, title: "Pilot", ... },
              { season_number: 1, episode_number: 2, title: "Cat's in the Bag", ... },
              { season_number: 2, episode_number: 1, title: "Seven Thirty-Seven", ... }
            ]
          }
                             ↓
            API inserts series to Supabase
            API inserts all episodes to Supabase
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         SUCCESS MODAL (z-100)                                   │
│                                                                 │
│                    ✅ Success!                                 │
│         Series Added Successfully!                             │
│    Your new series has been added and                          │
│      will appear shortly.                                      │
│                                                                 │
│              (Auto-closes in 2 seconds)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                    Page auto-reloads
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN SERIES PAGE                           │
│              (Updated with new series)                          │
│                                                                 │
│  📋 Series List                                                │
│  ├─ Breaking Bad (NEW!)                                        │
│  │   5 Seasons | TMDB: 9.5 | English                          │
│  │   [Episodes] [Edit] [Delete]                              │
│  │                                                             │
│  ├─ The Office                                                │
│  │   ...                                                       │
│  └─ Stranger Things                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Add New Series Button                        │
│                   (State: isOpen = true)                       │
└─────────────────────────────────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │                                        │
    NO SERIES         SERIES SELECTED     SUCCESS MESSAGE
    SELECTED          BUT NO DETAILS      SHOWN
        │                  │                   │
        ↓                  ↓                   ↓
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ TMDBSeriesSearch│  │ TMDBSeriesCard   │  │ Success Page │
│                 │  │                  │  │              │
│ • Search input  │  │ • Auto-filled    │  │ • Green check│
│ • API call      │  │ • Episodes form  │  │ • Wait 2s    │
│ • Grid results  │  │ • Submit button  │  │ • Reload     │
│ • Click handler │  │ • API POST call  │  │              │
└─────────────────┘  └──────────────────┘  └──────────────┘
        │                  ↑                   ↑
        │         (sets selectedDetails)  (calls onConfirm)
        │                  │                   │
        └──────────────────────────────────────────┘
           AddSeriesModal (wrapper + state mgmt)
```

---

## Data Flow

```
TMDB Public API
      ↓
[/api/search-tmdb-series]  GET ?q=series_name
      ↓
   Returns: {
     results: [
       { id, title, poster_path, rating, ... },
       ...
     ]
   }
      ↓
[TMDBSeriesSearch] displays results
      ↓
User clicks series
      ↓
[/api/series-tmdb] GET ?id=series_id (fetches full details)
      ↓
   Returns: {
     title, rating, total_seasons, genres, overview, ...
   }
      ↓
[TMDBSeriesCard] auto-fills form with data
      ↓
User adds episodes + customizes fields
      ↓
User clicks "Add Series"
      ↓
POST /api/admin/series with series data + episodes array
      ↓
┌─────────────────────────────────────────┐
│ Supabase Admin Client                  │
│                                        │
│ INSERT INTO series VALUES (...)        │
│ INSERT INTO episodes VALUES (...)      │
│ (with series_id FK references)         │
│                                        │
└─────────────────────────────────────────┘
      ↓
Success response → Success modal → Auto-reload
```

---

## Episode Management Detail

### Season/Episode Selection
```
Step 1: User selects Season
┌─────────────────────┐
│ Season ▼            │
│ ┌─────────────────┐ │
│ │ Season 1        │ │
│ │ Season 2        │ │ ← Auto-populated from total_seasons
│ │ Season 3        │ │
│ │ Season 4        │ │
│ │ Season 5        │ │
│ └─────────────────┘ │
└─────────────────────┘

Step 2: User enters episode number
┌──────────────────────┐
│ Episode Number: [1]  │ ← Free text input
└──────────────────────┘

Step 3: Episode added to list
Episodes by Season:
├─ Season 1
│  ├─ Episode 1: "Pilot"
│  ├─ Episode 2: "Cat's in the Bag"
│  └─ Episode 3: "And the Bag's in the River"
│
└─ Season 2
   ├─ Episode 1: "Seven Thirty-Seven"
   └─ Episode 2: "Grilled"
```

### Episode Uniqueness
Database ensures no duplicate (series_id, season_number, episode_number):
```
Same series ID + Same season + Same episode # = Rejected
```

---

## Database Relationship

```
┌─────────────────────────────────┐
│          SERIES TABLE           │
│ ┌───────────────────────────┐  │
│ │ id (UUID)                 │  │
│ │ title (text)              │  │
│ │ slug (unique text)        │  │
│ │ description (text)        │  │
│ │ cover_image_url (text)    │  │
│ │ thumbnail_url (text)      │  │
│ │ total_seasons (integer)   │  │
│ │ tmdb_rating (decimal)     │  │
│ │ language (text)           │  │
│ │ tags (text array)         │  │
│ │ is_18_plus (boolean)      │  │
│ │ tmdb_series_id (integer)  │  │ ← Links to TMDB
│ │ created_at (timestamp)    │  │
│ │ updated_at (timestamp)    │  │
│ └───────────────────────────┘  │
│           ▲ 1 │                 │
│           │   │ Foreign Key      │
│           │   ▼ (ON DELETE CASCADE)
│        ┌──────────────────────────┐
│        │  EPISODES TABLE          │
│        │ ┌────────────────────┐  │
│        │ │ id (UUID)          │  │
│        │ │ series_id (UUID)   │──┼─ FK to series.id
│        │ │ season_number (int)│  │
│        │ │ episode_number(int)│  │
│        │ │ title (text)       │  │
│        │ │ description (text) │  │
│        │ │ video_url (text)   │  │
│        │ │ thumbnail_url(text)│  │
│        │ │ tmdb_rating(dec)   │  │
│        │ │ is_18_plus (bool)  │  │
│        │ │ created_at (ts)    │  │
│        │ │ updated_at (ts)    │  │
│        │ └────────────────────┘  │
│        └──────────────────────────┘
│
│ UNIQUE Index: (series_id, season_number, episode_number)
│
└─────────────────────────────────┘

Breaking Bad series has 48 episodes:
├─ Season 1: Episodes 1-7
├─ Season 2: Episodes 1-13
├─ Season 3: Episodes 1-13
├─ Season 4: Episodes 1-13
└─ Season 5: Episodes 1-16
```

---

## Error Handling

```
User Action                 → Error Scenario              → Response
─────────────────────────────────────────────────────────────────────
Search series               → No internet                  → "Failed to fetch"
                            → Invalid search query         → "No results found"
                            → TMDB API down               → "Error searching"

Click on series             → Network error               → "Failed to load details"
                            → Series doesn't exist        → "Series not found"

Fill episode form           → Missing required field      → "Please fill all fields"

Add series                  → Missing title/cover         → Validation error
                            → Database error              → "Failed to add series"
                            → DB table not created        → "relation series doesn't exist"

After success               → Page reload fails           → Auto-retry

```

---

## Performance Notes

### API Timeout: 10 seconds
- `/api/search-tmdb-series` aborts if TMDB takes >10s
- `/api/series-tmdb` aborts if TMDB takes >10s
- Safe abort signal prevents hanging requests

### Modal Stacking
- Search modal: `z-40` (background)
- Form modal: `z-60` (overtop)
- Success modal: `z-100` (highest priority)
- Prevents z-index conflicts

### State Management
- Local component state for form data
- Separate loading states (search loading vs details loading)
- Episodes stored as array, serialized on POST

---

## Ready to Deploy! 

Once SQL is deployed to Supabase, this entire workflow is live and production-ready.
