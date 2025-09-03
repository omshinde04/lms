import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";   // ✅ Fix here
import FacultyLeave from "@/models/FacultyLeave";
import { sendEmail } from "@/lib/mailer";



export async function PUT(req, context) {
  await connectDB();

  try {
    // 🔐 Verify token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // ✅ Allow admin + hod
    const allowedRoles = ["admin", "hod"];
    if (!allowedRoles.includes(decoded.role?.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    // ✅ Get params safely
    const { id } = await context.params;

    // 📩 Request body
    const { status, comment } = await req.json();
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    // 🔄 Update Faculty Leave
    const updatedLeave = await FacultyLeave.findByIdAndUpdate(
      id,
      { status, comment },
      { new: true }
    ).populate("facultyId", "name email");

    if (!updatedLeave) {
      return NextResponse.json({ success: false, message: "Leave not found" }, { status: 404 });
    }

    // 📧 Send Email
    try {
      await sendEmail(
        updatedLeave.facultyId.email,
        `Faculty Leave Request ${status}`,
        `
          <h2>Hello ${updatedLeave.facultyId.name},</h2>
          <p>Your leave request was <b>${status}</b> by ${decoded.role}.</p>
          ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ""}
          <br/>
          <p>Regards,<br/>${decoded.name || "HOD/Admin"}</p>
        `
      );
    } catch (err) {
      console.error("❌ Email sending failed:", err);
    }

    return NextResponse.json(
      { success: true, message: `Leave ${status} & faculty notified`, updatedLeave },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Faculty PUT error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
