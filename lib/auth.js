const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user').User;


passport.use(new LocalStrategy({ usernameField: 'email',passReqToCallback: true  }, async (req,username, password, done) => {
  
    try {
      console.log('hi');
      const user = await UserModel.findOne({ email: username }).exec();
      if (!user) {
        console.log("wrong email")
        return done(null, false,req.flash('loginMessage','Login Failed: Wrong Email'));
      }
    
      const passwordOK = await user.comparePassword(password);
      if (!passwordOK) {
        console.log("wrong psw")
        return done(null, false,req.flash('loginMessage','Login Failed: Wrong Password'));
      }
      
      console.log('logged in!');
      return done(null, user);
    } catch (err) {
      return done(err);
    }
    
  }));
  
  passport.serializeUser((user, done) => done(null, user._id));

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
  },
};