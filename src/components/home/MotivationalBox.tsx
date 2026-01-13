"use client";

import { read } from "fs";
import {
  BookOpen,
  Target,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ScrollText,
  Award,
} from "lucide-react";

interface MotivationalBoxProps {
  currentStreak?: number;
  totalBooksCompleted?: number;
  thisWeekPages?: number;
  daysActiveThisWeek?: number;
}

export function MotivationalBox({
  currentStreak = 0,
  totalBooksCompleted = 0,
  thisWeekPages = 0,
  daysActiveThisWeek = 0,
}: MotivationalBoxProps) {
  // Determine reader status
  //   const readerStatus: "new" | "active" | "dormant" =
  //     currentStreak === 0 && totalBooksCompleted === 0
  //       ? "new"
  //       : currentStreak > 0 || thisWeekPages > 0
  //       ? "active"
  //       : "dormant";
  const readerStatus = "dormant";

  // Norse mythology themed messages - 3 variants
  const motivationalVariants = {
    new: {
      icon: ScrollText,
      title: "Begin Your Saga",
      message:
        "Every great tale begins with a single word. Your journey through the halls of knowledge starts now, young scholar.",
      rune: "ᚠ", // Fehu - wealth, new beginnings
      emoji: "📜",
    },
    active: {
      icon: Award,
      title: "Valiant Reader ⚔️",
      message: `Your ${
        currentStreak > 0 ? `${currentStreak}-day` : "mighty"
      } reading streak honors the halls of Valhalla! Continue your quest for knowledge, brave scholar.`,
      rune: "ᚨ", // Ansuz - wisdom, Odin's rune
      emoji: "⚔️",
    },
    dormant: {
      icon: RotateCcw,
      title: "Return to the Hall",
      message:
        "Every warrior returns to battle. Pick up your tome and rejoin the quest for knowledge, brave reader.",
      rune: "ᛟ", // Othala - heritage, return
      emoji: "🛡️",
    },
  };

  const variant = motivationalVariants[readerStatus];
  const Icon = variant.icon;

  return (
    <div className="group relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-amber-200/50 overflow-hidden">
      {/* Parchment Texture Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Golden Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300/20 to-copper/20 blur-3xl group-hover:from-amber-300/30 group-hover:to-copper/30 transition-opacity duration-500" />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 translate-y-1/2 -translate-x-1/2">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-200/20 to-amber-200/20 blur-3xl group-hover:from-orange-200/30 group-hover:to-amber-200/30 transition-opacity duration-500" />
      </div>

      {/* Rune Border Decorations */}
      <div className="absolute top-4 left-4 text-amber-700/30 text-3xl font-bold">
        {variant.rune}
      </div>
      <div className="absolute top-4 right-4 text-amber-700/30 text-3xl font-bold">
        {variant.rune}
      </div>
      <div className="absolute bottom-4 left-4 text-amber-700/30 text-3xl font-bold rotate-180">
        {variant.rune}
      </div>
      <div className="absolute bottom-4 right-4 text-amber-700/30 text-3xl font-bold rotate-180">
        {variant.rune}
      </div>

      <div className="relative z-10">
        {/* Icon and Emoji Display */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-4">
            {/* Golden Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-copper opacity-30 blur-2xl rounded-full scale-150" />

            {/* Emoji Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-copper rounded-full blur-lg opacity-50" />
              <div className="relative text-9xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                {variant.emoji}
              </div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-amber-500 transition-all duration-300 group-hover:scale-125 group-hover:animate-pulse" />
            </div>
          </div>

          <h3 className="font-display text-xl font-semibold text-walnut/60 mb-1">
            Your Motivation
          </h3>
          <h2 className="font-display text-3xl font-bold text-walnut mb-2 group-hover:text-copper transition-colors">
            {variant.title}
          </h2>
        </div>

        {/* Message Card */}
        <div className="bg-gradient-to-br from-amber-100/60 to-orange-100/40 backdrop-blur-sm rounded-2xl p-5 mb-5 border-2 border-amber-200/50 shadow-sm group-hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-copper rounded-xl blur-md opacity-50" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-copper to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-300/50">
                <Icon className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-walnut/80 leading-relaxed text-sm flex-1 pt-2">
              {variant.message}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {readerStatus === "active" && (
          <div className="pt-5 border-t-2 border-amber-200/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-walnut/70">
                Weekly Progress
              </span>
              <span className="text-sm font-bold text-copper">
                {thisWeekPages} pages
              </span>
            </div>
            <div className="relative h-3 bg-amber-100/50 rounded-full overflow-hidden border border-amber-200/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-copper to-amber-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-inner"
                style={{
                  width: `${Math.min((daysActiveThisWeek / 7) * 100, 100)}%`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-walnut/50 font-medium">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
