import mongoose, { Document, Schema } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  // Reading streak tracking
  currentStreak: number;
  longestStreak: number;
  lastReadDate: Date | null;
  streakStartDate: Date | null;
  
  // Reading activity tracking
  totalBooksCompleted: number;
  totalPagesRead: number;
  totalReadingTimeMinutes: number;
  
  // Daily reading sessions for cron job reminders
  readingHistory: {
    date: Date;
    pagesRead: number;
    minutesRead: number;
    booksRead: string[]; // Book IDs read that day
  }[];
  
  // Last activity for reminder cron jobs
  lastActivityAt: Date;
  
  // Notification preferences (for future cron job reminders)
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format
  inactiveDaysBeforeReminder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<IUserStats>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Streak tracking
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastReadDate: {
    type: Date,
    default: null,
  },
  streakStartDate: {
    type: Date,
    default: null,
  },
  
  // Activity stats
  totalBooksCompleted: {
    type: Number,
    default: 0,
  },
  totalPagesRead: {
    type: Number,
    default: 0,
  },
  totalReadingTimeMinutes: {
    type: Number,
    default: 0,
  },
  
  // Reading history for analytics and reminders
  readingHistory: [{
    date: {
      type: Date,
      required: true,
    },
    pagesRead: {
      type: Number,
      default: 0,
    },
    minutesRead: {
      type: Number,
      default: 0,
    },
    booksRead: [{
      type: String,
    }],
  }],
  
  // For cron job reminders
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
  reminderEnabled: {
    type: Boolean,
    default: true,
  },
  reminderTime: {
    type: String,
    default: '20:00', // 8 PM default
  },
  inactiveDaysBeforeReminder: {
    type: Number,
    default: 2,
  },
}, {
  timestamps: true,
});

// Index for efficient queries (userId is already indexed via unique: true above)
UserStatsSchema.index({ lastActivityAt: 1 }); // For finding inactive users
UserStatsSchema.index({ 'readingHistory.date': 1 });

export const UserStats = mongoose.models.UserStats || 
  mongoose.model<IUserStats>('UserStats', UserStatsSchema);
