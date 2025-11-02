import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time are required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'missed', 'sent'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;