import { DemoComponent } from "@/lib/contentstack/types";

interface PlayerBlockProps {
  data: DemoComponent;
}

export function PlayerBlock({ data }: PlayerBlockProps) {
  // Parse demo text into paragraphs
  const demoParagraphs = data.demo_text.split("\n\n").filter((p) => p.trim());

  // Handle heading with gradient on "Reimagined" if present
  const renderHeading = () => {
    if (data.heading.includes("Reimagined")) {
      const parts = data.heading.split("Reimagined");
      return (
        <>
          {parts[0]}
          <span className="text-gradient">Reimagined</span>
          {parts[1]}
        </>
      );
    }
    return data.heading;
  };

  return (
    <section className="py-24 bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Reader mockup */}
              <div className="bg-charcoal rounded-2xl p-8 shadow-2xl">
                <div className="bg-parchment rounded-lg p-8 font-reading text-ink leading-loose">
                  {demoParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`text-lg ${
                        index === 0
                          ? "mb-4 first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-copper"
                          : ""
                      }`}
                    >
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-walnut/30 rounded-full">
                    <div className="h-full w-[35%] bg-copper rounded-full" />
                  </div>
                  <span className="text-sand text-sm">Page 127 of 364</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-copper/20 rounded-full blur-2xl" />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">
              {renderHeading()}
            </h2>
            <p className="text-xl text-walnut leading-relaxed">
              {data.content.trim()}
            </p>
            <ul className="space-y-4">
              {data.list.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-walnut">
                  <div className="w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-copper" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
