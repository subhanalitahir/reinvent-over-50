import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";
import {
  sendContactNotificationEmail,
  sendContactAcknowledgementEmail,
} from "@/lib/email";

// POST /api/contacts  (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, subject, message } = (await req.json()) as {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    };

    if (!name?.trim() || name.trim().length < 2)
      return apiSuccess(null, "Name must be at least 2 characters", 400);
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return apiSuccess(null, "Valid email required", 400);
    if (!message?.trim() || message.trim().length < 10)
      return apiSuccess(null, "Message must be at least 10 characters", 400);

    const validSubjects = [
      "general",
      "membership",
      "workbook",
      "events",
      "coaching",
      "technical",
      "partnership",
      "other",
    ];
    if (subject && !validSubjects.includes(subject))
      return apiSuccess(null, "Invalid subject", 400);

    const ipAddress =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      undefined;

    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      subject: subject ?? "general",
      message: message.trim(),
      ipAddress,
    });

    const adminEmail =
      process.env.ADMIN_EMAIL ??
      process.env.EMAIL_FROM ??
      "admin@reinventyou50.com";
    sendContactNotificationEmail(adminEmail, {
      name,
      email,
      phone,
      subject,
      message,
    }).catch(() => {});
    sendContactAcknowledgementEmail(email, name).catch(() => {});

    return apiCreated(
      contact,
      "Message received. We will get back to you soon!",
    );
  } catch (err) {
    return handleError(err);
  }
}

// GET /api/contacts  (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("subject"))
      filter.subject = searchParams.get("subject");

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return apiSuccess(contacts, "Contacts fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleError(err);
  }
}
