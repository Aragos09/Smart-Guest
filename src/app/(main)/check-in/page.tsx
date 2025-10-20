"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/user-profile-context";

// This page is a guard to prevent access to the check-in flow after being authenticated.
// It redirects to the dashboard.
export default function CheckInGuardPage() {
  const router = useRouter();
  const { profile } = useUserProfile();

  useEffect(() => {
    if (profile.hasCheckedIn) {
      router.replace('/dashboard');
    } else {
      router.replace('/check-in');
    }
  }, [router, profile]);

  return null; // Render nothing while redirecting
}
