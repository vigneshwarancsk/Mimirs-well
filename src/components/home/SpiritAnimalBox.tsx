"use client";

import { BookOpen, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface SpiritAnimalBoxProps {
  favoriteGenres?: string[];
  totalBooksRead?: number;
}

// Norse mythology themed spirit guides based on genres
const genreToSpiritGuide: Record<
  string,
  { emoji: string; name: string; description: string; rune: string }
> = {
  Fantasy: {
    emoji: "🐉",
    name: "Dragon of Yggdrasil",
    description: "Mystical guardian of the World Tree, you seek adventure in realms beyond Midgard.",
    rune: "ᚠ", // Fehu - wealth, treasures
  },
  "Science Fiction": {
    emoji: "🚀",
    name: "Cosmic Wanderer",
    description: "Like the gods traveling between realms, you explore infinite possibilities among the stars.",
    rune: "ᚱ", // Raidho - journey
  },
  Mystery: {
    emoji: "🕵️",
    name: "Rune Reader",
    description: "Sharp as Odin's ravens, you uncover secrets and solve the mysteries hidden in ancient texts.",
    rune: "ᚨ", // Ansuz - wisdom
  },
  Romance: {
    emoji: "💕",
    name: "Freyja's Devotee",
    description: "You believe in love stories as powerful as the bonds between gods and mortals.",
    rune: "ᛒ", // Berkano - growth, love
  },
  Thriller: {
    emoji: "⚡",
    name: "Thunder Warrior",
    description: "Fierce as Thor's hammer, you thrive on intensity and the thrill of the chase.",
    rune: "ᚦ", // Thurisaz - strength, protection
  },
  History: {
    emoji: "📜",
    name: "Saga Keeper",
    description: "You preserve the wisdom of ages, learning from the sagas of those who came before.",
    rune: "ᛏ", // Tiwaz - honor, justice
  },
  Philosophy: {
    emoji: "🦉",
    name: "Odin's Scholar",
    description: "Deep thinker who seeks knowledge like the All-Father, contemplating life's greatest mysteries.",
    rune: "ᚨ", // Ansuz - Odin's rune
  },
  "Self-Help": {
    emoji: "🌟",
    name: "Guiding Light",
    description: "You inspire growth and help others find their path, like the Norns weaving fate.",
    rune: "ᛗ", // Mannaz - humanity, self
  },
  Biography: {
    emoji: "👤",
    name: "Saga Collector",
    description: "You learn from the lives of heroes and legends, collecting wisdom from their stories.",
    rune: "ᛟ", // Othala - heritage, legacy
  },
  Adventure: {
    emoji: "🏔️",
    name: "Mountain Explorer",
    description: "Bold as the Vikings, you seek new horizons and embrace challenges with courage.",
    rune: "ᚱ", // Raidho - journey, adventure
  },
  Fiction: {
    emoji: "📖",
    name: "Storyteller",
    description: "You weave tales like the skalds of old, appreciating the art of narrative and imagination.",
    rune: "ᚷ", // Gebo - gift, exchange
  },
  Classics: {
    emoji: "🏛️",
    name: "Ancient Scholar",
    description: "You value timeless wisdom and literary treasures, like the runes carved in stone.",
    rune: "ᛏ", // Tiwaz - honor, tradition
  },
};

const defaultSpiritGuide = {
  emoji: "🐻",
  name: "Curious Wanderer",
  description: "You're exploring your reading journey, discovering the sagas that call to your soul.",
  rune: "ᚠ", // Fehu - new beginnings
};

export function SpiritAnimalBox({
  favoriteGenres = [],
  totalBooksRead = 0,
}: SpiritAnimalBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Determine spirit guide based on favorite genres
  const getSpiritGuide = () => {
    if (favoriteGenres.length === 0) {
      return defaultSpiritGuide;
    }

    // Count genre occurrences
    const genreCounts: Record<string, number> = {};
    favoriteGenres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    // Find the most common genre
    const topGenre =
      Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    return genreToSpiritGuide[topGenre] || defaultSpiritGuide;
  };

  const spiritGuide = getSpiritGuide();

  // Sample genres for demonstration
  const sampleGenres =
    favoriteGenres.length > 0
      ? favoriteGenres
      : ["Fantasy", "Adventure", "Fiction"];

  // Pulse animation for emoji
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="group relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-amber-200/50 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parchment Texture Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Golden Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 -translate-y-1/2 translate-x-1/2">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300/20 to-copper/20 blur-3xl group-hover:from-amber-300/30 group-hover:to-copper/30 transition-opacity duration-500" />
      </div>
      <div className="absolute bottom-0 left-0 w-56 h-56 translate-y-1/2 -translate-x-1/2">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-200/20 to-amber-200/20 blur-3xl group-hover:from-orange-200/30 group-hover:to-amber-200/30 transition-opacity duration-500" />
      </div>

      {/* Rune Corner Decorations */}
      <div className="absolute top-4 left-4 text-amber-700/30 text-3xl font-bold">
        {spiritGuide.rune}
      </div>
      <div className="absolute top-4 right-4 text-amber-700/30 text-3xl font-bold">
        {spiritGuide.rune}
      </div>
      <div className="absolute bottom-4 left-4 text-amber-700/30 text-3xl font-bold rotate-180">
        {spiritGuide.rune}
      </div>
      <div className="absolute bottom-4 right-4 text-amber-700/30 text-3xl font-bold rotate-180">
        {spiritGuide.rune}
      </div>

      <div className="relative z-10">
        {/* Spirit Guide Display */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-4">
            {/* Golden Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-copper opacity-30 blur-2xl rounded-full ${
                pulse ? "scale-150" : "scale-100"
              } transition-transform duration-600`}
            />

            {/* Emoji Container with Golden Border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-copper rounded-full blur-lg opacity-50" />
              <div
                className={`relative text-9xl transition-all duration-300 ${
                  isHovered ? "scale-110 rotate-6" : "scale-100"
                } ${pulse ? "animate-bounce" : ""}`}
                style={{ animationDuration: "1s" }}
              >
                {spiritGuide.emoji}
              </div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute -top-2 -right-2">
              <Sparkles
                className={`w-6 h-6 text-amber-500 transition-all duration-300 ${
                  isHovered ? "scale-125 animate-pulse" : ""
                }`}
              />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Star
                className={`w-4 h-4 text-copper transition-all duration-300 ${
                  isHovered ? "scale-125 animate-pulse" : ""
                }`}
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>

          <h3 className="font-display text-xl font-semibold text-walnut/60 mb-1">
            Your Spirit Guide
          </h3>
          <h2 className="font-display text-3xl font-bold text-walnut mb-2 group-hover:text-copper transition-colors">
            {spiritGuide.name}
          </h2>
        </div>

        {/* Description Card */}
        <div className="bg-gradient-to-br from-amber-100/60 to-orange-100/40 backdrop-blur-sm rounded-2xl p-5 mb-5 border-2 border-amber-200/50 shadow-sm group-hover:shadow-md transition-shadow">
          <p className="text-walnut/80 text-center leading-relaxed text-sm">
            {spiritGuide.description}
          </p>
        </div>

        {/* Genre Tags */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-medium text-walnut/60 justify-center">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Based on your reading preferences</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {sampleGenres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-200/60 to-orange-200/60 backdrop-blur-sm rounded-full text-xs font-semibold text-walnut border-2 border-amber-300/50 hover:scale-105 hover:border-amber-400/70 transition-all cursor-default shadow-sm"
              >
                {genre}
              </span>
            ))}
            {sampleGenres.length > 3 && (
              <span className="px-4 py-1.5 bg-amber-100/40 backdrop-blur-sm rounded-full text-xs font-semibold text-walnut/70 border-2 border-amber-200/50">
                +{sampleGenres.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Reading Stats */}
        {totalBooksRead > 0 && (
          <div className="pt-5 border-t-2 border-amber-200/50">
            <div className="text-center">
              <p className="text-xs font-medium text-walnut/60 mb-1">
                Sagas Completed
              </p>
              <p className="text-3xl font-bold text-copper">
                {totalBooksRead}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
