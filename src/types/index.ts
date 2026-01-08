// Core types for Mimir's Well
// Designed for easy Contentstack integration

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: string[];
  publishedDate: string;
  pageCount: number;
  rating: number;
  pdfUrl: string;
  featured?: boolean;
  popular?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ReadingProgress {
  userId: string;
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
  completed: boolean;
}

export interface LibraryItem {
  userId: string;
  bookId: string;
  addedAt: Date;
  status: 'saved' | 'reading' | 'completed';
}

export interface BookWithProgress extends Book {
  progress?: ReadingProgress;
  libraryStatus?: 'saved' | 'reading' | 'completed';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  genres?: string[];
  sortBy?: 'title' | 'author' | 'rating' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
}
