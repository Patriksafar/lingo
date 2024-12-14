import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserProjects } from "@/actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/api/auth/signin");

  const projects = await getUserProjects();

  console.log(projects);

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        {children}
        {(!projects || projects.length === 0) && (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">No projects yet</p>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
