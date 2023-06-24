import mongoose from "mongoose";
import bcrypt from "bcrypt";
const usersSchema = new mongoose.Schema(
  {
    userName: { type: String, require: true, unique: true, minLength: 8 },
    email: {
      type: String,
      match: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,
      require: true,
      unique: true,
    },
    firstName: { type: String, require: true, minLength: 2 },
    city: {
      type: String,
      require: true,
      enum: ["ERBIL", "SULAYMANIYAH", "DUHOK"],
      minLength: 2,
    },
    post: [{ type: mongoose.Types.ObjectId, ref: "post", require: true }],
    point: { type: Number, require: true, default: 0, minLength: 2 },
    donate: { type: Number, require: true, default: 0, minLength: 2 },
    taskId: { type: mongoose.Types.ObjectId, ref: "task", require: true },
    image: {
      type: String,
      require: true,
      default: "users/user-1687544074969-0.5114866047949307.jpeg",
    },

    lastName: { type: String, require: true, minLength: 2 },
    phoneNumber: { type: String, require: true },
    gender: {
      type: String,
      require: true,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    role: { type: String, default: "user" },
    password: { type: String, require: true, minLength: 8 },
    post: [{ type: mongoose.Types.ObjectId, ref: "post", require: false }],
  },
  { timestamps: true }
);

//ama middle ware a bo increpte krdn
usersSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usersSchema.methods.isValidePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const user = mongoose.model("user", usersSchema);

export default user;
