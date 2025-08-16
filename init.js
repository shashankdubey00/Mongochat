require("dotenv").config();   // Load .env variables
const express = require("express");
const mongoose = require("mongoose");
const chat = require("./models/chat.js");
const app = express();
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

const allChats = [
  { from: "neha", to: "priya", msg: "send me" },
  { from: "priya", to: "neha", msg: "send me" },
  { from: "neha", to: "priya", msg: "send me" }
];


// Simple route to check
app.get("/", (req, res) => {
  res.send("🚀 Chat App Backend is running!");
});

// API route to fetch all chats
app.get("/chats", async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});