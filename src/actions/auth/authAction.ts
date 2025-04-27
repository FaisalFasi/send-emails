"use server";

import { cookies } from "next/headers.js";
import { auth } from "../../../firebase/server.ts";

console.log("Admin email from env:", process.env.NEXT_ADMIN_EMAIL);
const adminEmails = [
  process.env.NEXT_ADMIN_EMAIL, // Primary admin from environment variable
  "anirudh.bizfloww@gmail.com", // Additional admin email
  "admin2@example.com", // Additional admin email
  // Add more emails as needed
];

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
    const cookieStore = await cookies();

    if (adminEmails.includes(userRecord.email)) {
      if (!userRecord.customClaims?.admin) {
        await auth.setCustomUserClaims(verifiedToken.uid, { admin: true });
        console.log("Admin role assigned to user:", userRecord.email);
      }
      // const customToken = {
      //   id: verifiedToken.uid,
      //   email: userRecord.email,
      //   admin: true,
      //   iat: Math.floor(Date.now() / 1000),
      // };

      cookieStore.set("firebaseAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Admin role assigned to user:", userRecord.email);
    } else {
      cookieStore.set("firebaseAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
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
