import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import ExamLeave from "@/models/examleaves";

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

    // 🔹 Only faculty can fetch exam leaves
    if (decoded.role !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 🔹 Fetch exam leaves with student details
    const examLeaves = await ExamLeave.find()
      .populate("studentId", "name email year department")
      .sort({ createdAt: -1 });

    // ✅ API response
    return NextResponse.json({ examLeaves }, { status: 200 });
  } catch (err) {
    console.error("Faculty exam leaves fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch exam leaves." },
      { status: 500 }
    );
  }
}
