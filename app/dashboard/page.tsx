 "use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const DashboardPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-gray-700 text-lg">Loading...</div>
      </div>
    );
  }

  if (!session.data) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome, {session.data.user?.name ?? session.data.user?.email}
        </h1>
        <p className="text-gray-600 mb-6">
          You have successfully signed in. This is your main page after signup
          or login.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;


