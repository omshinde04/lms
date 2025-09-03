import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb"; 
import Leave from "@/models/Leave";

export async function POST(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🔹 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;

    // 🔹 Extract request body
    const { fromDate, toDate, type, reason, facultyName, teacherName, year, certificateUrl } = await req.json();

    // 🔹 Validate required fields
    if (!fromDate || !toDate || !type || !reason || !facultyName || !teacherName || !year) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // 🔹 Create leave request
    const newLeave = new Leave({
      studentId,
      fromDate,
      toDate,
      type,
      reason,
      facultyName,
      teacherName, // ✅ Added new field
      year,
    });

    await newLeave.save();
    return NextResponse.json({ message: "Leave request submitted!" }, { status: 201 });
  } catch (err) {
    console.error("Leave submission error:", err);
    return NextResponse.json({ error: "Failed to submit leave request." }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🔹 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;

    // 🔹 Fetch student leaves including year & faculty
    const leaves = await Leave.find({ studentId }).sort({ createdAt: -1 });

    return NextResponse.json({ leaves }, { status: 200 });
  } catch (err) {
    console.error("Leave fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch leaves." }, { status: 500 });
  }
}
