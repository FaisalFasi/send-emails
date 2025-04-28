"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = () => {
  const { currentUser, onAuthStateChanged, clearCurrentUser, customClaims } =
    useAuthStore();

  useEffect(() => {
    onAuthStateChanged(currentUser);
    return () => onAuthStateChanged(currentUser);
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="navbar-brand">
        <Link href="/">Syrena</Link>
      </div>
      <ul className="navbar-menu flex space-x-4 items-center overflow-auto">
        <>
          {customClaims?.admin && (
            <>
              <li className="max-w-20 overflow-hidden">
                <Link href="/dashboard">Admin Dashboard</Link>
              </li>
              <li className="max-w-20 overflow-hidden">
                <Link href="/investors">Add Investors</Link>
              </li>

              <li>
                <Link href="/founders">Founder</Link>
              </li>
            </>
          )}
          {customClaims && !customClaims?.admin && <li>Not Admin</li>}
          <li>
            <Link href="/send-email">Emails</Link>
          </li>
        </>
        {currentUser ? (
          <>
            {/* <li className="max-w-20 overflow-hidden">{currentUser?.email}</li> */}
            <li>
              <Link href="/login" onClick={clearCurrentUser}>
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
