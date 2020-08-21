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
        //find user with the entered email
        const user = await UserModel.findOne({ email: username }).exec();
        if (!user) {
          return done(null, false, { message: "Email is not registered" });
        }
        //check password to authenticate user
        const passwordOK = await user.comparePassword(password);

        if (!passwordOK) {
          return done(null, false, { message: "Wrong Password" });
        }
        //successfully logged in

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
//passport saves user info in req.user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
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
  }
};
