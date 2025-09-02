import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 🔹 Only allow faculty
    if (decoded.role !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();

    // 🔹 Fetch faculty profile
    const faculty = await User.findById(decoded.userId).select("-password");
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ faculty }, { status: 200 });
  } catch (error) {
    console.error("Faculty Profile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
