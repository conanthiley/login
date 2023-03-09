const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./user");
const bcrypt = require("bcrypt");
const session = require("express-session");

mongoose
  .connect(
    "mongodb+srv://nicholasch24:<password>@cluster0.uuyxsu9.mongodb.net/authDemo",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Mongo Connection");
  })
  .catch((err) => {
    console.log("Oh No Mongo Error");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "notagoodsecret", resave: true, saveUninitialized: true })
);

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.send("home page");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //   const user = await User.findOne({ username });
  const foundUser = await User.findAndValidate(username, password);
  //   const validPassword = await bcrypt.compare(password, user.password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  //   req.session.user_id = null;
  //   req.session.destroy();

  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

app.listen(4000, () => {
  console.log("serving your app");
});
