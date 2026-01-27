"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Book, BookWithProgress } from "@/types";
import { BookSection } from "@/components/ui/BookSection";
import { HeroBanner, CMSHeroContent } from "@/components/home/HeroBanner";
import { QuoteSection } from "@/components/home/QuoteSection";
import { HomeLoader, HeroSkeleton } from "@/components/ui/HomeLoader";
import { getContentProvider } from "@/lib/content";
import { useAuthStore } from "@/store/auth-store";
import { usePersonalize } from "@/lib/personalize/context";
import { getHomeHeroBanner } from "@/lib/contentstack/queries";
import { parseTemplate } from "@/lib/contentstack/template-parser";
import {
  Target,
  ChevronRight,
  Flame,
  BookOpen,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Cache for hero content to prevent re-fetching on navigation
let heroContentCache: {
  content: CMSHeroContent | null;
  userId: string | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  const { isInitialized, variantParam, initialize, triggerImpression, getExperiences } = usePersonalize();
  
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [continueReading, setContinueReading] = useState<BookWithProgress[]>([]);
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [readerStatus, setReaderStatus] = useState<ReaderStatus>("new");
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  
  // CMS personalized content - check cache first
  const [cmsHeroContent, setCmsHeroContent] = useState<CMSHeroContent | null>(() => {
    if (
      heroContentCache &&
      heroContentCache.userId === user?.id &&
      Date.now() - heroContentCache.timestamp < CACHE_DURATION
    ) {
      return heroContentCache.content;
    }
    return null;
  });
  
  const personalizeInitRef = useRef(false);
  const heroFetchedRef = useRef(false);

  // Determine reader status from CMS variant title
  const getReaderStatusFromVariant = useCallback((title: string): ReaderStatus => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("dormant")) return "dormant";
    if (lowerTitle.includes("active") || lowerTitle.includes("stats")) return "active";
    if (lowerTitle.includes("new") || lowerTitle.includes("welcome")) return "new";
    return "new";
  }, []);

  // Fallback: Determine reader status based on stats
  const determineReaderStatus = useCallback((
    stats: UserStatsData | null,
    continueReadingCount: number
  ): ReaderStatus => {
    if (!stats || (stats.totalBooksCompleted === 0 && stats.totalPagesRead === 0)) {
      return "new";
    }

    const daysSinceLastRead =
      stats.thisWeekPages === 0 && stats.daysActiveThisWeek === 0 ? 10 : 0;

    if (daysSinceLastRead > 7 && stats.currentStreak === 0) {
      return "dormant";
    }

    if (stats.currentStreak > 0 || stats.thisWeekPages > 0 || continueReadingCount > 0) {
      return "active";
    }

    return "active";
  }, []);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const provider = getContentProvider();

      const [featured, popular, latest] = await Promise.all([
        provider.getFeaturedBooks(),
        provider.getPopularBooks(),
        provider.getLatestBooks(),
      ]);

      setFeaturedBooks(featured);
      setPopularBooks(popular);
      setLatestBooks(latest);

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

  // Initialize Personalize SDK with userId and liveAttributes
  // liveAttributes are sent to the decision engine during init for real-time variant evaluation
  useEffect(() => {
    if (personalizeInitRef.current || !user?.id || !stats) return;

    // Prepare user attributes for audience targeting
    const attributes: Record<string, string | number | boolean> = {
      books_in_library: stats.booksInProgress + stats.totalBooksCompleted,
      is_reading: stats.booksInProgress > 0,
      books_completed: stats.totalBooksCompleted,
      read_streak: stats.currentStreak,
      days_after_last_read: stats.thisWeekPages === 0 && stats.daysActiveThisWeek === 0 ? 10 : 0,
    };

    console.log("[HomePage] Initializing Personalize");
    initialize(user.id, attributes);
    personalizeInitRef.current = true;
  }, [user?.id, stats, initialize]);

  // Fetch personalized hero banner from CMS after SDK is initialized
  useEffect(() => {
    // Check if we have valid cached content
    if (
      heroContentCache &&
      heroContentCache.userId === user?.id &&
      Date.now() - heroContentCache.timestamp < CACHE_DURATION
    ) {
      console.log("[HomePage] Using cached hero content");
      setCmsHeroContent(heroContentCache.content);
      if (heroContentCache.content) {
        const variantStatus = getReaderStatusFromVariant(heroContentCache.content.title);
        setReaderStatus(variantStatus);
      }
      setIsHeroLoading(false);
      heroFetchedRef.current = true;
      return;
    }

    if (!isInitialized || heroFetchedRef.current || !personalizeInitRef.current) return;

    async function fetchHeroBanner() {
      setIsHeroLoading(true);
      
      // Log experiences for debugging
      const experiences = getExperiences();
      console.log("[HomePage] Experiences after init:", experiences);
      console.log("[HomePage] Fetching hero with variantParam:", variantParam);
      
      try {
        const heroBanner = await getHomeHeroBanner(variantParam);
        
        if (heroBanner) {
          console.log("[HomePage] ✅ Hero banner fetched:", heroBanner.title);
          console.log("[HomePage] Has _variant:", !!heroBanner._variant);
          
          const templateVars = {
            userName: user?.name || "Reader",
            continueReadingCount: continueReading.length,
            currentStreak: stats?.currentStreak || 0,
            booksCompleted: stats?.totalBooksCompleted || 0,
            booksInLibrary: (stats?.booksInProgress || 0) + (stats?.totalBooksCompleted || 0),
            thisWeekPages: stats?.thisWeekPages || 0,
          };

          const parsedContent: CMSHeroContent = {
            title: heroBanner.title,
            greeting: parseTemplate(heroBanner.greeting, templateVars),
            heading: parseTemplate(heroBanner.heading, templateVars),
            subheading: parseTemplate(heroBanner.subheading, templateVars),
            subheading_2: parseTemplate(heroBanner.subheading_2, templateVars),
            primaryIconName: heroBanner.box?.primary_icon_name,
            secondaryIconName: heroBanner.box?.secondary_icon_name,
            boxTitle: parseTemplate(heroBanner.box?.title, templateVars),
            boxSubtitle: parseTemplate(heroBanner.box?.subtitle, templateVars),
            boxStats: heroBanner.box?.stats?.map((s: { value: string; text: string }) => ({
              value: parseTemplate(s.value, templateVars),
              text: s.text,
            })),
          };

          setCmsHeroContent(parsedContent);
          
          // Cache the content
          heroContentCache = {
            content: parsedContent,
            userId: user?.id || null,
            timestamp: Date.now(),
          };
          
          // Update reader status based on variant title from CMS
          const variantStatus = getReaderStatusFromVariant(heroBanner.title);
          setReaderStatus(variantStatus);
          console.log("[HomePage] Reader status from variant:", variantStatus);
          
          // Trigger impression for analytics
          triggerImpression("0");
        }
      } catch (error) {
        console.error("[HomePage] Failed to fetch personalized hero banner:", error);
      } finally {
        setIsHeroLoading(false);
      }
      
      heroFetchedRef.current = true;
    }

    fetchHeroBanner();
  }, [isInitialized, variantParam, stats, user?.id, user?.name, continueReading.length, getReaderStatusFromVariant, triggerImpression, getExperiences]);

  // Fallback: Update reader status from stats if CMS content not available
  useEffect(() => {
    if (!cmsHeroContent) {
      const status = determineReaderStatus(stats, continueReading.length);
      setReaderStatus(status);
      // If we've tried to fetch but got nothing, stop loading
      if (heroFetchedRef.current) {
        setIsHeroLoading(false);
      }
    }
  }, [stats, continueReading.length, cmsHeroContent, determineReaderStatus]);
  
  // Ensure hero loading stops after a timeout to prevent indefinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isHeroLoading) {
        setIsHeroLoading(false);
      }
    }, 5000); // 5 second max loading time
    
    return () => clearTimeout(timeout);
  }, [isHeroLoading]);

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🏆";
    if (streak >= 14) return "🔥";
    if (streak >= 7) return "⚡";
    if (streak >= 3) return "✨";
    return "📖";
  };

  // Show full page loader while initial data is loading
  if (isLoading) {
    return <HomeLoader />;
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Banner - Show skeleton while loading, then personalized content */}
      {isHeroLoading && !cmsHeroContent ? (
        <HeroSkeleton />
      ) : (
        <HeroBanner
          userName={user?.name}
          readerStatus={readerStatus}
          stats={stats || undefined}
          continueReadingCount={continueReading.length}
          cmsContent={cmsHeroContent || undefined}
        />
      )}

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

        {/* Quote Section */}
        <QuoteSection
          readerStatus={readerStatus}
          currentStreak={stats?.currentStreak || 0}
        />

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
