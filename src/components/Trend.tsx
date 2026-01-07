import React from "react";
import supabase from "../lib/supabaseClient";
import Link from "next/link";

export default async function Trend() {
  // Fetch the latest movies (server component)
  const { data: movies } = await supabase
    .from("movies")
    .select("id, title, slug, thumbnail_url")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <section dir="rtl" className="py-6">
      <div className="max-w-6xl mx-auto px-4">
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <h3 className="text-xl font-bold mb-4">نوێترین فیلمەکان</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {movies?.map((m: any) => (
            <Link key={m.id} href={`/movies/${m.slug}`} className="block">
              <div className="bg-white/5 w-40 h-56 rounded overflow-hidden shadow hover:scale-105 transform transition">
                <img src={m.thumbnail_url} alt={m.title} className="object-cover" />
                <div className="p-2 text-sm font-semibold text-right">{m.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}