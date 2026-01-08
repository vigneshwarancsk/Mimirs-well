// Content Provider Interface
// This abstraction allows easy switching between mock data and Contentstack

import { Book, SearchFilters } from '@/types';

export interface ContentProvider {
  // Book queries
  getAllBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  getFeaturedBooks(): Promise<Book[]>;
  getPopularBooks(): Promise<Book[]>;
  getLatestBooks(): Promise<Book[]>;
  searchBooks(filters: SearchFilters): Promise<Book[]>;
  getBooksByGenre(genre: string): Promise<Book[]>;
  getSimilarBooks(bookId: string): Promise<Book[]>;
  
  // Metadata
  getAllGenres(): Promise<string[]>;
}
