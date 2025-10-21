
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import { LanguageProvider } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";
import DynamicBackground from "@/components/layout/dynamic-background";
import { CartProvider } from "@/context/cart-context";
import { InvoiceProvider } from "@/context/invoice-context";

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
              <div className="flex">
                <DynamicBackground />
                <SidebarNav />
                <SidebarInset>
                  {children}
                </SidebarInset>
              </div>
            </SidebarProvider>
          </InvoiceProvider>
        </CartProvider>
      </LanguageProvider>
    </UserProfileProvider>
  );
}
