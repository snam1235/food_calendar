const express = require("express");
const app = express();
const router = require("./routes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const db = require("./lib/db");
const auth = require("./lib/auth");
const port = process.env.PORT || 5000;

db.connect();

app.use(express.static("public"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
app.get("/api/message", async (req, res, next) => {
  try {
    res.status(201).json({ message: "HELLOOOOO FROM EXPRESS" });
  } catch (err) {
    next(err);
  }
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: "codeworkrsecret",
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

//initialize passport- authentication middleware
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);
//flash enables sending messages between routes
app.use(flash());

//mount routes
app.use("/", router);

//connect to port
app.listen(port, () => console.log(`running on port ${port}`));
