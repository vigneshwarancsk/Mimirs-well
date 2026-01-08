'use client';

import { useEffect, useState, useCallback } from 'react';
import { Book, SearchFilters } from '@/types';
import { BookCard } from '@/components/ui/BookCard';
import { Input } from '@/components/ui/Input';
import { getContentProvider } from '@/lib/content';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('title');
  const [sortOrder, setSortOrder] = useState<SearchFilters['sortOrder']>('asc');
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load genres on mount
  useEffect(() => {
    async function loadGenres() {
      const provider = getContentProvider();
      const genres = await provider.getAllGenres();
      setAllGenres(genres);
    }
    loadGenres();
  }, []);

  // Search function
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    const provider = getContentProvider();
    
    const filters: SearchFilters = {
      query: searchQuery,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      sortBy,
      sortOrder,
    };

    const books = await provider.searchBooks(filters);
    setResults(books);
    setIsLoading(false);
  }, [searchQuery, selectedGenres, sortBy, sortOrder]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('title');
    setSortOrder('asc');
  };

  const hasActiveFilters = selectedGenres.length > 0 || sortBy !== 'title' || sortOrder !== 'asc';

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-ink mb-2">
            Discover Books
          </h1>
          <p className="text-walnut">
            Search through our collection of {results.length} books
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-copper text-white border-copper'
                : 'bg-white border-sand text-walnut hover:border-copper'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {selectedGenres.length + (sortBy !== 'title' || sortOrder !== 'asc' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-cream rounded-xl p-6 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-copper hover:text-amber flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            {/* Genre Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-walnut mb-3">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {allGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedGenres.includes(genre)
                        ? 'bg-copper text-white'
                        : 'bg-white text-walnut hover:bg-sand'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-walnut mb-2">Sort By</h4>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SearchFilters['sortBy'])}
                    className="w-full appearance-none px-4 py-2.5 bg-white border border-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper"
                  >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="rating">Rating</option>
                    <option value="publishedDate">Published Date</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage pointer-events-none" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-walnut mb-2">Order</h4>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SearchFilters['sortOrder'])}
                    className="w-full appearance-none px-4 py-2.5 bg-white border border-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {selectedGenres.length > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedGenres.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className="flex items-center gap-1 px-3 py-1 bg-copper/10 text-copper rounded-full text-sm hover:bg-copper/20 transition-colors"
              >
                {genre}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-copper font-display text-xl">
              Searching...
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((book, index) => (
              <div 
                key={book.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
              >
                <BookCard book={book} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="font-display text-2xl text-ink mb-2">No books found</h3>
            <p className="text-walnut">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
