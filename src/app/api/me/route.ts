import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ signedIn: false });

  try {
    const user = await Clerk.users.getUser(userId as string);
    const imageUrl =
      (user as any)?.imageUrl ||
      (user as any)?.profileImageUrl ||
      (user as any)?.profile_image_url ||
      null;

    return NextResponse.json({
      signedIn: true,
      userId,
      imageUrl,
    });
  } catch (err) {
    console.error("Failed to load user from Clerk:", err);
    return NextResponse.json({ signedIn: true, userId, imageUrl: null });
  }
}

