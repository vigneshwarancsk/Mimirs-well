"use client";

import { useEffect, useState } from "react";
import { Book, BookWithProgress } from "@/types";
import { BookSection } from "@/components/ui/BookSection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { getContentProvider } from "@/lib/content";
import { useAuthStore } from "@/store/auth-store";
import {
  Target,
  ChevronRight,
  Flame,
  BookOpen,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

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

type ReaderStatus = "new" | "active" | "dormant";

export default function HomePage() {
  const { user } = useAuthStore();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [continueReading, setContinueReading] = useState<BookWithProgress[]>(
    []
  );
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [readerStatus, setReaderStatus] = useState<ReaderStatus>("new");
  const [isLoading, setIsLoading] = useState(true);

  // Determine reader status based on sample data
  // To test different hero variants, temporarily return one of: 'new', 'active', or 'dormant'
  const determineReaderStatus = (
    stats: UserStatsData | null,
    continueReadingCount: number
  ): ReaderStatus => {
    // FOR TESTING: Uncomment one of these lines to see different hero variants:
    // return 'new';      // Shows "Start your reading journey" hero
    // return 'active';   // Shows stats and activity chart hero
    // return 'dormant';  // Shows "Glad you're back" hero
    return "dormant";

    // Real logic based on stats
    if (
      !stats ||
      (stats.totalBooksCompleted === 0 && stats.totalPagesRead === 0)
    ) {
      return "new"; // New reader - no reading history
    }

    // Check if user has been inactive for more than 7 days
    // Note: In production, this would use lastReadDate from stats API
    const daysSinceLastRead =
      stats.thisWeekPages === 0 && stats.daysActiveThisWeek === 0 ? 10 : 0;

    if (daysSinceLastRead > 7 && stats.currentStreak === 0) {
      return "dormant"; // Dormant reader - inactive for more than a week
    }

    // Active reader - has recent activity
    if (
      stats.currentStreak > 0 ||
      stats.thisWeekPages > 0 ||
      continueReadingCount > 0
    ) {
      return "active";
    }

    return "active"; // Default to active
  };

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
          fetch("/api/library"),
          fetch("/api/stats"),
        ]);

        if (libraryRes.ok) {
          const libraryData = await libraryRes.json();
          const readingItems =
            libraryData.data?.filter(
              (item: LibraryData) => item.status === "reading" && item.progress
            ) || [];

          // Get book details for reading items
          const allBooks = await provider.getAllBooks();
          const readingBooks: BookWithProgress[] = readingItems
            .map((item: LibraryData) => {
              const book = allBooks.find((b: Book) => b.id === item.bookId);
              if (book && item.progress) {
                return {
                  ...book,
                  progress: {
                    userId: "",
                    bookId: item.bookId,
                    currentPage: item.progress.currentPage,
                    totalPages: item.progress.totalPages,
                    lastReadAt: new Date(item.progress.lastReadAt),
                    completed: false,
                  },
                };
              }
              return null;
            })
            .filter(Boolean) as BookWithProgress[];

          setContinueReading(readingBooks);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  // Update reader status when stats or continueReading changes
  useEffect(() => {
    const status = determineReaderStatus(stats, continueReading.length);
    setReaderStatus(status);
  }, [stats, continueReading.length]);

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🏆";
    if (streak >= 14) return "🔥";
    if (streak >= 7) return "⚡";
    if (streak >= 3) return "✨";
    return "📖";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <BookOpen className="w-12 h-12 text-copper mx-auto mb-4" />
          </div>
          <p className="font-display text-2xl text-walnut">
            Loading your library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Banner - Dynamic based on reader status */}
      <HeroBanner
        userName={user?.name}
        readerStatus={readerStatus}
        stats={stats || undefined}
        continueReadingCount={continueReading.length}
      />

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
                    ? `You're averaging ${Math.round(
                        stats.thisWeekPages /
                          Math.max(stats.daysActiveThisWeek, 1)
                      )} pages per day this week!`
                    : "Set a daily reading goal to track your progress"}
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
                  {stats.currentStreak}{" "}
                  <span className="text-lg">
                    {getStreakEmoji(stats.currentStreak)}
                  </span>
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-walnut/70">Completed</span>
                </div>
                <p className="text-2xl font-bold text-ink">
                  {stats.totalBooksCompleted}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-walnut/70">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-ink">
                  {stats.booksInProgress}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-walnut/70">This Week</span>
                </div>
                <p className="text-2xl font-bold text-ink">
                  {stats.thisWeekPages}p
                </p>
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
