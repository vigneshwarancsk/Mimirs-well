import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getLandingPageData } from "@/lib/contentstack";
import { BlockRenderer, HeroBlock } from "@/components/blocks";
import { HeroEntry, SectionComponent } from "@/lib/contentstack/types";

// Fallback data when Contentstack is not configured
const fallbackHero: HeroEntry = {
  uid: "fallback",
  title: "Hero",
  sparkle: "Your Literary Journey Begins",
  heading: "Drink Deep from the Well of Knowledge",
  subheading:
    "Discover a sanctuary for readers. Explore thousands of books, track your progress, and build a library that grows with your imagination.",
  cta: [
    {
      text: "Start Reading Free",
      reference: [],
      _metadata: { uid: "cta1" },
    },
    {
      text: "I Have an Account",
      reference: [],
      _metadata: { uid: "cta2" },
    },
  ],
  images: {
    image: [
      {
        uid: "1",
        title: "Book 1",
        filename: "book1.jpg",
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
        content_type: "image/jpeg",
        file_size: "0",
      },
      {
        uid: "2",
        title: "Book 2",
        filename: "book2.jpg",
        url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
        content_type: "image/jpeg",
        file_size: "0",
      },
      {
        uid: "3",
        title: "Book 3",
        filename: "book3.jpg",
        url: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=300&h=450&fit=crop",
        content_type: "image/jpeg",
        file_size: "0",
      },
      {
        uid: "4",
        title: "Book 4",
        filename: "book4.jpg",
        url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=450&fit=crop",
        content_type: "image/jpeg",
        file_size: "0",
      },
      {
        uid: "5",
        title: "Book 5",
        filename: "book5.jpg",
        url: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=300&h=450&fit=crop",
        content_type: "image/jpeg",
        file_size: "0",
      },
    ],
  },
  stonks: [
    { value: "10K+", description: "Books Available", _metadata: { uid: "s1" } },
    { value: "50K+", description: "Active Readers", _metadata: { uid: "s2" } },
    { value: "4.9", description: "User Rating", _metadata: { uid: "s3" } },
  ],
};

// Fallback sections (simplified - will use Contentstack data primarily)
const fallbackSections: SectionComponent[] = [];

export default async function LandingPage() {
  // Fetch all landing page data from Contentstack
  const data = await getLandingPageData();

  // Use Contentstack data or fallback
  const hero = data.hero || fallbackHero;
  const sections = data.sections.length > 0 ? data.sections : fallbackSections;

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-parchment to-sand opacity-80" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23e8e2d9' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            opacity: 0.5,
          }}
        />

        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-copper" />
              <span className="font-display text-2xl font-bold text-ink">
                Mimir&apos;s Well
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <HeroBlock data={hero} />

        {/* Wave divider */}
        <svg
          className="absolute bottom-0 left-0 right-0"
          viewBox="0 0 1440 100"
          fill="none"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 32.3C384 32 480 40 576 48.7C672 57.3 768 66.7 864 65.7C960 64.7 1056 53.3 1152 47.3C1248 41.3 1344 40.7 1392 40.3L1440 40V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="#f5f1eb"
          />
        </svg>
      </header>

      {/* Dynamic Sections - Rendered based on Contentstack landing_page.sections */}
      {sections.map((section: SectionComponent, index: number) => (
        <BlockRenderer key={`${section.type}-${index}`} block={section} />
      ))}

      {/* Footer */}
      <footer className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-copper" />
              <span className="font-display text-lg font-bold text-parchment">
                Mimir&apos;s Well
              </span>
            </div>

            <p className="text-sand text-center">
              Named after the Norse god of wisdom. Drink deep and be
              enlightened.
            </p>

            <p className="text-sage text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
