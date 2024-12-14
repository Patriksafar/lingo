import { auth } from "@/auth";
import { SignIn } from "@/components/auth/signin-button";
import { SignOut } from "@/components/auth/signout-button";
import UserAvatar from "@/components/user-avatar/user-avatar";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) return redirect("/api/auth/signin");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        Protected dashboard with login only
        <UserAvatar />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!session ? <SignIn /> : <SignOut />}
        </div>
      </main>
    </div>
  );
}
