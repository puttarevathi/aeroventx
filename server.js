const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const User = require("./User");

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* FRONTEND */

app.use(express.static(path.join(__dirname, "../frontend")));

/* HOME */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* MONGODB */

mongoose
  .connect("mongodb://127.0.0.1:27017/aeroventx")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* REGISTER */

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

/* LOGIN */

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

/* USERS */

app.get("/users", async (req, res) => {
  const users = await User.find();

  res.json(users);
});

/* SERVER */

const PORT = 3000;

app.listen(PORT, () => {
  console.log("");
  console.log("================================");
  console.log(`Server Running : http://localhost:${PORT}`);
  console.log("================================");
});