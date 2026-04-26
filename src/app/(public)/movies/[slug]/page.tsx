import React from "react";
import supabase from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import MovieDetail from "./MovieDetail";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: movie, error } = await supabase.from("movies").select("*").eq("slug", slug).maybeSingle();

  if (!movie || error) {
    notFound();
  }

  return <MovieDetail movie={movie} />;
}

