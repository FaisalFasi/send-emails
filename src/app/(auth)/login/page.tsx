"use client";
import ContinueWithGoogleButton from "@/components/ContinueWithGoogle/ContinueWithGoogleButton";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LoginPage = () => {
  const { currentUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ContinueWithGoogleButton />
    </div>
  );
};

export default LoginPage;
