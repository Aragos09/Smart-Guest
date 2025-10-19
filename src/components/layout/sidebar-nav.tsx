"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BotMessageSquare,
  Building2,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Settings,
  User,
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
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getTranslator } from "@/lib/translations";

// For demonstration, we'll hardcode the language.
// In a real app, this would come from user preferences or context.
const lang = "fr";
const t = getTranslator(lang);

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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=inset]:bg-transparent group-data-[variant=inset]:border-none dark:group-data-[variant=inset]:bg-transparent">
        <SidebarHeader className="flex items-center gap-2">
            <AppLogo className="size-8 shrink-0 text-sidebar-primary dark:text-sidebar-primary" />
            <div className="flex flex-1 flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">
                Smart Guest
              </span>
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
