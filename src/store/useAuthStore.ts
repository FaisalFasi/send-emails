import { AuthStoreType } from "@/types/AuthTypes";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "../../firebase/client";

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      // state
      currentUser: null,

      // actions
      setCurrentUser: (currentUser: User | null) => {
        set({ currentUser });
      },
      clearCurrentUser: () => {
        auth.signOut();
        set({ currentUser: null });
      },
      onAuthStateChanged: (currentUser: User | null) => {
        auth.onAuthStateChanged((user) => {
          set({ currentUser: user ?? null });
        });
        console.log("Auth state changed", currentUser);
      },
      setUser: (currentUser: User | null) => {
        set({ currentUser });
      },

      logoutUser: () => {
        auth.signOut();
        set({ currentUser: null });
      },
      loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          console.log("User logged in with Google");
        } catch (error) {
          console.error("Error logging in with Google", error);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
