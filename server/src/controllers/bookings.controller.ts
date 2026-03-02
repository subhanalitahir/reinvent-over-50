import { Response } from 'express';
import Booking from '../models/Booking';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

// POST /api/bookings
export const createBooking = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { guestName, guestEmail, guestPhone, sessionType, scheduledAt, duration, notes } =
      req.body as {
        guestName: string;
        guestEmail: string;
        guestPhone?: string;
        sessionType: string;
        scheduledAt: string;
        duration?: number;
        notes?: string;
      };

    // Check for conflicting booking within 30 min window
    const windowStart = new Date(new Date(scheduledAt).getTime() - 30 * 60000);
    const windowEnd   = new Date(new Date(scheduledAt).getTime() + 30 * 60000);

    const conflict = await Booking.findOne({
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) throw new AppError('That time slot is already booked', 409);

    const booking = await Booking.create({
      user: req.user?._id,
      guestName,
      guestEmail,
      guestPhone,
      sessionType,
      scheduledAt: new Date(scheduledAt),
      duration: duration ?? 60,
      notes,
    });

    sendCreated(res, booking, 'Booking created successfully');
  }
);

// GET /api/bookings  (admin)
export const getAllBookings = asyncHandler(async (req, res: Response) => {
  const page  = parseInt(req.query.page as string)  || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip  = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.sessionType) filter.sessionType = req.query.sessionType;

  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort({ scheduledAt: 1 }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);

  sendSuccess(res, bookings, 'Bookings fetched', 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/bookings/my  (protected)
export const getMyBookings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const bookings = await Booking.find({ user: req.user!._id }).sort({
      scheduledAt: 1,
    });
    sendSuccess(res, bookings, 'Your bookings fetched');
  }
);

// GET /api/bookings/:id  (admin)
export const getBookingById = asyncHandler(async (req, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  sendSuccess(res, booking, 'Booking fetched');
});

// PUT /api/bookings/:id  (admin)
export const updateBooking = asyncHandler(async (req, res: Response) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body as Partial<typeof Booking>,
    { new: true, runValidators: true }
  );
  if (!booking) throw new AppError('Booking not found', 404);
  sendSuccess(res, booking, 'Booking updated');
});

// DELETE /api/bookings/:id  (admin)
export const deleteBooking = asyncHandler(async (req, res: Response) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  sendSuccess(res, null, 'Booking deleted');
});

// PUT /api/bookings/:id/cancel  (protected — own booking)
export const cancelBooking = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: (req.body as { reason?: string }).reason,
      },
      { new: true }
    );
    if (!booking) throw new AppError('Booking not found or not yours', 404);
    sendSuccess(res, booking, 'Booking cancelled');
  }
);
