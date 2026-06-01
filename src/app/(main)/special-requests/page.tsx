"use client";

import { useState, memo } from "react";
import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

const SpecialRequestsPage = memo(function SpecialRequestsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [wakeUpTime, setWakeUpTime] = useState("");
  const [lateCheckoutTime, setLateCheckoutTime] = useState("");
  
  const [wakeUpStatus, setWakeUpStatus] = useState<"idle" | "confirmed">("idle");
  const [lateCheckoutStatus, setLateCheckoutStatus] = useState<"idle" | "pending">("idle");

  const handleWakeUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wakeUpTime) return;
    setWakeUpStatus("confirmed");
    toast({
      title: t("request_submitted_toast"),
      description: t("request_submitted_desc"),
    });
  };

  const handleLateCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lateCheckoutTime) return;
    setLateCheckoutStatus("pending");
    toast({
      title: t("request_submitted_toast"),
      description: t("request_submitted_desc"),
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t("special_requests_title")}
        </h1>
        <p className="text-muted-foreground">
          {t("special_requests_subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Wake-up Call Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("wake_up_call_title")}
            </CardTitle>
            <CardDescription>{t("wake_up_call_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {wakeUpStatus === "confirmed" ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="font-semibold">{t("status_confirmed")}</span>
                  <span className="text-sm">
                    {t("time_label")}: {wakeUpTime}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWakeUpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wakeup-time">{t("time_label")}</Label>
                  <Input
                    id="wakeup-time"
                    type="time"
                    required
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("submit_request_button")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Late Check-out Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              {t("late_checkout_title")}
            </CardTitle>
            <CardDescription>{t("late_checkout_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {lateCheckoutStatus === "pending" ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                <Clock3 className="h-5 w-5 animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-semibold">{t("status_pending")}</span>
                  <span className="text-sm">
                    {t("time_label")}: {lateCheckoutTime}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLateCheckoutSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-time">{t("time_label")}</Label>
                  <Input
                    id="checkout-time"
                    type="time"
                    required
                    value={lateCheckoutTime}
                    onChange={(e) => setLateCheckoutTime(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("submit_request_button")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SpecialRequestsPage;
