// Contentstack Entry Types
// Adjust field names to match your content type structure

export interface QuoteEntry {
  uid: string;
  title: string;
  quote: string;
  auther: string;
}

// Contentstack Asset type
export interface ContentstackAsset {
  uid: string;
  title: string;
  filename: string;
  url: string;
  content_type: string;
  file_size: string;
}

// CTA Button type
export interface CTAButton {
  text: string;
  reference: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  _metadata: {
    uid: string;
  };
}

// Stonks/Stats type
export interface Stonk {
  value: string;
  description: string;
  _metadata: {
    uid: string;
  };
}

// Hero Entry type
export interface HeroEntry {
  uid: string;
  title: string;
  sparkle: string;
  heading: string;
  subheading: string;
  cta: CTAButton[];
  images: {
    image: ContentstackAsset[];
  };
  stonks: Stonk[];
}

// Features Entry type
export interface FeatureBox {
  topic: string;
  content: string;
  _metadata: {
    uid: string;
  };
}

export interface FeaturesEntry {
  uid: string;
  title: string;
  heading: string;
  sub_heading: string;
  boxes: FeatureBox[];
}

// Player/Reader Preview Entry type
export interface PlayerEntry {
  uid: string;
  title: string;
  heading: string;
  content: string;
  demo: string;
  points: string[];
}

// Testimonials Entry type
export interface TestimonialItem {
  quote: string;
  author: string;
  desig: string;
  _metadata: {
    uid: string;
  };
}

export interface TestimonialsEntry {
  uid: string;
  title: string;
  heading: string;
  sub_heading: string;
  group: TestimonialItem[];
}

// Pre-Footer/CTA Entry type
export interface PreFooterEntry {
  uid: string;
  title: string;
  heading: string;
  content: string;
}

// Block Reference type (used in modular blocks)
export interface BlockReference {
  uid: string;
  _content_type_uid: string;
}

// Landing Page Entry type
export interface LandingPageEntry {
  uid: string;
  title: string;
  url: string;
  hero: BlockReference[];
  blocks: BlockReference[];
}

// Resolved Block - a block with its fetched data
export type ResolvedBlock =
  | { type: "hero"; data: HeroEntry }
  | { type: "features"; data: FeaturesEntry }
  | { type: "player"; data: PlayerEntry }
  | { type: "testamonials"; data: TestimonialsEntry }
  | { type: "pre_footer"; data: PreFooterEntry };

// Combined Landing Page Data with dynamic blocks
export interface LandingPageData {
  hero: HeroEntry | null;
  blocks: ResolvedBlock[];
}

// Add more content types as you integrate them
export interface BookEntry {
  uid: string;
  title: string;
  author_name: string;
  description: string;
  cover_image: {
    url: string;
    title?: string;
  };
  genres: string[];
  published_date: string;
  page_count: number;
  rating: number;
  pdf_file?: {
    url: string;
  };
  is_featured?: boolean;
  is_popular?: boolean;
}
