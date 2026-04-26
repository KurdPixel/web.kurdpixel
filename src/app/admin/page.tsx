import React from "react";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import Link from "next/link";
import supabaseAdmin from "@/lib/supabaseServer";
import { IconArrowRight, IconImage, IconTV, IconTheater } from "@/components/Icons";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Get primary email from Clerk
  let email: string | null = null;
  try {
    const user = await Clerk.users.getUser(userId as string);
    const primary = (user.emailAddresses || [])?.find((e: any) => e?.primary) || user.emailAddresses?.[0];
    email = primary?.emailAddress || null;
  } catch (err) {
    console.error("Failed to load user from Clerk:", err);
  }

  if (!email) {
    redirect("/");
  }

  // Check Supabase `admins` table for this email
  try {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase error checking admin:", error);
      return (
        <main className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow">
            <h1 className="text-xl font-semibold mb-2">Error</h1>
            <p className="text-gray-700">Unable to verify admin status. Try again later.</p>
          </div>
        </main>
      );
    }

    if (!data) {
      // Not an admin — redirect to home
      redirect("/");
    }

    // Admin — render admin UI
    return (
      <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
          <p className="mb-6 sm:mb-8 text-white/60 text-sm sm:text-base">Welcome, {email} — you have admin access.</p>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Movies Card */}
            <Link href="/admin/movies">
              <div className="group cursor-pointer min-h-56 sm:min-h-60 md:h-64 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-white/20 backdrop-blur-xl p-4 sm:p-6 md:p-8 hover:border-violet-400/50 transition-all hover:shadow-lg hover:shadow-violet-600/20">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex p-2 sm:p-3 rounded-lg bg-violet-600/30 mb-2 sm:mb-3 md:mb-4 group-hover:bg-violet-600/50 transition-colors">
                      <IconTheater className="h-7 w-7 sm:h-8 sm:w-8 text-violet-300" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Movies</h2>
                    <p className="text-white/60 text-xs sm:text-sm">Manage movies, add new movies, edit and delete existing ones.</p>
                  </div>
                  <div className="flex items-center text-violet-300 group-hover:translate-x-2 transition-transform">
                    <IconArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Series Card */}
            <Link href="/admin/series">
              <div className="group cursor-pointer min-h-56 sm:min-h-60 md:h-64 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-white/20 backdrop-blur-xl p-4 sm:p-6 md:p-8 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-600/20">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex p-2 sm:p-3 rounded-lg bg-cyan-600/30 mb-2 sm:mb-3 md:mb-4 group-hover:bg-cyan-600/50 transition-colors">
                      <IconTV className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-300" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">TV Series</h2>
                    <p className="text-white/60 text-xs sm:text-sm">Manage series, add new series, create episodes, edit and delete existing ones.</p>
                  </div>
                  <div className="flex items-center text-cyan-300 group-hover:translate-x-2 transition-transform">
                    <IconArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Slides Card */}
            <Link href="/admin/slides">
              <div className="group cursor-pointer min-h-56 sm:min-h-60 md:h-64 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-white/20 backdrop-blur-xl p-4 sm:p-6 md:p-8 hover:border-orange-400/50 transition-all hover:shadow-lg hover:shadow-orange-600/20">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex p-2 sm:p-3 rounded-lg bg-orange-600/30 mb-2 sm:mb-3 md:mb-4 group-hover:bg-orange-600/50 transition-colors">
                      <IconImage className="h-7 w-7 sm:h-8 sm:w-8 text-orange-300" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Carousel Slides</h2>
                    <p className="text-white/60 text-xs sm:text-sm">Manage carousel slides, add new slides with titles, descriptions, and watch links.</p>
                  </div>
                  <div className="flex items-center text-orange-300 group-hover:translate-x-2 transition-transform">
                    <IconArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (err) {
    console.error("Unexpected error checking admin status:", err);
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow">
          <h1 className="text-xl font-semibold mb-2">Error</h1>
          <p className="text-gray-700">Unexpected error. Check console for details.</p>
        </div>
      </main>
    );
  }
}
