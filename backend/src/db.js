import mongoose from "mongoose";

let connection = null;
export const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("conexion esitosa");
    return connection;
  } catch (error) {
    console.log(error);
  }
};
