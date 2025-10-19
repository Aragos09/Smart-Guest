
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { LanguageProvider } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProfileProvider>
      <LanguageProvider>
        <SidebarProvider>
          <SidebarNav />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </LanguageProvider>
    </UserProfileProvider>
  );
}
