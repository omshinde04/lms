import mongoose from "mongoose";

const FacultyLeaveSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming faculty is also in User collection
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Casual", "Sick", "Maternity", "Other"],
      default: "Casual",
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.FacultyLeave ||
  mongoose.model("FacultyLeave", FacultyLeaveSchema);
