
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/lib/translations";

export type UserProfile = {
  name: string;
  email: string;
  language: Language;
  tripType: 'leisure' | 'business' | 'bleisure';
  ecoSensitivity: 'low' | 'medium' | 'high';
  hasCheckedIn?: boolean;
  hasCompletedOnboarding?: boolean;
  bedType?: string;
  floorPreference?: string;
  viewPreference?: string;
  pillowType?: string;
  roomFragrance?: string;
  housekeepingSchedule?: string;
  dietaryRestrictions?: string;
  allergies?: string[];
  favoriteDishes?: string[];
  quickLinks?: string[];
};

type UserProfileContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
  isLoading: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    language: "en",
    tripType: "leisure",
    ecoSensitivity: "high",
    hasCheckedIn: false,
    hasCompletedOnboarding: false,
    favoriteDishes: [],
    quickLinks: ["eco-manager", "experiences", "concierge"],
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        // Ensure default quicklinks are set if they don't exist in stored profile
        if (!parsedProfile.quickLinks) {
          parsedProfile.quickLinks = defaultProfile.quickLinks;
        }
        setProfileState(prevState => ({ ...defaultProfile, ...parsedProfile }));
      } else {
        setProfileState(defaultProfile);
      }
    } catch (error) {
      console.error("Failed to load user profile from local storage", error);
      setProfileState(defaultProfile);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    try {
        setProfileState(newProfile);
        localStorage.setItem("userProfile", JSON.stringify(newProfile));
    } catch (error) {
        console.error("Failed to save user profile to local storage", error);
    }
  };

  const logout = () => {
    // Only reset the in-memory state to default, don't clear localStorage.
    // This presumes the login flow will correctly load the profile for the next user.
    setProfileState(defaultProfile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, logout, isLoading }}>
      {!isLoading && children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
