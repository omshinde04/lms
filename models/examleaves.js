import mongoose from "mongoose";

const ExamLeaveSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    year: { type: String, required: true },
    department: { type: String, required: true },
    teacher: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },

    // Faculty updates
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    comment: { type: String },
  },
  { timestamps: true }
);

// ✅ Explicitly set collection name "examleaves"
export default mongoose.models.ExamLeave ||
  mongoose.model("ExamLeave", ExamLeaveSchema, "examleaves");
