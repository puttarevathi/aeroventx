const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const User = require("./User");

const app = express();
const storage = multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"uploads/");

},

filename:(req,file,cb)=>{

cb(null,Date.now()+"-"+file.originalname);

}

});

const upload = multer({storage});

app.use("/uploads",express.static("uploads"));

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   FRONTEND FILES
========================= */

app.use(express.static(__dirname));

/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {

res.sendFile(path.join(__dirname, "index.html"));

});

/* =========================
   MONGODB ATLAS CONNECTION
========================= */

mongoose
.connect(
"mongodb+srv://puttarevathi517_db_user:Revathi%40321@cluster0.2xi5nzp.mongodb.net/aeroventx?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {

console.log("MongoDB Atlas Connected");

})
.catch((err) => {

console.log(err);

});

/* =========================
   REGISTER API
========================= */

app.post("/register", async (req, res) => {

try {

const { name, phone, email, password } = req.body;

const user = new User({
name,
phone,
email,
password,
});

await user.save();

res.json({
message: "Register Successfully",
});

} catch (error) {

console.log(error);

res.status(500).json({
message: "Registration Failed",
});

}

});

/* =========================
   LOGIN API
========================= */

app.post("/login", async (req, res) => {

try {

const { email, password } = req.body;

const user = await User.findOne({
email,
password,
});

if (user) {

res.json({
message: "Login Successfully",
});

} else {

res.status(401).json({
message: "Invalid Email or Password",
});

}

} catch (error) {

console.log(error);

res.status(500).json({
message: "Login Failed",
});

}

});

/* =========================
   USERS API
========================= */

app.get("/users", async (req, res) => {

try {

const users = await User.find();

res.json(users);

} catch (error) {

console.log(error);

res.status(500).json({
message: "Failed To Fetch Users",
});

}

});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("");
console.log("====================================");
console.log(`Server Running On Port : ${PORT}`);
console.log("====================================");

});
