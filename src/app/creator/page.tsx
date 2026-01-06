import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import GrantCreatorButton from "../../components/GrantCreatorButton";

export default async function CreatorPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    // not signed in -> send to sign in
    redirect("/sign-in");
  }

  // read publicMetadata from session claims when available
  const publicMetadata = (sessionClaims?.publicMetadata as any) || {};

  // allow several possible metadata shapes: { role: 'creator' } or { roles: ['creator'] } or { isCreator: true }
  let isCreator = false;
  if (Array.isArray(publicMetadata.roles) && publicMetadata.roles.includes("creator")) {
    isCreator = true;
  }
  if (publicMetadata.role === "creator") isCreator = true;
  if (publicMetadata.isCreator === true) isCreator = true;

  if (!isCreator) {
    // signed in but not authorized — show a helpful 403 with metadata for debugging
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Access denied</h1>
          <p className="text-gray-700 mb-4">You are signed in but don't have the <strong>creator</strong> role.</p>
          <div className="mb-4">
            <h2 className="font-medium mb-2">Your public metadata (for debugging)</h2>
            <pre className="text-sm bg-gray-100 p-3 rounded">{JSON.stringify(publicMetadata, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm text-gray-600">If you expect to have the role, try signing out and back in, or ensure the role is set under Public metadata in the Clerk dashboard.</p>
            <GrantCreatorButton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Creator Dashboard</h1>
        <p className="text-gray-700 mb-6">Welcome — only users with the <strong>creator</strong> role can access this page.</p>

        <section className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">Create new content or manage your uploads here.</div>
          <div className="p-4 bg-gray-50 rounded">Stats, earnings, and creator settings will appear here.</div>
        </section>
      </div>
    </main>
  );
}
