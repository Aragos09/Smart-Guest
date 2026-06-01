
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import MobileHeader from "@/components/layout/mobile-header";
import { LanguageProvider } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";
import DynamicBackground from "@/components/layout/dynamic-background";
import { CartProvider } from "@/context/cart-context";
import { InvoiceProvider } from "@/context/invoice-context";
import WelcomeModal from "@/components/onboarding/welcome-modal";

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
              <div className="flex w-full">
                <DynamicBackground />
                <SidebarNav />
                <MobileHeader />
                <SidebarInset className="flex-1 w-full pt-16 pb-20 md:pt-0 md:pb-0 relative overflow-x-hidden">
                  {children}
                </SidebarInset>
                <MobileNav />
                <WelcomeModal />
              </div>
            </SidebarProvider>
          </InvoiceProvider>
        </CartProvider>
      </LanguageProvider>
    </UserProfileProvider>
  );
}
