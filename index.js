require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require('method-override');


app.set("views", path.join(__dirname, "views")); //views folder k andar ham apne ejs template ko banana start kar sakte hai(for both app.set).
app.set("view engine", "ejs"); 
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));//to parse the data (for req.body)
app.use(methodOverride('_method'))

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
 await mongoose.connect(process.env.MONGO_URL);

}

//index Route
app.get("/", async (req,res) => {
  let chats = await Chat.find();
  res.render("index.ejs",{chats});
});

//New Route
app.get("/chats/new" ,(req,res) => {
  res.render("new.ejs")
});

//Create route

app.post("/posts", async (req, res) => {
  try {
    const { from, msg, to, created_at } = req.body;  
    const newChat = new Chat({ from, msg, to, created_at }); 
    const savedChat = await newChat.save();
    console.log("chat was saved:", savedChat);
    res.redirect("/");
  } catch (err) {
    console.log("Error saving chat:", err);
    res.status(500).send("Something went wrong");
  }
});


//edit route

app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
    return res.status(404).send("Chat not found");
  }
  res.render("edit.ejs", { chat });
});

//update Route
app.put("/chats/:id",async (req,res) => {
  let{id} = req.params;
  let {msg: newMsg} = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators: true, new: true});

  console.log(updatedChat);
  res.redirect("/chats");
})

//destroy Route

app.delete("/chats/:id", async(req,res) => {
  let{id} = req.params;
  let deleteChat = await Chat.findByIdAndDelete(id)
  res.redirect("/chats")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


