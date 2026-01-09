'use client';

import { Book, BookWithProgress } from '@/types';
import { BookCard } from './BookCard';
import { BookGrid } from './BookGrid';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

interface BookSectionProps {
  title: string;
  books: (Book | BookWithProgress)[];
  viewAllLink?: string;
  showProgress?: boolean;
  emptyMessage?: string;
  layout?: 'carousel' | 'grid';
}

export function BookSection({ 
  title, 
  books, 
  viewAllLink, 
  showProgress = false,
  emptyMessage = 'No books available',
  layout = 'carousel'
}: BookSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current && layout === 'carousel') {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (layout === 'carousel') {
      checkScroll();
      const el = scrollRef.current;
      if (el) {
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
          el.removeEventListener('scroll', checkScroll);
          window.removeEventListener('resize', checkScroll);
        };
      }
    }
  }, [books, layout]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current && layout === 'carousel') {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {layout === 'carousel' && books.length > 4 && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-2 rounded-full bg-cream hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-walnut" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-2 rounded-full bg-cream hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-walnut" />
              </button>
            </div>
          )}
          {viewAllLink && books.length > 0 && (
            <Link 
              href={viewAllLink}
              className="flex items-center gap-1 text-copper hover:text-amber transition-colors text-sm font-medium"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {layout === 'grid' ? (
        <BookGrid 
          books={books}
          showProgress={showProgress}
          emptyMessage={emptyMessage}
        />
      ) : books.length > 0 ? (
        <div 
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 px-1 -mx-1 scrollbar-hide scroll-smooth"
        >
          {books.map((book, index) => (
            <div 
              key={book.id} 
              className="flex-shrink-0 w-[160px] animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
            >
              <BookCard book={book} showProgress={showProgress} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sage text-center py-12">{emptyMessage}</p>
      )}
    </section>
  );
}
