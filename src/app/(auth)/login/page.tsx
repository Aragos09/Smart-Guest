"use client";

import { useRouter } from "next/navigation";
import { AppleIcon, AppLogo, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "Redirecting to your dashboard...",
    });
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AppLogo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Smart Guest</CardTitle>
        <CardDescription>
          {t('Your AI-powered sustainable travel companion')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">{t('Email')}</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">{t('Password')}</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              {t('Sign In')}
            </Button>
          </div>
        </form>
        <Separator className="my-6">
          <span className="px-2 text-xs text-muted-foreground bg-card">OR</span>
        </Separator>
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            <GoogleIcon className="mr-2 h-4 w-4" />
            {t('Continue with Google')}
          </Button>
          <Button variant="outline" className="w-full">
            <AppleIcon className="mr-2 h-4 w-4" />
            {t('Continue with Apple')}
          </Button>
        </div>
      </CardContent>
       <CardFooter className="flex-col gap-2 pt-6">
        <p className="text-xs text-muted-foreground">
          {t('Don\'t have an account? Sign up')}
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/signup">{t('create_account_button')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
