const express = require('express');
const router = express.Router();
const UserModel = require("../../models/user").User;


  router.get('/',function(req,res){
    res.render("signup",{message:"none"})
  });


  router.post('/', async (req, res) => {
  console.log("hi")
    try {

      const preexist = await UserModel.findOne({email:req.body.email});

      if(preexist){
       
        return res.render("signup",{message:"User with the email already exists."})
       
      }
        else{
          const user = new UserModel({
            email: req.body.email,
         
            password: req.body.psw
           
          });
          const savedUser = await user.save();
          
          if (savedUser){
      
            req.session.id = req.body.email
            req.flash("message","Successfully signed up!")
           return res.redirect("/")
          }
          else{
            return res.render("signup",{message:"Failed to save user for unknown reasons"})
         
          }
        }
        
      }
    catch (err) {
      return res.render("signup",{message:err})
     // return res.json({message:err})
    }
  });
  

  
  module.exports = router;