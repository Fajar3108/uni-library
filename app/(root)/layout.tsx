import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { usersTable } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import redis from "@/database/redis";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  after(async () => {
    const currentUserId = session?.user?.id;
    if (!currentUserId) return;

    const redisKey = `user:activity:${currentUserId}`;
    let currentUser = await redis.get(redisKey);

    if (!currentUser) {
      currentUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, currentUserId))
        .limit(1);

      await redis.set(redisKey, currentUser, { ex: 86400 });
    }

    if (
      // @ts-ignore
      currentUser[0].lastActivityDate === new Date().toISOString().slice(0, 10)
    )
      return;

    await db
      .update(usersTable)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(usersTable.id, currentUserId));
  });

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
