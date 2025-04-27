import { AuthStoreType } from "@/types/AuthTypes";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "../../firebase/client";
import { removeToken, setToken } from "@/actions/auth/authAction";

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      // state
      currentUser: null,
      customClaims: null,

      // actions
      setCurrentUser: (currentUser: User | null) => {
        set({ currentUser });
      },
      clearCurrentUser: () => {
        auth.signOut();
        set({ currentUser: null });
      },
      onAuthStateChanged: (currentUser: User | null) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          set({ currentUser: user ?? null });

          if (user) {
            const toketnResult = await user.getIdTokenResult();
            const token = toketnResult.token;
            const refreshToken = user.refreshToken;
            const claims = toketnResult.claims;

            set({ customClaims: claims ?? null });

            if (token && refreshToken) {
              await setToken({
                token,
                refreshToken,
              });
            }
            console.log("User is signed in:", user);
          } else {
            await removeToken();
            console.log("No user is signed in");
          }
        });
        console.log("Auth state changed", currentUser);
        return unsubscribe;
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
