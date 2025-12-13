import Signup from "@/components/Signup";
import Login from "@/components/Login";
import { ModeToggle } from "@/components/mode-toggle";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0b0b0b] dark:text-white transition-colors">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl font-bold">⌨️</span>
          <h1 className="font-mono text-xl">typeflow</h1>
        </div>

        <ModeToggle />
      </nav>

      {/* Divider Line */}
      <div className="w-full h-px bg-black/10 dark:bg-white/10" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start relative">

          {/* Signup */}
          <Signup />

          {/* Vertical Divider - positioned in the gap */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 -translate-x-1/2"></div>

          {/* Login */}
          <Login />
        </div>
      </div>
    </div>
  );
}