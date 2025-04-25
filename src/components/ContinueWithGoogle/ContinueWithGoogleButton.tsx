"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../../../firebase/client";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function ContinueWithGoogleButton() {
  const { loginWithGoogle } = useAuthStore();
  return (
    <div>
      <Button
        className="bg-blue-500 text-white font-bold  "
        onClick={loginWithGoogle}
      >
        Contineu with Google
      </Button>
    </div>
  );
}
