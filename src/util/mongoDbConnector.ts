import mongoose from "mongoose";
import { MONGODB_URI } from "./secrets";
import bluebird from "bluebird";

export default async function connect() {
  try {
    await initializeConnection();
  } catch (error) {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${error}`
    );
    process.exit();
  }
}

function initializeConnection() {
  mongoose.Promise = bluebird;
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
}
