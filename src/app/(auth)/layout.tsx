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
        <div className="flex min-h-full items-center justify-center p-4">
          {children}
        </div>
      </LanguageProvider>
    </UserProfileProvider>
  )
}
