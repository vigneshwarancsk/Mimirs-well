"use client";

import { BookOpen, Clock, TrendingUp, Target } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface QuickStatsCardProps {
  currentStreak?: number;
  totalBooksCompleted?: number;
  thisWeekPages?: number;
  daysActiveThisWeek?: number;
  booksInProgress?: number;
}

export function QuickStatsCard({
  currentStreak = 0,
  totalBooksCompleted = 0,
  thisWeekPages = 0,
  daysActiveThisWeek = 0,
  booksInProgress = 0,
}: QuickStatsCardProps) {
  const weeklyGoal = 7;
  const weeklyProgress = Math.min((daysActiveThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-ink">
          Your Reading Journey
        </h3>
        <Link
          href="/library"
          className="flex items-center gap-1 text-copper hover:text-amber transition-colors text-sm font-medium"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Streak */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-walnut/70">Streak</span>
          </div>
          <p className="text-2xl font-bold text-copper">
            {currentStreak}
            <span className="text-sm text-walnut/60 ml-1">days</span>
          </p>
        </div>

        {/* Books Completed */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-copper" />
            <span className="text-xs font-medium text-walnut/70">Completed</span>
          </div>
          <p className="text-2xl font-bold text-copper">{totalBooksCompleted}</p>
        </div>

        {/* In Progress */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-walnut/70">Reading</span>
          </div>
          <p className="text-2xl font-bold text-copper">{booksInProgress}</p>
        </div>

        {/* This Week */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-copper" />
            <span className="text-xs font-medium text-walnut/70">This Week</span>
          </div>
          <p className="text-2xl font-bold text-copper">{thisWeekPages}</p>
          <p className="text-xs text-walnut/60 mt-1">pages</p>
        </div>
      </div>

      {/* Weekly Activity Progress */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-walnut/70">
            Weekly Activity
          </span>
          <span className="text-sm font-bold text-copper">
            {daysActiveThisWeek}/7 days
          </span>
        </div>
        <div className="relative h-2 bg-amber-100/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-copper to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
