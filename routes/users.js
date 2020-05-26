const express = require('express');
const passport = require('passport');
const UserModel = require('../models/user');



const router = express.Router();


module.exports = () => {

    router.post('/signup', async (req, res, next) => {
        try {
          const user = new UserModel({
            email: req.body.email,
         
            password: req.body.psw
          });
          const savedUser = await user.save();
    
          if (savedUser) return res.redirect('/calories');
          return next(new Error('Failed to save user for unknown reasons'));
        } catch (err) {
          return next(err);
        }
      });

      return router;

}