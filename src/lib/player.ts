export type MediaType = "movie" | "tv";

const imdbIdCache = new Map<string, string | null>();

export async function getImdbIdFromTmdb(
  tmdbId: number | string | null | undefined,
  type: MediaType
): Promise<string | null> {
  if (!tmdbId) return null;

  const cacheKey = `${type}:${tmdbId}`;
  if (imdbIdCache.has(cacheKey)) {
    return imdbIdCache.get(cacheKey) ?? null;
  }

  const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  if (!token) {
    imdbIdCache.set(cacheKey, null);
    return null;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      imdbIdCache.set(cacheKey, null);
      return null;
    }

    const data = (await response.json()) as { imdb_id?: string | null };
    const imdbId = data.imdb_id?.trim() || null;

    imdbIdCache.set(cacheKey, imdbId);
    return imdbId;
  } catch {
    imdbIdCache.set(cacheKey, null);
    return null;
  }
}

export function buildSuperEmbedUrl(
  imdbId: string | null | undefined,
  season?: number,
  episode?: number
) {
  if (!imdbId) return "";

  const baseUrl = new URL("https://multiembed.mov/");
  baseUrl.searchParams.set("video_id", imdbId);

  const hasSeasonEpisode =
    Number.isFinite(season) &&
    Number.isFinite(episode) &&
    (season as number) > 0 &&
    (episode as number) > 0;

  if (hasSeasonEpisode) {
    baseUrl.searchParams.set("s", String(season));
    baseUrl.searchParams.set("e", String(episode));
  }

  return baseUrl.toString();
}
