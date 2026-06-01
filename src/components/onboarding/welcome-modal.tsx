"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/context/user-profile-context";
import { useLanguage } from "@/context/language-context";
import { Briefcase, Coffee, Compass } from "lucide-react";

export default function WelcomeModal() {
  const { profile, setProfile, isLoading } = useUserProfile();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !profile.hasCompletedOnboarding) {
      // Small delay for smoother entry
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [profile.hasCompletedOnboarding, isLoading]);

  const handleSelect = (tripType: "business" | "leisure" | "bleisure") => {
    let newQuickLinks = profile.quickLinks || [];
    
    if (tripType === "business") {
      newQuickLinks = ["invoice", "special-requests", "concierge"];
    } else if (tripType === "leisure") {
      newQuickLinks = ["wellness-services", "experiences", "restaurant"];
    } else {
      newQuickLinks = ["eco-manager", "wellness-services", "concierge"];
    }

    setProfile({
      ...profile,
      tripType,
      quickLinks: newQuickLinks,
      hasCompletedOnboarding: true,
    });
    
    setIsOpen(false);
  };

  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md rounded-2xl glass-panel border-none shadow-2xl p-6">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-playfair">Bienvenue au Smart Guest</DialogTitle>
          <DialogDescription className="text-base text-foreground/80">
            {"Afin de personnaliser votre expérience et d'adapter nos services, quel est le motif principal de votre séjour ?"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 mt-6">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex items-start gap-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all rounded-xl"
            onClick={() => handleSelect("business")}
          >
            <Briefcase className="w-6 h-6 mt-1 text-primary" />
            <div className="text-left flex-1">
              <div className="font-semibold text-lg">Affaires</div>
              <div className="text-sm text-muted-foreground whitespace-normal">Efficacité maximale, accès rapide aux factures et espace de travail.</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex items-start gap-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all rounded-xl"
            onClick={() => handleSelect("leisure")}
          >
            <Coffee className="w-6 h-6 mt-1 text-primary" />
            <div className="text-left flex-1">
              <div className="font-semibold text-lg">Détente</div>
              <div className="text-sm text-muted-foreground whitespace-normal">Priorité au bien-être, au restaurant et aux expériences locales.</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex items-start gap-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all relative overflow-hidden rounded-xl border-primary/20"
            onClick={() => handleSelect("bleisure")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            <Compass className="w-6 h-6 mt-1 text-primary" />
            <div className="text-left flex-1 z-10">
              <div className="font-semibold text-lg">Bleisure (Mix)</div>
              <div className="text-sm text-muted-foreground whitespace-normal">Le meilleur des deux mondes : travaillez efficacement, détendez-vous ensuite.</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
