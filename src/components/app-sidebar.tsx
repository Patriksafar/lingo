"use client";

import { Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import { ProjectSwitcher } from "./project-switcher";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Translations",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  session,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session;
  projects: any;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <NavUser
            user={{
              name: session.user.name ?? "Unknown",
              email: session.user.email ?? "Unknown",
              avatar: session.user.image ?? undefined,
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
