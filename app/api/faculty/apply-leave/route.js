import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FacultyLeave from "@/models/FacultyLeave";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // ✅ Use decoded.userId (not decoded.id)
    const leaves = await FacultyLeave.find({ facultyId: decoded.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(leaves, { status: 200 });
  } catch (err) {
    console.error("GET Faculty Leaves Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const body = await req.json();

    // ✅ facultyId now comes from decoded.userId
    const newLeave = await FacultyLeave.create({
      facultyId: decoded.userId,
      name: body.name,
      department: body.department,
      type: body.type,
      fromDate: body.fromDate,
      toDate: body.toDate,
      reason: body.reason,
      status: "Pending", // default status
    });

    return NextResponse.json(newLeave, { status: 201 });
  } catch (err) {
    console.error("POST Faculty Leave Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
