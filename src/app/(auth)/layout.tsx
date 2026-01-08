import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getAuthQuote } from "@/lib/contentstack";

// Fallback quote if Contentstack is not configured or fetch fails
const fallbackQuote = {
  quote:
    "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
  auther: "George R.R. Martin",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch quote from Contentstack (falls back to static quote if unavailable)
  const quote = await getAuthQuote();
  const displayQuote = quote || fallbackQuote;

  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-walnut/20 to-charcoal" />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L50 100M0 50L100 50M25 0L25 100M75 0L75 100M0 25L100 25M0 75L100 75' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-copper" />
            <span className="font-display text-2xl font-bold text-parchment">
              Mimir&apos;s Well
            </span>
          </Link>

          <div className="space-y-8">
            <blockquote className="text-3xl font-display text-parchment leading-relaxed">
              &ldquo;{displayQuote.quote}&rdquo;
            </blockquote>
            <p className="text-sand text-lg">
              — {displayQuote.auther}
              <span className="text-sand/60">, Author</span>
            </p>
          </div>

          <div className="flex gap-4">
            <div className="h-1 w-16 bg-copper rounded" />
            <div className="h-1 w-8 bg-copper/50 rounded" />
            <div className="h-1 w-4 bg-copper/25 rounded" />
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 right-12 w-64 h-64 border border-copper/20 rounded-full" />
        <div className="absolute top-1/3 right-24 w-48 h-48 border border-copper/10 rounded-full" />
        <div className="absolute bottom-1/4 left-12 w-32 h-32 bg-copper/10 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 justify-center">
              <BookOpen className="w-8 h-8 text-copper" />
              <span className="font-display text-2xl font-bold text-ink">
                Mimir&apos;s Well
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
