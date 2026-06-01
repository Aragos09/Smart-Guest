
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Receipt,
  Star,
  Flower2,
  User,
  LogOut,
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
  useSidebar
} from "@/components/ui/sidebar";
import { useLanguage } from "@/context/language-context";
import { useUserProfile } from "@/context/user-profile-context";
import React from "react";
import { Button } from "../ui/button";

function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { profile, logout } = useUserProfile();
  const { closeSidebar } = useSidebar();

  const navGroups = [
    {
      label: "Mon Séjour",
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "dashboard_title" },
        { href: "/smart-room", icon: Home, label: "smart_room_title" },
        { href: "/room-service", icon: ShoppingBasket, label: "room_service_title" },
        { href: "/eco-manager", icon: Leaf, label: "eco_manager_title" },
      ]
    },
    {
      label: "Espace Affaires",
      items: [
        { href: "/invoice", icon: Receipt, label: "invoice_title" },
        { href: "/special-requests", icon: Star, label: "special_requests_title" },
      ]
    },
    {
      label: "Détente & Loisirs",
      items: [
        { href: "/wellness-services", icon: Flower2, label: "wellness_services_title" },
        { href: "/experiences", icon: HeartHandshake, label: "experiences_title" },
        { href: "/restaurant", icon: Utensils, label: "restaurant_title" },
      ]
    },
    {
      label: "Assistance",
      items: [
        { href: "/concierge", icon: BotMessageSquare, label: "concierge_title" },
      ]
    }
  ];

  const settingsItem = {
    href: "/profile",
    icon: User,
    label: "profile_title",
  };

  const handleLogout = () => {
    closeSidebar();
    logout();
    router.push("/login");
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
            <SidebarTrigger className="flex" />
        </SidebarHeader>

        <SidebarContent>
            {navGroups.map((group, groupIndex) => (
              <div key={group.label} className="px-2 py-2">
                <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                  {group.label}
                </div>
                <SidebarMenu>
                  {group.items.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.href}
                        className="animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${(groupIndex * 3 + index) * 50}ms`, animationFillMode: 'backwards' }}
                        onClick={closeSidebar}
                      >
                      <Link href={item.href}>
                          <SidebarMenuButton
                          isActive={pathname.startsWith(item.href)}
                          tooltip={t(item.label as any)}
                          >
                          <item.icon />
                          <span>{t(item.label as any)}</span>
                          </SidebarMenuButton>
                      </Link>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            ))}
        </SidebarContent>

        <SidebarFooter className="mt-auto pt-4">
            <SidebarMenu>
                <SidebarMenuItem onClick={closeSidebar}>
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
                 <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      tooltip={t('logout_button' as any)}
                    >
                      <LogOut />
                      <span>{t('logout_button' as any)}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}

export default React.memo(SidebarNav);

    