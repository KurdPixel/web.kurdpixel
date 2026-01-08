import React from "react";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";
import EditMovieForm from "@/components/EditMovieForm";

type Props = { searchParams: { id?: string } };

export default async function EditMovieQueryPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const identifier = searchParams?.id;
  if (!identifier) {
    return (
      <main className="min-h-screen pt-36">
        <div className="max-w-xl mx-auto bg-white/80 p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
          <div className="text-red-600 mb-4">Missing movie id in query.</div>
          <div className="mt-4">
            <a href="/admin/movies" className="py-2 px-4 rounded border">Back to list</a>
          </div>
        </div>
      </main>
    );
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  const query = isUuid ? supabaseAdmin.from("movies").select("*").eq("id", identifier).single()
                       : supabaseAdmin.from("movies").select("*").eq("slug", identifier).single();
  const { data: movie, error } = await query;

  if (error || !movie) {
    return (
      <main className="min-h-screen pt-36">
        <div className="max-w-xl mx-auto bg-white/80 p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
          <div className="text-red-600 mb-4">Unable to load movie{error ? `: ${error.message}` : "."}</div>
          <div className="mt-4">
            <a href="/admin/movies" className="py-2 px-4 rounded border">Back to list</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-36">
      <EditMovieForm id={identifier} movie={movie} />
    </main>
  );
}
