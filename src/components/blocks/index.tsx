import { ResolvedBlock } from "@/lib/contentstack/types";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { PlayerBlock } from "./PlayerBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { PreFooterBlock } from "./PreFooterBlock";

interface BlockRendererProps {
  block: ResolvedBlock;
}

/**
 * Dynamic block renderer - renders the appropriate component based on block type
 */
export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroBlock data={block.data} />;
    case "features":
      return <FeaturesBlock data={block.data} />;
    case "player":
      return <PlayerBlock data={block.data} />;
    case "testamonials":
      return <TestimonialsBlock data={block.data} />;
    case "pre_footer":
      return <PreFooterBlock data={block.data} />;
    default:
      console.warn("Unknown block type:", block);
      return null;
  }
}

// Re-export all blocks
export { HeroBlock } from "./HeroBlock";
export { FeaturesBlock } from "./FeaturesBlock";
export { PlayerBlock } from "./PlayerBlock";
export { TestimonialsBlock } from "./TestimonialsBlock";
export { PreFooterBlock } from "./PreFooterBlock";
