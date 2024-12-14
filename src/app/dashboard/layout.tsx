import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserProjects } from "@/actions";
import { CreateProjectDialog } from "@/components/create-project-dialog";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/api/auth/signin");

  const projects = await getUserProjects();

  return (
    <SidebarProvider>
      <AppSidebar session={session} projects={projects} />
      <SidebarInset>
        {children}
        {(!projects || projects.length === 0) && <CreateProjectDialog />}
      </SidebarInset>
    </SidebarProvider>
  );
}
