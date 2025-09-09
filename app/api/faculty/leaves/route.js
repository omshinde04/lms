import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";

export async function GET(req) {
  await connectDB();

  try {
    // 🔹 Extract JWT from header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 🔹 Only faculty can fetch all leaves
    if (decoded.role !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 🔹 Fetch all leaves with student details + certificate
    const leaves = await Leave.find()
      .populate("studentId", "name email year")
      .select("studentId year fromDate toDate type reason facultyName teacherName status comment certificate createdAt updatedAt")
      .sort({ createdAt: -1 });

    // ✅ API response
    return NextResponse.json({ leaves }, { status: 200 });
  } catch (err) {
    console.error("Faculty leaves fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaves." },
      { status: 500 }
    );
  }
}
