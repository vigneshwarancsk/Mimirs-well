// Content Provider Factory
// Switch between MockContentProvider and ContentstackProvider here

import { ContentProvider } from './types';
import { MockContentProvider } from './mock-provider';

// When you integrate Contentstack, create a ContentstackProvider
// that implements ContentProvider and switch here
// import { ContentstackProvider } from './contentstack-provider';

let contentProvider: ContentProvider | null = null;

export function getContentProvider(): ContentProvider {
  if (!contentProvider) {
    // Switch to ContentstackProvider when ready
    // contentProvider = new ContentstackProvider();
    contentProvider = new MockContentProvider();
  }
  return contentProvider;
}

// Re-export types for convenience
export type { ContentProvider } from './types';
