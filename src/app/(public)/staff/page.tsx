import React from "react";
import { Clerk } from "@clerk/clerk-sdk-node";

type Member = { label: string; identifier: string; role?: string };

const STAFF: Member[] = [
  { label: "Abdulrahman", identifier: "Abdulrahman", role: "Co Founder / Designer" },
  { label: "Ayad", identifier: "Ayad", role: "Founder / Developer" },
];

export default async function StaffPage() {
  const userIds = STAFF.filter((s) => s.identifier?.startsWith("user_")).map((s) => s.identifier);
  let fetchedById: Record<string, any> = {};
  if (userIds.length > 0) {
    try {
      const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
      const fetched = await clerk.users.getUserList({ userId: userIds });
      fetchedById = Object.fromEntries(fetched.map((u: any) => [u.id, u]));
    } catch (err) {
      console.error("Failed bulk fetch Clerk users", err);
    }
  }

  const usersList = STAFF.map((m) => ({ member: m, user: fetchedById[m.identifier] || null }));

  return (
    <section className="pt-28">
      <div className="kurdish-text py-8 px-4 mx-auto max-w-5xl text-center lg:py-16 lg:px-6">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
          <h2 className="kurdish-textmb-4 text-4xl tracking-tight font-extrabold text-white">
            ستافی <span className="text-violet-500">کوردپیکسڵ</span>
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            سایتەکەمان بە هاوکاری تیمێکی پسپۆڕ و دڵسۆز کاردەکات. هەر یەکێک لە ئەندامانی تیمەکەمان بەشدارن لە
            دروستکردنی باشترین ئەزموونی سینەمایی بۆ ئێوە.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center justify-center mx-auto">
          {usersList.map(({ member, user }) => {
            const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.label)}&background=7c3aed&color=ffffff&size=256`;
            const img = user?.profileImageUrl || user?.profile_image_url || user?.imageUrl || user?.image_url || fallback;
            const name = user?.firstName || user?.fullName || user?.first_name || member.label;
            return (
              <div key={member.identifier} className="text-center text-gray-500 dark:text-gray-400">
                <img className="mx-auto mb-4 w-36 h-36 rounded-full object-cover" src={img} alt={`${name} Avatar`} draggable={false} />
                <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">
                  <a>{name}</a>
                </h3>
                <p>{member.role}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

