import React from "react";
import supabase from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import MovieDetail from "./MovieDetail";

// This page expects a dynamic slug param
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Fetch movie data from Supabase
  const { slug } = await params;
  const { data: movie, error } = await supabase
    .from("movies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!movie || error) {
    notFound();
  }

  return <MovieDetail movie={movie} />;
}
