"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = () => {
  const { currentUser, onAuthStateChanged, clearCurrentUser } = useAuthStore();

  useEffect(() => {
    onAuthStateChanged(currentUser);
    return () => onAuthStateChanged(currentUser);
  }, []);

  console.log("Auth state changed", currentUser);
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="navbar-brand">
        <a href="/">Syrena</a>
      </div>
      <ul className="navbar-menu flex space-x-4">
        <li>
          <Link href="/send-email">Send-Emails</Link>
        </li>
        {currentUser ? (
          <>
            <li>
              {currentUser.email}
              {/* <Link href="/profile">{currentUser.email}</Link> */}
            </li>
            <li>
              <Link href="/" onClick={clearCurrentUser}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
