import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudentExamLeave from "@/models/StudentExamLeave";
import jwt from "jsonwebtoken";

// GET - Fetch all exam leave requests of the logged-in student
export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const leaves = await StudentExamLeave.find({ studentId: decoded.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(leaves, { status: 200 });
  } catch (err) {
    console.error("GET Exam Leaves Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST - Submit a new exam leave request
export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const body = await req.json();

    const newLeave = await StudentExamLeave.create({
      studentId: decoded.id,
      name: body.name,
      email: body.email,
      year: body.year,
      department: body.department,
      teacher: body.teacher,
      fromDate: body.fromDate,
      toDate: body.toDate,
      reason: body.reason,
    });

    return NextResponse.json(newLeave, { status: 201 });
  } catch (err) {
    console.error("POST Exam Leave Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
