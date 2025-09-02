import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const student = await User.findById(decoded.userId).select("-password");
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
