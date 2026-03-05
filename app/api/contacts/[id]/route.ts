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

// GET /api/contacts/[id]  (admin – marks as read)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true },
    );
    if (!contact) throw new AppError("Contact not found", 404);
    return apiSuccess(contact, "Contact fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/contacts/[id]  (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const body = await req.json();
    const contact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!contact) throw new AppError("Contact not found", 404);
    return apiSuccess(contact, "Contact updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/contacts/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) throw new AppError("Contact not found", 404);
    return apiSuccess(null, "Contact deleted");
  } catch (err) {
    return handleError(err);
  }
}
