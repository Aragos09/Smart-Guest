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

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/eco-manager", icon: Leaf, label: "Eco Manager" },
  { href: "/services", icon: Building2, label: "Services" },
  { href: "/experiences", icon: HeartHandshake, label: "Experiences" },
  { href: "/restaurant", icon: Utensils, label: "Restaurant" },
  { href: "/wellness", icon: Wind, label: "Wellness" },
  { href: "/concierge", icon: BotMessageSquare, label: "Concierge" },
];

const settingsItem = {
  href: "/profile",
  icon: Settings,
  label: "Profile",
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
