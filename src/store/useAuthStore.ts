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
      clearCurrentUser: async () => {
        auth.signOut();
        localStorage.removeItem("firebaseAuthToken");
        localStorage.removeItem("firebaseAuthRefreshToken");
        sessionStorage.clear();

        set({ currentUser: null, customClaims: null });
        // window.location.href = "/login";
      },
      onAuthStateChanged: (currentUser: User | null) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          // set({ currentUser: user ?? null });

          if (user) {
            const toketnResult = await user.getIdTokenResult();
            const token = toketnResult.token;
            const refreshToken = user.refreshToken;
            const claims = toketnResult.claims;

            set({ currentUser: user, customClaims: claims ?? null });

            if (token && refreshToken) {
              await setToken({
                token,
                refreshToken,
              });
            }
            console.log("User is signed in:", user);
          } else {
            await removeToken();
            set({ currentUser: null, customClaims: null });
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
          const loggedInUser = await signInWithPopup(auth, provider);

          set({ currentUser: loggedInUser.user });
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
