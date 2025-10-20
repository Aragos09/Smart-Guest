
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BotMessageSquare,
  Building2,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Settings,
  Utensils,
  Wind,
  ShoppingBasket,
  Home,
} from "lucide-react";
import { AppLogo } from "@/components/icons";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/context/language-context";
import { useUserProfile } from "@/context/user-profile-context";
import React from "react";

function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile } = useUserProfile();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "dashboard_title" },
    { href: "/smart-room", icon: Home, label: "smart_room_title" },
    { href: "/eco-manager", icon: Leaf, label: "eco_manager_title" },
    { href: "/services", icon: Building2, label: "services_title" },
    { href: "/experiences", icon: HeartHandshake, label: "experiences_title" },
    { href: "/restaurant", icon: Utensils, label: "restaurant_title" },
    { href: "/room-service", icon: ShoppingBasket, label: "room_service_title" },
    { href: "/wellness", icon: Wind, label: "wellness_title" },
    { href: "/concierge", icon: BotMessageSquare, label: "concierge_title" },
  ];

  const settingsItem = {
    href: "/profile",
    icon: Settings,
    label: "profile_title",
  };

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-transparent group-data-[variant=inset]:border-none dark:group-data-[variant=inset]:bg-transparent">
        <SidebarHeader className="flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <AppLogo className="size-8 shrink-0 text-sidebar-primary dark:text-sidebar-primary" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-lg font-bold text-sidebar-foreground">
                  Smart Guest
                </span>
                <span className="text-sm text-sidebar-foreground/70">{t('hello_user')}, {profile.name}!</span>
              </div>
            </div>
            <SidebarTrigger className="hidden md:flex" />
        </SidebarHeader>

        <SidebarContent>
            <SidebarMenu>
            {navItems.map((item, index) => (
                <SidebarMenuItem 
                  key={item.href}
                  className="animate-in fade-in-0 slide-in-from-left-2"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                <Link href={item.href}>
                    <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={t(item.label as any)}
                    >
                    <item.icon />
                    <span>{t(item.label as any)}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href={settingsItem.href}>
                        <SidebarMenuButton
                        isActive={pathname === settingsItem.href}
                        tooltip={t(settingsItem.label as any)}
                        >
                        <settingsItem.icon />
                        <span>{t(settingsItem.label as any)}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}

export default React.memo(SidebarNav);
