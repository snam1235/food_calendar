const express = require('express');
const app = express();
const router = require("./routes")
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
 passport = require('passport')
const db = require('./lib/db');
const auth = require('./lib/auth');
const port = 5000;


db.connect();


 

app.use(express.static('public'));


app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: true,
  store: new MongoStore({mongooseConnection:mongoose.connection})
}));

//passport
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);
app.use(flash());

//all static files 




app.use('/', router);

app.listen(port, () =>
console.log(`running on port ${port}`)
);