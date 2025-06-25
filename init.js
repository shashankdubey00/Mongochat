const mongoose = require("mongoose");
const chat = require("./models/chat.js");

main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
        from: "neha",
        to: "priya",
        msg: "send me",
        created_at: new Date()
    },
    {
        from: "priya",
        to: "neha",
        msg: "send me",
        created_at: new Date()
    },
    {
        from: "neha",
        to: "priya",
        msg: "send me",
        created_at: new Date()
    }
]

chat.insertMany(allChats);

    
