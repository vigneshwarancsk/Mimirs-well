"use client";

import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import Link from "next/link";

type ReaderStatus = "new" | "active" | "dormant";

interface HeroBannerProps {
  userName?: string;
  readerStatus: ReaderStatus;
  stats?: {
    currentStreak: number;
    totalBooksCompleted: number;
    thisWeekPages: number;
    daysActiveThisWeek: number;
    weeklyHistory: { date: string; pagesRead: number; minutesRead: number }[];
  };
  continueReadingCount?: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getStreakEmoji = (streak: number) => {
  if (streak >= 30) return "🏆";
  if (streak >= 14) return "⚔️";
  if (streak >= 7) return "📜";
  if (streak >= 3) return "✨";
  return "📖";
};

const getWeekDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toISOString().split("T")[0],
    });
  }
  return days;
};

// New Reader Hero Banner - Norse Theme
function NewReaderHero({ userName }: { userName?: string }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern - Golden Brown Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-walnut to-charcoal" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-copper/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="text-parchment">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-5 h-5 text-amber" />
              <span className="text-amber font-medium">{getGreeting()}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              {userName || "Welcome"}!
            </h1>

            <p className="text-sand/90 text-lg md:text-xl mb-6 animate-slide-up delay-100">
              Begin your saga today. Discover thousands of ancient texts and
              modern tales waiting to inspire, educate, and transport you to new
              realms.
            </p>

            <p className="text-sand/80 text-base mb-8 animate-slide-up delay-200">
              Join fellow scholars who are already exploring new worlds,
              learning ancient wisdom, and expanding their horizons.
            </p>

            {/* CTA Button */}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-copper text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-500 hover:to-copper/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-slide-up delay-300 border-2 border-amber-400/30"
            >
              Explore Books
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-amber-300/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-copper rounded-full flex items-center justify-center shadow-xl border-2 border-amber-400/30">
                      <ScrollText className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-copper rounded-full flex items-center justify-center shadow-lg border-2 border-amber-300/50">
                      <span className="text-2xl">📜</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-parchment font-display text-2xl font-semibold">
                    Your Library Awaits
                  </h3>
                  <p className="text-sand/80 text-sm">
                    Build your collection of sagas and track your reading
                    journey
                  </p>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber">1000+</div>
                    <div className="text-sand/70 text-sm">Sagas Available</div>
                  </div>
                  <div className="w-px bg-amber-300/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber">24/7</div>
                    <div className="text-sand/70 text-sm">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Active Reader Hero Banner - Norse Theme
function ActiveReaderHero({
  userName,
  stats,
  continueReadingCount,
}: {
  userName?: string;
  stats?: HeroBannerProps["stats"];
  continueReadingCount?: number;
}) {
  const weekDays = getWeekDays();

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-walnut to-forest" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-copper/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Welcome Message */}
          <div className="text-parchment">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-5 h-5 text-amber" />
              <span className="text-amber font-medium">{getGreeting()}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              {userName || "Reader"}
            </h1>

            <p className="text-sand/90 text-lg md:text-xl mb-8 animate-slide-up delay-100">
              {continueReadingCount && continueReadingCount > 0
                ? `You have ${continueReadingCount} saga${
                    continueReadingCount > 1 ? "s" : ""
                  } waiting for you. Continue your quest!`
                : stats?.currentStreak
                ? `Your reading streak of ${stats.currentStreak} days honors the halls of Valhalla!`
                : "Keep up the great reading!"}
            </p>

            {/* Quick Stats Row */}
            {stats && (
              <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
                {/* Streak Badge */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-300/20">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-copper rounded-lg">
                    <span className="text-xl">
                      {getStreakEmoji(stats.currentStreak)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-white">
                        {stats.currentStreak}
                      </span>
                    </div>
                    <p className="text-sand/70 text-sm">Day streak</p>
                  </div>
                </div>

                {/* Books Completed */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-300/20">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-copper rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">
                      {stats.totalBooksCompleted}
                    </span>
                    <p className="text-sand/70 text-sm">Completed</p>
                  </div>
                </div>

                {/* Pages This Week */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-300/20">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-copper rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">
                      {stats.thisWeekPages}
                    </span>
                    <p className="text-sand/70 text-sm">Pages this week</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Activity Chart */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-amber-300/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-parchment font-display text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber" />
                  This Week&apos;s Activity
                </h3>
                {stats && (
                  <span className="text-amber text-sm">
                    {stats.daysActiveThisWeek}/7 days active
                  </span>
                )}
              </div>

              {/* Activity Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {weekDays.map((day, index) => {
                  const dayHistory = stats?.weeklyHistory?.find(
                    (h) => h.date.split("T")[0] === day.date
                  );
                  const pagesRead = dayHistory?.pagesRead || 0;
                  const maxPages = Math.max(
                    ...((stats?.weeklyHistory || []).map(
                      (h) => h.pagesRead
                    ) || [1]),
                    1
                  );
                  const height =
                    pagesRead > 0
                      ? Math.max((pagesRead / maxPages) * 100, 10)
                      : 0;
                  const isToday = index === 6;

                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex justify-center">
                        {pagesRead > 0 && (
                          <span className="text-xs text-sand/60">
                            {pagesRead}p
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          pagesRead > 0
                            ? isToday
                              ? "bg-gradient-to-t from-amber to-copper"
                              : "bg-gradient-to-t from-copper/60 to-amber/60"
                            : "bg-white/10"
                        }`}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      />
                      <span
                        className={`text-xs ${
                          isToday ? "text-amber font-medium" : "text-sand/60"
                        }`}
                      >
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total Stats */}
              {stats && (
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sand/60" />
                    <span className="text-sand/80 text-sm">
                      {stats.totalBooksCompleted} sagas read
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sand/60" />
                    <span className="text-sand/80 text-sm">
                      {stats.daysActiveThisWeek} days active
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dormant Reader Hero Banner - Norse Theme
function DormantReaderHero({ userName }: { userName?: string }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern - Golden Brown Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-walnut to-charcoal" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-copper/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="text-parchment">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <RotateCcw className="w-5 h-5 text-amber" />
              <span className="text-amber font-medium">Welcome back!</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              Glad you&apos;re back, {userName || "Reader"}!
            </h1>

            <p className="text-sand/90 text-lg md:text-xl mb-6 animate-slide-up delay-100">
              It&apos;s been a while. Every warrior returns to battle.
              Let&apos;s get you back on track and rediscover the joy of
              reading.
            </p>

            <p className="text-sand/80 text-base mb-8 animate-slide-up delay-200">
              Your sagas are waiting for you. Pick up where you left off or
              explore something new.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-copper text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-500 hover:to-copper/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-2 border-amber-400/30"
              >
                Continue Reading
                <BookOpen className="w-5 h-5" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-parchment px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-amber-300/30"
              >
                Explore New Books
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Column - Motivation */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-amber-300/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-copper rounded-full flex items-center justify-center shadow-xl border-2 border-amber-400/30">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-copper rounded-full flex items-center justify-center shadow-lg border-2 border-amber-300/50 animate-pulse">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-parchment font-display text-2xl font-semibold">
                    Return to the Quest
                  </h3>
                  <p className="text-sand/80 text-sm">
                    Every page counts. Start small and rebuild your reading
                    habit, brave scholar.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 space-y-2 border border-amber-300/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sand/80">Your Progress</span>
                    <span className="text-amber font-semibold">
                      Ready to resume
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-copper w-1/3 rounded-full" />
                  </div>
                  <p className="text-sand/70 text-xs text-center pt-2">
                    You&apos;re just a few pages away from your next milestone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroBanner({
  userName,
  readerStatus,
  stats,
  continueReadingCount,
}: HeroBannerProps) {
  switch (readerStatus) {
    case "new":
      return <NewReaderHero userName={userName} />;
    case "active":
      return (
        <ActiveReaderHero
          userName={userName}
          stats={stats}
          continueReadingCount={continueReadingCount}
        />
      );
    case "dormant":
      return <DormantReaderHero userName={userName} />;
    default:
      return <NewReaderHero userName={userName} />;
  }
}
