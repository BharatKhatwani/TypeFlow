"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/home",
      });

      if (result.error) {
        setError(result.error.message || "Failed to login");
      } else {
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="w-[380px] p-8 font-mono">
      <h2 className="text-2xl font-semibold mb-1">Welcome Back</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Log in to continue your progress.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="
              w-full mt-1 px-4 py-2 rounded-lg border outline-none
              bg-white text-black border-black/20 placeholder:text-black/50
              dark:bg-[#1a1a1a] dark:text-white dark:border-white/20 dark:placeholder:text-white/40
              focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
            className="
              w-full mt-1 px-4 py-2 rounded-lg border outline-none
              bg-white text-black border-black/20 placeholder:text-black/50
              dark:bg-[#1a1a1a] dark:text-white dark:border-white/20 dark:placeholder:text-white/40
              focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className="mt-3 w-full py-3 rounded-lg 
                     bg-yellow-500 hover:bg-yellow-600 transition 
                     font-medium text-black dark:text-white
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* OR Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-black/20 dark:bg-white/10" />
        <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
        <div className="flex-1 h-px bg-black/20 dark:bg-white/10" />
      </div>

      {/* Google Login Button */}
      <HoverBorderGradient
        containerClassName="w-full rounded-lg"
        as="button"
        onClick={handleGoogleLogin}
        className="
          w-full flex items-center justify-center gap-3 py-3 
          font-medium rounded-lg 
          bg-white text-black
          dark:bg-[#111] dark:text-white
        "
      >
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </HoverBorderGradient>
    </div>
  );
}
