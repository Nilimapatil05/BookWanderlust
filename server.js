const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

const sessionOption = {
  secret: "my secreates",
  saveUninitialized: true,
  resave: false,
};

app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next) => {
  res.locals.msg = req.flash("sucess");
  res.locals.err = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;

  req.session.name = name;
  console.log(req.session.name);
  if (req.session.name === "anonymous") {
    req.flash("error", "User Not found");
  } else {
    req.flash("sucess", "user registered sucessfully");
  }

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  //   res.render("page.ejs", { name: req.session.name, msg: req.flash("sucess") });
  res.render("page.ejs", { name: req.session.name });
});

app.get("/test", (req, res) => {
  res.send("tesst sucessful");
});

app.get("/reqcount", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`you send the req ${req.session.count} times!`);
});

app.listen(8080, () => {
  console.log("server is listing at pos=rt at 8080");
});
