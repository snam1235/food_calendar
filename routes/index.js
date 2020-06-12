const express = require('express');
const session = require('express-session');
const router = express.Router();
const calories = require("./calories");
const calories_user = require("./calories-user")
const history = require("./history")
const home = require("./home")
const login = require("./login")
const logout = require("./logout")
const signup = require("./signup")




router.get('/',function(req,res,next){
  m = req.flash('loginMessage')[0]
  s = req.flash("signupMessage")[0]
   if(req.session.login!=false){
   return res.render("index",{message:"success",logins:m,signup:s})
   }
   else{
     req.session.login = true
     return res.render("index",{message:"failure",logins:m,signup:s})
   }
})


router.use("/calories",calories)
router.use("/calories-user",calories_user)
router.use("/history",history)
router.use("/home",home)
router.use("/login",login)
router.use("/logout",logout)
router.use("/signup",signup)

module.exports = router;









