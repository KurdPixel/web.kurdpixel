import React from "react";
import supabase from "../../lib/supabaseClient";
import MoviesFilter from "@/components/MoviesFilter";

export default async function MoviesPage() {
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, title, slug, thumbnail_url, description, tags")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading movies: {error.message}</div>;
  }

  return (
    <main className="min-h-screen pt-28" dir="rtl">
      <h1 className="kurdish-text text-center text-5xl font-semibold py-6 text-violet-500">فیلمەکان</h1>
      <MoviesFilter movies={movies ?? []} />
    </main>
  );
}