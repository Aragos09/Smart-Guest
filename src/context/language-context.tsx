
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/lib/translations";
import { getTranslator } from "@/lib/translations";
import { useUserProfile } from "./user-profile-context";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: any) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, setProfile } = useUserProfile();
  const [language, setLanguageState] = useState<Language>(profile.language);

  useEffect(() => {
    setLanguageState(profile.language);
  }, [profile.language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setProfile({ ...profile, language: newLanguage });
    if (profile.language !== newLanguage) {
      // We need to reload to apply translations correctly across the app
      window.location.reload();
    }
  };
  
  const t = getTranslator(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
