import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    year: { type: String, enum: ["FY", "SY", "TY"], required: true }, // ✅ Added Year field
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, required: true },
    facultyName: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    comment: { type: String, default: "" }, // ✅ Optional faculty comment
  },
  { timestamps: true }
);

export default mongoose.models.Leave || mongoose.model("Leave", LeaveSchema);
