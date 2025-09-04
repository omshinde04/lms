import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import ExamLeave from "@/models/examleaves"; // ✅ match file name
import { sendEmail } from "@/lib/mailer";

// ================= PATCH: Approve/Reject Exam Leave =================
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

    const { id } = await context.params;
    const { status, comment } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const examLeave = await ExamLeave.findByIdAndUpdate(
      id,
      { status, comment },
      { new: true }
    ).populate("studentId", "name email");

    if (!examLeave) {
      return NextResponse.json({ error: "Exam Leave not found" }, { status: 404 });
    }

    // 📧 Send Email
await sendEmail(
  examLeave.studentId.email,
  `Exam Leave Request ${status}`,
  `
    <h2>Hello ${examLeave.studentId.name},</h2>
    <p>Your exam leave request for <strong>${examLeave.teacher}</strong> has been <strong>${status}</strong>.</p>
    ${comment ? `<p>Comment: ${comment}</p>` : ""}
    <br/>
    <p>Regards,<br/>${decoded.name || "Faculty"}</p>
  `
);


    return NextResponse.json(
      { message: `Exam leave ${status} & student notified via email`, examLeave },
      { status: 200 }
    );
  } catch (err) {
    console.error("Faculty exam leave update error:", err);
    return NextResponse.json({ error: "Failed to update exam leave." }, { status: 500 });
  }
}

// ================= DELETE: Remove Exam Leave by ID =================
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

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "Exam Leave ID required" }, { status: 400 });

    const examLeave = await ExamLeave.findById(id).populate("studentId", "name email");
    if (!examLeave) {
      return NextResponse.json({ error: "Exam Leave not found" }, { status: 404 });
    }

    await ExamLeave.findByIdAndDelete(id);

    // 📧 Send Email
    if (examLeave.studentId) {
     await sendEmail(
  examLeave.studentId.email,
  `Exam Leave Request Deleted`,
  `
    <h2>Hello ${examLeave.studentId.name},</h2>
    <p>Your exam leave request for <strong>${examLeave.teacher}</strong> was <strong>deleted</strong> by ${decoded.name || "faculty"}.</p>
    <br/>
    <p>Regards,<br/>${decoded.name || "Faculty"}</p>
  `
);

    }

    return NextResponse.json(
      { message: "Exam leave deleted & student notified via email", examLeave },
      { status: 200 }
    );
  } catch (err) {
    console.error("Faculty exam leave delete error:", err);
    return NextResponse.json({ error: "Failed to delete exam leave." }, { status: 500 });
  }
}
