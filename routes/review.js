const express = require('express');
const router = express.Router({mergeParams:true});

const Campground = require('../models/campground');// importing product.js
const catchAsync = require('../utils/catchAsync')  // importing asyn error handling function
const ExpressError = require('../utils/ExpressError') // importing our own define error template
const{validateReview,isLoggedin,isReviewauthor} = require('../middleware')

const Review = require('../models/review');



router.post('/', isLoggedin ,validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created  a new review');
    res.redirect(`/campgrounds/${campground.id}`);
  }))
  
router.delete('/:reviewID', isLoggedin,isReviewauthor,catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Deleted a review ');
    res.redirect(`/campgrounds/${id}`)
  }))

  module.exports=router