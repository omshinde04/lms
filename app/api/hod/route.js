import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FacultyLeave from "@/models/FacultyLeave";

// GET all faculty leaves (with optional filters)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const department = searchParams.get("department");

    let query = {};

    if (status) query.status = status; // filter by status if provided
    if (department) query.department = department; // filter by department if provided

    const leaves = await FacultyLeave.find(query)
      .populate("facultyId", "name email department") // include faculty details
      .sort({ createdAt: -1 });

    return NextResponse.json(leaves, { status: 200 });
  } catch (err) {
    console.error("HOD GET Faculty Leaves Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
