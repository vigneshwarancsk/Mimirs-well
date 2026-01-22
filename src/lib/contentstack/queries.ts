import stack from "./client";
import {
  QuoteEntry,
  HeroEntry,
  LandingPageEntry,
  LandingPageData,
  SectionComponent,
  HomeHeroBannerEntry,
} from "./types";

// Content Type UIDs - adjust these to match your Contentstack setup
const CONTENT_TYPES = {
  AUTH_PAGE: "auth_page",
  HERO: "hero",
  LANDING: "landing_page",
  FEATURES: "features",
  PLAYER: "player",
  TESTIMONIALS: "testamonials",
  PRE_FOOTER: "pre_footer",
  HOME_HERO_BANNER: "hero_banner", // Add your content type UID here
};

/**
 * Fetch a random quote for auth pages
 * Returns one quote from the published entries
 */
export async function getAuthQuote(): Promise<QuoteEntry | null> {
  try {
    const result = await stack
      .contentType(CONTENT_TYPES.AUTH_PAGE)
      .entry()
      .find();

    const entries = result.entries as unknown as QuoteEntry[];

    if (!entries || entries.length === 0) {
      return null;
    }

    // Return a random quote
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
  } catch (error) {
    console.error("Failed to fetch quote from Contentstack:", error);
    return null;
  }
}

/**
 * Fetch all quotes
 */
export async function getAllQuotes(): Promise<QuoteEntry[]> {
  try {
    const result = await stack
      .contentType(CONTENT_TYPES.AUTH_PAGE)
      .entry()
      .find();

    return (result.entries as unknown as QuoteEntry[]) || [];
  } catch (error) {
    console.error("Failed to fetch quotes from Contentstack:", error);
    return [];
  }
}

/**
 * Fetch a specific entry by UID from a content type
 */
async function getEntryByUid<T>(
  contentTypeUid: string,
  entryUid: string
): Promise<T | null> {
  try {
    const result = await stack
      .contentType(contentTypeUid)
      .entry(entryUid)
      .fetch();

    return result as unknown as T;
  } catch (error) {
    console.error(
      `Failed to fetch entry ${entryUid} from ${contentTypeUid}:`,
      error
    );
    return null;
  }
}

/**
 * Fetch the landing page entry
 */
export async function getLandingPageEntry(): Promise<LandingPageEntry | null> {
  try {
    const result = await stack
      .contentType(CONTENT_TYPES.LANDING)
      .entry()
      .find();

    const entries = result.entries as unknown as LandingPageEntry[];

    if (!entries || entries.length === 0) {
      return null;
    }

    return entries[0];
  } catch (error) {
    console.error("Failed to fetch landing page from Contentstack:", error);
    return null;
  }
}

/**
 * Parse sections array into typed section components
 */
function parseSections(
  sections: LandingPageEntry["sections"]
): SectionComponent[] {
  const parsed: SectionComponent[] = [];

  for (const section of sections || []) {
    if (section.features) {
      parsed.push({ type: "features", data: section.features });
    } else if (section.demo) {
      parsed.push({ type: "demo", data: section.demo });
    } else if (section.testemonials) {
      parsed.push({ type: "testemonials", data: section.testemonials });
    } else if (section.pre_footer) {
      parsed.push({ type: "pre_footer", data: section.pre_footer });
    }
  }

  return parsed;
}

/**
 * Fetch all landing page data with resolved sections
 */
export async function getLandingPageData(): Promise<LandingPageData> {
  const landingPage = await getLandingPageEntry();

  if (!landingPage) {
    return { hero: null, sections: [] };
  }

  // Resolve hero reference
  let hero: HeroEntry | null = null;
  if (landingPage.hero && landingPage.hero.length > 0) {
    const heroRef = landingPage.hero[0];
    hero = await getEntryByUid<HeroEntry>(
      heroRef._content_type_uid,
      heroRef.uid
    );
  }

  // Parse sections (they're already inline, no need to fetch)
  const sections = parseSections(landingPage.sections);

  return { hero, sections };
}

/**
 * Fetch personalized home hero banner
 * Uses variant parameter from Personalize SDK for personalized content
 */
export async function getHomeHeroBanner(
  variantParam?: string | null
): Promise<HomeHeroBannerEntry | null> {
  try {
    const query = stack.contentType(CONTENT_TYPES.HOME_HERO_BANNER).entry();

    // Add variant parameter for personalized content if available
    const queryWithParams = variantParam
      ? query.addParams({ personalize_variants: variantParam })
      : query;

    const result = await queryWithParams.find();
    const entries = result.entries as unknown as HomeHeroBannerEntry[];

    if (!entries || entries.length === 0) {
      return null;
    }

    // Return the first entry (personalized variant will be applied by Contentstack)
    return entries[0];
  } catch (error) {
    console.error("Failed to fetch home hero banner from Contentstack:", error);
    return null;
  }
}

/**
 * Fetch personalized home hero banner by entry UID
 * Useful when you know the specific entry to fetch
 */
export async function getHomeHeroBannerByUid(
  entryUid: string,
  variantParam?: string | null
): Promise<HomeHeroBannerEntry | null> {
  try {
    const query = stack.contentType(CONTENT_TYPES.HOME_HERO_BANNER).entry(entryUid);

    // Add variant parameter for personalized content if available
    const queryWithParams = variantParam
      ? query.addParams({ personalize_variants: variantParam })
      : query;

    const result = await queryWithParams.fetch();
    return result as unknown as HomeHeroBannerEntry;
  } catch (error) {
    console.error(
      `Failed to fetch home hero banner ${entryUid} from Contentstack:`,
      error
    );
    return null;
  }
}
