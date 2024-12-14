"use server";

import { auth } from "@/auth";
import db from "@/db/db";

export async function getUserProjects() {
  const session = await auth();

  if (!session?.user || !session?.user?.id) return null;

  const sessionId = session.user.id;

  return await db.query.usersToProjects.findMany({
    where: (usersToProjects, { eq }) => eq(usersToProjects.userId, sessionId),
    with: {
      projects: true,
    },
  });
}
