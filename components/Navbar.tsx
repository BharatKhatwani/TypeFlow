import { ModeToggle } from "@/components/mode-toggle";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      
      {/* Navbar */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-xl font-semibold">Typing_Project</h1>

        <div className="flex items-center gap-6">
          <button className="hover:text-blue-400">Leaderboard</button>
          <button className="hover:text-blue-400">Friend Battle</button>

          <ModeToggle />

        <button className="
  relative px-4 py-2 rounded-lg border  cursor-pointer
  overflow-hidden 
  group
">
  <span className="absolute left-0 top-0 h-full w-0 bg-blue-500/20 transition-all duration-300 group-hover:w-full" />
  <span className="relative z-10">Login & Signup</span>
</button>

        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4" />

    </div>
  );
}
