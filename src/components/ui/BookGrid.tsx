'use client';

import { Book, BookWithProgress } from '@/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: (Book | BookWithProgress)[];
  showProgress?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function BookGrid({ 
  books, 
  showProgress = false,
  emptyMessage = 'No books available',
  className = ''
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <p className="text-sage text-center py-12">{emptyMessage}</p>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {books.map((book, index) => (
        <div 
          key={book.id}
          className="animate-slide-up opacity-0"
          style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
        >
          <BookCard 
            book={book} 
            showProgress={showProgress}
            size="md"
          />
        </div>
      ))}
    </div>
  );
}
