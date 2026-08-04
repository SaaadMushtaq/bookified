import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Testing MongoDB connection...");
console.log(
  "URI:",
  MONGODB_URI ? MONGODB_URI.split("@")[0] + "@***" : "NOT SET",
);
console.log("");

mongoose
  .connect(MONGODB_URI)
  .then(async (conn) => {
    console.log("✅ MongoDB connected successfully!");
    console.log("");

    // Get database info
    const db = conn.connection.db;
    console.log("Database:", db.name);
    console.log("");

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("Collections found:");
    if (collections.length === 0) {
      console.log("  (no collections yet)");
    } else {
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }
    console.log("");

    // Test a simple query
    console.log("Testing a simple query...");
    const booksCollection = db.collection("books");
    const count = await booksCollection.countDocuments();
    console.log(`Books collection has ${count} documents`);
    console.log("");

    console.log("✅ All tests passed! MongoDB is accessible.");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("Code:", error.code);
    console.error("Full error:", error);
    process.exit(1);
  });
