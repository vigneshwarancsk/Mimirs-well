"use client";

import { Lightbulb, BookOpen, Clock, Target } from "lucide-react";
import { useState, useEffect } from "react";

const readingTips = [
  {
    icon: Clock,
    title: "Set a Daily Goal",
    tip: "Even 10 minutes of reading daily can build a strong habit. Start small and gradually increase.",
    color: "from-amber-500 to-copper",
  },
  {
    icon: BookOpen,
    title: "Find Your Genre",
    tip: "Explore different genres to discover what truly captivates you. Your perfect book is waiting.",
    color: "from-copper to-amber-600",
  },
  {
    icon: Target,
    title: "Track Your Progress",
    tip: "Keep track of what you read. Seeing your progress motivates you to continue your journey.",
    color: "from-amber-600 to-orange-600",
  },
  {
    icon: Lightbulb,
    title: "Join a Community",
    tip: "Share your reading journey with others. Discussion enhances understanding and enjoyment.",
    color: "from-orange-600 to-copper",
  },
];

export function ReadingTip() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % readingTips.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const tip = readingTips[currentTip];
  const Icon = tip.icon;

  return (
    <div className="bg-gradient-to-br from-cream to-sand/50 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-lg font-semibold text-ink mb-1">
            {tip.title}
          </h4>
          <p className="text-walnut/80 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
      <div className="flex gap-1.5 mt-4 justify-center">
        {readingTips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentTip
                ? `w-6 bg-gradient-to-r ${tip.color}`
                : "w-1.5 bg-sand"
            }`}
            aria-label={`Tip ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
