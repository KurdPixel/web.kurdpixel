import React from "react";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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
      <main className="min-h-screen pt-36">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="mb-6 text-gray-600">Welcome, {email} — you have admin access.</p>

          
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
