
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
import type { Language } from "@/lib/translations";
import Link from "next/link";
import { memo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = memo(function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
        toast({
            variant: "destructive",
            title: t('terms_not_accepted_title'),
            description: t('terms_not_accepted_desc'),
        });
        return;
    }
    router.push("/check-in");
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
        <div className="flex justify-center gap-2 pt-4">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('fr')}
            >
              FR
            </Button>
          </div>
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
             <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('accept_terms_and_conditions')}
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={!acceptedTerms}>
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
});

export default LoginPage;
