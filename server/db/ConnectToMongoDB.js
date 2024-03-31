import mongoose from "mongoose";

export default async function ConnectToMongoDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (error) {
    console.log("Error connecting to mongodb", error.message);
  }
};
