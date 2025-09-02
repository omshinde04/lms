import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    // Fetch all students
    const users = await User.find({ role: "student" }).select("-password");

    // Fetch all faculty
    const faculty = await User.find({ role: "faculty" }).select("-password");

    return NextResponse.json({ users, faculty });
  } catch (error) {
    console.error("Admin Users Fetch Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
