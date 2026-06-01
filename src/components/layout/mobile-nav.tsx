"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BotMessageSquare, User, Menu, Home } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSidebar } from "@/components/ui/sidebar";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { toggleSidebar } = useSidebar();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "dashboard_title" },
    { href: "/smart-room", icon: Home, label: "smart_room_title" },
    { href: "/concierge", icon: BotMessageSquare, label: "concierge_title" },
    { href: "/profile", icon: User, label: "profile_title" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-around border-t border-white/10 bg-background/70 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`relative p-1.5 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon className={`h-6 w-6 ${isActive ? "fill-primary/20" : ""}`} />
            </div>
            <span className="text-[10px] font-medium leading-none text-center">
              {t(item.label as any)}
            </span>
          </Link>
        );
      })}

      <button
        onClick={toggleSidebar}
        className="flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 text-muted-foreground hover:text-foreground active:scale-95"
      >
        <div className="relative p-1.5 rounded-full">
          <Menu className="h-6 w-6" />
        </div>
        <span className="text-[10px] font-medium leading-none text-center">
          {t('menu_title' as any)}
        </span>
      </button>
    </div>
  );
}
