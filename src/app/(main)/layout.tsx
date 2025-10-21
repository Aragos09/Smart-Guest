
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import { LanguageProvider } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";
import DynamicBackground from "@/components/layout/dynamic-background";
import { CartProvider } from "@/context/cart-context";
import { InvoiceProvider } from "@/context/invoice-context";
import { PanelLeft } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProfileProvider>
      <LanguageProvider>
        <CartProvider>
          <InvoiceProvider>
            <SidebarProvider>
              <div className="md:flex">
                <DynamicBackground />
                <SidebarNav />
                <SidebarInset>
                  <div className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-4 md:hidden">
                    <SidebarTrigger>
                      <PanelLeft />
                    </SidebarTrigger>
                  </div>
                  <div className="flex-1 overflow-auto">{children}</div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </InvoiceProvider>
        </CartProvider>
      </LanguageProvider>
    </UserProfileProvider>
  );
}
