
"use client";

import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "Redirecting to your smart room...",
    });
    router.push("/smart-room");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AppLogo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Smart Guest</CardTitle>
        <CardDescription>
          {t('app_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">{t('password_label')}</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              {t('sign_in_button')}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-6">
          <Button variant="link" asChild>
            <Link href="/signup">{t("signup_link_text")}</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
