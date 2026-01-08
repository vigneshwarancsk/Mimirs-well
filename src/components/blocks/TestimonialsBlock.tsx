import { Quote } from "lucide-react";
import { TestimonialsEntry } from "@/lib/contentstack/types";

interface TestimonialsBlockProps {
  data: TestimonialsEntry;
}

export function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            {data.heading}
          </h2>
          <p className="text-xl text-walnut">{data.sub_heading}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.group.map((testimonial, index) => (
            <div
              key={testimonial._metadata?.uid || index}
              className="bg-parchment rounded-xl p-8 shadow-sm relative"
            >
              <Quote className="w-10 h-10 text-copper/20 absolute top-6 right-6" />
              <p className="text-walnut leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.quote.trim()}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-ink">{testimonial.author}</p>
                <p className="text-sm text-sage">{testimonial.desig}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
