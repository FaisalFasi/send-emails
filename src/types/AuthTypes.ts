import { ParsedToken, User } from "firebase/auth";

type StoreActions = {
  setCurrentUser: (currentUser: User | null) => void;
  clearCurrentUser: () => void;
  logoutUser: () => void;
  onAuthStateChanged: (currentUser: User | null) => void;
  setUser: (currentUser: User | null) => void;
  loginWithGoogle: () => void;
};

export type AuthStoreType = {
  currentUser: User | null;
  customClaims: ParsedToken | null;
} & StoreActions;
