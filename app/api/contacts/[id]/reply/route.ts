import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";
import { sendContactReplyEmail } from "@/lib/email";

// POST /api/contacts/[id]/reply  (admin)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { id } = await params;
    const { message } = (await req.json()) as { message?: string };

    if (!message?.trim() || message.trim().length < 2)
      throw new AppError("Reply message is required", 400);

    const contact = await Contact.findById(id);
    if (!contact) throw new AppError("Contact not found", 404);

    await sendContactReplyEmail(
      contact.email,
      contact.name,
      contact.subject,
      message.trim(),
    );

    // Mark as replied
    contact.status = "replied";
    await contact.save();

    return apiSuccess({ status: "replied" }, "Reply sent successfully");
  } catch (err) {
    return handleError(err);
  }
}
