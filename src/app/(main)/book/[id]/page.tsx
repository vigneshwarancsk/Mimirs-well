'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Book } from '@/types';
import { BookCard } from '@/components/ui/BookCard';
import { Button } from '@/components/ui/Button';
import { getContentProvider } from '@/lib/content';
import { 
  BookOpen, 
  Bookmark, 
  Heart, 
  Calendar, 
  FileText, 
  Star,
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';

interface LibraryStatus {
  inLibrary: boolean;
  liked: boolean;
  status: 'saved' | 'reading' | 'completed' | null;
  progress: {
    currentPage: number;
    totalPages: number;
  } | null;
}

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>({
    inLibrary: false,
    liked: false,
    status: null,
    progress: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadBook() {
      const provider = getContentProvider();
      const bookData = await provider.getBookById(params.id as string);
      
      if (!bookData) {
        router.push('/home');
        return;
      }

      setBook(bookData);
      
      // Load similar books
      const similar = await provider.getSimilarBooks(params.id as string);
      setSimilarBooks(similar);

      // Check library status
      try {
        const libraryRes = await fetch('/api/library');
        if (libraryRes.ok) {
          const { data } = await libraryRes.json();
          const item = data?.find((i: { bookId: string }) => i.bookId === params.id);
          if (item) {
            setLibraryStatus({
              inLibrary: true,
              liked: item.liked,
              status: item.status,
              progress: item.progress,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load library status:', error);
      }

      setIsLoading(false);
    }

    loadBook();
  }, [params.id, router]);

  const handleAddToLibrary = async () => {
    setActionLoading('save');
    try {
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id, status: 'saved' }),
      });
      setLibraryStatus(prev => ({ ...prev, inLibrary: true, status: 'saved' }));
    } catch (error) {
      console.error('Failed to add to library:', error);
    }
    setActionLoading(null);
  };

  const handleToggleLike = async () => {
    setActionLoading('like');
    try {
      await fetch('/api/library/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id, liked: !libraryStatus.liked }),
      });
      setLibraryStatus(prev => ({ ...prev, liked: !prev.liked, inLibrary: true }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
    setActionLoading(null);
  };

  const handleStartReading = () => {
    router.push(`/read/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-copper font-display text-2xl">
          Loading book...
        </div>
      </div>
    );
  }

  if (!book) return null;

  const progressPercent = libraryStatus.progress
    ? Math.round((libraryStatus.progress.currentPage / libraryStatus.progress.totalPages) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-charcoal to-walnut text-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sand hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Book Cover */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-copper/30 rounded-lg blur-2xl transform rotate-3" />
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={280}
                  height={420}
                  className="relative rounded-lg shadow-2xl object-cover"
                  style={{ aspectRatio: '2/3' }}
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.genres.map(genre => (
                    <span 
                      key={genre}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-sand"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-sand">by {book.author}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber fill-amber" />
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                  <span className="text-sand">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sand" />
                  <span>{book.pageCount} pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sand" />
                  <span>{new Date(book.publishedDate).getFullYear()}</span>
                </div>
              </div>

              {/* Progress Bar (if reading) */}
              {libraryStatus.progress && (
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sand">Your Progress</span>
                    <span className="text-amber font-medium">{progressPercent}% complete</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-copper to-amber rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-sand mt-2">
                    Page {libraryStatus.progress.currentPage} of {libraryStatus.progress.totalPages}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={handleStartReading}
                  className="flex-1 sm:flex-none"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  {libraryStatus.status === 'reading' ? 'Continue Reading' : 'Start Reading'}
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={handleAddToLibrary}
                  isLoading={actionLoading === 'save'}
                  disabled={libraryStatus.inLibrary}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {libraryStatus.inLibrary ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      In Library
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5 mr-2" />
                      Save to Library
                    </>
                  )}
                </Button>

                <button
                  onClick={handleToggleLike}
                  disabled={actionLoading === 'like'}
                  className={`p-3 rounded-lg border transition-all ${
                    libraryStatus.liked
                      ? 'bg-red-500/20 border-red-400/30 text-red-400'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${libraryStatus.liked ? 'fill-current' : ''}`} />
                </button>

                <button className="p-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Similar Books */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">
              About This Book
            </h2>
            <p className="text-walnut leading-relaxed text-lg">
              {book.description}
            </p>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-1">
            <div className="bg-cream rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">
                Book Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-walnut">Author</dt>
                  <dd className="text-ink font-medium">{book.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-walnut">Pages</dt>
                  <dd className="text-ink font-medium">{book.pageCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-walnut">Published</dt>
                  <dd className="text-ink font-medium">
                    {new Date(book.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-walnut">Rating</dt>
                  <dd className="text-ink font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber fill-amber" />
                    {book.rating.toFixed(1)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">
              Books Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {similarBooks.map((book, index) => (
                <div 
                  key={book.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <BookCard book={book} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
