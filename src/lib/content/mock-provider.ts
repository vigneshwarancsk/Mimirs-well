import { Book, SearchFilters } from '@/types';
import { ContentProvider } from './types';
import { mockBooks, allGenres } from './mock-data';

export class MockContentProvider implements ContentProvider {
  async getAllBooks(): Promise<Book[]> {
    return mockBooks;
  }

  async getBookById(id: string): Promise<Book | null> {
    return mockBooks.find(book => book.id === id) || null;
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return mockBooks.filter(book => book.featured);
  }

  async getPopularBooks(): Promise<Book[]> {
    return mockBooks.filter(book => book.popular);
  }

  async getLatestBooks(): Promise<Book[]> {
    // Sort by published date descending
    return [...mockBooks]
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, 6);
  }

  async searchBooks(filters: SearchFilters): Promise<Book[]> {
    let results = [...mockBooks];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }

    // Filter by genres
    if (filters.genres && filters.genres.length > 0) {
      results = results.filter(book =>
        filters.genres!.some(genre => book.genres.includes(genre))
      );
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'publishedDate':
            comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
            break;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return results;
  }

  async getBooksByGenre(genre: string): Promise<Book[]> {
    return mockBooks.filter(book => book.genres.includes(genre));
  }

  async getSimilarBooks(bookId: string): Promise<Book[]> {
    const book = await this.getBookById(bookId);
    if (!book) return [];

    // Find books with similar genres
    return mockBooks
      .filter(b => b.id !== bookId)
      .filter(b => b.genres.some(genre => book.genres.includes(genre)))
      .slice(0, 4);
  }

  async getAllGenres(): Promise<string[]> {
    return allGenres;
  }
}
