"use server";

import { signOut as signOutFunction } from "@/auth";

export const signOut = async () => {
  await signOutFunction({ redirectTo: "/login" });
};
