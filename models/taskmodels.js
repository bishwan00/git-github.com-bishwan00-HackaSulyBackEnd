import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    description: { type: String, require: true },
    images: { type: [String], required: true },
    location: { type: String, required: true },
    isComplite: { type: Boolean, default: false },
    point: { type: Number, require: true },
  },
  { timestamps: true }
);

const task = mongoose.model("tast", tasksSchema);

export default task;
