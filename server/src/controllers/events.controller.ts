import { Request, Response } from 'express';
import Event from '../models/Event';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

// GET /api/events  (public)
export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  const page  = parseInt(req.query.page as string)  || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip  = (page - 1) * limit;

  const filter: Record<string, unknown> = { status: 'published' };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.tag) filter.tags = req.query.tag;

  // upcoming by default
  if (!req.query.past) {
    filter.startDate = { $gte: new Date() };
  }

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ startDate: 1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  sendSuccess(res, events, 'Events fetched', 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/events/:id  (public)
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id).populate(
    'attendees',
    'name avatar'
  );
  if (!event || event.status === 'draft')
    throw new AppError('Event not found', 404);
  sendSuccess(res, event, 'Event fetched');
});

// POST /api/events  (admin)
export const createEvent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user!._id,
    });
    sendCreated(res, event, 'Event created');
  }
);

// PUT /api/events/:id  (admin)
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body as Partial<typeof Event>,
    { new: true, runValidators: true }
  );
  if (!event) throw new AppError('Event not found', 404);
  sendSuccess(res, event, 'Event updated');
});

// DELETE /api/events/:id  (admin)
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new AppError('Event not found', 404);
  sendSuccess(res, null, 'Event deleted');
});

// POST /api/events/:id/rsvp  (protected)
export const rsvpEvent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    const userId = req.user!._id;
    const alreadyRSVP = event.attendees.some((id) => id.equals(userId));

    if (alreadyRSVP) {
      // Withdraw RSVP
      event.attendees = event.attendees.filter((id) => !id.equals(userId));
      await event.save();
      return sendSuccess(res, event, 'RSVP withdrawn');
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new AppError('Event is fully booked', 400);
    }

    event.attendees.push(userId);
    await event.save();
    sendSuccess(res, event, 'RSVP confirmed');
  }
);
