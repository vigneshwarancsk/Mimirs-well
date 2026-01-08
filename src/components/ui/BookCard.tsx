'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book, BookWithProgress } from '@/types';

interface BookCardProps {
  book: Book | BookWithProgress;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BookCard({ book, showProgress = false, size = 'md' }: BookCardProps) {
  const sizes = {
    sm: { width: 120, height: 180 },
    md: { width: 160, height: 240 },
    lg: { width: 200, height: 300 },
  };

  const progress = 'progress' in book && book.progress 
    ? Math.round((book.progress.currentPage / book.progress.totalPages) * 100)
    : 0;

  return (
    <Link href={`/book/${book.id}`} className="book-card group block">
      <div className="relative overflow-hidden rounded-lg shadow-md book-cover transition-shadow duration-300">
        <Image
          src={book.coverImage}
          alt={book.title}
          width={sizes[size].width}
          height={sizes[size].height}
          className="object-cover w-full h-full"
          style={{ aspectRatio: '2/3' }}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/80 text-sm line-clamp-2">{book.author}</p>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-walnut">
          ★ {book.rating.toFixed(1)}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-display text-lg font-semibold text-ink line-clamp-1 group-hover:text-copper transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-walnut/80 line-clamp-1">{book.author}</p>
        
        {showProgress && progress > 0 && (
          <div className="mt-2">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-sage mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </Link>
  );
}
