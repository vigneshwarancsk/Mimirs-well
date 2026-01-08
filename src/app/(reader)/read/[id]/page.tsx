'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '@/types';
import { getContentProvider } from '@/lib/content';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Settings,
  BookOpen,
  Sun,
  Moon,
  Minus,
  Plus,
} from 'lucide-react';

// Simulated book content for demo (in production, this would be the actual PDF content)
const generateBookContent = (book: Book) => {
  const pages: string[] = [];
  const sampleParagraphs = [
    book.description,
    "The morning light filtered through the curtains, casting long shadows across the room. There was something magical about this hour, when the world seemed to hold its breath between night and day.",
    "She had always believed that every book was a door to another world. Now, standing at the threshold of her own story, she understood why. The words on the page were not just ink and paper—they were alive.",
    "Time passed differently here, in the space between chapters. Minutes could stretch into hours, or compress into seconds. The reader controlled the pace, the protagonist controlled the narrative, but the story itself had a will of its own.",
    "He looked up from the manuscript, his eyes adjusting to the dim light of the study. The candle had burned down to a stub, and outside the window, dawn was breaking over the distant hills.",
    "'You understand now,' the old librarian said, 'why we guard these stories so carefully. They are not merely entertainment. They are the collected wisdom of humanity, preserved in amber.'",
    "The journey had taken longer than expected, but every detour had revealed something new. A hidden village here, an ancient ruin there. The map was not the territory, and the territory was full of surprises.",
    "In the garden, the roses bloomed in defiance of the season. Their petals were the color of old wine, and their fragrance carried memories of summers long past.",
    "She turned the page, and the world shifted. This was the magic of reading—the ability to live a thousand lives, to walk in a thousand shoes, to see through a thousand eyes.",
    "The words blurred before him, and he realized he had been reading the same paragraph over and over. His mind had wandered to other places, other times. The book waited patiently for his return.",
  ];

  for (let i = 0; i < book.pageCount; i++) {
    const content = Array(4)
      .fill(null)
      .map(() => sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)])
      .join('\n\n');
    pages.push(content);
  }

  return pages;
};

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isSaving, setIsSaving] = useState(false);

  // Load book and progress
  useEffect(() => {
    async function loadBook() {
      const provider = getContentProvider();
      const bookData = await provider.getBookById(params.id as string);
      
      if (!bookData) {
        router.push('/home');
        return;
      }

      setBook(bookData);
      setPages(generateBookContent(bookData));

      // Load existing progress
      try {
        const progressRes = await fetch(`/api/progress?bookId=${params.id}`);
        if (progressRes.ok) {
          const { data } = await progressRes.json();
          if (data?.currentPage) {
            setCurrentPage(data.currentPage);
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }

      setIsLoading(false);
    }

    loadBook();
  }, [params.id, router]);

  // Save progress
  const saveProgress = useCallback(async (page: number) => {
    if (!book || isSaving) return;
    
    setIsSaving(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: params.id,
          currentPage: page,
          totalPages: book.pageCount,
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
    setIsSaving(false);
  }, [book, params.id, isSaving]);

  // Auto-save progress when page changes
  useEffect(() => {
    if (book && currentPage > 0) {
      const timer = setTimeout(() => {
        saveProgress(currentPage);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, book, saveProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'Escape') {
        router.push(`/book/${params.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, book?.pageCount]);

  const goToNextPage = () => {
    if (book && currentPage < book.pageCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (book && page >= 1 && page <= book.pageCount) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-charcoal' : 'bg-parchment'}`}>
        <div className={`animate-pulse font-display text-2xl ${isDarkMode ? 'text-amber' : 'text-copper'}`}>
          Opening book...
        </div>
      </div>
    );
  }

  if (!book) return null;

  const progressPercent = Math.round((currentPage / book.pageCount) * 100);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-charcoal' : 'bg-parchment'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-ink/90 border-walnut/30' : 'bg-parchment/90 border-sand'
      } backdrop-blur-md`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.push(`/book/${params.id}`)}
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode ? 'text-sand hover:text-white' : 'text-walnut hover:text-ink'
            }`}
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Close</span>
          </button>

          <div className="flex items-center gap-3">
            <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-amber' : 'text-copper'}`} />
            <span className={`font-display font-semibold truncate max-w-[200px] ${
              isDarkMode ? 'text-parchment' : 'text-ink'
            }`}>
              {book.title}
            </span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings 
                ? (isDarkMode ? 'bg-amber text-ink' : 'bg-copper text-white')
                : (isDarkMode ? 'text-sand hover:bg-walnut/30' : 'text-walnut hover:bg-sand')
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`border-t transition-colors duration-300 ${
            isDarkMode ? 'bg-ink border-walnut/30' : 'bg-cream border-sand'
          }`}>
            <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6">
              {/* Theme Toggle */}
              <div className="flex items-center gap-3">
                <span className={`text-sm ${isDarkMode ? 'text-sand' : 'text-walnut'}`}>Theme</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'bg-walnut/50 text-amber' 
                      : 'bg-sand text-copper'
                  }`}
                >
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {isDarkMode ? 'Dark' : 'Light'}
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-3">
                <span className={`text-sm ${isDarkMode ? 'text-sand' : 'text-walnut'}`}>Font Size</span>
                <div className={`flex items-center gap-1 rounded-full ${
                  isDarkMode ? 'bg-walnut/50' : 'bg-sand'
                }`}>
                  <button
                    onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                    className={`p-1.5 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-walnut' : 'hover:bg-sand'
                    }`}
                  >
                    <Minus className={`w-4 h-4 ${isDarkMode ? 'text-sand' : 'text-walnut'}`} />
                  </button>
                  <span className={`px-2 min-w-[3rem] text-center ${isDarkMode ? 'text-parchment' : 'text-ink'}`}>
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                    className={`p-1.5 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-walnut' : 'hover:bg-sand'
                    }`}
                  >
                    <Plus className={`w-4 h-4 ${isDarkMode ? 'text-sand' : 'text-walnut'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-3xl w-full">
          {/* Page Content */}
          <article 
            className={`font-reading leading-loose transition-colors duration-300 ${
              isDarkMode ? 'text-parchment/90' : 'text-ink'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {pages[currentPage - 1]?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 first-letter:text-2xl first-letter:font-display first-letter:mr-1">
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </main>

      {/* Navigation */}
      <footer className={`sticky bottom-0 border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-ink/90 border-walnut/30' : 'bg-parchment/90 border-sand'
      } backdrop-blur-md`}>
        {/* Progress Bar */}
        <div className={`h-1 ${isDarkMode ? 'bg-walnut/30' : 'bg-sand'}`}>
          <div 
            className="h-full bg-gradient-to-r from-copper to-amber transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Previous Page */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                  ? 'text-sand hover:bg-walnut/30'
                  : 'text-walnut hover:bg-sand'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Info */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={book.pageCount}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className={`w-16 text-center px-2 py-1 rounded border transition-colors ${
                isDarkMode 
                  ? 'bg-walnut/30 border-walnut/50 text-parchment' 
                  : 'bg-white border-sand text-ink'
              } focus:outline-none focus:ring-2 focus:ring-copper/30`}
            />
            <span className={isDarkMode ? 'text-sand' : 'text-walnut'}>
              of {book.pageCount}
            </span>
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-amber' : 'text-copper'}`}>
              ({progressPercent}%)
            </span>
            {isSaving && (
              <span className={`text-xs ml-2 ${isDarkMode ? 'text-sage' : 'text-sage'}`}>
                Saving...
              </span>
            )}
          </div>

          {/* Next Page */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === book.pageCount}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentPage === book.pageCount
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                  ? 'text-sand hover:bg-walnut/30'
                  : 'text-walnut hover:bg-sand'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
