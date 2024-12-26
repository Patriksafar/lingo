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
import { eq } from "drizzle-orm";

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

export async function updateTranslation(keyId: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId === undefined) {
    return { error: "Not authenticated" };
  }

  // updated values
  const enValue = formData.get("en") as string;
  const csValue = formData.get("cs") as string;
  const plValue = formData.get("pl") as string;

  try {
    // first get all translations for the key
    const response = await db.query.translations.findMany({
      where: (translations, { eq }) => eq(translations.keyId, keyId),
    });

    if (!response) throw new Error("Failed to find translations");

    // translations for update
    const translationsToUpdate = response.map((translation) => {
      if (translation.locale === "en") {
        translation.value = enValue;
      } else if (translation.locale === "cs") {
        translation.value = csValue;
      } else if (translation.locale === "pl") {
        translation.value = plValue;
      }

      return translation;
    });

    // translations for insert
    const translationsToInsert = [
      { locale: "en", value: enValue },
      { locale: "cs", value: csValue },
      { locale: "pl", value: plValue },
    ].filter((translation) => {
      return !translationsToUpdate.find((t) => t.locale === translation.locale);
    });

    console.log(translationsToInsert);

    // update translations
    await db.transaction(async (trx) => {
      await Promise.all([
        // translationsToUpdate.map((translation) => {
        //   return trx
        //     .update(translations)
        //     .set({ value: translation.value })
        //     .where(eq(translations.id, translation.id));
        // }),
        translationsToInsert.map(async (translation) => {
          console.log("inserting", translation.locale);
          return trx
            .insert(translations)
            .values({
              value: translation.value,
              keyId: keyId,
              locale: translation.locale as any,
              createdBy: userId,
              lastUpdatedBy: userId,
            })
            .returning();
        }),
      ]);
    });

    revalidateTag(`projectTranslations:${keyId}`);
  } catch (error: any) {
    return { error: error.message };
  }
}
