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
        {currentUser ? (
          <>
            <li>
              <Link href="/founders">Founder</Link>
            </li>
            <li>
              <Link href="/dashboard">DB</Link>
            </li>
            <li>
              <Link href="/send-email">Emails</Link>
            </li>
            <li className="max-w-20 overflow-hidden">{currentUser.email}</li>
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
