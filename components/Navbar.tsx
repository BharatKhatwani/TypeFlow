"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Display name fallback logic
  const displayName = session
    ? (session.user.name ?? session.user.email.split("@")[0]).split(" ")[0]
    : "";

  const handleLogout = async () => {
    setOpen(false); // Close dropdown

    await authClient.signOut(); // Sign out from auth client

    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Navbar */}
      <div className="flex justify-between items-center font-mono mt-5">
        <Link href="/" className="text-xl font-mono hover:text-blue-400 transition">
          TypeFlow
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/leaderboard" className="hover:text-blue-400 transition">
            Leaderboard
          </Link>
         

          <ModeToggle />

          {session ? (
            <div className="flex items-center gap-3 rounded px-3 py-2 border border-white/10 relative">
              {/* Name + Arrow → Toggle dropdown */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              >
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {displayName}
                </span>

                <FaChevronDown
                  className={`text-gray-500 dark:text-gray-300 text-xs transition-transform ${open ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-md border border-white/10 bg-black/80 dark:bg-white/10 backdrop-blur-sm shadow-lg py-2 z-50">

                  <Link
                    href="/profile"
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 cursor-pointer transition"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 cursor-pointer transition text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              suppressHydrationWarning={true}
              onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
              className="
                relative px-4 py-2 rounded-lg border cursor-pointer
                overflow-hidden group
              "
            >
              <span className="absolute left-0 top-0 h-full w-0 bg-blue-500/20 transition-all duration-300 group-hover:w-full" />
              <span className="relative z-10">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4" />
    </div>
  );
}