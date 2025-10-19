
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

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile } = useUserProfile();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("Dashboard") },
    { href: "/eco-manager", icon: Leaf, label: t("Eco Manager") },
    { href: "/services", icon: Building2, label: t("Services") },
    { href: "/experiences", icon: HeartHandshake, label: t("Experiences") },
    { href: "/restaurant", icon: Utensils, label: t("Restaurant") },
    { href: "/wellness", icon: Wind, label: t("Wellness") },
    { href: "/concierge", icon: BotMessageSquare, label: t("Concierge") },
  ];

  const settingsItem = {
    href: "/profile",
    icon: Settings,
    label: t("Profile"),
  };

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-transparent group-data-[variant=inset]:border-none dark:group-data-[variant=inset]:bg-transparent">
        <SidebarHeader className="flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <AppLogo className="size-8 shrink-0 text-sidebar-primary dark:text-sidebar-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-sidebar-foreground">
                  Smart Guest
                </span>
                <span className="text-sm text-sidebar-foreground/70">{t('Hello')} {profile.name}!</span>
              </div>
            </div>
            <SidebarTrigger className="hidden md:flex" />
        </SidebarHeader>

        <SidebarContent>
            <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    >
                    <item.icon />
                    <span>{item.label}</span>
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
                        tooltip={settingsItem.label}
                        >
                        <settingsItem.icon />
                        <span>{settingsItem.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}
