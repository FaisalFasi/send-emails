"use server";

import { cookies } from "next/headers.js";
import { auth } from "../../../firebase/server.ts";

export const setToken = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  try {
    // Verify the token using Firebase Admin SDK it will be jwt token
    const verifiedToken = await auth.verifyIdToken(token);

    if (!verifiedToken) {
      throw new Error("Token verification failed");
    }

    const userRecord = await auth.getUser(verifiedToken.uid);

    if (
      process.env.NEXT_ADMIN_EMAIL === userRecord.email &&
      !userRecord.customClaims?.admin
    ) {
      auth.setCustomUserClaims(verifiedToken.uid, { admin: true });

      const cookieStore = await cookies();

      cookieStore.set("firebaseAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Admin role assigned to user:", userRecord.email);
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Token verification failed");
  }
};

export const removeToken = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("firebaseAuthToken");
  cookieStore.delete("firebaseAuthRefreshToken");
};
