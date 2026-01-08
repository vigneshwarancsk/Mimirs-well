'use client';

import { Book, BookWithProgress } from '@/types';
import { BookCard } from './BookCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BookSectionProps {
  title: string;
  books: (Book | BookWithProgress)[];
  viewAllLink?: string;
  showProgress?: boolean;
  emptyMessage?: string;
}

export function BookSection({ 
  title, 
  books, 
  viewAllLink, 
  showProgress = false,
  emptyMessage = 'No books available'
}: BookSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          {title}
        </h2>
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

      {books.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {books.map((book, index) => (
            <div 
              key={book.id} 
              className="flex-shrink-0 animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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
