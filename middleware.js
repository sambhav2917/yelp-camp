const { campgroundSchemajoi,reviewSchemajoi } = require('./schema') //importing joi schema 
const ExpressError = require('./utils/ExpressError') // importing our own define error template
const Campground = require('./models/campground');// importing product.js
const Review= require('./models/review');  //importing review model

module.exports.isLoggedin =(req,res,next)=>{
    //console.log('requser',req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;  // store the url the user current is in 
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {  // function to store  req.session.returnTo as passport delete in after login so we store in local 
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}



module.exports.validateCampground = (req, res, next) => {       // middleware function for joi validation for campground
    const { error } = campgroundSchemajoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.isauthor = async(req,res,next)=>{   //middle ware to check if author is authorised to update delte or edit campground
    const { id } = req.params;
   const campgrounds=await Campground.findById(id);
   if(!campgrounds.author.equals(req.user.id)){
       req.flash('error','You do not have to access this')
       return res.redirect(`/campgrounds/${id}`)
   }
   next()
}


module.exports.validateReview = (req, res, next) => {              // middleware function for joi validation for review 
    const { error } = reviewSchemajoi.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    }
    else {
      next()
    }
  
}


module.exports.isReviewauthor = async(req,res,next)=>{   //middle ware to check if author is authorised to update delte or edit campground
    const { id, reviewID} = req.params;
    const review=await Review.findById(reviewID)
   if(!review.author.equals(req.user.id)){
       req.flash('error','You do not have to access this')
       return res.redirect(`/campgrounds/${id}`)
   }
   next()
}