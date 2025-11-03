
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";
import { LanguageProvider } from "@/context/language-context";
import DynamicBackground from "@/components/layout/dynamic-background";

function SplashContent() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <DynamicBackground />
      <div className="flex h-full flex-col items-center justify-center animate-in fade-in duration-1000">
        <div className="flex flex-col items-center gap-4 text-center">
          <AppLogo className="h-20 w-20 text-primary animate-pulse" />
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold tracking-tight font-headline text-foreground">
              Smart Guest
            </h1>
            <p className="text-muted-foreground">{t('app_subtitle')}</p>
          </div>
        </div>
      </div>
    </>
  );
}


export default function RootPage() {
    return (
        <UserProfileProvider>
            <LanguageProvider>
                <SplashContent />
            </LanguageProvider>
        </UserProfileProvider>
    )
}
