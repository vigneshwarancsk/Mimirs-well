import mongoose, { Document, Schema } from 'mongoose';

export interface IReminderLog extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  bookId: string;
  bookName: string;
  reminderType: 'inactive_7_days' | 'inactive_14_days' | 'inactive_21_days' | 'inactive_28_days';
  daysInactive: number;
  sentAt: Date;
  automationResponse: {
    success: boolean;
    message?: string;
  };
}

const ReminderLogSchema = new Schema<IReminderLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  reminderType: {
    type: String,
    enum: ['inactive_7_days', 'inactive_14_days', 'inactive_21_days', 'inactive_28_days'],
    required: true,
  },
  daysInactive: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  automationResponse: {
    success: { type: Boolean, default: false },
    message: { type: String },
  },
});

// Indexes for efficient queries
ReminderLogSchema.index({ userId: 1, bookId: 1, reminderType: 1 });
ReminderLogSchema.index({ sentAt: -1 });

export const ReminderLog = mongoose.models.ReminderLog || 
  mongoose.model<IReminderLog>('ReminderLog', ReminderLogSchema);
