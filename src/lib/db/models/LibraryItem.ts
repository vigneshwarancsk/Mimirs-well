import mongoose, { Document, Schema } from 'mongoose';

export interface ILibraryItem extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: string;
  addedAt: Date;
  status: 'saved' | 'reading' | 'completed';
  liked: boolean;
}

const LibraryItemSchema = new Schema<ILibraryItem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['saved', 'reading', 'completed'],
    default: 'saved',
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

// Compound index for efficient queries
LibraryItemSchema.index({ userId: 1, bookId: 1 }, { unique: true });
LibraryItemSchema.index({ userId: 1, status: 1 });

export const LibraryItem = mongoose.models.LibraryItem || 
  mongoose.model<ILibraryItem>('LibraryItem', LibraryItemSchema);
