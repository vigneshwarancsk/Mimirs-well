"use client";

import { BookOpen } from "lucide-react";

export function HomeLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated book icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-surface-elevated p-6 rounded-2xl shadow-lg">
            <BookOpen className="w-12 h-12 text-amber animate-bounce" strokeWidth={1.5} />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            Preparing your library
          </h2>
          <p className="text-muted text-sm">
            Loading personalized content...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          <span
            className="w-2 h-2 bg-amber rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-amber rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-amber rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[500px] md:min-h-[600px] bg-gradient-to-b from-surface to-background overflow-hidden">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Greeting skeleton */}
          <div className="h-5 w-32 bg-surface-elevated rounded-full mb-4 animate-pulse" />
          
          {/* Heading skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-12 w-3/4 bg-surface-elevated rounded-lg animate-pulse" />
            <div className="h-12 w-1/2 bg-surface-elevated rounded-lg animate-pulse" />
          </div>
          
          {/* Subheading skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 w-full bg-surface-elevated/60 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-surface-elevated/60 rounded animate-pulse" />
          </div>
          
          {/* Stats box skeleton */}
          <div className="bg-surface-elevated/50 backdrop-blur-sm rounded-2xl p-6 max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber/20 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-surface rounded animate-pulse" />
                <div className="h-3 w-24 bg-surface rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-12 bg-surface rounded mx-auto mb-1 animate-pulse" />
                  <div className="h-3 w-16 bg-surface/60 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
