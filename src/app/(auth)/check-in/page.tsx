
"use client";

import { useState, memo, useEffect } from "react";
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
import { Loader, CheckCircle, Calendar, Clock } from "lucide-react";
import { useUserProfile } from "@/context/user-profile-context";
import { AppLogo } from "@/components/icons";

const CheckInPage = memo(function CheckInPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { profile, setProfile, isLoading } = useUserProfile();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // In a real app, this data would come from a booking API
  const isCheckInDay = true;
  const isCheckInEnabledByHotel = true;
  const checkInDate = "2024-08-15"; // Simulated check-in date
  const canCheckIn = isCheckInDay && isCheckInEnabledByHotel;

  useEffect(() => {
    if (!isLoading && profile.hasCheckedIn) {
      router.replace('/dashboard');
    }
  }, [isLoading, profile, router]);

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      setProfile({ ...profile, hasCheckedIn: true });
      setIsCheckingIn(false);
      router.push("/dashboard");
    }, 2000);
  };
  
  if (isLoading || profile.hasCheckedIn) {
      // Render nothing or a loader while checking profile status or redirecting
      return null;
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto mb-4">
                <AppLogo className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Smart Guest</CardTitle>
          <CardDescription>{t('app_subtitle')}</CardDescription>
        </CardHeader>
        {canCheckIn ? (
            <>
                <CardContent className="flex flex-col items-center gap-4">
                    <CardTitle className="text-xl">{t('fast_check_in_title')}</CardTitle>
                    <CardDescription>{t('fast_check_in_desc')}</CardDescription>
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
                <CardContent className="flex flex-col items-center gap-4">
                    <CardTitle className="text-xl">{t('check_in_unavailable_title')}</CardTitle>
                    <CardDescription>{t('check_in_unavailable_desc')}</CardDescription>
                    <div className="mt-4 space-y-2 text-left">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <p><strong>{t('check_in_date_label')}:</strong> {checkInDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <p><strong>{t('check_in_status_label')}:</strong> {isCheckInDay ? t('check_in_status_pending') : t('check_in_status_too_early')}</p>
                        </div>
                    </div>
                </CardContent>
            </>
        )}
      </Card>
    </div>
  );
});

export default CheckInPage;
