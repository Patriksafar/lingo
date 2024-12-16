"use server";

import { auth } from "@/auth";
import db from "@/db/db";
import {
  projects,
  translations,
  translationsKeys,
  usersToProjects,
} from "./db/schema";
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

export async function getProjectTranslations(projectId: string) {
  const session = await auth();

  if (!session?.user || !session?.user?.id) return null;

  return await unstable_cache(
    async () => {
      const userProjects = await db.query.translationsKeys.findMany({
        where: (translationsKeys, { eq }) =>
          eq(translationsKeys.projectId, projectId),
        with: {
          translations: true,
        },
      });

      return userProjects;
    },
    [`projectTranslations:${projectId}`],
    {
      revalidate: 900,
      tags: [`projectTranslations:${projectId}`],
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

export async function addNewTranslation(projectId: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  console.log("projectId is:", projectId);

  if (userId === undefined) {
    return { error: "Not authenticated" };
  }

  const keyValue = formData.get("key") as string;
  const enValue = formData.get("en") as string;

  try {
    // Start a transaction
    const result = await db.transaction(async (trx) => {
      const [response] = await trx
        .insert(translationsKeys)
        .values({
          projectId: projectId,
          key: keyValue,
          createdBy: userId,
        })
        .returning();

      if (!response) throw new Error("Failed to create project");

      const [userToProject] = await trx
        .insert(translations)
        .values({
          value: enValue,
          keyId: response.id,
          locale: "en",
          createdBy: userId,
          lastUpdatedBy: userId,
        })
        .returning();

      revalidateTag(`projectTranslations:${projectId}`);
      return userToProject;
    });

    return result;
  } catch (error: any) {
    return { error: error.message };
  }
}
