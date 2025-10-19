"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/lib/translations";
import { getTranslator } from "@/lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: any) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
    // We need to reload to apply translations correctly across the app
    window.location.reload();
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
