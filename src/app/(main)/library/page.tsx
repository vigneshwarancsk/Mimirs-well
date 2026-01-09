"use client";

import { useEffect, useState } from "react";
import { Book, BookWithProgress } from "@/types";
import { BookCard } from "@/components/ui/BookCard";
import { getContentProvider } from "@/lib/content";
import {
  Library,
  BookOpen,
  Bookmark,
  CheckCircle,
  Sparkles,
} from "lucide-react";

type LibraryTab = "all" | "reading" | "saved" | "completed";

interface LibraryData {
  bookId: string;
  status: "saved" | "reading" | "completed";
  liked: boolean;
  progress: {
    currentPage: number;
    totalPages: number;
    lastReadAt: string;
  } | null;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");
  const [libraryBooks, setLibraryBooks] = useState<BookWithProgress[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const provider = getContentProvider();
        const allBooks = await provider.getAllBooks();

        const libraryRes = await fetch("/api/library");
        if (libraryRes.ok) {
          const { data: libraryData } = await libraryRes.json();

          // Map library data to books with progress
          const booksWithProgress: BookWithProgress[] = (libraryData || [])
            .map((item: LibraryData) => {
              const book = allBooks.find((b: Book) => b.id === item.bookId);
              if (!book) return null;

              return {
                ...book,
                libraryStatus: item.status,
                progress: item.progress
                  ? {
                      userId: "",
                      bookId: item.bookId,
                      currentPage: item.progress.currentPage,
                      totalPages: item.progress.totalPages,
                      lastReadAt: new Date(item.progress.lastReadAt),
                      completed: item.status === "completed",
                    }
                  : undefined,
              };
            })
            .filter(Boolean) as BookWithProgress[];

          setLibraryBooks(booksWithProgress);

          // Get suggested books (books not in library)
          const libraryIds = new Set(
            libraryData?.map((item: LibraryData) => item.bookId) || []
          );
          const suggestions = allBooks
            .filter((book: Book) => !libraryIds.has(book.id))
            .slice(0, 6);
          setSuggestedBooks(suggestions);
        }
      } catch (error) {
        console.error("Failed to load library:", error);
      }
      setIsLoading(false);
    }

    loadLibrary();
  }, []);

  const filteredBooks = libraryBooks.filter((book) => {
    if (activeTab === "all") return true;
    return book.libraryStatus === activeTab;
  });

  const tabs = [
    { id: "all" as LibraryTab, label: "All Books", icon: Library },
    { id: "reading" as LibraryTab, label: "Reading", icon: BookOpen },
    { id: "saved" as LibraryTab, label: "Saved", icon: Bookmark },
    { id: "completed" as LibraryTab, label: "Completed", icon: CheckCircle },
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-ink mb-2">
            My Library
          </h1>
          <p className="text-walnut">
            {libraryBooks.length} book{libraryBooks.length !== 1 ? "s" : ""} in
            your collection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-sand pb-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === id
                  ? "bg-copper text-white"
                  : "bg-cream text-walnut hover:bg-sand"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === id ? "bg-white/20" : "bg-sand"
                }`}
              >
                {id === "all"
                  ? libraryBooks.length
                  : libraryBooks.filter((b) => b.libraryStatus === id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <BookCard
                  book={book}
                  showProgress={book.libraryStatus === "reading"}
                  size="md"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Library className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="font-display text-2xl text-ink mb-2">
              {activeTab === "all"
                ? "Your library is empty"
                : `No ${activeTab} books`}
            </h3>
            <p className="text-walnut">
              {activeTab === "all"
                ? "Start exploring and add books to your library."
                : `You don't have any ${activeTab} books yet.`}
            </p>
          </div>
        )}

        {/* Suggested Books */}
        {suggestedBooks.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber" />
              <h2 className="font-display text-2xl font-semibold text-ink">
                Suggested For You
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {suggestedBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <BookCard book={book} size="md" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
