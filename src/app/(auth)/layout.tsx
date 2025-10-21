
import { LanguageProvider } from "@/context/language-context";
import { UserProfileProvider } from "@/context/user-profile-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProfileProvider>
      <LanguageProvider>
        <div className="flex min-h-full flex-col items-center justify-center bg-background p-4">
          {children}
        </div>
      </LanguageProvider>
    </UserProfileProvider>
  )
}
