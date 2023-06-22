import mongoose from "mongoose";

const postsSchema = new mongoose.Schema(
  {
    description: { type: String, require: true },
    images: { type: [String], required: true },
    isActive: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "user", require: true },
  },
  { timestamps: true }
);

const post = mongoose.model("post", postsSchema);

export default post;
