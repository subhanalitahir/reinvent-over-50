import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'virtual' | 'in-person' | 'hybrid';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  location?: string;
  virtualLink?: string;
  maxAttendees?: number;
  attendees: mongoose.Types.ObjectId[];
  price: number;
  isFree: boolean;
  imageUrl?: string;
  tags: string[];
  hostedBy: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      enum: ['virtual', 'in-person', 'hybrid'],
      required: [true, 'Event type is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: String,
    virtualLink: String,
    maxAttendees: {
      type: Number,
      min: 1,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    imageUrl: String,
    tags: [{ type: String, lowercase: true, trim: true }],
    hostedBy: {
      type: String,
      required: [true, 'Host name is required'],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

EventSchema.index({ startDate: 1 });
EventSchema.index({ status: 1, startDate: 1 });
EventSchema.index({ type: 1, status: 1 });
EventSchema.index({ tags: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
