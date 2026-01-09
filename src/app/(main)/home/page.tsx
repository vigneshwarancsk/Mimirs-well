'use client';

import { useEffect, useState } from 'react';
import { Book, BookWithProgress } from '@/types';
import { BookSection } from '@/components/ui/BookSection';
import { getContentProvider } from '@/lib/content';
import { useAuthStore } from '@/store/auth-store';
import { 
  Flame, 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface LibraryData {
  bookId: string;
  status: string;
  progress: {
    currentPage: number;
    totalPages: number;
    lastReadAt: string;
  } | null;
}

interface UserStatsData {
  currentStreak: number;
  longestStreak: number;
  totalBooksCompleted: number;
  totalPagesRead: number;
  totalReadingTimeMinutes: number;
  booksInProgress: number;
  thisWeekPages: number;
  thisWeekMinutes: number;
  daysActiveThisWeek: number;
  weeklyHistory: { date: string; pagesRead: number; minutesRead: number }[];
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [continueReading, setContinueReading] = useState<BookWithProgress[]>([]);
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const provider = getContentProvider();
      
      // Load all book sections
      const [featured, popular, latest] = await Promise.all([
        provider.getFeaturedBooks(),
        provider.getPopularBooks(),
        provider.getLatestBooks(),
      ]);

      setFeaturedBooks(featured);
      setPopularBooks(popular);
      setLatestBooks(latest);

      // Load user data
      try {
        const [libraryRes, statsRes] = await Promise.all([
          fetch('/api/library'),
          fetch('/api/stats'),
        ]);

        if (libraryRes.ok) {
          const libraryData = await libraryRes.json();
          const readingItems = libraryData.data?.filter(
            (item: LibraryData) => item.status === 'reading' && item.progress
          ) || [];

          // Get book details for reading items
          const allBooks = await provider.getAllBooks();
          const readingBooks: BookWithProgress[] = readingItems.map((item: LibraryData) => {
            const book = allBooks.find((b: Book) => b.id === item.bookId);
            if (book && item.progress) {
              return {
                ...book,
                progress: {
                  userId: '',
                  bookId: item.bookId,
                  currentPage: item.progress.currentPage,
                  totalPages: item.progress.totalPages,
                  lastReadAt: new Date(item.progress.lastReadAt),
                  completed: false,
                },
              };
            }
            return null;
          }).filter(Boolean) as BookWithProgress[];

          setContinueReading(readingBooks);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

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

  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get last 7 days for the activity chart
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <BookOpen className="w-12 h-12 text-copper mx-auto mb-4" />
          </div>
          <p className="font-display text-2xl text-walnut">Loading your library...</p>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Banner */}
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
            {user?.name || 'Reader'}
          </h1>
              
              <p className="text-sand/90 text-lg md:text-xl mb-8 animate-slide-up delay-100">
            {continueReading.length > 0 
                  ? `You have ${continueReading.length} book${continueReading.length > 1 ? 's' : ''} waiting for you. Keep the momentum going!`
                  : stats?.currentStreak 
                    ? `Your reading streak is ${stats.currentStreak} days strong!`
                    : 'Start your reading journey today.'}
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

            {/* Right Column - Activity Chart or Featured Book */}
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
                        {stats.totalPagesRead} total pages
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sand/60" />
                      <span className="text-sand/80 text-sm">
                        {formatReadingTime(stats.totalReadingTimeMinutes)} read
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Goals Banner */}
      {stats && stats.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-cream to-sand border-b border-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-walnut">
                  <Target className="w-5 h-5 text-copper" />
                  <span className="font-medium">Daily Goal</span>
                </div>
                <div className="h-4 w-px bg-walnut/20" />
                <p className="text-walnut/70">
                  {stats.thisWeekPages > 0 
                    ? `You're averaging ${Math.round(stats.thisWeekPages / Math.max(stats.daysActiveThisWeek, 1))} pages per day this week!`
                    : 'Set a daily reading goal to track your progress'}
                </p>
              </div>
              <Link 
                href="/library"
                className="flex items-center gap-1 text-copper hover:text-amber transition-colors font-medium text-sm"
              >
                View Progress
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Stats Cards */}
      {stats && (
        <div className="lg:hidden bg-cream/50 border-b border-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-walnut/70">Streak</span>
                </div>
                <p className="text-2xl font-bold text-ink">
                  {stats.currentStreak} <span className="text-lg">{getStreakEmoji(stats.currentStreak)}</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-walnut/70">Completed</span>
                </div>
                <p className="text-2xl font-bold text-ink">{stats.totalBooksCompleted}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-walnut/70">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-ink">{stats.booksInProgress}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-walnut/70">This Week</span>
                </div>
                <p className="text-2xl font-bold text-ink">{stats.thisWeekPages}p</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Continue Reading */}
        {continueReading.length > 0 && (
          <BookSection
            title="Continue Reading"
            books={continueReading}
            showProgress={true}
            viewAllLink="/library"
            layout="grid"
          />
        )}

        {/* Featured Books */}
        <BookSection
          title="Featured Books"
          books={featuredBooks}
          viewAllLink="/search?filter=featured"
          layout="grid"
        />

        {/* Latest Additions */}
        <BookSection
          title="Latest Additions"
          books={latestBooks}
          viewAllLink="/search?sort=publishedDate&order=desc"
          layout="grid"
        />

        {/* Popular This Week */}
        <BookSection
          title="Popular This Week"
          books={popularBooks}
          viewAllLink="/search?filter=popular"
          layout="grid"
        />
      </div>
    </div>
  );
}
