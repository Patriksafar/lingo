"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getProjectTranslations } from "@/actions";
import { useProjects } from "@/components/project-provider";

interface Translation {
  id: string;
  key: string;
  translations: {
    locale: string;
    value: string;
  }[];
}

const LOCALES_TO_DISPLAY = ["en", "cs", "pl"];

export function DashboardContent() {
  const { activeProject } = useProjects();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeProject?.id) {
      setLoading(true);
      fetchTranslations(activeProject.id);
    }
  }, [activeProject?.id]);

  const fetchTranslations = async (projectId: string) => {
    const fetchedTranslations = await getProjectTranslations(projectId);
    const processedTranslations = fetchedTranslations?.map((translation) => {
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

    setLoading(false);
    if (!processedTranslations) return;

    setTranslations(processedTranslations);
  };

  if (loading)
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">Loading...</div>
    );

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {translations?.map((translation) => (
          <div
            key={translation.id}
            className="grid gap-4 bg-card border border-border p-4 rounded-lg"
          >
            <div className="grid gap-4">
              <div className="flex gap-1">
                <Badge>{translation.key}</Badge>
              </div>
              {translation.translations?.map((translation) => {
                return (
                  <div key={translation.locale} className="flex gap-4">
                    <div className="text-sm font-semibold">
                      {translation.locale}
                    </div>
                    <Textarea
                      className="text-sm"
                      defaultValue={translation.value}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
