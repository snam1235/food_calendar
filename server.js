const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('flash');
const popup = require('node-popup');
const session = require('express-session');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
 passport = require('passport')
const UserModel = require("./models/user.js").User;
const foodModel = require("./models/user.js").foodInfo;
const dateModel = require("./models/user.js").dateInfo;
const db = require('./lib/db');
const auth = require('./lib/auth');
const register = require('./routes/users');
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
app.use(flash());
//passport
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

function redirect(req,res,next){

  if(req.user) return res.redirect('/home');
  return next()
}


//all static files 

router.get('/',redirect,function(req,res,next){
  
    return res.render("index",{message:"success"})
  
})
  


/*
router.get('/',function(req,res){
  
   console.log("got here")
   delete req.session.error
   return res.json({message:"must login"})
 
});
*/
router.get('/calories',function(req,res){
  
  res.render("calories")
});
router.get('/signup',redirect,function(req,res){
  res.render("signup")
});
router.get('/home',function(req,res){
  res.render("home")
  
});
router.get('/history', async function(req,res){
 
  if(!req.user){
    
    res.render("index",{message:"Please login to check your history"})
    
  }
  else{
    return  res.render("history")
  }
});

router.get('/calories-user',function(req,res){
  
  res.render("calories-user")
});

router.get('/login', function(req, res) {
  res.render("login")
});

router.get('/logout', function(req, res) {
 req.logout();
 return res.redirect('/');
});



router.post('/login',(req,res,next)=>{
 
next()
}, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/account', (req, res, next) => {
  if (req.user) 
  {console.log(req.user)
  return next();}
  return res.status(401).end();
}, (req, res) => res.render("account"));

router.get('/calories.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/script/calories.js'));
});
router.get('/index.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/script/index.js'));
});

router.get('/index.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/script/signup.js'));
});

router.get('/history.js',async function(req,res,next){
  res.sendFile(path.join(__dirname+'/public/script/history.js'));
  
 
});
router.get('/web.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/script/web.js'));
});





//add the router

router.post('/signup', async (req, res, next) => {

  try {
    if(req.body.psw == req.body.psw){
    
    }
    const user = new UserModel({
      email: req.body.email,
   
      password: req.body.psw,

     
    });
    
    const savedUser = await user.save();
    
    if (savedUser){

    req.session.id = req.body.email

     return res.redirect('/');
    }
    return next(new Error('Failed to save user for unknown reasons'));
  } catch (err) {
    return next(err);
  }
});



router.post('/history',  (req, res,next ) => {
   
  
    const date =dateModel.findOne({email:req.user.email , date:req.body.Date}).populate('breakfast')
    .populate('lunch')
    .populate('dinner')
    .exec(function(error, days) {
        if(error){
        return res.status(401).end();
        }
        else{
         
          if(days!=null){
            console.log("itsgood")
            if(req.body.Meal=="breakfast"){
       return res.json({ message: days.breakfast })
            }
            else if(req.body.Meal=="lunch"){
              return res.json({ message: days.lunch })
                   }
                   else{
                    return res.json({ message: days.dinner })
                   }
          }
          else{
            console.log("its bad")
         return res.json({ message: "fail"})
         
          }

        }
      })

      
  });


router.post('/calories-user', async (req, res, next) => {
    console.log("dododododo")
  let ids = new Array();
 
  
  let day;
  console.log(req.body.day)
 if(req.body.day==""){
  return res.json({ message: "fail"})
 
 }
  for(let i = 0;i <req.body.food.length;i++){

    try{
     let food = new foodModel({
      name: req.body.food[i],
      mass: req.body.mass[i],
      unit: req.body.unit[i],
      carb: req.body.carb[i],
      fat: req.body.fat[i],
      protein: req.body.protein[i],
      calories: req.body.calories[i],
     });
     ids[i] = food._id
     let savedFood = await food.save()
    }
    
catch(err){
  console.log(err)
  return next(new Error('Failed to save user for unknown reasons'));
}
  
  }



  
  const date =await dateModel.findOne({email:req.user.email , date:req.body.day}).populate('breakfast')
  .populate('lunch')
  .populate('dinner')
  .exec(function(error, days) {
      if(error){
     return   console.log(error)
      }
      


      if(days == null)
  {
    if(req.body.meal==="breakfast") {
      console.log("is breakfastss")
     day = new dateModel({
      email:req.user.email,
      date:req.body.day,
      breakfast: ids,
      lunch: undefined,
      dinner: undefined

    })

    day.save(function(error) {
      if (!error) {
          dateModel.find({})
              .populate('breakfast')
              .populate('lunch')
              .populate('dinner')
              .exec(function(error, days) {
                  console.log(JSON.stringify(days, null, "\t"))
                  return res.json(days);
              })
      }
    
  });
  }

  else if(req.body.meal==="lunch"){
    console.log("is lunch")
    day = new dateModel({
      email:req.user.email,
      date:req.body.day,
      breakfast: undefined,
      lunch: ids,
      dinner: undefined

    })
    day.save(function(error) {
      if (!error) {
          dateModel.find({})
              .populate('breakfast')
              .populate('lunch')
              .populate('dinner')
              .exec(function(error, days) {
                  console.log(JSON.stringify(days, null, "\t"))
                  return res.json(days);
              })
      }
    
  });
  }
    else {
      console.log("is dinner")
      day = new dateModel({
        email:req.user.email,
        date:req.body.day,
        breakfast: undefined,
        lunch: undefined,
        dinner: ids
  
      })
      day.save(function(error) {
        if (!error) {
            dateModel.find({})
                .populate('breakfast')
                .populate('lunch')
                .populate('dinner')
                .exec(function(error, days) {
                    console.log(JSON.stringify(days, null, "\t"))
                    return res.json(days);
                })
        }
      
    });

    }

  
  }
  else{
    if(req.body.meal==="breakfast"){
      dateModel.findOneAndUpdate({email:req.user.email , date:req.body.day},{$set:{breakfast: ids}}, {new: true})
      .populate('breakfast')
                .populate('lunch')
                .populate('dinner')
                .exec(function(error, days) {
                    console.log(JSON.stringify(days, null, "\t"))
                    return res.json(days);
                })

    }
    else if(req.body.meal==="lunch"){
      dateModel.findOneAndUpdate({email:req.user.email , date:req.body.day},{$set:{lunch: ids}}, {new: true})
      .populate('breakfast')
                .populate('lunch')
                .populate('dinner')
                .exec(function(error, days) {
                    console.log(JSON.stringify(days, null, "\t"))
                    return res.json(days);
                })

    }
    else{
      dateModel.findOneAndUpdate({email:req.user.email , date:req.body.day},{$set:{dinner: ids}}, {new: true})
      .populate('breakfast')
                .populate('lunch')
                .populate('dinner')
                .exec(function(error, days) {
                    console.log(JSON.stringify(days, null, "\t"))
                    return res.json(days);
                })


    }
    
  }


  })

 
  
  
 
 

});



app.use('/', router);

app.listen(port, () =>
console.log(`running on port ${port}`)
);