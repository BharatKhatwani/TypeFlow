'use client'

import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

export default function Page() {
  const { data: session } = useSession();

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/typing/stats");
        const data = await response.json();

        if (data.stats) {
          setStreak(data.stats.currentStreak ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      }
    };

    fetchProfileData();
  }, []);

  const displayName = session
    ? (session.user.name ?? session.user.email.split("@")[0]).split(" ")[0]
    : "";

  return (
    <div className="font-mono">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4 border p-6 rounded-lg shadow">
          <FaUser className="text-xl" />
          <h1 className="text-2xl font-semibold">{displayName}</h1>

          {/* COMPACT STREAK BOX */}
          {streak > 0 && (
            <div className="ml-auto inline-flex items-center gap-1.5 border rounded-full px-3 py-1 shadow-sm">
              <span className="text-orange-500">🔥</span>
              <span className="text-sm font-semibold">
                {streak}d
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
