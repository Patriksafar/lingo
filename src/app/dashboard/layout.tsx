import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { addNewProject, getUserProjects } from "@/actions";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectProvider } from "@/components/project-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/api/auth/signin");

  const projects = await getUserProjects();
  const formattedProjects = projects?.map((project) => ({
    ...project,
    name: project.name || "",
  }));

  return (
    <ProjectProvider projects={formattedProjects ?? []}>
      <SidebarProvider>
        <AppSidebar session={session} projects={formattedProjects} />
        <SidebarInset>
          {children}
          {(!projects || projects.length === 0) && (
            <CreateProjectDialog
              onSubmit={async (formData) => {
                "use server";

                await addNewProject(formData);
              }}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </ProjectProvider>
  );
}
