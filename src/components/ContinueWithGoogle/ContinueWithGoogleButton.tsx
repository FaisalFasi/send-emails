"use client";
import React from "react";
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
