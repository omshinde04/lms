import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { sendEmail } from "@/lib/mailer";

// ================= PATCH: Approve/Reject Leave =================
export async function PATCH(req, context) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Await params properly
    const params = await context.params;
    const id = params.id;

    const { status, comment } = await req.json();
    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, comment },
      { new: true }
    ).populate("studentId", "name email");

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    // 📧 Send Email
    await sendEmail(
      leave.studentId.email,
      `Leave Request ${status}`,
      `
        <h2>Hello ${leave.studentId.name},</h2>
        <p>Your leave request has been <strong>${status}</strong>.</p>
        ${comment ? `<p>Comment: ${comment}</p>` : ""}
        <br/>
        <p>Regards,<br/>${decoded.name || "Faculty"}</p>
      `
    );

    return NextResponse.json(
      { message: `Leave ${status} & student notified via email`, leave },
      { status: 200 }
    );
  } catch (err) {
    console.error("Faculty update error:", err);
    return NextResponse.json({ error: "Failed to update leave." }, { status: 500 });
  }
}

// ================= DELETE: Remove Leave by ID =================
// ================= DELETE: Remove Leave by ID =================
export async function DELETE(req, context) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Await params properly
    const params = await context.params;
    const id = params.id;
    if (!id) return NextResponse.json({ error: "Leave ID required" }, { status: 400 });

    // ✅ Fetch leave first with populated studentId
    const leave = await Leave.findById(id).populate("studentId", "name email");
    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    // ✅ Delete it afterwards
    await Leave.findByIdAndDelete(id);

    // 📧 Send Email
    if (leave.studentId) {
      await sendEmail(
        leave.studentId.email,
        `Leave Request Deleted`,
        `
          <h2>Hello ${leave.studentId.name},</h2>
          <p>Your leave request was <strong>deleted</strong> by ${decoded.name || "faculty"}.</p>
          <br/>
          <p>Regards,<br/>${decoded.name || "Faculty"}</p>
        `
      );
    }

    return NextResponse.json(
      { message: "Leave deleted & student notified via email", leave },
      { status: 200 }
    );
  } catch (err) {
    console.error("Faculty leave delete error:", err);
    return NextResponse.json({ error: "Failed to delete leave." }, { status: 500 });
  }
}
