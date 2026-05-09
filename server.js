const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const User = require("./User");
const Review = require("./Review");

const app = express();

/* =========================
   IMAGE UPLOAD
========================= */

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
   MONGODB CONNECTION
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
   ADD REVIEW
========================= */

app.post(
"/add-review",
upload.single("image"),
async (req,res)=>{

try{

const review = new Review({

name:req.body.name,

message:req.body.message,

rating:req.body.rating,

image:req.file ? req.file.filename : ""

});

await review.save();

res.json({
message:"Review Added"
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed"
});

}

});

/* =========================
   GET REVIEWS
========================= */

app.get("/reviews", async (req,res)=>{

try{

const reviews = await Review.find();

res.json(reviews);

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed"
});

}

});

/* =========================
   SERVER
========================= */
/* =========================
   ADD REVIEW API
========================= */

app.post(
"/add-review",
upload.single("image"),
async(req,res)=>{

try{

const { name, review, rating } = req.body;

const image = req.file
? req.file.filename
: "";

const newReview = new Review({

name,
review,
rating,
image

});

await newReview.save();

res.json({
message:"Review Added Successfully"
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed To Add Review"
});

}

});

/* =========================
   GET REVIEWS API
========================= */

app.get("/reviews",async(req,res)=>{

try{

const reviews =
await Review.find().sort({_id:-1});

res.json(reviews);

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed To Fetch Reviews"
});

}

});

/* =========================
   DELETE REVIEW API
========================= */

app.delete(
"/delete-review/:id",
async(req,res)=>{

try{

await Review.findByIdAndDelete(
req.params.id
);

res.json({
message:"Review Deleted"
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Delete Failed"
});

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("");
console.log("====================================");
console.log(`Server Running On Port : ${PORT}`);
console.log("====================================");

});
