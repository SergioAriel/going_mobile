import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/expo";
import { getUser, uploadUser } from "@/lib/ServerActions/users";
import { User } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

interface UserContextType {
  userData: User;
  setUserData: Dispatch<SetStateAction<User>>;
  handlerTheme: (theme: "dark" | "light" | "system") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {

  const { ready, authenticated, user } = usePrivy()
  const [userData, setUserData] = useState<User>({
    _id: "",
    name: "going",
    isSeller: false,
    addresses: [],
    email: "going@example.com",
    avatar: "/logo.png",
    joined: "January 2025",
    location: "",
    bio: "",
    website: "",
    twitter: "",
    x: "",
    instagram: "",
    telegram: "",
    facebook: "",
    settings: {
      theme: "light",
      currency: "",
      language: "en",
    },
    wishlist: []
  });

  useEffect(() => {
    (async () => {
      if (ready && authenticated && user) {
        try {
          const resUserData = (await getUser(user?.id.toString()))

          if (resUserData) {
            setUserData((prev) => ({
              ...prev,
              ...resUserData
            }))
            return
          }
          const defaultUserData: User = {
            _id: user.id,
            name: user?.google?.name || "",
            addresses: [],
            isSeller: false,
            email: user?.google?.email || "",
            avatar: "",
            joined: "",
            location: "",
            bio: "",
            website: "",
            twitter: "",
            x: "",
            instagram: "",
            telegram: "",
            facebook: "",
            settings: {
              theme: "light",
              currency: "USD",
              language: "en",
            },
            wishlist: []
          }

          setUserData(defaultUserData)
          uploadUser(defaultUserData)
        } catch (error) {
          console.log(error)

        }
      }
    })();
  }, [ready, authenticated, user]);

  useEffect(() => {
    const loadTheme = async () => {
        const theme = await AsyncStorage.getItem("theme");
        if(theme) {
            setUserData(prev => ({...prev, settings: {...prev.settings, theme: theme as "light" | "dark" | "system"}}))
        }
    }
    loadTheme();
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if(userData.settings.theme === 'system') {
            setUserData(prev => ({...prev, settings: {...prev.settings, theme: colorScheme || 'light'}}))
        }
    });
    return () => subscription.remove();
  }, [userData.settings.theme]);

  const handlerTheme = async (theme: "dark" | "light" | "system") => {
    await AsyncStorage.setItem("theme", theme);
    setUserData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        theme,
      },
    }));
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, handlerTheme }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}