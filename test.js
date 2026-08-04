import mongoose from "mongoose";

const uri =
  "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.3b0n55d.mongodb.net/test?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
