import HomeClient from "./HomeClient";
import supabaseAdmin from "@/lib/supabaseServer";

export default async function Home() {
  // Fetch the 10 latest movies instead of slides
  const { data } = await supabaseAdmin
    .from("movies")
    .select("id, title, slug, thumbnail_url, backdrop_url, description, tmdb_rating, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // Transform movies to match Slide interface
  const slides = (data ?? []).map((movie: any, index: number) => ({
    id: movie.id,
    image_url: movie.backdrop_url || movie.thumbnail_url, // Use wide backdrop_url if available
    title: movie.title,
    description: movie.description,
    watch_url: movie.slug,
    order: index,
  }));

  return <HomeClient slides={slides} />;
}

