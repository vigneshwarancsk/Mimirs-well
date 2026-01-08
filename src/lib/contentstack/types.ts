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

// Features Component (modular block)
export interface FeatureBox {
  text: string;
  description: string;
  _metadata: {
    uid: string;
  };
}

export interface FeaturesComponent {
  heading: string;
  sub_heading: string;
  box: FeatureBox[];
  _metadata: {
    uid: string;
  };
}

// Demo/Player Component (modular block)
export interface DemoComponent {
  heading: string;
  content: string;
  list: string[];
  demo_text: string;
  _metadata: {
    uid: string;
  };
}

// Testimonials Component (modular block)
export interface TestimonialItem {
  review: string;
  user: string;
  designation: string;
  _metadata: {
    uid: string;
  };
}

export interface TestimonialsComponent {
  heading: string;
  description: string;
  tests: TestimonialItem[];
  _metadata: {
    uid: string;
  };
}

// Pre-Footer Component (modular block)
export interface PreFooterComponent {
  heading: string;
  sub_heading: string;
  signup_button_text: string;
  _metadata: {
    uid: string;
  };
}

// Section types - each section can be one of these components
export type SectionComponent =
  | { type: "features"; data: FeaturesComponent }
  | { type: "demo"; data: DemoComponent }
  | { type: "testemonials"; data: TestimonialsComponent }
  | { type: "pre_footer"; data: PreFooterComponent };

// Block Reference type (used for hero reference)
export interface BlockReference {
  uid: string;
  _content_type_uid: string;
}

// Landing Page Entry type with new structure
export interface LandingPageEntry {
  uid: string;
  title: string;
  url: string;
  hero: BlockReference[];
  sections: Array<{
    features?: FeaturesComponent;
    demo?: DemoComponent;
    testemonials?: TestimonialsComponent;
    pre_footer?: PreFooterComponent;
  }>;
}

// Combined Landing Page Data with dynamic sections
export interface LandingPageData {
  hero: HeroEntry | null;
  sections: SectionComponent[];
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
