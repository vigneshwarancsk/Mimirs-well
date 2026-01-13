'use client';

import { 
  Flame, 
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
  Star
} from 'lucide-react';
import Link from 'next/link';

type ReaderStatus = 'new' | 'active' | 'dormant';

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
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getStreakEmoji = (streak: number) => {
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '🔥';
  if (streak >= 7) return '⚡';
  if (streak >= 3) return '✨';
  return '📖';
};

const getWeekDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
    });
  }
  return days;
};

// New Reader Hero Banner
function NewReaderHero({ userName }: { userName?: string }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-yellow-300 font-medium">{getGreeting()}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              {userName || 'Welcome'}!
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl mb-6 animate-slide-up delay-100">
              Start your reading journey today. Discover thousands of books waiting to inspire, educate, and entertain you.
            </p>

            <p className="text-white/80 text-base mb-8 animate-slide-up delay-200">
              Join thousands of readers who are already exploring new worlds, learning new skills, and expanding their horizons.
            </p>

            {/* CTA Button */}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg animate-slide-up delay-300"
            >
              Explore Books
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display text-2xl font-semibold">
                    Your Library Awaits
                  </h3>
                  <p className="text-white/80 text-sm">
                    Build your personal collection and track your reading progress
                  </p>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">1000+</div>
                    <div className="text-white/70 text-sm">Books Available</div>
                  </div>
                  <div className="w-px bg-white/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-white/70 text-sm">Access</div>
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

// Active Reader Hero Banner (existing stats component)
function ActiveReaderHero({ userName, stats, continueReadingCount }: { 
  userName?: string; 
  stats?: HeroBannerProps['stats'];
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
              {userName || 'Reader'}
            </h1>
            
            <p className="text-sand/90 text-lg md:text-xl mb-8 animate-slide-up delay-100">
              {continueReadingCount && continueReadingCount > 0 
                ? `You have ${continueReadingCount} book${continueReadingCount > 1 ? 's' : ''} waiting for you. Keep the momentum going!`
                : stats?.currentStreak 
                  ? `Your reading streak is ${stats.currentStreak} days strong!`
                  : 'Keep up the great reading!'}
            </p>

            {/* Quick Stats Row */}
            {stats && (
              <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
                {/* Streak Badge */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
                      <span className="text-lg">{getStreakEmoji(stats.currentStreak)}</span>
                    </div>
                    <p className="text-sand/70 text-sm">Day streak</p>
                  </div>
                </div>

                {/* Books Completed */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{stats.totalBooksCompleted}</span>
                    <p className="text-sand/70 text-sm">Completed</p>
                  </div>
                </div>

                {/* Pages This Week */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{stats.thisWeekPages}</span>
                    <p className="text-sand/70 text-sm">Pages this week</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Activity Chart */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
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
                    h => h.date.split('T')[0] === day.date
                  );
                  const pagesRead = dayHistory?.pagesRead || 0;
                  const maxPages = Math.max(
                    ...((stats?.weeklyHistory || []).map(h => h.pagesRead) || [1]),
                    1
                  );
                  const height = pagesRead > 0 ? Math.max((pagesRead / maxPages) * 100, 10) : 0;
                  const isToday = index === 6;
                  
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center">
                        {pagesRead > 0 && (
                          <span className="text-xs text-sand/60">{pagesRead}p</span>
                        )}
                      </div>
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          pagesRead > 0 
                            ? isToday 
                              ? 'bg-gradient-to-t from-amber to-gold' 
                              : 'bg-gradient-to-t from-copper/60 to-amber/60'
                            : 'bg-white/10'
                        }`}
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      />
                      <span className={`text-xs ${isToday ? 'text-amber font-medium' : 'text-sand/60'}`}>
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
                      {stats.totalBooksCompleted} books read
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

// Dormant Reader Hero Banner
function DormantReaderHero({ userName }: { userName?: string }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <RotateCcw className="w-5 h-5 text-yellow-300" />
              <span className="text-yellow-300 font-medium">Welcome back!</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              Glad you&apos;re back, {userName || 'Reader'}!
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl mb-6 animate-slide-up delay-100">
              It&apos;s been a while. Let&apos;s get you back on track and rediscover the joy of reading.
            </p>

            <p className="text-white/80 text-base mb-8 animate-slide-up delay-200">
              Your books are waiting for you. Pick up where you left off or explore something new.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Continue Reading
                <BookOpen className="w-5 h-5" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Explore New Books
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Column - Motivation */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-display text-2xl font-semibold">
                    Get Back on Track
                  </h3>
                  <p className="text-white/80 text-sm">
                    Every page counts. Start small and build your reading habit again.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Your Progress</span>
                    <span className="text-white font-semibold">Ready to resume</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 w-1/3 rounded-full" />
                  </div>
                  <p className="text-white/70 text-xs text-center pt-2">
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

export function HeroBanner({ userName, readerStatus, stats, continueReadingCount }: HeroBannerProps) {
  switch (readerStatus) {
    case 'new':
      return <NewReaderHero userName={userName} />;
    case 'active':
      return <ActiveReaderHero userName={userName} stats={stats} continueReadingCount={continueReadingCount} />;
    case 'dormant':
      return <DormantReaderHero userName={userName} />;
    default:
      return <NewReaderHero userName={userName} />;
  }
}
