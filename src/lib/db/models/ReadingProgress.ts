import mongoose, { Document, Schema } from 'mongoose';

export interface IReadingProgress extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
  completed: boolean;
}

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
});

// Compound index for efficient queries
ReadingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const ReadingProgress = mongoose.models.ReadingProgress || 
  mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);
