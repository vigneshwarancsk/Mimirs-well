import stack from "./client";
import {
  QuoteEntry,
  HeroEntry,
  FeaturesEntry,
  PlayerEntry,
  TestimonialsEntry,
  PreFooterEntry,
  LandingPageEntry,
  BlockReference,
  ResolvedBlock,
  LandingPageData,
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
 * Resolve a block reference to its full data
 */
async function resolveBlock(
  ref: BlockReference
): Promise<ResolvedBlock | null> {
  const { uid, _content_type_uid } = ref;

  switch (_content_type_uid) {
    case CONTENT_TYPES.HERO: {
      const data = await getEntryByUid<HeroEntry>(_content_type_uid, uid);
      return data ? { type: "hero", data } : null;
    }
    case CONTENT_TYPES.FEATURES: {
      const data = await getEntryByUid<FeaturesEntry>(_content_type_uid, uid);
      return data ? { type: "features", data } : null;
    }
    case CONTENT_TYPES.PLAYER: {
      const data = await getEntryByUid<PlayerEntry>(_content_type_uid, uid);
      return data ? { type: "player", data } : null;
    }
    case CONTENT_TYPES.TESTIMONIALS: {
      const data = await getEntryByUid<TestimonialsEntry>(
        _content_type_uid,
        uid
      );
      return data ? { type: "testamonials", data } : null;
    }
    case CONTENT_TYPES.PRE_FOOTER: {
      const data = await getEntryByUid<PreFooterEntry>(_content_type_uid, uid);
      return data ? { type: "pre_footer", data } : null;
    }
    default:
      console.warn(`Unknown block type: ${_content_type_uid}`);
      return null;
  }
}

/**
 * Fetch all landing page data with resolved blocks
 */
export async function getLandingPageData(): Promise<LandingPageData> {
  const landingPage = await getLandingPageEntry();

  if (!landingPage) {
    return { hero: null, blocks: [] };
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

  // Resolve all blocks in parallel
  const blockPromises = (landingPage.blocks || []).map(resolveBlock);
  const resolvedBlocks = await Promise.all(blockPromises);

  // Filter out null blocks
  const blocks = resolvedBlocks.filter(
    (block): block is ResolvedBlock => block !== null
  );

  return { hero, blocks };
}
