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
   ADMIN REVIEWS API
========================= */

app.get("/admin-reviews", async(req,res)=>{

try{

const reviews =
await Review.find({
approved:false
}).sort({_id:-1});

res.json(reviews);

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed To Fetch Admin Reviews"
});

}

});

/* =========================
   APPROVE REVIEW API
========================= */

app.put("/approve-review/:id", async(req,res)=>{

try{

await Review.findByIdAndUpdate(
req.params.id,
{
approved:true
}
);

res.json({
message:"Review Approved"
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Approval Failed"
});

}

});

/* =========================
   GET REVIEWS API
========================= */

app.get("/reviews", async(req,res)=>{

try{

const reviews =
await Review.find({
approved:true
}).sort({_id:-1});

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

/* =========================
   SERVER
========================= */
/* ADMIN LOGIN */

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@aeroventx.com";

/* HASHED PASSWORD:
admin123
*/

const ADMIN_PASSWORD =
"$2b$10$9X6j7H9WQ0A0v6Wj6KjL6e2gX8jR6GQ3n5x3Y3zR9Yx5V8Y5zW6nK";

const JWT_SECRET =
"aeroventx_secret_key";

app.post("/admin-login", async(req,res)=>{

try{

const { email, password } = req.body;

if(email !== ADMIN_EMAIL){

return res.status(401).json({
message:"Invalid Email"
});

}

const isMatch =
await bcrypt.compare(
password,
ADMIN_PASSWORD
);

if(!isMatch){

return res.status(401).json({
message:"Invalid Password"
});

}

const token = jwt.sign(
{
admin:true
},
JWT_SECRET,
{
expiresIn:"7d"
}
);

res.json({
token
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Login Failed"
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
