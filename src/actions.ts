"use server";

import { auth } from "@/auth";
import db from "@/db/db";
import { projects, usersToProjects } from "./db/schema";
import { revalidateTag, unstable_cache } from "next/cache";

export async function getUserProjects() {
  const session = await auth();

  if (!session?.user || !session?.user?.id) return null;

  const sessionId = session.user.id;

  return await unstable_cache(
    async () => {
      const userProjects = await db.query.usersToProjects.findMany({
        where: (usersToProjects, { eq }) =>
          eq(usersToProjects.userId, sessionId),
        with: {
          projects: true,
        },
        columns: {
          projectId: false,
          userId: false,
        },
      });

      return userProjects.map((userProject) => userProject.projects);
    },
    [`projectsOfUser:${sessionId}`],
    {
      revalidate: 900,
      tags: [`projectsOfUser:${sessionId}`],
    },
  )();
}

export const addNewProject = async (formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId === undefined) {
    return { error: "Not authenticated" };
  }

  const value = formData.get("name") as string;

  try {
    // Start a transaction
    const result = await db.transaction(async (trx) => {
      const [response] = await trx
        .insert(projects)
        .values({ name: value })
        .returning();

      if (!response) throw new Error("Failed to create project");

      const [userToProject] = await trx
        .insert(usersToProjects)
        .values({
          projectId: response.id,
          userId: userId,
        })
        .returning();

      revalidateTag(`projectsOfUser:${userId}`);
      return userToProject;
    });

    return result;
  } catch (error: any) {
    return { error: error.message };
  }
};
