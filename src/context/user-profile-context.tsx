
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/lib/translations";

export type UserProfile = {
  name: string;
  email: string;
  language: Language;
  tripType: 'leisure' | 'business';
  ecoSensitivity: 'low' | 'medium' | 'high';
};

type UserProfileContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  isLoading: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    language: "en",
    tripType: "leisure",
    ecoSensitivity: "high",
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to load user profile from local storage", error);
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

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, isLoading }}>
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
