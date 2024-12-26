import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateNewTranslationsDialog } from "@/components/create-new-translations-dialog";
import { getProjectTranslations } from "@/actions";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardContent } from "./components/dashboard-content";
import { Suspense } from "react";

// TODO: Move this to config of project
const LOCALES_TO_DISPLAY = ["en", "cs", "pl"];

export default async function Dashboard() {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  const translations = await getProjectTranslations("aulgu3kf4tu6iegt9pyflau6");

  const translationsWithLocales = translations?.map((translation) => {
    const translationsWithLocales = LOCALES_TO_DISPLAY.map((locale) => {
      const translationForLocale = translation.translations.find(
        (t) => t.locale === locale,
      );

      return {
        locale,
        value: translationForLocale?.value || "",
      };
    });

    return {
      ...translation,
      translations: translationsWithLocales,
    };
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear justify-between group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <CreateNewTranslationsDialog />
        </div>
      </header>
      <DashboardContent />
    </>
  );
}
