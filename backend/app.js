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
const port = 5000;

db.connect();

app.use(express.static("public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: "codeworkrsecret",
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
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
