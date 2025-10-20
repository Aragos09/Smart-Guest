
"use client";

import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle } from "lucide-react";
import { useUserProfile } from "@/context/user-profile-context";

const CheckInPage = memo(function CheckInPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { profile, setProfile } = useUserProfile();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // In a real app, this would be based on booking dates & hotel system status
  const isCheckInDay = true;
  const isCheckInEnabledByHotel = true;
  const canCheckIn = isCheckInDay && isCheckInEnabledByHotel;

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      // Persist check-in status
      setProfile({ ...profile, hasCheckedIn: true });
      setIsCheckingIn(false);
      router.push("/dashboard");
    }, 2000);
  };
  
  // If user is already checked-in, redirect to dashboard
  if (profile.hasCheckedIn) {
      router.replace('/dashboard');
      return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                {canCheckIn ? (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('fast_check_in_title')}</CardTitle>
                            <CardDescription>{t('fast_check_in_desc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <CheckCircle className="h-24 w-24 text-primary" />
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleCheckIn} disabled={isCheckingIn}>
                                {isCheckingIn && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                {isCheckingIn ? t('checking_in_button') : t('check_in_button')}
                            </Button>
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('check_in_unavailable_title')}</CardTitle>
                            <CardDescription>{t('check_in_unavailable_desc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <CheckCircle className="h-24 w-24 text-muted-foreground" />
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    </div>
  );
});

export default CheckInPage;
