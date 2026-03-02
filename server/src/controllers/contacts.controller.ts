import { Request, Response } from "express";
import Contact from "../models/Contact";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/apiResponse";
import { AppError } from "../middleware/error.middleware";

// POST /api/contacts  (public)
export const createContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, subject, message } = req.body as {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    };

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject: subject ?? "general",
      message,
      ipAddress: req.ip,
    });

    sendCreated(
      res,
      contact,
      "Message received. We will get back to you soon!",
    );
  },
);

// GET /api/contacts  (admin)
export const getAllContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.subject) filter.subject = req.query.subject;

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    sendSuccess(res, contacts, "Contacts fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },
);

// GET /api/contacts/:id  (admin)
export const getContactById = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true },
    );
    if (!contact) throw new AppError("Contact not found", 404);
    sendSuccess(res, contact, "Contact fetched");
  },
);

// PUT /api/contacts/:id  (admin)
export const updateContact = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body as Partial<typeof Contact>,
      { new: true, runValidators: true },
    );
    if (!contact) throw new AppError("Contact not found", 404);
    sendSuccess(res, contact, "Contact updated");
  },
);

// DELETE /api/contacts/:id  (admin)
export const deleteContact = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) throw new AppError("Contact not found", 404);
    sendSuccess(res, null, "Contact deleted");
  },
);
