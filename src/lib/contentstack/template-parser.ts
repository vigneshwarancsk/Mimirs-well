/**
 * Template parser for Contentstack personalized content
 * Replaces placeholders like {userName}, {getGreeting()}, {continueReadingCount}
 */

export interface TemplateVariables {
  userName?: string;
  continueReadingCount?: number;
  currentStreak?: number;
  booksCompleted?: number;
  booksInLibrary?: number;
  daysAfterLastRead?: number;
  thisWeekPages?: number;
  [key: string]: string | number | undefined;
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Parse template strings from Contentstack and replace placeholders
 * Supports: {variableName} and {functionName()}
 */
export function parseTemplate(
  template: string | undefined,
  variables: TemplateVariables
): string {
  if (!template) return "";

  return template.replace(/\{(\w+)(\(\))?\}/g, (match, key, isFn) => {
    // Handle function calls
    if (isFn) {
      switch (key) {
        case "getGreeting":
          return getGreeting();
        default:
          return match;
      }
    }

    // Handle variable replacements
    const value = variables[key];
    if (value !== undefined) {
      return String(value);
    }

    // Return empty string for undefined variables (cleaner output)
    return "";
  });
}

/**
 * Parse all text fields in a hero banner entry
 */
export function parseHeroBannerContent(
  entry: {
    greeting?: string;
    heading?: string;
    subheading?: string;
    subheading_2?: string;
    box?: {
      title?: string;
      subtitle?: string;
      stats?: Array<{ value: string; text: string }>;
    };
  },
  variables: TemplateVariables
): {
  greeting: string;
  heading: string;
  subheading: string;
  subheading_2: string;
  box?: {
    title: string;
    subtitle: string;
    stats?: Array<{ value: string; text: string }>;
  };
} {
  const result = {
    greeting: parseTemplate(entry.greeting, variables),
    heading: parseTemplate(entry.heading, variables),
    subheading: parseTemplate(entry.subheading, variables),
    subheading_2: parseTemplate(entry.subheading_2, variables),
    box: entry.box
      ? {
          title: parseTemplate(entry.box.title, variables),
          subtitle: parseTemplate(entry.box.subtitle, variables),
          stats: entry.box.stats?.map((stat) => ({
            value: parseTemplate(stat.value, variables),
            text: stat.text,
          })),
        }
      : undefined,
  };

  return result;
}
