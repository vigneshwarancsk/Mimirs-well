'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book, BookWithProgress } from '@/types';
import { useState } from 'react';

interface BookCardProps {
  book: Book | BookWithProgress;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BookCard({ book, showProgress = false, size = 'md' }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: { width: 120, height: 180 },
    md: { width: 160, height: 240 },
    lg: { width: 200, height: 300 },
  };

  const progress = 'progress' in book && book.progress 
    ? Math.round((book.progress.currentPage / book.progress.totalPages) * 100)
    : 0;

  // Fallback cover with gradient based on book title
  const getFallbackGradient = (title: string) => {
    const colors = [
      ['#2d2a26', '#4a4238'],
      ['#3d4a3a', '#7d8471'],
      ['#4a4238', '#b87333'],
      ['#1a1612', '#2d2a26'],
    ];
    const index = title.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]} 0%, ${colors[index][1]} 100%)`;
  };

  return (
    <Link 
      href={`/book/${book.id}`} 
      className="group block w-full"
    >
      <div 
        className="relative rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-2"
        style={{ 
          aspectRatio: '2/3',
          width: '100%',
        }}
      >
        {!imageError ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes={`${sizes[size].width}px`}
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center p-4"
            style={{ background: getFallbackGradient(book.title) }}
          >
            <span className="text-white/90 text-center font-display text-sm font-semibold leading-tight">
              {book.title}
            </span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white/90 text-xs line-clamp-2">{book.author}</p>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-walnut shadow-sm">
          ★ {book.rating.toFixed(1)}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-display text-base font-semibold text-ink line-clamp-1 group-hover:text-copper transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-walnut/70 line-clamp-1">{book.author}</p>
        
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
