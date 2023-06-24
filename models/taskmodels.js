import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    description: { type: String, require: true },
    images: { type: [String], required: true },
    location: { type: String, required: true },
    iscompleted: { type: Boolean, default: false },
    point: { type: Number, require: true },
  },
  { timestamps: true }
);

const task = mongoose.model("task", tasksSchema);

export default task;
