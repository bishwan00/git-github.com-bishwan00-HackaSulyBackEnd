import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("you are connected to DB");
  } catch (err) {
    console.log(err);
  }
};
