import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import ExamLeave from "@/models/examleaves";

// 🔹 POST: Create new exam leave
export async function POST(req) {
  await connectDB();

  try {
    // Verify JWT
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT Verify Error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;

    // Parse request body
    const { year, department, teacher, fromDate, toDate, reason } = await req.json();

    if (!year || !department || !teacher || !fromDate || !toDate || !reason) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // Save Exam Leave
    const newExamLeave = new ExamLeave({
      studentId,
      year,
      department,
      teacher,
      fromDate,
      toDate,
      reason,
    });

    await newExamLeave.save();

    return NextResponse.json({ examLeave: newExamLeave }, { status: 201 });
  } catch (err) {
    console.error("POST Exam Leave Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 GET: Fetch all exam leaves for logged-in student
export async function GET(req) {
  await connectDB();

  try {
    // Verify JWT
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT Verify Error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;

    // Get student's exam leaves
    const examLeaves = await ExamLeave.find({ studentId }).sort({ createdAt: -1 });

    return NextResponse.json({ examLeaves }, { status: 200 });
  } catch (err) {
    console.error("GET Exam Leave Error:", err);
    return NextResponse.json({ error: "Failed to fetch exam leaves." }, { status: 500 });
  }
}
