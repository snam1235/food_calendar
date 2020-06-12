const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user').User;


passport.use(new LocalStrategy({ usernameField: 'email',passReqToCallback: true  }, async (req,username, password, done) => {
    
    try {
    
     
      const user = await UserModel.findOne({ email: username }).exec();
      if (!user) {
        return done(null, false,req.flash('message','Login Failed: Email not registered'));
      }
    
      const passwordOK = await user.comparePassword(password);
      if (!passwordOK) {
        
        return done(null, false,req.flash('message','Login Failed: Wrong Password'));
      }
      
      
      return done(null, user),req.flash("message","Successfully Logged In");
    }
     catch (err) {
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