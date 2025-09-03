import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FacultyLeave from "@/models/FacultyLeave";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const leave = await FacultyLeave.findById(params.id);
    if (!leave) return NextResponse.json({ error: "Leave not found" }, { status: 404 });

    // ✅ ensure faculty can only delete their own leave
    if (leave.facultyId.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await FacultyLeave.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE Faculty Leave Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
