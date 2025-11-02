import mongoose from "mongoose";

//this function connects us to the MongoDB database using Mongoose
const connectDB = async () => {
  try {
    //try to connect using the secret from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // stop the server if we can't connect
  }
};

export default connectDB;



