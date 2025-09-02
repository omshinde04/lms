// /app/api/student/leaves/[id]/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;
    const leaveId = params.id; // ✅ dynamic route param

    if (!leaveId) {
      return NextResponse.json({ error: "Leave ID is required!" }, { status: 400 });
    }

    // 🔹 Only delete if the leave belongs to the logged-in student
    const deletedLeave = await Leave.findOneAndDelete({ _id: leaveId, studentId });

    if (!deletedLeave) {
      return NextResponse.json({ error: "Leave not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json({ message: "Leave deleted successfully!" }, { status: 200 });
  } catch (err) {
    console.error("Leave delete error:", err);
    return NextResponse.json({ error: "Failed to delete leave." }, { status: 500 });
  }
}
