'use client';

import { useEffect, useState } from 'react';
import { Book, BookWithProgress } from '@/types';
import { BookSection } from '@/components/ui/BookSection';
import { getContentProvider } from '@/lib/content';
import { useAuthStore } from '@/store/auth-store';
import { Sparkles } from 'lucide-react';

interface LibraryData {
  bookId: string;
  status: string;
  progress: {
    currentPage: number;
    totalPages: number;
    lastReadAt: string;
  } | null;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [continueReading, setContinueReading] = useState<BookWithProgress[]>([]);
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

      // Load continue reading from user's library
      try {
        const libraryRes = await fetch('/api/library');
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
      } catch (error) {
        console.error('Failed to load library:', error);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-copper font-display text-2xl">
          Loading your library...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-charcoal to-walnut text-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-amber" />
            <span className="text-amber font-medium">Welcome back</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            {user?.name || 'Reader'}
          </h1>
          <p className="text-sand mt-2 text-lg">
            {continueReading.length > 0 
              ? `You have ${continueReading.length} book${continueReading.length > 1 ? 's' : ''} in progress. Keep reading!`
              : 'Discover your next great read today.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Continue Reading */}
        {continueReading.length > 0 && (
          <BookSection
            title="Continue Reading"
            books={continueReading}
            showProgress={true}
            viewAllLink="/library"
          />
        )}

        {/* Featured Books */}
        <BookSection
          title="Featured Books"
          books={featuredBooks}
          viewAllLink="/search?filter=featured"
        />

        {/* Latest Additions */}
        <BookSection
          title="Latest Additions"
          books={latestBooks}
          viewAllLink="/search?sort=publishedDate&order=desc"
        />

        {/* Popular This Week */}
        <BookSection
          title="Popular This Week"
          books={popularBooks}
          viewAllLink="/search?filter=popular"
        />
      </div>
    </div>
  );
}
