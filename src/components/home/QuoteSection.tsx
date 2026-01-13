"use client";

import { Quote } from "lucide-react";

interface QuoteSectionProps {
  readerStatus: "new" | "active" | "dormant";
  currentStreak?: number;
}

const quotes = {
  new: [
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
      rune: "ᚠ", // Fehu - new beginnings
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
      rune: "ᚷ", // Gebo - gift
    },
    {
      text: "Today a reader, tomorrow a leader.",
      author: "Margaret Fuller",
      rune: "ᚨ", // Ansuz - wisdom
    },
  ],
  active: [
    {
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison",
      rune: "ᚨ", // Ansuz - wisdom, Odin's rune
    },
    {
      text: "The reading of all good books is like conversation with the finest men of past centuries.",
      author: "René Descartes",
      rune: "ᛏ", // Tiwaz - honor
    },
    {
      text: "Once you learn to read, you will be forever free.",
      author: "Frederick Douglass",
      rune: "ᚱ", // Raidho - journey
    },
    {
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman",
      rune: "ᛗ", // Mannaz - humanity
    },
  ],
  dormant: [
    {
      text: "It is never too late to be what you might have been.",
      author: "George Eliot",
      rune: "ᛟ", // Othala - heritage, return
    },
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      rune: "ᚠ", // Fehu - new beginnings
    },
    {
      text: "You are never too old to set another goal or to dream a new dream.",
      author: "C.S. Lewis",
      rune: "ᚷ", // Gebo - gift
    },
  ],
};

export function QuoteSection({
  readerStatus,
  currentStreak = 0,
}: QuoteSectionProps) {
  const readerQuotes = quotes[readerStatus];
  // Select quote based on streak or random (for now, using streak as seed)
  const selectedQuote =
    readerQuotes[currentStreak % readerQuotes.length] || readerQuotes[0];

  return (
    <div className="relative py-12 md:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Runes */}
      <div className="absolute top-8 left-8 text-amber-700/10 text-6xl font-bold">
        {selectedQuote.rune}
      </div>
      <div className="absolute bottom-8 right-8 text-amber-700/10 text-6xl font-bold rotate-180">
        {selectedQuote.rune}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-copper mb-6 shadow-lg">
          <Quote className="w-8 h-8 text-white" />
        </div>

        <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-walnut mb-6 leading-relaxed">
          &ldquo;{selectedQuote.text}&rdquo;
        </blockquote>

        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
          <p className="text-walnut/70 font-medium text-lg">
            {selectedQuote.author}
          </p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
        </div>
      </div>
    </div>
  );
}
