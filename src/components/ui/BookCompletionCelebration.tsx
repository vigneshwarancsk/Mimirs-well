"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types";
import {
  Trophy,
  PartyPopper,
  Star,
  BookOpen,
  Share2,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface BookCompletionCelebrationProps {
  book: Book;
  userName: string;
  userEmail: string;
  onClose: () => void;
  isOpen: boolean;
}

export function BookCompletionCelebration({
  book,
  userName,
  userEmail,
  onClose,
  isOpen,
}: BookCompletionCelebrationProps) {
  const [isTriggering, setIsTriggering] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Trigger confetti animation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#D4A574", "#B8860B", "#CD853F", "#DEB887", "#FFD700"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Trigger the automation email
      triggerCompletionEmail();
    }
  }, [isOpen]);

  const triggerCompletionEmail = async () => {
    if (isTriggering || emailSent) return;

    setIsTriggering(true);
    try {
      const response = await fetch("/api/book-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookGenre: book.genres?.[0] || "General",
          userName,
          userEmail,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        console.log("Book completion email triggered successfully");
      }
    } catch (error) {
      console.error("Failed to trigger completion email:", error);
    }
    setIsTriggering(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-bounce-in">
        <div className="bg-gradient-to-br from-amber-900 via-walnut to-charcoal rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-sand/60 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header with celebration */}
          <div className="relative pt-12 pb-8 px-8 text-center">
            {/* Decorative elements */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <PartyPopper className="w-8 h-8 text-amber animate-wiggle" />
              <Trophy className="w-12 h-12 text-amber animate-bounce" />
              <PartyPopper className="w-8 h-8 text-amber animate-wiggle scale-x-[-1]" />
            </div>

            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/20 border border-amber/30 mb-4">
                <Sparkles className="w-4 h-4 text-amber" />
                <span className="text-amber font-medium text-sm">
                  Achievement Unlocked!
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-parchment mb-3">
                Congratulations!
              </h1>

              <p className="text-sand/90 text-lg">
                You&apos;ve completed a saga!
              </p>
            </div>
          </div>

          {/* Book info */}
          <div className="px-8 pb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-amber/20">
              <div className="flex items-start gap-4">
                {/* Book cover placeholder */}
                <div className="w-20 h-28 bg-gradient-to-br from-amber-600 to-copper rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border border-amber/30">
                  <BookOpen className="w-10 h-10 text-white/80" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-semibold text-parchment truncate">
                    {book.title}
                  </h2>
                  <p className="text-sand/70 text-sm mt-1">{book.author}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-amber" />
                      <span className="text-sand/80 text-sm">
                        {book.pageCount} pages
                      </span>
                    </div>
                    {book.genres?.[0] && (
                      <div className="px-2 py-0.5 rounded-full bg-amber/20 text-amber text-xs">
                        {book.genres[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber">100%</div>
                  <div className="text-sand/60 text-xs">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber">
                    {book.pageCount}
                  </div>
                  <div className="text-sand/60 text-xs">Pages Read</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (book.rating || 4)
                            ? "text-amber fill-amber"
                            : "text-sand/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sand/60 text-xs mt-1">Rating</div>
                </div>
              </div>
            </div>

            {/* Email notification */}
            {emailSent && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
                <p className="text-emerald-300 text-sm">
                  ✨ A celebration email has been sent to your inbox!
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/search"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-copper text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-copper/90 transition-all shadow-lg border border-amber/30"
              >
                Explore More Books
                <ChevronRight className="w-5 h-5" />
              </Link>

              <button
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: `I just finished reading ${book.title}!`,
                      text: `I completed "${book.title}" by ${book.author}. Check it out!`,
                      url: window.location.origin + `/book/${book.id}`,
                    });
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 text-parchment hover:bg-white/20 transition-all border border-amber/20"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
