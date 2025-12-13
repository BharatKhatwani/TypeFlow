'use client'

import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();

  const [accuracy, setAccuracy] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/typing/stats");
        const data = await response.json();

        if (data.stats) {
          setAccuracy(data.stats.bestAccuracy ?? 0);
          setSpeed(data.stats.bestSpeed ?? 0);
          setStreak(data.stats.currentStreak ?? 0);
          setAverageSpeed(Math.round(data.stats.averageSpeed ?? 0));
          setAverageAccuracy(Math.round(data.stats.averageAccuracy ?? 0));
          setTestsCompleted(data.stats.testsCompleted ?? 0);
          setTotalHours(Math.floor((data.stats.totalTime ?? 0) / 3600));
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{displayName}</h1>
          <Button>Edit Profile</Button>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-600 dark:text-gray-400">
          <StatCard title="Best Speed" value={`${speed} WPM`} />
          <StatCard title="Best Accuracy" value={`${accuracy} %`} />
          <StatCard title="Current Streak" value={`🔥 ${streak} Days`} />
        </div>

        {/* SECOND GRID (YOU ASKED FOR THIS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600 dark:text-gray-400">
          <StatCard title="Average Speed" value={`${averageSpeed} WPM`} />
          <StatCard title="Average Accuracy" value={`${averageAccuracy} %`} />
          <StatCard title="Tests Completed" value={testsCompleted} />
          <StatCard title="Total Hours" value={`${totalHours} hrs`} />
        </div>

      </div>
    </div>
  );
}

/* 🔹 Reusable card */
function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-lg border p-6 text-center">
      <p className="text-sm mb-2">{title}</p>
      <p className="text-xl font-semibold text-black dark:text-white">
        {value}
      </p>
    </div>
  );
}
