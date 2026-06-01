"use client";

import { AppLogo } from "@/components/icons";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function MobileHeader() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-lg md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2" />
        <AppLogo className="h-8 w-8 text-primary" />
        <span className="font-headline text-lg font-bold">Smart Guest</span>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
      </Button>
    </div>
  );
}
