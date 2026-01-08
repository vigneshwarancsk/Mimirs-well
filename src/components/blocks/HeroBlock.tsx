import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroEntry } from "@/lib/contentstack/types";

interface HeroBlockProps {
  data: HeroEntry;
}

export function HeroBlock({ data }: HeroBlockProps) {
  // Get images from Contentstack
  const images = data.images?.image?.map((img) => img.url) || [];

  // Map CTA buttons to links
  const ctaButtons =
    data.cta?.map((cta) => ({
      text: cta.text,
      href: cta.text.toLowerCase().includes("account") ? "/login" : "/signup",
    })) || [];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-copper/10 text-copper px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {data.sparkle}
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-tight">
            {data.heading.split(" ").slice(0, 4).join(" ")}{" "}
            <span className="text-gradient">
              {data.heading.split(" ").slice(4).join(" ")}
            </span>
          </h1>

          <p className="text-xl text-walnut max-w-xl leading-relaxed">
            {data.subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {ctaButtons.map((cta, index) => (
              <Link key={index} href={cta.href}>
                <Button
                  size="lg"
                  variant={index === 0 ? "primary" : "secondary"}
                  className="w-full sm:w-auto"
                >
                  {cta.text}
                  {index === 0 && <ChevronRight className="w-5 h-5 ml-2" />}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-4">
            {data.stonks?.map((stonk, index) => (
              <div key={stonk.value} className="flex items-center gap-8">
                <div>
                  <p className="font-display text-3xl font-bold text-copper">
                    {stonk.value}
                  </p>
                  <p className="text-sm text-walnut">{stonk.description}</p>
                </div>
                {index < (data.stonks?.length || 0) - 1 && (
                  <div className="h-12 w-px bg-sand" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Book Covers */}
        <div className="relative h-[500px] hidden lg:block">
          {images.slice(0, 5).map((cover, index) => (
            <div
              key={index}
              className="absolute rounded-lg shadow-2xl overflow-hidden animate-float"
              style={{
                width: index === 2 ? "180px" : "140px",
                height: index === 2 ? "270px" : "210px",
                left: `${[10, 60, 35, 5, 70][index]}%`,
                top: `${[10, 5, 35, 60, 55][index]}%`,
                transform: `rotate(${[-8, 5, 0, -5, 8][index]}deg)`,
                animationDelay: `${index * 0.5}s`,
                zIndex: index === 2 ? 10 : 5 - Math.abs(index - 2),
              }}
            >
              <Image
                src={cover}
                alt={`Book cover ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}

          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-copper/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
