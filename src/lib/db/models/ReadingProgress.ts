import mongoose, { Document, Schema } from 'mongoose';

export interface IReadingSession {
  startedAt: Date;
  endedAt: Date;
  startPage: number;
  endPage: number;
  pagesRead: number;
  durationMinutes: number;
}

export interface IReadingProgress extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
  completed: boolean;
  completedAt: Date | null;
  
  // Session tracking for analytics and reminders
  firstReadAt: Date;
  readingSessions: IReadingSession[];
  totalTimeSpentMinutes: number;
  
  // For cron job reminders - track when user left the book
  lastSessionEndedAt: Date | null;
  daysInactive: number; // Updated by cron job
}

const ReadingSessionSchema = new Schema({
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true },
  startPage: { type: Number, required: true },
  endPage: { type: Number, required: true },
  pagesRead: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
}, { _id: false });

const ReadingProgressSchema = new Schema<IReadingProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
    min: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    min: 1,
  },
  lastReadAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  
  // Session tracking
  firstReadAt: {
    type: Date,
    default: Date.now,
  },
  readingSessions: {
    type: [ReadingSessionSchema],
    default: [],
  },
  totalTimeSpentMinutes: {
    type: Number,
    default: 0,
  },
  
  // For reminders
  lastSessionEndedAt: {
    type: Date,
    default: null,
  },
  daysInactive: {
    type: Number,
    default: 0,
  },
});

// Compound index for efficient queries
ReadingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });
ReadingProgressSchema.index({ userId: 1, lastReadAt: -1 }); // For "continue reading" queries
ReadingProgressSchema.index({ lastSessionEndedAt: 1, completed: 1 }); // For reminder cron jobs

export const ReadingProgress = mongoose.models.ReadingProgress || 
  mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);
