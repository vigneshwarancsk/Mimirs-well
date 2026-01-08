import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getLandingPageData } from "@/lib/contentstack";
import { BlockRenderer, HeroBlock } from "@/components/blocks";
import {
  HeroEntry,
  FeaturesEntry,
  PlayerEntry,
  TestimonialsEntry,
  PreFooterEntry,
  ResolvedBlock,
} from "@/lib/contentstack/types";

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

const fallbackBlocks: ResolvedBlock[] = [
  {
    type: "features",
    data: {
      uid: "fallback-features",
      title: "Features",
      heading: "Everything You Need to Read",
      sub_heading:
        "Designed for readers, by readers. Every feature crafted to enhance your reading experience.",
      boxes: [
        {
          topic: "Vast Library",
          content:
            "Access thousands of books across every genre imaginable. From timeless classics to contemporary bestsellers.",
          _metadata: { uid: "f1" },
        },
        {
          topic: "Personal Collection",
          content:
            "Build your own digital library. Save books, create reading lists, and organize your literary journey.",
          _metadata: { uid: "f2" },
        },
        {
          topic: "Track Progress",
          content:
            "Never lose your place. Our intelligent tracking remembers exactly where you left off in every book.",
          _metadata: { uid: "f3" },
        },
        {
          topic: "Smart Search",
          content:
            "Find your next read effortlessly. Search by title, author, genre, or let our recommendations guide you.",
          _metadata: { uid: "f4" },
        },
      ],
    } as FeaturesEntry,
  },
  {
    type: "player",
    data: {
      uid: "fallback-player",
      title: "Player",
      heading: "A Reading Experience Reimagined",
      content:
        "Immerse yourself in distraction-free reading with our beautifully designed reader. Customizable fonts, themes, and layouts ensure comfort during your longest reading sessions.",
      demo: "In the beginning, there was only darkness and the whisper of words yet unwritten. The library stretched infinitely in all directions, its shelves reaching toward an unseen ceiling, each book a universe waiting to be explored.\n\nShe ran her fingers along the spines, feeling the stories pulse beneath her touch like living things. Every volume held a promise, every page a doorway...",
      points: [
        "Automatic progress syncing across all devices",
        "Adjustable typography for comfortable reading",
        "Night mode for late-night reading sessions",
        "Bookmarks and highlights to capture thoughts",
      ],
    } as PlayerEntry,
  },
  {
    type: "testamonials",
    data: {
      uid: "fallback-testimonials",
      title: "Testimonials",
      heading: "Loved by Readers",
      sub_heading: "Join thousands who have found their reading home.",
      group: [
        {
          quote:
            "Mimir's Well transformed how I read. The seamless experience across devices means I never lose my place.",
          author: "Elena M.",
          desig: "Avid Reader",
          _metadata: { uid: "t1" },
        },
        {
          quote:
            "The curated collections introduced me to authors I never would have discovered on my own.",
          author: "Marcus T.",
          desig: "Literature Enthusiast",
          _metadata: { uid: "t2" },
        },
        {
          quote:
            "Finally, a reading platform that feels like holding a real book. Elegant and intuitive.",
          author: "Sofia R.",
          desig: "Book Club Organizer",
          _metadata: { uid: "t3" },
        },
      ],
    } as TestimonialsEntry,
  },
  {
    type: "pre_footer",
    data: {
      uid: "fallback-prefooter",
      title: "Pre-Footer",
      heading: "Begin Your Journey Today",
      content:
        "Join Mimir's Well and discover a world of stories waiting for you. Your next favorite book is just a click away.",
    } as PreFooterEntry,
  },
];

export default async function LandingPage() {
  // Fetch all landing page data from Contentstack
  const data = await getLandingPageData();

  // Use Contentstack data or fallback
  const hero = data.hero || fallbackHero;
  const blocks = data.blocks.length > 0 ? data.blocks : fallbackBlocks;

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

      {/* Dynamic Blocks - Rendered based on Contentstack landing_page.blocks */}
      {blocks.map((block: ResolvedBlock, index: number) => (
        <BlockRenderer key={`${block.type}-${index}`} block={block} />
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
