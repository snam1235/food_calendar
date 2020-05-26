
const mongoose = require('mongoose')
relationship = require("mongoose-relationship");
const bcrypt = require('bcryptjs')

const emailValidator = require('email-validator');

var Schema = mongoose.Schema;

const SALT_ROUNDS = 12;

 
 var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
    validate: {
      validator: emailValidator.validate,
      message: props => `${props.value} is not a valid email address!`,
    },
  },
    
     password: String

   

   
 });

 userSchema.pre('save', async function preSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

 userSchema.methods.comparePassword = async function (candidate){

  return bcrypt.compare(candidate,this.password);
}




 var foodSchema =  new Schema({
  name: String,
  mass: String,
  unit: String,
  carb: String,
  fat: String,
  protein: String,
  calories: String
  })


  var foodInfo = mongoose.model("foodInfo",foodSchema)
 

  var dateSchema =  new Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: { unique: true },
      validate: {
        validator: emailValidator.validate,
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    date: String,
    breakfast: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodInfo'
    }],
    lunch: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodInfo'
    }],
    dinner: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodInfo'
    }]
    
    
    })

    var dateInfo = mongoose.model("date",dateSchema)
 var User = mongoose.model("User",userSchema)


 module.exports = {User,foodInfo,dateInfo}

  
