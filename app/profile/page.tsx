'use client';

import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import Heatmap from "@/components/Heatmap";

interface UserStats {
  currentStreak: number;
  bestByDuration: Record<string, { wpm: number; accuracy: number }>;
  testsCompleted: number;
  totalTime: number;
}

interface HistoryItem {
  _id: string;
  wpm: number;
  accuracy: number;
  duration: number;
  testDate: string;
  completedAt?: string;
}

export default function Page() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [heatmapData, setHeatmapData] = useState<{ date: string | Date; count: number }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [joiningdate , setJoiningdate] = useState<Date | null>(null);


  useEffect(() => {
    const fetchProfileData = async () => {
      // Fetch Stats
      try {
        const statsRes = await fetch("/api/typing/stats");
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }

      // Fetch Heatmap
      try {
        const heatmapRes = await fetch("/api/typing/heatmap");
        if (heatmapRes.ok) {
          const data = await heatmapRes.json();
          setHeatmapData(data);
        }
      } catch (e) {
        console.error("Failed to fetch heatmap", e);
      }

      // Fetch History (Independent)
      try {
        const historyRes = await fetch("/api/typing/history");
        if (historyRes.ok) {
          const data = await historyRes.json();
          setHistory(data.history || []);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      }

      setLoading(false);
    };

    fetchProfileData();
  }, []);

  const displayName = session
    ? (session.user.name ?? session.user.email.split("@")[0]).split(" ")[0]
    : "Guest";
  const joiningDate = session?.user.createdAt ? new Date(session.user.createdAt) : null;

  return (
    <div className="font-mono min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER CARD */}
        <div className="flex items-center justify-between gap-6 border border-border bg-card dark:bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
          {/* LEFT: Avatar + Name */}
          <div className="flex items-center gap-6">
            {session?.user.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-orange-500/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-2xl font-bold">
                {displayName[0]}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{displayName}</h1>
              <p className="text-sm text-muted-foreground">
                Joined {joiningDate ? joiningDate.toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* RIGHT: Streak */}
          <div className="text-center px-6 py-3 bg-muted dark:bg-black/20 rounded-xl border border-border dark:border-white/5">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-orange-500 flex items-center justify-center gap-2">
              🔥 {stats?.currentStreak ?? 0}
              <span className="text-sm font-normal text-muted-foreground transform translate-y-1">days</span>
            </div>
          </div>
        </div>

        {/* BEST SCORES GRID */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-foreground">Best Scores</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[15, 30, 60, 120, 180].map((duration) => {
              const data = stats?.bestByDuration?.[duration.toString()];

              return (
                <div
                  key={duration}
                  className="bg-card dark:bg-white/5 border border-border dark:border-white/10 rounded-xl p-5 hover:bg-muted/50 dark:hover:bg-white/10 transition duration-200 group"
                >
                  <div className="text-xs text-muted-foreground mb-4 font-semibold tracking-wider group-hover:text-orange-500 transition-colors">
                    {duration} SECONDS
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold text-foreground leading-none">
                        {data?.wpm ? data.wpm : "--"}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 uppercase">wpm</div>
                    </div>

                    <div>
                      <div className="text-xl font-medium text-foreground/80 leading-none">
                        {data?.accuracy ? `${data.accuracy}%` : "--"}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 uppercase">accuracy</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HEATMAP */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-foreground">Activity History</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="bg-card dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl p-6 overflow-hidden">
            <Heatmap data={heatmapData} />
          </div>
        </div>

        {/* RECENT HISTORY */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent History</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="bg-card dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl overflow-hidden">
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted dark:bg-white/5 text-muted-foreground uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">WPM</th>
                      <th className="px-6 py-4 font-semibold">Accuracy</th>
                      <th className="px-6 py-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-white/5">
                    {history.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-muted/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(item.testDate || item.completedAt!).toLocaleDateString('en-GB')}
                          <span className="text-xs ml-2 opacity-50">
                            {new Date(item.testDate || item.completedAt!).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {item.wpm}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {item.accuracy}%
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {item.duration}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No history available yet. Complete a test to see your progress!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
