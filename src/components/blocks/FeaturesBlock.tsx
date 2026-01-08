import { Library, Bookmark, BarChart3, Search } from "lucide-react";
import { FeaturesEntry } from "@/lib/contentstack/types";
import { LucideIcon } from "lucide-react";

// Icon mapping for features
const featureIcons: Record<string, LucideIcon> = {
  "Vast Library": Library,
  "Personal Collection": Bookmark,
  "Track Progress": BarChart3,
  "Smart Search": Search,
};

interface FeaturesBlockProps {
  data: FeaturesEntry;
}

export function FeaturesBlock({ data }: FeaturesBlockProps) {
  return (
    <section className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            {data.heading}
          </h2>
          <p className="text-xl text-walnut max-w-2xl mx-auto">
            {data.sub_heading}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.boxes.map((feature, index) => {
            const IconComponent = featureIcons[feature.topic] || Library;
            return (
              <div
                key={feature._metadata?.uid || index}
                className="group bg-parchment rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-copper/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-copper/20 transition-colors">
                  <IconComponent className="w-7 h-7 text-copper" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">
                  {feature.topic}
                </h3>
                <p className="text-walnut leading-relaxed">
                  {feature.content.trim()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
