const Joi = require('joi');  //joi help in adding a layer in moongose schema of security 
const review = require('./models/review');
const campgroundSchemajoi = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    /* image: Joi.string().required(), */
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array()
}).required();


const reviewSchemajoi = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})

module.exports = {
  campgroundSchemajoi,
  reviewSchemajoi
};