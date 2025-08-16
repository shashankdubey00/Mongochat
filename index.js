require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require('method-override');

// Set view engine and public folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));

// Connect to MongoDB Atlas
main()
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// ===================== ROUTES ===================== //

// INDEX Route → Show all chats
app.get("/", async (req, res) => {
  let chats = await Chat.find();
  res.render("index.ejs", { chats });
});

// NEW Route → Show form
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE Route → Add new chat
app.post("/posts", async (req, res) => {
  try {
    const { from, msg, to, created_at } = req.body;  
    const newChat = new Chat({ from, msg, to, created_at }); 
    const savedChat = await newChat.save();
    console.log("Chat was saved:", savedChat);
    res.redirect("/"); // ✅ redirect to main page
  } catch (err) {
    console.log("Error saving chat:", err);
    res.status(500).send("Something went wrong");
  }
});

// EDIT Route → Show edit form
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) return res.status(404).send("Chat not found");
  res.render("edit.ejs", { chat });
});

// UPDATE Route → Update chat
app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
  console.log("Chat updated:", updatedChat);
  res.redirect("/"); // ✅ redirect to main page
});

// DELETE Route → Delete chat
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/"); // ✅ redirect to main page
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
