import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import fs from "fs";
import path from "path";

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

    // 🔹 Use formData to handle both text + file
    const formData = await req.formData();
    const fromDate = formData.get("fromDate");
    const toDate = formData.get("toDate");
    const type = formData.get("type");
    const reason = formData.get("reason");
    const facultyName = formData.get("facultyName");
    const teacherName = formData.get("teacherName");
    const year = formData.get("year");
    const certificateFile = formData.get("certificate"); // file object

    // 🔹 Validate required fields
    if (!fromDate || !toDate || !type || !reason || !facultyName || !teacherName || !year) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    let certificateUrl = null;
    if (certificateFile && certificateFile.name) {
      const buffer = Buffer.from(await certificateFile.arrayBuffer());
      const fileName = `${Date.now()}-${certificateFile.name}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Ensure upload dir exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      // Accessible URL
      certificateUrl = `/uploads/${fileName}`;
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
      certificate: certificateUrl, // ✅ file URL or null
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

    // 🔹 Fetch student leaves including year, faculty, teacher, certificate
    const leaves = await Leave.find({ studentId }).sort({ createdAt: -1 });

    return NextResponse.json({ leaves }, { status: 200 });
  } catch (err) {
    console.error("Leave fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch leaves." }, { status: 500 });
  }
}
