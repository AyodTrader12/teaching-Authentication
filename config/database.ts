import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

 export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from .env");
  }

  await mongoose.connect(uri);

  console.log("MongoDB connected successfully");
};

// export default connectDB;