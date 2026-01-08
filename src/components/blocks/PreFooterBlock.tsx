import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PreFooterEntry } from "@/lib/contentstack/types";

interface PreFooterBlockProps {
  data: PreFooterEntry;
}

export function PreFooterBlock({ data }: PreFooterBlockProps) {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-copper rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold text-parchment mb-6">
          {data.heading}
        </h2>
        <p className="text-xl text-sand mb-10 max-w-2xl mx-auto">
          {data.content.trim()}
        </p>
        <Link href="/signup">
          <Button size="lg" className="animate-pulse-glow">
            Create Free Account
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
