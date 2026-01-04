import React, { useEffect } from "react";
import { motion } from "motion/react"
import { RiResetLeftFill } from "react-icons/ri";
import WPMGraph from "@/components/WPMGraph";
import confetti from "canvas-confetti";

interface ResultsProps {
    wpmHistory: { second: number; wpm: number }[];
    wpm: number;
    accuracy: number;
    resetTest: () => void;
}

export function Results({ wpmHistory, wpm, accuracy, resetTest }: ResultsProps) {

    useEffect(() => {
        const end = Date.now() + 1000;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.8 }, // Bottom leftish
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.8 }, // Bottom rightish
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    }, []);

    return (
        <div className="relative w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto px-4 py-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                    {/* Left Side: Stats */}
                    <div className="space-y-6">
                        <div className="bg-[#1d2633] border border-white/10 rounded-xl p-6 shadow-sm">
                            <h2 className="text-gray-400 text-lg font-medium mb-1">wpm</h2>
                            <p className="text-6xl font-bold text-orange-400">{wpm}</p>
                        </div>

                        <div className="bg-[#1d2633] border border-white/10 rounded-xl p-6 shadow-sm">
                            <h2 className="text-gray-400 text-lg font-medium mb-1">acc</h2>
                            <p className="text-6xl font-bold text-orange-400">{accuracy}%</p>
                        </div>

                        <button
                            onClick={resetTest}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                     bg-white/10 hover:bg-white/20 text-white rounded-xl  cursor-pointer
                     transition font-medium text-lg border border-white/5"
                        >
                            <RiResetLeftFill className="text-xl " />
                            Play Again
                        </button>
                    </div>

                    {/* Right Side: Graph */}
                    <div className="bg-[#1d2633] border border-white/10 rounded-xl p-6 shadow-sm min-h-[400px]">
                        <h3 className="text-gray-400 mb-6 font-medium">WPM Over Time</h3>
                        <div className="h-[300px] w-full">
                            <WPMGraph data={wpmHistory} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
