if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}



const express = require('express');
const app = express();
const path = require('path');//for changing current working directory
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')   //for adding boiler plate to our code
const Joi = require('joi');  //joi help in adding a layer in moongose schema of security 
const { title } = require('process');
const ExpressError = require('./utils/ExpressError') // importing our own define error template
const session= require('express-session')  //for keep loging in to user to our website
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User = require('./models/user')

const campgroundsroutes = require('./routes/campground')//importing campground routes
const reviewroute = require('./routes/review')//importing review routes
const userroute=require('./routes/user') //importing user route
const dbURL=process.env.DB_URL|| 'mongodb://127.0.0.1:27017/yelp-camp'
/* 
process.env.DB_URL
 */

const MongoStore = require('connect-mongo');



/* mongodb://127.0.0.1:27017/yelp-camp */
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
  console.log("connected sucessfully")
}


app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));//for changing working directory that set default so that we can acess ouside the folder

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static( path.join(__dirname, 'public')))   // to include javascript of public directory



const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});

store.on("error",(e)=>{
  console.log("Session store error",e)
})

const sessionConfig ={
  store,
  secret : 'thisissecret',
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    HttpOnly:true
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())       //used for configuring how Passport serializes user information into the session      
passport.deserializeUser(User.deserializeUser()); //is used to configure how Passport deserializes user data stored in the session back into a complete user object.



app.use((req,res,next)=>{             //midleware for flash
  //we can access the variable all over our project
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser=req.user;  //req.user give by passport and use for session having username email and its id
  next();                     
});

app.use("/campgrounds", campgroundsroutes);       //importing routes
app.use('/campgrounds/:id/reviews',reviewroute);
app.use('/',userroute)





app.get('/', (req, res) => {
  res.render('home')
})




app.all('*', (req, res, next) => {   //handing express error 
  next(new ExpressError('Page Not Found ', 404))
})

//for error handling
app.use((err, req, res, next) => {
  //console.log(err.message);
  const { statusCode = 500, message = 'someting went wrong' } = err;
  res.status(statusCode).render('error.ejs', { err });
})

app.listen(3000, () => {
  console.log('listening to port 3000')
})