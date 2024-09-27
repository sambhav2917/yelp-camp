const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');// importing product.js
const catchAsync = require('../utils/catchAsync')  // importing asyn error handling function
const {isLoggedin,validateCampground,isauthor} = require('../middleware')  // importing our middleware

const {storage} = require('../cloudinary')
const multer  = require('multer')            //for uploading file 
const upload = multer({ storage })   //setting destination where file will store
const { cloudinary } = require("../cloudinary");  // for deletion in cloudinary


router.get('/', catchAsync(async (req, res) => {    //catchAsync is used to catch error to send it to error middleware for async function
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))


router.get('/new',isLoggedin ,(req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id', catchAsync(async (req, res) => {    // route for showing a particular campground data  
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author'); // using populate to get review data instead of object id in review field
    
    if(!campground){
        req.flash('error','Campground Not Found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground });
}))


router.post('/',isLoggedin ,upload.array('image'),validateCampground,catchAsync(async (req, res, next) => {   // new campground route for after submiting  form  data of new campground   
    
    const campground = new Campground(req.body.campground)
    campground.author = req.user.id;
    campground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    await campground.save();
    console.log(campground)
    req.flash('success','Success made a new campground');
    res.redirect(`/campgrounds/${campground.id}`)

})) 



router.get('/:id/edit',isLoggedin,isauthor,catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Campground Not Found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id',isLoggedin,isauthor,upload.array('image'),validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    const img=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...img)
    await campground.save();
    if(req.body.deleteImages){  //checking if there is images for deletetion
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    console.log(campground)
    req.flash('success','Success updated campground');
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:id',isLoggedin,isauthor ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, { new: true })
    req.flash('success','Success deleted campground');
    res.redirect(`/campgrounds`)
}))



module.exports = router;