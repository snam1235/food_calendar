const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const UserModel = require("../models/user");
//user authentication strategy
passport.use(
  new LocalStrategy(
    //passReqtoCallback enabled to flash login success/failure message
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        console.log("login attempt");
        //find user with the entered email
        const user = await UserModel.findOne({ email: username }).exec();
        if (!user) {
          console.log("no user");
          return done(
            null,
            false,
            req.flash("message", "Login Failed: Email not registered")
          );
        }
        //check password to authenticate user
        const passwordOK = await user.comparePassword(password);
        if (!passwordOK) {
          console.log("wrong psw");
          return done(
            null,
            false,
            req.flash("message", "Login Failed: Wrong Password")
          );
        }
        //successfully logged in
        console.log("login worked!");
        return done(null, user), req.flash("message", "Successfully Logged In");
      } catch (err) {
        return done(err);
      }
    }
  )
);
//passport saves user info in req.user
passport.serializeUser((user, done) => {
  console.log("serialize!");
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("deserialize");
    const user = await UserModel.findById(id).exec();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: (req, res, next) => {
    res.locals.user = req.user;
    return next();
  },
};
