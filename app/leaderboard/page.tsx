"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LeaderboardEntry {
  userId: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  name?: string;
  image?: string;
  email?: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/typing/leaderboard?duration=${duration}`);
        const data = await response.json();
        if (response.ok) {
          console.log("Leaderboard data received:", data);
          setLeaderboard(data.leaderboard || []);
        } else {
          console.error("Failed to fetch leaderboard:", data.error, data.details);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [duration]);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-2xl">🥇</span>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="text-muted-foreground font-mono text-lg">#{index + 1}</span>;
    }
  };

  return (
    <div className="font-mono min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">Top typists ranking</p>
        </div>

        {/* DURATION SELECTOR */}
        <div className="flex justify-center gap-2 mb-8">
          {[15, 30, 60, 120].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${duration === d
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-muted dark:bg-white/5 text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500"
                }`}
            >
              {d}s
            </button>
          ))}
        </div>

        <div className="bg-card dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">
              Loading rankings...
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted dark:bg-black/20 text-muted-foreground uppercase text-xs tracking-wider border-b border-border dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-24 text-center">Rank</th>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold text-right">WPM ({duration}s)</th>
                    <th className="px-6 py-4 font-semibold text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-white/5">
                  {leaderboard.map((entry, index) => {
                    const displayName = entry.name?.trim() ||
                        entry.email?.split("@")[0] ||
                        "Anonymous";
                    return (
                      <tr
                        key={entry.userId}
                        className={`
                          hover:bg-muted/50 dark:hover:bg-white/5 transition-colors
                          ${index < 3 ? "bg-orange-500/5 dark:bg-orange-500/5" : ""}
                        `}
                      >
                        <td className="px-6 py-4 font-medium text-center">
                          {getRankBadge(index)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {entry.image ? (
                              <Image
                                src={entry.image}
                                alt={displayName}
                                width={40}
                                height={40}
                                className="rounded-full border border-border dark:border-white/10 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                                {displayName[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="font-semibold text-foreground">
                              {displayName}
                              {index === 0 && <span className="ml-2 text-xs text-orange-500 font-normal border border-orange-500/30 px-1.5 py-0.5 rounded-full">KING</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xl font-bold font-mono text-foreground">
                            {entry.wpm || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-mono font-medium ${entry.accuracy >= 98 ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {entry.accuracy || 0}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <p>No test is there.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
